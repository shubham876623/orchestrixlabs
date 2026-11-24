/**
 * Vercel Edge Middleware: proxy same-origin /api/* → Railway Django.
 * vercel.json external rewrites were falling through to SPA/404 in production;
 * this keeps the browser on orchestrixlabs.com while forwarding to the backend.
 */
export const config = {
  matcher: '/api/:path*',
}

const BACKEND = 'https://orchestrixlabsbackend-production.up.railway.app'

export default async function middleware(request) {
  const incoming = new URL(request.url)
  const target = `${BACKEND}${incoming.pathname}${incoming.search}`

  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.set('x-forwarded-host', incoming.host)
  headers.set('x-forwarded-proto', 'https')

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
