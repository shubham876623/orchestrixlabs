/**
 * Promote the authorized 34 catalog projects into portfolioApprovedProjects.js.
 * Excludes #17 factory-automation-suite. Does not deploy.
 */
import { writeFileSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { EXPANDED_PORTFOLIO_CARDS } from '../src/data/portfolioExpandedCards.js'
import { DRAFT_ONLY_PROJECTS } from '../src/data/portfolioDraftCatalog.js'
import { APPROVED_PUBLIC_PROJECTS } from '../src/data/portfolioApprovedProjects.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BLOCKED_SLUG = 'factory-automation-suite'
const draftBySlug = new Map(DRAFT_ONLY_PROJECTS.map((p) => [p.slug, p]))
const existingAllCleared = APPROVED_PUBLIC_PROJECTS.find((p) => p.slug === 'ai-estimating-field-ops')

const approvedCards = EXPANDED_PORTFOLIO_CARDS.filter((c) => c.slug !== BLOCKED_SLUG)
if (approvedCards.length !== 34) {
  console.error('Expected 34 approved cards, got', approvedCards.length)
  process.exit(1)
}

function stripInternal(obj) {
  const clone = { ...obj }
  delete clone.clarification
  delete clone.holdPublicationUntil
  delete clone.publishReady
  delete clone.evidenceStatus
  delete clone.techConflictNote
  delete clone.featuresNote
  delete clone.integrationsNote
  delete clone.outcomesNote
  // Keep confidentiality out of production public objects
  delete clone.confidentiality
  return clone
}

const promoted = approvedCards.map((card) => {
  const draft = draftBySlug.get(card.slug)
  const isFlagship = card.slug === 'ai-estimating-field-ops'

  if (isFlagship && existingAllCleared) {
    return {
      ...existingAllCleared,
      summary: card.summary,
      techCandidates: card.techCandidates,
      deliveryStatus: card.deliveryStatus,
      coverTone: card.coverTone || existingAllCleared.coverTone,
      featured: true,
      flagshipRank: 1,
      hasCaseStudy: true,
      publicationApproved: true,
      inventoryRef: card.inventoryRef,
      demoOnly: false,
    }
  }

  if (draft) {
    const related = (draft.relatedSlugs || []).filter((s) =>
      approvedCards.some((c) => c.slug === s)
    )
    return stripInternal({
      ...draft,
      title: card.title,
      summary: card.summary,
      primaryCategory: card.primaryCategory,
      categories: card.categories,
      techCandidates: card.techCandidates,
      deliveryStatus: card.deliveryStatus,
      coverTone: card.coverTone,
      demoOnly: !!card.demoOnly,
      capabilities: card.capabilities || undefined,
      featured: !!card.featuredWave,
      flagshipRank: card.flagshipRank || null,
      hasCaseStudy: true,
      publicationApproved: true,
      verificationStatus: 'published',
      inventoryRef: card.inventoryRef,
      relatedSlugs: related,
      techPendingVerification: false,
      images: [],
    })
  }

  // Card-only public entry
  return stripInternal({
    id: card.id,
    slug: card.slug,
    title: card.title,
    primaryCategory: card.primaryCategory,
    categories: card.categories,
    summary: card.summary,
    techCandidates: card.techCandidates,
    deliveryStatus: card.deliveryStatus,
    coverTone: card.coverTone,
    demoOnly: !!card.demoOnly,
    capabilities: card.capabilities || undefined,
    featured: !!card.featuredWave,
    flagshipRank: card.flagshipRank || null,
    hasCaseStudy: false,
    publicationApproved: true,
    verificationStatus: 'published',
    inventoryRef: card.inventoryRef,
    engagementType: 'freelance_client',
    engagementLabel: 'Founder freelance engagement',
    relatedSlugs: [],
    images: [],
    techPendingVerification: false,
  })
})

promoted.sort((a, b) => (a.flagshipRank ?? 99) - (b.flagshipRank ?? 99) || a.title.localeCompare(b.title))

const outPath = join(root, 'src/data/portfolioApprovedProjects.js')
const body = `/** Publication-approved projects shipped in approved_public builds.\n * Generated for 34-project release. Excludes factory-automation-suite (#17).\n */\nexport const APPROVED_PUBLIC_PROJECTS = ${JSON.stringify(promoted, null, 2)}\n`
writeFileSync(outPath, body)

// Flip expanded card flags for the 34; keep factory false
let cardsSrc = readFileSync(join(root, 'src/data/portfolioExpandedCards.js'), 'utf8')
// Set all publicationApproved: false -> true except leave factory block as-is by rewriting via regenerate note
// Safer: programmatic rewrite of the module by re-exporting isn't needed; patch each approved slug's flag in source.
for (const card of approvedCards) {
  const needle = `slug: '${card.slug}'`
  const idx = cardsSrc.indexOf(needle)
  if (idx < 0) continue
  // Find publicationApproved near this slug (within next 800 chars)
  const slice = cardsSrc.slice(idx, idx + 900)
  const replaced = slice.replace(/publicationApproved:\s*false/, 'publicationApproved: true')
  cardsSrc = cardsSrc.slice(0, idx) + replaced + cardsSrc.slice(idx + slice.length)
}
writeFileSync(join(root, 'src/data/portfolioExpandedCards.js'), cardsSrc)

// Flip draft modules for promoted case studies
let draftSrc = readFileSync(join(root, 'src/data/portfolioDraftCatalog.js'), 'utf8')
draftSrc = draftSrc.replace(/publicationApproved:\s*false/g, 'publicationApproved: true')
writeFileSync(join(root, 'src/data/portfolioDraftCatalog.js'), draftSrc)

console.log('Approved public count:', promoted.length)
console.log('Featured:', promoted.filter((p) => p.featured).map((p) => `${p.flagshipRank}:${p.slug}`).join(' | '))
console.log('Case studies:', promoted.filter((p) => p.hasCaseStudy).length)
console.log('Card-only:', promoted.filter((p) => !p.hasCaseStudy).length)
console.log('Factory excluded:', !promoted.some((p) => p.slug === BLOCKED_SLUG))
