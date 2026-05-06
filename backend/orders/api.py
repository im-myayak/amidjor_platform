"""
Orders Internal API - Staff/Admin Endpoints for Order Management

These endpoints are for INTERNAL USE ONLY (staff/admin dashboard).
Base URL: /api/internal/orders/

⚠️ NEVER expose to public/customer.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from .services import OrderService


class OrderInternalViewSet(viewsets.ModelViewSet):
    """
    Internal Order API (Staff/Admin only)

    Endpoints:
    - GET /api/internal/orders/ - List all orders
    - GET /api/internal/orders/{id}/ - Get order details
    - PATCH /api/internal/orders/{id}/ - Update order (admin only fields)
    - POST /api/internal/orders/{id}/contacted/ - Mark as contacted
    - POST /api/internal/orders/{id}/confirm/ - Confirm order
    - POST /api/internal/orders/{id}/cancel/ - Cancel order
    """
    queryset = Order.objects.all().prefetch_related('items__product')
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['post'])
    def contacted(self, request, pk=None):
        """Mark order as contacted."""
        order = self.get_object()
        OrderService.mark_as_contacted(order, contacted_by=request.user.username)
        return Response({
            'success': True,
            'order_id': order.id,
            'status': order.status,
            'message': 'Order marked as contacted'
        })

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm order."""
        order = self.get_object()

        # Validate transition
        if not OrderService.can_transition_to(order, 'confirmed'):
            return Response({
                'success': False,
                'error': f'Cannot confirm order with status: {order.status}'
            }, status=status.HTTP_400_BAD_REQUEST)

        OrderService.confirm_order(order, confirmed_by=request.user.username)
        return Response({
            'success': True,
            'order_id': order.id,
            'status': order.status,
            'message': 'Order confirmed'
        })

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel order."""
        order = self.get_object()
        reason = request.data.get('reason', '')

        OrderService.cancel_order(order, reason=reason, cancelled_by=request.user.username)
        return Response({
            'success': True,
            'order_id': order.id,
            'status': order.status,
            'message': 'Order cancelled'
        })

    @action(detail=True, methods=['patch'])
    def status(self, request, pk=None):
        """Update order status (generic endpoint)."""
        order = self.get_object()
        new_status = request.data.get('status')

        if not new_status:
            return Response({
                'success': False,
                'error': 'Status is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Map status to service method
        status_map = {
            'contacted': OrderService.mark_as_contacted,
            'confirmed': OrderService.confirm_order,
            'cancelled': OrderService.cancel_order,
        }

        if new_status not in status_map:
            return Response({
                'success': False,
                'error': f'Invalid status: {new_status}'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate transition
        if not OrderService.can_transition_to(order, new_status):
            return Response({
                'success': False,
                'error': f'Cannot transition from {order.status} to {new_status}'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Execute service method
        service_method = status_map[new_status]
        if new_status == 'cancelled':
            service_method(order, reason=request.data.get('reason', ''), cancelled_by=request.user.username)
        else:
            service_method(order, confirmed_by=request.user.username if new_status == 'confirmed' else None,
                         contacted_by=request.user.username if new_status == 'contacted' else None)

        return Response({
            'success': True,
            'order_id': order.id,
            'status': order.status,
            'message': f'Order status updated to {new_status}'
        })


class OrderItemInternalViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Internal Order Items API - Read only (Staff/Admin only)
    """
    queryset = OrderItem.objects.all().select_related('order', 'product')
    serializer_class = OrderItemSerializer
    permission_classes = [IsAdminUser]
