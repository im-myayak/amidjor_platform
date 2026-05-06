"""
Dashboard API - DEPRECATED

This module is deprecated. Use analytics/api.py instead.

URL changes:
- /api/dashboard/stats/ → /api/internal/analytics/dashboard/
- /api/dashboard/orders/stats/ → /api/internal/analytics/orders/
- /api/dashboard/inventory/stats/ → /api/internal/analytics/inventory/

Kept for backward compatibility during migration.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from analytics.services import (
    OrderAnalyticsService,
    InventoryAnalyticsService,
    DashboardAnalyticsService
)
from products.services import CategoryService


@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_stats(request):
    """DEPRECATED - Use /api/internal/analytics/dashboard/ instead."""
    data = DashboardAnalyticsService.get_full_dashboard()
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def order_stats(request):
    """DEPRECATED - Use /api/internal/analytics/orders/ instead."""
    stats = OrderAnalyticsService.get_order_stats()
    return Response(stats)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def inventory_stats(request):
    """DEPRECATED - Use /api/internal/analytics/inventory/ instead."""
    inventory = InventoryAnalyticsService.get_inventory_stats()
    category_stats = CategoryService.get_category_stats()

    return Response({
        **inventory,
        'category_stats': category_stats,
    })
