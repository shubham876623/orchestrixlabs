/** Local content-review loader — imports draft case studies + expanded cards (not for production). */
import { DRAFT_ONLY_PROJECTS } from './portfolioDraftCatalog.js'
import { EXPANDED_PORTFOLIO_CARDS } from './portfolioExpandedCards.js'

export function getOptionalDraftProjects() {
  return DRAFT_ONLY_PROJECTS
}

export function getOptionalExpandedCards() {
  return EXPANDED_PORTFOLIO_CARDS
}

export const DRAFT_LOADER_INCLUDES_CONTENT = true
