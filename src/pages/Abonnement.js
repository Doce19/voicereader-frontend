import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

const styles = {
  page: { background: '#0f1117', minHeight: '100vh', color: '#e8eaf0', fontFamily: 'sans-serif' },
  container: { maxWidth: '800px', margin: '0 auto', padding: '40px 32px' },
  title: { fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' },
  sub: { color: '#8892a4', textAlign: 'center', marginBottom: '40px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card: { background: '#161b27', border: '1px solid #2a3148', borderRadius: '12px', padding: '28px' },
  cardFeatured: { background: '#161b27', border: '2px solid #185FA5', borderRadius: '12px', padding: '28px' },
  badge: { background: '#0C447C', color: '#85B7EB', fontSize: '11px', padding: '3px 10px', borderRadius: '20px', display: 'inline-block', marginBottom: '12px' },
  planName: { fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' },
  price: { color: '#378ADD', fontSize: '32px', fontWeight: 'bold' },
  period: { color: '#5a6478', fontSize: '13px', marginBottom: '20px' },
  item: { color: '#8892a4', fontSize: '13px', padding: '8px 0', borderBottom: '1px solid #1e2535', display: 'flex', gap: '8px' },
  btn: { width: '100%', background: '#1e2535', color: '#85B7EB', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', marginTop: '20px' },
  btnFeatured: { width: '100%', background: '#185FA5', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', marginTop: '20px' },
};

function Abonnement() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.page, background: theme.bg, color: theme.text }}>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Choisissez votre plan</h1>
        <p style={styles.sub}>Commencez gratuitement, évoluez selon vos besoins</p>

        <div style={styles.grid}>
          <div style={{ ...styles.card, background: theme.card, border: `1px solid ${theme.border}` }}>
            <div style={styles.planName}>Gratuit</div>
            <div style={styles.price}>0€</div>
            <div style={styles.period}>pour toujours</div>
            <div style={styles.item}>✅ 3 documents / mois</div>
            <div style={styles.item}>✅ Voix standard</div>
            <div style={styles.item}>✅ Lecture en ligne</div>
            <div style={styles.item}>❌ Téléchargement MP3</div>
            <div style={styles.item}>❌ Voix HD</div>
            <button style={styles.btn} onClick={() => navigate('/connexion')}>
              Commencer
            </button>
          </div>

          <div style={{ ...styles.cardFeatured, background: theme.card }}>
            <div style={styles.badge}>Recommandé</div>
            <div style={styles.planName}>Premium</div>
            <div style={styles.price}>9,99€</div>
            <div style={styles.period}>par mois</div>
            <div style={styles.item}>✅ Documents illimités</div>
            <div style={styles.item}>✅ Voix HD naturelle</div>
            <div style={styles.item}>✅ Téléchargement MP3</div>
            <div style={styles.item}>✅ Signets illimités</div>
            <div style={styles.item}>✅ Support prioritaire</div>
            <button style={styles.btnFeatured} onClick={() => alert('Stripe bientôt disponible !')}>
              Essai 7 jours gratuit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Abonnement;