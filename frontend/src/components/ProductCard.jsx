import { Link } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card" style={{ borderColor: 'var(--amidjor-primary)' }}>
      <div className="product-card__content">
        <div>
          <h2 style={{ color: 'var(--amidjor-primary)' }}>{product.name}</h2>
          <p className="product-card__price">
            {product.price?.toLocaleString()} GNF
          </p>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            {product.description || 'Aucune description disponible.'}
          </p>
        </div>
        <div className="product-card__actions">
          <Link to={`/products/${product.id}`} className="button button--secondary">
            Détails
          </Link>
          <button 
            type="button" 
            className="button" 
            onClick={() => onAddToCart(product, 1)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
          </button>
        </div>
      </div>
    </article>
  );
}
