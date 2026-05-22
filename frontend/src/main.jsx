/**
 * src/main.jsx — React Application Entry Point
 *
 * This is the first file Vite loads when the app starts.
 * It renders the root React component (<App />) into the
 * #root div in index.html.
 *
 * Wrapped with:
 *   - <StrictMode>   — Highlights potential issues during development
 *   - <BrowserRouter> — Enables React Router (URL-based navigation)
 *   - <AuthProvider> — Provides global authentication state to all components
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import './index.css' // Global styles + Tailwind

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
