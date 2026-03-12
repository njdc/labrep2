"""
FP-Growth Algorithm — From-Scratch Implementation
==================================================
Frequent Pattern Growth (FP-Growth) mines frequent itemsets without
candidate generation, using a compact FP-Tree structure.

Why FP-Growth over Apriori?
-----------------------------
Apriori generates exponentially many candidate itemsets (O(2^n)) and
requires multiple database scans — one for each itemset size. On dense
baskets (e-commerce, where avg basket size > 3) this becomes extremely slow.

FP-Growth builds a compressed prefix-tree in only two database scans,
then mines patterns recursively through conditional databases. Memory
footprint is much smaller because shared prefixes are merged in the tree.

Time complexity  : O(n × avg_basket × tree_depth) vs Apriori O(n × 2^k)
Space complexity : O(unique_items × avg_basket_depth) — often 10–100× smaller
Best suited for  : dense baskets, large item sets, repeated mining

Reference: Han, J., Pei, J., & Yin, Y. (2000). Mining frequent patterns
           without candidate generation. ACM SIGMOD Record.
"""

from collections import defaultdict, Counter
from itertools import combinations


# ---------------------------------------------------------------------------
# FP-Tree data structures
# ---------------------------------------------------------------------------

class FPNode:
    """A single node inside an FP-Tree."""

    __slots__ = ("item", "count", "parent", "children", "neighbor")

    def __init__(self, item=None, count=0, parent=None):
        self.item     = item        # None for the root sentinel node
        self.count    = count       # how many transactions flow through here
        self.parent   = parent
        self.children = {}          # item -> FPNode
        self.neighbor = None        # next node in header-table linked list


class FPTree:
    """
    Compact prefix tree that stores all frequent transactions.

    The header_table maps each frequent item to its total count
    and the head of a singly-linked list of all FPNodes with that item.
    This linked list allows fast traversal when extracting prefix paths.
    """

    def __init__(self):
        self.root         = FPNode()   # sentinel root
        self.header_table = {}         # item -> [total_count, first_FPNode]

    # ------------------------------------------------------------------
    # Construction
    # ------------------------------------------------------------------

    @classmethod
    def build(cls, transactions, item_freq, min_count):
        """
        Build an FP-Tree from a list of transactions.

        Parameters
        ----------
        transactions : list of lists
        item_freq    : dict  item -> count (only frequent items)
        min_count    : int   minimum count threshold
        """
        tree = cls()
        for transaction in transactions:
            # Keep only frequent items; sort by descending frequency
            # (ties broken alphabetically for determinism)
            filtered = [
                item for item in transaction
                if item in item_freq and item_freq[item] >= min_count
            ]
            filtered.sort(key=lambda x: (-item_freq[x], x))
            if filtered:
                tree._insert(filtered)
        return tree

    def _insert(self, items):
        """Insert a sorted item list as a path in the tree."""
        node = self.root
        for item in items:
            if item in node.children:
                node.children[item].count += 1
            else:
                child = FPNode(item, 1, node)
                node.children[item] = child
                # Append to header-table linked list
                if item not in self.header_table:
                    self.header_table[item] = [0, child]
                else:
                    tail = self.header_table[item][1]
                    while tail.neighbor:
                        tail = tail.neighbor
                    tail.neighbor = child
            node = node.children[item]

        # Refresh header-table counts from item_freq after all inserts
        # (we update them lazily in _count_headers)

    def _count_headers(self):
        """Recount each item's total support by traversing linked lists."""
        for item in self.header_table:
            total = 0
            node  = self.header_table[item][1]
            while node:
                total += node.count
                node   = node.neighbor
            self.header_table[item][0] = total

    # ------------------------------------------------------------------
    # Mining helpers
    # ------------------------------------------------------------------

    def prefix_paths(self, item):
        """
        Return the conditional pattern base for a given item.

        Each entry is (path_to_root, count) where path_to_root is the
        list of ancestors from root down to (but not including) the node.
        """
        paths = []
        node  = self.header_table.get(item, [0, None])[1]
        while node:
            path   = []
            parent = node.parent
            while parent and parent.item is not None:
                path.append(parent.item)
                parent = parent.parent
            if path:
                paths.append((list(reversed(path)), node.count))
            node = node.neighbor
        return paths

    def is_single_path(self):
        """True when the tree degenerates to a single chain (no branching)."""
        node = self.root
        while node.children:
            if len(node.children) > 1:
                return False
            node = next(iter(node.children.values()))
        return True

    def single_path_items(self):
        """Yield (item, count) pairs along a single-path tree."""
        node = self.root
        items = []
        while node.children:
            node = next(iter(node.children.values()))
            items.append((node.item, node.count))
        return items


# ---------------------------------------------------------------------------
# FP-Growth recursive miner
# ---------------------------------------------------------------------------

def fp_growth(transactions, min_support):
    """
    Mine all frequent itemsets using FP-Growth.

    Parameters
    ----------
    transactions : list of lists  (each inner list = one basket)
    min_support  : float in (0, 1]  minimum support threshold

    Returns
    -------
    dict  {frozenset: support_count}
    """
    n         = len(transactions)
    min_count = max(1, int(min_support * n))

    # --- Phase 1: count 1-itemsets ---
    item_freq = Counter(item for txn in transactions for item in txn)
    item_freq = {k: v for k, v in item_freq.items() if v >= min_count}

    if not item_freq:
        return {}

    # --- Phase 2: build FP-Tree ---
    tree = FPTree.build(transactions, item_freq, min_count)
    tree._count_headers()

    # --- Phase 3: mine recursively ---
    patterns = {}
    _mine(tree, item_freq, min_count, frozenset(), patterns)
    return patterns


def _mine(tree, item_freq, min_count, prefix, patterns):
    """
    Recursive FP-Growth mining step.

    For each item in the current tree's header table, we:
    1. Form a new pattern = prefix ∪ {item} with its support.
    2. Extract its conditional pattern base (prefix paths).
    3. Build a conditional FP-Tree from those paths.
    4. Recurse into the conditional tree.
    """
    # Sort items by ascending support (bottom-up = mine least frequent first)
    sorted_items = sorted(
        tree.header_table.keys(),
        key=lambda x: tree.header_table[x][0]
    )

    for item in sorted_items:
        item_support = tree.header_table[item][0]
        if item_support < min_count:
            continue

        new_pattern = prefix | frozenset([item])
        patterns[new_pattern] = item_support

        # --- Build conditional pattern base ---
        cond_paths = tree.prefix_paths(item)
        if not cond_paths:
            continue

        # --- Count items in conditional database ---
        cond_item_freq = defaultdict(int)
        for path, count in cond_paths:
            for path_item in path:
                cond_item_freq[path_item] += count

        cond_item_freq = {k: v for k, v in cond_item_freq.items() if v >= min_count}
        if not cond_item_freq:
            continue

        # --- Build conditional transactions ---
        cond_transactions = []
        for path, count in cond_paths:
            filtered = [i for i in path if i in cond_item_freq]
            if filtered:
                cond_transactions.extend([filtered] * count)

        if not cond_transactions:
            continue

        # --- Handle single-path optimisation ---
        # If the conditional tree would be a single chain, enumerate subsets
        # directly without recursion — avoids unnecessary tree construction.
        cond_tree = FPTree.build(cond_transactions, cond_item_freq, min_count)
        cond_tree._count_headers()

        if cond_tree.is_single_path():
            path_items = cond_tree.single_path_items()
            for size in range(1, len(path_items) + 1):
                for combo in combinations(path_items, size):
                    combo_pattern = new_pattern | frozenset(it for it, _ in combo)
                    combo_support = min(cnt for _, cnt in combo)
                    patterns[combo_pattern] = combo_support
        else:
            _mine(cond_tree, cond_item_freq, min_count, new_pattern, patterns)


# ---------------------------------------------------------------------------
# Association-rule generation
# ---------------------------------------------------------------------------

def generate_rules(frequent_itemsets, n_transactions, min_confidence):
    """
    Generate association rules from frequent itemsets.

    Computes: support, confidence, lift, leverage, conviction.

    Parameters
    ----------
    frequent_itemsets : dict  {frozenset: count}
    n_transactions    : int
    min_confidence    : float

    Returns
    -------
    list of dicts, each representing one rule
    """
    n = n_transactions

    # Pre-compute support for quick lookup
    support_map = {fs: count / n for fs, count in frequent_itemsets.items()}

    rules = []
    for itemset in frequent_itemsets:
        if len(itemset) < 2:
            continue

        itemset_support = support_map[itemset]

        # Generate all non-empty proper subsets as antecedents
        items = list(itemset)
        for ant_size in range(1, len(items)):
            for ant_combo in combinations(items, ant_size):
                antecedent = frozenset(ant_combo)
                consequent = itemset - antecedent

                ant_support = support_map.get(antecedent, 0)
                con_support = support_map.get(consequent, 0)

                if ant_support == 0:
                    continue

                confidence = itemset_support / ant_support
                if confidence < min_confidence:
                    continue

                lift = confidence / con_support if con_support > 0 else 0
                leverage = itemset_support - (ant_support * con_support)

                # Conviction: undefined / infinite when confidence = 1
                if confidence >= 1.0:
                    conviction = 999.0   # cap at 999 for JSON serialisation
                else:
                    conviction = (1 - con_support) / (1 - confidence)

                rules.append({
                    "antecedents":   sorted(antecedent),
                    "consequents":   sorted(consequent),
                    "support":       round(itemset_support, 6),
                    "confidence":    round(confidence, 6),
                    "lift":          round(lift, 6),
                    "leverage":      round(leverage, 6),
                    "conviction":    round(min(conviction, 999.0), 4),
                    "ant_support":   round(ant_support, 6),
                    "con_support":   round(con_support, 6),
                })

    return rules
