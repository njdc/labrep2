const PRODUCTS = [
    { id: '101', name: 'Keyboard', price: 129.00, img: '⌨️' },
    { id: '102', name: 'Mouse', price: 79.00, img: '🖱️' },
    { id: '103', name: 'VR Headset', price: 499.00, img: '🥽' },
    { id: '104', name: 'PS5 Console', price: 499.00, img: '🎮' },
    { id: '105', name: 'Xbox Series X', price: 499.00, img: '❎' },
    { id: '106', name: 'Gaming Chair', price: 299.00, img: '🪑' },
    { id: '107', name: 'Monitor', price: 349.00, img: '🖥️' },
    { id: '108', name: 'Gaming Laptop', price: 1499.00, img: '💻' }
];

// Simulated Backend Engine State
let STATE = {
    cart: [],
    iteration: 3,
    ml_rules: [],
    homepage_ranks: [],
    active_promo: null
};

// --- SIMULATED MBA ENGINE (FP-Growth Inspired) ---
// This simulates the self-learning backend output after processing transactions
function generateEngineData(iteration) {
    // As iteration increases, the ML model "detects" more nuanced patterns from new data batches.

    let rules = [];
    if (iteration === 1) {
        // Basic initial patterns (Obvious links)
        rules = [
            { ant: ['108'], con: ['102'], sup: 0.15, conf: 0.60, lift: 2.1, desc: 'Laptop -> Mouse' },
            { ant: ['104'], con: ['103'], sup: 0.12, conf: 0.50, lift: 1.8, desc: 'PS5 -> VR Headset' }
        ];
    } else if (iteration === 2) {
        // Data update 1: Detecting ecosystem buying
        rules = [
            { ant: ['108'], con: ['102'], sup: 0.14, conf: 0.59, lift: 2.0, desc: 'Laptop -> Mouse (Stable)' },
            { ant: ['108', '102'], con: ['101'], sup: 0.08, conf: 0.70, lift: 3.5, desc: 'Laptop+Mouse -> Keyboard (New Pattern)' },
            { ant: ['105'], con: ['106'], sup: 0.18, conf: 0.35, lift: 1.5, desc: 'Xbox -> Gaming Chair' }
        ];
    } else {
        // Iteration 3: Auto-tuning thresholds & detecting deep cross-category bundles
        rules = [
            { ant: ['108'], con: ['102'], sup: 0.15, conf: 0.62, lift: 2.2, desc: 'Laptop -> Mouse (Stable)' },
            { ant: ['108', '102'], con: ['101'], sup: 0.09, conf: 0.75, lift: 3.8, desc: 'Laptop+Mouse -> Keyboard (Strong)' },
            { ant: ['107'], con: ['108', '106'], sup: 0.05, conf: 0.45, lift: 4.1, desc: 'Monitor -> Laptop + Chair' },
            { ant: ['104'], con: ['106'], sup: 0.10, conf: 0.25, lift: 1.2, desc: 'PS5 -> Chair (Discovered)' }
        ];
    }

    // Sort products for Homepage based on Lift & Support scores weighting
    // Simulating "Homepage Ranking Logic"
    const ranks = PRODUCTS.map(p => {
        let score = 1.0;
        // Boost items that are strong consequents
        rules.forEach(r => {
            if (r.con.includes(p.id)) score += (r.lift * r.sup * 10);
            if (r.ant.includes(p.id)) score += (r.sup * 5); // popular anchors
        });
        return { ...p, score };
    }).sort((a, b) => b.score - a.score);

    // Business Logic: Generate a promo if a strong trio exists
    let promo = null;
    const bestRule = rules.sort((a, b) => b.lift - a.lift)[0];
    if (bestRule && bestRule.lift > 3) {
        const item1 = PRODUCTS.find(p => p.id === bestRule.ant[0]);
        const item2 = PRODUCTS.find(p => p.id === bestRule.con[0]);
        promo = {
            title: `Ultimate Productivity Bundle`,
            desc: `Buy a ${item1.name} and get 20% off a ${item2.name}!`,
            triggerId: item1.id,
            targetId: item2.id
        };
    }

    STATE.ml_rules = rules;
    STATE.homepage_ranks = ranks;
    STATE.active_promo = promo;
}


// --- UI RENDERING ---

function renderHomepage() {
    const grid = document.getElementById('homepage-products');
    grid.innerHTML = '';

    STATE.homepage_ranks.forEach((p, index) => {
        // Tag top 2 as bundle suggestions based on ML
        const isBundleTarget = index < 2 ? 'bundle-suggestion' : '';
        const tagHtml = isBundleTarget ? `<div style="position:absolute; top:10px; right:12px;" class="tag"><i class="ri-fire-fill"></i> Highly Recommended</div>` : '';

        grid.innerHTML += `
            <div class="product-card ${isBundleTarget}">
                ${tagHtml}
                <div class="product-img" style="font-size: 5rem; display:flex; align-items:center; justify-content:center;">${p.img}</div>
                <div class="product-info">
                    <div class="product-title">${p.name}</div>
                    <div class="product-price">$${p.price.toFixed(2)}</div>
                </div>
                <button class="btn btn-primary" onclick="addToCart('${p.id}')">
                    <i class="ri-shopping-cart-line"></i> Add to Cart
                </button>
            </div>
        `;
    });

    renderPromo();
}

function renderPromo() {
    const banner = document.getElementById('promo-banner');
    if (STATE.active_promo) {
        banner.innerHTML = `
            <div class="promo-banner">
                <div class="promo-content">
                    <div class="tag" style="background: rgba(255,255,255,0.2); color:white; width:fit-content; margin-bottom: 1rem;">
                        <i class="ri-magic-line"></i> ML Dynamic Promo
                    </div>
                    <div class="promo-title">${STATE.active_promo.title}</div>
                    <div class="promo-desc">${STATE.active_promo.desc}</div>
                </div>
                <div style="font-size:4rem; opacity:0.8;">🎁</div>
            </div>
        `;
        banner.style.display = 'block';
    } else {
        banner.style.display = 'none';
    }
}

function renderAdmin() {
    document.getElementById('iteration-counter').innerText = STATE.iteration;
    const tbody = document.getElementById('rules-table-body');
    tbody.innerHTML = '';

    STATE.ml_rules.sort((a, b) => b.lift - a.lift).forEach(r => {
        const ants = r.ant.map(id => PRODUCTS.find(p => p.id === id).name).join(' + ');
        const cons = r.con.map(id => PRODUCTS.find(p => p.id === id).name).join(' + ');

        tbody.innerHTML += `
            <tr>
                <td><strong>${ants}</strong></td>
                <td><span style="color:var(--accent)">${cons}</span></td>
                <td><span class="badge-metric">${r.sup.toFixed(3)}</span></td>
                <td><span class="badge-metric">${r.conf.toFixed(3)}</span></td>
                <td><span class="badge-metric" style="background:rgba(16,185,129,0.2); color:var(--accent)">${r.lift.toFixed(2)}</span></td>
                <td><span style="font-size:0.85rem; color:var(--text-muted);">${r.desc}</span></td>
            </tr>
        `;
    });
}

function updateCartUI() {
    const list = document.getElementById('cart-items');
    const count = document.querySelector('.cart-count');
    const totalEl = document.getElementById('cart-total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');

    count.innerText = STATE.cart.length;

    if (STATE.cart.length === 0) {
        list.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
        totalEl.innerText = '$0.00';
        checkoutBtn.disabled = true;
        document.getElementById('cart-recommendations').style.display = 'none';
        return;
    }

    checkoutBtn.disabled = false;
    list.innerHTML = '';
    let total = 0;

    STATE.cart.forEach((item, index) => {
        total += item.price;
        list.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-img" style="font-size: 2rem; display:flex; align-items:center; justify-content:center;">${item.img}</div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <button class="close-btn" style="font-size:1.2rem;" onclick="removeFromCart(${index})">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        `;
    });

    totalEl.innerText = '$' + total.toFixed(2);

    // Process Cross-Sells based on Cart contents
    processCrossSells();
}

function processCrossSells() {
    const recContainer = document.getElementById('cart-recommendations');
    const recList = document.getElementById('recommendation-list');

    if (STATE.cart.length === 0) return;

    const cartIds = STATE.cart.map(i => i.id);
    let recommendations = new Set();

    // Look for rules where the antecedent is fully in the cart
    STATE.ml_rules.forEach(rule => {
        const hasAllAntecedents = rule.ant.every(id => cartIds.includes(id));
        if (hasAllAntecedents) {
            rule.con.forEach(targetId => {
                if (!cartIds.includes(targetId)) {
                    recommendations.add(targetId);
                }
            });
        }
    });

    if (recommendations.size > 0) {
        recContainer.style.display = 'block';
        recList.innerHTML = '';
        Array.from(recommendations).forEach(id => {
            const p = PRODUCTS.find(p => p.id === id);
            recList.innerHTML += `
                <div class="rec-item">
                    <div class="rec-info">
                        <div class="title">${p.name}</div>
                        <div class="price">+$${p.price.toFixed(2)}</div>
                    </div>
                    <button class="rec-add-btn" onclick="addToCart('${p.id}')">
                        <i class="ri-add-line"></i> Add
                    </button>
                </div>
            `;
        });
    } else {
        recContainer.style.display = 'none';
    }
}

// --- ACTIONS ---

function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (product) {
        STATE.cart.push(product);
        updateCartUI();
        openCart();
    }
}

function removeFromCart(index) {
    STATE.cart.splice(index, 1);
    updateCartUI();
}

// Sidebar logic
const sidebar = document.getElementById('cart-sidebar');
const overlay = document.getElementById('cart-overlay');
function openCart() {
    sidebar.classList.add('open');
    overlay.style.display = 'block';
    setTimeout(() => overlay.style.opacity = '1', 10);
}
function closeCart() {
    sidebar.classList.remove('open');
    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.display = 'none', 300);
}

document.getElementById('cart-btn').addEventListener('click', openCart);
document.getElementById('close-cart').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

// View Switching
const links = document.querySelectorAll('.nav-links a');
links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        if (link.id === 'admin-toggle') {
            document.getElementById('admin-view').classList.add('active');
        } else {
            document.getElementById('storefront-view').classList.add('active');
        }
    });
});

// Simulate Iterative Learning Update
document.getElementById('trigger-update-btn').addEventListener('click', () => {
    let btn = document.getElementById('trigger-update-btn');
    btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Ingesting Next Dataset...';
    btn.disabled = true;

    setTimeout(() => {
        STATE.iteration = STATE.iteration >= 3 ? 1 : STATE.iteration + 1; // Cycle 1 -> 2 -> 3
        generateEngineData(STATE.iteration);
        renderHomepage();
        renderAdmin();
        updateCartUI();

        btn.innerHTML = '<i class="ri-refresh-line"></i> Simulate Data Ingestion (Iterate)';
        btn.disabled = false;

        // Flash the live indicator to show update
        const ind = document.querySelector('.status-indicator');
        ind.style.backgroundColor = '#3B82F6';
        setTimeout(() => ind.style.backgroundColor = 'var(--accent)', 1000);
    }, 1500);
});

// Initialize
generateEngineData(STATE.iteration);
renderHomepage();
renderAdmin();
updateCartUI();
