import axios from 'axios'

/**
 * Same-origin `/api/*` only.
 * - Vite dev: proxy in vite.config.js
 * - Vercel prod: rewrite in vercel.json → Railway
 * Avoids browser CORS to Railway (was causing Best Practices console errors on non-prod origins).
 */
const api = axios.create({
  baseURL: '',
})

export default api
