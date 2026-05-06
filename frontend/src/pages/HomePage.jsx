import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        color: 'var(--amidjor-primary)', 
        marginBottom: '1rem',
        fontWeight: 700
      }}>
        Amidjor
      </h1>
      <p style={{ 
        fontSize: '1.3rem', 
        color: 'var(--amidjor-olive)', 
        fontStyle: 'italic',
        marginBottom: '2rem'
      }}>
        vivre bien Manger sain
      </p>
      <p style={{ fontSize: '1.1rem', color: '#555', maxWidth: '600px', margin: '0 auto 2rem' }}>
        Découvrez nos produits naturels et bio pour une vie saine au quotidien.
        Commandez en ligne et payez via WhatsApp.
      </p>
      <Link 
        to="/products" 
        className="button"
        style={{ display: 'inline-block', textDecoration: 'none' }}
      >
        Découvrir nos produits
      </Link>
    </section>
  );
}
