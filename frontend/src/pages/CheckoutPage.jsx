import { useContext, useMemo, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import { createWhatsAppLink, formatWhatsAppOrderMessage } from '../utils/whatsapp';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  const whatsappMessage = useMemo(() => {
    return formatWhatsAppOrderMessage({
      firstName,
      lastName,
      phone,
      cart,
      totalPrice,
      note,
      orderId: createdOrderId,
    });
  }, [firstName, lastName, phone, cart, totalPrice, note, createdOrderId]);

  const whatsappLink = useMemo(() => {
    if (cart.length === 0) return '';
    return createWhatsAppLink({ message: whatsappMessage });
  }, [cart.length, whatsappMessage]);

  const validate = () => {
    const validation = {};

    if (!firstName.trim()) validation.firstName = 'Le prénom est requis.';
    if (!lastName.trim()) validation.lastName = 'Le nom est requis.';
    if (!phone.trim()) validation.phone = 'Le numéro de téléphone est requis.';
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email)) {
      validation.email = 'Veuillez entrer une adresse email valide.';
    }

    if (cart.length === 0) {
      validation.cart = 'Votre panier est vide. Ajoutez des produits avant de commander.';
    }

    return validation;
  };

  const canShareOnWhatsApp = cart.length > 0 && firstName.trim() && lastName.trim() && phone.trim() && createdOrderId;

  const handleWhatsAppOrder = () => {
    if (!canShareOnWhatsApp || !whatsappLink) return;
    // WhatsApp is only a communication channel - does NOT change backend state
    window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError(null);
    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    const payload = {
      customer_name: `${firstName.trim()} ${lastName.trim()}`,
      customer_phone: phone.trim(),
      customer_email: email.trim() || null,
      // total_price is calculated on backend only - do not send
      items: cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        // price and subtotal are set by backend - only send product and quantity
      })),
    };

    setSubmitting(true);

    try {
      const order = await createOrder(payload);
      setCreatedOrderId(order.id);  // Capture order_id for WhatsApp tracking
      clearCart();
      setOrderSuccess(true);
    } catch (error) {
      setServerError(error.message || 'Impossible de soumettre votre commande pour le moment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess && createdOrderId) {
    return (
      <section className="checkout-page" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <h1 style={{ color: 'var(--amidjor-primary)' }}>✓ Commande reçue</h1>
        <p style={{ fontSize: '1.1rem' }}>
          Merci ! Votre commande <strong>#{createdOrderId}</strong> a été reçue.
        </p>
        <p style={{ color: 'var(--amidjor-olive)', fontStyle: 'italic' }}>
          Nous vous contacterons bientôt pour confirmer votre commande.
        </p>
        {whatsappLink && (
          <div style={{ marginTop: '2rem' }}>
            <p>Ou contactez-nous directement sur WhatsApp :</p>
            <button
              type="button"
              className="button"
              onClick={handleWhatsAppOrder}
            >
              📱 Nous contacter sur WhatsApp
            </button>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <h1 style={{ color: 'var(--amidjor-primary)' }}>Finaliser la commande</h1>
      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="firstName">Prénom</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={errors.firstName ? 'input-error' : ''}
            />
            {errors.firstName && <span className="field-error">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Nom</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={errors.lastName ? 'input-error' : ''}
            />
            {errors.lastName && <span className="field-error">{errors.lastName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email (optionnel)</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="note">Note (optionnelle)</label>
            <textarea
              id="note"
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {errors.cart && <p className="field-error">{errors.cart}</p>}
          {serverError && <p className="field-error">{serverError}</p>}

          <button type="submit" className="button" disabled={submitting || cart.length === 0}>
            {submitting ? 'Envoi en cours...' : '✓ Confirmer la commande'}
          </button>
          <button
            type="button"
            className="button button--secondary"
            onClick={handleWhatsAppOrder}
            disabled={!canShareOnWhatsApp}
          >
            📱 Commander via WhatsApp
          </button>
        </form>

        <aside className="checkout-summary" style={{ borderColor: 'var(--amidjor-primary)' }}>
          <h2 style={{ color: 'var(--amidjor-primary)' }}>Récapitulatif</h2>
          {cart.length === 0 ? (
            <p>Votre panier est vide.</p>
          ) : (
            <div>
              <ul className="order-items">
                {cart.map((item) => (
                  <li key={item.id} className="order-item">
                    <span>{item.name}</span>
                    <span>{item.quantity} × {item.price.toLocaleString()} GNF</span>
                  </li>
                ))}
              </ul>
              <div className="summary-total" style={{ 
                borderTop: '2px solid var(--amidjor-olive)', 
                marginTop: '1rem', 
                paddingTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'var(--amidjor-primary)'
              }}>
                <span>Total</span>
                <span>{totalPrice.toLocaleString()} GNF</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
