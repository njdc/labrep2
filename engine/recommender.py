"""
NexusCart — Business Recommendation Engine
===========================================
Converts raw association rules + frequent itemsets into actionable
business outputs:

  • Homepage ranking      — what the customer sees first
  • Frequently-bought-together widget
  • Cross-sell map        — per-product suggestions when added to cart
  • Bundle generator      — discount packages with pricing
  • Promo generator       — dynamic promotional copy
  • Business insights     — shelf placement, category synergy, etc.
"""

from collections import defaultdict
from itertools import combinations


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _rule_action(rule):
    """Classify a rule into a business action label."""
    if rule["lift"] >= 3.5 and rule["confidence"] >= 0.65:
        return "Bundle Deal"
    if rule["lift"] >= 2.5 and rule["confidence"] >= 0.55:
        return "Cross-Sell"
    if rule["lift"] >= 1.5:
        return "Soft Suggest"
    return "Monitor"


# ---------------------------------------------------------------------------
# Homepage Ranking
# ---------------------------------------------------------------------------

def rank_homepage(products, rules, frequent_itemsets, n_transactions):
    """
    Score every product and return a ranked list.

    Scoring formula (per product P):
      score = base
            + Σ (lift × support × 12)  for every rule where P is a consequent
            + Σ (support × 6)          for every rule where P is an antecedent
            + (item_support × 4)       individual popularity bonus

    Products that appear as strong *consequents* rank highest because
    they are "pulled" by popular anchors — exactly the items we want to
    surface on the homepage.
    """
    item_support = defaultdict(float)
    for fs, count in frequent_itemsets.items():
        if len(fs) == 1:
            item_support[next(iter(fs))] = count / n_transactions

    scores = {}
    for pid in products:
        score = 1.0
        score += item_support.get(pid, 0) * 4

        for rule in rules:
            if pid in rule["consequents"]:
                score += rule["lift"] * rule["support"] * 12
            if pid in rule["antecedents"]:
                score += rule["support"] * 6

        scores[pid] = round(score, 4)

    ranked = sorted(scores.items(), key=lambda x: -x[1])
    return [{"product_id": pid, "score": sc, "rank": i + 1}
            for i, (pid, sc) in enumerate(ranked)]


# ---------------------------------------------------------------------------
# Frequently Bought Together
# ---------------------------------------------------------------------------

def frequently_bought_together(frequent_itemsets, n_transactions, top_k=10):
    """
    Return top-k 2-item and 3-item sets ranked by support × lift_proxy.

    We use support as the primary signal for FBT widgets because it
    measures *actual co-purchase frequency*, which directly translates
    to "customers who bought X also bought Y" messaging.
    """
    pairs = [
        (fs, count)
        for fs, count in frequent_itemsets.items()
        if 2 <= len(fs) <= 3
    ]
    pairs.sort(key=lambda x: -x[1])

    result = []
    for fs, count in pairs[:top_k]:
        result.append({
            "items":   sorted(fs),
            "support": round(count / n_transactions, 6),
            "count":   count,
        })
    return result


# ---------------------------------------------------------------------------
# Cross-Sell Map
# ---------------------------------------------------------------------------

def build_cross_sell_map(products, rules, top_per_item=5):
    """
    For each product, return a ranked list of cross-sell targets.

    Ranking metric: confidence × lift  (how strongly and how surprisingly
    the target co-occurs with the trigger).

    This map powers the cart sidebar: when a user adds product X, we
    look up cross_sell[X] and display the top recommendations.
    """
    cross_sell = defaultdict(list)

    for rule in rules:
        score = rule["confidence"] * rule["lift"]
        for ant_id in rule["antecedents"]:
            for con_id in rule["consequents"]:
                cross_sell[ant_id].append({
                    "product_id":  con_id,
                    "confidence":  rule["confidence"],
                    "lift":        rule["lift"],
                    "score":       round(score, 4),
                    "reason":      (
                        f"{round(rule['confidence']*100,0):.0f}% of customers who buy "
                        f"{products[ant_id]['name']} also buy "
                        f"{products[con_id]['name']}"
                    ),
                })

    # De-duplicate and sort by score
    result = {}
    for pid in products:
        seen = {}
        for rec in cross_sell.get(pid, []):
            cid = rec["product_id"]
            if cid not in seen or rec["score"] > seen[cid]["score"]:
                seen[cid] = rec
        result[pid] = sorted(seen.values(),
                              key=lambda x: -x["score"])[:top_per_item]

    return result


# ---------------------------------------------------------------------------
# Bundle Generator
# ---------------------------------------------------------------------------

def generate_bundles(products, frequent_itemsets, n_transactions, top_k=8):
    """
    Create bundle deals from high-support multi-item sets.

    Discount scale:
      2-item bundle → 10 %
      3-item bundle → 15 %
      4+ item bundle → 20 %
    """
    candidates = [
        (fs, count / n_transactions)
        for fs, count in frequent_itemsets.items()
        if 2 <= len(fs) <= 4
        and all(pid in products for pid in fs)
    ]
    candidates.sort(key=lambda x: -x[1])

    bundles = []
    for fs, support in candidates[:top_k]:
        items = sorted(fs)
        total = sum(products[pid]["price"] for pid in items)
        disc  = 0.10 if len(items) == 2 else (0.15 if len(items) == 3 else 0.20)
        bundles.append({
            "items":          items,
            "item_names":     [products[pid]["name"] for pid in items],
            "support":        round(support, 6),
            "original_price": round(total, 2),
            "bundle_price":   round(total * (1 - disc), 2),
            "discount_pct":   int(disc * 100),
            "savings":        round(total * disc, 2),
        })
    return bundles


# ---------------------------------------------------------------------------
# Promo Generator
# ---------------------------------------------------------------------------

def generate_promos(products, rules, top_k=5):
    """
    Generate promotional copy from the strongest association rules.

    Promo types:
      bundle_discount — buy antecedent, get discount on consequent
      buy2get1        — 3-item rule → buy 2 get 3rd cheaper
      highlight       — surface a trending consequent on homepage
    """
    eligible = sorted(
        [r for r in rules if r["lift"] >= 2.0 and r["confidence"] >= 0.45],
        key=lambda r: -(r["lift"] * r["confidence"])
    )

    promos = []
    for rule in eligible[:top_k]:
        ants = [products[pid]["name"] for pid in rule["antecedents"]
                if pid in products]
        cons = [products[pid]["name"] for pid in rule["consequents"]
                if pid in products]
        if not ants or not cons:
            continue

        if len(rule["antecedents"]) >= 2:
            promo_type = "buy2get1"
            title      = f"Combo Deal: {' + '.join(ants)}"
            desc       = (
                f"Add {' and '.join(ants)} to your cart and get "
                f"{cons[0]} at 25% off!"
            )
            discount   = 25
        else:
            promo_type = "bundle_discount"
            title      = f"{ants[0]} Bundle"
            desc       = (
                f"Buy {ants[0]} and save 20% on {cons[0]}. "
                f"({round(rule['confidence']*100,0):.0f}% of buyers choose this combo)"
            )
            discount   = 20

        promos.append({
            "title":         title,
            "description":   desc,
            "type":          promo_type,
            "discount":      discount,
            "lift":          rule["lift"],
            "confidence":    rule["confidence"],
            "trigger_items": rule["antecedents"],
            "target_items":  rule["consequents"],
        })

    return promos


# ---------------------------------------------------------------------------
# Business Insights
# ---------------------------------------------------------------------------

def generate_insights(products, rules, frequent_itemsets, n_transactions):
    """
    Produce human-readable business insights from the mined patterns.

    Categories:
      shelf_placement   — which items should be co-located in the store
      anchor_product    — most connected item (hub in the rule graph)
      category_synergy  — categories that frequently co-purchase
      low_lift_watch    — rules with low lift to reconsider promoting
    """
    insights = []

    if not rules:
        return insights

    # --- Anchor product (appears in most rules) ---
    connectivity = defaultdict(int)
    for rule in rules:
        for pid in rule["antecedents"] + rule["consequents"]:
            connectivity[pid] += 1

    if connectivity:
        anchor_id = max(connectivity, key=lambda x: connectivity[x])
        anchor    = products.get(anchor_id, {})
        insights.append({
            "type":        "anchor_product",
            "icon":        "ri-anchor-line",
            "title":       f"Anchor Product: {anchor.get('name', anchor_id)}",
            "description": (
                f"{anchor.get('name', anchor_id)} appears in "
                f"{connectivity[anchor_id]} association rules — "
                "feature it prominently on the homepage and in paid ads "
                "to maximise cross-sell chain reactions."
            ),
            "items": [anchor_id],
        })

    # --- Top shelf-placement pairs ---
    top_pair = None
    top_sup  = 0
    for fs, count in frequent_itemsets.items():
        if len(fs) == 2:
            sup = count / n_transactions
            if sup > top_sup:
                top_sup  = sup
                top_pair = sorted(fs)

    if top_pair:
        names = [products[pid]["name"] for pid in top_pair if pid in products]
        insights.append({
            "type":        "shelf_placement",
            "icon":        "ri-layout-grid-line",
            "title":       "Top Co-Purchase Pair — Co-locate in Store",
            "description": (
                f"{' and '.join(names)} are bought together "
                f"{round(top_sup*100, 1)}% of the time. "
                "Place them adjacent on the shelf or in the same product "
                "listing cluster to reduce friction."
            ),
            "items": top_pair,
        })

    # --- Category synergy ---
    cat_pairs = defaultdict(int)
    cat_rules = defaultdict(list)
    for rule in rules:
        ants_cats = list({products[pid]["category"]
                         for pid in rule["antecedents"] if pid in products})
        cons_cats = list({products[pid]["category"]
                         for pid in rule["consequents"] if pid in products})
        for ac in ants_cats:
            for cc in cons_cats:
                if ac != cc:
                    pair = tuple(sorted([ac, cc]))
                    cat_pairs[pair] += 1
                    cat_rules[pair].append(rule["lift"])

    if cat_pairs:
        top_cpair = max(cat_pairs, key=lambda x: cat_pairs[x])
        avg_lift  = round(sum(cat_rules[top_cpair]) / len(cat_rules[top_cpair]), 2)
        insights.append({
            "type":        "category_synergy",
            "icon":        "ri-links-line",
            "title":       f"Category Synergy: {top_cpair[0]} ↔ {top_cpair[1]}",
            "description": (
                f"Products in '{top_cpair[0]}' and '{top_cpair[1]}' "
                f"appear together in {cat_pairs[top_cpair]} rules "
                f"(avg lift {avg_lift}×). "
                "Consider cross-category email campaigns and bundled landing pages."
            ),
            "items": [],
        })

    # --- Low-lift warning ---
    low_lift = [r for r in rules if r["lift"] < 1.2]
    if low_lift:
        ex = low_lift[0]
        ant_name = products.get(ex["antecedents"][0], {}).get("name", "?")
        con_name = products.get(ex["consequents"][0], {}).get("name", "?")
        insights.append({
            "type":        "low_lift_watch",
            "icon":        "ri-alert-line",
            "title":       "Low-Lift Rule — Reassess Promotion",
            "description": (
                f"Rule '{ant_name} → {con_name}' has lift "
                f"{ex['lift']:.2f} (near random). "
                "Stop spending ad budget promoting this pairing; "
                "reallocate to higher-lift bundles."
            ),
            "items": ex["antecedents"] + ex["consequents"],
        })

    # --- Top promo opportunity by lift ---
    top_rule = max(rules, key=lambda r: r["lift"])
    ant_name = products.get(top_rule["antecedents"][0], {}).get("name", "?")
    con_name = products.get(top_rule["consequents"][0], {}).get("name", "?")
    insights.append({
        "type":        "promo_opportunity",
        "icon":        "ri-price-tag-3-line",
        "title":       "Highest-Lift Bundle Opportunity",
        "description": (
            f"'{ant_name} → {con_name}' has lift {top_rule['lift']:.2f}× "
            f"and confidence {round(top_rule['confidence']*100,0):.0f}%. "
            "This pair is far more likely than chance — launch a limited-time "
            "bundle discount to capture maximum revenue."
        ),
        "items": top_rule["antecedents"] + top_rule["consequents"],
    })

    return insights


# ---------------------------------------------------------------------------
# Full recommendation pipeline
# ---------------------------------------------------------------------------

def build_recommendations(products, rules, frequent_itemsets, n_transactions):
    """
    Run all recommendation sub-modules and return a unified dict.
    Also injects composite_score and action label into each rule.
    """
    from engine.self_learner import AutoThresholdTuner
    tuner = AutoThresholdTuner()

    # Annotate rules with composite score + action
    for rule in rules:
        rule["composite_score"] = tuner.composite_score(rule)
        rule["action"]          = _rule_action(rule)

    return {
        "homepage_ranking":          rank_homepage(products, rules, frequent_itemsets, n_transactions),
        "frequently_bought_together": frequently_bought_together(frequent_itemsets, n_transactions),
        "cross_sell":                build_cross_sell_map(products, rules),
        "bundles":                   generate_bundles(products, frequent_itemsets, n_transactions),
        "promos":                    generate_promos(products, rules),
        "insights":                  generate_insights(products, rules, frequent_itemsets, n_transactions),
    }
