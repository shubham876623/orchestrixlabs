/**
 * Vercel Edge Middleware: proxy same-origin /api/* → Railway Django.
 * vercel.json external rewrites were falling through to SPA/404 in production;
 * this keeps the browser on orchestrixlabs.com while forwarding to the backend.
 */
export const config = {
  matcher: '/api/:path*',
}

const BACKEND = 'https://orchestrixlabsbackend-production.up.railway.app'

// Header Vercel overwrites with the real visitor IP (confirm in docs/security/PROXY_TOPOLOGY.md).
const CLIENT_IP_HEADER = 'x-vercel-forwarded-for'
const STAMP_IP = 'x-orx-client-ip'
const STAMP_TOKEN = 'x-orx-edge-token'

function looksLikeIp(value) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(value) || (value.includes(':') && /^[0-9a-fA-F:.]+$/.test(value))
}

/**
 * Tell Django who the visitor is. Client-supplied stamp headers are always removed;
 * a fresh stamp is added only when the shared secret is configured, so Django can
 * trust x-orx-client-ip exactly when x-orx-edge-token matches EDGE_PROXY_SECRET.
 */
function stampClientIp(headers, incomingHeaders) {
  headers.delete(STAMP_IP)
  headers.delete(STAMP_TOKEN)
  const secret = process.env.EDGE_PROXY_SECRET
  const clientIp = (incomingHeaders.get(CLIENT_IP_HEADER) || '').split(',')[0].trim()
  if (secret && looksLikeIp(clientIp)) {
    headers.set(STAMP_IP, clientIp)
    headers.set(STAMP_TOKEN, secret)
  }
}

export default async function middleware(request) {
  const incoming = new URL(request.url)
  const target = `${BACKEND}${incoming.pathname}${incoming.search}`

  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.set('x-forwarded-host', incoming.host)
  headers.set('x-forwarded-proto', 'https')
  stampClientIp(headers, request.headers)

  const init = {
    method: request.method,
    headers,
    redirect: 'manual',
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body
    init.duplex = 'half'
  }

  return fetch(target, init)
}
