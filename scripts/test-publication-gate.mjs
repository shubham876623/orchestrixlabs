/**
 * Publication-gate tests for 34-project approved release.
 * Excludes factory-automation-suite. Does not deploy.
 */
import {
  publishedProjects,
  PORTFOLIO_PUBLISH_MODE,
  getVisiblePublishedProjects,
  getPublishedProjectBySlug,
  getFeaturedPublishedProjects,
  getFeaturedCaseStudies,
  getHomepageFeaturedProjects,
  getAllProjectCards,
  getRelatedProjects,
  getPublicationApprovedSlugs,
  getIndexableCaseStudySlugs,
  isDraftPortfolioMode,
  DRAFT_LOADER_INCLUDES_CONTENT,
  HOMEPAGE_FEATURED_SLUGS,
} from '../src/data/publishedProjects.js'
import { APPROVED_PUBLIC_PROJECTS } from '../src/data/portfolioApprovedProjects.js'
import { DRAFT_ONLY_PROJECTS } from '../src/data/portfolioDraftCatalog.js'
import { EXPANDED_PORTFOLIO_CARDS } from '../src/data/portfolioExpandedCards.js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { privateList } from './lib/privateDenylist.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const results = []

function assert(name, condition, detail = '') {
  results.push({ name, pass: Boolean(condition), detail })
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
}

console.log('=== Portfolio gate tests ===')
console.log(`Active mode: ${PORTFOLIO_PUBLISH_MODE}`)

assert('Approved module has 34 projects', APPROVED_PUBLIC_PROJECTS.length === 34, `n=${APPROVED_PUBLIC_PROJECTS.length}`)
assert(
  'All approved rows are publicationApproved',
  APPROVED_PUBLIC_PROJECTS.every((p) => p.publicationApproved === true)
)
assert(
  ...privateList('test-publication-gate#1'),
  !APPROVED_PUBLIC_PROJECTS.some((p) => p.slug === 'factory-automation-suite')
)
assert('Draft module still has nine case-study modules', DRAFT_ONLY_PROJECTS.length === 9, `n=${DRAFT_ONLY_PROJECTS.length}`)

{
  const pubSrc = readFileSync(join(root, 'src/data/publishedProjects.js'), 'utf8')
  assert(
    'publishedProjects.js must not static-import portfolioDraftCatalog',
    !/import\s+[^;]*portfolioDraftCatalog/.test(pubSrc)
  )
}
assert('Node/Vite review loader includes draft content', DRAFT_LOADER_INCLUDES_CONTENT === true)

const productionVisible = getVisiblePublishedProjects({ mode: 'approved_public' })
assert('approved_public visible count === 34', productionVisible.length === 34, `visible=${productionVisible.length}`)
assert(
  'approved_public excludes factory',
  !productionVisible.some((p) => p.slug === 'factory-automation-suite')
)
assert(
  'approved_public ranks All Cleared first',
  productionVisible[0]?.slug === 'ai-estimating-field-ops'
)

const prodCards = getAllProjectCards({ mode: 'approved_public' })
assert('approved_public All Projects cards === 34', prodCards.length === 34, `n=${prodCards.length}`)

const featuredProd = getFeaturedCaseStudies({ mode: 'approved_public' })
assert('Production featured count === 9', featuredProd.length === 9, `n=${featuredProd.length}`)
assert('Production featured starts with All Cleared', featuredProd[0]?.slug === 'ai-estimating-field-ops')
assert(
  'Production featured excludes ML',
  !featuredProd.some((p) => p.slug === 'ml-background-removal')
)
assert(
  'Healthcare demo labeled in production featured',
  featuredProd.some((p) => p.slug === 'healthcare-ops-sales-demo' && p.demoOnly === true)
)

const homepageFeatured = getHomepageFeaturedProjects({ mode: 'approved_public' })
assert(
  'Homepage featured is 4–6 projects',
  homepageFeatured.length >= 4 && homepageFeatured.length <= 6,
  `n=${homepageFeatured.length}`
)
assert(
  'Homepage featured matches curated slug order',
  homepageFeatured.map((p) => p.slug).join(',') === HOMEPAGE_FEATURED_SLUGS.join(',')
)
assert(
  'Homepage featured excludes healthcare demo',
  !homepageFeatured.some((p) => p.slug === 'healthcare-ops-sales-demo')
)
assert(
  'Homepage featured all have full case studies',
  homepageFeatured.every((p) => p.hasCaseStudy === true && p.publicationApproved === true)
)
{
  const estimating = getPublishedProjectBySlug('ai-estimating-field-ops', { mode: 'approved_public' })
  assert(
    'Estimating relatedSlugs populated',
    Array.isArray(estimating?.relatedSlugs) && estimating.relatedSlugs.length >= 2
  )
}

const slugs = getPublicationApprovedSlugs()
assert('Listing helper has 34 publication-approved slugs', slugs.length === 34, `n=${slugs.length}`)
assert('Listing helper excludes factory', !slugs.includes('factory-automation-suite'))

const indexable = getIndexableCaseStudySlugs({ mode: 'approved_public' })
assert('Indexable case studies === 10', indexable.length === 10, `n=${indexable.length}`)
assert('Indexable includes flagship All Cleared', indexable.includes('ai-estimating-field-ops'))
assert('Indexable excludes card-only emma', !indexable.includes('emma-voice-receptionist'))
{
  const sitemap = readFileSync(join(root, 'public/sitemap.xml'), 'utf8')
  assert('Sitemap includes portfolio index', sitemap.includes('/portfolio</loc>'))
  assert('Sitemap includes flagship case study', sitemap.includes('/portfolio/ai-estimating-field-ops'))
  assert('Sitemap excludes card-only emma URL', !sitemap.includes('/portfolio/emma-voice-receptionist'))
  const portfolioPaths = [...sitemap.matchAll(/\/portfolio\/([^<]+)/g)].map((m) => m[1])
  assert('Sitemap portfolio slug count === 10', portfolioPaths.length === 10, `n=${portfolioPaths.length}`)
}

assert(
  'Case-study route resolves for All Cleared in production',
  getPublishedProjectBySlug('ai-estimating-field-ops', { mode: 'approved_public' })?.publicationApproved === true
)
assert(
  'Case-study route resolves for restaurant in production',
  getPublishedProjectBySlug('restaurant-voice-ordering', { mode: 'approved_public' })?.hasCaseStudy === true
)
assert(
  'Card-only emma has no case study in production',
  getPublishedProjectBySlug('emma-voice-receptionist', { mode: 'approved_public' })?.hasCaseStudy === false
)

const confidential = [
  ...privateList('test-publication-gate#2'),
  'Portfolio_Knowledge',
  '00_Company_Management',
  ...privateList('test-publication-gate#3'),
]
const approvedText = readFileSync(join(root, 'src/data/portfolioApprovedProjects.js'), 'utf8')
for (const needle of confidential) {
  assert(`Approved bundle excludes confidential: ${needle}`, !approvedText.includes(needle))
}

{
  const factoryCard = EXPANDED_PORTFOLIO_CARDS.find((c) => c.slug === 'factory-automation-suite')
  assert('Expanded catalog still 35 families', EXPANDED_PORTFOLIO_CARDS.length === 35)
  assert('Factory remains unpublished in expanded cards', factoryCard?.publicationApproved !== true)
  assert(
    ...privateList('test-publication-gate#4'),
    EXPANDED_PORTFOLIO_CARDS.filter((c) => c.publicationApproved === true).length === 34
  )
  const cardSrc = readFileSync(join(root, 'src/components/portfolio/ProjectCard.jsx'), 'utf8')
  assert('ProjectCard has no Draft preview label', !cardSrc.includes('Draft preview'))
}

if (PORTFOLIO_PUBLISH_MODE === 'content_review') {
  assert('Local content_review banner mode on', isDraftPortfolioMode() === true)
  const cards = getAllProjectCards()
  assert('content_review All Projects excludes held factory', cards.length === 34, `n=${cards.length}`)
  assert(
    'content_review publicationApproved cards === 34',
    cards.filter((p) => p.publicationApproved).length === 34
  )
  const featured = getFeaturedCaseStudies()
  assert('content_review featured count === 9', featured.length === 9, `n=${featured.length}`)
  assert('content_review featured All Cleared first', featured[0]?.slug === 'ai-estimating-field-ops')
} else if (PORTFOLIO_PUBLISH_MODE === 'approved_public') {
  assert('approved_public banner mode off', isDraftPortfolioMode() === false)
  assert('approved_public publishedProjects length === 34', publishedProjects.length === 34)
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
console.log('VERDICT: 34-project approved_public release candidate ready; factory excluded; TASK-023 deploy is separate')
