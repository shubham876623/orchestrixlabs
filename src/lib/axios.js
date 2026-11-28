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

/**
 * Backend origin for multipart uploads. Vercel's edge middleware accepts at most 4 MB of body,
 * so requests that carry a file go straight to Railway (CORS allows orchestrixlabs.com). Requests
 * without a file keep using the same-origin proxy, so preview deployments keep working.
 */
export const UPLOAD_API_ORIGIN = import.meta.env.PROD
  ? import.meta.env.VITE_UPLOAD_API_ORIGIN || 'https://orchestrixlabsbackend-production.up.railway.app'
  : ''

/** Submit the contact form; returns the API response. `file` is optional. */
export function submitContactRequest(fields, file, onProgress) {
  if (!file) return api.post('/api/contact/', fields)
  const body = new FormData()
  for (const [key, value] of Object.entries(fields)) body.append(key, value ?? '')
  body.append('attachment', file)
  return api.post(`${UPLOAD_API_ORIGIN}/api/contact/`, body, {
    onUploadProgress: (event) => {
      if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100))
    },
  })
}
