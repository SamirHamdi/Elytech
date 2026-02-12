// js/recettes.js
// Base de données de toutes les recettes du site
const recettesDB = [
    {
        id: 'poulet-au-curry',
        titre: 'Poulet au Curry',
        image: '/images/poulet au curry.jpg',
        temps: '45 min',
        personnes: '4 pers.',
        note: 5,
        categorie: 'Cuisine Indienne'
    },
    {
        id: 'butter-chicken',
        titre: 'Butter Chicken',
        image: '/images/butter chicken.jpg',
        temps: '60 min',
        personnes: '4 pers.',
        note: 5,
        categorie: 'Cuisine Indienne'
    },
    {
        id: 'dahl-de-lentilles',
        titre: 'Dahl de Lentilles',
        image: '/images/dahl_de_lentilles.jpg',
        temps: '30 min',
        personnes: '4 pers.',
        note: 4,
        categorie: 'Cuisine Indienne'
    },
    // ... ajoutez TOUTES vos recettes ici (indiennes, françaises, italiennes, etc.)
    {
        id: 'boeuf-bourguignon',
        titre: 'Bœuf Bourguignon',
        image: '/images/boeuf-bourguignon.jpg',
        temps: '180 min',
        personnes: '6 pers.',
        note: 5,
        categorie: 'Cuisine Française'
    },
    {
        id: 'pates-carbonara',
        titre: 'Pâtes à la Carbonara',
        image: '/images/pate à la carbonara.webp',
        temps: '20 min',
        personnes: '4 pers.',
        note: 5,
        categorie: 'Cuisine Italienne'
    },
    {
        id: 'rfissa-au-poulet',
        titre: 'Rfissa au Poulet',
        image: '/images/rfissa au poulet.jpeg',
        temps: '90 min',
        personnes: '6 pers.',
        note: 4,
        categorie: 'Cuisine Marocaine'
    },
    {
        id: 'gratin-dauphinois',
        titre: 'Gratin Dauphinois',
        image: '/images/gratin dauphinoid.webp',
        temps: '90 min',
        personnes: '6 pers.',
        note: 5,
        categorie: 'Cuisine Française'
    }
    // ... etc.
];