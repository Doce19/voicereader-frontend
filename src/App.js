import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Accueil from './pages/Accueil';
import Connexion from './pages/Connexion';
import Bibliotheque from './pages/Bibliotheque';
import Lecteur from './pages/Lecteur';
import Parametres from './pages/Parametres';
import Abonnement from './pages/Abonnement';
import NotFound from './pages/NotFound';


function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/connexion" />;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/bibliotheque" element={
            <PrivateRoute><Bibliotheque /></PrivateRoute>
          } />
          <Route path="/lecteur/:id" element={
            <PrivateRoute><Lecteur /></PrivateRoute>
          } />
          <Route path="/parametres" element={
            <PrivateRoute><Parametres /></PrivateRoute>
          } />
          <Route path="/abonnement" element={
            <PrivateRoute><Abonnement /></PrivateRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;