"""
Products Internal API - Staff/Admin Endpoints for Product Management

These endpoints are for INTERNAL USE ONLY (staff/admin dashboard).
Base URL: /api/internal/products/

⚠️ NEVER expose to public/customer.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer
from .services import ProductService, CategoryService


class ProductInternalViewSet(viewsets.ModelViewSet):
    """
    Internal Product API (Staff/Admin only)

    Endpoints:
    - GET /api/internal/products/ - List all products
    - GET /api/internal/products/{id}/ - Get product details
    - POST /api/internal/products/ - Create product
    - PATCH /api/internal/products/{id}/ - Update product
    - DELETE /api/internal/products/{id}/ - Delete product
    - POST /api/internal/products/{id}/activate/ - Activate product
    - POST /api/internal/products/{id}/deactivate/ - Deactivate product
    """
    queryset = Product.objects.all().select_related('category')
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        """Use ProductService for creation."""
        data = serializer.validated_data
        product = ProductService.create_product(
            name=data['name'],
            description=data.get('description', ''),
            price=data['price'],
            stock=data.get('stock', 0),
            category_id=data['category'].id,
            image=data.get('image')
        )
        return product

    def perform_update(self, serializer):
        """Use ProductService for updates."""
        product = serializer.instance
        data = serializer.validated_data

        update_fields = {
            'name': data.get('name', product.name),
            'description': data.get('description', product.description),
            'price': data.get('price', product.price),
            'stock': data.get('stock', product.stock),
            'category': data.get('category', product.category),
            'image': data.get('image', product.image),
            'is_active': data.get('is_active', product.is_active),
        }

        ProductService.update_product(product, **update_fields)
        return product

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate product."""
        product = self.get_object()
        ProductService.activate_product(product)
        return Response({
            'success': True,
            'product_id': product.id,
            'is_active': product.is_active,
            'message': 'Product activated'
        })

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate product."""
        product = self.get_object()
        ProductService.deactivate_product(product)
        return Response({
            'success': True,
            'product_id': product.id,
            'is_active': product.is_active,
            'message': 'Product deactivated'
        })

    @action(detail=True, methods=['post'])
    def update_stock(self, request, pk=None):
        """Update product stock."""
        product = self.get_object()
        quantity_change = request.data.get('quantity_change', 0)

        try:
            quantity_change = int(quantity_change)
        except (ValueError, TypeError):
            return Response({
                'success': False,
                'error': 'Invalid quantity_change'
            }, status=status.HTTP_400_BAD_REQUEST)

        ProductService.update_stock(product, quantity_change)
        return Response({
            'success': True,
            'product_id': product.id,
            'stock': product.stock,
            'message': f'Stock updated by {quantity_change}'
        })


class CategoryAdminViewSet(viewsets.ModelViewSet):
    """
    Admin Category API
    """
    queryset = Category.objects.all().prefetch_related('products')
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]
