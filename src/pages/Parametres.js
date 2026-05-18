import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

function Parametres() {
  const theme = useTheme();
  const [speed, setSpeed] = useState('1.0x');
  const [voice, setVoice] = useState('Feminine');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifNews, setNotifNews] = useState(true);
  const [notifReminder, setNotifReminder] = useState(false);
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || null);
  const fileInputRef = useRef(null);

  const s = {
    page: { background: theme.bg, minHeight: '100vh', color: theme.text, fontFamily: 'sans-serif' },
    container: { maxWidth: '700px', margin: '0 auto', padding: '40px 32px' },
    title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '28px' },
    card: { background: theme.card, border: `1px solid ${theme.border}`, borderRadius: '12px', padding: '24px', marginBottom: '20px' },
    cardTitle: { fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: theme.text },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${theme.border}` },
    label: { color: theme.textMuted, fontSize: '14px' },
    input: { background: theme.input, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '8px 12px', color: theme.text, fontSize: '14px', width: '200px' },
    select: { background: theme.input, border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '8px 12px', color: theme.text, fontSize: '14px' },
    btn: { background: theme.btnPrimary, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', marginTop: '16px' },
    btnDanger: { background: 'transparent', color: '#f87171', border: '1px solid #5a2020', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', marginTop: '8px' },
    avatarContainer: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' },
    avatar: { width: '80px', height: '80px', borderRadius: '50%', background: theme.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', cursor: 'pointer', overflow: 'hidden', border: `2px solid ${theme.accent}` },
  };

  const Toggle = ({ value, onChange }) => (
    <button
      style={{ width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: value ? theme.btnPrimary : theme.border }}
      onClick={() => onChange(!value)}
    />
  );

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      localStorage.setItem('avatar', ev.target.result);
      setAvatar(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.container}>
        <h1 style={s.title}>Paramètres</h1>

        <div style={s.card}>
          <div style={s.cardTitle}>Profil Utilisateur</div>
          <div style={s.avatarContainer}>
            <div style={s.avatar} onClick={() => fileInputRef.current.click()}>
              {avatar
                ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : ' '
              }
            </div>
            <div>
              <div style={{ color: theme.textMuted, fontSize: '13px', marginBottom: '8px' }}>
                Cliquez pour changer votre photo de profil
              </div>
              <button style={s.btn} onClick={() => fileInputRef.current.click()}>
                📷 Changer la photo
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>
          <div style={s.row}>
            <span style={s.label}>Nom d'utilisateur</span>
            <input style={s.input} defaultValue="testuser" />
          </div>
          <div style={s.row}>
            <span style={s.label}>Email</span>
            <input style={s.input} defaultValue="test@gmail.com" />
          </div>
          <button style={s.btn}>Modifier le profil</button>
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>Apparence</div>
          <div style={s.row}>
            <span style={s.label}>Mode {theme.isDark ? 'Sombre' : 'Clair'}</span>
            <button
              onClick={theme.toggleTheme}
              style={{
                background: theme.isDark ? theme.btnPrimary : theme.border,
                border: 'none',
                color: '#fff',
                padding: '8px 20px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {theme.isDark ? '🌙 Sombre' : '☀️ Clair'}
            </button>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>Préférences de Lecture</div>
          <div style={s.row}>
            <span style={s.label}>Vitesse par défaut</span>
            <select style={s.select} value={speed} onChange={e => setSpeed(e.target.value)}>
              <option>0.5x</option>
              <option>0.75x</option>
              <option>1.0x</option>
              <option>1.25x</option>
              <option>1.5x</option>
            </select>
          </div>
          <div style={s.row}>
            <span style={s.label}>Voix par défaut</span>
            <select style={s.select} value={voice} onChange={e => setVoice(e.target.value)}>
              <option>Masculine</option>
              <option>Féminine</option>
            </select>
          </div>
          <button style={s.btn}>Sauvegarder</button>
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>Notifications</div>
          <div style={s.row}>
            <span style={s.label}>Notifications par email</span>
            <Toggle value={notifEmail} onChange={setNotifEmail} />
          </div>
          <div style={s.row}>
            <span style={s.label}>Nouveautés et mises à jour</span>
            <Toggle value={notifNews} onChange={setNotifNews} />
          </div>
          <div style={s.row}>
            <span style={s.label}>Rappels de lecture</span>
            <Toggle value={notifReminder} onChange={setNotifReminder} />
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>Compte</div>
          <div style={s.row}>
            <span style={s.label}>Changer le mot de passe</span>
            <button style={s.btn}>Modifier</button>
          </div>
          <div style={{ marginTop: '16px' }}>
            <button style={s.btnDanger}>Supprimer le compte</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Parametres;