from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Order


@receiver(post_save, sender=Order)
def send_order_notification_email(sender, instance, created, **kwargs):
    """
    Send email notification to admin when a new order is created.
    """
    if created:
        subject = f'New Order #{instance.id} - {instance.customer_name}'
        
        # Build products list
        products_list = ""
        for item in instance.items.all():
            products_list += f"- {item.product.name} (x{item.quantity}) - ${item.subtotal}\n"
        
        message = f"""
A new order has been placed:

Customer Information:
- Name: {instance.customer_name}
- Phone: {instance.customer_phone}
- Email: {instance.customer_email or 'Not provided'}

Order Details:
{products_list}
Total Price: ${instance.total_price}

Status: {instance.status}
Created: {instance.created_at}
"""
        
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.ADMIN_EMAIL],
                fail_silently=False,
            )
        except Exception as e:
            # Log the error in production
            print(f"Failed to send email: {e}")