import { useEffect, useState, useContext } from 'react';
import { fetchProducts } from '../services/productService';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Impossible de charger les produits.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <section style={{ textAlign: 'center', padding: '3rem' }}>
        <h1 style={{ color: 'var(--amidjor-primary)' }}>Nos Produits</h1>
        <p>Chargement des produits...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ textAlign: 'center', padding: '3rem' }}>
        <h1 style={{ color: 'var(--amidjor-primary)' }}>Nos Produits</h1>
        <p className="field-error">{error}</p>
      </section>
    );
  }

  return (
    <section>
      <h1 style={{ color: 'var(--amidjor-primary)', marginBottom: '0.5rem' }}>
        Nos Produits
      </h1>
      <p style={{ color: 'var(--amidjor-olive)', fontStyle: 'italic', marginBottom: '2rem' }}>
        Des produits naturels et bio pour une vie saine
      </p>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </section>
  );
}
