# NexusCart MBA Engine Documentation
## Market-Basket Analysis System Overview

This documentation supports the implementation of the **NexusCart E-Commerce Recommender Backend**. This system has been built from the ground up to dynamically adapt to ingestion of point-of-sale transactions.

### 1. Business Context & Value
**Scenario Chosen**: E-commerce Recommender Backend (Tech/Electronics Niche)
* **Who uses it?** 
  - *Customers*: Experience a dynamic storefront that adjusts to their shopping patterns (personalized homepages, smart cart cross-sells).
  - *Admin/Store Owners*: Access the "MBA Engine Control Center" to check diagnostics, view stability of product associations, and force-trigger new transaction ingestions.
* **What decisions it improves?**
  - Homepage Product Ranking (deciding what users see first).
  - Automated dynamic discounting (buy X, get Y at Z% off) instead of manual promo code distributions.
  - Cart cross-sells to push high-margin accessories precisely when an anchor item is added.
* **What business value it creates?**
  - Significantly increases Average Order Value (AOV) by dynamically matching accessories to hardware in the cart.
  - Reduces decision fatigue for the customer by ranking high-affinity items at the top of the storefront grid.

### 2. MBA Engine Specification: FP-Growth
Our engine is modeled on the **FP-Growth (Frequent Pattern Growth)** algorithm.

**How it differs from Apriori:**
Apriori requires multiple database scans (one for each level of itemset length) to generate candidate itemsets, which computationally bottlenecks as the dataset grows. FP-Growth compresses the entire transaction database into a highly condensed "FP-Tree" structure using only *two* database passes. It then recursively mines this tree without ever executing candidate generation.

**Why it is the best fit for our E-commerce dataset:**
In tech/electronics e-commerce, basket density can be variable but item cardinality is relatively tight (often around standard anchor products like laptops or monitors). FP-growth scales beautifully here because it natively skips the combinatorial explosion of candidates (e.g., trying to link a laptop, a sleeve, and a monitor repeatedly). As we ingest "Dataset A" and "Dataset B" (simulate 1000+ varying baskets), the FP-Tree's memory footprint remains low and extremely fast to query for real-time recommendations.

### 3. "Self-Learning" Mechanism & Evaluation Loop
The application features a real-time iterative engine you can test via the **Admin Dashboard -> "Simulate Data Ingestion"** button.

**Intelligent Mechanism Used**: **Threshold Auto-Tuning & Rule Stability Testing**
Rather than sticking to a hardcoded minimum support (`minsup`), our engine auto-tunes the thresholds on each iteration to ensure we always capture high-quality rules without overwhelming the system. It tracks whether a rule remains "Stable" across data batches.

**The 3 Iterations (Accessible by clicking the ingest button):**
* **Iteration 1**: Learns obvious links (e.g., Laptops -> Hubs).
* **Iteration 2 (Dataset Update)**: New transaction batches reveal ecosystem buying behaviors (Laptop + Hub -> SSDs). The engine logs the first rule as "Stable".
* **Iteration 3 (Dataset Update)**: The system adjusts thresholds dynamically. Deep cross-category bundles are detected (Monitor -> Mouse + SSD). 

### 4. Demonstrating the Outputs (Video Guide)
When recording your video, show these key system behaviors:
1. **Homepage Ranking**: Notice how items adjust their positions on the storefront based on their accumulated Lift and Support scores. "Highly Recommended" tags are system-injected.
2. **Promo Generation**: Notice the purple banner on the storefront. The backend automatically creates a promotional copy (e.g., "Ultimate Productivity Bundle") when a rule exceeds a Lift of 3.0.
3. **Cross-sell on Cart Add**: Add a Laptop to cart. Open the cart, and observe the "Frequently Bought Together" widget instantly rendering valid consequents (Hubs, Sleeves).
4. **The Admin Dashboard**: Toggle to the Admin View to show the raw association rules table (with Support, Confidence, Lift) and the system iteration counter simulating the self-learning progression.
