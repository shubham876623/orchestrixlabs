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

function looksLikeHtml(data) {
  if (typeof data !== 'string') return false
  const head = data.trimStart().slice(0, 32).toLowerCase()
  return head.startsWith('<!doctype') || head.startsWith('<html')
}

api.interceptors.response.use(
  (response) => {
    const ct = String(response.headers?.['content-type'] || '')
    if (ct.includes('text/html') || looksLikeHtml(response.data)) {
      return Promise.reject(
        Object.assign(new Error('API proxy returned HTML instead of JSON'), {
          response: {
            status: 502,
            data: { detail: 'API proxy misconfigured' },
            headers: response.headers,
          },
          config: response.config,
          isAxiosError: true,
        }),
      )
    }
    return response
  },
  (error) => Promise.reject(error),
)

export default api
