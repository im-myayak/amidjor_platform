from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product
from .services import ProductService, CategoryService
from analytics.services import InventoryAnalyticsService


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'product_count']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Products'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'name', 'price_display', 'stock_display',
        'category', 'is_active_badge', 'created_at'
    ]
    list_display_links = ['id', 'name']
    search_fields = ['name', 'description']
    list_filter = ['category', 'is_active', 'created_at']
    list_editable = ['category']
    readonly_fields = ['created_at']
    actions = ['activate_products', 'deactivate_products']

    def price_display(self, obj):
        return f"{obj.price:,.0f} GNF"
    price_display.short_description = 'Price'
    price_display.admin_order_field = 'price'

    def stock_display(self, obj):
        color = 'green' if obj.stock > 10 else ('orange' if obj.stock > 0 else 'red')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, obj.stock
        )
    stock_display.short_description = 'Stock'
    stock_display.admin_order_field = 'stock'

    def is_active_badge(self, obj):
        if obj.is_active:
            return format_html(
                '<span style="background-color: #28a745; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">ACTIVE</span>'
            )
        return format_html(
            '<span style="background-color: #dc3545; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">INACTIVE</span>'
        )
    is_active_badge.short_description = 'Status'

    # Admin Actions - Using Service Layer
    @admin.action(description='Activate selected products')
    def activate_products(self, request, queryset):
        count = 0
        for product in queryset:
            ProductService.activate_product(product)
            count += 1
        self.message_user(request, f'{count} product(s) activated.')

    @admin.action(description='Deactivate selected products')
    def deactivate_products(self, request, queryset):
        count = 0
        for product in queryset:
            ProductService.deactivate_product(product)
            count += 1
        self.message_user(request, f'{count} product(s) deactivated.')

    def changelist_view(self, request, extra_context=None):
        """Add inventory stats to product list."""
        inventory_stats = InventoryAnalyticsService.get_inventory_stats()
        category_stats = CategoryService.get_category_stats()

        extra_context = extra_context or {}
        extra_context['inventory_stats'] = {
            'total': inventory_stats['total'],
            'active': inventory_stats['active'],
            'low_stock': inventory_stats['low_stock'],
            'out_of_stock': inventory_stats['out_of_stock'],
        }
        extra_context['category_stats'] = category_stats
        return super().changelist_view(request, extra_context=extra_context)