/**
 * Phase 8 UX / conversion / SEO regression checks (local).
 */
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import {
  getHomepageFeaturedProjects,
  getIndexableCaseStudySlugs,
  HOMEPAGE_FEATURED_SLUGS,
} from '../src/data/publishedProjects.js'
import { APPROVED_PUBLIC_PROJECTS } from '../src/data/portfolioApprovedProjects.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const results = []

function assert(name, cond, detail = '') {
  results.push({ name, pass: Boolean(cond), detail })
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

const homeSrc = readFileSync(join(root, 'src/pages/Home.jsx'), 'utf8')
const caseSrc = readFileSync(join(root, 'src/pages/PortfolioCaseStudy.jsx'), 'utf8')
const cardSrc = readFileSync(join(root, 'src/components/portfolio/ProjectCard.jsx'), 'utf8')
const ctaSrc = readFileSync(join(root, 'src/components/ConsultationCTA.jsx'), 'utf8')

assert('Home uses getHomepageFeaturedProjects', homeSrc.includes('getHomepageFeaturedProjects'))
assert('Home does not import GPT profiles', !homeSrc.includes('gpt-profiles') && !homeSrc.includes('phase7'))
assert('ConsultationCTA component exists', existsSync(join(root, 'src/components/ConsultationCTA.jsx')))
assert('Case study has Business challenge section', caseSrc.includes('Business challenge'))
assert('Case study has Solution overview section', caseSrc.includes('Solution overview'))
assert('Case study has Technical architecture section', caseSrc.includes('Technical architecture'))
assert('Case study has Engineering responsibilities section', caseSrc.includes('Engineering responsibilities'))
assert('Case study uses ConsultationCTA', caseSrc.includes('ConsultationCTA'))
assert('Project cards expose consult CTA', cardSrc.includes('Discuss a Similar Project'))
assert('CTA variants include automation', ctaSrc.includes('Explore Our AI Automation Work'))

const homepage = getHomepageFeaturedProjects({ mode: 'approved_public' })
assert('Homepage featured count is 5', homepage.length === 5, `n=${homepage.length}`)
assert('34 approved projects preserved', APPROVED_PUBLIC_PROJECTS.length === 34)
assert('10 indexable case studies preserved', getIndexableCaseStudySlugs().length === 10)
assert(
  'No GPT export fields flipped in approved module',
  !JSON.stringify(APPROVED_PUBLIC_PROJECTS).includes('"gptExportApproved":true')
)

for (const slug of HOMEPAGE_FEATURED_SLUGS) {
  assert(`Homepage slug approved: ${slug}`, homepage.some((p) => p.slug === slug))
}

const gates = spawnSync(process.execPath, [join(__dirname, 'test-publication-gate.mjs')], {
  encoding: 'utf8',
})
assert('Publication gates still pass', gates.status === 0)

const seo = spawnSync(process.execPath, [join(__dirname, 'test-prerender-seo.mjs')], {
  encoding: 'utf8',
})
assert('SEO prerender regression', seo.status === 0, seo.stderr?.slice(0, 180) || seo.stdout?.slice(-120))

const failed = results.filter((r) => !r.pass).length
console.log('---')
console.log(`Results: ${results.length - failed}/${results.length} passed`)
if (failed) {
  console.error('VERDICT: FAILED')
  process.exit(1)
}
console.log('VERDICT: Phase 8 UX gates OK')
