/**
 * Ensures GPT export stays empty/pending while gptExportApproved is false,
 * and never contains forbidden confidential markers.
 */
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const knowledge = join(root, '..', 'portfolio-knowledge')
const outDir = join(knowledge, 'gpt-export')
const results = []

function assert(name, cond, detail = '') {
  results.push({ name, pass: Boolean(cond), detail })
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const run = spawnSync(process.execPath, [join(__dirname, 'export-gpt-proposal-knowledge.mjs')], {
  encoding: 'utf8',
})
assert('Exporter exits 0', run.status === 0, run.stderr?.slice(0, 200))

const manifest = JSON.parse(readFileSync(join(knowledge, 'publication-manifest.json'), 'utf8'))
const approved = (manifest.projects || []).filter((p) => p.gptExportApproved === true)
assert('No silent GPT approvals', approved.length === 0, `n=${approved.length}`)

assert('Pending report exists', existsSync(join(outDir, 'GPT_EXPORT_PENDING_APPROVAL.md')))
assert('Required GPT_UPWORK_PROPOSAL_KNOWLEDGE.md exists', existsSync(join(outDir, 'GPT_UPWORK_PROPOSAL_KNOWLEDGE.md')))
assert('Required GPT_PROJECT_EXPERIENCE.json exists', existsSync(join(outDir, 'GPT_PROJECT_EXPERIENCE.json')))
assert('Required GPT_SKILLS_AND_TECHNOLOGIES.md exists', existsSync(join(outDir, 'GPT_SKILLS_AND_TECHNOLOGIES.md')))
assert('Required GPT_VERIFIED_TESTIMONIALS.md exists', existsSync(join(outDir, 'GPT_VERIFIED_TESTIMONIALS.md')))
assert('Required GPT_PROPOSAL_INSTRUCTIONS.md exists', existsSync(join(outDir, 'GPT_PROPOSAL_INSTRUCTIONS.md')))

const exp = JSON.parse(readFileSync(join(outDir, 'GPT_PROJECT_EXPERIENCE.json'), 'utf8'))
assert('Export projects array empty while pending', Array.isArray(exp.projects) && exp.projects.length === 0)
assert('uploadAuthorized false', exp.uploadAuthorized === false || exp.status?.includes('PENDING'))

const blob = [
  readFileSync(join(outDir, 'GPT_EXPORT_PENDING_APPROVAL.md'), 'utf8'),
  readFileSync(join(outDir, 'GPT_UPWORK_PROPOSAL_KNOWLEDGE.md'), 'utf8'),
  readFileSync(join(outDir, 'GPT_VERIFIED_TESTIMONIALS.md'), 'utf8'),
  JSON.stringify(exp),
].join('\n')

const forbidden = [
  'Hunter Jonasen',
  'All Cleared Pty',
  'contracts.csv',
  'original_record',
  'hourly_rate',
  'FieldForge Partners',
  'Choices Flooring',
]
for (const n of forbidden) {
  assert(`GPT export excludes confidential marker: ${n}`, !blob.includes(n))
}

assert('Pending doc states zero approved', blob.includes('Approved for GPT export') && blob.includes('**0**'))

const failed = results.filter((r) => !r.pass).length
console.log('---')
console.log(`Results: ${results.length - failed}/${results.length} passed`)
if (failed) {
  console.error('VERDICT: FAILED')
  process.exit(1)
}
console.log('VERDICT: GPT export gate pending-safe')
