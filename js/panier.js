// ====================================================
// SYSTÈME DE PANIER - Elytech
// ====================================================

(function () {
    'use strict';

    const CART_KEY = 'elytech_panier';

    // ==================== GESTION DU PANIER ====================

    class CartManager {
        constructor() {
            this.cart = this.loadCart();
        }

        loadCart() {
            try {
                const stored = localStorage.getItem(CART_KEY);
                return stored ? JSON.parse(stored) : [];
            } catch (e) {
                console.error('Erreur chargement panier:', e);
                return [];
            }
        }

        saveCart() {
            try {
                localStorage.setItem(CART_KEY, JSON.stringify(this.cart));
                window.dispatchEvent(new Event('cartChanged'));
            } catch (e) {;
                console.error('Erreur sauvegarde panier:', e);
            }
        }

        addItem(product) {
            const existing = this.cart.find(item => item.id === product.id);
            if (existing) {
                existing.quantity += 1;
            } else {
                this.cart.push({ ...product, quantity: 1 });
            }
            this.saveCart();
        }

        removeItem(productId) {
            this.cart = this.cart.filter(item => item.id !== productId);
            this.saveCart();
        }

        updateQuantity(productId, quantity) {
            const item = this.cart.find(item => item.id === productId);
            if (item) {
                item.quantity = Math.max(1, quantity);
                this.saveCart();
            }
        }

        getCart() {
            return this.cart;
        }

        getTotal() {
            return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        getCount() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        }

        isInCart(productId) {
            return this.cart.some(item => item.id === productId);
        }
    }

    // ==================== PAGE PRODUIT ====================

    function initProductPage() {
        const btn = document.querySelector('.btn-add-cart');
        if (!btn) return;

        const cartManager = new CartManager();

        // Récupérer les infos du produit depuis la page
        const titleEl = document.querySelector('.product-title-bar h1');
        const priceEl = document.querySelector('.price-amount');
        const imageEl = document.querySelector('.gallery-main-image img');

        const product = {
            id: titleEl ? titleEl.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 'produit-' + Date.now(),
            name: titleEl ? titleEl.textContent.trim() : 'Produit',
            price: priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9]/g, '')) : 0,
            image: imageEl ? imageEl.src : '',
        };

        // État initial du bouton
        updateCartButton(btn, cartManager.isInCart(product.id));

        btn.addEventListener('click', function () {
            cartManager.addItem(product);
            updateCartButton(btn, true);
            showToast(`✅ "${product.name}" ajouté au panier !`);
        });

        // Mise à jour du compteur dans la navbar
        updateCartBadge(cartManager.getCount());
        window.addEventListener('cartChanged', () => updateCartBadge(cartManager.getCount()));
    }

    function updateCartButton(btn, inCart) {
        if (inCart) {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Déjà dans le panier';
            btn.style.backgroundColor = '#4caf50';
            btn.style.color = 'white';
        } else {
            btn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Ajouter au panier';
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }
    }

    // ==================== PAGE PANIER ====================

    function initCartPage() {
        const grid = document.querySelector('.favoris-grid');
        const emptyState = document.querySelector('.empty-state');
        if (!grid) return;

        const cartManager = new CartManager();

        function renderCart() {
            const cart = cartManager.getCart();

            if (cart.length === 0) {
                grid.style.display = 'none';
                if (emptyState) emptyState.style.display = 'block';
                removeSummary();
                return;
            }

            grid.style.display = 'grid';
            if (emptyState) emptyState.style.display = 'none';

            grid.innerHTML = cart.map(item => `
                <article class="recipe-card cart-card" data-product-id="${item.id}">
                    <img src="${item.image || '/images/placeholder.jpg'}" alt="${item.name}" onerror="this.src='/images/placeholder.jpg'">
                    <div class="recipe-info">
                        <h4 class="recipe-title">${item.name}</h4>
                        <div class="cart-price">${item.price} €</div>
                        <div class="cart-quantity">
                            <button class="qty-btn qty-minus" data-id="${item.id}">−</button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
                        </div>
                        <div class="cart-subtotal">Sous-total : <strong>${(item.price * item.quantity)} €</strong></div>
                        <button class="remove-btn" data-id="${item.id}">
                            <i class="fa-solid fa-trash"></i> Supprimer
                        </button>
                    </div>
                </article>
            `).join('');

            renderSummary(cartManager.getTotal(), cartManager.getCount());
            attachCartEvents(cartManager, renderCart);
        }

        renderCart();
        window.addEventListener('cartChanged', renderCart);
    }

    function attachCartEvents(cartManager, renderCart) {
        document.querySelectorAll('.qty-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = cartManager.getCart().find(i => i.id === id);
                if (item && item.quantity > 1) {
                    cartManager.updateQuantity(id, item.quantity - 1);
                } else {
                    cartManager.removeItem(id);
                }
                renderCart();
            });
        });

        document.querySelectorAll('.qty-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = cartManager.getCart().find(i => i.id === id);
                if (item) cartManager.updateQuantity(id, item.quantity + 1);
                renderCart();
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                cartManager.removeItem(btn.dataset.id);
                renderCart();
            });
        });
    }

    function renderSummary(total, count) {
        removeSummary();
        const summary = document.createElement('div');
        summary.className = 'cart-summary';
        summary.id = 'cart-summary';
        summary.innerHTML = `
            <div class="cart-summary-inner">
                <h2>Récapitulatif</h2>
                <div class="summary-line"><span>Articles (${count})</span><span>${total} €</span></div>
                <div class="summary-line"><span>Livraison</span><span>Gratuite</span></div>
                <div class="summary-line summary-total"><span>Total</span><span>${total} €</span></div>
                <button class="btn-checkout" onclick="window.location.href='page_confirmation.html'">Commander</button>
            </div>
        `;
        const footer = document.querySelector('.footer-main');
        if (footer) footer.insertAdjacentElement('beforebegin', summary);
    }

    function removeSummary() {
        const existing = document.getElementById('cart-summary');
        if (existing) existing.remove();
    }

    // ==================== BADGE COMPTEUR ====================

    function updateCartBadge(count) {
        let badge = document.getElementById('cart-badge');
        const cartIcon = document.querySelector('a[href="page_panier.html"]');
        if (!cartIcon) return;

        if (!badge) {
            badge = document.createElement('span');
            badge.id = 'cart-badge';
            badge.style.cssText = `
                position: absolute;
                top: -6px;
                right: -6px;
                background: #FFBE30;
                color: #173334;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                font-size: 11px;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Kadwa', serif;
            `;
            cartIcon.style.position = 'relative';
            cartIcon.appendChild(badge);
        }

        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }

    // ==================== TOAST ====================

    function showToast(message) {
        let toast = document.getElementById('cart-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cart-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: #173334;
                color: white;
                padding: 14px 24px;
                border-radius: 10px;
                font-family: 'Kadwa', serif;
                font-size: 0.95rem;
                box-shadow: 0 4px 16px rgba(0,0,0,0.25);
                z-index: 9999;
                transition: opacity 0.4s ease, transform 0.4s ease;
                opacity: 0;
                transform: translateY(20px);
            `;
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';

        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
        }, 3000);
    }

    // ==================== STYLES DYNAMIQUES ====================

    const style = document.createElement('style');
    style.textContent = `
        .cart-price {
            font-size: 1.4rem;
            font-weight: 700;
            color: #173334;
            margin: 8px 0;
        }
        .cart-quantity {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 10px 0;
        }
        .qty-btn {
            width: 32px;
            height: 32px;
            border: 2px solid #173334;
            background: white;
            border-radius: 50%;
            font-size: 1.1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s, color 0.2s;
        }
        .qty-btn:hover {
            background: #173334;
            color: white;
        }
        .qty-value {
            font-size: 1.1rem;
            font-weight: 700;
            min-width: 24px;
            text-align: center;
        }
        .cart-subtotal {
            font-size: 0.9rem;
            color: #555;
            margin-bottom: 12px;
        }
        .remove-btn {
            background: none;
            border: 1px solid #e63946;
            color: #e63946;
            padding: 7px 14px;
            border-radius: 20px;
            cursor: pointer;
            font-family: 'Kadwa', serif;
            font-size: 0.85rem;
            transition: background 0.2s, color 0.2s;
        }
        .remove-btn:hover {
            background: #e63946;
            color: white;
        }
        .cart-summary {
            max-width: 500px;
            margin: 0 auto 60px;
            padding: 0 20px;
        }
        .cart-summary-inner {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        .cart-summary-inner h2 {
            color: #173334;
            margin: 0 0 20px 0;
            font-size: 1.5rem;
        }
        .summary-line {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
            color: #555;
        }
        .summary-total {
            font-weight: 700;
            font-size: 1.2rem;
            color: #173334;
            border-bottom: none;
            margin-top: 5px;
        }
        .btn-checkout {
            width: 100%;
            margin-top: 20px;
            padding: 14px;
            background: #FFBE30;
            color: #173334;
            border: none;
            border-radius: 8px;
            font-family: 'Kadwa', serif;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.3s;
        }
        .btn-checkout:hover {
            background: #e6aa1f;
        }
    `;
    document.head.appendChild(style);

    // ==================== INITIALISATION ====================

    document.addEventListener('DOMContentLoaded', function () {
        const cartManager = new CartManager();
        updateCartBadge(cartManager.getCount());

        if (document.querySelector('.btn-add-cart')) {
            initProductPage();
        }

        if (document.querySelector('.favoris-grid') && !document.querySelector('.recipes-grid')) {
            // Vérifier si on est sur la page panier (pas favoris)
            const title = document.title;
            if (title.toLowerCase().includes('panier')) {
                initCartPage();
            }
        }

        window.addEventListener('cartChanged', () => updateCartBadge(cartManager.getCount()));
    });

})();
