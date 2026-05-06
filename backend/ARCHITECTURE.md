# Architecture SaaS Hybride - Amidjor Platform

## 🏗️ Vue d'ensemble

Architecture en 3 couches pour transformation progressive vers SaaS scalable.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  React/Vue   │  │  WhatsApp    │  │  Future Mobile App       │  │
│  │  (Future)    │  │  (Current)   │  │                          │  │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬──────────────┘  │
└─────────┼─────────────────┼──────────────────────┼─────────────────┘
          │                 │                      │
          └─────────────────┴──────────────────────┘
                            │
          ┌─────────────────┴──────────────────────┐
          │         PUBLIC API (/api/)              │
          │  • GET /products/                       │
          │  • POST /orders/ (throttled)             │
          │  • GET /categories/                      │
          └─────────────────┬──────────────────────┘
                            │
┌───────────────────────────┼───────────────────────────────────────────┐
│                           │                                           │
│  ┌────────────────────────┼───────────────────────────────────────┐   │
│  │      SERVICE LAYER     │  Business Logic (Write Operations)   │   │
│  │                        │                                       │   │
│  │  orders/services.py    │  • OrderService                       │   │
│  │  products/services.py  │  • ProductService                     │   │
│  │                        │  • CategoryService                    │   │
│  └────────────────────────┼───────────────────────────────────────┘   │
│                           │                                           │
│  ┌────────────────────────┼───────────────────────────────────────┐   │
│  │   ANALYTICS LAYER    │  Read-Only Dashboard Stats            │   │
│  │                        │                                       │   │
│  │  analytics/services.py │  • OrderAnalyticsService              │   │
│  │                        │  • InventoryAnalyticsService          │   │
│  │                        │  • DashboardAnalyticsService          │   │
│  └────────────────────────┼───────────────────────────────────────┘   │
│                           │                                           │
└───────────────────────────┼───────────────────────────────────────────┘
                            │
          ┌─────────────────┴──────────────────────┐
          │       INTERNAL API (/api/internal/)    │
          │  ⚠️ STAFF ONLY - Never expose public  │
          │                                        │
          │  • GET/POST/PATCH /orders/             │
          │  • POST /orders/{id}/confirm/          │
          │  • POST /orders/{id}/cancel/           │
          │  • GET/POST/PATCH /products/           │
          └─────────────────┬──────────────────────┘
                            │
          ┌─────────────────┴──────────────────────┐
          │    ANALYTICS API (/api/internal/)    │
          │  ⚠️ STAFF ONLY - Dashboard & BI        │
          │                                        │
          │  • GET /analytics/dashboard/           │
          │  • GET /analytics/orders/              │
          │  • GET /analytics/inventory/           │
          │  • GET /analytics/revenue/             │
          └────────────────────────────────────────┘

          ┌────────────────────────────────────────┐
          │         DJANGO ADMIN (/admin/)         │
          │     Internal Back-Office Interface     │
          │                                        │
          │  • Uses services layer                 │
          │  • Custom templates with stats         │
          │  • Actions call business logic         │
          └────────────────────────────────────────┘
```

## 📁 Structure des dossiers

```
backend/
├── config/                    # Configuration Django
│   ├── settings.py
│   ├── urls.py               # ✅ Clean API separation
│   └── ...
│
├── orders/
│   ├── models.py             # Order, OrderItem
│   ├── services.py           # ✅ OrderService (business logic)
│   ├── views.py              # Public API (customer checkout)
│   ├── api.py                # ✅ Internal API (staff only)
│   ├── admin.py              # ✅ Uses OrderService
│   ├── serializers.py
│   └── templates/
│       └── admin/
│           └── orders/
│               └── change_list.html  # ✅ Stats cards
│
├── products/
│   ├── models.py             # Product, Category
│   ├── services.py           # ✅ ProductService, CategoryService
│   ├── views.py              # Public API (catalog)
│   ├── api.py                # ✅ Internal API (staff only)
│   ├── admin.py              # ✅ Uses ProductService
│   └── templates/
│       └── admin/
│           └── products/
│               └── change_list.html  # ✅ Inventory stats
│
├── analytics/                # ✅ NEW: Dashboard & BI
│   ├── __init__.py
│   ├── services.py           # OrderAnalyticsService, InventoryAnalyticsService
│   └── api.py                # Analytics endpoints
│
├── dashboard/                # ✅ DEPRECATED: Old dashboard (redirects)
│   └── api.py
│
└── ARCHITECTURE.md           # ✅ This file
```

## 🔐 Sécurité - Qui voit quoi ?

| Ressource | Client | Admin Django | Internal API |
|-----------|--------|--------------|--------------|
| `/api/products/` | ✅ | ✅ | ✅ |
| `/api/orders/` (POST) | ✅ (throttled) | ✅ | ✅ |
| `/api/orders/` (GET) | ❌ | ✅ | ✅ |
| `/api/internal/*` | ❌ | ⚠️ Via service | ✅ (staff) |
| `/api/internal/analytics/*` | ❌ | ⚠️ Via service | ✅ (staff) |
| `/admin/` | ❌ | ✅ | ❌ |

**Légende:**
- ✅ = Accès autorisé
- ❌ = Pas d'accès
- ⚠️ = Accès indirect via service layer

## 🔄 Flux de données

### 1. Commande client (Public API)

```
Client
  ↓ POST /api/orders/
OrderViewSet (throttled)
  ↓
OrderService.create_order()
  ↓
Database (status = 'pending')
  ↓
Response: {order_id, total_price, status}
```

### 2. Gestion admin (Internal API)

```
Admin Dashboard (React/Vue)
  ↓ GET /api/internal/orders/
OrderInternalViewSet
  ↓
Order.objects.all()
  ↓
Response: Orders list

Admin clicks "Confirm"
  ↓ POST /api/internal/orders/123/confirm/
OrderInternalViewSet.confirm()
  ↓
OrderService.confirm_order()
  ↓
Database (status = 'confirmed')
  ↓
Response: {success: true, status: 'confirmed'}
```

### 3. Dashboard stats (Analytics API)

```
Admin Dashboard
  ↓ GET /api/internal/analytics/dashboard/
DashboardAnalyticsService.get_full_dashboard()
  ↓
OrderAnalyticsService.get_order_stats()
InventoryAnalyticsService.get_inventory_stats()
  ↓
Response: {orders: {...}, inventory: {...}, funnel: {...}}
```

## 📊 Endpoints API

### Public API (`/api/`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/categories/` | List categories | None |
| GET | `/products/` | List products | None |
| GET | `/products/{id}/` | Product detail | None |
| POST | `/orders/` | Create order (throttled) | None |

### Internal API (`/api/internal/`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/orders/` | List all orders | Admin |
| GET | `/orders/{id}/` | Order detail | Admin |
| PATCH | `/orders/{id}/` | Update order | Admin |
| POST | `/orders/{id}/contacted/` | Mark contacted | Admin |
| POST | `/orders/{id}/confirm/` | Confirm order | Admin |
| POST | `/orders/{id}/cancel/` | Cancel order | Admin |
| GET/POST | `/products/` | CRUD products | Admin |
| GET/POST | `/categories/` | CRUD categories | Admin |

### Analytics API (`/api/internal/analytics/`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/dashboard/` | Full dashboard | Admin |
| GET | `/orders/` | Order stats | Admin |
| GET | `/orders/funnel/` | Conversion funnel | Admin |
| GET | `/inventory/` | Inventory stats | Admin |
| GET | `/revenue/?days=30` | Revenue trends | Admin |

## 🧠 Principes architecturaux

### 1. Service Layer Pattern

**❌ Avant (incorrect):**
```python
# admin.py
order.status = 'confirmed'  # ❌ Direct modification
order.save()
```

**✅ Après (correct):**
```python
# admin.py
OrderService.confirm_order(order, confirmed_by=request.user)  # ✅ Via service

# services.py
class OrderService:
    @staticmethod
    def confirm_order(order, confirmed_by=None):
        if order.status in ['pending', 'contacted']:
            order.status = 'confirmed'
            order.save()
            # TODO: Send email, log activity
```

### 2. Separation of Concerns

```
orders/services.py     → Business logic (WRITE)
analytics/services.py  → Statistics (READ ONLY)
```

### 3. Naming Convention

- **Public API:** `ProductViewSet` (no suffix)
- **Internal API:** `ProductInternalViewSet` (Internal suffix)
- **Analytics:** `OrderAnalyticsService` (Analytics suffix)

### 4. URL Structure

```
/api/                 → Public (customer)
/api/internal/        → Internal (staff)
/api/internal/analytics/ → Dashboard (staff)
/admin/               → Django Admin
```

## 🚀 Roadmap SaaS

### Phase 1: ✅ Actuel
- [x] Service layer implementation
- [x] Clean API separation
- [x] Django Admin with services
- [x] Analytics module

### Phase 2: Prochaine étape
- [ ] JWT Authentication
- [ ] Rate limiting avancé
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Tests unitaires services

### Phase 3: SaaS Scale
- [ ] React/Vue Dashboard
- [ ] Redis caching for analytics
- [ ] Multi-tenancy architecture
- [ ] Background jobs (Celery)
- [ ] Audit logging

## 📝 Notes importantes

1. **Revenue Calculation:** Les revenus sont calculés à partir du `total_price` stocké dans la commande (snapshot au moment de la commande), PAS des prix produits actuels.

2. **Status Transitions:** Voir `OrderService.can_transition_to()` pour les transitions valides:
   - `pending` → `contacted`, `confirmed`, `cancelled`
   - `contacted` → `confirmed`, `cancelled`
   - `confirmed` → `cancelled` (terminal)
   - `cancelled` → (terminal)

3. **Security:** Tous les endpoints `/api/internal/` nécessitent `IsAdminUser`.

4. **Throttling:** Le endpoint `POST /api/orders/` a un rate limiting de 5 requêtes/minute pour éviter le spam.

## 🔗 Liens utiles

- [Django Admin](http://localhost:8000/admin/)
- [API Root](http://localhost:8000/api/)
- [Internal API](http://localhost:8000/api/internal/) (requires auth)
- [Analytics API](http://localhost:8000/api/internal/analytics/dashboard/) (requires auth)

---

**Version:** 1.0  
**Dernière mise à jour:** 2024-01-15  
**Architecture:** SaaS-ready, 3-layer separation
