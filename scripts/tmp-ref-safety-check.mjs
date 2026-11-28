/**
 * Static verification of resolveSafeRefProject behavior via source contract + allowlist.
 * Does not hit network or mutate state.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const contact = fs.readFileSync(path.join(root, 'src/pages/Contact.jsx'), 'utf8')
const pub = fs.readFileSync(path.join(root, 'src/data/portfolioApprovedProjects.js'), 'utf8')

const checks = []
function assert(name, ok) {
  checks.push({ name, ok: !!ok })
}

assert('has resolveSafeRefProject', contact.includes('function resolveSafeRefProject'))
assert('decodeURIComponent', contact.includes('decodeURIComponent'))
assert('length gate > 80', contact.includes('decoded.length > 80'))
assert('slug charset regex', /\[\^a-z0-9\]\+\(\?:-\[a-z0-9\]\+\)\*/i.test(contact) || contact.includes('/^[a-z0-9]+(?:-[a-z0-9]+)*$/i'))
assert('publicationApproved gate', contact.includes('publicationApproved !== true'))
assert('title sanitize <>`', contact.includes(".replace(/[<>`]/g, '')"))
assert('title slice 120', contact.includes('.slice(0, 120)'))
assert('allowlisted slug present', pub.includes('"slug": "ai-estimating-field-ops"'))
assert('no raw searchParams in message without gate', !contact.includes('searchParams.get(\'ref\')') || contact.includes('resolveSafeRefProject(searchParams.get(\'ref\')'))

const failed = checks.filter((c) => !c.ok)
console.log(JSON.stringify({ passed: checks.filter((c) => c.ok).length, failed: failed.map((f) => f.name), checks }, null, 2))
process.exit(failed.length ? 1 : 0)
