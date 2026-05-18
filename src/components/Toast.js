import React, { useState, useEffect } from 'react';

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
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const colors = {
    success: { bg: '#0d2d1a', border: '#1a5c35', color: '#4ade80' },
    error: { bg: '#2d1515', border: '#5a2020', color: '#f87171' },
    info: { bg: '#0C447C', border: '#185FA5', color: '#85B7EB' },
    warning: { bg: '#2d2015', border: '#5a4020', color: '#fbbf24' },
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            background: colors[toast.type].bg,
            border: `1px solid ${colors[toast.type].border}`,
            color: colors[toast.type].color,
            padding: '12px 20px',
            borderRadius: '10px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: '260px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            animation: 'slideIn 0.3s ease',
          }}
        >
          <span>{icons[toast.type]}</span>
          <span>{toast.message}</span>
        </div>
      ))}
      <style>{`@keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}