"""
Simple Analytics for Admin Dashboard

Lightweight stats for Django Admin - no over-engineering.
"""
from typing import Dict
from django.db.models import Count, Sum
from django.utils import timezone
from orders.models import Order
from products.models import Product


class OrderAnalyticsService:
    """Simple order stats for admin dashboard."""

    @staticmethod
    def get_order_stats() -> Dict:
        """Get basic order statistics."""
        queryset = Order.objects.all()

        # Count by status
        status_counts = queryset.values('status').annotate(count=Count('id'))
        counts = {item['status']: item['count'] for item in status_counts}

        # Revenue from confirmed orders
        revenue = queryset.filter(status='confirmed').aggregate(
            total=Sum('total_price')
        )['total'] or 0

        return {
            'total': queryset.count(),
            'pending': counts.get('pending', 0),
            'contacted': counts.get('contacted', 0),
            'confirmed': counts.get('confirmed', 0),
            'cancelled': counts.get('cancelled', 0),
            'revenue': float(revenue),
        }


class InventoryAnalyticsService:
    """Simple inventory stats for admin dashboard."""

    @staticmethod
    def get_inventory_stats() -> Dict:
        """Get basic inventory statistics."""
        total = Product.objects.count()
        active = Product.objects.filter(is_active=True).count()
        low_stock = Product.objects.filter(stock__lte=10, stock__gt=0).count()
        out_of_stock = Product.objects.filter(stock=0).count()

        return {
            'total': total,
            'active': active,
            'low_stock': low_stock,
            'out_of_stock': out_of_stock,
        }
