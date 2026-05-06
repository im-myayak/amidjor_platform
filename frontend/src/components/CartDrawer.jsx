import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, totalPrice, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);

  const handleValidateOrder = () => {
    clearCart();
    onClose();
  };

  const createWhatsAppLink = () => {
    const phone = "224627797843";
    let message = "Bonjour Amidjor, je souhaite commander :\n\n";

    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - Qté: ${item.quantity}\n`;
    });

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}>
      <div className="cart-drawer__backdrop" onClick={onClose} />
      <div className="cart-drawer__panel">
        <div className="cart-drawer__header">
          <h2 style={{ color: 'var(--amidjor-primary)', margin: 0 }}>Votre Panier</h2>
          <button 
            type="button" 
            className="cart-drawer__close" 
            onClick={onClose}
            style={{ color: 'var(--amidjor-primary)' }}
          >
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="cart-drawer__empty">Votre panier est vide.</p>
        ) : (
          <>
            <ul className="cart-drawer__items">
              {cart.map((item) => (
                <li key={item.id} className="cart-drawer__item" style={{ borderColor: 'var(--amidjor-primary)' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--amidjor-primary)' }}>{item.name}</h3>
                    <p style={{ margin: 0, color: '#666' }}>{item.price?.toLocaleString()} GNF</p>
                  </div>
                  <div className="cart-drawer__controls">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                      style={{ borderColor: 'var(--amidjor-primary)' }}
                    />
                    <button 
                      type="button" 
                      className="button button--ghost" 
                      onClick={() => removeFromCart(item.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div 
              className="cart-drawer__summary" 
              style={{ borderTopColor: 'var(--amidjor-olive)', color: 'var(--amidjor-primary)' }}
            >
              <span>Total</span>
              <strong>{totalPrice?.toLocaleString()} GNF</strong>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button 
                type="button" 
                className="button button--secondary" 
                onClick={clearCart}
                style={{ flex: 1 }}
              >
                Vider
              </button>
              <a 
                href={createWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="button" 
                onClick={handleValidateOrder}
                style={{ flex: 1, textAlign: 'center', textDecoration: 'none', background: 'var(--amidjor-primary)', color: 'white' }}
              >
                📱 Valider la commande
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
