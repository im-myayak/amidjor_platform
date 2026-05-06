from django.contrib import admin
from .models import Article


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    """Admin configuration for Blog Articles."""
    
    list_display = ['title', 'status', 'published_at', 'created_at', 'updated_at']
    list_filter = ['status', 'created_at', 'published_at']
    search_fields = ['title', 'excerpt', 'content']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'published_at'
    
    fieldsets = (
        ('Contenu', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'image')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',),
            'description': 'Optimisation pour les moteurs de recherche (Google)'
        }),
        ('Publication', {
            'fields': ('status', 'published_at')
        }),
    )
    
    actions = ['make_published', 'make_draft']
    
    @admin.action(description='Publier les articles sélectionnés')
    def make_published(self, request, queryset):
        from django.utils import timezone
        queryset.update(status='published', published_at=timezone.now())
    
    @admin.action(description='Mettre en brouillon')
    def make_draft(self, request, queryset):
        queryset.update(status='draft', published_at=None)
