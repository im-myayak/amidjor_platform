import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function LandingNavbar({ onNavigate, onOpenCart }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
    if (onNavigate) {
      onNavigate(id);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Accueil' },
    { id: 'products', label: 'Produits' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'À propos' },
    { id: 'blog', label: 'Articles' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => scrollToSection('home')}>
          {/* Logo image - remplacer le texte par une image si logo.png existe */}
          <img 
            src="/assets/logo.jpg" 
            alt="Amidjor" 
            className="brand-logo"
            onError={(e) => {
              // Fallback au texte si pas de logo
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="brand-text" style={{ display: 'none' }}>
            <span className="brand-name">Amidjor</span>
            <span className="brand-slogan">vivre bien Manger sain</span>
          </div>
          {/* Afficher le texte par défaut si pas encore de logo */}
          <div className="brand-text-default">
            <span className="brand-name">Amidjor</span>
            <span className="brand-slogan">vivre bien Manger sain</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="navbar-nav desktop">
          {navLinks.map(link => (
            <button 
              key={link.id} 
              onClick={() => scrollToSection(link.id)}
              className="nav-link"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Cart Button */}
        <div className="navbar-cart desktop">
          <button 
            onClick={onOpenCart}
            className="btn-cart-nav"
            title="Voir le panier"
          >
            🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>

        {/* CTA - Simple Contact */}
        <div className="navbar-cta desktop">
          <button 
            onClick={() => scrollToSection('contact')}
            className="btn-contact-nav"
          >
            Nous contacter
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            {navLinks.map(link => (
              <button 
                key={link.id} 
                onClick={() => scrollToSection(link.id)}
                className="mobile-nav-link"
              >
                {link.label}
              </button>
            ))}
            <button 
              onClick={() => {
                scrollToSection('contact');
                setMobileMenuOpen(false);
              }}
              className="btn-contact-mobile"
            >
              Nous contacter
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
