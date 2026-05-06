import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar__brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--amidjor-primary)' }}>
          Amidjor
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--amidjor-olive)', fontStyle: 'italic' }}>
          vivre bien Manger sain
        </span>
      </div>
      <nav className="navbar__links">
        <NavLink to="/" end>
          Accueil
        </NavLink>
        <NavLink to="/products">Produits</NavLink>
        <NavLink to="/cart">Panier</NavLink>
        <NavLink to="/orders">Commandes</NavLink>
      </nav>
      <button className="navbar__cart-button" type="button" onClick={() => setDrawerOpen(true)}>
        Voir le panier
      </button>
      <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
