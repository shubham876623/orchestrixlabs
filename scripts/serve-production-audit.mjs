/**
 * Serve dist/ with /api proxied to Railway — mirrors Vercel rewrite for local Lighthouse.
 * Usage: node scripts/serve-production-audit.mjs [port]
 */
import http from 'node:http'
import https from 'node:https'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const port = Number(process.argv[2] || 4173)
const API_ORIGIN = 'orchestrixlabsbackend-production.up.railway.app'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
  fs.createReadStream(filePath).pipe(res)
}

function proxyApi(req, res) {
  const opts = {
    hostname: API_ORIGIN,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: API_ORIGIN,
    },
  }
  delete opts.headers['accept-encoding']
  const upstream = https.request(opts, (up) => {
    res.writeHead(up.statusCode || 502, up.headers)
    up.pipe(res)
  })
  upstream.on('error', () => {
    res.writeHead(502, { 'Content-Type': 'text/plain' })
    res.end('Bad gateway')
  })
  req.pipe(upstream)
}

function resolveStatic(urlPath) {
  let clean
  try {
    clean = decodeURIComponent(urlPath.split('?')[0])
  } catch {
    return path.join(dist, 'index.html') // malformed %-escape: never crash the server
  }
  const root = path.resolve(dist)
  const candidates = [
    path.join(dist, clean),
    path.join(dist, clean, 'index.html'),
    path.join(dist, `${clean}.html`),
  ]
  for (const c of candidates) {
    const resolved = path.resolve(c)
    if (resolved !== root && !resolved.startsWith(root + path.sep)) continue // block ../ traversal out of dist
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) return resolved
  }
  return path.join(dist, 'index.html')
}

const server = http.createServer((req, res) => {
  const url = req.url || '/'
  if (url.startsWith('/api/')) {
    proxyApi(req, res)
    return
  }
  sendFile(res, resolveStatic(url === '/' ? '/index.html' : url))
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Audit server http://127.0.0.1:${port} (dist + /api → Railway)`)
})
