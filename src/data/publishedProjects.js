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
    return APPROVED_PUBLIC_PROJECTS.filter((p) => p.publicationApproved === true)
  }
  const bySlug = new Map()
  for (const p of [...APPROVED_PUBLIC_PROJECTS, ...drafts]) {
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
