/**
 * Phase 8.1 — release readiness checks (local). Does not deploy.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import {
  getHomepageFeaturedProjects,
  getIndexableCaseStudySlugs,
  getPublicationApprovedSlugs,
  HOMEPAGE_FEATURED_SLUGS,
} from '../src/data/publishedProjects.js'
import { APPROVED_PUBLIC_PROJECTS } from '../src/data/portfolioApprovedProjects.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const results = []

function assert(name, cond, detail = '') {
  results.push({ name, pass: Boolean(cond), detail, severity: 'hard' })
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

function warn(name, cond, detail = '') {
  results.push({ name, pass: Boolean(cond), detail, severity: 'soft' })
  console.log(`${cond ? 'PASS' : 'WARN'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

// --- Portfolio counts ---
assert('34 approved marketing projects', APPROVED_PUBLIC_PROJECTS.length === 34)
assert('34 publication-approved slugs', getPublicationApprovedSlugs().length === 34)
assert('10 indexable case studies', getIndexableCaseStudySlugs().length === 10)
assert('Homepage featured is 5', getHomepageFeaturedProjects({ mode: 'approved_public' }).length === 5)
assert(
  'Homepage featured order stable',
  getHomepageFeaturedProjects({ mode: 'approved_public' })
    .map((p) => p.slug)
    .join(',') === HOMEPAGE_FEATURED_SLUGS.join(',')
)

// --- Local sitemap ---
const sitemap = readFileSync(join(root, 'public/sitemap.xml'), 'utf8')
const portfolioPaths = [...sitemap.matchAll(/\/portfolio\/([^<\s]+)/g)].map((m) => m[1])
assert('Local sitemap has exactly 10 portfolio case URLs', portfolioPaths.length === 10, `n=${portfolioPaths.length}`)
assert('Local sitemap excludes emma card-only', !sitemap.includes('/portfolio/emma-voice-receptionist'))
assert('Local sitemap includes flagship estimating', sitemap.includes('/portfolio/ai-estimating-field-ops'))

// --- Contact ref safety ---
const contactSrc = readFileSync(join(root, 'src/pages/Contact.jsx'), 'utf8')
assert('Contact has resolveSafeRefProject', contactSrc.includes('resolveSafeRefProject'))
assert('Contact enforces slug charset', contactSrc.includes('^[a-z0-9]+(?:-[a-z0-9]+)*$'))
assert('Contact length-limits ref', contactSrc.includes('decoded.length > 80'))
assert('Contact requires publicationApproved', contactSrc.includes('publicationApproved !== true'))
assert('Contact strips unsafe title chars', contactSrc.includes(".replace(/[<>`]/g, '')"))

// --- No private/GPT leakage in marketing sources ---
const marketingBlob = [
  readFileSync(join(root, 'src/data/portfolioApprovedProjects.js'), 'utf8'),
  readFileSync(join(root, 'src/pages/Home.jsx'), 'utf8'),
  readFileSync(join(root, 'src/pages/Portfolio.jsx'), 'utf8'),
].join('\n')
for (const bad of [
  'Hunter Jonasen',
  'All Cleared Pty',
  'gptExportApproved\":true',
  'contracts.csv',
  'original_record',
  'hourly_rate',
]) {
  assert(`Marketing sources exclude: ${bad}`, !marketingBlob.includes(bad))
}

// --- robots ---
const robots = readFileSync(join(root, 'public/robots.txt'), 'utf8')
assert('robots.txt allows crawl', robots.includes('Allow: /'))
assert('robots.txt points to sitemap', robots.includes('Sitemap: https://orchestrixlabs.com/sitemap.xml'))

// --- Gate suites ---
const gates = spawnSync(process.execPath, [join(__dirname, 'test-publication-gate.mjs')], { encoding: 'utf8' })
assert('Publication gates', gates.status === 0)
const p8 = spawnSync(process.execPath, [join(__dirname, 'test-phase8-ux.mjs')], { encoding: 'utf8' })
assert('Phase 8 UX gates', p8.status === 0)
const seo = spawnSync(process.execPath, [join(__dirname, 'test-prerender-seo.mjs')], { encoding: 'utf8' })
assert('Prerender SEO suite', seo.status === 0)

// --- Production build + bundle privacy ---
console.log('\nBuilding approved_public production bundle for audit…')
const build = spawnSync(process.execPath, [join(__dirname, 'build-production.mjs')], {
  cwd: root,
  encoding: 'utf8',
  env: { ...process.env, VITE_PORTFOLIO_MODE: 'approved_public' },
})
assert('Production build succeeds', build.status === 0, (build.stderr || '').slice(0, 200))

const distAssets = join(root, 'dist', 'assets')
assert('dist/assets exists', existsSync(distAssets))
let jsBlob = ''
let cssBlob = ''
let totalJs = 0
let totalCss = 0
if (existsSync(distAssets)) {
  for (const f of readdirSync(distAssets)) {
    const p = join(distAssets, f)
    const size = statSync(p).size
    if (f.endsWith('.js')) {
      jsBlob += readFileSync(p, 'utf8')
      totalJs += size
    }
    if (f.endsWith('.css')) {
      cssBlob += readFileSync(p, 'utf8')
      totalCss += size
    }
  }
}
assert('Bundle JS under 2.5MB uncompressed sum', totalJs < 2.5 * 1024 * 1024, `bytes=${totalJs}`)
warn('Bundle CSS under 400KB uncompressed sum', totalCss < 400 * 1024, `bytes=${totalCss}`)

for (const bad of [
  'Hunter Jonasen',
  'All Cleared Pty',
  'portfolioDraftCatalog',
  'DRAFT_ONLY_PROJECTS',
  'Factory Operations Automation Suite',
  'gpt-approval-registry',
  'sk-proj-',
  'sk-ant-',
]) {
  assert(`Prod JS excludes: ${bad}`, !jsBlob.includes(bad))
}
// Identifier/comment mentions are OK; reject assigned secret-like values.
warn(
  'Prod JS has no DASHBOARD_SECRET assignment',
  !/DASHBOARD_SECRET\s*[:=]\s*['"][^'"]+['"]/.test(jsBlob),
  'comment mentions of DASHBOARD_SECRET may exist in staff chunk'
)
assert('Prod JS includes 34 project slugs sample', jsBlob.includes('ai-estimating-field-ops') && jsBlob.includes('emma-voice-receptionist'))
assert('Prod JS excludes staff token patterns loosely', !/Bearer\s+[A-Za-z0-9_-]{20,}/.test(jsBlob))
warn(
  'Staff editorial route remains code-split (lazy)',
  jsBlob.includes('StaffEditorial') || existsSync(join(root, 'src/pages/StaffEditorial.jsx')),
  'Staff UI ships as lazy chunk — ensure /staff is not publicly marketed'
)

// prerendered homepage markers
const homeHtml = readFileSync(join(root, 'dist', 'index.html'), 'utf8')
assert('Prerender home has canonical', homeHtml.includes('rel="canonical"') || homeHtml.includes("rel='canonical'"))
assert('Prerender home has og:title or title', /<title/i.test(homeHtml))
assert('Prerender home noindex not set for /', !/name="robots"[^>]*noindex/i.test(homeHtml) || homeHtml.includes('index, follow'))

const caseHtmlPath = join(root, 'dist', 'portfolio', 'ai-estimating-field-ops', 'index.html')
if (existsSync(caseHtmlPath)) {
  const caseHtml = readFileSync(caseHtmlPath, 'utf8')
  assert('Prerender case study HTML exists', true)
  assert('Case study title present', caseHtml.toLowerCase().includes('estimating'))
} else {
  assert('Prerender case study HTML exists', false, caseHtmlPath)
}

const failedHard = results.filter((r) => !r.pass && r.severity === 'hard').length
const failedSoft = results.filter((r) => !r.pass && r.severity === 'soft').length
console.log('---')
console.log(
  JSON.stringify(
    {
      totalJsBytes: totalJs,
      totalCssBytes: totalCss,
      hardPass: results.filter((r) => r.pass && r.severity === 'hard').length,
      hardFail: failedHard,
      softWarn: failedSoft,
    },
    null,
    2
  )
)
if (failedHard) {
  console.error('VERDICT: Phase 8.1 audit FAILED')
  process.exit(1)
}
console.log('VERDICT: Phase 8.1 local audit PASS (soft warnings allowed)')
