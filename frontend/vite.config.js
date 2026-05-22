import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * vite.config.js — Vite build tool configuration
 *
 * Key setting: server.proxy
 * During development, any request to /api/* from the React app
 * is automatically forwarded to the backend on port 5000.
 * This avoids CORS issues during development and means we don't
 * need to include the full backend URL in every API call.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // React dev server port
    proxy: {
      // Proxy /api/* to the backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
