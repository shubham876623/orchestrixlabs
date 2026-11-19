import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { APPROVED_PUBLIC_PROJECTS } from '../../src/data/portfolioApprovedProjects.js'

export const INDEXNOW = {
  endpoint: 'https://api.indexnow.org/indexnow',
  host: 'orchestrixlabs.com',
  key: '68dc675035cd498b963ff03b4a83942f',
  get keyLocation() {
    return `https://${this.host}/${this.key}.txt`
  },
  get site() {
    return `https://${this.host}`
  },
}

const BLOCKED_PREFIXES = ['/dashboard', '/api/']
const BLOCKED_EXACT = new Set(['/dashboard'])

/** Source files whose edits imply a given route may have changed. */
const ROUTE_SOURCES = {
  '/': [
    'src/pages/Home.jsx',
    'src/lib/site.js',
    'index.html',
    'src/data/publishedProjects.js',
    'src/data/portfolioApprovedProjects.js',
  ],
  '/services': ['src/pages/Services.jsx', 'src/data/services.js', 'src/lib/site.js'],
  '/portfolio': [
    'src/pages/Portfolio.jsx',
    'src/data/publishedProjects.js',
    'src/data/portfolioApprovedProjects.js',
    'src/components/portfolio/ProjectCard.jsx',
  ],
  '/work-history': ['src/pages/PortfolioWorkHistory.jsx', 'src/data/projects.js'],
  '/about': ['src/pages/About.jsx', 'src/lib/site.js'],
  '/reviews': ['src/pages/Reviews.jsx'],
  '/contact': ['src/pages/Contact.jsx', 'src/lib/site.js'],
  '/privacy-policy': ['src/pages/PrivacyPolicy.jsx', 'src/lib/site.js'],
}

function portfolioSources(slug) {
  return [
    'src/pages/PortfolioCaseStudy.jsx',
    'src/data/publishedProjects.js',
    'src/data/portfolioApprovedProjects.js',
    `src/data/portfolioApprovedProjects.js#${slug}`,
  ]
}

export function pathFromUrl(url) {
  const u = new URL(url)
  const path = u.pathname.replace(/\/$/, '') || '/'
  return path
}

export function isEligibleUrl(url) {
  try {
    const u = new URL(url)
    if (u.protocol !== 'https:' || u.host !== INDEXNOW.host) return false
    const path = pathFromUrl(url)
    if (BLOCKED_EXACT.has(path) || BLOCKED_PREFIXES.some((p) => path.startsWith(p))) return false
    return true
  } catch {
    return false
  }
}

export function buildEligibleUrls() {
  const caseStudies = APPROVED_PUBLIC_PROJECTS.filter((p) => p.hasCaseStudy === true)
  const paths = [
    '/',
    '/services',
    '/portfolio',
    '/work-history',
    ...caseStudies.map((p) => `/portfolio/${p.slug}`),
    '/about',
    '/reviews',
    '/contact',
    '/privacy-policy',
  ]
  return [...new Set(paths.map((p) => (p === '/' ? `${INDEXNOW.site}/` : `${INDEXNOW.site}${p}`)))].filter(
    isEligibleUrl,
  )
}

function hashText(text) {
  return createHash('sha256').update(text).digest('hex')
}

function fileFingerprint(root, relPath) {
  if (relPath.includes('#')) {
    const [file, slug] = relPath.split('#')
    const abs = join(root, file)
    if (!existsSync(abs)) return `missing:${relPath}`
    const raw = readFileSync(abs, 'utf8')
    // Stable slice around slug presence so one project edit doesn't invalidate all case studies.
    const idx = raw.indexOf(`"slug": "${slug}"`)
    if (idx === -1) return hashText(`${relPath}:absent`)
    const slice = raw.slice(Math.max(0, idx - 200), idx + 4000)
    return hashText(slice)
  }
  const abs = join(root, relPath)
  if (!existsSync(abs)) return `missing:${relPath}`
  return hashText(readFileSync(abs))
}

export function fingerprintForUrl(root, url) {
  const path = pathFromUrl(url)
  let sources = ROUTE_SOURCES[path]
  if (!sources && path.startsWith('/portfolio/')) {
    const slug = path.slice('/portfolio/'.length)
    sources = portfolioSources(slug)
  }
  if (!sources) sources = ['public/sitemap.xml', 'src/lib/site.js']
  const parts = sources.map((s) => `${s}:${fileFingerprint(root, s)}`)
  return hashText(parts.join('|'))
}

export function buildUrlCatalog(root) {
  const urls = buildEligibleUrls()
  const entries = {}
  for (const url of urls) {
    entries[url] = { fingerprint: fingerprintForUrl(root, url) }
  }
  return { urls, entries }
}

/**
 * Diff current catalog against durable committed state.
 * Returns URLs that are new, changed, or removed (removed still notified via IndexNow).
 */
export function diffCatalog(currentEntries, previousEntries = {}) {
  const added = []
  const changed = []
  const removed = []
  const unchanged = []

  for (const [url, meta] of Object.entries(currentEntries)) {
    const prev = previousEntries[url]
    if (!prev) added.push(url)
    else if (prev.fingerprint !== meta.fingerprint) changed.push(url)
    else unchanged.push(url)
  }
  for (const url of Object.keys(previousEntries)) {
    if (!currentEntries[url] && isEligibleUrl(url)) removed.push(url)
  }

  return {
    added,
    changed,
    removed,
    unchanged,
    toSubmit: [...new Set([...added, ...changed, ...removed])],
  }
}
