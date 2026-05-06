# 📁 Dossier Assets - Images Amidjor

## 📂 Emplacement
Ce dossier contient toutes les images statiques du site.

## 🖼️ Fichiers attendus

### 1. `logo.png` (ou .svg, .jpg)
- **Usage** : Logo dans la navbar et footer
- **Taille recommandée** : 200x60px (largeur x hauteur)
- **Format idéal** : PNG transparent ou SVG
- **Chemin d'accès** : `/assets/logo.png`

### 2. `background.png` (ou .jpg)
- **Usage** : Image de fond full screen (Hero section)
- **Taille recommandée** : 1920x1080px minimum
- **Format idéal** : JPG (compression) ou PNG
- **Chemin d'accès** : `/assets/background.png`

### 3. Autres images
- `products/` - Images des produits
- `team/` - Photos de l'équipe
- `icons/` - Icônes personnalisées

## 🚀 Comment utiliser dans le code

### HTML/JSX direct (depuis public/)
```jsx
<img src="/assets/logo.png" alt="Amidjor Logo" />
```

### CSS background
```css
.hero-section {
  background-image: url('/assets/background.png');
  background-size: cover;
  background-position: center;
}
```

### Dans React
```jsx
// Chemin absolu depuis la racine public/
const logo = '/assets/logo.png';
<img src={logo} alt="Logo" />
```

## ⚠️ Important
- Les fichiers dans `public/` sont servis à la racine `/`
- Pas besoin d'import, utilisez directement le chemin `/assets/nom-fichier`
- Rafraîchissez le navigateur après avoir ajouté des images
