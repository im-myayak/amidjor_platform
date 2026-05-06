from django.db import models
from django.utils.text import slugify


class Article(models.Model):
    """Blog article model for SEO content management."""
    
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('published', 'Publié'),
    ]
    
    title = models.CharField(max_length=200, verbose_name="Titre")
    slug = models.SlugField(max_length=200, unique=True, blank=True, verbose_name="Slug URL")
    excerpt = models.TextField(max_length=500, verbose_name="Extrait/Résumé")
    content = models.TextField(verbose_name="Contenu complet")
    image = models.URLField(
        max_length=500, 
        blank=True, 
        verbose_name="URL de l'image",
        help_text="URL d'une image (Unsplash, etc.)"
    )
    meta_title = models.CharField(
        max_length=70, 
        blank=True, 
        verbose_name="Meta Title (SEO)",
        help_text="Titre pour Google (max 70 caractères)"
    )
    meta_description = models.CharField(
        max_length=160, 
        blank=True, 
        verbose_name="Meta Description (SEO)",
        help_text="Description pour Google (max 160 caractères)"
    )
    status = models.CharField(
        max_length=10, 
        choices=STATUS_CHOICES, 
        default='draft',
        verbose_name="Statut"
    )
    published_at = models.DateTimeField(
        null=True, 
        blank=True, 
        verbose_name="Date de publication"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = "Article"
        verbose_name_plural = "Articles"
        ordering = ['-published_at', '-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return f"/blog/{self.slug}/"
