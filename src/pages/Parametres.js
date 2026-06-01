import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../services/api';
import { useTheme } from '../context/ThemeContext';

function Parametres() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [speed, setSpeed] = useState('1.0x');
  const [voice, setVoice] = useState('Feminine');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifNews, setNotifNews] = useState(true);
  const [notifReminder, setNotifReminder] = useState(false);
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || null);
  const fileInputRef = useRef(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [accountLoading, setAccountLoading] = useState(false);
  const [accountError, setAccountError] = useState('');
  const [accountSuccess, setAccountSuccess] = useState('');

  const Toggle = ({ value, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative h-7 w-12 rounded-full transition-all active:scale-95 ${
        value ? 'bg-[#185FA5]' : 'bg-[#32353A] ring-1 ring-[#424751]'
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
          value ? 'left-6' : 'left-1 bg-[#8C919C]'
        }`}
      />
    </button>
  );

  const PasswordInput = ({ value, onChange, placeholder, visible, onToggle }) => (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#2A3148] bg-[#0F1117] px-4 py-3 pr-12 text-sm text-[#E8EAF0] outline-none transition-all placeholder:text-[#5A6478] focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD]"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#8892A4] transition-colors hover:text-[#E8EAF0]"
      >
        <span className="material-symbols-outlined text-[20px]">
          {visible ? 'visibility_off' : 'visibility'}
        </span>
      </button>
    </div>
  );

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      localStorage.setItem('avatar', ev.target.result);
      setAvatar(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async () => {
    setAccountError('');
    setAccountSuccess('');
    setAccountLoading(true);

    try {
      await API.post('/auth/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
      });

      setAccountSuccess('Mot de passe modifié avec succès.');
      setOldPassword('');
      setNewPassword('');
      setShowPasswordModal(false);
    } catch (err) {
      setAccountError(err.response?.data?.detail || 'Erreur lors du changement de mot de passe');
    }

    setAccountLoading(false);
  };

  const handleDeleteAccount = async () => {
    setAccountError('');
    setAccountSuccess('');
    setAccountLoading(true);

    try {
      await API.delete('/auth/me');
      localStorage.removeItem('token');
      localStorage.removeItem('avatar');
      navigate('/connexion');
    } catch (err) {
      setAccountError(err.response?.data?.detail || 'Erreur lors de la suppression du compte');
    }

    setAccountLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-[#0F1117] text-[#E8EAF0] font-sans"
      style={{ background: theme.bg, color: theme.text }}
    >
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[#E8EAF0]">
            Paramètres
          </h1>
          <p className="mt-1 text-sm text-[#8892A4]">
            Gérez votre profil, vos préférences de lecture et vos notifications.
          </p>
        </header>

        {(accountError || accountSuccess) && (
          <div className="mb-6">
            {accountError && (
              <div className="rounded-lg border border-[#FFB4AB]/30 bg-[#93000A]/20 p-4 text-sm text-[#FFB4AB]">
                {accountError}
              </div>
            )}
            {accountSuccess && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-900/20 p-4 text-sm text-emerald-400">
                {accountSuccess}
              </div>
            )}
          </div>
        )}

        <section className="mb-6 rounded-xl border border-[#2A3148] bg-[#161B27] p-6 shadow-xl shadow-black/10">
          <div className="mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#A4C9FF]">account_circle</span>
            <h2 className="text-lg font-bold text-[#E8EAF0]">Profil Utilisateur</h2>
          </div>

          <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-[#185FA5] bg-[#2A3148]"
            >
              {avatar ? (
                <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[42px] text-[#8892A4]">
                  person
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="material-symbols-outlined text-white">photo_camera</span>
              </span>
            </button>

            <div>
              <p className="text-sm text-[#8892A4]">
                Cliquez pour changer votre photo de profil
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#185FA5] px-5 py-3 text-sm font-bold text-[#E8EAF0] transition-all hover:brightness-110 active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                Changer la photo
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="block text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                Nom d'utilisateur
              </span>
              <input
                className="w-full rounded-lg border border-[#2A3148] bg-[#0F1117] px-4 py-3 text-sm text-[#E8EAF0] outline-none transition-all focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD]"
                defaultValue="testuser"
              />
            </label>

            <label className="space-y-2">
              <span className="block text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                Email
              </span>
              <input
                className="w-full rounded-lg border border-[#2A3148] bg-[#0F1117] px-4 py-3 text-sm text-[#E8EAF0] outline-none transition-all focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD]"
                defaultValue="test@gmail.com"
              />
            </label>
          </div>

          <button className="mt-6 rounded-lg bg-[#185FA5] px-5 py-3 text-sm font-bold text-[#E8EAF0] transition-all hover:brightness-110 active:scale-95">
            Modifier le profil
          </button>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-xl border border-[#2A3148] bg-[#161B27] p-6 shadow-xl shadow-black/10">
            <div className="mb-5 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#A4C9FF]">palette</span>
              <h2 className="text-lg font-bold text-[#E8EAF0]">Apparence</h2>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border border-[#2A3148] bg-[#0F1117] p-4">
              <span className="text-sm text-[#C2C6D2]">
                Mode {theme.isDark ? 'Sombre' : 'Clair'}
              </span>
              <button
                type="button"
                onClick={theme.toggleTheme}
                className="inline-flex items-center gap-2 rounded-full bg-[#185FA5] px-4 py-2 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {theme.isDark ? 'dark_mode' : 'light_mode'}
                </span>
                {theme.isDark ? 'Sombre' : 'Clair'}
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-[#2A3148] bg-[#161B27] p-6 shadow-xl shadow-black/10">
            <div className="mb-5 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#A4C9FF]">auto_read_play</span>
              <h2 className="text-lg font-bold text-[#E8EAF0]">Préférences de Lecture</h2>
            </div>

            <div className="space-y-4">
              <label className="space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                  Vitesse par défaut
                </span>
                <select
                  className="w-full rounded-lg border border-[#2A3148] bg-[#0F1117] px-4 py-3 text-sm text-[#E8EAF0] outline-none transition-all focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD]"
                  value={speed}
                  onChange={e => setSpeed(e.target.value)}
                >
                  <option>0.5x</option>
                  <option>0.75x</option>
                  <option>1.0x</option>
                  <option>1.25x</option>
                  <option>1.5x</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                  Voix par défaut
                </span>
                <select
                  className="w-full rounded-lg border border-[#2A3148] bg-[#0F1117] px-4 py-3 text-sm text-[#E8EAF0] outline-none transition-all focus:border-[#378ADD] focus:ring-1 focus:ring-[#378ADD]"
                  value={voice}
                  onChange={e => setVoice(e.target.value)}
                >
                  <option value="Masculine">Masculine</option>
                  <option value="Feminine">Féminine</option>
                </select>
              </label>
            </div>

            <button className="mt-6 rounded-lg bg-[#185FA5] px-5 py-3 text-sm font-bold text-[#E8EAF0] transition-all hover:brightness-110 active:scale-95">
              Sauvegarder
            </button>
          </section>

          <section className="rounded-xl border border-[#2A3148] bg-[#161B27] p-6 shadow-xl shadow-black/10">
            <div className="mb-5 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#A4C9FF]">notifications_active</span>
              <h2 className="text-lg font-bold text-[#E8EAF0]">Notifications</h2>
            </div>

            <div className="divide-y divide-[#2A3148]">
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-[#C2C6D2]">Notifications par email</span>
                <Toggle value={notifEmail} onChange={setNotifEmail} />
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-[#C2C6D2]">Nouveautés et mises à jour</span>
                <Toggle value={notifNews} onChange={setNotifNews} />
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-sm text-[#C2C6D2]">Rappels de lecture</span>
                <Toggle value={notifReminder} onChange={setNotifReminder} />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#2A3148] bg-[#161B27] p-6 shadow-xl shadow-black/10">
            <div className="mb-5 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#A4C9FF]">manage_accounts</span>
              <h2 className="text-lg font-bold text-[#E8EAF0]">Compte</h2>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setAccountError('');
                  setAccountSuccess('');
                  setShowPasswordModal(true);
                }}
                className="group flex w-full items-center justify-between rounded-lg border border-[#2A3148] px-4 py-4 text-left text-sm text-[#E8EAF0] transition-colors hover:border-[#378ADD]"
              >
                <span>Changer le mot de passe</span>
                <span className="material-symbols-outlined text-[#8892A4] group-hover:text-[#A4C9FF]">
                  chevron_right
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAccountError('');
                  setAccountSuccess('');
                  setDeleteConfirm('');
                  setShowDeleteModal(true);
                }}
                className="group flex w-full items-center justify-between rounded-lg border border-[#5A2020] px-4 py-4 text-left text-sm text-[#FFB4AB] transition-colors hover:bg-[#93000A]/20"
              >
                <span>Supprimer le compte</span>
                <span className="material-symbols-outlined text-[#FFB4AB]">
                  delete_forever
                </span>
              </button>
            </div>
          </section>
        </div>
      </main>

      {showPasswordModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0F1117]/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#2A3148] bg-[#161B27] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#E8EAF0]">Changer le mot de passe</h2>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-[#8892A4] hover:text-[#E8EAF0]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                  Ancien mot de passe
                </span>
                <PasswordInput
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  placeholder="Ancien mot de passe"
                  visible={showOldPassword}
                  onToggle={() => setShowOldPassword(prev => !prev)}
                />
              </label>

              <label className="block space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                  Nouveau mot de passe
                </span>
                <PasswordInput
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  visible={showNewPassword}
                  onToggle={() => setShowNewPassword(prev => !prev)}
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="rounded-lg px-5 py-3 text-sm font-bold text-[#8892A4] hover:text-[#E8EAF0]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={accountLoading || !oldPassword || !newPassword}
                className="rounded-lg bg-[#185FA5] px-5 py-3 text-sm font-bold text-[#E8EAF0] disabled:opacity-50"
              >
                {accountLoading ? 'Modification...' : 'Modifier'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0F1117]/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#5A2020] bg-[#161B27] p-6 shadow-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#FFB4AB]">warning</span>
              <h2 className="text-xl font-bold text-[#E8EAF0]">Supprimer le compte</h2>
            </div>

            <p className="text-sm leading-6 text-[#C2C6D2]">
              Cette action est irréversible. Tous vos documents, signets et données liées au compte seront supprimés.
            </p>

            <label className="mt-5 block space-y-2">
              <span className="block text-xs font-semibold uppercase tracking-widest text-[#8892A4]">
                Tapez SUPPRIMER pour confirmer
              </span>
              <input
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                className="w-full rounded-lg border border-[#5A2020] bg-[#0F1117] px-4 py-3 text-sm text-[#E8EAF0] outline-none focus:border-[#FFB4AB]"
                placeholder="SUPPRIMER"
              />
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg px-5 py-3 text-sm font-bold text-[#8892A4] hover:text-[#E8EAF0]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={accountLoading || deleteConfirm !== 'SUPPRIMER'}
                className="rounded-lg border border-[#5A2020] bg-[#93000A]/30 px-5 py-3 text-sm font-bold text-[#FFB4AB] disabled:opacity-50"
              >
                {accountLoading ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Parametres;