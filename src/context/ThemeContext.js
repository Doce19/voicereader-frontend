import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const theme = {
    isDark: true,
    toggleTheme: () => {},

    bg: '#0F1117',
    card: '#161B27',
    border: '#2A3148',
    text: '#E8EAF0',
    textMuted: '#8892A4',
    nav: '#161B27',
    input: '#0F1117',

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