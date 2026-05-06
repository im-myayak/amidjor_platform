from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product', 'product_name', 'product_price', 'quantity', 'price', 'subtotal']
        read_only_fields = ['price', 'subtotal']  # Set by backend only


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'customer_name', 'customer_phone', 'customer_email', 'total_price', 'status', 'created_at', 'updated_at', 'items']
        read_only_fields = ['total_price', 'status', 'created_at', 'updated_at']
        extra_kwargs = {
            'customer_email': {'required': False},
        }

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Order must have at least one item.")
        return value