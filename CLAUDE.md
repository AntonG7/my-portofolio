# CLAUDE.md

Ce fichier fournit des instructions à Claude Code (claude.ai/code) pour travailler avec le code de ce dépôt.

## Projet : MonPortfolio

Site portfolio statique construit avec HTML, CSS et JavaScript vanilla. Pas de framework, pas d'outil de build, pas de gestionnaire de paquets.

## Architecture

- `index.html`, `project.html`, `blog.html`, `webapps.html` — pages du site
- `css/style.css` — tous les styles
- `js/` — un fichier JS par page (`main.js`, `project.js`, `blog.js`, `webapps.js`)
- `data/` — contenu en JSON consommé par le JS (`projects.json`, `blog.json`, `testimonials.json`, `biens-etat.json`)
- `assets/` — images et ressources statiques
- `build_biens_etat.py` — script de conversion du CSV open data (patrimoine immobilier de l'État) vers `data/biens-etat.json`, à relancer manuellement si le dataset source est mis à jour

## Conventions de code

- **Langue du code :** anglais pour tous les noms de variables, noms de fonctions, classes CSS, IDs, commentaires et noms de fichiers
- **Langue du contenu :** français pour tout le texte visible par l'utilisateur (titres, paragraphes, labels, attributs alt, méta descriptions)
- Attribut HTML `lang="fr"` sur `<html>`

## Design

- Design responsive mobile-first : les styles de base ciblent le mobile, utiliser les media queries `min-width` pour les écrans plus grands
- Fond sombre, texte clair — esthétique minimaliste et professionnelle
- Police : Inter (Google Fonts)
- Couleur d'accent : `#7f7fd5`

## Interdictions
- Pas de jQuery
- Pas de framework CSS (Bootstrap, Tailwind)
- Pas de bundler (Webpack, Vite)
- Pas de base de données ni de backend — le site reste 100% statique (hébergement GitHub Pages)
- Les librairies JS légères via CDN sont autorisées au cas par cas (ex. Leaflet pour la carte de `webapps.html`), tant qu'il n'y a ni bundler ni gestionnaire de paquets
- Ne jamais modifier ce fichier CLAUDE.md sans permission explicite

## Développement

Prévisualiser en local :
```
python3 -m http.server
```
Ou ouvrir `index.html` directement dans un navigateur.
