/**
 * Builds approved_public dist and asserts unpublished/internal content is absent,
 * while the 34 approved projects are present. Excludes factory.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { APPROVED_PUBLIC_PROJECTS } from '../src/data/portfolioApprovedProjects.js'
import { privateList } from './lib/privateDenylist.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distAssets = join(root, 'dist', 'assets')

const MUST_EXCLUDE = [
  'Factory Operations Automation Suite',
  'portfolioDraftCatalog',
  'DRAFT_ONLY_PROJECTS',
  'portfolioExpandedCards',
  'EXPANDED_PORTFOLIO_CARDS',
  ...privateList('test-production-bundle-privacy#1'),
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

let failed = 0
for (const marker of MUST_EXCLUDE) {
  const hit = blob.includes(marker)
  if (hit) failed += 1
  console.log(`${hit ? 'FAIL' : 'PASS'}  production bundle excludes: ${marker}`)
}

console.log(`Approved module source count: ${APPROVED_PUBLIC_PROJECTS.length}`)
for (const p of APPROVED_PUBLIC_PROJECTS) {
  const ok = blob.includes(p.slug)
  if (!ok) failed += 1
  console.log(`${ok ? 'PASS' : 'FAIL'}  production bundle keeps: ${p.slug}`)
}

console.log('---')
if (failed) {
  console.error(`VERDICT: ${failed} privacy/bundle check(s) failed`)
  process.exit(1)
}
if (APPROVED_PUBLIC_PROJECTS.length !== 34) {
  console.error('VERDICT: approved module is not exactly 34')
  process.exit(1)
}
console.log('VERDICT: production bundle contains exactly 34 approved projects and excludes factory/internal draft modules')
