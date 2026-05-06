import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticleBySlug } from '../services/articleService';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    try {
      const data = await fetchArticleBySlug(slug);
      setArticle(data);
      // Update meta tags for SEO
      updateMetaTags(data);
    } catch (err) {
      setError(err.message);
      // Fallback data
      const fallbackArticles = {
        'agriculture-durable-guinee': {
          title: "L'agriculture durable en Guinée : Comment Amidjor innove",
          meta_description: "Découvrez nos techniques innovantes de séchage solaire et de formation agricole pour un avenir plus vert en Guinée.",
          content: `
            <h2>L'innovation au cœur de l'agriculture guinéenne</h2>
            <p>L'agriculture durable est au centre de notre mission chez Amidjor. Nous croyons fermement que l'innovation technologique peut transformer les pratiques agricoles traditionnelles tout en respectant l'environnement.</p>
            
            <h2>Le séchage solaire : une révolution verte</h2>
            <p>Notre méthode de séchage solaire permet de conserver les nutriments des fruits et légumes tout en réduisant considérablement le gaspillage alimentaire. Cette technique ancestrale, modernisée par nos équipes, permet d'obtenir des produits de qualité supérieure.</p>
            
            <h2>Formation et transfert de compétences</h2>
            <p>Nous formons les jeunes agriculteurs aux techniques modernes de production durable. Notre objectif : créer une nouvelle génération d'agriculteurs responsables et innovants.</p>
            
            <h2>Un impact positif sur la communauté</h2>
            <p>En privilégiant les produits locaux et les circuits courts, Amidjor contribue au développement économique des communautés rurales de Guinée.</p>
          `,
          image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=500&fit=crop",
          published_at: "2025-05-15"
        },
        'bienfaits-moringa': {
          title: "Les bienfaits du Moringa : Le super-aliment guinéen",
          meta_description: "Le Moringa, surnommé l'arbre de vie, regorge de nutriments essentiels pour votre santé quotidienne. Découvrez ses bienfaits.",
          content: `
            <h2>Qu'est-ce que le Moringa ?</h2>
            <p>Le Moringa oleifera, souvent appelé l'arbre de vie, est un arbre originaire d'Inde qui pousse parfaitement en Guinée. Toutes les parties de cet arbre sont comestibles et possèdent des propriétés médicinales exceptionnelles.</p>
            
            <h2>Un concentré de nutriments</h2>
            <p>Les feuilles de Moringa contiennent :</p>
            <ul>
              <li>7 fois plus de vitamine C que les oranges</li>
              <li>4 fois plus de calcium que le lait</li>
              <li>3 fois plus de potassium que les bananes</li>
              <li>2 fois plus de protéines que le yaourt</li>
            </ul>
            
            <h2>Bienfaits pour la santé</h2>
            <p>Régulièrement consommé, le Moringa aide à : renforcer le système immunitaire, réduire la fatigue, améliorer la digestion, et maintenir une peau saine.</p>
            
            <h2>Comment consommer notre Moringa ?</h2>
            <p>Notre poudre de Moringa bio peut être ajoutée à vos smoothies, jus, soupes, ou simplement diluée dans de l'eau. Une cuillère à café par jour suffit pour profiter de ses bienfaits.</p>
          `,
          image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=500&fit=crop",
          published_at: "2025-05-10"
        },
        'transformation-tomate-guinee': {
          title: "Transformation locale : De la tomate fraîche au concentré",
          meta_description: "Comment nous transformons les tomates locales en concentré de qualité sans conservateurs artificiels.",
          content: `
            <h2>La tomate guinéenne : un trésor local</h2>
            <p>La Guinée produit d'excellentes tomates grâce à son climat favorable. Cependant, la transformation locale permet d'éviter le gaspillage et de créer de la valeur ajoutée.</p>
            
            <h2>Notre processus de transformation</h2>
            <p>Chez Amidjor, nous sélectionnons les meilleures tomates locales et les transformons en concentré 100% naturel :</p>
            <ol>
              <li>Sélection rigoureuse des tomates mûres</li>
              <li>Lavage et tri minutieux</li>
              <li>Ébullition traditionnelle à basse température</li>
              <li>Réduction lente pour concentrer les saveurs</li>
              <li>Mise en pot sans conservateurs chimiques</li>
            </ol>
            
            <h2>Pourquoi choisir notre concentré ?</h2>
            <p>Notre concentré de tomate est : 100% naturel, sans conservateurs artificiels, riche en vitamines, et produit localement avec des tomates de saison.</p>
            
            <h2>Recettes avec notre concentré</h2>
            <p>Utilisez notre concentré pour vos sauces, soupes, ragoûts, ou même comme base pour des jus de légumes. Une cuillère à soupe remplace 3 tomates fraîches !</p>
          `,
          image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=500&fit=crop",
          published_at: "2025-05-05"
        }
      };
      setArticle(fallbackArticles[slug] || fallbackArticles['agriculture-durable-guinee']);
    } finally {
      setLoading(false);
    }
  };

  const updateMetaTags = (data) => {
    // Update document title
    document.title = `${data.title} | Amidjor Blog`;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = data.meta_description || data.excerpt || '';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const sendWhatsApp = () => {
    const message = "Bonjour Amidjor, je suis intéressé par vos produits après avoir lu votre article.";
    window.open(`https://wa.me/224627797843?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="landing-page">
        <LandingNavbar />
        <div style={{ paddingTop: '100px', textAlign: 'center', padding: '3rem' }}>
          <p>Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (error && !article) {
    return (
      <div className="landing-page">
        <LandingNavbar />
        <div style={{ paddingTop: '100px', textAlign: 'center', padding: '3rem' }}>
          <h1>Article non trouvé</h1>
          <p>L'article que vous recherchez n'existe pas ou a été supprimé.</p>
          <Link to="/articles" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Voir tous les articles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="landing-page">
      <LandingNavbar />
      
      <article className="section article-detail" style={{ paddingTop: '100px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {/* Breadcrumb */}
          <nav style={{ marginBottom: '2rem', fontSize: '0.9rem' }}>
            <Link to="/" style={{ color: 'var(--amidjor-primary)' }}>Accueil</Link>
            <span style={{ margin: '0 0.5rem', color: '#999' }}>/</span>
            <Link to="/articles" style={{ color: 'var(--amidjor-primary)' }}>Articles</Link>
            <span style={{ margin: '0 0.5rem', color: '#999' }}>/</span>
            <span style={{ color: '#666' }}>{article.title}</span>
          </nav>

          {/* Article Header */}
          <header style={{ marginBottom: '2rem' }}>
            <span style={{ 
              color: 'var(--amidjor-olive)', 
              fontSize: '0.9rem',
              fontWeight: 500 
            }}>
              {formatDate(article.published_at || article.created_at)}
            </span>
            <h1 style={{ 
              fontSize: '2.5rem', 
              color: 'var(--amidjor-primary)',
              marginTop: '0.5rem',
              lineHeight: 1.2
            }}>
              {article.title}
            </h1>
          </header>

          {/* Featured Image */}
          <div style={{ 
            marginBottom: '2rem',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            <img 
              src={article.image || 'https://via.placeholder.com/800x500?text=Amidjor'} 
              alt={article.title}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x500?text=Amidjor';
              }}
            />
          </div>

          {/* Article Content */}
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ 
              __html: article.content || `<p>${article.excerpt}</p>` 
            }}
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: '#333'
            }}
          />

          {/* Author/Share */}
          <div style={{ 
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: 'var(--amidjor-primary)' }}>
                Équipe Amidjor
              </p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                Experts en agro-business
              </p>
            </div>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Lien copié !');
                }
              }}
              style={{
                background: 'var(--amidjor-cream)',
                border: '1px solid var(--amidjor-primary)',
                color: 'var(--amidjor-primary)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Partager ↗
            </button>
          </div>

          {/* WhatsApp CTA */}
          <div style={{ 
            marginTop: '4rem',
            padding: '2rem',
            background: 'linear-gradient(135deg, var(--amidjor-cream) 0%, #e8f0e3 100%)',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <h3 style={{ color: 'var(--amidjor-primary)', marginBottom: '1rem' }}>
              💬 Intéressé par nos produits ?
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#666', fontSize: '1.1rem' }}>
              Commandez directement via WhatsApp et recevez vos produits frais à domicile
            </p>
            <button 
              onClick={sendWhatsApp}
              className="btn-whatsapp"
              style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
            >
              📱 Je suis intéressé par vos produits
            </button>
          </div>

          {/* Back to articles */}
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <Link to="/articles" className="btn-secondary">
              ← Voir tous les articles
            </Link>
          </div>
        </div>
      </article>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
