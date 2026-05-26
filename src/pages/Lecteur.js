import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API, { API_BASE_URL } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useToast, ToastContainer } from '../components/Toast';

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
      const documentsData = Array.isArray(res.data)
        ? res.data
        : res.data.documents || res.data.results || res.data.data || [];

      const doc = documentsData.find(d => d.id === parseInt(id));
      setDocument(doc);

      if (doc) {
        const token = localStorage.getItem('token');
        const pdfResponse = await fetch(
          `${API_BASE_URL}/documents/${id}/file`,
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
      `${API_BASE_URL}/documents/${id}/audio?lang=${lang}&genre=${genre}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AUDIO ERROR STATUS:', response.status);
      console.error('AUDIO ERROR BODY:', errorText);
      showToast("Erreur lors de la génération de l'audio", 'error');
      return;
    }

    const blob = await response.blob();

    if (!blob.type.includes('audio')) {
      console.error('Le backend n’a pas renvoyé un fichier audio.');
      console.error('Blob type:', blob.type);
      showToast("Le backend n'a pas renvoyé un fichier audio valide", 'error');
      return;
    }

    setAudioUrl(URL.createObjectURL(blob));
    showToast('Audio généré avec succès !', 'success');
  } catch (err) {
    console.error('AUDIO FETCH ERROR:', err);
    showToast("Erreur réseau pendant la génération audio", 'error');
  } finally {
    setGenerating(false);
  }
};

  const togglePlay = () => {
  if (!audioRef.current) return;
  if (isPlaying) {
    audioRef.current.pause();
    saveProgress();
  } else {
    audioRef.current.play();
  }
  setIsPlaying(!isPlaying);
};

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };
  const saveProgress = async () => {
  if (!document || !duration || currentTime === 0) return;
  const ratio = currentTime / duration;
  const estimatedPage = Math.max(1, Math.ceil(ratio * (document.total_pages || 1)));
  try {
    await API.put(`/documents/${id}/progress?page=${estimatedPage}`);
  } catch (err) {
    console.error(err);
  }
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
    <div className="flex min-h-screen items-center justify-center bg-[#0F1117] text-[#8892A4]">
      <div className="rounded-xl border border-[#2A3148] bg-[#161B27] px-6 py-5 text-sm">
        Chargement du document...
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-[#0F1117] text-[#E8EAF0] font-sans"
      style={{ background: theme.bg, color: theme.text }}
    >
      <Navbar />

      <main className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-4 px-3 py-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-6 lg:px-8 lg:py-6">
        <section className="overflow-hidden rounded-xl border border-[#2A3148] bg-[#161B27] shadow-2xl shadow-black/20">
          <header className="flex flex-col gap-3 border-b border-[#2A3148] bg-[#1E2535]/80 px-4 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                <span className="material-symbols-outlined text-[18px]">description</span>
                PDF Preview
              </div>
              <h1 className="mt-1 truncate text-base font-bold text-[#E8EAF0] sm:text-lg">
                {document?.title || 'Document'}
              </h1>
            </div>

            <span className="inline-flex w-fit items-center rounded-full bg-[#32353A] px-3 py-1 text-xs font-semibold text-[#C2C6D2]">
              {document?.total_pages || 0} page(s)
            </span>
          </header>

          <div className="bg-[#0C0E13]">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                width="100%"
                height="100%"
                className="min-h-[62vh] border-0 lg:min-h-[calc(100vh-160px)]"
                title="PDF Viewer"
              />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center p-8 text-center text-sm text-[#8892A4]">
                Chargement du PDF...
              </div>
            )}
          </div>
        </section>

        <aside className="flex flex-col gap-4 pb-8 lg:sticky lg:top-20 lg:max-h-[calc(100vh-96px)] lg:overflow-y-auto lg:pr-2">
          <section className="rounded-xl border border-[#2A3148] bg-[#161B27] p-5 shadow-xl shadow-black/10">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                  Lecteur Audio
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#E8EAF0]">
                  Synthèse vocale
                </h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#185FA5]/20 text-[#A4C9FF]">
                <span className="material-symbols-outlined">headphones</span>
              </div>
            </div>

            {!audioUrl && !generating && (
              <>
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                      Langue
                    </label>
                    <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#2A3148] bg-[#0F1117] p-1">
                      {['fr', 'en'].map(l => (
                        <button
                          key={l}
                          onClick={() => setLang(l)}
                          className={`rounded-md px-3 py-3 text-sm font-bold transition-all active:scale-95 ${
                            lang === l
                              ? 'bg-[#006FC0] text-[#E9F0FF]'
                              : 'text-[#8892A4] hover:bg-[#32353A]/40 hover:text-[#E8EAF0]'
                          }`}
                        >
                          {l === 'fr' ? 'Français' : 'Anglais'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                      Voix
                    </label>
                    <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#2A3148] bg-[#0F1117] p-1">
                      {['masculin', 'feminin'].map(g => (
                        <button
                          key={g}
                          onClick={() => setGenre(g)}
                          className={`rounded-md px-3 py-3 text-sm font-bold transition-all active:scale-95 ${
                            genre === g
                              ? 'bg-[#006FC0] text-[#E9F0FF]'
                              : 'text-[#8892A4] hover:bg-[#32353A]/40 hover:text-[#E8EAF0]'
                          }`}
                        >
                          {g === 'masculin' ? 'Masculin' : 'Féminin'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={generateAudio}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#185FA5] px-5 py-4 text-sm font-bold text-[#E8EAF0] shadow-lg shadow-[#185FA5]/10 transition-all hover:brightness-110 active:scale-95"
                >
                  <span className="material-symbols-outlined">mic</span>
                  Générer l'audio
                </button>
              </>
            )}

            {generating && (
              <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#1E2535] border-t-[#378ADD]" />
                <p className="text-sm font-bold text-[#A4C9FF]">
                  Génération en cours...
                </p>
                <p className="mt-2 max-w-xs text-xs leading-5 text-[#8892A4]">
                  Cela peut prendre quelques secondes selon la densité du document.
                </p>
              </div>
            )}

            {audioUrl && (
              <>
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={() => setDuration(audioRef.current.duration)}
                  onEnded={() => { setIsPlaying(false); saveProgress(); }}
                />

                <div
                  className="mb-2 h-2 cursor-pointer overflow-hidden rounded-full bg-[#2A3148]"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#185FA5] to-[#378ADD] transition-all"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                  />
                </div>

                <div className="mb-6 flex justify-between text-xs font-semibold text-[#8892A4]">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="mb-6 flex items-center justify-center gap-8">
                  <button
                    onClick={() => { audioRef.current.currentTime -= 10; }}
                    className="flex h-12 w-12 items-center justify-center rounded-full text-[#C2C6D2] transition-all hover:bg-[#32353A]/40 hover:text-[#A4C9FF] active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[32px]">replay_10</span>
                  </button>

                  <button
                    onClick={togglePlay}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-[#A4C9FF] text-[#00315D] shadow-xl shadow-[#185FA5]/20 transition-all hover:scale-105 active:scale-95"
                  >
                    <span
                      className="material-symbols-outlined text-[44px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>

                  <button
                    onClick={() => { audioRef.current.currentTime += 10; }}
                    className="flex h-12 w-12 items-center justify-center rounded-full text-[#C2C6D2] transition-all hover:bg-[#32353A]/40 hover:text-[#A4C9FF] active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[32px]">forward_10</span>
                  </button>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                    Vitesse
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[0.5, 0.75, 1, 1.25, 1.5].map(s => (
                      <button
                        key={s}
                        onClick={() => changeSpeed(s)}
                        className={`rounded-full border px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                          speed === s
                            ? 'border-[#A4C9FF] bg-[#185FA5] text-[#E8EAF0]'
                            : 'border-[#2A3148] bg-[#272A2F] text-[#8892A4] hover:border-[#378ADD] hover:text-[#E8EAF0]'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </section>

          <section className="rounded-xl border border-[#2A3148] bg-[#161B27] p-5 shadow-xl shadow-black/10">
  <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
    Actions
  </p>

  <div className="space-y-3">
    <button
      onClick={handleDownload}
      disabled={!audioUrl}
      className="group flex w-full items-center gap-3 rounded-lg border border-[#2A3148] bg-[#0F1117] px-4 py-3 text-left text-sm font-bold text-[#E8EAF0] transition-all hover:border-[#378ADD] hover:bg-[#32353A]/30 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="material-symbols-outlined text-[#A4C9FF]">download</span>
      Télécharger l'audio
    </button>

    <button
      onClick={handleBookmark}
      className="group flex w-full items-center gap-3 rounded-lg border border-[#2A3148] bg-[#0F1117] px-4 py-3 text-left text-sm font-bold text-[#E8EAF0] transition-all hover:border-[#378ADD] hover:bg-[#32353A]/30"
    >
      <span className="material-symbols-outlined text-[#A4C9FF]">bookmark_add</span>
      Ajouter un signet — Page {currentPage}
    </button>

    <button
      onClick={() => navigate('/bibliotheque')}
      className="group flex w-full items-center gap-3 rounded-lg border border-[#2A3148] bg-[#0F1117] px-4 py-3 text-left text-sm font-bold text-[#E8EAF0] transition-all hover:border-[#378ADD] hover:bg-[#32353A]/30"
    >
      <span className="material-symbols-outlined text-[#A4C9FF]">arrow_back</span>
      Retour bibliothèque
    </button>
  </div>
</section>

          <section className="rounded-xl border border-[#185FA5]/30 bg-[#185FA5]/10 p-5">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-[#A4C9FF]">auto_awesome</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#A4C9FF]">
                  Conseil
                </p>
                <p className="mt-1 text-sm leading-6 text-[#C2C6D2]">
                  Générez l'audio, puis utilisez les vitesses de lecture pour ajuster l'écoute selon le type de document.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </main>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default Lecteur;