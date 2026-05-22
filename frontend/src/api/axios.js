/**
 * src/api/axios.js — Axios HTTP Client Configuration
 *
 * Axios is the HTTP library we use to call our backend API.
 * Instead of creating a new Axios instance in every component,
 * we configure one shared instance here and import it everywhere.
 *
 * What this configured instance does:
 *   1. Sets the base URL — so you write api.get('/feed') instead of
 *      api.get('http://localhost:5000/api/feed')
 *   2. Attaches the JWT token automatically to every request
 *      (via a "request interceptor" — runs before each request is sent)
 *   3. Handles 401 Unauthorized responses globally
 *      (via a "response interceptor" — runs after each response is received)
 *
 * Usage in components:
 *   import api from '../api/axios';
 *   const { data } = await api.get('/feed');
 *   const { data } = await api.post('/auth/login', { email, password });
 */

import axios from 'axios';

// Create a configured Axios instance
const api = axios.create({
  // Base URL for all requests — reads from .env
  // Falls back to the Vite proxy (/api) if VITE_API_URL is not set
  baseURL: import.meta.env.VITE_API_URL || '/api',

  headers: {
    'Content-Type': 'application/json',
  },
});

// ─────────────────────────────────────────────
// REQUEST INTERCEPTOR
// Runs before every request is sent.
// Reads the JWT from localStorage and adds it to the Authorization header.
// ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────
// RESPONSE INTERCEPTOR
// Runs after every response is received.
// If the server returns 401 (token expired/invalid), clear the
// stored token and redirect to login.
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response, // Pass through successful responses unchanged
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired — force logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
