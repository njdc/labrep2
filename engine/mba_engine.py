"""
NexusCart — MBA Engine Orchestrator
=====================================
Wires together FP-Growth, self-learning, and recommendations
for a single (dataset, iteration) run.
"""

from engine.fp_growth    import fp_growth, generate_rules
from engine.self_learner import AutoThresholdTuner, RuleStabilityTracker, DriftDetector
from engine.recommender  import build_recommendations
from engine.data_generator import compute_stats


class MBAEngine:
    """
    Orchestrates one full MBA pipeline run.

    Usage
    -----
    engine = MBAEngine(products)
    result = engine.run(transactions, iteration=1)
    """

    def __init__(self, products):
        self.products          = products
        self.tuner             = AutoThresholdTuner()
        self.stability_tracker = RuleStabilityTracker()
        self.drift_detector    = DriftDetector()

    def run(self, transactions, iteration):
        """
        Execute the full pipeline for a given transaction set.

        Returns a dict containing all outputs needed by the frontend.
        """
        n = len(transactions)

        # ── Step 1: Auto-tune thresholds ───────────────────────────────
        # Each iteration starts from a slightly different search range to
        # reflect growing dataset confidence (more data → lower thresholds viable)
        sup_lo = max(0.005, 0.035 - iteration * 0.005)
        sup_hi = 0.30
        self.tuner.sup_range  = (sup_lo, sup_hi)
        self.tuner.conf_range = (0.30, 0.90)

        def mine_fn(min_sup, min_conf):
            itemsets = fp_growth(transactions, min_sup)
            return generate_rules(itemsets, n, min_conf)

        min_sup, min_conf, rules, th_history, tune_reason = self.tuner.tune(mine_fn)

        # ── Step 2: Mine final frequent itemsets ───────────────────────
        frequent_itemsets = fp_growth(transactions, min_sup)

        # Serialize itemsets for JSON (frozensets → sorted lists)
        itemsets_list = [
            {"items": sorted(fs), "count": cnt, "support": round(cnt / n, 6)}
            for fs, cnt in sorted(frequent_itemsets.items(),
                                  key=lambda x: -x[1])
        ]

        # ── Step 3: Stability tracking ─────────────────────────────────
        self.stability_tracker.update(rules, iteration)
        rules = self.stability_tracker.annotate(rules)
        stab_report = self.stability_tracker.report()

        # ── Step 4: Drift detection ────────────────────────────────────
        rules, drift_report = self.drift_detector.detect_and_annotate(rules, iteration)

        # ── Step 5: Build recommendations ─────────────────────────────
        recs = build_recommendations(
            self.products, rules, frequent_itemsets, n
        )

        # ── Step 6: Dataset statistics ─────────────────────────────────
        stats = compute_stats(transactions, self.products)
        stats["frequent_itemsets"] = len(frequent_itemsets)
        stats["rules_count"]       = len(rules)

        # ── Step 7: Assemble output ────────────────────────────────────
        return {
            "iteration": iteration,
            "config": {
                "algorithm":           "FP-Growth",
                "min_support":         min_sup,
                "min_confidence":      min_conf,
                "auto_tuned":          True,
                "tuning_steps":        len(th_history),
                "tuning_reason":       tune_reason,
                "threshold_history":   th_history,
            },
            "stats":               stats,
            "frequent_itemsets":   itemsets_list[:40],   # top 40 for UI
            "rules":               _sort_rules(rules),
            "stability_report":    stab_report,
            "drift_report":        drift_report,
            **recs,
        }


def _sort_rules(rules):
    """Sort rules: first by composite_score desc, then lift desc."""
    return sorted(rules, key=lambda r: -(r.get("composite_score", 0) * 10 + r["lift"]))
