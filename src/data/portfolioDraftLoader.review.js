/** Local content-review loader — imports draft catalog (not for production builds). */
import { DRAFT_ONLY_PROJECTS } from './portfolioDraftCatalog.js'

export function getOptionalDraftProjects() {
  return DRAFT_ONLY_PROJECTS
}

export const DRAFT_LOADER_INCLUDES_CONTENT = true
