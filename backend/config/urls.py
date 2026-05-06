"""
URL Configuration - Clean API Architecture

API Structure:
├── /api/                 → Public API (client storefront)
├── /api/internal/        → Internal API (staff/admin only) ⚠️
├── /api/internal/analytics/ → Dashboard & BI (staff only) ⚠️
└── /admin/               → Django Admin (internal back-office)

⚠️ = NEVER expose to public/customer

🚨 SECURITY WARNING 🚨
================================================================================
"Internal" in URL path is for organizational purposes ONLY.
Real security comes from permission_classes on ViewSets, NOT from URL naming.

Example of WRONG security assumption:
    ❌ /api/internal/ → "It's internal so it's safe"

Correct approach:
    ✅ /api/internal/ + permission_classes = [IsAdminUser] → Actually secure

CRITICAL: Every internal endpoint MUST have explicit permission_classes defined.
Default DRF behavior is AllowAny (no security)!
================================================================================
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

# Public API (Customer/Storefront)
from products.views import CategoryViewSet, ProductViewSet
from orders.views import OrderViewSet

# Internal API (Staff/Admin only)
from products.api import ProductInternalViewSet, CategoryAdminViewSet
from orders.api import OrderInternalViewSet, OrderItemInternalViewSet

# Analytics API (Dashboard - Staff only)
from analytics.api import (
    dashboard_overview,
    order_stats,
    inventory_stats,
)
from blog.api import article_list, article_detail

# ============================================================================
# PUBLIC API - Customer-facing endpoints
# ============================================================================
public_router = DefaultRouter()
public_router.register(r'categories', CategoryViewSet, basename='public-categories')
public_router.register(r'products', ProductViewSet, basename='public-products')
public_router.register(r'orders', OrderViewSet, basename='public-orders')

# ============================================================================
# INTERNAL API - Staff/Admin only (future React/Vue dashboard)
# ============================================================================
internal_router = DefaultRouter()
internal_router.register(r'orders', OrderInternalViewSet, basename='internal-orders')
internal_router.register(r'order-items', OrderItemInternalViewSet, basename='internal-order-items')
internal_router.register(r'products', ProductInternalViewSet, basename='internal-products')
internal_router.register(r'categories', CategoryAdminViewSet, basename='internal-categories')

# ============================================================================
# URL Patterns
# ============================================================================
urlpatterns = [
    # Django Admin (internal back-office)
    path('admin/', admin.site.urls),

    # Public API (customer storefront)
    path('api/', include(public_router.urls)),

    # Internal API (staff/admin operations)
    path('api/internal/', include(internal_router.urls)),

    # Analytics API (simple admin stats)
    path('api/internal/analytics/dashboard/', dashboard_overview, name='analytics-dashboard'),
    path('api/internal/analytics/orders/', order_stats, name='analytics-orders'),
    path('api/internal/analytics/inventory/', inventory_stats, name='analytics-inventory'),
    
    # Blog API (Public articles)
    path('api/articles/', article_list, name='article-list'),
    path('api/articles/<slug:slug>/', article_detail, name='article-detail'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)