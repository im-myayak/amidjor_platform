from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem
from .services import OrderService
from analytics.services import OrderAnalyticsService


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['subtotal', 'product_price_display']
    fields = ['product', 'quantity', 'price', 'subtotal', 'product_price_display']

    def product_price_display(self, obj):
        return f"{obj.product.price:,.0f} GNF" if obj.product else "-"
    product_price_display.short_description = 'Current Price'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'customer_name', 'customer_phone', 'customer_email',
        'total_price_display', 'status_badge', 'created_at', 'updated_at'
    ]
    list_display_links = ['id', 'customer_name']
    search_fields = ['id', 'customer_name', 'customer_phone', 'customer_email']
    list_filter = ['status', 'created_at', 'updated_at']
    readonly_fields = ['created_at', 'updated_at', 'total_price', 'status_history']
    inlines = [OrderItemInline]
    actions = ['mark_contacted', 'mark_confirmed', 'mark_cancelled']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']

    fieldsets = (
        ('Customer Info', {
            'fields': ('customer_name', 'customer_phone', 'customer_email')
        }),
        ('Order Details', {
            'fields': ('status', 'total_price', 'status_history')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def total_price_display(self, obj):
        return f"{obj.total_price:,.0f} GNF"
    total_price_display.short_description = 'Total'
    total_price_display.admin_order_field = 'total_price'

    def status_badge(self, obj):
        colors = {
            'pending': 'orange',
            'contacted': 'blue',
            'confirmed': 'green',
            'cancelled': 'red',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 3px; font-size: 11px; text-transform: uppercase;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def status_history(self, obj):
        """Display order timeline."""
        return format_html(
            '<div style="line-height: 1.6;">'
            '<strong>Created:</strong> {}<br>'
            '<strong>Last Updated:</strong> {}<br>'
            '<strong>Current Status:</strong> {}'
            '</div>',
            obj.created_at.strftime('%Y-%m-%d %H:%M'),
            obj.updated_at.strftime('%Y-%m-%d %H:%M'),
            obj.get_status_display()
        )
    status_history.short_description = 'Timeline'

    # Admin Actions - Using Service Layer
    @admin.action(description='Mark selected orders as Contacted')
    def mark_contacted(self, request, queryset):
        count = 0
        for order in queryset:
            OrderService.mark_as_contacted(order, contacted_by=request.user.username)
            count += 1
        self.message_user(request, f'{count} order(s) marked as contacted.')

    @admin.action(description='Mark selected orders as Confirmed')
    def mark_confirmed(self, request, queryset):
        count = 0
        for order in queryset:
            OrderService.confirm_order(order, confirmed_by=request.user.username)
            count += 1
        self.message_user(request, f'{count} order(s) marked as confirmed.')

    @admin.action(description='Mark selected orders as Cancelled')
    def mark_cancelled(self, request, queryset):
        count = 0
        for order in queryset:
            OrderService.cancel_order(order, cancelled_by=request.user.username)
            count += 1
        self.message_user(request, f'{count} order(s) marked as cancelled.')

    def changelist_view(self, request, extra_context=None):
        """Add stats to the order list view."""
        stats = OrderAnalyticsService.get_order_stats()

        extra_context = extra_context or {}
        extra_context['stats'] = {
            'total': stats['total'],
            'pending': stats['pending'],
            'contacted': stats['contacted'],
            'confirmed': stats['confirmed'],
            'cancelled': stats['cancelled'],
            'revenue': stats['revenue'],
        }

        return super().changelist_view(request, extra_context=extra_context)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order_link', 'product', 'quantity', 'price_display', 'subtotal_display']
    search_fields = ['order__customer_name', 'product__name', 'order__id']
    list_filter = ['order__status', 'order__created_at']
    readonly_fields = ['subtotal']

    def order_link(self, obj):
        return format_html(
            '<a href="/admin/orders/order/{}/change/">Order #{}</a>',
            obj.order.id, obj.order.id
        )
    order_link.short_description = 'Order'

    def price_display(self, obj):
        return f"{obj.price:,.0f} GNF"
    price_display.short_description = 'Price'

    def subtotal_display(self, obj):
        return f"{obj.subtotal:,.0f} GNF"
    subtotal_display.short_description = 'Subtotal'