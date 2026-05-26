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

    bg: isDark ? '#0F1117' : '#F4F7FB',
    card: isDark ? '#161B27' : '#FFFFFF',
    border: isDark ? '#2A3148' : '#DDE5F0',
    text: isDark ? '#E8EAF0' : '#172033',
    textMuted: isDark ? '#8892A4' : '#64748B',
    nav: isDark ? '#161B27' : '#FFFFFF',
    input: isDark ? '#0F1117' : '#F8FAFC',

    btnPrimary: '#185FA5',
    accent: '#378ADD',
    primary: '#A4C9FF',
    secondary: '#006FC0',
    danger: '#FFB4AB',
    dangerBorder: '#5A2020',
    success: '#4ADE80',
    warning: '#FBBF24',
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