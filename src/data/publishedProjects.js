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

export function getRelatedProjects(project, limit = 3, options = {}) {
  const visible = getVisiblePublishedProjects(options)
  if (!project?.relatedSlugs?.length) {
    return visible
      .filter((p) => p.slug !== project?.slug && p.categories.some((c) => project?.categories?.includes(c)))
      .slice(0, limit)
  }
  return project.relatedSlugs
    .map((s) => getPublishedProjectBySlug(s, options))
    .filter(Boolean)
    .slice(0, limit)
}

export function getPublicationApprovedSlugs() {
  return getVisiblePublishedProjects({ mode: 'approved_public' })
    .filter(isPublicationApproved)
    .map((p) => p.slug)
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
