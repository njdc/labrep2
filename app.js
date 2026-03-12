/**
 * NexusCart — Frontend Application
 * ==================================
 * Reads from `MBA_DATA` (set by Python-generated frontend_data.js)
 * and renders the full MBA-powered UI: admin dashboard + storefront.
 *
 * Falls back to built-in DEMO_DATA if frontend_data.js is absent.
 */

"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK DEMO DATA  (used when frontend_data.js has not been generated)
// Values match what the Python engine typically produces.
// ─────────────────────────────────────────────────────────────────────────────
const DEMO_DATA = {
    datasets: {
        A: {
            name: "GameTech Store",
            description: "Gaming & Technology products",
            products: {
                G001:{ name:"Gaming Laptop",       price:1499, emoji:"💻", category:"Computers" },
                G002:{ name:"Wireless Mouse",      price:79,   emoji:"🖱️", category:"Peripherals" },
                G003:{ name:"Mechanical Keyboard", price:129,  emoji:"⌨️", category:"Peripherals" },
                G004:{ name:"Gaming Monitor",      price:349,  emoji:"🖥️", category:"Displays" },
                G005:{ name:"Gaming Chair",        price:299,  emoji:"🪑", category:"Furniture" },
                G006:{ name:"RGB Headset",         price:149,  emoji:"🎧", category:"Audio" },
                G007:{ name:"Graphics Card",       price:599,  emoji:"🔧", category:"Components" },
                G008:{ name:"NVMe SSD",            price:129,  emoji:"💾", category:"Components" },
                G009:{ name:"DDR5 RAM",            price:199,  emoji:"🖲️", category:"Components" },
                G010:{ name:"PS5 Console",         price:499,  emoji:"🎮", category:"Consoles" },
                G011:{ name:"Xbox Series X",       price:499,  emoji:"❎", category:"Consoles" },
                G012:{ name:"VR Headset",          price:499,  emoji:"🥽", category:"VR" },
                G013:{ name:"Controller",          price:69,   emoji:"🕹️", category:"Peripherals" },
                G014:{ name:"Gaming Desk",         price:449,  emoji:"🪵", category:"Furniture" },
                G015:{ name:"USB Hub",             price:49,   emoji:"🔗", category:"Accessories" },
                G016:{ name:"Webcam HD",           price:89,   emoji:"📷", category:"Streaming" },
                G017:{ name:"Streaming Mic",       price:149,  emoji:"🎤", category:"Streaming" },
                G018:{ name:"LED Strip",           price:29,   emoji:"💡", category:"Accessories" },
            },
            iterations: {
                "1": { config:{ min_support:0.0975, min_confidence:0.56, auto_tuned:true, tuning_steps:7, tuning_reason:"Achieved 10 quality rules in 7 steps.", threshold_history:[{step:1,min_sup:0.155,min_conf:0.60,total_rules:4,quality_rules:4},{step:2,min_sup:0.1275,min_conf:0.56,total_rules:8,quality_rules:8},{step:3,min_sup:0.1137,min_conf:0.52,total_rules:11,quality_rules:10}] }, stats:{ total_transactions:1000, unique_items:18, avg_basket_size:3.3, min_basket_size:1, max_basket_size:7, frequent_itemsets:31, rules_count:10 }, rules:[{antecedents:["G002"],consequents:["G003"],support:0.228,confidence:0.72,lift:2.49,leverage:0.136,conviction:2.2,composite_score:0.71,stability:"New",drift:null,action:"Cross-Sell"},{antecedents:["G003"],consequents:["G002"],support:0.228,confidence:0.78,lift:2.49,leverage:0.136,conviction:2.6,composite_score:0.73,stability:"New",drift:null,action:"Cross-Sell"},{antecedents:["G008"],consequents:["G009"],support:0.150,confidence:0.81,lift:3.29,leverage:0.104,conviction:3.4,composite_score:0.82,stability:"New",drift:null,action:"Bundle Deal"},{antecedents:["G009"],consequents:["G008"],support:0.150,confidence:0.74,lift:3.29,leverage:0.104,conviction:2.7,composite_score:0.80,stability:"New",drift:null,action:"Bundle Deal"},{antecedents:["G010"],consequents:["G013"],support:0.200,confidence:0.69,lift:2.12,leverage:0.106,conviction:2.0,composite_score:0.68,stability:"New",drift:null,action:"Cross-Sell"},{antecedents:["G016"],consequents:["G017"],support:0.195,confidence:0.80,lift:3.45,leverage:0.139,conviction:3.1,composite_score:0.85,stability:"New",drift:null,action:"Bundle Deal"},{antecedents:["G001","G002"],consequents:["G003"],support:0.124,confidence:0.75,lift:2.68,leverage:0.078,conviction:2.4,composite_score:0.74,stability:"New",drift:null,action:"Bundle Deal"},{antecedents:["G005"],consequents:["G014"],support:0.158,confidence:0.66,lift:2.30,leverage:0.090,conviction:1.9,composite_score:0.66,stability:"New",drift:null,action:"Cross-Sell"},{antecedents:["G004"],consequents:["G007"],support:0.153,confidence:0.62,lift:2.10,leverage:0.080,conviction:1.8,composite_score:0.63,stability:"New",drift:null,action:"Soft Suggest"},{antecedents:["G011"],consequents:["G013"],support:0.175,confidence:0.70,lift:2.15,leverage:0.094,conviction:2.1,composite_score:0.67,stability:"New",drift:null,action:"Cross-Sell"}], frequent_itemsets:[{items:["G002","G003"],support:0.228,count:228},{items:["G010","G013"],support:0.200,count:200},{items:["G016","G017"],support:0.195,count:195},{items:["G008","G009"],support:0.150,count:150},{items:["G001","G002","G003"],support:0.124,count:124},{items:["G005","G014"],support:0.158,count:158},{items:["G004","G007"],support:0.153,count:153},{items:["G011","G013"],support:0.175,count:175}], homepage_ranking:[{product_id:"G016",score:9.1,rank:1},{product_id:"G017",score:8.8,rank:2},{product_id:"G008",score:8.5,rank:3},{product_id:"G009",score:8.2,rank:4},{product_id:"G003",score:7.9,rank:5},{product_id:"G002",score:7.7,rank:6},{product_id:"G013",score:7.2,rank:7},{product_id:"G010",score:6.9,rank:8},{product_id:"G004",score:6.5,rank:9},{product_id:"G007",score:6.2,rank:10},{product_id:"G014",score:5.9,rank:11},{product_id:"G005",score:5.6,rank:12},{product_id:"G001",score:5.3,rank:13},{product_id:"G011",score:5.0,rank:14},{product_id:"G006",score:4.5,rank:15},{product_id:"G012",score:4.0,rank:16},{product_id:"G015",score:3.5,rank:17},{product_id:"G018",score:3.0,rank:18}], frequently_bought_together:[{items:["G002","G003"],support:0.228,count:228},{items:["G010","G013"],support:0.200,count:200},{items:["G016","G017"],support:0.195,count:195},{items:["G008","G009"],support:0.150,count:150}], cross_sell:{ G001:[{product_id:"G002",confidence:0.75,lift:2.49,score:1.87,reason:"75% of customers who buy Gaming Laptop also buy Wireless Mouse"}], G010:[{product_id:"G013",confidence:0.69,lift:2.12,score:1.46,reason:"69% of customers who buy PS5 also buy Controller"}], G016:[{product_id:"G017",confidence:0.80,lift:3.45,score:2.76,reason:"80% of customers who buy Webcam also buy Streaming Mic"}] }, bundles:[{items:["G002","G003"],item_names:["Wireless Mouse","Mechanical Keyboard"],support:0.228,original_price:208,bundle_price:187.2,discount_pct:10,savings:20.8},{items:["G010","G013"],item_names:["PS5 Console","Controller"],support:0.200,original_price:568,bundle_price:511.2,discount_pct:10,savings:56.8},{items:["G001","G002","G003"],item_names:["Gaming Laptop","Wireless Mouse","Mechanical Keyboard"],support:0.124,original_price:1707,bundle_price:1450.95,discount_pct:15,savings:256.05}], promos:[{title:"Streaming Starter Bundle",description:"Buy Webcam HD and get 20% off Streaming Mic! (80% of buyers choose this combo)",type:"bundle_discount",discount:20,lift:3.45,confidence:0.80,trigger_items:["G016"],target_items:["G017"]},{title:"PC Build Bundle",description:"Buy NVMe SSD and get 20% off DDR5 RAM! (81% of buyers choose this combo)",type:"bundle_discount",discount:20,lift:3.29,confidence:0.81,trigger_items:["G008"],target_items:["G009"]}], insights:[{type:"anchor_product",icon:"ri-anchor-line",title:"Anchor Product: Wireless Mouse",description:"Wireless Mouse appears in 5 association rules — feature it prominently to maximise cross-sell chain reactions.",items:["G002"]},{type:"shelf_placement",icon:"ri-layout-grid-line",title:"Top Co-Purchase Pair — Co-locate in Store",description:"Wireless Mouse and Mechanical Keyboard are bought together 22.8% of the time. Place them adjacent.",items:["G002","G003"]},{type:"category_synergy",icon:"ri-links-line",title:"Category Synergy: Peripherals x Components",description:"Peripherals and Components co-appear in 6 rules (avg lift 2.8x). Target PC builders with bundled campaigns.",items:[]}], stability_report:{stable:0,emerging:0,new:10}, drift_report:[] },
                "2": { config:{ min_support:0.09375, min_confidence:0.56, auto_tuned:true, tuning_steps:8, tuning_reason:"Achieved 11 quality rules in 8 steps.", threshold_history:[{step:1,min_sup:0.1481,min_conf:0.60,total_rules:5,quality_rules:5},{step:2,min_sup:0.1209,min_conf:0.56,total_rules:9,quality_rules:9},{step:3,min_sup:0.1073,min_conf:0.52,total_rules:13,quality_rules:11}] }, stats:{ total_transactions:1600, unique_items:18, avg_basket_size:3.5, min_basket_size:1, max_basket_size:7, frequent_itemsets:35, rules_count:11 }, rules:[{antecedents:["G002"],consequents:["G003"],support:0.226,confidence:0.73,lift:2.51,leverage:0.136,conviction:2.3,composite_score:0.72,stability:"Stable",drift:{level:null,direction:"falling",rel_change:0.009,prev_support:0.228,curr_support:0.226,prev_iteration:1},action:"Cross-Sell"},{antecedents:["G008"],consequents:["G009"],support:0.167,confidence:0.82,lift:3.10,leverage:0.113,conviction:3.5,composite_score:0.83,stability:"Stable",drift:{level:"Drift",direction:"rising",rel_change:0.113,prev_support:0.150,curr_support:0.167,prev_iteration:1},action:"Bundle Deal"},{antecedents:["G016"],consequents:["G017"],support:0.213,confidence:0.81,lift:3.52,leverage:0.152,conviction:3.2,composite_score:0.87,stability:"Stable",drift:{level:"Drift",direction:"rising",rel_change:0.092,prev_support:0.195,curr_support:0.213,prev_iteration:1},action:"Bundle Deal"},{antecedents:["G010"],consequents:["G013"],support:0.199,confidence:0.70,lift:2.15,leverage:0.106,conviction:2.1,composite_score:0.68,stability:"Stable",drift:{level:null,direction:"falling",rel_change:0.005,prev_support:0.200,curr_support:0.199,prev_iteration:1},action:"Cross-Sell"},{antecedents:["G001","G002"],consequents:["G003"],support:0.128,confidence:0.77,lift:2.80,leverage:0.082,conviction:2.5,composite_score:0.76,stability:"Stable",drift:{level:null,direction:"rising",rel_change:0.032,prev_support:0.124,curr_support:0.128,prev_iteration:1},action:"Bundle Deal"},{antecedents:["G005"],consequents:["G014"],support:0.162,confidence:0.67,lift:2.32,leverage:0.092,conviction:2.0,composite_score:0.67,stability:"Stable",drift:{level:null,direction:"rising",rel_change:0.025,prev_support:0.158,curr_support:0.162,prev_iteration:1},action:"Cross-Sell"},{antecedents:["G011"],consequents:["G013"],support:0.180,confidence:0.71,lift:2.18,leverage:0.097,conviction:2.1,composite_score:0.68,stability:"Emerging",drift:{level:null,direction:"rising",rel_change:0.029,prev_support:0.175,curr_support:0.180,prev_iteration:1},action:"Cross-Sell"}], frequent_itemsets:[{items:["G002","G003"],support:0.226,count:362},{items:["G016","G017"],support:0.213,count:341},{items:["G010","G013"],support:0.199,count:318},{items:["G008","G009"],support:0.167,count:267},{items:["G001","G002","G003"],support:0.128,count:205},{items:["G005","G014"],support:0.162,count:259},{items:["G011","G013"],support:0.180,count:288}], homepage_ranking:[{product_id:"G016",score:11.2,rank:1},{product_id:"G017",score:10.8,rank:2},{product_id:"G008",score:9.9,rank:3},{product_id:"G009",score:9.5,rank:4},{product_id:"G003",score:8.7,rank:5},{product_id:"G002",score:8.4,rank:6},{product_id:"G013",score:7.8,rank:7},{product_id:"G010",score:7.4,rank:8},{product_id:"G011",score:7.0,rank:9},{product_id:"G005",score:6.5,rank:10},{product_id:"G014",score:6.3,rank:11},{product_id:"G001",score:5.9,rank:12},{product_id:"G004",score:5.5,rank:13},{product_id:"G007",score:5.0,rank:14},{product_id:"G012",score:4.5,rank:15},{product_id:"G006",score:4.0,rank:16},{product_id:"G015",score:3.5,rank:17},{product_id:"G018",score:3.0,rank:18}], frequently_bought_together:[{items:["G002","G003"],support:0.226,count:362},{items:["G016","G017"],support:0.213,count:341},{items:["G010","G013"],support:0.199,count:318},{items:["G008","G009"],support:0.167,count:267}], cross_sell:{ G001:[{product_id:"G002",confidence:0.77,lift:2.51,score:1.93,reason:"77% of customers who buy Gaming Laptop also buy Wireless Mouse"}], G016:[{product_id:"G017",confidence:0.81,lift:3.52,score:2.85,reason:"81% of customers who buy Webcam also buy Streaming Mic"}] }, bundles:[{items:["G002","G003"],item_names:["Wireless Mouse","Mechanical Keyboard"],support:0.226,original_price:208,bundle_price:187.2,discount_pct:10,savings:20.8},{items:["G016","G017"],item_names:["Webcam HD","Streaming Mic"],support:0.213,original_price:238,bundle_price:214.2,discount_pct:10,savings:23.8},{items:["G001","G002","G003"],item_names:["Gaming Laptop","Wireless Mouse","Mechanical Keyboard"],support:0.128,original_price:1707,bundle_price:1450.95,discount_pct:15,savings:256.05}], promos:[{title:"Streaming Starter Bundle",description:"Buy Webcam HD and get 20% off Streaming Mic! (81% of buyers choose this combo — RISING trend!)",type:"bundle_discount",discount:20,lift:3.52,confidence:0.81,trigger_items:["G016"],target_items:["G017"]},{title:"PC Build Bundle",description:"Buy NVMe SSD and get 20% off DDR5 RAM! Pattern rising +11.3% this period.",type:"bundle_discount",discount:20,lift:3.10,confidence:0.82,trigger_items:["G008"],target_items:["G009"]}], insights:[{type:"anchor_product",icon:"ri-anchor-line",title:"Anchor: Webcam HD — Streaming Trend Rising",description:"Webcam HD support rose 9.2% — streaming products are trending. Boost homepage placement now.",items:["G016"]},{type:"drift_alert",icon:"ri-arrow-up-circle-line",title:"Pattern Drift Detected: Streaming Kit",description:"Webcam+Mic co-purchase rose 9.2% and SSD+RAM rose 11.3% between iterations. Increase streaming promotions.",items:["G016","G017","G008","G009"]}], stability_report:{stable:10,emerging:1,new:0}, drift_report:[{rule_ant:["G008"],rule_con:["G009"],level:"Drift",direction:"rising",rel_change:0.113},{rule_ant:["G016"],rule_con:["G017"],level:"Drift",direction:"rising",rel_change:0.092}] },
                "3": { config:{ min_support:0.09, min_confidence:0.56, auto_tuned:true, tuning_steps:9, tuning_reason:"Achieved 11 quality rules in 9 steps. Threshold lowered as dataset grew.", threshold_history:[{step:1,min_sup:0.145,min_conf:0.60,total_rules:6,quality_rules:6},{step:2,min_sup:0.1175,min_conf:0.56,total_rules:10,quality_rules:10},{step:3,min_sup:0.1037,min_conf:0.52,total_rules:14,quality_rules:11}] }, stats:{ total_transactions:2000, unique_items:18, avg_basket_size:3.6, min_basket_size:1, max_basket_size:7, frequent_itemsets:36, rules_count:11 }, rules:[{antecedents:["G016"],consequents:["G017"],support:0.222,confidence:0.82,lift:3.58,leverage:0.160,conviction:3.3,composite_score:0.88,stability:"Stable",drift:{level:null,direction:"rising",rel_change:0.042,prev_support:0.213,curr_support:0.222,prev_iteration:2},action:"Bundle Deal"},{antecedents:["G008"],consequents:["G009"],support:0.175,confidence:0.83,lift:3.15,leverage:0.119,conviction:3.6,composite_score:0.84,stability:"Stable",drift:{level:null,direction:"rising",rel_change:0.048,prev_support:0.167,curr_support:0.175,prev_iteration:2},action:"Bundle Deal"},{antecedents:["G002"],consequents:["G003"],support:0.224,confidence:0.74,lift:2.53,leverage:0.136,conviction:2.4,composite_score:0.72,stability:"Stable",drift:{level:null,direction:"falling",rel_change:0.009,prev_support:0.226,curr_support:0.224,prev_iteration:2},action:"Cross-Sell"},{antecedents:["G005"],consequents:["G014"],support:0.171,confidence:0.69,lift:2.45,leverage:0.101,conviction:2.1,composite_score:0.70,stability:"Stable",drift:{level:"Drift",direction:"rising",rel_change:0.056,prev_support:0.162,curr_support:0.171,prev_iteration:2},action:"Cross-Sell"},{antecedents:["G010"],consequents:["G013"],support:0.205,confidence:0.71,lift:2.20,leverage:0.112,conviction:2.2,composite_score:0.69,stability:"Stable",drift:{level:null,direction:"rising",rel_change:0.030,prev_support:0.199,curr_support:0.205,prev_iteration:2},action:"Cross-Sell"},{antecedents:["G001","G002"],consequents:["G003"],support:0.131,confidence:0.78,lift:2.85,leverage:0.085,conviction:2.6,composite_score:0.77,stability:"Stable",drift:{level:null,direction:"rising",rel_change:0.023,prev_support:0.128,curr_support:0.131,prev_iteration:2},action:"Bundle Deal"},{antecedents:["G011"],consequents:["G013"],support:0.188,confidence:0.73,lift:2.26,leverage:0.105,conviction:2.3,composite_score:0.70,stability:"Stable",drift:{level:"Drift",direction:"rising",rel_change:0.044,prev_support:0.180,curr_support:0.188,prev_iteration:2},action:"Cross-Sell"}], frequent_itemsets:[{items:["G002","G003"],support:0.224,count:448},{items:["G016","G017"],support:0.222,count:444},{items:["G010","G013"],support:0.205,count:410},{items:["G011","G013"],support:0.188,count:376},{items:["G008","G009"],support:0.175,count:350},{items:["G005","G014"],support:0.171,count:342},{items:["G001","G002","G003"],support:0.131,count:262}], homepage_ranking:[{product_id:"G016",score:12.5,rank:1},{product_id:"G017",score:12.0,rank:2},{product_id:"G008",score:10.8,rank:3},{product_id:"G009",score:10.3,rank:4},{product_id:"G013",score:9.4,rank:5},{product_id:"G003",score:9.0,rank:6},{product_id:"G002",score:8.7,rank:7},{product_id:"G010",score:8.2,rank:8},{product_id:"G011",score:7.9,rank:9},{product_id:"G014",score:7.3,rank:10},{product_id:"G005",score:7.0,rank:11},{product_id:"G001",score:6.5,rank:12},{product_id:"G007",score:5.8,rank:13},{product_id:"G004",score:5.4,rank:14},{product_id:"G006",score:4.8,rank:15},{product_id:"G012",score:4.3,rank:16},{product_id:"G018",score:3.8,rank:17},{product_id:"G015",score:3.2,rank:18}], frequently_bought_together:[{items:["G002","G003"],support:0.224,count:448},{items:["G016","G017"],support:0.222,count:444},{items:["G010","G013"],support:0.205,count:410},{items:["G008","G009"],support:0.175,count:350}], cross_sell:{ G001:[{product_id:"G002",confidence:0.78,lift:2.53,score:1.97,reason:"78% of customers who buy Gaming Laptop also buy Wireless Mouse"}], G010:[{product_id:"G013",confidence:0.71,lift:2.20,score:1.56,reason:"71% of customers who buy PS5 also buy Controller"}], G016:[{product_id:"G017",confidence:0.82,lift:3.58,score:2.94,reason:"82% of customers who buy Webcam also buy Streaming Mic"}] }, bundles:[{items:["G002","G003"],item_names:["Wireless Mouse","Mechanical Keyboard"],support:0.224,original_price:208,bundle_price:187.2,discount_pct:10,savings:20.8},{items:["G016","G017"],item_names:["Webcam HD","Streaming Mic"],support:0.222,original_price:238,bundle_price:214.2,discount_pct:10,savings:23.8},{items:["G010","G013"],item_names:["PS5 Console","Controller"],support:0.205,original_price:568,bundle_price:511.2,discount_pct:10,savings:56.8},{items:["G001","G002","G003"],item_names:["Gaming Laptop","Wireless Mouse","Mechanical Keyboard"],support:0.131,original_price:1707,bundle_price:1450.95,discount_pct:15,savings:256.05}], promos:[{title:"Streaming Starter Bundle",description:"Buy Webcam HD and get 20% off Streaming Mic! Confidence 82% — strongest rule in dataset.",type:"bundle_discount",discount:20,lift:3.58,confidence:0.82,trigger_items:["G016"],target_items:["G017"]},{title:"PC Builder Bundle",description:"NVMe SSD + DDR5 RAM — 83% of PC builders buy both. Save 20% on RAM!",type:"bundle_discount",discount:20,lift:3.15,confidence:0.83,trigger_items:["G008"],target_items:["G009"]},{title:"Console Gamer Bundle",description:"PS5 + Controller purchased together 71% of the time. Bundle and save!",type:"bundle_discount",discount:15,lift:2.20,confidence:0.71,trigger_items:["G010"],target_items:["G013"]}], insights:[{type:"anchor_product",icon:"ri-anchor-line",title:"Anchor Product: Wireless Mouse",description:"Wireless Mouse appears in 5 rules and drives the largest cross-sell network. Feature prominently.",items:["G002"]},{type:"shelf_placement",icon:"ri-layout-grid-line",title:"Shelf Placement: Co-locate Webcam + Mic",description:"Webcam HD and Streaming Mic are bought together 22.2% of the time and rising. Bundle them near checkout.",items:["G016","G017"]},{type:"category_synergy",icon:"ri-links-line",title:"Category Synergy: Peripherals x Streaming",description:"Peripherals and Streaming products co-appear in 4 rules (avg lift 3.1x). Launch streaming + peripherals campaign.",items:[]},{type:"promo_opportunity",icon:"ri-price-tag-3-line",title:"Highest-Lift Bundle Opportunity",description:"'Webcam HD -> Streaming Mic' has lift 3.58x and confidence 82%. Launch a limited-time bundle discount.",items:["G016","G017"]}], stability_report:{stable:11,emerging:0,new:0}, drift_report:[{rule_ant:["G005"],rule_con:["G014"],level:"Drift",direction:"rising",rel_change:0.056},{rule_ant:["G011"],rule_con:["G013"],level:"Drift",direction:"rising",rel_change:0.044}] }
            }
        },
        B: {
            name: "OfficePro Store",
            description: "Office & Productivity products",
            products: {
                O001:{ name:"Ergonomic Chair",         price:399, emoji:"🪑", category:"Furniture" },
                O002:{ name:"Standing Desk",           price:599, emoji:"🪵", category:"Furniture" },
                O003:{ name:"Office Monitor",          price:279, emoji:"🖥️", category:"Displays" },
                O004:{ name:"Wireless Keyboard",       price:99,  emoji:"⌨️", category:"Peripherals" },
                O005:{ name:"Wireless Mouse",          price:59,  emoji:"🖱️", category:"Peripherals" },
                O006:{ name:"HD Webcam",               price:129, emoji:"📷", category:"Video" },
                O007:{ name:"Laser Printer",           price:299, emoji:"🖨️", category:"Printing" },
                O008:{ name:"Document Scanner",        price:199, emoji:"📄", category:"Printing" },
                O009:{ name:"Paper Shredder",          price:89,  emoji:"📋", category:"Printing" },
                O010:{ name:"Desk Lamp",               price:49,  emoji:"💡", category:"Accessories" },
                O011:{ name:"Coffee Maker",            price:79,  emoji:"☕", category:"Comfort" },
                O012:{ name:"Whiteboard",              price:129, emoji:"📝", category:"Planning" },
                O013:{ name:"Planner / Calendar",      price:29,  emoji:"📅", category:"Planning" },
                O014:{ name:"Laptop Stand",            price:59,  emoji:"🔭", category:"Accessories" },
                O015:{ name:"Cable Organizer",         price:19,  emoji:"🔌", category:"Accessories" },
                O016:{ name:"Noise-Cancel Headphones", price:249, emoji:"🎧", category:"Audio" },
                O017:{ name:"Desk Organizer",          price:39,  emoji:"🗂️", category:"Accessories" },
                O018:{ name:"Monitor Arm",             price:89,  emoji:"🦾", category:"Accessories" },
            },
            iterations: {
                "1": { config:{ min_support:0.0975, min_confidence:0.56, auto_tuned:true, tuning_steps:6, tuning_reason:"Achieved 14 quality rules in 6 steps.", threshold_history:[{step:1,min_sup:0.155,min_conf:0.60,total_rules:6,quality_rules:6},{step:2,min_sup:0.1275,min_conf:0.56,total_rules:11,quality_rules:11},{step:3,min_sup:0.1112,min_conf:0.52,total_rules:16,quality_rules:14}] }, stats:{ total_transactions:800, unique_items:18, avg_basket_size:3.2, min_basket_size:1, max_basket_size:5, frequent_itemsets:35, rules_count:14 }, rules:[{antecedents:["O006"],consequents:["O016"],support:0.234,confidence:0.81,lift:3.12,leverage:0.159,conviction:3.1,composite_score:0.84,stability:"New",drift:null,action:"Bundle Deal"},{antecedents:["O004"],consequents:["O005"],support:0.218,confidence:0.75,lift:2.68,leverage:0.136,conviction:2.5,composite_score:0.76,stability:"New",drift:null,action:"Cross-Sell"},{antecedents:["O007"],consequents:["O008"],support:0.220,confidence:0.74,lift:2.85,leverage:0.143,conviction:2.6,composite_score:0.78,stability:"New",drift:null,action:"Bundle Deal"},{antecedents:["O001"],consequents:["O002"],support:0.196,confidence:0.72,lift:2.30,leverage:0.111,conviction:2.2,composite_score:0.71,stability:"New",drift:null,action:"Cross-Sell"},{antecedents:["O012"],consequents:["O013"],support:0.218,confidence:0.78,lift:2.95,leverage:0.144,conviction:2.8,composite_score:0.80,stability:"New",drift:null,action:"Bundle Deal"}], frequent_itemsets:[{items:["O006","O016"],support:0.234,count:187},{items:["O004","O005"],support:0.218,count:174},{items:["O007","O008"],support:0.220,count:176},{items:["O001","O002"],support:0.196,count:157},{items:["O012","O013"],support:0.218,count:174}], homepage_ranking:[{product_id:"O006",score:10.2,rank:1},{product_id:"O016",score:9.8,rank:2},{product_id:"O007",score:9.1,rank:3},{product_id:"O008",score:8.7,rank:4},{product_id:"O004",score:8.3,rank:5},{product_id:"O005",score:7.9,rank:6},{product_id:"O012",score:7.5,rank:7},{product_id:"O013",score:7.1,rank:8},{product_id:"O001",score:6.8,rank:9},{product_id:"O002",score:6.4,rank:10},{product_id:"O003",score:5.9,rank:11},{product_id:"O014",score:5.4,rank:12},{product_id:"O015",score:4.9,rank:13},{product_id:"O009",score:4.5,rank:14},{product_id:"O018",score:4.0,rank:15},{product_id:"O010",score:3.6,rank:16},{product_id:"O011",score:3.2,rank:17},{product_id:"O017",score:2.8,rank:18}], frequently_bought_together:[{items:["O006","O016"],support:0.234,count:187},{items:["O004","O005"],support:0.218,count:174},{items:["O007","O008"],support:0.220,count:176},{items:["O001","O002"],support:0.196,count:157}], cross_sell:{ O006:[{product_id:"O016",confidence:0.81,lift:3.12,score:2.53,reason:"81% of customers who buy HD Webcam also buy Noise-Cancel Headphones"}], O007:[{product_id:"O008",confidence:0.74,lift:2.85,score:2.11,reason:"74% of customers who buy Laser Printer also buy Document Scanner"}] }, bundles:[{items:["O006","O016"],item_names:["HD Webcam","Noise-Cancel Headphones"],support:0.234,original_price:378,bundle_price:340.2,discount_pct:10,savings:37.8},{items:["O007","O008"],item_names:["Laser Printer","Document Scanner"],support:0.220,original_price:498,bundle_price:448.2,discount_pct:10,savings:49.8},{items:["O001","O002"],item_names:["Ergonomic Chair","Standing Desk"],support:0.196,original_price:998,bundle_price:898.2,discount_pct:10,savings:99.8}], promos:[{title:"Video Conferencing Bundle",description:"Buy HD Webcam and save 20% on Noise-Cancel Headphones! 81% of remote workers choose both.",type:"bundle_discount",discount:20,lift:3.12,confidence:0.81,trigger_items:["O006"],target_items:["O016"]},{title:"Document Workflow Bundle",description:"Buy Laser Printer and get 20% off Document Scanner. 74% of office setups include both.",type:"bundle_discount",discount:20,lift:2.85,confidence:0.74,trigger_items:["O007"],target_items:["O008"]}], insights:[{type:"anchor_product",icon:"ri-anchor-line",title:"Anchor Product: HD Webcam",description:"HD Webcam appears in 4 rules and anchors the remote-work product cluster.",items:["O006"]},{type:"shelf_placement",icon:"ri-layout-grid-line",title:"Shelf Placement: Video Conferencing Zone",description:"HD Webcam + Headphones are bought together 23.4% of the time. Create a dedicated remote-work display.",items:["O006","O016"]}], stability_report:{stable:0,emerging:0,new:14}, drift_report:[] },
                "2": { config:{ min_support:0.09375, min_confidence:0.56, auto_tuned:true, tuning_steps:7, tuning_reason:"Achieved 13 quality rules in 7 steps.", threshold_history:[{step:1,min_sup:0.1481,min_conf:0.60,total_rules:7,quality_rules:7},{step:2,min_sup:0.1209,min_conf:0.56,total_rules:12,quality_rules:12},{step:3,min_sup:0.1073,min_conf:0.52,total_rules:15,quality_rules:13}] }, stats:{ total_transactions:1300, unique_items:18, avg_basket_size:3.4, min_basket_size:1, max_basket_size:6, frequent_itemsets:34, rules_count:13 }, rules:[{antecedents:["O006"],consequents:["O016"],support:0.251,confidence:0.83,lift:3.24,leverage:0.174,conviction:3.5,composite_score:0.87,stability:"Stable",drift:{level:"Drift",direction:"rising",rel_change:0.073,prev_support:0.234,curr_support:0.251,prev_iteration:1},action:"Bundle Deal"},{antecedents:["O007"],consequents:["O008"],support:0.228,confidence:0.75,lift:2.90,leverage:0.149,conviction:2.7,composite_score:0.79,stability:"Stable",drift:{level:null,direction:"rising",rel_change:0.036,prev_support:0.220,curr_support:0.228,prev_iteration:1},action:"Bundle Deal"},{antecedents:["O001"],consequents:["O002"],support:0.213,confidence:0.75,lift:2.42,leverage:0.125,conviction:2.4,composite_score:0.74,stability:"Stable",drift:{level:"Drift",direction:"rising",rel_change:0.087,prev_support:0.196,curr_support:0.213,prev_iteration:1},action:"Cross-Sell"},{antecedents:["O004"],consequents:["O005"],support:0.213,confidence:0.74,lift:2.64,leverage:0.132,conviction:2.4,composite_score:0.74,stability:"Emerging",drift:{level:null,direction:"falling",rel_change:0.023,prev_support:0.218,curr_support:0.213,prev_iteration:1},action:"Cross-Sell"},{antecedents:["O012"],consequents:["O013"],support:0.215,confidence:0.78,lift:2.93,leverage:0.141,conviction:2.8,composite_score:0.79,stability:"Stable",drift:{level:null,direction:"falling",rel_change:0.014,prev_support:0.218,curr_support:0.215,prev_iteration:1},action:"Bundle Deal"}], frequent_itemsets:[{items:["O006","O016"],support:0.251,count:326},{items:["O007","O008"],support:0.228,count:296},{items:["O004","O005"],support:0.213,count:277},{items:["O001","O002"],support:0.213,count:277},{items:["O012","O013"],support:0.215,count:280}], homepage_ranking:[{product_id:"O006",score:12.8,rank:1},{product_id:"O016",score:12.3,rank:2},{product_id:"O001",score:10.1,rank:3},{product_id:"O002",score:9.7,rank:4},{product_id:"O007",score:9.4,rank:5},{product_id:"O008",score:9.0,rank:6},{product_id:"O004",score:8.5,rank:7},{product_id:"O005",score:8.1,rank:8},{product_id:"O012",score:7.7,rank:9},{product_id:"O013",score:7.4,rank:10},{product_id:"O003",score:6.8,rank:11},{product_id:"O014",score:6.2,rank:12},{product_id:"O018",score:5.7,rank:13},{product_id:"O015",score:5.1,rank:14},{product_id:"O009",score:4.6,rank:15},{product_id:"O010",score:4.1,rank:16},{product_id:"O011",score:3.6,rank:17},{product_id:"O017",score:3.1,rank:18}], frequently_bought_together:[{items:["O006","O016"],support:0.251,count:326},{items:["O007","O008"],support:0.228,count:296},{items:["O001","O002"],support:0.213,count:277},{items:["O004","O005"],support:0.213,count:277}], cross_sell:{ O006:[{product_id:"O016",confidence:0.83,lift:3.24,score:2.69,reason:"83% of customers who buy HD Webcam also buy Noise-Cancel Headphones"}], O001:[{product_id:"O002",confidence:0.75,lift:2.42,score:1.82,reason:"75% of customers who buy Ergonomic Chair also buy Standing Desk"}] }, bundles:[{items:["O006","O016"],item_names:["HD Webcam","Noise-Cancel Headphones"],support:0.251,original_price:378,bundle_price:340.2,discount_pct:10,savings:37.8},{items:["O007","O008"],item_names:["Laser Printer","Document Scanner"],support:0.228,original_price:498,bundle_price:448.2,discount_pct:10,savings:49.8},{items:["O001","O002"],item_names:["Ergonomic Chair","Standing Desk"],support:0.213,original_price:998,bundle_price:848.3,discount_pct:15,savings:149.7}], promos:[{title:"Remote Work Bundle",description:"Buy HD Webcam + save 20% on Noise-Cancel Headphones. Pattern RISING +7.3% this period!",type:"bundle_discount",discount:20,lift:3.24,confidence:0.83,trigger_items:["O006"],target_items:["O016"]},{title:"Ergonomic Office Bundle",description:"Ergonomic Chair + Standing Desk: pattern rising +8.7% as hybrid work adoption grows.",type:"bundle_discount",discount:15,lift:2.42,confidence:0.75,trigger_items:["O001"],target_items:["O002"]}], insights:[{type:"anchor_product",icon:"ri-anchor-line",title:"Anchor: HD Webcam — Remote Work Trend",description:"HD Webcam support rose 7.3%. Remote work adoption is driving video conferencing kit sales.",items:["O006"]},{type:"drift_alert",icon:"ri-arrow-up-circle-line",title:"Pattern Drift: Ergonomics Rising",description:"Ergonomic Chair + Standing Desk rose 8.7%. Increase inventory and promote the bundle actively.",items:["O001","O002"]}], stability_report:{stable:12,emerging:3,new:0}, drift_report:[{rule_ant:["O006"],rule_con:["O016"],level:"Drift",direction:"rising",rel_change:0.073},{rule_ant:["O001"],rule_con:["O002"],level:"Drift",direction:"rising",rel_change:0.087}] },
                "3": { config:{ min_support:0.09, min_confidence:0.56, auto_tuned:true, tuning_steps:9, tuning_reason:"Achieved 13 quality rules in 9 steps. Threshold lowered as dataset grew.", threshold_history:[{step:1,min_sup:0.145,min_conf:0.60,total_rules:7,quality_rules:7},{step:2,min_sup:0.1175,min_conf:0.56,total_rules:12,quality_rules:12},{step:3,min_sup:0.1037,min_conf:0.52,total_rules:16,quality_rules:13}] }, stats:{ total_transactions:1600, unique_items:18, avg_basket_size:3.5, min_basket_size:1, max_basket_size:6, frequent_itemsets:34, rules_count:13 }, rules:[{antecedents:["O006"],consequents:["O016"],support:0.261,confidence:0.84,lift:3.31,leverage:0.182,conviction:3.7,composite_score:0.88,stability:"Stable",drift:{level:"Drift",direction:"rising",rel_change:0.040,prev_support:0.251,curr_support:0.261,prev_iteration:2},action:"Bundle Deal"},{antecedents:["O007"],consequents:["O008"],support:0.238,confidence:0.77,lift:3.02,leverage:0.159,conviction:2.9,composite_score:0.81,stability:"Stable",drift:{level:"Drift",direction:"rising",rel_change:0.044,prev_support:0.228,curr_support:0.238,prev_iteration:2},action:"Bundle Deal"},{antecedents:["O007"],consequents:["O009"],support:0.155,confidence:0.62,lift:2.45,leverage:0.092,conviction:1.8,composite_score:0.67,stability:"Stable",drift:{level:"Major Drift",direction:"rising",rel_change:0.240,prev_support:0.125,curr_support:0.155,prev_iteration:2},action:"Cross-Sell"},{antecedents:["O001"],consequents:["O002"],support:0.221,confidence:0.77,lift:2.50,leverage:0.133,conviction:2.5,composite_score:0.76,stability:"Stable",drift:{level:null,direction:"rising",rel_change:0.038,prev_support:0.213,curr_support:0.221,prev_iteration:2},action:"Cross-Sell"},{antecedents:["O004"],consequents:["O005"],support:0.219,confidence:0.75,lift:2.69,leverage:0.138,conviction:2.5,composite_score:0.76,stability:"Stable",drift:{level:"Drift",direction:"rising",rel_change:0.028,prev_support:0.213,curr_support:0.219,prev_iteration:2},action:"Cross-Sell"},{antecedents:["O012"],consequents:["O013"],support:0.217,confidence:0.79,lift:2.97,leverage:0.144,conviction:2.9,composite_score:0.80,stability:"Stable",drift:{level:null,direction:"rising",rel_change:0.009,prev_support:0.215,curr_support:0.217,prev_iteration:2},action:"Bundle Deal"}], frequent_itemsets:[{items:["O006","O016"],support:0.261,count:418},{items:["O007","O008"],support:0.238,count:381},{items:["O004","O005"],support:0.219,count:350},{items:["O001","O002"],support:0.221,count:354},{items:["O012","O013"],support:0.217,count:347},{items:["O007","O009"],support:0.155,count:248}], homepage_ranking:[{product_id:"O006",score:13.9,rank:1},{product_id:"O016",score:13.4,rank:2},{product_id:"O007",score:11.2,rank:3},{product_id:"O008",score:10.7,rank:4},{product_id:"O001",score:10.1,rank:5},{product_id:"O002",score:9.7,rank:6},{product_id:"O004",score:9.2,rank:7},{product_id:"O005",score:8.8,rank:8},{product_id:"O012",score:8.4,rank:9},{product_id:"O013",score:8.0,rank:10},{product_id:"O009",score:7.2,rank:11},{product_id:"O018",score:6.5,rank:12},{product_id:"O003",score:6.0,rank:13},{product_id:"O014",score:5.4,rank:14},{product_id:"O015",score:4.9,rank:15},{product_id:"O010",score:4.3,rank:16},{product_id:"O011",score:3.8,rank:17},{product_id:"O017",score:3.2,rank:18}], frequently_bought_together:[{items:["O006","O016"],support:0.261,count:418},{items:["O007","O008"],support:0.238,count:381},{items:["O001","O002"],support:0.221,count:354},{items:["O004","O005"],support:0.219,count:350}], cross_sell:{ O006:[{product_id:"O016",confidence:0.84,lift:3.31,score:2.78,reason:"84% of customers who buy HD Webcam also buy Noise-Cancel Headphones"}], O007:[{product_id:"O008",confidence:0.77,lift:3.02,score:2.33,reason:"77% of customers who buy Laser Printer also buy Document Scanner"},{product_id:"O009",confidence:0.62,lift:2.45,score:1.52,reason:"62% of customers who buy Laser Printer also buy Paper Shredder"}], O001:[{product_id:"O002",confidence:0.77,lift:2.50,score:1.93,reason:"77% of customers who buy Ergonomic Chair also buy Standing Desk"}] }, bundles:[{items:["O006","O016"],item_names:["HD Webcam","Noise-Cancel Headphones"],support:0.261,original_price:378,bundle_price:340.2,discount_pct:10,savings:37.8},{items:["O007","O008"],item_names:["Laser Printer","Document Scanner"],support:0.238,original_price:498,bundle_price:448.2,discount_pct:10,savings:49.8},{items:["O001","O002"],item_names:["Ergonomic Chair","Standing Desk"],support:0.221,original_price:998,bundle_price:848.3,discount_pct:15,savings:149.7},{items:["O007","O008","O009"],item_names:["Laser Printer","Document Scanner","Paper Shredder"],support:0.120,original_price:587,bundle_price:499.0,discount_pct:15,savings:88.0}], promos:[{title:"Video Conferencing Bundle",description:"Buy HD Webcam + save 20% on Noise-Cancel Headphones! Confidence 84% — HIGHEST in dataset.",type:"bundle_discount",discount:20,lift:3.31,confidence:0.84,trigger_items:["O006"],target_items:["O016"]},{title:"Document Workflow Bundle",description:"Laser Printer + Document Scanner: 77% buy both. Now with Paper Shredder option!",type:"buy2get1",discount:15,lift:3.02,confidence:0.77,trigger_items:["O007"],target_items:["O008"]},{title:"Ergonomic Office Bundle",description:"Ergonomic Chair + Standing Desk: growing consistently across all 3 iterations.",type:"bundle_discount",discount:15,lift:2.50,confidence:0.77,trigger_items:["O001"],target_items:["O002"]}], insights:[{type:"anchor_product",icon:"ri-anchor-line",title:"Anchor Product: HD Webcam",description:"HD Webcam anchors the video-conferencing cluster (4 rules, avg lift 3.0x). Make it the hero product.",items:["O006"]},{type:"shelf_placement",icon:"ri-layout-grid-line",title:"Document Workflow Zone",description:"Printer + Scanner + Shredder — all three in the same zone. Support for the trio rose 24% (Major Drift).",items:["O007","O008","O009"]},{type:"category_synergy",icon:"ri-links-line",title:"Category Synergy: Printing x Accessories",description:"Printing and Accessories co-appear in 5 rules (avg lift 2.7x). Bundle printer consumables with desk accessories.",items:[]},{type:"promo_opportunity",icon:"ri-price-tag-3-line",title:"Highest-Lift Opportunity: Video Kit",description:"'HD Webcam -> Headphones' lift 3.31x and confidence 84%. This is the single best bundle to promote.",items:["O006","O016"]}], stability_report:{stable:13,emerging:2,new:0}, drift_report:[{rule_ant:["O007"],rule_con:["O009"],level:"Major Drift",direction:"rising",rel_change:0.240},{rule_ant:["O006"],rule_con:["O016"],level:"Drift",direction:"rising",rel_change:0.040},{rule_ant:["O007"],rule_con:["O008"],level:"Drift",direction:"rising",rel_change:0.044},{rule_ant:["O004"],rule_con:["O005"],level:"Drift",direction:"rising",rel_change:0.028}] }
            }
        }
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────────────────────
const DATA = (typeof MBA_DATA !== "undefined") ? MBA_DATA : DEMO_DATA;

const STATE = {
    dataset:    "A",
    iteration:  1,
    cart:       [],
    autoIter:   null,
};

function currentData() {
    return DATA.datasets[STATE.dataset]?.iterations?.[STATE.iteration] ?? null;
}
function currentProducts() {
    return DATA.datasets[STATE.dataset]?.products ?? {};
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────
function pct(v) { return (v * 100).toFixed(1) + "%"; }
function fmt(v, dp=4) { return parseFloat(v).toFixed(dp); }
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }

function productName(pid) {
    return currentProducts()[pid]?.name ?? pid;
}

function stabilityBadge(label) {
    const cls = label === "Stable" ? "badge-stable"
              : label === "Emerging" ? "badge-emerging"
              : "badge-new";
    return `<span class="badge ${cls}">${label}</span>`;
}

function driftBadge(drift) {
    if (!drift || !drift.level) return `<span class="badge badge-ok">No Drift</span>`;
    const cls  = drift.level === "Major Drift" ? "badge-major-drift" : "badge-drift";
    const dir  = drift.direction === "rising" ? "↑" : "↓";
    const pct_ = (drift.rel_change * 100).toFixed(1);
    return `<span class="badge ${cls}">${drift.level} ${dir}${pct_}%</span>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — ENGINE DIAGNOSTICS
// ─────────────────────────────────────────────────────────────────────────────
function renderDiagnostics() {
    const d = currentData();
    if (!d) return;
    document.getElementById("iter-display").textContent     = STATE.iteration;
    document.getElementById("diag-sup").textContent         = d.config.min_support + " (auto)";
    document.getElementById("diag-conf").textContent        = d.config.min_confidence + " (auto)";
    document.getElementById("diag-steps").textContent       = d.config.tuning_steps;
    document.getElementById("diag-reason").textContent      = d.config.tuning_reason;
    document.getElementById("stat-txn").textContent         = d.stats.total_transactions.toLocaleString();
    document.getElementById("stat-items").textContent       = d.stats.unique_items;
    document.getElementById("stat-basket").textContent      = d.stats.avg_basket_size;
    document.getElementById("stat-itemsets").textContent    = d.stats.frequent_itemsets;
    document.getElementById("stat-rules").textContent       = d.stats.rules_count;

    // Patterns Found = frequent itemsets + association rules
    const totalPatterns = (d.stats.frequent_itemsets || 0) + (d.stats.rules_count || 0);
    document.getElementById("stat-patterns").textContent    = totalPatterns;

    // Estimated Revenue = transactions × avg basket size × avg product price
    const products = currentProducts();
    const prices   = Object.values(products).map(p => p.price).filter(Boolean);
    const avgPrice = prices.length ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    const revenue  = d.stats.total_transactions * d.stats.avg_basket_size * avgPrice;
    document.getElementById("stat-revenue").textContent     = "$" + Math.round(revenue).toLocaleString();
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — STABILITY + DRIFT SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
function renderStabilityDrift() {
    const d = currentData();
    if (!d) return;
    const sr = d.stability_report;
    const stabEl = document.getElementById("stability-summary");
    stabEl.innerHTML = `
        <div class="stab-row">
            <span class="badge badge-stable">Stable</span> <strong>${sr.stable}</strong> rules seen consistently across iterations
        </div>
        <div class="stab-row">
            <span class="badge badge-emerging">Emerging</span> <strong>${sr.emerging}</strong> rules appearing in some iterations
        </div>
        <div class="stab-row">
            <span class="badge badge-new">New</span> <strong>${sr.new}</strong> rules discovered this iteration
        </div>`;

    const driftEl = document.getElementById("drift-summary");
    const dr = d.drift_report || [];
    if (dr.length === 0) {
        driftEl.innerHTML = `<div class="drift-none"><i class="ri-checkbox-circle-line"></i> No significant pattern drift detected.</div>`;
    } else {
        driftEl.innerHTML = dr.map(ev => `
            <div class="drift-event ${ev.level === 'Major Drift' ? 'drift-major' : 'drift-minor'}">
                <i class="ri-arrow-${ev.direction === 'rising' ? 'up' : 'down'}-circle-fill"></i>
                <div>
                    <strong>${ev.rule_ant.map(id=>productName(id)).join(' + ')} → ${ev.rule_con.map(id=>productName(id)).join(' + ')}</strong><br>
                    <span class="text-muted small">${ev.level}: support ${ev.direction} ${(ev.rel_change*100).toFixed(1)}% (${fmt(ev.prev_support,4)} → ${fmt(ev.curr_support,4)})</span>
                </div>
            </div>`).join('');
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — THRESHOLD TUNING HISTORY
// ─────────────────────────────────────────────────────────────────────────────
function renderThresholdHistory() {
    const d = currentData();
    if (!d) return;
    const hist = d.config.threshold_history || [];
    const el   = document.getElementById("threshold-timeline");
    if (!hist.length) { el.innerHTML = "<span class='text-muted'>No history available.</span>"; return; }
    const maxQ = Math.max(...hist.map(h => h.quality_rules || h.total_rules), 1);

    el.innerHTML = hist.map((h, i) => `
        <div class="th-step">
            <div class="th-num">Step ${h.step ?? i+1}</div>
            <div class="th-vals">
                <span>sup=${h.min_sup?.toFixed?.(4) ?? h.min_support}</span>
                <span>conf=${h.min_conf?.toFixed?.(4) ?? h.min_confidence}</span>
            </div>
            <div class="th-bar-wrap">
                <div class="th-bar" style="width:${Math.round(((h.quality_rules??h.total_rules)/maxQ)*100)}%"></div>
            </div>
            <div class="th-count">${h.quality_rules ?? h.total_rules} quality rules</div>
        </div>`).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — ASSOCIATION RULES TABLE
// ─────────────────────────────────────────────────────────────────────────────
function renderRulesTable() {
    const d = currentData();
    if (!d) return;
    const tbody = document.getElementById("rules-tbody");
    tbody.innerHTML = "";

    (d.rules || []).forEach(r => {
        const ants = r.antecedents.map(id => `<strong>${productName(id)}</strong>`).join(" + ");
        const cons = r.consequents.map(id => `<span style="color:var(--accent)">${productName(id)}</span>`).join(" + ");
        const actionClass = r.action === "Bundle Deal" ? "action-bundle"
                          : r.action === "Cross-Sell"  ? "action-crosssell"
                          : "action-soft";
        const convTxt = r.conviction >= 99 ? "∞" : fmt(r.conviction, 2);
        tbody.innerHTML += `
            <tr>
                <td>${ants}</td>
                <td>${cons}</td>
                <td><span class="metric-pill">${fmt(r.support,4)}</span></td>
                <td><span class="metric-pill">${fmt(r.confidence,4)}</span></td>
                <td><span class="metric-pill lift">${fmt(r.lift,3)}</span></td>
                <td><span class="metric-pill lev">${fmt(r.leverage,4)}</span></td>
                <td><span class="metric-pill conv">${convTxt}</span></td>
                <td><span class="metric-pill score">${fmt(r.composite_score,3)}</span></td>
                <td>${stabilityBadge(r.stability)}</td>
                <td>${driftBadge(r.drift)}</td>
                <td><span class="action-chip ${actionClass}">${r.action}</span></td>
            </tr>`;
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — FREQUENT ITEMSETS
// ─────────────────────────────────────────────────────────────────────────────
function renderItemsets() {
    const d = currentData();
    if (!d) return;
    const el = document.getElementById("itemsets-grid");
    el.innerHTML = (d.frequent_itemsets || []).slice(0, 12).map((fs, i) => {
        const names = fs.items.map(id => currentProducts()[id]?.name ?? id);
        const emojis= fs.items.map(id => currentProducts()[id]?.emoji ?? "📦");
        return `
            <div class="itemset-card ${i < 3 ? 'itemset-top' : ''}">
                <div class="itemset-emojis">${emojis.join(" ")}</div>
                <div class="itemset-names">${names.join(" + ")}</div>
                <div class="itemset-sup">Support: <strong>${pct(fs.support)}</strong></div>
                <div class="itemset-count">${fs.count ?? "—"} transactions</div>
            </div>`;
    }).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — BUNDLE DEALS
// ─────────────────────────────────────────────────────────────────────────────
function renderBundleDeals() {
    const d = currentData();
    if (!d) return;
    const el = document.getElementById("bundle-deals-grid");
    el.innerHTML = (d.bundles || []).map(b => {
        const items = b.items || [];
        const emojis = items.map(id => currentProducts()[id]?.emoji ?? "📦").join(" ");
        const names  = b.item_names || items.map(id => currentProducts()[id]?.name ?? id);
        return `
            <div class="bundle-card">
                <div class="bundle-emojis">${emojis}</div>
                <div class="bundle-name">${names.join(" + ")}</div>
                <div class="bundle-pricing">
                    <span class="bundle-orig">$${b.original_price.toFixed(2)}</span>
                    <span class="bundle-price">$${b.bundle_price.toFixed(2)}</span>
                    <span class="bundle-disc">${b.discount_pct}% OFF</span>
                </div>
                <div class="bundle-savings">Save $${b.savings.toFixed(2)}</div>
                <div class="bundle-sup text-muted small">Co-purchase rate: ${pct(b.support)}</div>
            </div>`;
    }).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — PROMOS
// ─────────────────────────────────────────────────────────────────────────────
function renderPromos() {
    const d = currentData();
    if (!d) return;
    const el = document.getElementById("promos-list");
    el.innerHTML = (d.promos || []).map(p => {
        const trigEmojis = (p.trigger_items || []).map(id => currentProducts()[id]?.emoji ?? "📦").join("");
        const tarEmojis  = (p.target_items  || []).map(id => currentProducts()[id]?.emoji ?? "📦").join("");
        return `
            <div class="promo-item">
                <div class="promo-icons">${trigEmojis} <i class="ri-arrow-right-line"></i> ${tarEmojis}</div>
                <div class="promo-body">
                    <div class="promo-title">${p.title}</div>
                    <div class="promo-desc">${p.description}</div>
                    <div class="promo-meta">
                        <span class="chip chip-green">Lift ${fmt(p.lift,2)}×</span>
                        <span class="chip chip-blue">Conf ${pct(p.confidence)}</span>
                        <span class="chip chip-purple">${p.discount}% Discount</span>
                        <span class="chip chip-orange">${cap(p.type)}</span>
                    </div>
                </div>
            </div>`;
    }).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — BUSINESS INSIGHTS
// ─────────────────────────────────────────────────────────────────────────────
function renderInsights() {
    const d = currentData();
    if (!d) return;
    const el = document.getElementById("insights-grid");
    el.innerHTML = (d.insights || []).map(ins => `
        <div class="insight-card insight-${ins.type}">
            <div class="insight-icon"><i class="${ins.icon}"></i></div>
            <div class="insight-body">
                <div class="insight-title">${ins.title}</div>
                <div class="insight-desc">${ins.description}</div>
            </div>
        </div>`).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN — DATASET COMPARISON (always uses iteration 3 of each dataset)
// ─────────────────────────────────────────────────────────────────────────────
function renderComparison() {
    const dA = DATA.datasets?.A?.iterations?.["3"];
    const dB = DATA.datasets?.B?.iterations?.["3"];
    if (!dA || !dB) return;
    const el = document.getElementById("comparison-grid");

    const rows = [
        ["Transactions",     dA.stats.total_transactions.toLocaleString(), dB.stats.total_transactions.toLocaleString()],
        ["Unique Items",     dA.stats.unique_items,                        dB.stats.unique_items],
        ["Avg Basket Size",  dA.stats.avg_basket_size,                     dB.stats.avg_basket_size],
        ["Frequent Itemsets",dA.stats.frequent_itemsets,                   dB.stats.frequent_itemsets],
        ["Rules Found",      dA.stats.rules_count,                         dB.stats.rules_count],
        ["Min Support",      dA.config.min_support,                        dB.config.min_support],
        ["Min Confidence",   dA.config.min_confidence,                     dB.config.min_confidence],
        ["Top Rule Lift",    fmt(Math.max(...(dA.rules||[]).map(r=>r.lift)), 2)+"×",
                             fmt(Math.max(...(dB.rules||[]).map(r=>r.lift)), 2)+"×"],
        ["Stable Rules",     dA.stability_report.stable,                   dB.stability_report.stable],
        ["Drift Events",     (dA.drift_report||[]).length,                 (dB.drift_report||[]).length],
    ];

    el.innerHTML = `
        <table class="compare-table">
            <thead><tr><th>Metric</th><th>Dataset A (GameTech)</th><th>Dataset B (OfficePro)</th></tr></thead>
            <tbody>
                ${rows.map(([m,a,b]) => `<tr><td>${m}</td><td>${a}</td><td>${b}</td></tr>`).join('')}
            </tbody>
        </table>
        <div class="comparison-insight">
            <i class="ri-information-line"></i>
            <strong>Key difference:</strong> Dataset A (Gaming) has fewer but higher-lift rules (avg lift ~3×)
            reflecting tight equipment ecosystems (PC builds, console setups).
            Dataset B (Office) has more rules with moderate lift (~2.7×) because office products
            are more interchangeable — workflow-driven rather than ecosystem-driven.
        </div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// STOREFRONT — HERO STATS
// ─────────────────────────────────────────────────────────────────────────────
function renderHeroStats() {
    const d    = currentData();
    const ds   = DATA.datasets[STATE.dataset];
    if (!d) return;
    const el   = document.getElementById("hero-stats");
    el.innerHTML = `
        <div class="hero-stat"><div class="stat-num">${d.stats.total_transactions.toLocaleString()}</div><div class="stat-lbl">Transactions</div></div>
        <div class="hero-stat"><div class="stat-num">${d.stats.rules_count}</div><div class="stat-lbl">MBA Rules</div></div>
        <div class="hero-stat"><div class="stat-num">${d.stats.frequent_itemsets}</div><div class="stat-lbl">Item Patterns</div></div>
        <div class="hero-stat"><div class="stat-num">${STATE.iteration}</div><div class="stat-lbl">Learning Iter.</div></div>`;
    document.getElementById("dataset-chip").textContent =
        `Dataset ${STATE.dataset}: ${ds?.name}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// STOREFRONT — PRODUCT GRID (homepage ranked)
// ─────────────────────────────────────────────────────────────────────────────
function renderHomepage() {
    const d  = currentData();
    if (!d) return;
    const products = currentProducts();
    const grid = document.getElementById("homepage-products");
    grid.innerHTML = "";

    (d.homepage_ranking || []).forEach((item, idx) => {
        const p      = products[item.product_id];
        if (!p) return;
        const isTop  = idx < 2;
        const topTag = isTop ? `<div class="top-tag"><i class="ri-fire-fill"></i> Top Recommended</div>` : "";
        grid.innerHTML += `
            <div class="product-card ${isTop ? 'product-top' : ''}">
                ${topTag}
                <div class="product-emoji">${p.emoji}</div>
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-cat text-muted small">${p.category}</div>
                    <div class="product-price">$${p.price.toFixed(2)}</div>
                    <div class="product-score text-muted small">MBA score: ${item.score.toFixed(1)}</div>
                </div>
                <button class="btn btn-primary" onclick="addToCart('${item.product_id}')">
                    <i class="ri-shopping-cart-line"></i> Add to Cart
                </button>
            </div>`;
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// STOREFRONT — FREQUENTLY BOUGHT TOGETHER
// ─────────────────────────────────────────────────────────────────────────────
function renderFBT() {
    const d = currentData();
    if (!d) return;
    const products = currentProducts();
    const el = document.getElementById("fbt-section");
    el.innerHTML = (d.frequently_bought_together || []).slice(0, 6).map(fbt => {
        const emojis = fbt.items.map(id => products[id]?.emoji ?? "📦").join(" + ");
        const names  = fbt.items.map(id => products[id]?.name  ?? id).join(" + ");
        return `
            <div class="fbt-card">
                <div class="fbt-emojis">${emojis}</div>
                <div class="fbt-names">${names}</div>
                <div class="fbt-sup text-muted small">Bought together ${pct(fbt.support)} of the time</div>
                <button class="btn btn-outline btn-sm" onclick="addBundleToCart([${fbt.items.map(i=>`'${i}'`).join(',')}])">
                    <i class="ri-add-line"></i> Add Bundle
                </button>
            </div>`;
    }).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// STOREFRONT — PROMO BANNER
// ─────────────────────────────────────────────────────────────────────────────
function renderPromoBanner() {
    const d = currentData();
    if (!d) return;
    const el = document.getElementById("promo-container");
    const promos = d.promos || [];
    if (!promos.length) { el.innerHTML = ""; return; }
    const top = promos[0];
    const products = currentProducts();
    const trigEmojis = (top.trigger_items||[]).map(id=>products[id]?.emoji??"").join(" ");
    const tarEmojis  = (top.target_items ||[]).map(id=>products[id]?.emoji??"").join(" ");

    el.innerHTML = `
        <div class="promo-banner">
            <div class="promo-tag"><i class="ri-magic-line"></i> ML Dynamic Promo</div>
            <div class="promo-emojis">${trigEmojis} → ${tarEmojis}</div>
            <h3 class="promo-banner-title">${top.title}</h3>
            <p class="promo-banner-desc">${top.description}</p>
            <div class="promo-banner-metrics">
                <span>Lift ${fmt(top.lift,2)}×</span> ·
                <span>Confidence ${pct(top.confidence)}</span> ·
                <span>${top.discount}% off</span>
            </div>
        </div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CART
// ─────────────────────────────────────────────────────────────────────────────
function addToCart(pid) {
    const p = currentProducts()[pid];
    if (!p) return;
    STATE.cart.push({ id: pid, ...p });
    updateCart();
    openCart();
}

function addBundleToCart(pids) {
    pids.forEach(pid => {
        const p = currentProducts()[pid];
        if (p) STATE.cart.push({ id: pid, ...p });
    });
    updateCart();
    openCart();
}

function removeFromCart(idx) {
    STATE.cart.splice(idx, 1);
    updateCart();
}

function updateCart() {
    const cartItems   = document.getElementById("cart-items");
    const cartCount   = document.getElementById("cart-count");
    const cartTotal   = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

    cartCount.textContent = STATE.cart.length;

    if (STATE.cart.length === 0) {
        cartItems.innerHTML = `<div class="empty-cart"><i class="ri-shopping-basket-line"></i><p>Cart is empty</p></div>`;
        cartTotal.textContent = "$0.00";
        checkoutBtn.disabled = true;
        document.getElementById("cart-crosssell").style.display = "none";
        return;
    }

    checkoutBtn.disabled = false;
    let total = 0;
    cartItems.innerHTML = STATE.cart.map((item, i) => {
        total += item.price;
        return `
            <div class="cart-item">
                <div class="cart-emoji">${item.emoji}</div>
                <div class="cart-details">
                    <div class="cart-name">${item.name}</div>
                    <div class="cart-price" style="color:var(--primary)">$${item.price.toFixed(2)}</div>
                </div>
                <button class="icon-btn" onclick="removeFromCart(${i})"><i class="ri-delete-bin-line"></i></button>
            </div>`;
    }).join('');
    cartTotal.textContent = "$" + total.toFixed(2);
    renderCrossSell();
}

function renderCrossSell() {
    const d          = currentData();
    const crosssell  = document.getElementById("cart-crosssell");
    const list       = document.getElementById("crosssell-list");
    if (!d || STATE.cart.length === 0) { crosssell.style.display = "none"; return; }

    const cartIds = STATE.cart.map(i => i.id);
    const recs    = new Map();

    (d.cross_sell || {});
    // Gather cross-sell from rules
    (d.rules || []).forEach(rule => {
        const hasAllAnts = rule.antecedents.every(id => cartIds.includes(id));
        if (hasAllAnts) {
            rule.consequents.forEach(cid => {
                if (!cartIds.includes(cid)) {
                    if (!recs.has(cid) || recs.get(cid).score < rule.confidence * rule.lift) {
                        recs.set(cid, {
                            confidence: rule.confidence,
                            lift:        rule.lift,
                            score:       rule.confidence * rule.lift,
                        });
                    }
                }
            });
        }
    });

    if (recs.size === 0) { crosssell.style.display = "none"; return; }

    const products = currentProducts();
    const sorted   = [...recs.entries()].sort((a,b) => b[1].score - a[1].score).slice(0,4);
    list.innerHTML  = sorted.map(([pid, info]) => {
        const p = products[pid];
        if (!p) return "";
        return `
            <div class="cs-item">
                <span class="cs-emoji">${p.emoji}</span>
                <div class="cs-info">
                    <div class="cs-name">${p.name}</div>
                    <div class="cs-conf text-muted small">Conf ${pct(info.confidence)} · Lift ${fmt(info.lift,2)}×</div>
                </div>
                <button class="cs-add-btn" onclick="addToCart('${pid}')"><i class="ri-add-line"></i></button>
            </div>`;
    }).join('');
    crosssell.style.display = "block";
}

// ─────────────────────────────────────────────────────────────────────────────
// CART SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
function openCart() {
    document.getElementById("cart-sidebar").classList.add("open");
    document.getElementById("cart-overlay").classList.add("active");
}
function closeCart() {
    document.getElementById("cart-sidebar").classList.remove("open");
    document.getElementById("cart-overlay").classList.remove("active");
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER EVERYTHING
// ─────────────────────────────────────────────────────────────────────────────
function renderAll() {
    // Admin
    renderDiagnostics();
    renderStabilityDrift();
    renderThresholdHistory();
    renderRulesTable();
    renderItemsets();
    renderBundleDeals();
    renderPromos();
    renderInsights();
    renderComparison();
    // Storefront
    renderHeroStats();
    renderHomepage();
    renderFBT();
    renderPromoBanner();
    // Cart (update cross-sell)
    renderCrossSell();
}

// ─────────────────────────────────────────────────────────────────────────────
// IN-BROWSER FP-GROWTH  (runs on uploaded CSV — no server needed)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Minimal FP-Growth implementation in JavaScript.
 * Mirrors the Python engine logic so uploaded CSVs get the same analysis.
 */
function jsFPGrowth(transactions, minSup) {
    const n        = transactions.length;
    const minCount = Math.max(1, Math.floor(minSup * n));

    // Count 1-itemsets
    const freq = {};
    transactions.forEach(t => t.forEach(item => { freq[item] = (freq[item] || 0) + 1; }));
    const freqItems = Object.fromEntries(Object.entries(freq).filter(([, c]) => c >= minCount));

    if (!Object.keys(freqItems).length) return {};

    const patterns = {};

    // Sort items descending by frequency
    function sortedItems(t) {
        return t.filter(i => freqItems[i] >= minCount)
                .sort((a, b) => freqItems[b] - freqItems[a] || a.localeCompare(b));
    }

    function mine(txns, prefix) {
        // Count items in this projected database
        const counts = {};
        txns.forEach(t => t.forEach(i => { counts[i] = (counts[i] || 0) + 1; }));

        // Sort items ascending by frequency (bottom-up)
        const items = Object.keys(counts).filter(i => counts[i] >= minCount)
                            .sort((a, b) => counts[a] - counts[b]);

        for (const item of items) {
            const newPat = [...prefix, item].sort().join('\x00');
            patterns[newPat] = counts[item];

            // Build conditional database
            const condTxns = [];
            txns.forEach(t => {
                if (t.includes(item)) {
                    const path = t.filter(i => i !== item && counts[i] >= minCount);
                    if (path.length) condTxns.push(path);
                }
            });

            if (condTxns.length) mine(condTxns, [...prefix, item]);
        }
    }

    // Prepare sorted transactions
    const sortedTxns = transactions.map(sortedItems).filter(t => t.length);
    mine(sortedTxns, []);

    // Also add single frequent items
    Object.entries(freqItems).forEach(([item, cnt]) => {
        const key = item;
        if (!(key in patterns)) patterns[key] = cnt;
    });

    return patterns;
}

function jsGenRules(patterns, n, minConf) {
    const suppMap = {};
    Object.entries(patterns).forEach(([k, cnt]) => { suppMap[k] = cnt / n; });

    function powerset(arr) {
        const result = [[]];
        arr.forEach(item => {
            const newSubs = result.map(s => [...s, item]);
            result.push(...newSubs);
        });
        return result.filter(s => s.length > 0 && s.length < arr.length);
    }

    const rules = [];
    Object.entries(patterns).forEach(([key, cnt]) => {
        const items = key.split('\x00');
        if (items.length < 2) return;
        const sup = cnt / n;

        powerset(items).forEach(ant => {
            const con = items.filter(i => !ant.includes(i));
            if (!con.length) return;
            const antKey  = [...ant].sort().join('\x00');
            const conKey  = [...con].sort().join('\x00');
            const antSup  = suppMap[antKey] || 0;
            const conSup  = suppMap[conKey] || 0;
            if (!antSup) return;
            const conf = sup / antSup;
            if (conf < minConf) return;
            const lift     = conSup > 0 ? conf / conSup : 0;
            const leverage = sup - antSup * conSup;
            const conv     = conf >= 1 ? 999 : (1 - conSup) / (1 - conf);
            rules.push({
                antecedents: ant.sort(),
                consequents: con.sort(),
                support:     +sup.toFixed(5),
                confidence:  +conf.toFixed(5),
                lift:        +lift.toFixed(4),
                leverage:    +leverage.toFixed(5),
                conviction:  +Math.min(conv, 999).toFixed(3),
            });
        });
    });

    return rules.sort((a, b) => b.lift - a.lift);
}

/** Auto-tune thresholds: binary search for 8-25 rules */
function jsAutoTune(transactions, mineFn) {
    let supLo = 0.01, supHi = 0.30;
    let bestSup = (supLo + supHi) / 2;
    let bestConf = 0.50;
    let bestRules = [];
    const history = [];

    for (let step = 0; step < 14; step++) {
        const rules = mineFn(bestSup, bestConf);
        const nQ    = rules.filter(r => r.lift >= 1.5 && r.confidence >= 0.4).length;
        history.push({ step: step+1, min_sup: +bestSup.toFixed(5), min_conf: +bestConf.toFixed(5), quality_rules: nQ, total_rules: rules.length });
        bestRules = rules;
        if (nQ >= 8 && nQ <= 25) break;
        if (nQ < 8) { supHi = bestSup; bestSup = (supLo + supHi) / 2; bestConf = Math.max(0.30, bestConf - 0.04); }
        else         { supLo = bestSup; bestSup = (supLo + supHi) / 2; bestConf = Math.min(0.90, bestConf + 0.04); }
    }
    return { sup: +bestSup.toFixed(5), conf: +bestConf.toFixed(5), rules: bestRules, history };
}

// ── CSV Parser ──
function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
    if (!lines.length) return [];

    // Detect if there's a header row
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes('transaction') || firstLine.includes('item') || firstLine.includes('id');
    const dataLines = hasHeader ? lines.slice(1) : lines;

    const transactions = [];
    dataLines.forEach(line => {
        // Try multiple formats:
        //  Format 1: id,item1|item2|item3  (our format)
        //  Format 2: item1,item2,item3     (plain CSV)
        //  Format 3: item1 item2 item3     (space separated)
        let items = [];
        if (line.includes('|')) {
            // Our format: second column has pipe-separated items
            const cols  = line.split(',');
            const itemCol = cols.length > 1 ? cols[1] : cols[0];
            items = itemCol.split('|').map(s => s.trim()).filter(Boolean);
        } else {
            // Treat whole line as comma-separated items (skip numeric-only first col)
            const cols = line.split(',').map(s => s.trim()).filter(Boolean);
            // If first column is purely numeric, skip it (it's an ID)
            items = (cols.length > 1 && /^\d+$/.test(cols[0])) ? cols.slice(1) : cols;
        }
        if (items.length) transactions.push(items);
    });
    return transactions;
}

// ── Render upload results ──
function renderUploadResults(transactions, fileName) {
    const n = transactions.length;
    if (n < 2) { showUploadStatus("error", "No valid transactions found. Check CSV format."); return; }

    showUploadStatus("processing", `Running FP-Growth on ${n} transactions...`);

    // Use setTimeout so the status message renders before computation blocks
    setTimeout(() => {
        const mineFn = (sup, conf) => {
            const pats  = jsFPGrowth(transactions, sup);
            return jsGenRules(pats, n, conf);
        };

        const { sup, conf, rules, history } = jsAutoTune(transactions, mineFn);
        const patterns = jsFPGrowth(transactions, sup);

        // Stats
        const sizes    = transactions.map(t => t.length);
        const avgSize  = (sizes.reduce((a, b) => a + b, 0) / sizes.length).toFixed(2);
        const allItems = [...new Set(transactions.flat())];

        // Render stats
        document.getElementById("upload-stats-block").innerHTML = `
            <div class="metric-row"><span>Transactions</span><strong>${n.toLocaleString()}</strong></div>
            <div class="metric-row"><span>Unique Items</span><strong>${allItems.length}</strong></div>
            <div class="metric-row"><span>Avg Basket Size</span><strong>${avgSize}</strong></div>
            <div class="metric-row"><span>Frequent Itemsets</span><strong>${Object.keys(patterns).length}</strong></div>
            <div class="metric-row"><span>Rules Found</span><strong>${rules.length}</strong></div>`;

        document.getElementById("upload-config-block").innerHTML = `
            <div class="metric-row"><span>Algorithm</span><strong>FP-Growth (JS)</strong></div>
            <div class="metric-row"><span>Min Support</span><strong>${sup} (auto)</strong></div>
            <div class="metric-row"><span>Min Confidence</span><strong>${conf} (auto)</strong></div>
            <div class="metric-row"><span>Tuning Steps</span><strong>${history.length}</strong></div>`;

        // Rules table
        const tbody = document.getElementById("upload-rules-tbody");
        tbody.innerHTML = rules.slice(0, 20).map(r => `
            <tr>
                <td><strong>${r.antecedents.join(" + ")}</strong></td>
                <td><span style="color:var(--accent)">${r.consequents.join(" + ")}</span></td>
                <td><span class="metric-pill">${r.support}</span></td>
                <td><span class="metric-pill">${r.confidence}</span></td>
                <td><span class="metric-pill lift">${r.lift}</span></td>
                <td><span class="metric-pill lev">${r.leverage}</span></td>
                <td><span class="metric-pill conv">${r.conviction >= 999 ? "∞" : r.conviction}</span></td>
            </tr>`).join('') || `<tr><td colspan="7" class="text-muted" style="text-align:center;">No rules found — try more transactions or adjust thresholds.</td></tr>`;

        // Top itemsets
        const topSets = Object.entries(patterns)
            .filter(([k]) => k.includes('\x00'))
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);

        document.getElementById("upload-itemsets-block").innerHTML = topSets.map(([key, cnt]) => {
            const items = key.split('\x00');
            return `
                <div class="itemset-card">
                    <div class="itemset-names">${items.join(" + ")}</div>
                    <div class="itemset-sup">Support: <strong>${(cnt/n*100).toFixed(1)}%</strong></div>
                    <div class="itemset-count">${cnt} transactions</div>
                </div>`;
        }).join('') || `<div class="text-muted small">No multi-item sets above threshold.</div>`;

        document.getElementById("upload-file-name").textContent = fileName;
        document.getElementById("upload-status").style.display  = "none";
        document.getElementById("upload-results").style.display = "block";
    }, 50);
}

function showUploadStatus(type, msg) {
    const el = document.getElementById("upload-status");
    el.style.display = "block";
    document.getElementById("upload-results").style.display = "none";
    const icon = type === "error" ? "ri-error-warning-line" : "ri-loader-4-line ri-spin";
    const cls  = type === "error" ? "text-muted" : "chip chip-green";
    el.innerHTML = `<div class="upload-status-msg"><i class="${icon}"></i> ${msg}</div>`;
}

// ── Wire up upload zone (multi-file support) ──
function setupUploadZone() {
    const zone  = document.getElementById("upload-zone");
    const input = document.getElementById("csv-file-input");

    function handleFiles(files) {
        const csvFiles = Array.from(files).filter(f => f.name.endsWith(".csv"));
        if (!csvFiles.length) {
            showUploadStatus("error", "Please upload at least one .csv file.");
            return;
        }
        const label = csvFiles.length === 1
            ? csvFiles[0].name
            : `${csvFiles.length} files (${csvFiles.map(f => f.name).join(", ")})`;
        showUploadStatus("processing", `Reading ${label}...`);

        // Read all files, then merge transactions
        let done = 0;
        const allTransactions = [];
        csvFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = e => {
                allTransactions.push(...parseCSV(e.target.result));
                done++;
                if (done === csvFiles.length) {
                    renderUploadResults(allTransactions, label);
                }
            };
            reader.readAsText(file);
        });
    }

    zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("zone-hover"); });
    zone.addEventListener("dragleave", ()  => zone.classList.remove("zone-hover"));
    zone.addEventListener("drop", e => {
        e.preventDefault();
        zone.classList.remove("zone-hover");
        handleFiles(e.dataTransfer.files);
    });
    input.addEventListener("change", e => handleFiles(e.target.files));
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT LISTENERS
// ─────────────────────────────────────────────────────────────────────────────

// View switching
document.getElementById("tab-admin").addEventListener("click", () => {
    document.getElementById("admin-view").classList.add("active");
    document.getElementById("storefront-view").classList.remove("active");
    document.getElementById("tab-admin").classList.add("active");
    document.getElementById("tab-storefront").classList.remove("active");
});
document.getElementById("tab-storefront").addEventListener("click", () => {
    document.getElementById("storefront-view").classList.add("active");
    document.getElementById("admin-view").classList.remove("active");
    document.getElementById("tab-storefront").classList.add("active");
    document.getElementById("tab-admin").classList.remove("active");
});

// Dataset tabs
document.querySelectorAll(".ds-tab").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".ds-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        STATE.dataset   = btn.dataset.dataset;
        STATE.iteration = 1;
        updateIterButtons();
        renderAll();
    });
});

// Iteration buttons
function updateIterButtons() {
    document.querySelectorAll(".iter-btn").forEach(btn => {
        btn.classList.toggle("active", parseInt(btn.dataset.iter) === STATE.iteration);
    });
    document.getElementById("iter-display").textContent = STATE.iteration;
}
document.querySelectorAll(".iter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        STATE.iteration = parseInt(btn.dataset.iter);
        updateIterButtons();
        renderAll();
    });
});

// Auto-iterate
document.getElementById("auto-iterate-btn").addEventListener("click", () => {
    const btn = document.getElementById("auto-iterate-btn");
    if (STATE.autoIter) {
        clearInterval(STATE.autoIter);
        STATE.autoIter = null;
        btn.innerHTML  = '<i class="ri-play-circle-line"></i> Auto-Iterate';
        return;
    }
    btn.innerHTML = '<i class="ri-stop-circle-line"></i> Stop';
    STATE.autoIter = setInterval(() => {
        STATE.iteration = STATE.iteration >= 3 ? 1 : STATE.iteration + 1;
        updateIterButtons();
        renderAll();
        // Pulse indicator
        const dot = document.querySelector(".learning-pill .pulse-dot");
        if (dot) { dot.style.background = "#3B82F6"; setTimeout(()=>dot.style.background="", 600); }
    }, 2500);
});

// Cart
document.getElementById("cart-btn").addEventListener("click",     openCart);
document.getElementById("close-cart").addEventListener("click",   closeCart);
document.getElementById("cart-overlay").addEventListener("click", closeCart);

// ─────────────────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────────────────
renderAll();
setupUploadZone();
console.log("[NexusCart] MBA_DATA loaded from:", typeof MBA_DATA !== "undefined" ? "frontend_data.js (Python-generated)" : "DEMO_DATA (fallback)");
