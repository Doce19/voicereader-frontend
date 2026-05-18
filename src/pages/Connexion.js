import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { useTheme } from '../context/ThemeContext';

const styles = {
  page: { background: '#0f1117', minHeight: '100vh', color: '#e8eaf0', fontFamily: 'sans-serif' },
  container: { maxWidth: '420px', margin: '60px auto', padding: '0 16px' },
  card: { background: '#161b27', border: '1px solid #2a3148', borderRadius: '12px', padding: '36px' },
  title: { textAlign: 'center', fontSize: '22px', fontWeight: 'bold', marginBottom: '28px' },
  tabs: { display: 'flex', marginBottom: '24px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #2a3148' },
  tab: { flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer', fontSize: '14px', background: 'transparent', border: 'none', color: '#8892a4' },
  tabActive: { flex: 1, padding: '10px', textAlign: 'center', cursor: 'pointer', fontSize: '14px', background: '#185FA5', border: 'none', color: '#fff' },
  label: { color: '#8892a4', fontSize: '13px', marginBottom: '6px', display: 'block' },
  input: { width: '100%', background: '#0f1117', border: '1px solid #2a3148', borderRadius: '8px', padding: '10px 14px', color: '#e8eaf0', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' },
  btn: { width: '100%', background: '#185FA5', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', marginTop: '8px' },
  error: { background: '#2d1515', border: '1px solid #5a2020', color: '#f87171', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  success: { background: '#0d2d1a', border: '1px solid #1a5c35', color: '#4ade80', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
};

function Connexion() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/bibliotheque');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur de connexion');
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await API.post('/auth/register', { email, username, password });
      setSuccess('Compte créé ! Vous pouvez vous connecter.');
      setMode('login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de l\'inscription');
    }
    setLoading(false);
  };

  return (
    <div style={{ ...styles.page, background: theme.bg, color: theme.text }}>
      <Navbar />
      <div style={styles.container}>
        <div style={{ ...styles.card, background: theme.card, border: `1px solid ${theme.border}` }}>
          <h2 style={styles.title}>VoiceReader</h2>

          <div style={styles.tabs}>
            <button
              style={mode === 'login' ? styles.tabActive : styles.tab}
              onClick={() => setMode('login')}
            >
              Connexion
            </button>
            <button
              style={mode === 'register' ? styles.tabActive : styles.tab}
              onClick={() => setMode('register')}
            >
              Inscription
            </button>
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="votremail@gmail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          {mode === 'register' && (
            <>
              <label style={styles.label}>Nom d'utilisateur</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Nom"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </>
          )}

          <label style={styles.label}>Mot de passe</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button
            style={styles.btn}
            onClick={mode === 'login' ? handleLogin : handleRegister}
            disabled={loading}
          >
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Connexion;