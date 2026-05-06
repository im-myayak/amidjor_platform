# 🚀 Déploiement sur Render.com

Ce guide explique comment déployer l'application Amidjor sur Render.com (gratuit).

## 📋 Prérequis

1. Créer un compte sur [Render.com](https://render.com)
2. Connecter votre compte GitHub à Render
3. Pousser ce projet sur GitHub (si ce n'est pas déjà fait)

## 🚀 Déploiement Automatique (Recommandé)

### Étape 1 : Blueprint Render

1. Allez sur votre dashboard Render : [dashboard.render.com](https://dashboard.render.com)
2. Cliquez sur **"New +"** → **"Blueprint"**
3. Sélectionnez votre repository GitHub `amidjor_platform`
4. Cliquez sur **"Apply"**

Render va automatiquement :
- Créer la base de données PostgreSQL
- Déployer le backend Django
- Déployer le frontend React
- Configurer toutes les variables d'environnement

### Étape 2 : Créer un Superuser (Admin Django)

Après le déploiement, vous devez créer un admin :

1. Allez sur le service **amidjor-backend** dans Render
2. Cliquez sur **"Shell"** (dans le menu du haut)
3. Exécutez ces commandes :
   ```bash
   python manage.py createsuperuser
   ```
4. Suivez les instructions (nom d'utilisateur, email, mot de passe)

### Étape 3 : Accéder aux URLs

| Service | URL |
|---------|-----|
| Frontend | `https://amidjor-frontend.onrender.com` |
| Backend API | `https://amidjor-backend.onrender.com/api/` |
| Admin Django | `https://amidjor-backend.onrender.com/admin/` |

---

## 🔧 Déploiement Manuel (Si Blueprint échoue)

### 1. Base de Données

1. Dashboard → **"New +"** → **"PostgreSQL"**
2. Nom : `amidjor-db`
3. Plan : **Free**
4. Créer

### 2. Backend Django

1. Dashboard → **"New +"** → **"Web Service"**
2. Sélectionnez votre repository
3. Configurez :
   - **Name** : `amidjor-backend`
   - **Root Directory** : `backend`
   - **Environment** : `Python 3`
   - **Build Command** :
     ```bash
     pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
     ```
   - **Start Command** :
     ```bash
     gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
     ```
4. **Environment Variables** (ajoutez-les) :
   ```
   SECRET_KEY = [générez une clé secrète aléatoire]
   DEBUG = False
   DATABASE_URL = [copiez depuis votre base de données PostgreSQL]
   ALLOWED_HOSTS = .onrender.com
   CORS_ALLOWED_ORIGINS = https://amidjor-frontend.onrender.com
   ```

### 3. Frontend React

1. Dashboard → **"New +"** → **"Static Site"**
2. Sélectionnez votre repository
3. Configurez :
   - **Name** : `amidjor-frontend`
   - **Root Directory** : `frontend`
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `dist`
4. **Redirects/Rewrites** (ajoutez ces règles) :
   - Source : `/api/*` → Destination : `https://amidjor-backend.onrender.com/api/$1`
   - Source : `/admin/*` → Destination : `https://amidjor-backend.onrender.com/admin/$1`
   - Source : `/media/*` → Destination : `https://amidjor-backend.onrender.com/media/$1`
   - Source : `/*` → Destination : `/index.html`

---

## ✅ Vérification

Testez ces URLs après déploiement :

1. **Frontend** : `https://amidjor-frontend.onrender.com` → Doit afficher le site
2. **Backend** : `https://amidjor-backend.onrender.com/api/products/` → Doit retourner JSON
3. **Admin** : `https://amidjor-backend.onrender.com/admin/` → Doit afficher login Django

---

## 🐛 Dépannage

### Problème : "Build failed"

Vérifiez les logs dans Render :
- Service → **"Logs"** (en haut)

### Problème : "Bad Request (400)"

Ajoutez votre domaine Render dans `ALLOWED_HOSTS` :
```
ALLOWED_HOSTS = amidjor-backend.onrender.com,.onrender.com
```

### Problème : CORS errors dans le navigateur

Vérifiez que `CORS_ALLOWED_ORIGINS` contient l'URL exacte du frontend :
```
CORS_ALLOWED_ORIGINS = https://amidjor-frontend.onrender.com
```

### Problème : Base de données vide

Connectez-vous au shell du backend et exécutez :
```bash
python manage.py migrate
python manage.py createsuperuser
```

---

## 📞 Support

Si vous avez des problèmes :
1. Vérifiez les logs dans Render Dashboard
2. Vérifiez que toutes les variables d'environnement sont configurées
3. Assurez-vous que le fichier `render.yaml` est à la racine du projet

---

## 🔄 Mises à jour

Avec Render, les mises à jour sont automatiques :
1. Poussez vos changements sur GitHub
2. Render déploie automatiquement en 1-2 minutes

Pour déployer manuellement :
- Service → **"Manual Deploy"** → **"Deploy latest commit"**
