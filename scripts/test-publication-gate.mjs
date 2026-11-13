/**
 * Publication-gate + content-review tests.
 * Does not deploy. Does not flip publication approvals.
 */
import {
  publishedProjects,
  PORTFOLIO_PUBLISH_MODE,
  getVisiblePublishedProjects,
  getPublishedProjectBySlug,
  getFeaturedPublishedProjects,
  getRelatedProjects,
  getPublicationApprovedSlugs,
  isPublicationApproved,
  isDraftPortfolioMode,
  DRAFT_LOADER_INCLUDES_CONTENT,
} from '../src/data/publishedProjects.js'
import { APPROVED_PUBLIC_PROJECTS } from '../src/data/portfolioApprovedProjects.js'
import { DRAFT_ONLY_PROJECTS } from '../src/data/portfolioDraftCatalog.js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const results = []

function assert(name, condition, detail = '') {
  results.push({ name, pass: Boolean(condition), detail })
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

console.log('=== Portfolio gate tests ===')
console.log(`Active mode: ${PORTFOLIO_PUBLISH_MODE}`)

assert('Approved module has exactly one project', APPROVED_PUBLIC_PROJECTS.length === 1)
assert('Draft module has exactly nine projects', DRAFT_ONLY_PROJECTS.length === 9, `n=${DRAFT_ONLY_PROJECTS.length}`)
{
  const pubSrc = readFileSync(join(root, 'src/data/publishedProjects.js'), 'utf8')
  assert(
    'publishedProjects.js must not static-import portfolioDraftCatalog',
    !/import\s+[^;]*portfolioDraftCatalog/.test(pubSrc)
  )
}
assert(
  'Node/Vite review loader includes draft content for local content_review',
  DRAFT_LOADER_INCLUDES_CONTENT === true
)

const prj005 = APPROVED_PUBLIC_PROJECTS.find((p) => p.osRecordId === 'PRJ-2026-005')
assert('PRJ-2026-005 publicationApproved true', prj005?.publicationApproved === true)
assert('PRJ-2026-005 relatedSlugs empty (no draft exposure in approved module)', Array.isArray(prj005?.relatedSlugs) && prj005.relatedSlugs.length === 0)

for (const row of DRAFT_ONLY_PROJECTS) {
  assert(`${row.osRecordId} publicationApproved false`, row.publicationApproved === false)
  assert(`${row.osRecordId} has businessChallenge`, Boolean(row.businessChallenge))
  assert(`${row.osRecordId} has responsibilities`, Array.isArray(row.responsibilities) && row.responsibilities.length > 0)
  assert(`${row.osRecordId} has features`, Array.isArray(row.features) && row.features.length > 0)
}

const productionVisible = getVisiblePublishedProjects({ mode: 'approved_public' })
assert('approved_public visible count === 1', productionVisible.length === 1, `visible=${productionVisible.length}`)
assert('approved_public only All Cleared', productionVisible[0]?.osRecordId === 'PRJ-2026-005')

for (const row of DRAFT_ONLY_PROJECTS) {
  assert(
    `approved_public hides draft slug: ${row.slug}`,
    getPublishedProjectBySlug(row.slug, { mode: 'approved_public' }) === null
  )
}

const reviewVisible = getVisiblePublishedProjects({ mode: 'content_review' })
assert('content_review visible count === 10', reviewVisible.length === 10, `visible=${reviewVisible.length}`)
assert('content_review ranks All Cleared first', reviewVisible[0]?.osRecordId === 'PRJ-2026-005')
assert(
  'content_review publicationApproved count === 1',
  reviewVisible.filter((p) => p.publicationApproved).length === 1
)

assert(
  'Case-study route resolves for approved slug in production mode',
  getPublishedProjectBySlug('ai-estimating-field-ops', { mode: 'approved_public' })?.osRecordId === 'PRJ-2026-005'
)
assert(
  'Case-study route resolves for draft slug in content_review',
  getPublishedProjectBySlug('restaurant-voice-ordering', { mode: 'content_review' })?.osRecordId === 'PRJ-2026-001'
)

const featuredProd = getFeaturedPublishedProjects({ mode: 'approved_public' })
assert('Production featured count === 1', featuredProd.length === 1)

const slugs = getPublicationApprovedSlugs()
assert('Sitemap helper has exactly one publication-approved slug', slugs.length === 1 && slugs[0] === 'ai-estimating-field-ops', JSON.stringify(slugs))

const sitemap = readFileSync(join(root, 'public/sitemap.xml'), 'utf8')
assert('Sitemap includes approved case-study URL', sitemap.includes('/portfolio/ai-estimating-field-ops'))
for (const row of DRAFT_ONLY_PROJECTS) {
  assert(`Sitemap excludes draft slug: ${row.slug}`, !sitemap.includes(row.slug))
}

const confidential = ['Hunter Jonasen', 'All Cleared Pty', 'Portfolio_Knowledge', '00_Company_Management', 'contracts.csv', 'Hessah', 'Leonidas', 'Mitchell Pollock', 'FieldForge Partners']
const approvedText = readFileSync(join(root, 'src/data/portfolioApprovedProjects.js'), 'utf8')
const draftText = readFileSync(join(root, 'src/data/portfolioDraftCatalog.js'), 'utf8')
for (const needle of confidential) {
  assert(`Approved bundle excludes confidential: ${needle}`, !approvedText.includes(needle))
  assert(`Draft catalog excludes confidential: ${needle}`, !draftText.includes(needle))
}

if (PORTFOLIO_PUBLISH_MODE === 'content_review') {
  assert('Local content_review banner mode on', isDraftPortfolioMode() === true)
  assert('Local publishedProjects includes drafts', publishedProjects.length === 10, `n=${publishedProjects.length}`)
  const related = getRelatedProjects(getPublishedProjectBySlug('restaurant-voice-ordering'))
  assert('Draft related projects resolve in content_review', related.length > 0, `related=${related.length}`)
} else if (PORTFOLIO_PUBLISH_MODE === 'approved_public') {
  assert('approved_public banner mode off', isDraftPortfolioMode() === false)
  assert('approved_public publishedProjects length === 1', publishedProjects.length === 1)
  assert('Related empty for approved-only All Cleared', getRelatedProjects(prj005).length === 0)
} else {
  assert(`Unexpected mode ${PORTFOLIO_PUBLISH_MODE}`, false)
}

const failed = results.filter((r) => !r.pass).length
console.log('---')
console.log(`Results: ${results.length - failed}/${results.length} passed`)
if (failed) {
  console.error('VERDICT: FAILED')
  process.exit(1)
}
console.log('VERDICT: Local content_review ready; approved_public still gates to PRJ-2026-005 only; TASK-023 remains blocked')
