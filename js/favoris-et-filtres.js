// ====================================================
// SYSTÈME COMPLET DE FAVORIS ET FILTRES
// Cooking 4 Noob - Version complète et fonctionnelle
// ====================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ==================== CONSTANTES ====================
    const STORAGE_KEY = 'cooking4noob_favoris';

    // ==================== BASE DE DONNÉES DES RECETTES ====================
    const recettesDB = {
        'poulet-au-curry': {
            id: 'poulet-au-curry',
            titre: 'Poulet au Curry',
            image: '/images/poulet au curry.jpg',
            temps: '45 min',
            personnes: '4 pers.',
            note: 5,
            categorie: 'Cuisine Indienne',
            description: 'Un curry de poulet crémeux et épicé, parfait avec du riz basmati.',
            tags: ['epice']
        },
        'butter-chicken': {
            id: 'butter-chicken',
            titre: 'Butter Chicken',
            image: '/images/butter chicken.jpg',
            temps: '60 min',
            personnes: '4 pers.',
            note: 5,
            categorie: 'Cuisine Indienne',
            description: 'Poulet mariné dans une sauce tomate crémeuse et épicée.',
            tags: ['epice']
        },
        'dahl-de-lentilles': {
            id: 'dahl-de-lentilles',
            titre: 'Dahl de Lentilles',
            image: '/images/dahl_de_lentilles.jpg',
            temps: '30 min',
            personnes: '4 pers.',
            note: 4,
            categorie: 'Cuisine Indienne',
            description: 'Lentilles mijotées aux épices indiennes, réconfortant et végétarien.',
            tags: ['vegetarien', 'rapide', 'facile']
        },
        'biryani-de-poulet': {
            id: 'biryani-de-poulet',
            titre: 'Biryani de Poulet',
            image: '/images/Biryani de poulet.jpg',
            temps: '90 min',
            personnes: '6 pers.',
            note: 5,
            categorie: 'Cuisine Indienne',
            description: 'Riz parfumé aux épices avec poulet tendre et safran.',
            tags: ['epice']
        },
        'samosas-aux-legumes': {
            id: 'samosas-aux-legumes',
            titre: 'Samosas aux Légumes',
            image: '/images/samosas.jpeg',
            temps: '50 min',
            personnes: '4 pers.',
            note: 4,
            categorie: 'Cuisine Indienne',
            description: 'Beignets croustillants farcis de légumes épicés.',
            tags: ['vegetarien', 'epice']
        },
        'naan-maison': {
            id: 'naan-maison',
            titre: 'Naan Maison',
            image: '/images/naan maison.jpg',
            temps: '20 min',
            personnes: '6 pers.',
            note: 5,
            categorie: 'Cuisine Indienne',
            description: 'Pain indien moelleux, parfait pour accompagner les currys.',
            tags: ['rapide', 'facile']
        },
        'chicken-tikka-masala': {
            id: 'chicken-tikka-masala',
            titre: 'Chicken Tikka Masala',
            image: '/images/tikka-masala.jpg',
            temps: '55 min',
            personnes: '4 pers.',
            note: 5,
            categorie: 'Cuisine Indienne',
            description: 'Poulet grillé dans une sauce tomate crémeuse aux épices.',
            tags: ['epice']
        },
        'palak-paneer': {
            id: 'palak-paneer',
            titre: 'Palak Paneer',
            image: '/images/palak-paneer.jpeg',
            temps: '40 min',
            personnes: '4 pers.',
            note: 4,
            categorie: 'Cuisine Indienne',
            description: 'Fromage indien dans une sauce crémeuse aux épinards.',
            tags: ['vegetarien', 'facile']
        },
        'boeuf-bourguignon': {
            id: 'boeuf-bourguignon',
            titre: 'Bœuf Bourguignon',
            image: '/images/boeuf-bourguignon.jpg',
            temps: '180 min',
            personnes: '6 pers.',
            note: 5,
            categorie: 'Cuisine Française',
            description: 'Plat traditionnel français mijoté au vin rouge.',
            tags: []
        },
        'pates-a-la-carbonara': {
            id: 'pates-a-la-carbonara',
            titre: 'Pâtes à la Carbonara',
            image: '/images/pate à la carbonara.webp',
            temps: '20 min',
            personnes: '4 pers.',
            note: 5,
            categorie: 'Cuisine Italienne',
            description: 'Recette traditionnelle italienne simple et savoureuse.',
            tags: ['rapide', 'facile']
        },
        'rfissa-au-poulet': {
            id: 'rfissa-au-poulet',
            titre: 'Rfissa au Poulet',
            image: '/images/rfissa au poulet.jpeg',
            temps: '90 min',
            personnes: '6 pers.',
            note: 4,
            categorie: 'Cuisine Marocaine',
            description: 'Plat traditionnel marocain aux saveurs authentiques.',
            tags: []
        },
        'gratin-dauphinois': {
            id: 'gratin-dauphinois',
            titre: 'Gratin Dauphinois',
            image: '/images/gratin dauphinoid.webp',
            temps: '90 min',
            personnes: '6 pers.',
            note: 5,
            categorie: 'Cuisine Française',
            description: 'Gratin de pommes de terre crémeux et fondant.',
            tags: ['facile']
        }
    };

    // ==================== GESTION DES FAVORIS ====================
    
    class FavoritesManager {
        constructor() {
            this.favorites = this.loadFavorites();
        }

        loadFavorites() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                return stored ? JSON.parse(stored) : [];
            } catch (e) {
                console.error('Erreur chargement favoris:', e);
                return [];
            }
        }

        saveFavorites() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.favorites));
                // Déclencher un événement pour synchroniser les autres pages
                window.dispatchEvent(new Event('favoritesChanged'));
            } catch (e) {
                console.error('Erreur sauvegarde favoris:', e);
            }
        }

        isFavorite(recipeId) {
            return this.favorites.includes(recipeId);
        }

        toggle(recipeId) {
            if (this.isFavorite(recipeId)) {
                this.remove(recipeId);
                return false;
            } else {
                this.add(recipeId);
                return true;
            }
        }

        add(recipeId) {
            if (!this.isFavorite(recipeId)) {
                this.favorites.push(recipeId);
                this.saveFavorites();
            }
        }

        remove(recipeId) {
            this.favorites = this.favorites.filter(id => id !== recipeId);
            this.saveFavorites();
        }

        getFavorites() {
            return this.favorites;
        }

        getFavoriteRecipes() {
            return this.favorites.map(id => recettesDB[id]).filter(Boolean);
        }
    }

    // ==================== UTILITAIRES ====================
    
    function generateId(title) {
        return title.trim().toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Retire accents
            .replace(/[^a-z0-9\s-]/g, '') // Garde lettres, chiffres, espaces, tirets
            .replace(/\s+/g, '-'); // Remplace espaces par tirets
    }

    function createStars(rating) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += i < rating ? '★' : '☆';
        }
        return stars;
    }

    // ==================== GESTION DE LA PAGE FAVORIS ====================
    
    function initFavoritesPage() {
        const favoritesGrid = document.querySelector('.favoris-grid');
        const emptyState = document.querySelector('.empty-state');
        
        if (!favoritesGrid) return;

        const favManager = new FavoritesManager();
        
        function renderFavorites() {
            const favoriteRecipes = favManager.getFavoriteRecipes();
            
            if (favoriteRecipes.length === 0) {
                favoritesGrid.style.display = 'none';
                if (emptyState) emptyState.style.display = 'block';
            } else {
                favoritesGrid.style.display = 'grid';
                if (emptyState) emptyState.style.display = 'none';
                
                favoritesGrid.innerHTML = favoriteRecipes.map(recipe => `
                    <article class="recipe-card" data-recipe-id="${recipe.id}">
                        <button class="favorite-btn active" data-recipe-id="${recipe.id}">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                        <img src="${recipe.image}" alt="${recipe.titre}">
                        <div class="recipe-info">
                            <h4 class="recipe-title">${recipe.titre}</h4>
                            <div class="recipe-meta">
                                <span><i class="fa-regular fa-clock"></i> ${recipe.temps}</span>
                                <span><i class="fa-solid fa-user"></i> ${recipe.personnes}</span>
                            </div>
                            <div class="recipe-rating">${createStars(recipe.note)}</div>
                            <div class="recipe-category">
                                <span class="category-badge">${recipe.categorie}</span>
                            </div>
                        </div>
                    </article>
                `).join('');
                
                // Réattacher les événements
                attachFavoriteButtons(favManager);
            }
        }

        renderFavorites();
        
        // Écouter les changements de favoris
        window.addEventListener('favoritesChanged', renderFavorites);
    }

    // ==================== GESTION DES BOUTONS FAVORIS ====================
    
    function attachFavoriteButtons(favManager) {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            // Retirer les anciens listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            const card = newBtn.closest('.recipe-card');
            const titleEl = card?.querySelector('.recipe-title');
            if (!titleEl) return;
            
            const recipeId = generateId(titleEl.textContent);
            const icon = newBtn.querySelector('i');
            
            // État initial
            updateButtonState(newBtn, icon, favManager.isFavorite(recipeId));
            
            // Événement clic
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const isFav = favManager.toggle(recipeId);
                updateButtonState(newBtn, icon, isFav);
                
                // Animation
                icon.style.animation = 'heartBeat 0.3s ease';
                setTimeout(() => icon.style.animation = '', 300);
            });
        });
    }

    function updateButtonState(btn, icon, isFavorite) {
        if (isFavorite) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            btn.classList.add('active');
            btn.setAttribute('aria-label', 'Retirer des favoris');
        } else {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            btn.classList.remove('active');
            btn.setAttribute('aria-label', 'Ajouter aux favoris');
        }
    }

    // ==================== SYSTÈME DE FILTRES ====================
    
    function initFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const recipeCards = document.querySelectorAll('.recipe-card');
        const searchInput = document.querySelector('.search-bar-nav input');
        
        if (!filterButtons.length || !recipeCards.length) return;
        
        let activeFilter = 'tous';
        let searchTerm = '';
        
        function applyFiltersAndSearch() {
            let visibleCount = 0;
            
            recipeCards.forEach(card => {
                const titleEl = card.querySelector('.recipe-title');
                const descEl = card.querySelector('.recipe-description');
                if (!titleEl) return;
                
                const recipeId = generateId(titleEl.textContent);
                const recipe = recettesDB[recipeId];
                
                // Vérifier le filtre
                let matchesFilter = true;
                if (activeFilter !== 'tous') {
                    matchesFilter = recipe && recipe.tags && recipe.tags.includes(activeFilter);
                }
                
                // Vérifier la recherche
                let matchesSearch = true;
                if (searchTerm) {
                    const title = titleEl.textContent.toLowerCase();
                    const description = descEl ? descEl.textContent.toLowerCase() : '';
                    matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
                }
                
                // Afficher ou masquer
                if (matchesFilter && matchesSearch) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            showNoResultsMessage(visibleCount, searchTerm || activeFilter);
        }
        
        // Boutons de filtre
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const btnText = this.textContent.trim().toLowerCase();
                if (btnText === 'végétarien') activeFilter = 'vegetarien';
                else if (btnText === 'épicé') activeFilter = 'epice';
                else if (btnText === 'rapide') activeFilter = 'rapide';
                else if (btnText === 'facile') activeFilter = 'facile';
                else activeFilter = 'tous';
                
                applyFiltersAndSearch();
            });
        });
        
        // Recherche
        if (searchInput) {
            const searchForm = searchInput.closest('form');
            if (searchForm) {
                searchForm.addEventListener('submit', e => e.preventDefault());
            }
            
            searchInput.addEventListener('input', function() {
                searchTerm = this.value.toLowerCase().trim();
                applyFiltersAndSearch();
            });
        }
        
        function showNoResultsMessage(count, term) {
            const recipesGrid = document.querySelector('.recipes-grid');
            if (!recipesGrid) return;
            
            let existingMsg = recipesGrid.querySelector('.no-results-message');
            if (existingMsg) existingMsg.remove();
            
            if (count === 0 && term !== '') {
                const message = document.createElement('div');
                message.className = 'no-results-message';
                message.innerHTML = `
                    <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h3>Aucune recette trouvée</h3>
                    <p>Aucune recette ne correspond aux critères sélectionnés.</p>
                    <p>Essayez un autre filtre ou une autre recherche.</p>
                `;
                message.style.cssText = `
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 4rem 2rem;
                    color: #666;
                `;
                recipesGrid.appendChild(message);
            }
        }
    }

    // ==================== ANIMATIONS ====================
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes heartBeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }
        
        .filter-btn.active {
            background-color: #e67e22 !important;
            color: white !important;
            border-color: #e67e22 !important;
        }
        
        .favorite-btn {
            transition: transform 0.2s ease;
        }
        
        .favorite-btn:hover {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    // ==================== INITIALISATION ====================
    
    const favManager = new FavoritesManager();
    
    // Déterminer quelle page on est
    if (document.querySelector('.favoris-grid')) {
        // Page des favoris
        initFavoritesPage();
    } else if (document.querySelector('.recipes-grid')) {
        // Page de recettes (catégorie)
        attachFavoriteButtons(favManager);
        initFilters();
    }
    
    console.log('✅ Système de favoris et filtres initialisé');
});