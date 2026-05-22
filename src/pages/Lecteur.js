import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useToast, ToastContainer } from '../components/Toast';

const styles = {
  page: { background: '#0f1117', minHeight: '100vh', color: '#e8eaf0', fontFamily: 'sans-serif' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', padding: '20px 32px', maxWidth: '1400px', margin: '0 auto' },
  pdfPanel: { background: '#161b27', border: '1px solid #2a3148', borderRadius: '12px', overflow: 'hidden' },
  pdfHeader: { background: '#1e2535', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2a3148' },
  pdfTitle: { color: '#c5cad6', fontSize: '14px', fontWeight: 'bold' },
  pdfPageInfo: { color: '#8892a4', fontSize: '13px' },
  playerPanel: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: '#161b27', border: '1px solid #2a3148', borderRadius: '12px', padding: '20px' },
  cardTitle: { fontSize: '14px', fontWeight: 'bold', color: '#c5cad6', marginBottom: '16px' },
  progressBar: { height: '6px', background: '#1e2535', borderRadius: '3px', marginBottom: '8px', cursor: 'pointer' },
  progressFill: { height: '6px', background: '#378ADD', borderRadius: '3px', transition: 'width 0.1s' },
  timeRow: { display: 'flex', justifyContent: 'space-between', color: '#5a6478', fontSize: '12px', marginBottom: '16px' },
  controls: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' },
  btnCtrl: { background: '#1e2535', border: 'none', color: '#85B7EB', width: '38px', height: '38px', borderRadius: '50%', cursor: 'pointer', fontSize: '15px' },
  btnPlay: { background: '#185FA5', border: 'none', color: '#fff', width: '52px', height: '52px', borderRadius: '50%', cursor: 'pointer', fontSize: '22px' },
  speedRow: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' },
  speedLabel: { color: '#8892a4', fontSize: '12px', marginRight: '4px' },
  speedBtn: { background: '#1e2535', border: '1px solid #2a3148', color: '#8892a4', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  speedBtnActive: { background: '#185FA5', border: '1px solid #185FA5', color: '#fff', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  btnAction: { width: '100%', background: '#1e2535', border: '1px solid #2a3148', color: '#c5cad6', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', marginBottom: '8px' },
  btnGenerate: { width: '100%', background: '#185FA5', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', marginBottom: '8px' },
  generating: { textAlign: 'center', color: '#378ADD', fontSize: '13px', padding: '10px' },
};

function Lecteur() {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [document, setDocument] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [currentPage] = useState(1);
  const [lang, setLang] = useState('fr');
  const [genre, setGenre] = useState('feminin');
  const { toasts, showToast } = useToast();

  // eslint-disable-next-line
  useEffect(() => { fetchDocument(); }, [id]);

  const fetchDocument = async () => {
    try {
      const res = await API.get('/documents/');
      const doc = res.data.find(d => d.id === parseInt(id));
      setDocument(doc);
      if (doc) {
        const token = localStorage.getItem('token');
        const pdfResponse = await fetch(
          `https://Agnuod19-voicereader-backend.hf.space/documents/${id}/file`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const blob = await pdfResponse.blob();
        setPdfUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const generateAudio = async () => {
    setGenerating(true);
    setAudioUrl(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://Agnuod19-voicereader-backend.hf.space/documents/${id}/audio?lang=${lang}&genre=${genre}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const blob = await response.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
    }
    setGenerating(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleProgressClick = (e) => {
    const ratio = e.nativeEvent.offsetX / e.currentTarget.offsetWidth;
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const changeSpeed = (s) => {
    setSpeed(s);
    if (audioRef.current) audioRef.current.playbackRate = s;
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = window.document.createElement('a');
    a.href = audioUrl;
    a.download = `${document?.title || 'audio'}.mp3`;
    a.click();
  };

  const handleBookmark = async () => {
  try {
    const estimatedPage = duration > 0
      ? Math.max(1, Math.ceil((currentTime / duration) * (document?.total_pages || 1)))
      : 1;

    await API.post(`/bookmarks/${id}`, {
      page: estimatedPage,
      note: `Page ${estimatedPage} - ${formatTime(currentTime)}`
    });
    showToast(`Signet ajouté à la page ${estimatedPage} !`, 'success');
  } catch (err) {
    console.error(err);
    showToast('Erreur lors de l\'ajout du signet', 'error');
  }
};

  if (loading) return (
    <div style={{ ...styles.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#5a6478' }}>Chargement du document...</p>
    </div>
  );

  return (
    <div style={{ ...styles.page, background: theme.bg, color: theme.text }}>
      <Navbar />
      <div style={{
  display: 'grid',
  gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 380px',
  gap: '16px',
  padding: window.innerWidth < 768 ? '12px' : '20px 32px',
  maxWidth: '1400px',
  margin: '0 auto'
}}>

        {/* PANNEAU GAUCHE — PDF VIEWER */}
        <div style={{ ...styles.pdfPanel, background: theme.card, border: `1px solid ${theme.border}` }}>
          <div style={styles.pdfHeader}>
            <span style={styles.pdfTitle}>📄 {document?.title}</span>
            <span style={styles.pdfPageInfo}>{document?.total_pages} page(s)</span>
          </div>
          <div style={{ padding: 0 }}>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                width="100%"
                height="100%"
                style={{ minHeight: 'calc(100vh - 180px)', border: 'none', borderRadius: '0 0 12px 12px' }}
                title="PDF Viewer"
              />
            ) : (
              <p style={{ color: '#5a6478', padding: '40px' }}>Chargement du PDF...</p>
            )}
          </div>
        </div>

        {/* PANNEAU DROITE — LECTEUR AUDIO */}
        <div style={styles.playerPanel}>
          <div style={{ ...styles.card, background: theme.card, border: `1px solid ${theme.border}` }}>
            <div style={styles.cardTitle}>🎙️ Lecteur Audio</div>

            {!audioUrl && !generating && (
  <>
    <div style={{ marginBottom: '16px' }}>
      <div style={{ color: '#8892a4', fontSize: '13px', marginBottom: '8px' }}>
        Langue
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['fr', 'en'].map(l => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              flex: 1,
              background: lang === l ? '#185FA5' : '#1e2535',
              border: lang === l ? '1px solid #185FA5' : '1px solid #2a3148',
              color: lang === l ? '#fff' : '#8892a4',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            {l === 'fr' ? '🇫🇷 Français' : '🇬🇧 Anglais'}
          </button>
        ))}
      </div>

      <div style={{ color: '#8892a4', fontSize: '13px', marginBottom: '8px' }}>
        Voix
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {['masculin', 'feminin'].map(g => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            style={{
              flex: 1,
              background: genre === g ? '#185FA5' : '#1e2535',
              border: genre === g ? '1px solid #185FA5' : '1px solid #2a3148',
              color: genre === g ? '#fff' : '#8892a4',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            {g === 'masculin' ? '  Masculin' : '  Féminin'}
          </button>
        ))}
      </div>
      <ToastContainer toasts={toasts} />
    </div>

    <button style={styles.btnGenerate} onClick={generateAudio}>
      🎙️ Générer l'audio
    </button>
  </>
)}

            {generating && (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid #1e2535',
      borderTop: '3px solid #378ADD',
      borderRadius: '50%',
      margin: '0 auto 12px',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    <div style={{ color: '#378ADD', fontSize: '13px' }}>
      Génération en cours...
    </div>
    <div style={{ color: '#5a6478', fontSize: '12px', marginTop: '6px' }}>
      Cela peut prendre quelques secondes selon la densité du document
    </div>
  </div>
)}

            {audioUrl && (
              <>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={() => setDuration(audioRef.current.duration)}
                  onEnded={() => setIsPlaying(false)}
                />
                <div style={styles.progressBar} onClick={handleProgressClick}>
                  <div style={{ ...styles.progressFill, width: duration ? `${(currentTime / duration) * 100}%` : '0%' }} />
                </div>
                <div style={styles.timeRow}>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div style={styles.controls}>
                  <button style={styles.btnCtrl} onClick={() => { audioRef.current.currentTime -= 10; }}>⏪</button>
                  <button style={styles.btnPlay} onClick={togglePlay}>
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <button style={styles.btnCtrl} onClick={() => { audioRef.current.currentTime += 10; }}>⏩</button>
                </div>
                <div style={styles.speedRow}>
                  <span style={styles.speedLabel}>Vitesse :</span>
                  {[0.5, 0.75, 1, 1.25, 1.5].map(s => (
                    <button key={s} style={speed === s ? styles.speedBtnActive : styles.speedBtn} onClick={() => changeSpeed(s)}>
                      {s}x
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ ...styles.card, background: theme.card, border: `1px solid ${theme.border}` }}>
            <div style={styles.cardTitle}>Actions</div>
            <button style={styles.btnAction} onClick={handleDownload} disabled={!audioUrl}>
              ⬇️ Télécharger l'audio
            </button>
            <button style={styles.btnAction} onClick={handleBookmark}>
              🔖 Ajouter un signet — Page {currentPage}
            </button>
            <button style={styles.btnAction} onClick={() => navigate('/bibliotheque')}>
              ← Retour bibliothèque
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lecteur;