import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { fetchArticles } from '../services/articleService';
import { CartContext } from '../context/CartContext';

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // Simuler le chargement des produits
    setProducts([
      { id: 1, name: "Fonio Precuit", price: 25000, unit: "sachet 500g", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop" },
      { id: 2, name: "Miel Naturel", price: 60000, unit: "bouteille 1L", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop" },
      { id: 3, name: "Poudre de Soumbara", price: 20000, unit: "sachet 500g", image: "https://images.unsplash.com/photo-1574852859542-4bae1293e3bf?w=300&h=200&fit=crop" },
      { id: 4, name: "Sirop de Gingembre", price: 60000, unit: "Bouteille 1L", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=200&fit=crop" },
      { id: 5, name: "Degue de Fonio", price: 25000, unit: "Boite 500g", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop" },
      { id: 6, name: "Farine de Fonio", price: 20000, unit: "sachet 500g", image: "https://images.unsplash.com/photo-1599490659500-d248e625e439?w=300&h=200&fit=crop" }
    ]);
    
    // Fetch articles from API
    loadArticles();
  }, []);
  
  const loadArticles = async () => {
    try {
      const data = await fetchArticles(3);
      setArticles(data.results || []);
    } catch (err) {
      console.error('Failed to load articles:', err);
      // Fallback data
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
      setLoadingArticles(false);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
      <LandingNavbar onNavigate={scrollToSection} onOpenCart={() => setIsCartOpen(true)} />
      
      {/* HERO Section - Full Background */}
      <section id="home" className="hero-section hero-full-bg">
        <div className="hero-overlay"></div>
        <div className="hero-content-centered">
          <h1 className="hero-title-light">
            Des produits <span className="highlight-light">naturels</span> & <span className="highlight-light">bio</span><br />
            de Guinée
          </h1>
          <p className="hero-tagline">
            Amidjor Agro-Business
          </p>
          <p className="hero-subtitle-light">
            Transforme les meilleurs produits locaux en aliments sains.<br />
            <em>vivre bien Manger sain</em>.
          </p>
          <div className="hero-cta">
            <button onClick={() => scrollToSection('about')} className="btn-primary-light">
              Découvrir Amidjor
            </button>
            <button onClick={() => scrollToSection('products')} className="btn-outline-light">
              Nos produits
            </button>
          </div>
          <div className="scroll-down" onClick={() => scrollToSection('products')}>
            <span>↓</span>
          </div>
        </div>
      </section>

      {/* PRODUCTS Section */}
      <section id="products" className="section products-section">
        <div className="container">
          <h2 className="section-title">Nos Produits</h2>
          <p className="section-subtitle">Des produits 100% naturels, transformés avec soin</p>
          
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card-landing">
                <div className="product-image">
                  <img src={product.image} alt={product.name} loading="lazy" />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-price">
                    {product.price.toLocaleString()} GNF <span>/{product.unit}</span>
                  </p>
                  <div className="product-buttons">
                    <button 
                      onClick={() => addToCart(product)}
                      className="btn-add-cart"
                    >
                      🛒 Ajouter
                    </button>
                    <button 
                      onClick={() => {
                        addToCart(product);
                        setIsCartOpen(true);
                      }}
                      className="btn-commander-small"
                    >
                      Commander
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES Section */}
      <section id="services" className="section services-section">
        <div className="container">
          <h2 className="section-title">Nos Services</h2>
          <p className="section-subtitle">Des solutions complètes pour l'agro-business</p>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🎓</div>
              <h3>Formation</h3>
              <p>Formations agricoles pratiques : séchage solaire, transformation des produits locaux, techniques de production durable.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">☀️</div>
              <h3>Séchage Solaire</h3>
              <p>Service professionnel de séchage solaire pour fruits, légumes et herbes aromatiques. Conservation 100% naturelle.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🍽️</div>
              <h3>Restauration</h3>
              <p>Plats préparés avec nos produits bio. Cuisine saine et locale pour particuliers et entreprises.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT Section */}
      <section id="about" className="section about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <h2 className="section-title">À Propos d'Amidjor</h2>
              <p className="about-text">
                <strong>Amidjor Agro-Business</strong> est une entreprise guinéenne spécialisée dans la transformation 
                des produits agricoles locaux. Basée à Sonfonia Soloprimo, nous valorisons les richesses de notre terroir.
              </p>
              <div className="about-stats">
                <div className="stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Clients satisfaits</span>
                </div>
                <div className="stat">
                  <span className="stat-number">20+</span>
                  <span className="stat-label">Produits transformés</span>
                </div>
                <div className="stat">
                  <span className="stat-number">3</span>
                  <span className="stat-label">Années d'expérience</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500&h=350&fit=crop" 
                alt="Équipe Amidjor au travail" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* BLOG Section */}
      <section id="blog" className="section blog-section">
        <div className="container">
          <h2 className="section-title">Nos Activités & Conseils</h2>
          <p className="section-subtitle">Actus, astuces et tendances agro-business en Guinée</p>
          
          {loadingArticles ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Chargement des articles...</p>
          ) : (
            <>
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
                        Lire plus →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link to="/articles" className="btn-secondary">
                  Voir tous les articles
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CONTACT Section */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <h2 className="section-title">Contactez-nous</h2>
          <p className="section-subtitle">Une question ? Une commande ? Parlons-en !</p>
          
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <div>
                  <h4>WhatsApp</h4>
                  <a href="https://wa.me/224627797843" target="_blank" rel="noopener noreferrer">
                    +224 627 79 78 43
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <h4>Téléphone</h4>
                  <a href="tel:+224627797843">+224 627 79 78 43</a>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h4>Adresse</h4>
                  <p>Siège Sonfonia Soloprimo<br/>Conakry, Guinée</p>
                </div>
              </div>
            </div>
            
            <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Message envoyé !'); }}>
              <input type="text" placeholder="Votre nom" required />
              <input type="email" placeholder="Votre email" required />
              <textarea placeholder="Votre message" rows="4" required></textarea>
              <button type="submit" className="btn-submit">Envoyer le message</button>
            </form>
          </div>
        </div>
      </section>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Footer />
    </div>
  );
}
