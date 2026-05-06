import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct } from '../services/productService';
import { CartContext } from '../context/CartContext';
import Seo from '../components/Seo';
import SocialShare from '../components/SocialShare';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProduct(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Unable to load product details.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return <section><h1>Product Details</h1><p>Loading product...</p></section>;
  }

  if (error) {
    return <section><h1>Product Details</h1><p className="error">{error}</p></section>;
  }

  if (!product) {
    return <section><h1>Product Details</h1><p>Product not found.</p></section>;
  }

  const shareUrl = window.location.href;

  return (
    <section className="product-detail-page">
      <Seo
        title={product.name}
        description={product.description}
        image={product.image}
        url={shareUrl}
        type="product"
      />

      <div className="product-detail-header">
        <div>
          <h1>{product.name}</h1>
          <p className="product-price">${product.price}</p>
          <p>{product.description || 'No description available.'}</p>
          <p><strong>Stock:</strong> {product.stock ?? 'N/A'}</p>
          {product.category_name && <p><strong>Category:</strong> {product.category_name}</p>}
        </div>
        <div className="product-detail-actions">
          <button type="button" className="button" onClick={handleAddToCart}>
            Add to cart
          </button>
          <Link to="/products" className="button secondary">
            Back to products
          </Link>
        </div>
      </div>

      <SocialShare title={product.name} url={shareUrl} />
    </section>
  );
}
