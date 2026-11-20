/**
 * Validates prerendered public HTML: unique description, title, canonical, H1, lead content.
 * Does not deploy.
 */
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')

function fileFor(path) {
  if (path === '/') return join(distDir, 'index.html')
  return join(distDir, path.replace(/^\//, ''), 'index.html')
}

function countMatches(html, re) {
  return [...html.matchAll(re)].length
}

function decodeEntities(value) {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function metaContents(html, attr, key) {
  const re = new RegExp(`<meta[^>]*${attr}=["']${key}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'gi')
  const alt = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${key}["'][^>]*>`, 'gi')
  const values = []
  for (const m of html.matchAll(re)) values.push(decodeEntities(m[1]))
  for (const m of html.matchAll(alt)) values.push(decodeEntities(m[1]))
  return [...new Set(values)]
}

function fail(msg) {
  console.error(`FAIL: ${msg}`)
  process.exitCode = 1
}

async function main() {
  const seoMod = await import(pathToFileURL(join(root, 'src/lib/seoPages.js')).href)
  const approvedMod = await import(
    pathToFileURL(join(root, 'src/data/portfolioApprovedProjects.js')).href
  )

  // Align with prerender-routes.mjs / sitemap: only indexable case studies are emitted.
  const pages = [
    ...seoMod.PUBLIC_SEO_PAGES,
    ...(approvedMod.APPROVED_PUBLIC_PROJECTS || [])
      .filter((p) => p.publicationApproved === true && p.hasCaseStudy === true && p.slug)
      .map((p) => seoMod.caseStudySeoPage(p)),
  ]

  if (!existsSync(join(distDir, 'index.html'))) {
    fail('dist/index.html missing — run npm run build:production first')
    return
  }

  // Dashboard must never be prerendered
  if (existsSync(join(distDir, 'dashboard', 'index.html'))) {
    fail('dashboard was prerendered — must remain SPA-only / noindex')
  }

  let checked = 0
  for (const page of pages) {
    const file = fileFor(page.path)
    if (!existsSync(file)) {
      fail(`missing prerender file for ${page.path} → ${file}`)
      continue
    }
    const html = readFileSync(file, 'utf8')
    const descs = metaContents(html, 'name', 'description')
    if (descs.length !== 1) {
      fail(`${page.path}: expected 1 meta description, found ${descs.length}`)
    } else if (descs[0] !== page.description) {
      fail(`${page.path}: description mismatch`)
    } else if (descs[0].length < 110 || descs[0].length > 170) {
      console.warn(`WARN: ${page.path}: description length ${descs[0].length} (ideal ~140–160)`)
    }

    if (!/<title[^>]*>[\s\S]*?<\/title>/i.test(html)) fail(`${page.path}: missing title`)
    if (!/<link[^>]*rel=["']canonical["']/i.test(html)) fail(`${page.path}: missing canonical`)
    if (countMatches(html, /<h1[\s>]/gi) < 1) fail(`${page.path}: missing H1`)
    if (!html.includes(escapeSnippet(page.h1))) fail(`${page.path}: H1 text not in initial HTML`)
    if (!html.includes(`data-prerender-path="${page.path}"`)) {
      fail(`${page.path}: missing prerender path marker`)
    }
    // Ensure homepage H1 is not stamped onto other routes
    if (page.path !== '/') {
      const homeH1 = seoMod.PUBLIC_SEO_PAGES[0].h1
      if (html.includes(escapeSnippet(homeH1))) {
        fail(`${page.path}: contains homepage H1 fallback (must be route-specific)`)
      }
    }
    checked += 1
  }

  if (!process.exitCode) {
    console.log(`test-prerender-seo: PASS (${checked} routes)`)
  }
}

function escapeSnippet(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
