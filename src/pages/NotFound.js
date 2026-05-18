import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

function NotFound() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <div style={{ background: theme.bg, minHeight: '100vh', color: theme.text, fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 70px)', textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>🔍</div>
        <h1 style={{ fontSize: '80px', fontWeight: 'bold', color: '#185FA5', margin: '0 0 8px' }}>404</h1>
        <h2 style={{ fontSize: '24px', marginBottom: '12px', color: theme.text }}>Page introuvable</h2>
        <p style={{ color: theme.textMuted, fontSize: '16px', maxWidth: '400px', marginBottom: '32px', lineHeight: 1.6 }}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: '#185FA5', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' }}
          >
            Retour à l'accueil
          </button>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'transparent', color: theme.textMuted, border: `1px solid ${theme.border}`, padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' }}
          >
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;