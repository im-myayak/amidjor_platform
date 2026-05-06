export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, fontSize: '1.1rem' }}>
            Amidjor
          </p>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
            vivre bien Manger sain
          </p>
        </div>
        <div className="footer__links">
          <a href="/">Accueil</a>
          <a href="/products">Produits</a>
          <a href="tel:+224627797843">+224 627 79 78 43</a>
        </div>
      </div>
      <div style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.8, textAlign: 'center' }}>
        © 2026 Amidjor • Siège Sonfonia Soloprimo
      </div>
    </footer>
  );
}
