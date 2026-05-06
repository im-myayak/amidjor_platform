# 🌿 Amidjor Agro-Business

Plateforme e-commerce pour Amidjor Agro-Business - Produits naturels et bio de Guinée.

## 🚀 Technologies

- **Frontend** : React 18 + Vite
- **Backend** : Django 4.2 + Django REST Framework
- **Base de données** : PostgreSQL (production) / SQLite (développement)
- **Hébergement** : Render.com (gratuit)

## 📦 Fonctionnalités

- ✅ Site vitrine avec design moderne
- ✅ Gestion des produits (Fonio, Miel, etc.)
- ✅ Panier dynamique avec quantités
- ✅ Commande via WhatsApp
- ✅ Blog/Articles
- ✅ Interface admin Django
- ✅ Responsive (mobile-friendly)

## 🛠️ Installation Locale

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/amidjor_platform.git
cd amidjor_platform
```

### 2. Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Créer le fichier .env
cp .env.example .env
# Éditez .env avec vos valeurs

# Base de données
python manage.py migrate
python manage.py createsuperuser  # Créer un admin

# Lancer le serveur
python manage.py runserver
```

Backend disponible sur : http://localhost:8000

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible sur : http://localhost:3000

---

## 🚀 Déploiement (Render.com)

Le déploiement est **entièrement automatisé** avec Render Blueprint.

### Méthode Rapide (2 minutes)

1. **Poussez sur GitHub**
   ```bash
   git add .
   git commit -m "Ready for Render deployment"
   git push origin main
   ```

2. **Déployez sur Render**
   - Allez sur [dashboard.render.com](https://dashboard.render.com)
   - **"New +"** → **"Blueprint"**
   - Sélectionnez votre repo
   - Cliquez **"Apply"**

3. **Créer un admin**
   - Allez sur le service `amidjor-backend`
   - Onglet **"Shell"**
   - Exécutez : `python manage.py createsuperuser`

4. **Accédez à votre site**
   - 🌐 Site : `https://amidjor-frontend.onrender.com`
   - 🔧 Admin : `https://amidjor-backend.onrender.com/admin`

Pour plus de détails, voir [DEPLOY.md](./DEPLOY.md)

---

## 📁 Structure du Projet

```
amidjor_platform/
├── backend/                 # Django Backend
│   ├── accounts/           # Authentification
│   ├── blog/               # Articles/Blog
│   ├── config/             # Configuration Django
│   ├── orders/             # Commandes
│   ├── products/           # Produits
│   ├── requirements.txt    # Dépendances Python
│   └── manage.py           # Commandes Django
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── context/        # Contexts (Cart, etc.)
│   │   ├── pages/          # Pages
│   │   └── services/       # API calls
│   ├── public/             # Assets statiques
│   ├── package.json        # Dépendances Node
│   └── vite.config.js      # Config Vite
│
├── render.yaml             # Config Render.com
├── DEPLOY.md               # Guide déploiement détaillé
└── README.md               # Ce fichier
```

---

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env` dans le dossier `backend/` :

```env
SECRET_KEY=votre-cle-secrete-aleatoire
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Email (optionnel)
EMAIL_HOST_USER=votre-email@gmail.com
EMAIL_HOST_PASSWORD=votre-mot-de-passe-app
```

Pour la production (Render), configurez ces variables dans le dashboard.

---

## 📱 Fonctionnement du Panier

1. **Ajouter au panier** : Clique sur "🛒 Ajouter"
2. **Commander** : Clique sur "Commander" → ouvre le panier
3. **Modifier quantité** : Change le nombre dans le panier
4. **Valider** : Clique sur "📱 Valider la commande" → ouvre WhatsApp avec la commande
5. **Panier vidé** : Automatiquement après validation

---

## 🛠️ Commandes Utiles

### Backend
```bash
# Créer un superuser
python manage.py createsuperuser

# Réinitialiser la base de données
python manage.py flush

# Faire des migrations
python manage.py makemigrations
python manage.py migrate

# Lancer les tests
python manage.py test
```

### Frontend
```bash
# Build pour production
npm run build

# Preview le build
npm run preview
```

---

## 🐛 Dépannage

### Problème de CORS
Vérifiez que `CORS_ALLOWED_ORIGINS` contient bien l'URL du frontend.

### Problème de static files
Assurez-vous que `collectstatic` s'exécute lors du build sur Render.

### Base de données vide en production
Connectez-vous au shell Render et exécutez `python manage.py migrate`.

---

## 📞 Contact

- **Email** : contact@amidjor.com
- **WhatsApp** : +224 627 79 78 43
- **Site** : https://amidjor-frontend.onrender.com

---

## 📄 Licence

© 2024 Amidjor Agro-Business. Tous droits réservés.
