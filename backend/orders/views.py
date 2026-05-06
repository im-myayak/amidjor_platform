from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.throttling import AnonRateThrottle
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer


class OrderCreateThrottle(AnonRateThrottle):
    """Custom throttle for order creation to prevent spam."""
    rate = '5/minute'


class OrderViewSet(viewsets.ModelViewSet):
    """
    Order API:
    - POST /orders/    : Public - creates order with 'pending' status
    - GET /orders/     : Admin only
    - GET /orders/{id}/: Admin only
    - PATCH /orders/{id}/: Admin only (for status updates: contacted, confirmed, cancelled)
    - DELETE /orders/{id}/: Admin only
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

    def get_permissions(self):
        """Only order creation is public. Everything else requires admin."""
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

    def get_throttles(self):
        """Apply stricter throttling for order creation."""
        if self.action == 'create':
            return [OrderCreateThrottle()]
        return super().get_throttles()

    def get_queryset(self):
        return Order.objects.prefetch_related('items__product')

    def create(self, request, *args, **kwargs):
        """Create order with 'pending' status. Total price calculated server-side."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        items_data = serializer.validated_data.pop('items', [])
        # Create order with pending status (default)
        order = serializer.save()

        # Create order items with backend-controlled pricing
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            price = product.price  # Server-side price lookup
            subtotal = quantity * price
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=price,
                subtotal=subtotal
            )

        # Calculate total_price (server-side only)
        total_price = sum(item.subtotal for item in order.items.all())
        order.total_price = total_price
        order.save()
        return order

    def partial_update(self, request, *args, **kwargs):
        """Allow admin to update order status."""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)