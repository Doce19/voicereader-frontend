import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useToast, ToastContainer } from '../components/Toast';

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

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.documents || res.data.results || res.data.data || [];

    setDocuments(data);
  } catch (err) {
    console.error(err);
    setDocuments([]);
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
    <div
      className="min-h-screen bg-[#0F1117] text-[#E8EAF0] font-sans"
      style={{ background: theme.bg, color: theme.text }}
    >
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#E8EAF0]">
              Ma Bibliothèque
            </h1>
            <p className="mt-1 text-sm text-[#8892A4]">
              Gérez et écoutez vos documents PDF
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#185FA5] px-5 py-3 text-sm font-bold text-[#E8EAF0] shadow-lg shadow-[#185FA5]/10 transition-all hover:brightness-110 active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            Upload PDF
          </button>
        </section>

        <section className="mb-8">
          <div className="group relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8892A4] transition-colors group-focus-within:text-[#A4C9FF]">
              search
            </span>
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#2A3148] bg-[#0F1117] py-4 pl-12 pr-4 text-sm text-[#E8EAF0] outline-none transition-all placeholder:text-[#8892A4] focus:border-[#378ADD]"
            />
          </div>
        </section>

        {loading && (
          <div className="rounded-xl border border-[#2A3148] bg-[#161B27] p-6 text-sm text-[#8892A4]">
            Chargement...
          </div>
        )}

        {!loading && documents.length === 0 && (
          <section className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-[#2A3148] bg-[#161B27] p-8 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#1D2024] text-[#8892A4]">
              <span className="material-symbols-outlined text-[40px]">library_books</span>
            </div>
            <h2 className="text-lg font-bold text-[#E8EAF0]">Aucun document</h2>
            <p className="mt-2 max-w-sm text-sm text-[#8892A4]">
              Uploadez votre premier PDF pour commencer l'écoute.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-5 text-sm font-bold text-[#A4C9FF] underline-offset-4 hover:underline"
            >
              Importer un fichier
            </button>
          </section>
        )}

        {!loading && documents.length > 0 && (
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.isArray(documents) && documents
                  .filter(doc => doc.title.toLowerCase().includes(search.toLowerCase()))
                    .map(doc => {
                const progress = getProgress(doc);

                return (
                  <article
                    key={doc.id}
                    className="group flex flex-col gap-5 rounded-xl border border-[#2A3148] bg-[#161B27] p-6 transition-all hover:scale-[1.01] hover:border-[#378ADD]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#185FA5]/20 text-[#A4C9FF]">
                        <span
                          className="material-symbols-outlined text-[30px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          picture_as_pdf
                        </span>
                      </div>

                      <span className="rounded-full bg-[#32353A] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#C2C6D2]">
                        {doc.total_pages} page(s)
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-bold text-[#E8EAF0]">
                        {doc.title}
                      </h2>
                      <p className="mt-1 text-sm text-[#8892A4]">
                        Progression : {progress}%
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[#8892A4]">
                        <span>Progression</span>
                        <span className="text-[#A4C9FF]">{progress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#2A3148]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#185FA5] to-[#378ADD]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-auto flex items-center gap-3 pt-2">
                      <button
                        onClick={() => navigate(`/lecteur/${doc.id}`)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#185FA5] py-3 text-sm font-bold text-[#E8EAF0] transition-all hover:brightness-110 active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                        Lire
                      </button>

                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#5A2020] text-[#FFB4AB] transition-all hover:border-[#FFB4AB] hover:bg-[#93000A]/20 active:scale-95"
                        aria-label={`Supprimer ${doc.title}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </article>
                );
              })}
          </section>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0F1117]/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#2A3148] bg-[#1C2333] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2A3148] p-6">
              <h3 className="text-xl font-semibold text-[#E8EAF0]">
                Importer un PDF
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-2 text-[#8892A4] transition-colors hover:bg-[#32353A]/50 hover:text-[#E8EAF0]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6 p-6">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-[#2A3148] p-10 text-center transition-all hover:border-[#378ADD] hover:bg-[#185FA5]/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#185FA5]/10 text-[#A4C9FF]">
                  <span className="material-symbols-outlined text-[32px]">upload</span>
                </div>

                <div>
                  <p className="font-bold text-[#E8EAF0]">
                    Glissez-déposez votre PDF ici
                  </p>
                  <p className="mt-1 text-sm text-[#8892A4]">
                    ou cliquez pour parcourir vos fichiers
                  </p>
                </div>

                <span className="rounded-full bg-[#161B27] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#8892A4]">
                  {selectedFile ? selectedFile.name : 'PDF uniquement'}
                </span>

                <input
                  className="hidden"
                  type="file"
                  accept=".pdf"
                  onChange={e => setSelectedFile(e.target.files[0])}
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 bg-[#161B27] p-6">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg px-5 py-3 text-sm font-bold text-[#8892A4] transition-colors hover:text-[#E8EAF0]"
              >
                Annuler
              </button>

              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="rounded-xl bg-[#185FA5] px-8 py-3 text-sm font-bold text-[#E8EAF0] transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
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