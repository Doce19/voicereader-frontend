import axios from 'axios';

export const API_BASE_URL = 'https://Agnuod19-voicereader-backend.hf.space';

const API = axios.create({
  baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  const isAuthRoute =
    config.url?.includes('/auth/login') ||
    config.url?.includes('/auth/register');

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute =
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/register');

    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('token');
      window.location.href = '/connexion';
    }

    return Promise.reject(error);
  }
);

export default API;