/** Unit checks for src/lib/siteSearch.js (run: node scripts/test-site-search.mjs). */
import { buildIndex, searchSite } from '../src/lib/siteSearch.js'

const results = []
const check = (name, ok) => results.push({ name, ok })

const index = buildIndex()
check('indexes pages, services and projects', ['Page', 'Service'].every((k) => index.some((e) => e.kind === k))
  && index.some((e) => e.kind === 'Case study' || e.kind === 'Project'))
check('every result path is a site-relative URL', index.every((e) => /^\/[a-z0-9/-]*$/.test(e.path)))
check('empty query returns nothing', searchSite('   ').length === 0)
check('"contact" finds the Contact page first', searchSite('contact')[0]?.path === '/contact')
check('"voice" finds voice projects', searchSite('voice').some((r) => r.path.startsWith('/portfolio/')))
check('multi-word query requires every word', searchSite('voice zzzznotaword').length === 0)
check('case and accents are ignored', searchSite('PRIVACY')[0]?.path === '/privacy-policy')
check('limit is respected', searchSite('a', 5).length <= 5)

for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}`)
const failed = results.filter((r) => !r.ok).length
console.log(failed ? `VERDICT: ${failed} failed` : `VERDICT: site search OK (${results.length} checks)`)
process.exit(failed ? 1 : 0)
