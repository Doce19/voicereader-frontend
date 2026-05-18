import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const theme = useTheme() || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstall(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setShowInstall(false);
    }
  };

  const navStyle = {
    background: theme.nav || '#161b27',
    borderBottom: `1px solid ${theme.border || '#2a3148'}`,
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  };

  return (
    <>
      <nav style={navStyle}>
        <Link to="/" style={{ color: theme.accent || '#378ADD', fontSize: '20px', fontWeight: 'bold', textDecoration: 'none' }}>
          VoiceReader
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }} className="desktop-nav">
          <Link to="/" style={{ color: theme.textMuted || '#8892a4', textDecoration: 'none', fontSize: '14px' }}>Accueil</Link>
          {token && <Link to="/bibliotheque" style={{ color: theme.textMuted || '#8892a4', textDecoration: 'none', fontSize: '14px' }}>Bibliothèque</Link>}
          {token && <Link to="/parametres" style={{ color: theme.textMuted || '#8892a4', textDecoration: 'none', fontSize: '14px' }}>Paramètres</Link>}
          <Link to="/abonnement" style={{ color: theme.textMuted || '#8892a4', textDecoration: 'none', fontSize: '14px' }}>Abonnement</Link>

          {showInstall && (
            <button
              onClick={handleInstall}
              style={{
                background: '#0C447C',
                color: '#85B7EB',
                border: '1px solid #185FA5',
                padding: '6px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              📲 Installer
            </button>
          )}

          <button onClick={theme.toggleTheme} style={{ background: 'transparent', border: `1px solid ${theme.border || '#2a3148'}`, color: theme.text || '#e8eaf0', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
            {theme.isDark ? '☀️' : '🌙'}
          </button>

          {token && (
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid #378ADD', cursor: 'pointer' }} onClick={() => navigate('/parametres')}>
              {localStorage.getItem('avatar')
                ? <img src={localStorage.getItem('avatar')} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#fff', fontSize: '14px' }}>👤</span>}
            </div>
          )}

          {token
            ? <button style={{ background: '#185FA5', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }} onClick={() => { localStorage.removeItem('token'); navigate('/connexion'); }}>Déconnexion</button>
            : <button style={{ background: '#185FA5', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }} onClick={() => navigate('/connexion')}>Connexion</button>
          }
        </div>

        {/* Burger menu mobile */}
        <button
          className="burger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'transparent', border: 'none', color: theme.text || '#e8eaf0', fontSize: '24px', cursor: 'pointer' }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ background: theme.nav || '#161b27', borderBottom: `1px solid ${theme.border || '#2a3148'}`, padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 99 }} className="mobile-menu">
          <Link to="/" style={{ color: theme.text || '#e8eaf0', textDecoration: 'none', fontSize: '15px' }} onClick={() => setMenuOpen(false)}>Accueil</Link>
          {token && <Link to="/bibliotheque" style={{ color: theme.text || '#e8eaf0', textDecoration: 'none', fontSize: '15px' }} onClick={() => setMenuOpen(false)}>Bibliothèque</Link>}
          {token && <Link to="/parametres" style={{ color: theme.text || '#e8eaf0', textDecoration: 'none', fontSize: '15px' }} onClick={() => setMenuOpen(false)}>Paramètres</Link>}
          <Link to="/abonnement" style={{ color: theme.text || '#e8eaf0', textDecoration: 'none', fontSize: '15px' }} onClick={() => setMenuOpen(false)}>Abonnement</Link>

          {showInstall && (
            <button
              onClick={handleInstall}
              style={{
                background: '#0C447C',
                color: '#85B7EB',
                border: '1px solid #185FA5',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              📲 Installer l'application
            </button>
          )}

          <button onClick={theme.toggleTheme} style={{ background: 'transparent', border: `1px solid ${theme.border || '#2a3148'}`, color: theme.text || '#e8eaf0', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', textAlign: 'left' }}>
            {theme.isDark ? '☀️ Mode clair' : '🌙 Mode sombre'}
          </button>

          {token
            ? <button style={{ background: '#185FA5', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }} onClick={() => { localStorage.removeItem('token'); navigate('/connexion'); setMenuOpen(false); }}>Déconnexion</button>
            : <button style={{ background: '#185FA5', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }} onClick={() => { navigate('/connexion'); setMenuOpen(false); }}>Connexion</button>
          }
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .burger-btn { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </>
  );
}

export default Navbar;