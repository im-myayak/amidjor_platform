"""
Simple Analytics API - Admin Dashboard Stats

Lightweight endpoints for admin dashboard.
Base URL: /api/internal/analytics/
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .services import OrderAnalyticsService, InventoryAnalyticsService


@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_overview(request):
    """GET /api/internal/analytics/dashboard/"""
    return Response({
        'orders': OrderAnalyticsService.get_order_stats(),
        'inventory': InventoryAnalyticsService.get_inventory_stats(),
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def order_stats(request):
    """GET /api/internal/analytics/orders/"""
    return Response(OrderAnalyticsService.get_order_stats())


@api_view(['GET'])
@permission_classes([IsAdminUser])
def inventory_stats(request):
    """GET /api/internal/analytics/inventory/"""
    return Response(InventoryAnalyticsService.get_inventory_stats())
