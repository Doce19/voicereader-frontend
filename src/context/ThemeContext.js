import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  const toggleTheme = () => {
    setIsDark(prev => {
      localStorage.setItem('theme', !prev ? 'dark' : 'light');
      return !prev;
    });
  };

  const theme = {
    isDark,
    toggleTheme,
    bg: isDark ? '#0f1117' : '#f0f2f5',
    card: isDark ? '#161b27' : '#ffffff',
    border: isDark ? '#2a3148' : '#e2e8f0',
    text: isDark ? '#e8eaf0' : '#1a202c',
    textMuted: isDark ? '#8892a4' : '#64748b',
    nav: isDark ? '#161b27' : '#ffffff',
    input: isDark ? '#0f1117' : '#f8fafc',
    btnPrimary: '#185FA5',
    accent: '#378ADD',
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}