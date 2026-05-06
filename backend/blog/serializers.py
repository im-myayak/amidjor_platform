from rest_framework import serializers
from .models import Article


class ArticleListSerializer(serializers.ModelSerializer):
    """Serializer for article list view."""
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'slug', 'excerpt', 'image', 'published_at', 'created_at']


class ArticleDetailSerializer(serializers.ModelSerializer):
    """Serializer for article detail view."""
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'image',
            'meta_title', 'meta_description',
            'published_at', 'created_at', 'updated_at'
        ]
