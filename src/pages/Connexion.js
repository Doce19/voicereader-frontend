import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { useTheme } from '../context/ThemeContext';

function Connexion() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  setError('');
  setLoading(true);

  try {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.access_token);
    navigate('/bibliotheque');
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    console.error('STATUS:', err.response?.status);
    console.error('DATA:', err.response?.data);
    console.error('MESSAGE:', err.message);

    setError(
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      'Erreur de connexion'
    );
  }

  setLoading(false);
};

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await API.post('/auth/register', { email, username, password });
      setSuccess('Compte créé ! Vous pouvez vous connecter.');
      setMode('login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de l\'inscription');
    }
    setLoading(false);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#0F1117] text-[#E8EAF0] font-sans"
      style={{ background: theme.bg, color: theme.text }}
    >
      {/* <Navbar /> */}

      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
        <section className="w-full max-w-[440px]">
          <header className="mb-8 text-center">
            <div className="mb-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#185FA5]/20 text-[#A4C9FF] ring-1 ring-[#2A3148]">
                <span
                  className="material-symbols-outlined text-[34px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  headphones
                </span>
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#A4C9FF]">
              VoiceReader
            </h1>
            <p className="mt-1 text-sm text-[#8892A4]">
              PDF Audio Experience
            </p>
          </header>

          <div
            className="rounded-xl border border-[#2A3148] bg-[#161B27]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-8"
            style={{ background: theme.card, border: `1px solid ${theme.border}` }}
          >
            <nav className="mb-6 grid grid-cols-2 rounded-lg bg-[#0F1117] p-1 ring-1 ring-[#2A3148]">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-md px-4 py-3 text-sm font-bold transition-all active:scale-95 ${
                  mode === 'login'
                    ? 'bg-[#185FA5] text-[#E8EAF0] shadow-lg shadow-[#185FA5]/10'
                    : 'text-[#8892A4] hover:bg-[#32353A]/40 hover:text-[#E8EAF0]'
                }`}
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`rounded-md px-4 py-3 text-sm font-bold transition-all active:scale-95 ${
                  mode === 'register'
                    ? 'bg-[#185FA5] text-[#E8EAF0] shadow-lg shadow-[#185FA5]/10'
                    : 'text-[#8892A4] hover:bg-[#32353A]/40 hover:text-[#E8EAF0]'
                }`}
              >
                Inscription
              </button>
            </nav>

            <div className="mb-5 space-y-3">
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-[#FFB4AB]/30 bg-[#93000A]/20 p-4 text-sm text-[#FFB4AB]">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-900/20 p-4 text-sm text-emerald-400">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  <p>{success}</p>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                  Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[#8892A4]">
                    mail
                  </span>
                  <input
                    type="email"
                    placeholder="votremail@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-[#2A3148] bg-[#0F1117] py-3.5 pl-12 pr-4 text-sm text-[#E8EAF0] outline-none transition-all placeholder:text-[#5A6478] focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD]"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                    Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[#8892A4]">
                      person
                    </span>
                    <input
                      type="text"
                      placeholder="Nom"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full rounded-lg border border-[#2A3148] bg-[#0F1117] py-3.5 pl-12 pr-4 text-sm text-[#E8EAF0] outline-none transition-all placeholder:text-[#5A6478] focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD]"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                    Mot de passe
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      className="text-xs font-semibold text-[#A4C9FF] hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-[#8892A4]">
                    lock
                  </span>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-[#2A3148] bg-[#0F1117] py-3.5 pl-12 pr-4 text-sm text-[#E8EAF0] outline-none transition-all placeholder:text-[#5A6478] focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={mode === 'login' ? handleLogin : handleRegister}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-5 py-3.5 text-sm font-bold text-[#E8EAF0] shadow-lg shadow-[#185FA5]/10 transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#E8EAF0]/30 border-t-[#E8EAF0]" />
                )}
                {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer un compte'}
              </button>
            </div>
          </div>

          <footer className="mt-6 flex justify-center gap-6 text-sm text-[#8892A4]">
            <a className="hover:text-[#E8EAF0]" href="#">
              Confidentialité
            </a>
            <a className="hover:text-[#E8EAF0]" href="#">
              Conditions
            </a>
            <a className="hover:text-[#E8EAF0]" href="#">
              Support
            </a>
          </footer>
        </section>
      </main>

      <div className="pointer-events-none fixed left-[-10%] top-[-10%] -z-10 h-[360px] w-[360px] rounded-full bg-[#185FA5]/10 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] -z-10 h-[320px] w-[320px] rounded-full bg-[#006FC0]/10 blur-[120px]" />
    </div>
  );
}

export default Connexion;