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
- `CNAME` — domaine personnalisé lu par GitHub Pages ; ne pas supprimer, le site serait à nouveau servi depuis l'URL `.github.io`

La barre de navigation, le pied de page et le sélecteur de thème sont dupliqués dans les quatre pages HTML (pas de moteur de templates) : toute modification de l'un doit être répercutée dans les quatre.

## Conventions de code

- **Langue du code :** anglais pour tous les noms de variables, noms de fonctions, classes CSS, IDs, commentaires et noms de fichiers
- **Langue du contenu :** français pour tout le texte visible par l'utilisateur (titres, paragraphes, labels, attributs alt, méta descriptions)
- Attribut HTML `lang="fr"` sur `<html>`

## Design

- Design responsive mobile-first : les styles de base ciblent le mobile, utiliser les media queries `min-width` pour les écrans plus grands
- Esthétique minimaliste et professionnelle
- Police : Inter (Google Fonts)
- **Toutes les valeurs de style passent par les variables CSS déclarées dans `:root`** (couleurs, espacements, tailles de police, z-index). Ne pas écrire de valeur en dur : réutiliser un token existant ou en ajouter un.
- **Thème clair/sombre** : basculé par l'attribut `data-theme` sur `<html>`, mémorisé dans `localStorage`, avec repli sur `prefers-color-scheme`. Un script inline en `<head>` de chaque page l'applique avant le rendu pour éviter un flash. Toute nouvelle couleur doit être déclinée dans les deux thèmes.
- Couleurs d'accent : `--color-accent` (vert — `#64ffda` en sombre, `#0d9373` en clair) pour l'état par défaut, `--color-accent-hover` (violet — `#b98eff` en sombre, `#7c3aed` en clair) pour les survols

## Interdictions
- Pas de jQuery
- Pas de framework CSS (Bootstrap, Tailwind)
- Pas de bundler (Webpack, Vite)
- Pas de base de données ni de backend — le site reste 100% statique (hébergement GitHub Pages)
- Les librairies JS légères via CDN sont autorisées au cas par cas (aujourd'hui : Leaflet et Leaflet.markercluster pour la carte de `webapps.html`), tant qu'il n'y a ni bundler ni gestionnaire de paquets
- Le formulaire de contact passe par Formsubmit.co (pas de serveur à maintenir) : son `action` pointe vers l'adresse e-mail de destination, et les champs cachés `_redirect` / `_captcha` doivent être conservés
- Ne jamais modifier ce fichier CLAUDE.md sans permission explicite

## Développement

Prévisualiser en local :
```
python3 -m http.server
```
Le serveur est nécessaire pour les pages qui chargent du JSON via `fetch` (ouvrir le fichier HTML directement échoue à cause des restrictions CORS sur `file://`).

Pour tester depuis un smartphone sur le même réseau Wi-Fi : récupérer l'IP locale du Mac (`ipconfig getifaddr en1`) et ouvrir `http://<IP>:8000` sur le téléphone.

## Déploiement

Le site est publié sur GitHub Pages depuis la branche `main` (dépôt `AntonG7/my-portofolio`), à l'adresse `https://anthony-guignard.fr`. Chaque `push` sur `main` déclenche un déploiement automatique, effectif au bout d'une à deux minutes.
