# Portfolio publishing workflow (Option A)

## Sources

| Layer | Location | Public? |
|-------|----------|---------|
| Editorial authority | Orchestrix OS `Portfolio_Knowledge/` | Never |
| Public bundle | `src/data/publishedProjects.js` | Yes (frontend) |
| Legacy seed | `src/data/projects.js` | Deprecated for UI |
| Dashboard CRUD | `/api/dashboard/projects/` | Auth only |
| Legacy public list API | `/api/projects/` | Exists; not used by new Portfolio UI |

## Modes

- `local_draft_preview` — draft banner + `noindex`; merge approved + draft modules for founder review.
- `approved_public` — **current local RC**. No draft banner; approved pages indexable. UI imports **only** `portfolioApprovedProjects.js` (draft module not in the production module graph).

## Module split

| File | Role |
|------|------|
| `portfolioApprovedProjects.js` | Publication-approved rows shipped in `approved_public` builds |
| `portfolioDraftCatalog.js` | Seven unpublished drafts — not imported by UI in RC |
| `publishedProjects.js` | Mode flag + visibility helpers |

## Dual gates (do not conflate)

| Field | Meaning |
|-------|---------|
| `verificationStatus` | Editorial readiness (e.g. `content_approved_not_published`) |
| `publicationApproved` | Explicit founder authorization to show on the live site |

Production routes, homepage featured, related links, and sitemap slugs must all use `getVisiblePublishedProjects` / `getPublicationApprovedSlugs` (same filter).

## Rules

1. Never import OS markdown into the frontend build.
2. Never put client legal names, dollars, hours, or unverified % into this bundle.
3. Empty `features` / `verifiedOutcomes` render as pending blocks — do not invent filler.
4. Screenshots only when explicitly approved paths are added to `images`.
5. `content_approved_not_published` must remain private until `publicationApproved: true`.
6. Sitemap case-study URLs: only `getPublicationApprovedSlugs()` — never add draft or content-only rows.
