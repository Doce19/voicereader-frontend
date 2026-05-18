import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useToast, ToastContainer } from '../components/Toast';

const styles = {
  page: { background: '#0f1117', minHeight: '100vh', color: '#e8eaf0', fontFamily: 'sans-serif' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '40px 32px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  title: { fontSize: '24px', fontWeight: 'bold' },
  btnUpload: { background: '#185FA5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  card: { background: '#161b27', border: '1px solid #2a3148', borderRadius: '12px', padding: '20px 24px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  icon: { fontSize: '32px' },
  docTitle: { fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' },
  docInfo: { color: '#5a6478', fontSize: '13px' },
  cardBtns: { display: 'flex', gap: '10px' },
  btnPlay: { background: '#185FA5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  btnDelete: { background: 'transparent', color: '#f87171', border: '1px solid #5a2020', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' },
  empty: { textAlign: 'center', color: '#5a6478', padding: '60px 0' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  modalCard: { background: '#161b27', border: '1px solid #2a3148', borderRadius: '12px', padding: '32px', width: '400px' },
  modalTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' },
  input: { width: '100%', background: '#0f1117', border: '1px solid #2a3148', borderRadius: '8px', padding: '10px 14px', color: '#e8eaf0', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' },
  modalBtns: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
  btnCancel: { background: 'transparent', color: '#8892a4', border: '1px solid #2a3148', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
  progressBar: { height: '4px', background: '#1e2535', borderRadius: '2px', marginTop: '8px' },
  progressFill: { height: '4px', background: '#378ADD', borderRadius: '2px' },
};

function Bibliotheque() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const { toasts, showToast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await API.get('/documents/');
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await API.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowModal(false);
      setSelectedFile(null);
      fetchDocuments();
      showToast('Document uploadé avec succès !', 'success');
    } catch (err) {
      console.error(err);
    }
    setUploading(false);
  };
  const handleDelete = async (docId, docTitle) => {
  if (!window.confirm(`Supprimer "${docTitle}" ? Cette action est irréversible.`)) return;
  try {
    await API.delete(`/documents/${docId}`);
    fetchDocuments();
    showToast('Document supprimé', 'info');
  } catch (err) {
    console.error(err);
    showToast('Erreur lors de la suppression', 'error');
  }
};

  const getProgress = (doc) => {
    if (doc.total_pages === 0) return 0;
    return Math.round((doc.last_page / doc.total_pages) * 100);
  };

  return (
    <div style={{ ...styles.page, background: theme.bg, color: theme.text }}>
      <Navbar />
      <div style={{ ...styles.container, padding: window.innerWidth < 768 ? '20px 16px' : '40px 32px' }}>
        <div style={{ ...styles.header, flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '12px', alignItems: window.innerWidth < 768 ? 'flex-start' : 'center' }}>
          <input
  type="text"
  placeholder="Rechercher un document..."
  value={search}
  onChange={e => setSearch(e.target.value)}
  style={{
    width: '100%',
    background: theme.input || '#0f1117',
    border: `1px solid ${theme.border}`,
    borderRadius: '10px',
    padding: '12px 16px',
    color: theme.text,
    fontSize: '14px',
    marginBottom: '20px',
    boxSizing: 'border-box',
    outline: 'none',
  }}
/>
          <h1 style={styles.title}>Ma Bibliothèque</h1>
          <button style={styles.btnUpload} onClick={() => setShowModal(true)}>
            + Upload PDF
          </button>
        </div>

        {loading && <p style={{ color: '#5a6478' }}>Chargement...</p>}

        {!loading && documents.length === 0 && (
          <div style={styles.empty}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <p>Aucun document pour l'instant. Uploadez votre premier PDF !</p>
          </div>
        )}

        {documents
  .filter(doc => doc.title.toLowerCase().includes(search.toLowerCase()))
  .map(doc => (
          <div key={doc.id} style={{ ...styles.card, background: theme.card, border: `1px solid ${theme.border}` }}>
            <div style={styles.cardLeft}>
              <div style={styles.icon}>📄</div>
              <div>
                <div style={styles.docTitle}>{doc.title}</div>
                <div style={styles.docInfo}>
                  {doc.total_pages} page(s) • Progression : {getProgress(doc)}%
                </div>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${getProgress(doc)}%` }} />
                </div>
              </div>
            </div>
            <div style={styles.cardBtns}>
              <button style={styles.btnPlay} onClick={() => navigate(`/lecteur/${doc.id}`)}>
                ▶ Lire
              </button>
                <button
        onClick={() => handleDelete(doc.id, doc.title)}
        style={{
          background: 'transparent',
          color: '#f87171',
          border: '1px solid #5a2020',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '13px'
        }}
      >
        🗑️ Supprimer
      </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>Importer un PDF</h3>
            <input
              style={styles.input}
              type="file"
              accept=".pdf"
              onChange={e => setSelectedFile(e.target.files[0])}
            />
            <div style={styles.modalBtns}>
              <button style={styles.btnCancel} onClick={() => setShowModal(false)}>
                Annuler
              </button>
              <button style={styles.btnUpload} onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Upload...' : 'Importer'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default Bibliotheque;