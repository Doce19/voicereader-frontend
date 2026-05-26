import React, { useState } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return { toasts, showToast };
}

export function ToastContainer({ toasts }) {
  const config = {
    success: {
      icon: 'check_circle',
      wrapper: 'border-emerald-500/30 bg-emerald-950/90 text-emerald-300',
      iconColor: 'text-emerald-400',
    },
    error: {
      icon: 'error',
      wrapper: 'border-[#FFB4AB]/30 bg-[#2D1515]/95 text-[#FFB4AB]',
      iconColor: 'text-[#FFB4AB]',
    },
    info: {
      icon: 'info',
      wrapper: 'border-[#185FA5]/50 bg-[#0C447C]/95 text-[#A4C9FF]',
      iconColor: 'text-[#A4C9FF]',
    },
    warning: {
      icon: 'warning',
      wrapper: 'border-amber-500/30 bg-amber-950/90 text-amber-300',
      iconColor: 'text-amber-300',
    },
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:w-auto">
      {toasts.map(toast => {
        const item = config[toast.type] || config.info;

        return (
          <div
            key={toast.id}
            className={`flex min-w-0 items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl shadow-black/30 backdrop-blur-md animate-[toastSlideIn_0.25s_ease-out] sm:min-w-[280px] ${item.wrapper}`}
          >
            <span className={`material-symbols-outlined mt-0.5 text-[21px] ${item.iconColor}`}>
              {item.icon}
            </span>
            <p className="leading-6">{toast.message}</p>
          </div>
        );
      })}

      <style>{`
        @keyframes toastSlideIn {
          from {
            transform: translateX(24px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}