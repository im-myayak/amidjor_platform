"""
Order Service Layer - Business Logic for Orders

All order business logic is centralized here.
Never modify order status directly from admin or views.

NOTE: Dashboard/Analytics logic is in analytics/services.py
This file contains ONLY business state changes (write operations).
"""
from typing import Optional, Dict, List
from .models import Order, OrderItem


class OrderService:
    """Service class for all order business logic."""

    @staticmethod
    def create_order(customer_name: str, customer_phone: str, customer_email: Optional[str], items_data: List[Dict]) -> Order:
        """Create a new order with calculated pricing."""
        from products.models import Product

        # Create order with pending status
        order = Order.objects.create(
            customer_name=customer_name,
            customer_phone=customer_phone,
            customer_email=customer_email,
            status='pending',
            total_price=0  # Will be calculated after items creation
        )

        # Create order items with backend-controlled pricing
        total_price = 0
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
            total_price += subtotal

        # Update order total
        order.total_price = total_price
        order.save()

        return order

    @staticmethod
    def mark_as_contacted(order: Order, contacted_by: Optional[str] = None) -> Order:
        """Mark order as contacted by admin."""
        if order.status == 'pending':
            order.status = 'contacted'
            order.save()
            # TODO: Send notification email to customer
            # TODO: Log activity
        return order

    @staticmethod
    def confirm_order(order: Order, confirmed_by: Optional[str] = None) -> Order:
        """Confirm order - only valid if order was contacted or pending."""
        if order.status in ['pending', 'contacted']:
            order.status = 'confirmed'
            order.save()
            # TODO: Send confirmation email to customer
            # TODO: Log activity
            # TODO: Notify logistics/warehouse
        return order

    @staticmethod
    def cancel_order(order: Order, reason: Optional[str] = None, cancelled_by: Optional[str] = None) -> Order:
        """Cancel order - can be cancelled from any status except already cancelled."""
        if order.status != 'cancelled':
            order.status = 'cancelled'
            order.save()
            # TODO: Send cancellation email to customer
            # TODO: Log activity with reason
            # TODO: Restock inventory if needed
        return order

    @staticmethod
    def can_transition_to(order: Order, new_status: str) -> bool:
        """Check if status transition is valid."""
        valid_transitions = {
            'pending': ['contacted', 'confirmed', 'cancelled'],
            'contacted': ['confirmed', 'cancelled'],
            'confirmed': ['cancelled'],  # Cannot go back
            'cancelled': [],  # Terminal state
        }
        return new_status in valid_transitions.get(order.status, [])
