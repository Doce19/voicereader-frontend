import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const theme = useTheme() || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setShowInstall(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/connexion');
    setMenuOpen(false);
  };

  const navLinks = [
    { label: 'Accueil', to: '/', visible: true },
    { label: 'Bibliothèque', to: '/bibliotheque', visible: !!token },
    { label: 'Paramètres', to: '/parametres', visible: !!token },
    { label: 'Abonnement', to: '/abonnement', visible: true },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-[#2A3148] bg-[#161B27]/90 backdrop-blur-md"
        style={{
          background: theme.nav || undefined,
          borderBottomColor: theme.border || undefined,
        }}
      >
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-bold tracking-tight text-[#378ADD]"
            style={{ color: theme.accent || undefined }}
          >
            <span className="hidden h-9 w-9 items-center justify-center rounded-lg bg-[#185FA5]/20 text-[#A4C9FF] sm:flex">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                headphones
              </span>
            </span>
            VoiceReader
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.filter(link => link.visible).map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-[#AAB4C5] transition-colors hover:text-[#E8EAF0]"
                style={{ color: theme.textMuted || undefined }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {showInstall && (
              <button
                type="button"
                onClick={handleInstall}
                className="inline-flex items-center gap-2 rounded-lg border border-[#185FA5] bg-[#0C447C] px-3 py-2 text-sm font-bold text-[#85B7EB] transition-all hover:brightness-110 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Installer
              </button>
            )}

            <button
              type="button"
              onClick={theme.toggleTheme}
              className="flex h-10 w-12 items-center justify-center rounded-lg border border-[#2A3148] text-[#E8EAF0] transition-colors hover:bg-[#32353A]/40"
              style={{ borderColor: theme.border || undefined, color: theme.text || undefined }}
            >
              <span className="material-symbols-outlined text-[20px]">
                {theme.isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {token && (
              <button
                type="button"
                onClick={() => navigate('/parametres')}
                className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#378ADD] bg-[#185FA5] transition-transform hover:scale-105"
              >
                {localStorage.getItem('avatar') ? (
                  <img
                    src={localStorage.getItem('avatar')}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center">
                    <span className="material-symbols-outlined text-[20px] text-white">person</span>
                  </span>
                )}
              </button>
            )}

            {token ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-[#185FA5] px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
              >
                Déconnexion
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/connexion')}
                className="rounded-lg bg-[#185FA5] px-5 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
              >
                Connexion
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2A3148] text-[#E8EAF0] md:hidden"
            style={{ borderColor: theme.border || undefined, color: theme.text || undefined }}
          >
            <span className="material-symbols-outlined">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </nav>

        {menuOpen && (
          <div
            className="border-t border-[#2A3148] bg-[#161B27] px-4 py-4 md:hidden"
            style={{
              background: theme.nav || undefined,
              borderTopColor: theme.border || undefined,
            }}
          >
            <div className="flex flex-col gap-2">
              {navLinks.filter(link => link.visible).map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-[#E8EAF0] transition-colors hover:bg-[#32353A]/40"
                  style={{ color: theme.text || undefined }}
                >
                  {link.label}
                </Link>
              ))}

              {showInstall && (
                <button
                  type="button"
                  onClick={handleInstall}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-[#185FA5] bg-[#0C447C] px-3 py-3 text-sm font-bold text-[#85B7EB]"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Installer l'application
                </button>
              )}

              <button
                type="button"
                onClick={theme.toggleTheme}
                className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[#2A3148] px-3 py-3 text-sm font-medium text-[#E8EAF0]"
                style={{ borderColor: theme.border || undefined, color: theme.text || undefined }}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {theme.isDark ? 'light_mode' : 'dark_mode'}
                </span>
                {theme.isDark ? 'Mode clair' : 'Mode sombre'}
              </button>

              {token && (
                <button
                  type="button"
                  onClick={() => {
                    navigate('/parametres');
                    setMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#E8EAF0] hover:bg-[#32353A]/40"
                >
                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[#378ADD] bg-[#185FA5]">
                    {localStorage.getItem('avatar') ? (
                      <img
                        src={localStorage.getItem('avatar')}
                        alt="avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[18px] text-white">person</span>
                    )}
                  </span>
                  Profil
                </button>
              )}

              {token ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2 rounded-lg bg-[#185FA5] px-4 py-3 text-sm font-bold text-white"
                >
                  Déconnexion
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    navigate('/connexion');
                    setMenuOpen(false);
                  }}
                  className="mt-2 rounded-lg bg-[#185FA5] px-4 py-3 text-sm font-bold text-white"
                >
                  Connexion
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;