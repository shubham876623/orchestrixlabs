/**
 * Post-Vite build: emit route-specific static HTML for public indexable pages.
 * Uses seoPages.js + publication-approved case studies (no Puppeteer / no dashboard).
 * Vercel serves these files before the SPA catch-all rewrite.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')
const indexPath = join(distDir, 'index.html')

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function absoluteTitle(title) {
  if (!title) return 'Orchestrix Labs'
  return title.includes('Orchestrix Labs') ? title : `${title} — Orchestrix Labs`
}

function replaceOrInsertMeta(html, { attr, key, content }) {
  const escaped = escapeHtml(content)
  const re = new RegExp(
    `<meta[^>]*${attr}=["']${key}["'][^>]*>`,
    'i'
  )
  const tag = `<meta data-rh="true" ${attr}="${key}" content="${escaped}" />`
  if (re.test(html)) return html.replace(re, tag)
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`)
}

function replaceTitle(html, title) {
  const escaped = escapeHtml(title)
  if (/<title[^>]*>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title data-rh="true">${escaped}</title>`)
  }
  return html.replace(/<\/head>/i, `    <title data-rh="true">${escaped}</title>\n  </head>`)
}

function replaceCanonical(html, href) {
  const escaped = escapeHtml(href)
  const tag = `<link data-rh="true" rel="canonical" href="${escaped}" />`
  if (/<link[^>]*rel=["']canonical["'][^>]*>/i.test(html)) {
    return html.replace(/<link[^>]*rel=["']canonical["'][^>]*>/i, tag)
  }
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`)
}

function injectRootShell(html, { h1, lead, path }) {
  const shell = `
    <div id="prerender-shell" data-prerender-path="${escapeHtml(path)}">
      <header>
        <p>Orchestrix Labs</p>
        <h1>${escapeHtml(h1)}</h1>
        <p>${escapeHtml(lead)}</p>
      </header>
      <nav aria-label="Primary">
        <a href="/">Home</a>
        <a href="/services">Services</a>
        <a href="/portfolio">Portfolio</a>
        <a href="/work-history">Work History</a>
        <a href="/about">About</a>
        <a href="/reviews">Reviews</a>
        <a href="/contact">Contact</a>
        <a href="/privacy-policy">Privacy Policy</a>
      </nav>
      <main>
        <p>${escapeHtml(lead)}</p>
        <p>
          Orchestrix Labs provides AI automation, voice agents, and custom software development
          for real-world operations. This page is available without JavaScript; the full interactive
          experience loads when available.
        </p>
      </main>
    </div>`

  return html.replace(
    /<div id="root"><\/div>/i,
    `<div id="root">${shell}\n    </div>`
  )
}

function applyPageSeo(html, page, siteUrl) {
  const fullTitle = absoluteTitle(page.title)
  const fullUrl = `${siteUrl}${page.path === '/' ? '/' : page.path}`
  const image = page.image || `${siteUrl}/og-image.jpg`

  let out = html
  out = replaceTitle(out, fullTitle)
  out = replaceOrInsertMeta(out, { attr: 'name', key: 'description', content: page.description })
  out = replaceOrInsertMeta(out, { attr: 'name', key: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' })
  out = replaceCanonical(out, fullUrl)
  out = replaceOrInsertMeta(out, { attr: 'property', key: 'og:title', content: fullTitle })
  out = replaceOrInsertMeta(out, { attr: 'property', key: 'og:description', content: page.description })
  out = replaceOrInsertMeta(out, { attr: 'property', key: 'og:url', content: fullUrl })
  out = replaceOrInsertMeta(out, { attr: 'property', key: 'og:image', content: image })
  out = replaceOrInsertMeta(out, { attr: 'property', key: 'og:type', content: 'website' })
  out = replaceOrInsertMeta(out, { attr: 'name', key: 'twitter:title', content: fullTitle })
  out = replaceOrInsertMeta(out, { attr: 'name', key: 'twitter:description', content: page.description })
  out = replaceOrInsertMeta(out, { attr: 'name', key: 'twitter:image', content: image })
  out = injectRootShell(out, page)
  return out
}

function outputPathForRoute(routePath) {
  if (routePath === '/') return join(distDir, 'index.html')
  return join(distDir, routePath.replace(/^\//, ''), 'index.html')
}

async function loadPages() {
  const seoMod = await import(pathToFileURL(join(root, 'src/lib/seoPages.js')).href)
  const approvedMod = await import(
    pathToFileURL(join(root, 'src/data/portfolioApprovedProjects.js')).href
  )
  const siteMod = await import(pathToFileURL(join(root, 'src/lib/site.js')).href)

  const staticPages = seoMod.PUBLIC_SEO_PAGES
  const caseStudies = (approvedMod.APPROVED_PUBLIC_PROJECTS || [])
    .filter((p) => p.publicationApproved === true && p.slug)
    .map((p) => seoMod.caseStudySeoPage(p))

  return {
    siteUrl: siteMod.SITE.url,
    pages: [...staticPages, ...caseStudies],
  }
}

async function main() {
  if (!existsSync(indexPath)) {
    console.error('prerender-routes: dist/index.html missing — run vite build first')
    process.exit(1)
  }

  const template = readFileSync(indexPath, 'utf8')
  const { siteUrl, pages } = await loadPages()

  let written = 0
  for (const page of pages) {
    const html = applyPageSeo(template, page, siteUrl)
    const outPath = outputPathForRoute(page.path)
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, html, 'utf8')
    written += 1
  }

  console.log(`prerender-routes: wrote ${written} HTML files (static + case studies)`)
}

main().catch((err) => {
  console.error('prerender-routes failed:', err)
  process.exit(1)
})
