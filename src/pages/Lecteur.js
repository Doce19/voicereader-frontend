import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API, { API_BASE_URL } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useToast, ToastContainer } from '../components/Toast';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
  const [lang, setLang] = useState('fr');
  const [genre, setGenre] = useState('feminin');
  const { toasts, showToast } = useToast();

  const [numPages, setNumPages] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [containerWidth, setContainerWidth] = useState(600);
  const containerRef = useRef(null);

  // ÉTATS ADAPTÉS : Stockage des mots synchronisés
  const [wordsTimestamps, setWordsTimestamps] = useState([]);
  const [loadingTimestamps, setLoadingTimestamps] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [loading, pdfUrl]);

  // Chargement du document initial et du fichier binaire PDF
  useEffect(() => {
    let isMounted = true;

    const fetchDocumentData = async () => {
      try {
        setLoading(true);
        const res = await API.get('/documents/');
        const documentsData = Array.isArray(res.data)
          ? res.data
          : res.data.documents || res.data.results || res.data.data || [];

        const doc = documentsData.find(d => d.id === parseInt(id));
        
        if (isMounted) {
          setDocument(doc);
        }

        if (doc) {
          const token = localStorage.getItem('token');
          
          // Récupération du fichier binaire PDF
          const pdfResponse = await fetch(
            `${API_BASE_URL}/documents/${id}/file`,
            { 
              method: 'GET',
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/pdf'
              } 
            }
          );

          if (!pdfResponse.ok) throw new Error(`Erreur HTTP: ${pdfResponse.status}`);
          const blob = await pdfResponse.blob();
          
          if (blob.type === "application/pdf" && isMounted) {
            setPdfUrl(URL.createObjectURL(blob));
          }

          // Si l'audio a déjà été généré par le passé, on tente de charger ses timestamps associés
          fetchTimestampsData();
        }
      } catch (err) {
        console.error("Erreur d'initialisation du lecteur:", err);
        if (isMounted) showToast("Impossible de charger le document", "error");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDocumentData();

    return () => {
      isMounted = false;
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Fonction pour charger les timestamps depuis l'API FastAPI
  const fetchTimestampsData = async () => {
    try {
      setLoadingTimestamps(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/documents/${id}/timestamps`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWordsTimestamps(data);
      }
    } catch (err) {
      console.warn("Timestamps non encore disponibles ou erreur de lecture.");
    } finally {
      setLoadingTimestamps(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNum(1);
  };

  const onDocumentLoadError = (err) => {
    console.error("Erreur react-pdf:", err);
    showToast("Erreur d'affichage du PDF", "error");
  };

  // Génération globale incluant la récupération immédiate du JSON de timing après le MP3
  const generateAudio = async () => {
    setGenerating(true);
    setAudioUrl(null);
    setWordsTimestamps([]);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/documents/${id}/audio?lang=${lang}&genre=${genre}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) {
        showToast("Erreur lors de la génération de l'audio", 'error');
        return;
      }

      const blob = await response.blob();
      setAudioUrl(URL.createObjectURL(blob));
      showToast('Audio généré avec succès !', 'success');

      // Récupération instantanée des timestamps fraîchement calculés
      await fetchTimestampsData();
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
      await API.post(`/bookmarks/${id}`, {
        page: pageNum,
        note: `Page ${pageNum} - ${formatTime(currentTime)}`
      });
      showToast(`Signet ajouté à la page ${pageNum} !`, 'success');
    } catch (err) {
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
    <div className="min-h-screen bg-[#0F1117] text-[#E8EAF0] font-sans" style={{ background: theme.bg, color: theme.text }}>
      <Navbar />

      <main className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-4 px-3 py-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-6 lg:px-8 lg:py-6">
        
        {/* SECTION DE GAUCHE : VISIONNEUSE PDF + ZONE DE SUIVI DE MOTS */}
        <section className="flex flex-col gap-4">
          
          {/* Bloc Aperçu PDF Standard */}
          <div className="overflow-hidden rounded-xl border border-[#2A3148] bg-[#161B27] shadow-2xl">
            <header className="flex flex-col gap-3 border-b border-[#2A3148] bg-[#1E2535]/80 px-4 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                  <span className="material-symbols-outlined text-[18px]">description</span>
                  Document PDF
                </div>
                <h1 className="mt-1 truncate text-base font-bold text-[#E8EAF0] sm:text-lg">
                  {document?.title || 'Document'}
                </h1>
              </div>
              <span className="inline-flex w-fit items-center rounded-full bg-[#32353A] px-3 py-1 text-xs font-semibold text-[#C2C6D2]">
                {numPages || document?.total_pages || 0} page(s)
              </span>
            </header>

            <div ref={containerRef} className="bg-[#0C0E13] p-2 flex justify-center overflow-auto max-h-[500px]">
              {pdfUrl ? (
                <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError}>
                  <Page 
                    pageNumber={pageNum} 
                    width={containerWidth > 10 ? containerWidth - 20 : 600}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              ) : (
                <div className="text-sm text-[#8892A4] py-10">Récupération du document binaire...</div>
              )}
            </div>
            
            {/* Pagination du PDF */}
            {numPages > 1 && (
              <div className="flex w-full items-center justify-center gap-4 border-t border-[#2A3148] bg-[#161B27] px-4 py-3">
                <button
                  onClick={() => setPageNum(p => Math.max(1, p - 1))}
                  disabled={pageNum <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2A3148] bg-[#0F1117] text-[#A4C9FF] disabled:opacity-30"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="text-sm font-semibold text-[#8892A4]">
                  Page <span className="text-[#E8EAF0]">{pageNum}</span> / {numPages}
                </span>
                <button
                  onClick={() => setPageNum(p => Math.min(numPages, p + 1))}
                  disabled={pageNum >= numPages}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2A3148] bg-[#0F1117] text-[#A4C9FF] disabled:opacity-30"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </div>

          {/* ZONE PREMIUM : SUIVI VISUEL DU TEXTE MOT PAR MOT */}
          <div className="overflow-hidden rounded-xl border border-[#2A3148] bg-[#161B27] p-5 shadow-2xl">
            <div className="mb-3 flex items-center justify-between border-b border-[#2A3148] pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#378ADD]">
                <span className="material-symbols-outlined text-[18px]">mic_external_on</span>
                Suivi de lecture Karaoké (Mot par mot)
              </div>
              {audioUrl && (
                <span className="text-xs text-[#8892A4] italic">
                  {isPlaying ? "Synchronisation en direct..." : "Audio figé"}
                </span>
              )}
            </div>

            <div className="max-h-[250px] overflow-y-auto rounded-lg bg-[#0F1117] p-4 text-base leading-relaxed tracking-wide text-[#C2C6D2]">
              {loadingTimestamps ? (
                <div className="text-center text-sm text-[#8892A4] py-4">Chargement de la grille temporelle...</div>
              ) : wordsTimestamps.length > 0 ? (
                <div className="flex flex-wrap gap-x-1 gap-y-2">
                  {wordsTimestamps.map((item, index) => {
                    // Vérification si le mot est en train d'être prononcé
                    const isCurrentWord = currentTime >= item.start && currentTime <= item.end;
                    const hasBeenRead = currentTime > item.end;

                    return (
                      <span
                        key={index}
                        className={`inline-block px-0.5 rounded transition-all duration-100 ${
                          isCurrentWord 
                            ? 'bg-yellow-400 text-black font-extrabold scale-105 shadow-md px-1' 
                            : hasBeenRead 
                              ? 'text-[#E8EAF0]/40' 
                              : 'text-[#E8EAF0]'
                        }`}
                      >
                        {item.word}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-sm text-[#8892A4] py-4">
                  Génère ou lance l'audio pour activer le suivi mot par mot.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION DE DROITE : AUDIO CONTROLLER (Identique) */}
        <aside className="flex flex-col gap-4 pb-8 lg:sticky lg:top-20 lg:max-h-[calc(100vh-96px)] lg:overflow-y-auto lg:pr-2">
          <section className="rounded-xl border border-[#2A3148] bg-[#161B27] p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#8892A4]">Lecteur Audio</p>
                <h2 className="mt-1 text-xl font-bold text-[#E8EAF0]">Synthèse vocale</h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#185FA5]/20 text-[#A4C9FF]">
                <span className="material-symbols-outlined">headphones</span>
              </div>
            </div>

            {!audioUrl && !generating && (
              <>
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#8892A4]">Langue</label>
                    <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#2A3148] bg-[#0F1117] p-1">
                      {['fr', 'en'].map(l => (
                        <button
                          key={l}
                          onClick={() => setLang(l)}
                          className={`rounded-md px-3 py-3 text-sm font-bold ${lang === l ? 'bg-[#006FC0] text-[#E9F0FF]' : 'text-[#8892A4]'}`}
                        >
                          {l === 'fr' ? 'Français' : 'Anglais'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#8892A4]">Voix</label>
                    <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#2A3148] bg-[#0F1117] p-1">
                      {['masculin', 'feminin'].map(g => (
                        <button
                          key={g}
                          onClick={() => setGenre(g)}
                          className={`rounded-md px-3 py-3 text-sm font-bold ${genre === g ? 'bg-[#006FC0] text-[#E9F0FF]' : 'text-[#8892A4]'}`}
                        >
                          {g === 'masculin' ? 'Masculin' : 'Féminin'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={generateAudio}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#185FA5] px-5 py-4 text-sm font-bold text-[#E8EAF0]"
                >
                  <span className="material-symbols-outlined">mic</span>
                  Générer l'audio
                </button>
              </>
            )}

            {generating && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#1E2535] border-t-[#378ADD]" />
                <p className="text-sm font-bold text-[#A4C9FF]">Génération en cours...</p>
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

                <div className="mb-2 h-2 cursor-pointer rounded-full bg-[#2A3148]" onClick={handleProgressClick}>
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#185FA5] to-[#378ADD]"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                  />
                </div>

                <div className="mb-6 flex justify-between text-xs font-semibold text-[#8892A4]">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="mb-6 flex items-center justify-center gap-8">
                  <button onClick={() => { audioRef.current.currentTime -= 10; }} className="text-[#C2C6D2] hover:text-[#A4C9FF]">
                    <span className="material-symbols-outlined text-[32px]">replay_10</span>
                  </button>
                  <button onClick={togglePlay} className="flex h-20 w-20 items-center justify-center rounded-full bg-[#A4C9FF] text-[#00315D]">
                    <span className="material-symbols-outlined text-[44px]">{isPlaying ? 'pause' : 'play_arrow'}</span>
                  </button>
                  <button onClick={() => { audioRef.current.currentTime += 10; }} className="text-[#C2C6D2] hover:text-[#A4C9FF]">
                    <span className="material-symbols-outlined text-[32px]">forward_10</span>
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#8892A4]">Vitesse</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[0.5, 0.75, 1, 1.25, 1.5].map(s => (
                      <button
                        key={s}
                        onClick={() => changeSpeed(s)}
                        className={`rounded-full border px-4 py-2 text-xs font-bold ${speed === s ? 'bg-[#185FA5] text-[#E8EAF0]' : 'text-[#8892A4]'}`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </section>

          <section className="rounded-xl border border-[#2A3148] bg-[#161B27] p-5 shadow-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#8892A4]">Actions</p>
            <div className="space-y-3">
              <button onClick={handleDownload} disabled={!audioUrl} className="flex w-full items-center gap-3 rounded-lg border border-[#2A3148] bg-[#0F1117] px-4 py-3 text-sm font-bold disabled:opacity-50">
                <span className="material-symbols-outlined text-[#A4C9FF]">download</span>
                Télécharger l'audio
              </button>
              <button onClick={handleBookmark} className="flex w-full items-center gap-3 rounded-lg border border-[#2A3148] bg-[#0F1117] px-4 py-3 text-sm font-bold">
                <span className="material-symbols-outlined text-[#A4C9FF]">bookmark_add</span>
                Ajouter un signet
              </button>
              <button onClick={() => navigate('/bibliotheque')} className="flex w-full items-center gap-3 rounded-lg border border-[#2A3148] bg-[#0F1117] px-4 py-3 text-sm font-bold">
                <span className="material-symbols-outlined text-[#A4C9FF]">arrow_back</span>
                Retour bibliothèque
              </button>
            </div>
          </section>
        </aside>
      </main>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default Lecteur;