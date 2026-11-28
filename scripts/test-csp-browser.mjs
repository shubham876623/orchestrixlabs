/**
 * Serves dist/ with the exact headers from vercel.json and loads key pages in Chromium,
 * failing on any Content-Security-Policy violation or page error.
 * Usage: npm run build:production && node scripts/test-csp-browser.mjs
 */
import { createServer } from 'node:http'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const vercel = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'))
const globalHeaders = vercel.headers.find((h) => h.source === '/(.*)').headers
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml' }

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0])
  const candidates = [join(dist, clean), join(dist, clean, 'index.html'), join(dist, `${clean}.html`)]
  for (const c of candidates) {
    if (c.startsWith(dist) && existsSync(c) && statSync(c).isFile()) return c
  }
  return join(dist, 'index.html') // SPA rewrite, as vercel.json does
}

const server = createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(req.url.startsWith('/api/projects') ? '[]' : '{}')
    return
  }
  const file = resolveFile(req.url)
  for (const { key, value } of globalHeaders) res.setHeader(key, value)
  res.setHeader('content-type', TYPES[extname(file)] || 'application/octet-stream')
  res.end(readFileSync(file))
})

const PAGES = ['/', '/services', '/portfolio', '/about', '/contact', '/book', '/privacy-policy']

await new Promise((r) => server.listen(0, '127.0.0.1', r))
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch()
const failures = []
try {
  for (const consent of ['denied', 'granted']) {
    const context = await browser.newContext()
    await context.addInitScript((value) => localStorage.setItem('orch_analytics_consent', value), consent)
    const page = await context.newPage()
    page.on('console', (msg) => {
      if (/Content.Security.Policy|Refused to/i.test(msg.text())) failures.push(`[${consent}] ${page.url()} ${msg.text().slice(0, 200)}`)
    })
    page.on('pageerror', (err) => failures.push(`[${consent}] ${page.url()} pageerror ${String(err).slice(0, 200)}`))
    for (const path of PAGES) {
      await page.goto(base + path, { waitUntil: 'networkidle' }).catch((e) => failures.push(`${path} ${e.message}`))
    }
    await context.close()
  }
} finally {
  await browser.close()
  server.close()
}
if (failures.length) {
  console.log('FAIL\n' + failures.join('\n'))
  process.exit(1)
}
console.log(`PASS csp-browser (${PAGES.length} pages x 2 consent states, no CSP violations)`)
