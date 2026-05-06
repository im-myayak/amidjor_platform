import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchArticles } from '../services/articleService';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await fetchArticles();
      setArticles(data.results || []);
    } catch (err) {
      setError(err.message);
      // Fallback data if API fails
      setArticles([
        {
          id: 1,
          slug: 'agriculture-durable-guinee',
          title: "L'agriculture durable en Guinée : Comment Amidjor innove",
          excerpt: "Découvrez nos techniques innovantes de séchage solaire et de formation agricole pour un avenir plus vert.",
          image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=250&fit=crop",
          published_at: "2025-05-15"
        },
        {
          id: 2,
          slug: 'bienfaits-moringa',
          title: "Les bienfaits du Moringa : Le super-aliment guinéen",
          excerpt: "Le Moringa, surnommé l'arbre de vie, regorge de nutriments essentiels pour votre santé quotidienne.",
          image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop",
          published_at: "2025-05-10"
        },
        {
          id: 3,
          slug: 'transformation-tomate-guinee',
          title: "Transformation locale : De la tomate fraîche au concentré",
          excerpt: "Comment nous transformons les tomates locales en concentré de qualité sans conservateurs artificiels.",
          image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=250&fit=crop",
          published_at: "2025-05-05"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="landing-page">
      <LandingNavbar />
      
      <section className="section articles-page" style={{ paddingTop: '100px' }}>
        <div className="container">
          <h1 className="section-title">Nos Articles & Conseils</h1>
          <p className="section-subtitle">
            Découvrez nos actualités, astuces et expertises en agro-business
          </p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Chargement des articles...</p>
            </div>
          ) : error && articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Aucun article disponible pour le moment.</p>
            </div>
          ) : (
            <div className="blog-grid">
              {articles.map(article => (
                <article key={article.id} className="blog-card">
                  <div className="blog-image">
                    <img 
                      src={article.image || 'https://via.placeholder.com/400x250?text=Amidjor'} 
                      alt={article.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x250?text=Amidjor';
                      }}
                    />
                  </div>
                  <div className="blog-content">
                    <span className="blog-date">{formatDate(article.published_at || article.created_at)}</span>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    <Link to={`/articles/${article.slug}`} className="btn-read-more">
                      Lire l'article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* CTA WhatsApp */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '4rem',
            padding: '2rem',
            background: 'var(--amidjor-cream)',
            borderRadius: '16px'
          }}>
            <h3 style={{ color: 'var(--amidjor-primary)', marginBottom: '1rem' }}>
              Intéressé par nos produits ?
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Commandez directement via WhatsApp et recevez vos produits frais
            </p>
            <a 
              href="https://wa.me/224627797843?text=Bonjour%20Amidjor%2C%20je%20suis%20intéressé%20par%20vos%20produits"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              📱 Commander sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
