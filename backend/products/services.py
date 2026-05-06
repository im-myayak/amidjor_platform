"""
Product Service Layer - Business Logic for Products

All product business logic is centralized here.
"""
from typing import Optional, List, Dict
from django.db.models import Count
from .models import Product, Category


class ProductService:
    """Service class for all product business logic."""

    @staticmethod
    def create_product(name: str, description: str, price: float, stock: int, category_id: int, image=None) -> Product:
        """Create a new product."""
        category = Category.objects.get(id=category_id)
        product = Product.objects.create(
            name=name,
            description=description,
            price=price,
            stock=stock,
            category=category,
            image=image,
            is_active=True
        )
        return product

    @staticmethod
    def update_product(product: Product, **kwargs) -> Product:
        """Update product fields."""
        allowed_fields = ['name', 'description', 'price', 'stock', 'category', 'image', 'is_active']

        for field, value in kwargs.items():
            if field in allowed_fields:
                setattr(product, field, value)

        product.save()
        return product

    @staticmethod
    def activate_product(product: Product) -> Product:
        """Activate product."""
        product.is_active = True
        product.save()
        return product

    @staticmethod
    def deactivate_product(product: Product) -> Product:
        """Deactivate product."""
        product.is_active = False
        product.save()
        return product

    @staticmethod
    def update_stock(product: Product, quantity_change: int) -> Product:
        """Update product stock (positive for add, negative for subtract)."""
        product.stock += quantity_change
        if product.stock < 0:
            product.stock = 0
        product.save()
        return product

    @staticmethod
    def get_active_products():
        """Get all active products with stock > 0."""
        return Product.objects.filter(is_active=True, stock__gt=0)

    @staticmethod
    def get_low_stock_products(threshold: int = 10):
        """Get products with low stock."""
        return Product.objects.filter(stock__lte=threshold, stock__gt=0, is_active=True)


class CategoryService:
    """Service class for category business logic."""

    @staticmethod
    def create_category(name: str) -> Category:
        """Create a new category."""
        return Category.objects.create(name=name)

    @staticmethod
    def get_category_stats() -> List[Dict]:
        """Get product counts per category."""
        return list(Category.objects.annotate(
            product_count=Count('products')
        ).values('name', 'product_count'))
