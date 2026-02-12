// ====================================================
// Fichier : page-categorien-indien.js
// Rôle : Gestion de la recherche en temps réel sur la page des recettes indiennes
// Auteur : Cooking 4 Noob
// ====================================================

// Attendre que le DOM soit complètement chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', function() {
    // Active le mode strict pour éviter les erreurs silencieuses et les mauvaises pratiques
    'use strict';

    // ---------- SÉLECTION DES ÉLÉMENTS DOM ----------

    // Récupère l'élément <input> situé à l'intérieur d'un élément ayant la classe "search-bar-nav"
    const searchInput = document.querySelector('.search-bar-nav input');

    // Récupère le formulaire parent le plus proche de l'élément ".search-bar-nav"
    // La méthode closest('form') remonte dans l'arbre DOM jusqu'à trouver une balise <form>
    const searchForm = document.querySelector('.search-bar-nav')?.closest('form');

    // Récupère toutes les cartes de recettes (éléments avec la classe "recipe-card")
    const recipeCards = document.querySelectorAll('.recipe-card');

    // Récupère la grille qui contient les recettes (élément avec la classe "recipes-grid")
    const recipesGrid = document.querySelector('.recipes-grid');

    // ---------- VÉRIFICATION DES ÉLÉMENTS INDISPENSABLES ----------

    // Si l'un des éléments critiques est manquant, on affiche un avertissement dans la console
    // et on arrête l'exécution du script (return)
    if (!searchInput || !searchForm || !recipeCards.length || !recipesGrid) {
        console.warn('⚠️ Recherche : certains éléments requis sont manquants. Vérifiez vos classes CSS.');
        return; // Stoppe la fonction, le script ne fera rien de plus
    }

    // ---------- VARIABLES ----------

    // Cette variable servira à conserver une référence vers le bouton "effacer" (croix)
    // Elle est initialisée à null car le bouton n'existe pas encore au chargement
    let clearButton = null;

    // ---------- FONCTIONS ----------

    // -------------------------------------------------
    // Fonction : filterRecipes
    // Rôle : Filtre les recettes en fonction du texte saisi dans la barre de recherche
    // -------------------------------------------------
    function filterRecipes() {
        // Récupère la valeur de l'input, la convertit en minuscules et supprime les espaces inutiles
        const searchTerm = searchInput.value.toLowerCase().trim();
        // Compteur de recettes visibles après filtrage
        let visibleCount = 0;

        // Parcourt chaque carte de recette (forEach)
        recipeCards.forEach(card => {
            // Récupère le texte du titre de la recette (classe "recipe-title") et le met en minuscules
            // Si l'élément n'existe pas, on utilise une chaîne vide (|| '')
            const title = card.querySelector('.recipe-title')?.textContent.toLowerCase() || '';
            // Récupère le texte de la description (classe "recipe-description") et le met en minuscules
            const description = card.querySelector('.recipe-description')?.textContent.toLowerCase() || '';

            // Vérifie si le terme recherché est présent dans le titre OU dans la description
            const matches = title.includes(searchTerm) || description.includes(searchTerm);

            // Affiche la carte si la condition est vraie, sinon la masque
            card.style.display = matches ? 'block' : 'none';

            // Si la carte est visible, on applique une petite animation d'apparition
            if (matches) {
                card.style.animation = 'fadeIn 0.3s ease-in';
                visibleCount++; // Incrémente le compteur
            }
        });

        // Appelle la fonction qui gère l'affichage du message "aucun résultat"
        showNoResultsMessage(visibleCount, searchTerm);
        // Met à jour l'affichage du bouton "effacer" : visible si la recherche n'est pas vide
        toggleClearButton(searchTerm !== '');
    }

    // -------------------------------------------------
    // Fonction : showNoResultsMessage
    // Rôle : Ajoute un message dans la grille si aucune recette ne correspond à la recherche
    // Paramètres : count (nombre de recettes visibles), term (terme recherché)
    // -------------------------------------------------
    function showNoResultsMessage(count, term) {
        // Supprime un éventuel message déjà affiché (évite les doublons)
        const existingMsg = document.querySelector('.no-results-message');
        if (existingMsg) existingMsg.remove();

        // Si aucune recette n'est visible ET que le terme de recherche n'est pas vide
        if (count === 0 && term !== '') {
            // Crée un élément div qui contiendra le message
            const message = document.createElement('div');
            // Ajoute la classe CSS pour le style
            message.className = 'no-results-message';
            // Définit le contenu HTML du message (utilisation de backticks pour template littéral)
            message.innerHTML = `
                <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>Aucune recette trouvée</h3>
                <p>Désolé, nous n'avons pas trouvé de recettes correspondant à "<strong>${escapeHTML(term)}</strong>".</p>
                <p>Essayez avec d'autres mots-clés ou parcourez toutes nos recettes.</p>
            `;
            // Applique des styles CSS directement sur l'élément (en JS)
            message.style.cssText = `
                grid-column: 1 / -1;
                text-align: center;
                padding: 4rem 2rem;
                color: #666;
            `;
            // Ajoute le message à la fin de la grille de recettes
            recipesGrid.appendChild(message);
        }
    }

    // -------------------------------------------------
    // Fonction : escapeHTML
    // Rôle : Échappe les caractères spéciaux HTML pour éviter les injections XSS
    // Paramètre : str (chaîne de caractères à échapper)
    // Retour : la chaîne sécurisée
    // -------------------------------------------------
    function escapeHTML(str) {
        // Remplace chaque caractère spécial par son équivalent HTML
        return str.replace(/[&<>"]/g, function(c) {
            // Objet de correspondance : associe le caractère à son entité HTML
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;'
            }[c] || c; // Si le caractère n'est pas dans la liste, le laisser tel quel (ne devrait pas arriver)
        });
    }

    // -------------------------------------------------
    // Fonction : resetSearch
    // Rôle : Réinitialise complètement la recherche (efface le champ, réaffiche toutes les recettes)
    // -------------------------------------------------
    function resetSearch() {
        // Vide la valeur de l'input
        searchInput.value = '';
        // Réapplique le filtrage : comme le champ est vide, toutes les recettes seront affichées
        filterRecipes(); 
        // Redonne le focus au champ de recherche (pratique pour taper directement)
        searchInput.focus();
    }

    // -------------------------------------------------
    // Fonction : toggleClearButton
    // Rôle : Affiche ou cache le bouton "✕" permettant d'effacer la recherche
    // Paramètre : show (booléen : true = afficher, false = cacher)
    // -------------------------------------------------
    function toggleClearButton(show) {
        if (show) {
            // Si le bouton n'existe pas encore, on le crée
            if (!clearButton) {
                // Crée un élément <button>
                clearButton = document.createElement('button');
                // Définit le type "button" pour éviter qu'il ne soumette un formulaire
                clearButton.type = 'button';
                // Ajoute une classe pour le style (peut être utilisée dans le CSS)
                clearButton.className = 'clear-search-btn';
                // Attribut ARIA pour l'accessibilité
                clearButton.setAttribute('aria-label', 'Effacer la recherche');
                // Contenu HTML du bouton : icône "times" (croix) de Font Awesome
                clearButton.innerHTML = '<i class="fa-solid fa-times"></i>';
                // Applique des styles en ligne pour positionner le bouton
                clearButton.style.cssText = `
                    position: absolute;
                    right: 70px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    font-size: 1.2rem;
                    padding: 0.5rem;
                    transition: color 0.2s;
                    z-index: 10;
                `;
                // Ajoute un écouteur d'événement : au clic, on appelle resetSearch
                clearButton.addEventListener('click', resetSearch);

                // Trouve le conteneur parent de la barre de recherche (élément avec la classe "search-bar-nav")
                const parent = searchInput.closest('.search-bar-nav');
                if (parent) {
                    // Rend le parent positionné en relatif (nécessaire pour le positionnement absolu du bouton)
                    parent.style.position = 'relative';
                    // Ajoute le bouton à l'intérieur de ce parent
                    parent.appendChild(clearButton);
                }
            }
        } else {
            // Si show est false et que le bouton existe, on le supprime du DOM
            if (clearButton) {
                clearButton.remove();
                clearButton = null; // On oublie la référence
            }
        }
    }

    // ---------- ÉVÉNEMENTS ----------

    // Écoute la saisie dans le champ de recherche (événement input)
    // Déclenche le filtrage à chaque frappe
    searchInput.addEventListener('input', filterRecipes);

    // Empêche la soumission classique du formulaire (rechargement de page)
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Annule l'envoi du formulaire
        filterRecipes();    // Applique tout de même le filtre (par sécurité)
    });

    // Permet de réinitialiser la recherche avec la touche Échap (Escape)
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Escape') { // Si la touche pressée est "Escape"
            resetSearch();
        }
    });

    // ---------- INJECTION DES STYLES CSS ----------

    // Crée une balise <style> dans le <head> pour ajouter des styles dynamiquement
    const style = document.createElement('style');
    // Définit le contenu CSS
    style.textContent = `
        /* Animation d'apparition en fondu et glissement */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        /* Transition douce sur les cartes */
        .recipe-card {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        /* Titre du message "aucun résultat" */
        .no-results-message h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: #333;
        }
        /* Paragraphes du message */
        .no-results-message p {
            margin: 0.5rem 0;
            font-size: 1rem;
        }
        /* Terme recherché en rouge */
        .no-results-message strong {
            color: #e74c3c;
        }
        /* Effet de survol du bouton clear */
        .clear-search-btn:hover {
            color: #c0392b;
        }
    `;
    // Ajoute la balise <style> dans le <head> du document
    document.head.appendChild(style);

    // ---------- INITIALISATION ----------

    // Au chargement, le champ de recherche est vide : on cache donc le bouton clear
    toggleClearButton(false);
});

// ====================================================
// GESTION DES FILTRES DE CATÉGORIE (page-categorien-indien.js)
// ====================================================
// Ce script s'ajoute à la suite du code de recherche existant.
// Il ajoute la possibilité de filtrer les recettes par :
// - Végétarien
// - Épicé
// - Rapide
// - Facile
// Le filtre "Tous" réinitialise le filtre et affiche toutes les recettes.
// Les filtres fonctionnent en combinaison avec la barre de recherche.
// ====================================================

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ---------- 1. RÉCUPÉRATION DES ÉLÉMENTS ----------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const recipeCards = document.querySelectorAll('.recipe-card');
    const searchInput = document.querySelector('.search-bar-nav input');

    // ---------- 2. AJOUT AUTOMATIQUE DES FILTRES SUR CHAQUE RECETTE ----------
    // (Basé sur le titre de la recette – à ajuster selon vos besoins réels)
    recipeCards.forEach(card => {
        const title = card.querySelector('.recipe-title')?.textContent.toLowerCase() || '';

        // --- Végétarien ---
        if (title.includes('dahl') || title.includes('palak') || title.includes('samosas') || title.includes('naan')) {
            card.classList.add('filter-vegetarien');
        }
        // --- Épicé ---
        if (title.includes('curry') || title.includes('butter chicken') || title.includes('tikka') || title.includes('biryani')) {
            card.classList.add('filter-epice');
        }
        // --- Rapide (moins de 30 min) ---
        // On peut aussi lire le temps affiché dans .recipe-meta, mais pour simplifier :
        if (title.includes('naan') || title.includes('dahl')) {
            card.classList.add('filter-rapide');
        }
        // --- Facile ---
        if (title.includes('naan') || title.includes('dahl') || title.includes('samosas')) {
            card.classList.add('filter-facile');
        }
    });

    // ---------- 3. VARIABLE POUR LE FILTRE ACTIF ----------
    let activeFilter = 'tous'; // 'tous', 'vegetarien', 'epice', 'rapide', 'facile'

    // ---------- 4. FONCTION POUR APPLIQUER FILTRE + RECHERCHE ----------
    function applyFiltersAndSearch() {
        const searchTerm = searchInput?.value.toLowerCase().trim() || '';

        recipeCards.forEach(card => {
            // --- 1. Vérification du filtre ---
            let filterMatch = true;
            if (activeFilter !== 'tous') {
                // Le filtre actif correspond à une classe 'filter-xxx'
                filterMatch = card.classList.contains(`filter-${activeFilter}`);
            }

            // --- 2. Vérification de la recherche ---
            let searchMatch = true;
            if (searchTerm !== '') {
                const title = card.querySelector('.recipe-title')?.textContent.toLowerCase() || '';
                const description = card.querySelector('.recipe-description')?.textContent.toLowerCase() || '';
                searchMatch = title.includes(searchTerm) || description.includes(searchTerm);
            }

            // --- 3. Affichage ou masquage ---
            if (filterMatch && searchMatch) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                card.style.display = 'none';
            }
        });

        // --- Gestion du message "aucun résultat" ---
        const visibleCards = Array.from(recipeCards).filter(card => card.style.display === 'block');
        showNoResultsMessage(visibleCards.length, searchTerm);
    }

    // ---------- 5. MESSAGE "AUCUN RÉSULTAT" (identique à celui de la recherche) ----------
    function showNoResultsMessage(count, term) {
        const recipesGrid = document.querySelector('.recipes-grid');
        const existingMsg = document.querySelector('.no-results-message');
        if (existingMsg) existingMsg.remove();

        if (count === 0 && term !== '') {
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>Aucune recette trouvée</h3>
                <p>Désolé, nous n'avons pas trouvé de recettes correspondant à "<strong>${escapeHTML(term)}</strong>".</p>
                <p>Essayez avec d'autres mots-clés ou parcourez toutes nos recettes.</p>
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

    // ---------- 6. ÉCHAPPEMENT HTML (copie de la fonction existante) ----------
    function escapeHTML(str) {
        return str.replace(/[&<>"]/g, function(c) {
            return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c] || c;
        });
    }

    // ---------- 7. GESTION DU CLIC SUR LES BOUTONS DE FILTRE ----------
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            // --- Récupérer le type de filtre ---
            let filterType = 'tous';
            const btnText = this.textContent.trim().toLowerCase();

            if (btnText === 'végétarien') filterType = 'vegetarien';
            else if (btnText === 'épicé') filterType = 'epice';
            else if (btnText === 'rapide') filterType = 'rapide';
            else if (btnText === 'facile') filterType = 'facile';
            else filterType = 'tous';

            // --- Mettre à jour la classe 'active' sur les boutons ---
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // --- Stocker le filtre actif ---
            activeFilter = filterType;

            // --- Réappliquer le filtrage ---
            applyFiltersAndSearch();

            // --- (Optionnel) Mettre à jour le placeholder de recherche ? ---
        });
    });

    // ---------- 8. LIEN AVEC LA RECHERCHE EXISTANTE ----------
    // On surcharge la fonction filterRecipes() si elle existe déjà,
    // ou on ajoute un écouteur sur l'input pour appeler notre nouvelle fonction.
    if (searchInput) {
        // Supprimer l'ancien écouteur input (si on veut éviter les doublons)
        // Mais ici on va plutôt ajouter le nôtre, et on désactive l'ancien si possible.
        // Solution simple : remplacer l'événement input.
        // On clone l'input pour retirer tous les écouteurs, mais c'est risqué.
        // Préférons nommer notre fonction et l'utiliser.
        searchInput.removeEventListener('input', window.oldFilterRecipes); // si existant
        searchInput.addEventListener('input', applyFiltersAndSearch);
    }

    // ---------- 9. INITIALISATION : FILTRE "TOUS" ACTIF PAR DÉFAUT ----------
    // S'assurer que le bouton "Tous" a la classe active
    const tousBtn = Array.from(filterButtons).find(btn => btn.textContent.trim() === 'Tous');
    if (tousBtn) {
        tousBtn.classList.add('active');
    }

    // ---------- 10. ADAPTATION DU STYLE POUR LES BOUTONS ACTIFS ----------
    // (Optionnel) Ajout d'un style CSS si non présent dans le fichier .css
    const style = document.createElement('style');
    style.textContent = `
        .filter-btn.active {
            background-color: #e67e22;
            color: white;
            border-color: #e67e22;
        }
    `;
    document.head.appendChild(style);

    // ---------- 11. EXPOSITION GLOBALE (pour débogage) ----------
    window.applyFiltersAndSearch = applyFiltersAndSearch;
});




// page-categorien-indien.js
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    const STORAGE_KEY = 'cooking4noob_favoris';
    let favorites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // Fonction pour générer un ID depuis le titre (identique à celui utilisé dans recettes.js)
    function generateId(title) {
        return title.trim().toLowerCase().replace(/\s+/g, '-');
    }

    // Initialisation de tous les boutons cœur
    document.querySelectorAll('.recipe-card').forEach(card => {
        const titleEl = card.querySelector('.recipe-title');
        if (!titleEl) return;
        const recipeId = generateId(titleEl.textContent);
        const favBtn = card.querySelector('.favorite-btn');
        const icon = favBtn?.querySelector('i');

        // État initial du cœur
        if (favorites.includes(recipeId)) {
            icon?.classList.remove('fa-regular');
            icon?.classList.add('fa-solid');
            favBtn?.classList.add('active');
            favBtn?.setAttribute('aria-label', 'Retirer des favoris');
        } else {
            icon?.classList.remove('fa-solid');
            icon?.classList.add('fa-regular');
            favBtn?.classList.remove('active');
            favBtn?.setAttribute('aria-label', 'Ajouter aux favoris');
        }

        // Écouteur de clic
        favBtn?.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            const isFav = favorites.includes(recipeId);

            if (isFav) {
                // Retirer des favoris
                favorites = favorites.filter(id => id !== recipeId);
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                this.classList.remove('active');
                this.setAttribute('aria-label', 'Ajouter aux favoris');
            } else {
                // Ajouter aux favoris
                favorites.push(recipeId);
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                this.classList.add('active');
                this.setAttribute('aria-label', 'Retirer des favoris');
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
        });
    });
});