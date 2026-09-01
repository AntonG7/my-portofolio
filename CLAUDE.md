# CLAUDE.md

Ce fichier fournit des instructions à Claude Code (claude.ai/code) pour travailler avec le code de ce dépôt.

## Projet : MonPortfolio

Site portfolio statique construit avec HTML, CSS et JavaScript vanilla. Pas de framework, pas d'outil de build, pas de gestionnaire de paquets.

## Architecture

- `index.html` — page principale, liens vers CSS/JS externes
- `style.css` — tous les styles
- `script.js` — toute l'interactivité
- `assets/` — images et ressources statiques

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
- Ne jamais modifier ce fichier CLAUDE.md sans permission explicite

## Développement

Prévisualiser en local :
```
python3 -m http.server
```
Ou ouvrir `index.html` directement dans un navigateur.
