# Roadmap - Amidjor Platform

## 🎯 Architecture Actuelle: Clean Django Monolith

**Philosophie:** Pas d'abstraction prématurée. Ajouter seulement quand nécessaire.

---

## ✅ Phase 1: PRODUCTION READY (Actuel)

### Core Business
- [x] Order management (pending → contacted → confirmed → cancelled)
- [x] Product catalog with stock
- [x] Django Admin avec actions
- [x] WhatsApp integration (simple)
- [x] Basic stats in admin

### Structure
```
backend/
├── orders/          # Orders + OrderService simple
├── products/        # Products + Categories
├── analytics/       # Simple stats only
├── config/          # Settings + URLs
├── templates/       # Admin templates
├── ROADMAP.md
└── SECURITY.md
```

**Règle d'or:** Chaque feature doit justifier son existence.

---

## 🔜 Phase 2: AMÉLIORATIONS (Si besoin réel)

### 1. JWT Auth (si tu veux customer accounts)
```
POST /api/auth/login/
POST /api/auth/register/
GET  /api/me/orders/
```

### 2. Order Tracking (si clients demandent)
```
GET /api/orders/{id}/track/
→ Timeline: created → contacted → confirmed
```

### 3. Simple Notifications
```python
# Django signals (pas de event system complexe)
@receiver(post_save, sender=Order)
def notify_order_created(sender, instance, created, **kwargs):
    if created:
        send_whatsapp(instance)
```

---

## ❌ PAS NÉCESSAIRE (pour l'instant)

| Feature | Pourquoi pas |
|---------|-------------|
| Event-driven architecture | Trop complexe pour WhatsApp simple |
| Celery/Redis | Pas de traitement async nécessaire |
| Multi-tenancy | Un seul client (toi) |
| BI/Analytics avancé | Stats basiques suffisent |
| Microservices | Overkill pour ce volume |

---

## 🧠 Principes à Garder

1. **Simplicité > Abstraction**
   - Django signals suffisent (pas d'event bus)
   - Fonctions simples (pas de service layer complexe)

2. **YAGNI (You Aren't Gonna Need It)**
   - Ne pas coder "au cas où"
   - Attendre le besoin réel

3. **Clean Code != Over-Engineering**
   - Simple est mieux que complexe
   - KISS: Keep It Simple, Stupid

---

**Dernière mise à jour:** 2024-01-15
**Prochaine review:** Quand un vrai besoin émerge
