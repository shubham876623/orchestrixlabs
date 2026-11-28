/**
 * Phase 7 pack integrity — no confidential markers, GPT flags stay false,
 * 34 profiles, shortlist present, publication gates unchanged.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { APPROVED_PUBLIC_PROJECTS } from '../src/data/portfolioApprovedProjects.js'
import { getIndexableCaseStudySlugs } from '../src/data/publishedProjects.js'
import { privateList } from './lib/privateDenylist.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const knowledge = join(root, '..', 'portfolio-knowledge')
const phase7 = join(knowledge, 'phase7')
const results = []

function assert(name, cond, detail = '') {
  results.push({ name, pass: Boolean(cond), detail })
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const build = spawnSync(process.execPath, [join(__dirname, 'build-phase7-approval-packs.mjs')], {
  encoding: 'utf8',
})
assert('Phase 7 builder exits 0', build.status === 0, build.stderr?.slice(0, 200))

assert('34 marketing projects preserved', APPROVED_PUBLIC_PROJECTS.length === 34)
assert('10 indexable case studies unchanged', getIndexableCaseStudySlugs().length === 10)

const profiles = readdirSync(join(phase7, 'gpt-profiles')).filter((f) => f.endsWith('.json'))
assert('34 GPT profiles generated', profiles.length === 34, `n=${profiles.length}`)

const registry = JSON.parse(readFileSync(join(phase7, 'gpt-approval-registry.json'), 'utf8'))
assert(
  'Registry all gptExportApproved false',
  registry.projects.every((p) => p.gptExportApproved === false)
)

const manifest = JSON.parse(readFileSync(join(knowledge, 'publication-manifest.json'), 'utf8'))
assert(
  'Manifest GPT approvals still false',
  (manifest.projects || []).every((p) => p.gptExportApproved !== true)
)

const shortlist = JSON.parse(readFileSync(join(phase7, 'gpt-approval-shortlist.json'), 'utf8'))
assert('Shortlist has 5–10 entries', shortlist.shortlist.length >= 5 && shortlist.shortlist.length <= 10)

const links = JSON.parse(readFileSync(join(phase7, 'contract-link-suggestions.json'), 'utf8'))
assert('Link suggestions require manual confirmation', links.suggestions.every((s) => s.requiresManualConfirmation))
assert('No auto-proposed contract IDs', links.suggestions.every((s) => (s.proposedContractIds || []).length === 0))
assert('Preserve 143 contracts note', links.preserveCounts?.privateContracts === 143)

const blob = [
  readFileSync(join(phase7, 'GPT_APPROVAL_SHORTLIST.md'), 'utf8'),
  readFileSync(join(phase7, 'gpt-profiles', 'ORX-ai-estimating-field-ops.json'), 'utf8'),
  JSON.stringify(registry),
  JSON.stringify(links),
].join('\n')

for (const bad of [
  ...privateList('test-phase7-packs#1'),
  'hourly_rate',
  'total_charges',
  ...privateList('test-phase7-packs#2'),
]) {
  assert(`Phase 7 packs exclude: ${bad}`, !blob.includes(bad))
}

assert('Dashboard preview doc exists', existsSync(join(phase7, 'PHASE7_DASHBOARD_PREVIEW.md')))
assert('Conversion audit exists', existsSync(join(phase7, 'PHASE7_WEBSITE_CONVERSION_AUDIT.md')))

const exportGate = spawnSync(process.execPath, [join(__dirname, 'test-gpt-export-gate.mjs')], {
  encoding: 'utf8',
})
assert('GPT export gate still pending-safe', exportGate.status === 0)

const gates = spawnSync(process.execPath, [join(__dirname, 'test-publication-gate.mjs')], {
  encoding: 'utf8',
})
assert('Publication gates unchanged', gates.status === 0)

const failed = results.filter((r) => !r.pass).length
console.log('---')
console.log(`Results: ${results.length - failed}/${results.length} passed`)
if (failed) {
  console.error('VERDICT: FAILED')
  process.exit(1)
}
console.log('VERDICT: Phase 7 packs + gates OK')
