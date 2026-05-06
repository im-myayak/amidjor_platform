from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from config.permissions import IsAdminOrContentManager, IsAdminOrContentManagerOrReadOnly
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """Admin only - Categories are managed by staff, not public."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]  # Explicitly locked


class ProductViewSet(viewsets.ModelViewSet):
    """Public read, admin write - Products browsable by everyone."""
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrContentManagerOrReadOnly]  # Explicit: public read, protected write