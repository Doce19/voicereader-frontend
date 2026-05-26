import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

function Accueil() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-[#0F1117] text-[#E8EAF0] font-sans"
      style={{ background: theme.bg, color: theme.text }}
    >
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-[#2A3148] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_440px]">
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#006FC0] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#E9F0FF]">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                Synthèse vocale intelligente
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-[#E8EAF0] sm:text-5xl lg:text-6xl">
                Transformez vos PDF en{' '}
                <span className="text-[#A4C9FF]">expérience audio</span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#8892A4] sm:text-lg lg:mx-0">
                Uploadez n'importe quel document PDF et écoutez-le avec une voix naturelle.
                Parfait pour les malvoyants, les étudiants et les professionnels.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <button
                  onClick={() => navigate('/connexion')}
                  className="rounded-lg bg-[#185FA5] px-7 py-3.5 text-sm font-bold text-[#E8EAF0] shadow-lg shadow-[#185FA5]/20 transition-all hover:brightness-110 active:scale-95"
                >
                  Commencer gratuitement
                </button>

                <button
                  onClick={() => navigate('/abonnement')}
                  className="rounded-lg border border-[#2A3148] px-7 py-3.5 text-sm font-bold text-[#E8EAF0] transition-all hover:border-[#378ADD] hover:bg-[#32353A]/30 active:scale-95"
                >
                  Voir les tarifs
                </button>
              </div>
            </div>

            <div className="mx-auto w-full max-w-md rounded-xl border border-[#2A3148] bg-[#161B27] p-5 shadow-2xl shadow-black/30">
              <div className="mb-5 flex gap-4">
                <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg border border-[#2A3148] bg-[#272A2F]">
                  <span className="material-symbols-outlined text-[34px] text-[#A4C9FF]">
                    description
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-bold text-[#E8EAF0]">
                    Rapport_Annuel_2024.pdf
                  </h2>
                  <p className="mt-1 text-sm text-[#8892A4]">
                    Chapitre 2 : Analyse du marché
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="rounded bg-[#1D2024] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8892A4]">
                      Research
                    </span>
                    <span className="rounded bg-[#1D2024] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8892A4]">
                      Audio
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4 flex justify-between text-xs font-semibold text-[#8892A4]">
                <span>04:12</span>
                <span>12:45</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#2A3148]">
                <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#185FA5] to-[#378ADD]" />
              </div>

              <div className="flex items-center justify-center gap-8 py-7">
                <button className="text-[#8892A4] transition-colors hover:text-[#A4C9FF]">
                  <span className="material-symbols-outlined text-[30px]">skip_previous</span>
                </button>

                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-[#A4C9FF] text-[#00315D] shadow-lg shadow-[#185FA5]/30 transition-transform hover:scale-105 active:scale-95">
                  <span
                    className="material-symbols-outlined text-[40px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_arrow
                  </span>
                </button>

                <button className="text-[#8892A4] transition-colors hover:text-[#A4C9FF]">
                  <span className="material-symbols-outlined text-[30px]">skip_next</span>
                </button>
              </div>

              <div className="flex justify-between border-t border-[#2A3148] pt-4 text-sm text-[#8892A4]">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">speed</span>
                  1.2x
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
                  Voix HD
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            {
              icon: 'upload_file',
              title: 'Upload PDF',
              desc: "Importez vos documents et accédez-y depuis n'importe quel appareil.",
            },
            {
              icon: 'mic',
              title: 'Voix naturelle',
              desc: 'Synthèse vocale haute qualité en français et en anglais.',
            },
            {
              icon: 'bookmark',
              title: 'Signets',
              desc: 'Reprenez la lecture exactement là où vous vous étiez arrêté.',
            },
          ].map(feature => (
            <article
              key={feature.title}
              className="group rounded-xl border border-[#2A3148] bg-[#161B27] p-7 transition-all hover:scale-[1.01] hover:border-[#378ADD]"
              style={{ background: theme.card, border: `1px solid ${theme.border}` }}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#185FA5]/20 text-[#A4C9FF] transition-colors group-hover:bg-[#185FA5] group-hover:text-[#E8EAF0]">
                <span className="material-symbols-outlined">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-[#E8EAF0]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#8892A4]">{feature.desc}</p>
            </article>
          ))}
        </section>

        <section className="mx-auto mb-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-[#185FA5] px-6 py-12 text-center shadow-2xl shadow-[#185FA5]/20">
            <h2 className="text-3xl font-bold text-[#E8EAF0]">
              Prêt à commencer ?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#E8EAF0]/80">
              Créez votre compte et transformez vos documents en audio en quelques clics.
            </p>
            <button
              onClick={() => navigate('/connexion')}
              className="mt-7 rounded-lg bg-[#E8EAF0] px-7 py-3.5 text-sm font-bold text-[#185FA5] transition-all hover:scale-105 active:scale-95"
            >
              Créer un compte
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Accueil;