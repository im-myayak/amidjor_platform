from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Article
from .serializers import ArticleListSerializer, ArticleDetailSerializer


@api_view(['GET'])
def article_list(request):
    """
    GET /api/articles/ - List all published articles
    Query params:
      - limit: number of articles to return (default: all)
    """
    limit = request.query_params.get('limit')
    
    articles = Article.objects.filter(
        status='published'
    ).order_by('-published_at', '-created_at')
    
    if limit:
        try:
            articles = articles[:int(limit)]
        except ValueError:
            pass
    
    serializer = ArticleListSerializer(articles, many=True)
    return Response({
        'count': len(serializer.data),
        'results': serializer.data
    })


@api_view(['GET'])
def article_detail(request, slug):
    """
    GET /api/articles/{slug}/ - Get single article by slug
    """
    article = get_object_or_404(
        Article, 
        slug=slug, 
        status='published'
    )
    serializer = ArticleDetailSerializer(article)
    return Response(serializer.data)
