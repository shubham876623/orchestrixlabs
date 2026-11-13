/**
 * Builds (or scans existing) approved_public dist and asserts draft case-study
 * content is not present in JS bundles — hidden-by-UI is not enough.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distAssets = join(root, 'dist', 'assets')

const DRAFT_MARKERS = [
  'restaurant-voice-ordering',
  'hubspot-voice-lead-qualification',
  'twilio-outbound-call-center',
  'bilingual-hr-ai-assistant',
  'django-ecommerce-data-pipeline',
  'legacy-desktop-to-flask',
  'ml-background-removal',
  'healthcare-ops-sales-demo',
  'retail-flooring-automation-suite',
  'Multi-Tenant Restaurant Voice Ordering Platform',
  'illustrative demo data',
  'portfolioDraftCatalog',
  'DRAFT_ONLY_PROJECTS',
  'prj-2026-001',
  'prj-2026-009',
  'prj-2026-010',
  'Code-evidenced freelance delivery',
]

console.log('Building approved_public production bundle…')
const build = spawnSync(process.execPath, [join(root, 'scripts', 'build-production.mjs')], {
  cwd: root,
  stdio: 'inherit',
  shell: false,
})
if (build.status !== 0) {
  console.error('Production build failed')
  process.exit(1)
}

if (!existsSync(distAssets)) {
  console.error('dist/assets missing after build')
  process.exit(1)
}

const jsFiles = readdirSync(distAssets).filter((f) => f.endsWith('.js'))
let blob = ''
for (const f of jsFiles) {
  blob += readFileSync(join(distAssets, f), 'utf8')
}

const results = []
for (const marker of DRAFT_MARKERS) {
  const hit = blob.includes(marker)
  results.push({ marker, hit })
  console.log(`${hit ? 'FAIL' : 'PASS'}  production bundle excludes: ${marker}`)
}

// Approved public content may remain
const mustKeep = ['ai-estimating-field-ops', 'AI-Powered Estimating']
for (const marker of mustKeep) {
  const ok = blob.includes(marker)
  results.push({ marker, hit: !ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  production bundle keeps: ${marker}`)
}

const failed = results.filter((r) => r.hit).length
console.log('---')
if (failed) {
  console.error(`VERDICT: ${failed} privacy/bundle check(s) failed — draft content leaked into production bundle`)
  process.exit(1)
}
console.log('VERDICT: approved_public production bundle does not contain draft case-study module content')
