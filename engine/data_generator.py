"""
NexusCart - Synthetic Transaction Data Generator
=================================================
Generates realistic e-commerce transaction data for two datasets:
  Dataset A: GameTech Store  — Gaming & Technology products
  Dataset B: OfficePro Store — Office & Productivity products

Transactions are generated using product affinity groups with tunable
probabilities, basket-size distributions, and batch multipliers that
simulate how buying patterns evolve over time.
"""

import random
import csv
import os
from collections import defaultdict

# ---------------------------------------------------------------------------
# DATASET A — GameTech E-Commerce
# ---------------------------------------------------------------------------

GAMETECH_PRODUCTS = {
    "G001": {"name": "Gaming Laptop",       "price": 1499.00, "emoji": "💻", "category": "Computers"},
    "G002": {"name": "Wireless Mouse",      "price":   79.00, "emoji": "🖱️", "category": "Peripherals"},
    "G003": {"name": "Mechanical Keyboard", "price":  129.00, "emoji": "⌨️", "category": "Peripherals"},
    "G004": {"name": "Gaming Monitor",      "price":  349.00, "emoji": "🖥️", "category": "Displays"},
    "G005": {"name": "Gaming Chair",        "price":  299.00, "emoji": "🪑", "category": "Furniture"},
    "G006": {"name": "RGB Headset",         "price":  149.00, "emoji": "🎧", "category": "Audio"},
    "G007": {"name": "Graphics Card",       "price":  599.00, "emoji": "🔧", "category": "Components"},
    "G008": {"name": "NVMe SSD",            "price":  129.00, "emoji": "💾", "category": "Components"},
    "G009": {"name": "DDR5 RAM",            "price":  199.00, "emoji": "🖲️", "category": "Components"},
    "G010": {"name": "PS5 Console",         "price":  499.00, "emoji": "🎮", "category": "Consoles"},
    "G011": {"name": "Xbox Series X",       "price":  499.00, "emoji": "❎", "category": "Consoles"},
    "G012": {"name": "VR Headset",          "price":  499.00, "emoji": "🥽", "category": "VR"},
    "G013": {"name": "Controller",          "price":   69.00, "emoji": "🕹️", "category": "Peripherals"},
    "G014": {"name": "Gaming Desk",         "price":  449.00, "emoji": "🪵", "category": "Furniture"},
    "G015": {"name": "USB Hub",             "price":   49.00, "emoji": "🔗", "category": "Accessories"},
    "G016": {"name": "Webcam HD",           "price":   89.00, "emoji": "📷", "category": "Streaming"},
    "G017": {"name": "Streaming Mic",       "price":  149.00, "emoji": "🎤", "category": "Streaming"},
    "G018": {"name": "LED Strip",           "price":   29.00, "emoji": "💡", "category": "Accessories"},
}

# Each entry: (item_group, base_probability)
GAMETECH_AFFINITIES = [
    (["G001", "G002", "G003"], 0.18),   # Laptop + Mouse + Keyboard (PC setup)
    (["G001", "G004"],         0.15),   # Laptop + Monitor
    (["G004", "G007"],         0.16),   # Monitor + GPU
    (["G007", "G008", "G009"], 0.14),   # GPU + SSD + RAM (PC build)
    (["G010", "G013"],         0.20),   # PS5 + Controller
    (["G010", "G006"],         0.14),   # PS5 + Headset
    (["G011", "G013"],         0.18),   # Xbox + Controller
    (["G012", "G010"],         0.08),   # VR + PS5
    (["G005", "G014"],         0.16),   # Chair + Desk
    (["G014", "G018"],         0.12),   # Desk + LED Strip
    (["G016", "G017"],         0.20),   # Webcam + Streaming Mic
    (["G001", "G016"],         0.10),   # Laptop + Webcam
    (["G001", "G015"],         0.12),   # Laptop + USB Hub
    (["G003", "G002"],         0.22),   # Keyboard + Mouse (standalone)
    (["G008", "G009"],         0.13),   # SSD + RAM (upgrade bundle)
]

# Batch multipliers: how affinity probabilities change over time
# Value > 1 = that group becomes more popular in this batch
GAMETECH_BATCH_AFFINITIES = [
    # Batch 1 (baseline)
    [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00,
     1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
    # Batch 2: streaming setup BOOMS (new holiday season trend),
    #          PC build stays strong, console gaming flat
    [1.15, 1.00, 1.10, 1.20, 1.05, 1.00, 1.05, 1.05,
     1.00, 1.80, 1.50, 1.10, 1.10, 1.00, 1.60],
    # Batch 3: console gaming surges further, streaming normalises,
    #          gaming room setup (desk+chair+LED) grows strongly
    [1.10, 1.05, 1.10, 1.15, 1.70, 1.60, 1.65, 1.40,
     1.15, 1.00, 1.10, 1.05, 1.10, 1.00, 1.20],
]

# ---------------------------------------------------------------------------
# DATASET B — OfficePro E-Commerce
# ---------------------------------------------------------------------------

OFFICEPRO_PRODUCTS = {
    "O001": {"name": "Ergonomic Chair",         "price": 399.00, "emoji": "🪑", "category": "Furniture"},
    "O002": {"name": "Standing Desk",           "price": 599.00, "emoji": "🪵", "category": "Furniture"},
    "O003": {"name": "Office Monitor",          "price": 279.00, "emoji": "🖥️", "category": "Displays"},
    "O004": {"name": "Wireless Keyboard",       "price":  99.00, "emoji": "⌨️", "category": "Peripherals"},
    "O005": {"name": "Wireless Mouse",          "price":  59.00, "emoji": "🖱️", "category": "Peripherals"},
    "O006": {"name": "HD Webcam",               "price": 129.00, "emoji": "📷", "category": "Video"},
    "O007": {"name": "Laser Printer",           "price": 299.00, "emoji": "🖨️", "category": "Printing"},
    "O008": {"name": "Document Scanner",        "price": 199.00, "emoji": "📄", "category": "Printing"},
    "O009": {"name": "Paper Shredder",          "price":  89.00, "emoji": "📋", "category": "Printing"},
    "O010": {"name": "Desk Lamp",               "price":  49.00, "emoji": "💡", "category": "Accessories"},
    "O011": {"name": "Coffee Maker",            "price":  79.00, "emoji": "☕", "category": "Comfort"},
    "O012": {"name": "Whiteboard",              "price": 129.00, "emoji": "📝", "category": "Planning"},
    "O013": {"name": "Planner / Calendar",      "price":  29.00, "emoji": "📅", "category": "Planning"},
    "O014": {"name": "Laptop Stand",            "price":  59.00, "emoji": "🔭", "category": "Accessories"},
    "O015": {"name": "Cable Organizer",         "price":  19.00, "emoji": "🔌", "category": "Accessories"},
    "O016": {"name": "Noise-Cancel Headphones", "price": 249.00, "emoji": "🎧", "category": "Audio"},
    "O017": {"name": "Desk Organizer",          "price":  39.00, "emoji": "🗂️", "category": "Accessories"},
    "O018": {"name": "Monitor Arm",             "price":  89.00, "emoji": "🦾", "category": "Accessories"},
}

OFFICEPRO_AFFINITIES = [
    (["O001", "O002"],         0.20),   # Chair + Standing Desk (ergonomic)
    (["O002", "O018"],         0.18),   # Standing Desk + Monitor Arm
    (["O003", "O004", "O005"], 0.22),   # Monitor + Keyboard + Mouse
    (["O014", "O004", "O005"], 0.18),   # Laptop Stand + K/M (laptop home office)
    (["O006", "O016"],         0.24),   # Webcam + Headphones (video calls)
    (["O003", "O006"],         0.12),   # Monitor + Webcam
    (["O007", "O008"],         0.22),   # Printer + Scanner
    (["O007", "O009"],         0.16),   # Printer + Shredder
    (["O007", "O008", "O009"], 0.10),   # Full document workflow
    (["O010", "O017"],         0.18),   # Lamp + Organizer
    (["O015", "O014"],         0.20),   # Cable Org + Laptop Stand
    (["O012", "O013"],         0.22),   # Whiteboard + Calendar
    (["O011", "O010"],         0.14),   # Coffee + Lamp
    (["O001", "O010"],         0.12),   # Chair + Lamp (comfort setup)
    (["O003", "O018"],         0.10),   # Monitor + Arm (desk upgrade)
]

OFFICEPRO_BATCH_AFFINITIES = [
    # Batch 1 (baseline)
    [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00,
     1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
    # Batch 2: remote-work surge — video conferencing kit (Webcam+Headphones)
    #          triples in popularity; ergonomic furniture up strongly
    [1.50, 1.70, 1.15, 1.60, 1.40, 1.15, 1.00, 1.00,
     1.00, 1.20, 1.30, 1.00, 1.65, 1.20, 1.10],
    # Batch 3: return-to-office — document workflow (Printer+Scanner+Shredder)
    #          surges; ergonomics remain elevated, video conf. levels off
    [1.20, 1.30, 1.00, 1.20, 1.10, 1.00, 1.70, 1.60,
     1.70, 1.35, 1.20, 1.00, 1.30, 1.00, 1.00],
]

# ---------------------------------------------------------------------------
# Core generation logic
# ---------------------------------------------------------------------------

BASKET_SIZES   = [1, 2, 3, 4, 5, 6, 7]
BASKET_WEIGHTS = [8, 18, 30, 22, 12, 6, 4]


def generate_batch(products, affinities, affinity_multipliers,
                   n_transactions, seed=42):
    """
    Generate a single batch of transactions.

    Parameters
    ----------
    products           : dict  id -> product metadata
    affinities         : list  [(item_ids, base_prob), ...]
    affinity_multipliers: list  per-affinity multiplier (same length as affinities)
    n_transactions     : int
    seed               : int   random seed for reproducibility

    Returns
    -------
    list of lists  (each inner list is one transaction = list of product IDs)
    """
    random.seed(seed)
    product_ids = list(products.keys())
    transactions = []

    for _ in range(n_transactions):
        target_size = random.choices(BASKET_SIZES, weights=BASKET_WEIGHTS)[0]
        basket = set()

        # Try to add affinity groups
        for (group, base_prob), mult in zip(affinities, affinity_multipliers):
            prob = min(0.95, base_prob * mult)
            if random.random() < prob:
                for item in group:
                    basket.add(item)

        # Fill remaining slots with random items
        attempts = 0
        while len(basket) < target_size and attempts < 20:
            basket.add(random.choice(product_ids))
            attempts += 1

        # Occasionally trim overly large baskets
        if len(basket) > target_size + 2:
            basket_list = list(basket)
            random.shuffle(basket_list)
            basket = set(basket_list[: target_size + random.randint(0, 2)])

        if basket:
            transactions.append(sorted(basket))

    return transactions


def generate_all_batches(dataset_key="A"):
    """
    Generate 3 cumulative batches for a dataset.

    Batch 1 → transactions used in Iteration 1
    Batch 1+2 → transactions used in Iteration 2
    Batch 1+2+3 → transactions used in Iteration 3

    Returns
    -------
    dict with keys 1, 2, 3 → cumulative list of transactions
    """
    if dataset_key == "A":
        products      = GAMETECH_PRODUCTS
        affinities    = GAMETECH_AFFINITIES
        batch_mults   = GAMETECH_BATCH_AFFINITIES
        batch_sizes   = [1000, 600, 400]
        seeds         = [42, 123, 456]
    else:
        products      = OFFICEPRO_PRODUCTS
        affinities    = OFFICEPRO_AFFINITIES
        batch_mults   = OFFICEPRO_BATCH_AFFINITIES
        batch_sizes   = [800, 500, 300]
        seeds         = [99, 200, 301]

    cumulative = []
    iterations = {}

    for i, (size, seed, mults) in enumerate(zip(batch_sizes, seeds, batch_mults), start=1):
        batch = generate_batch(products, affinities, mults, size, seed)
        cumulative.extend(batch)
        iterations[i] = list(cumulative)  # snapshot

    return iterations


def save_to_csv(transactions, filepath):
    """Persist transactions to CSV (transaction_id, items)."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["transaction_id", "items"])
        for idx, txn in enumerate(transactions, start=1):
            writer.writerow([idx, "|".join(txn)])


def load_from_csv(filepath):
    """Load transactions from CSV."""
    transactions = []
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            items = row["items"].split("|")
            if items and items[0]:
                transactions.append(items)
    return transactions


def compute_stats(transactions, products):
    """Return summary statistics for a transaction set."""
    sizes = [len(t) for t in transactions]
    item_counts = defaultdict(int)
    for t in transactions:
        for item in t:
            item_counts[item] += 1

    return {
        "total_transactions": len(transactions),
        "unique_items": len(set(i for t in transactions for i in t)),
        "avg_basket_size": round(sum(sizes) / len(sizes), 2) if sizes else 0,
        "min_basket_size": min(sizes) if sizes else 0,
        "max_basket_size": max(sizes) if sizes else 0,
        "item_frequencies": {
            pid: {"count": item_counts[pid],
                  "support": round(item_counts[pid] / len(transactions), 4),
                  "name": products[pid]["name"]}
            for pid in products
            if pid in item_counts
        },
    }
