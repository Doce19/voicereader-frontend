import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

function Abonnement() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-[#0F1117] text-[#E8EAF0] font-sans"
      style={{ background: theme.bg, color: theme.text }}
    >
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#E8EAF0] sm:text-5xl">
            Choisissez votre plan
          </h1>
          <p className="mt-3 text-base text-[#8892A4] sm:text-lg">
            Commencez gratuitement, évoluez selon vos besoins
          </p>
        </header>

        <section className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          <article
            className="flex flex-col rounded-xl border border-[#2A3148] bg-[#161B27] p-7 transition-all hover:scale-[1.01] hover:border-[#8892A4]/50"
            style={{ background: theme.card, border: `1px solid ${theme.border}` }}
          >
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                Gratuit
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#E8EAF0]">0€</span>
                <span className="text-sm text-[#8892A4]">/ pour toujours</span>
              </div>
            </div>

            <ul className="mb-8 flex-1 space-y-4">
              {[
                '3 documents / mois',
                'Voix standard',
                'Lecture en ligne',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#E8EAF0]">
                  <span className="material-symbols-outlined text-[21px] text-[#8892A4]">
                    check_circle
                  </span>
                  {item}
                </li>
              ))}

              {[
                'Téléchargement MP3',
                'Voix HD',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#8892A4] opacity-60">
                  <span className="material-symbols-outlined text-[21px]">
                    cancel
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => navigate('/connexion')}
              className="w-full rounded-lg border border-[#2A3148] px-5 py-3 text-sm font-bold text-[#E8EAF0] transition-colors hover:bg-[#32353A]/40 active:scale-95"
            >
              Commencer
            </button>
          </article>

          <article
            className="relative flex flex-col overflow-hidden rounded-xl border border-[#185FA5] bg-[#161B27] p-7 shadow-[0_0_35px_rgba(24,95,165,0.18)] transition-all hover:scale-[1.01]"
            style={{ background: theme.card }}
          >
            <div className="absolute right-0 top-0 rounded-bl-xl bg-[#185FA5] px-5 py-2">
              <span className="text-xs font-bold text-[#E8EAF0]">Recommandé</span>
            </div>

            <div className="mb-6 pt-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#A4C9FF]">
                Premium
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#A4C9FF]">9,99€</span>
                <span className="text-sm text-[#8892A4]">/ mois</span>
              </div>
            </div>

            <ul className="mb-8 flex-1 space-y-4">
              {[
                'Documents illimités',
                'Voix HD naturelle',
                'Téléchargement MP3',
                'Signets illimités',
                'Support prioritaire',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-[#E8EAF0]">
                  <span
                    className="material-symbols-outlined text-[21px] text-[#A4C9FF]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => alert('Stripe bientôt disponible !')}
              className="w-full rounded-lg bg-[#185FA5] px-5 py-3 text-sm font-bold text-[#E8EAF0] shadow-lg shadow-[#185FA5]/20 transition-all hover:bg-[#378ADD] active:scale-95"
            >
              Essai 7 jours gratuit
            </button>
          </article>
        </section>

        <section className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[#8892A4]">
          <div className="flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-[21px]">security</span>
            Paiement sécurisé
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-[21px]">verified</span>
            Annulation à tout moment
          </div>
        </section>
      </main>
    </div>
  );
}

export default Abonnement;