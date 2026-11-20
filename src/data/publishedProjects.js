/**
 * PUBLIC PORTFOLIO BUNDLE (controlled publish target)
 *
 * Modes:
 * - approved_public: production — publication-approved rows only; draft loader is a stub (no draft module in graph)
 * - content_review: local founder review — draft loader pulls in the draft catalog module
 *
 * Vite aliases `#portfolio-draft-loader` to stub vs review based on VITE_PORTFOLIO_MODE.
 * This file must never have a direct module dependency on the draft catalog.
 */

import { APPROVED_PUBLIC_PROJECTS } from './portfolioApprovedProjects.js'
import {
  getOptionalDraftProjects,
  getOptionalExpandedCards,
  DRAFT_LOADER_INCLUDES_CONTENT,
} from '#portfolio-draft-loader'

const envMode =
  typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PORTFOLIO_MODE
    ? import.meta.env.VITE_PORTFOLIO_MODE
    : null

/** Local default content_review; production builds must set VITE_PORTFOLIO_MODE=approved_public */
export const PORTFOLIO_PUBLISH_MODE = envMode || 'content_review'

export const PORTFOLIO_CATEGORIES = [
  'All Projects',
  'AI Agents',
  'Voice AI',
  'Automation',
  'SaaS Platforms',
  'Full-Stack Development',
  'CRM Integrations',
  'Data & Analytics',
]

/**
 * Homepage + portfolio “flagship strip” — 5 publication-approved full case studies.
 * Independent of the broader `featured` flag set (still used elsewhere).
 * Does not change publicationApproved / hasCaseStudy / GPT gates.
 */
export const HOMEPAGE_FEATURED_SLUGS = [
  'ai-estimating-field-ops',
  'restaurant-voice-ordering',
  'hubspot-voice-lead-qualification',
  'twilio-outbound-call-center',
  'bilingual-hr-ai-assistant',
]

export { DRAFT_LOADER_INCLUDES_CONTENT }

function catalogForMode(mode) {
  const drafts = mode === 'approved_public' ? [] : getOptionalDraftProjects()
  if (mode === 'approved_public') {
    return APPROVED_PUBLIC_PROJECTS.filter((p) => p.publicationApproved === true).sort(
      (a, b) => (a.flagshipRank ?? 99) - (b.flagshipRank ?? 99) || a.title.localeCompare(b.title)
    )
  }
  // Approved rows win over draft rows for the same slug.
  const bySlug = new Map()
  for (const p of [...drafts, ...APPROVED_PUBLIC_PROJECTS]) {
    bySlug.set(p.slug, p)
  }
  return [...bySlug.values()].sort((a, b) => (a.flagshipRank ?? 99) - (b.flagshipRank ?? 99))
}

export const publishedProjects = catalogForMode(PORTFOLIO_PUBLISH_MODE)

export function isDraftPortfolioMode() {
  return PORTFOLIO_PUBLISH_MODE !== 'approved_public'
}

export function isPublicationApproved(project) {
  return project?.publicationApproved === true
}

export function getVisiblePublishedProjects(options = {}) {
  const mode = options.mode ?? PORTFOLIO_PUBLISH_MODE
  return catalogForMode(mode)
}

export function getPublishedProjectBySlug(slug, options = {}) {
  return getVisiblePublishedProjects(options).find((p) => p.slug === slug) || null
}

export function getFeaturedPublishedProjects(options = {}) {
  return getVisiblePublishedProjects(options)
    .filter((p) => p.featured)
    .sort((a, b) => (a.flagshipRank ?? 99) - (b.flagshipRank ?? 99))
}

/** Curated 4–6 homepage / flagship-strip projects from already-approved public content. */
export function getHomepageFeaturedProjects(options = {}) {
  const mode = options.mode ?? PORTFOLIO_PUBLISH_MODE
  const bySlug = new Map(
    getVisiblePublishedProjects({ mode })
      .filter((p) => isPublicationApproved(p) && p.hasCaseStudy === true)
      .map((p) => [p.slug, p])
  )
  return HOMEPAGE_FEATURED_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean)
}

function relatedScore(candidate, project) {
  if (!candidate || !project || candidate.slug === project.slug) return -1
  let score = 0
  const sharedCats = (candidate.categories || []).filter((c) =>
    (project.categories || []).includes(c)
  )
  score += sharedCats.length * 4
  const techA = new Set(candidate.techCandidates || candidate.tech || [])
  const techB = new Set(project.techCandidates || project.tech || [])
  for (const t of techA) {
    if (techB.has(t)) score += 1
  }
  if (candidate.hasCaseStudy === true) score += 3
  if (candidate.featured) score += 1
  if ((project.relatedSlugs || []).includes(candidate.slug)) score += 10
  return score
}

export function getRelatedProjects(project, limit = 3, options = {}) {
  const visible = getVisiblePublishedProjects(options)
  if (!project) return []

  if (project.relatedSlugs?.length) {
    const explicit = project.relatedSlugs
      .map((s) => getPublishedProjectBySlug(s, options))
      .filter(Boolean)
      .slice(0, limit)
    if (explicit.length >= limit) return explicit
    const filled = new Set(explicit.map((p) => p.slug))
    const extras = visible
      .filter((p) => !filled.has(p.slug))
      .map((p) => ({ p, score: relatedScore(p, project) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || (a.p.flagshipRank ?? 99) - (b.p.flagshipRank ?? 99))
      .map((x) => x.p)
    return [...explicit, ...extras].slice(0, limit)
  }

  return visible
    .map((p) => ({ p, score: relatedScore(p, project) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || (a.p.flagshipRank ?? 99) - (b.p.flagshipRank ?? 99))
    .map((x) => x.p)
    .slice(0, limit)
}

export function getPublicationApprovedSlugs() {
  return getVisiblePublishedProjects({ mode: 'approved_public' })
    .filter(isPublicationApproved)
    .map((p) => p.slug)
}

/** Indexable case-study URLs only (sitemap / prerender). Card-only approved projects stay off the sitemap. */
export function getIndexableCaseStudyProjects(options = {}) {
  return getVisiblePublishedProjects({ mode: options.mode ?? 'approved_public' }).filter(
    (p) => isPublicationApproved(p) && p.hasCaseStudy === true && Boolean(p.slug)
  )
}

export function getIndexableCaseStudySlugs(options = {}) {
  return getIndexableCaseStudyProjects(options).map((p) => p.slug)
}

export function projectHasFullCaseStudy(project) {
  return project?.hasCaseStudy === true
}

/**
 * Featured case studies (full PRJ modules).
 * Always exclude holdPublicationUntil (e.g. ML until stack verified).
 * In approved_public also exclude tech-pending; content_review shows Wave A for founder review.
 */
export function getFeaturedCaseStudies(options = {}) {
  const mode = options.mode ?? PORTFOLIO_PUBLISH_MODE
  return getFeaturedPublishedProjects(options).filter((p) => {
    if (p.holdPublicationUntil || p.featured === false) return false
    if (mode === 'approved_public' && p.techPendingVerification) return false
    return true
  })
}

/**
 * All-Projects cards for portfolio grid.
 * content_review: expanded card catalog (deduped families).
 * approved_public: publication-approved case studies only.
 */
export function getAllProjectCards(options = {}) {
  const mode = options.mode ?? PORTFOLIO_PUBLISH_MODE
  if (mode === 'approved_public') {
    return getVisiblePublishedProjects({ mode }).map((p) => ({
      ...p,
      hasCaseStudy: p.hasCaseStudy === true,
      techCandidates: p.techCandidates || p.tech || [],
    }))
  }

  const cards = getOptionalExpandedCards()
  if (!cards.length) {
    return getVisiblePublishedProjects({ mode }).map((p) => ({
      ...p,
      hasCaseStudy: p.hasCaseStudy !== false,
      techCandidates: p.techCandidates || p.tech || [],
    }))
  }

  const caseBySlug = new Map(
    getVisiblePublishedProjects({ mode }).map((p) => [p.slug, p])
  )

  return cards
    .filter((card) => !card.holdPublicationUntil)
    .map((card) => {
      const cs = caseBySlug.get(card.slug)
      return {
        ...card,
        engagementLabel: cs?.engagementLabel || 'Founder freelance engagement',
        techCandidates: card.techCandidates || cs?.techCandidates || [],
        conditional: cs?.conditional,
        publicationApproved:
          card.publicationApproved === true || cs?.publicationApproved === true,
      }
    })
}
