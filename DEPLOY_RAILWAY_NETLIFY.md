# 🚀 Déploiement Railway + Netlify (100% Gratuit)

Guide pour déployer Amidjor sans carte de crédit.

---

## 📋 Prérequis

1. Compte GitHub (déjà fait ✅)
2. Compte Railway : [railway.app](https://railway.app) (connexion avec GitHub)
3. Compte Netlify : [netlify.com](https://netlify.com) (connexion avec GitHub)

---

## 🚂 Étape 1 : Backend sur Railway

### 1.1 Créer le projet

1. Va sur [railway.app/dashboard](https://railway.app/dashboard)
2. Clique **"New Project"**
3. Sélectionne **"Deploy from GitHub repo"**
4. Choisis `im-myayak/amidjor_platform`
5. Clique **"Add Variables"** et ajoute :

```env
SECRET_KEY=amidjor-secret-key-change-me-in-production
DEBUG=False
ALLOWED_HOSTS=.railway.app,localhost
CORS_ALLOWED_ORIGINS=https://amidjor.netlify.app,https://amidjor-frontend.netlify.app
```

6. Clique **"Deploy"**

### 1.2 Ajouter la base de données PostgreSQL

1. Dans ton projet Railway, clique **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway connecte **automatiquement** la BDD à ton app Django
3. La variable `DATABASE_URL` est créée automatiquement

### 1.3 Configurer le démarrage

1. Dans les **Settings** du service :
   - **Root Directory** : `backend`
   - **Start Command** : `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

2. Redéploie si nécessaire

### 1.4 Créer le superuser

1. Va dans l'onglet **"Shell"** de ton service
2. Exécute :
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

### 1.5 Noter l'URL

Railway te donne une URL comme :
```
https://amidjor-backend.up.railway.app
```

Garde cette URL, on en a besoin pour Netlify.

---

## 🌐 Étape 2 : Frontend sur Netlify

### 2.1 Connecter le repo

1. Va sur [netlify.com](https://netlify.com)
2. Dashboard → **"Add new site"** → **"Import an existing project"**
3. Choisis **GitHub** → `im-myayak/amidjor_platform`
4. Configure :
   - **Base directory** : `frontend`
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`

5. Clique **"Deploy site"**

### 2.2 Configurer les redirects (API)

Netlify utilise déjà le fichier `netlify.toml` qu'on a créé.

Mais vérifie que l'URL Railway est correcte dans `netlify.toml` :
```toml
[[redirects]]
  from = "/api/*"
  to = "https://TON_BACKEND_URL.railway.app/api/:splat"
```

Remplace `TON_BACKEND_URL` par ton URL Railway réelle.

### 2.3 Redéployer

Si tu modifies `netlify.toml`, pousse sur GitHub :
```bash
git add .
git commit -m "Update API URL"
git push
```

Netlify redéploie automatiquement.

---

## ✅ Vérification

Teste ces URLs :

| Service | URL à tester | Résultat attendu |
|---------|--------------|------------------|
| Backend | `https://XXX.railway.app/api/products/` | JSON avec produits |
| Backend Admin | `https://XXX.railway.app/admin/` | Page login Django |
| Frontend | `https://XXX.netlify.app` | Site Amidjor |

---

## 🔄 Mises à jour

Avec cette config, les mises à jour sont **automatiques** :

1. Tu modifies le code
2. Tu pousses sur GitHub (`git push`)
3. Railway et Netlify redéploient en 1-2 minutes

---

## 🐛 Dépannage

### "Build failed" sur Railway
Vérifie que `requirements.txt` contient bien `gunicorn`.

### "Page not found" sur Netlify
Vérifie le fichier `netlify.toml` et l'URL Railway.

### CORS errors
Ajoute l'URL Netlify exacte dans les variables Railway :
```
CORS_ALLOWED_ORIGINS=https://amidjor-abc123.netlify.app
```

---

## 📞 URLs finales

Une fois déployé, tu auras :

- 🌐 **Site** : `https://amidjor-xxx.netlify.app`
- 🔧 **API** : `https://amidjor-backend.railway.app`
- 🔐 **Admin** : `https://amidjor-backend.railway.app/admin`

---

**Prêt ? Commence par Railway Étape 1 !** 🚀
