"""
NexusCart — Self-Learning & Auto-Tuning Mechanisms
====================================================
Implements three intelligent mechanisms that make the MBA engine
"self-learning" beyond manual threshold entry:

1. AutoThresholdTuner
   Binary-search for the (min_support, min_confidence) pair that
   produces a target number of high-quality rules.

2. RuleStabilityTracker
   Tracks which rules appear across iterations and assigns stability
   labels (Stable / Emerging / New).

3. DriftDetector
   Flags rules whose support changed significantly between iterations,
   indicating an evolving buying pattern.
"""

from collections import defaultdict


# ---------------------------------------------------------------------------
# 1. Auto-Threshold Tuner
# ---------------------------------------------------------------------------

class AutoThresholdTuner:
    """
    Automatically selects min_support and min_confidence so that the engine
    produces between TARGET_MIN and TARGET_MAX high-quality rules.

    Quality score for a rule = 0.50 × norm_lift
                              + 0.30 × confidence
                              + 0.20 × norm_support

    Strategy: binary-search min_support; adjust min_confidence heuristically.
    """

    TARGET_MIN      = 8     # minimum desired quality rules
    TARGET_MAX      = 25    # maximum desired quality rules
    MIN_QUALITY     = 0.35  # quality threshold for a rule to count

    LIFT_NORM_CAP   = 6.0   # lifts above this are treated as 1.0
    SUP_NORM_CAP    = 0.25  # support above this are treated as 1.0

    def __init__(self,
                 sup_range  = (0.01, 0.30),
                 conf_range = (0.30, 0.90),
                 max_steps  = 14):
        self.sup_range  = sup_range
        self.conf_range = conf_range
        self.max_steps  = max_steps
        self.history    = []   # tuning log for UI display

    # ------------------------------------------------------------------

    def tune(self, mine_fn):
        """
        Find optimal thresholds.

        Parameters
        ----------
        mine_fn : callable(min_sup, min_conf) -> list[dict]
            Function that runs the MBA engine and returns a list of rules.

        Returns
        -------
        (min_sup, min_conf, rules, history)
        """
        sup_lo, sup_hi  = self.sup_range
        best_sup        = (sup_lo + sup_hi) / 2
        best_conf       = sum(self.conf_range) / 2

        best_rules  = []
        self.history = []

        for step in range(self.max_steps):
            rules = mine_fn(best_sup, best_conf)
            n_quality = sum(1 for r in rules if self._quality(r) >= self.MIN_QUALITY)

            self.history.append({
                "step":          step + 1,
                "min_sup":       round(best_sup,  5),
                "min_conf":      round(best_conf, 5),
                "total_rules":   len(rules),
                "quality_rules": n_quality,
            })

            best_rules = rules

            if self.TARGET_MIN <= n_quality <= self.TARGET_MAX:
                # Sweet spot reached
                break
            elif n_quality < self.TARGET_MIN:
                # Too few — lower support threshold
                sup_hi  = best_sup
                best_sup  = (sup_lo + sup_hi) / 2
                best_conf = max(self.conf_range[0], best_conf - 0.04)
            else:
                # Too many — raise support threshold
                sup_lo  = best_sup
                best_sup  = (sup_lo + sup_hi) / 2
                best_conf = min(self.conf_range[1], best_conf + 0.04)

        tuning_reason = self._summarise(best_rules)
        return round(best_sup, 5), round(best_conf, 5), best_rules, self.history, tuning_reason

    # ------------------------------------------------------------------

    def _quality(self, rule):
        lift_score = min(rule["lift"] / self.LIFT_NORM_CAP, 1.0)
        sup_score  = min(rule["support"] / self.SUP_NORM_CAP, 1.0)
        return (0.50 * lift_score +
                0.30 * rule["confidence"] +
                0.20 * sup_score)

    def composite_score(self, rule):
        """Public accessor — returns composite quality score (0–1)."""
        return round(self._quality(rule), 4)

    def _summarise(self, rules):
        n_quality = sum(1 for r in rules if self._quality(r) >= self.MIN_QUALITY)
        steps = len(self.history)
        return (
            f"Auto-tuning converged in {steps} steps; "
            f"{n_quality} rules meet quality threshold (score ≥ {self.MIN_QUALITY})."
        )


# ---------------------------------------------------------------------------
# 2. Rule Stability Tracker
# ---------------------------------------------------------------------------

class RuleStabilityTracker:
    """
    Monitors whether a rule appears consistently across iterations.

    Stability labels
    ----------------
    Stable   — rule appeared in ≥ 66 % of iterations so far
    Emerging — rule appeared in 33–65 %
    New      — rule appeared only in the current iteration
    """

    def __init__(self):
        # rule_key -> list of iterations in which it appeared
        self._seen = defaultdict(list)
        self._current_iteration = 0

    def update(self, rules, iteration):
        """Register this iteration's rules."""
        self._current_iteration = iteration
        for rule in rules:
            key = self._key(rule)
            if iteration not in self._seen[key]:
                self._seen[key].append(iteration)

    def annotate(self, rules):
        """
        Add 'stability' and 'stability_score' fields to each rule dict.
        Modifies rules in-place and returns them.

        Labelling logic:
          Iteration 1 → all rules are "New"  (no history to compare against)
          Iteration 2+ → "Stable"   if seen in ≥ 2 distinct iterations AND score ≥ 0.66
                         "Emerging" if score 0.33–0.65
                         "New"      otherwise
        """
        total = self._current_iteration or 1
        for rule in rules:
            key       = self._key(rule)
            seen_iters = self._seen.get(key, [])
            seen_count = len(seen_iters)

            # In the very first iteration nothing is "stable" — we have no prior
            if total == 1:
                label = "New"
                score = 0.0
            else:
                score = seen_count / total
                if score >= 0.66 and seen_count >= 2:
                    label = "Stable"
                elif score >= 0.33 or seen_count >= 2:
                    label = "Emerging"
                else:
                    label = "New"

            rule["stability"]       = label
            rule["stability_score"] = round(score, 4)
        return rules

    def report(self):
        """Return counts of rules per stability label for the dashboard."""
        total = self._current_iteration or 1
        stable   = 0
        emerging = 0
        new_     = 0
        for seen in self._seen.values():
            sc = len(seen) / total
            if total == 1:
                new_ += 1
            elif sc >= 0.66 and len(seen) >= 2:
                stable += 1
            elif sc >= 0.33 or len(seen) >= 2:
                emerging += 1
            else:
                new_ += 1
        return {"stable": stable, "emerging": emerging, "new": new_}

    @staticmethod
    def _key(rule):
        return (tuple(sorted(rule["antecedents"])),
                tuple(sorted(rule["consequents"])))


# ---------------------------------------------------------------------------
# 3. Drift Detector
# ---------------------------------------------------------------------------

class DriftDetector:
    """
    Detects statistically meaningful shifts in rule support between iterations.

    Drift levels
    ------------
    Major Drift — relative change ≥ 20 %
    Drift       — relative change ≥  8 %
    Stable      — change <  8 %

    The detector also identifies *trending* (support rising) vs
    *declining* (support falling) patterns so the recommender can
    deprioritise fading associations.
    """

    DRIFT_THRESHOLD       = 0.08   #  8 % relative change — meaningful in e-commerce
    MAJOR_DRIFT_THRESHOLD = 0.20   # 20 % relative change — significant pattern shift

    def __init__(self):
        self._prev = {}   # rule_key -> {"support": ..., "iteration": ...}

    def detect_and_annotate(self, rules, iteration):
        """
        Annotate each rule with drift information.
        Also returns a drift report listing all drifting rules.
        """
        drift_report = []

        for rule in rules:
            key  = self._key(rule)
            curr = rule["support"]

            if key in self._prev:
                prev      = self._prev[key]["support"]
                rel_change = abs(curr - prev) / prev if prev > 0 else 0
                direction  = "rising" if curr > prev else "falling"

                if rel_change >= self.MAJOR_DRIFT_THRESHOLD:
                    level = "Major Drift"
                elif rel_change >= self.DRIFT_THRESHOLD:
                    level = "Drift"
                else:
                    level = None

                drift_entry = {
                    "level":          level,
                    "direction":      direction,
                    "rel_change":     round(rel_change, 4),
                    "prev_support":   round(prev, 6),
                    "curr_support":   round(curr, 6),
                    "prev_iteration": self._prev[key]["iteration"],
                }
                rule["drift"] = drift_entry

                if level:
                    drift_report.append({
                        "rule_ant": rule["antecedents"],
                        "rule_con": rule["consequents"],
                        **drift_entry,
                    })
            else:
                rule["drift"] = None   # first time we see this rule

        # Update memory for next iteration
        for rule in rules:
            self._prev[self._key(rule)] = {
                "support":   rule["support"],
                "iteration": iteration,
            }

        return rules, drift_report

    @staticmethod
    def _key(rule):
        return (tuple(sorted(rule["antecedents"])),
                tuple(sorted(rule["consequents"])))
