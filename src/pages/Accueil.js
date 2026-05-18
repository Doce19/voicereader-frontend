import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

const styles = {
  page: { background: '#0f1117', minHeight: '100vh', color: '#e8eaf0', fontFamily: 'sans-serif' },
  hero: { padding: '80px 32px', textAlign: 'center', borderBottom: '1px solid #1e2535' },
  badge: { background: '#0C447C', color: '#85B7EB', fontSize: '12px', padding: '4px 14px', borderRadius: '20px', display: 'inline-block', marginBottom: '20px' },
  h1: { fontSize: '42px', fontWeight: 'bold', margin: '0 0 16px', lineHeight: 1.3 },
  span: { color: '#378ADD' },
  sub: { color: '#8892a4', fontSize: '16px', maxWidth: '500px', margin: '0 auto 36px', lineHeight: 1.6 },
  btns: { display: 'flex', gap: '14px', justifyContent: 'center' },
  btnPrimary: { background: '#185FA5', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
  btnSecondary: { background: 'transparent', color: '#85B7EB', border: '1px solid #2a4a72', padding: '12px 28px', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
  features: { padding: '60px 32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '900px', margin: '0 auto' },
  card: { background: '#161b27', border: '1px solid #2a3148', borderRadius: '12px', padding: '28px 20px', textAlign: 'center' },
  icon: { fontSize: '32px', marginBottom: '14px' },
  cardTitle: { color: '#c5cad6', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' },
  cardDesc: { color: '#5a6478', fontSize: '13px', lineHeight: 1.5 },
  cta: { background: '#161b27', borderTop: '1px solid #1e2535', padding: '60px 32px', textAlign: 'center' },
  ctaTitle: { fontSize: '24px', marginBottom: '20px' },
};

function Accueil() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.page, background: theme.bg, color: theme.text }}>
      <Navbar />

      <section style={styles.hero}>
        <div style={styles.badge}>Synthèse vocale intelligente</div>
        <h1 style={styles.h1}>
          Transformez vos PDF en<br />
          <span style={styles.span}>expérience audio</span>
        </h1>
        <p style={styles.sub}>
          Uploadez n'importe quel document PDF et écoutez-le avec une voix naturelle.
          Parfait pour les malvoyants, les étudiants et les professionnels.
        </p>
        <div style={styles.btns}>
          <button style={styles.btnPrimary} onClick={() => navigate('/connexion')}>
            Commencer gratuitement
          </button>
          <button style={styles.btnSecondary} onClick={() => navigate('/abonnement')}>
            Voir les tarifs
          </button>
        </div>
      </section>

      <section style={{ ...styles.features, gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)', padding: window.innerWidth < 768 ? '40px 16px' : '60px 32px' }}>
        <div style={{ ...styles.card, background: theme.card, border: `1px solid ${theme.border}` }}>
          <div style={styles.icon}>📄</div>
          <div style={styles.cardTitle}>Upload PDF</div>
          <div style={styles.cardDesc}>Importez vos documents et accédez-y depuis n'importe quel appareil.</div>
        </div>
        <div style={{ ...styles.card, background: theme.card, border: `1px solid ${theme.border}` }}>
          <div style={styles.icon}>🎙️</div>
          <div style={styles.cardTitle}>Voix naturelle</div>
          <div style={styles.cardDesc}>Synthèse vocale haute qualité en français et en anglais.</div>
        </div>
        <div style={{ ...styles.card, background: theme.card, border: `1px solid ${theme.border}` }}>
          <div style={styles.icon}>🔖</div>
          <div style={styles.cardTitle}>Signets</div>
          <div style={styles.cardDesc}>Reprenez la lecture exactement là où vous vous étiez arrêté.</div>
        </div>
      </section>

      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Prêt à commencer ?</h2>
        <button style={styles.btnPrimary} onClick={() => navigate('/connexion')}>
          Créer un compte
        </button>
      </section>
    </div>
  );
}

export default Accueil;