import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

function NotFound() {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#0F1117] text-[#E8EAF0] font-sans"
      style={{ background: theme.bg, color: theme.text }}
    >
      <Navbar />

      <main className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-12 text-center">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-[#185FA5]/20 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-[#006FC0]/20 blur-[120px]" />
        </div>

        <section className="relative z-10 flex max-w-2xl flex-col items-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#2A3148] bg-[#161B27] shadow-2xl shadow-black/30">
            <span className="material-symbols-outlined text-[58px] text-[#A4C9FF]">
              search
            </span>
          </div>

          <h1 className="text-[96px] font-extrabold leading-none tracking-tight text-[#A4C9FF] drop-shadow-[0_0_24px_rgba(24,95,165,0.45)] sm:text-[150px]">
            404
          </h1>

          <h2 className="mt-4 text-2xl font-bold text-[#E8EAF0] sm:text-3xl">
            Page introuvable
          </h2>

          <p className="mt-4 max-w-md text-base leading-7 text-[#8892A4]">
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>

          <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-7 py-3.5 text-sm font-bold text-[#E8EAF0] shadow-lg shadow-[#185FA5]/20 transition-all hover:brightness-110 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">home</span>
              Retour à l'accueil
            </button>

            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#2A3148] px-7 py-3.5 text-sm font-bold text-[#C2C6D2] transition-all hover:bg-[#32353A]/30 hover:text-[#E8EAF0] active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              Page précédente
            </button>
          </div>

          <div className="mt-14 w-full max-w-3xl opacity-60">
            <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-[#2A3148] to-transparent" />
            <div className="grid grid-cols-3 gap-3">
              {['audio_file', 'menu_book', 'waves'].map(icon => (
                <div
                  key={icon}
                  className="flex h-24 items-center justify-center rounded-xl border border-[#2A3148] bg-[#161B27]/70 backdrop-blur-md sm:h-32"
                >
                  <span className="material-symbols-outlined text-[#8892A4]">
                    {icon}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default NotFound;