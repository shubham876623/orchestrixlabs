# Task 4 Report: Portfolio work-log index + case study chrome

Status: DONE (with minor concerns)
Commit: 69af30f feat(ui): portfolio work-log index and case study rail (branch feat/command-rail-ui)

## Changes
- scripts/test-command-rail-tokens.mjs: new Task 4 assertions (written first, failed on 6 checks, now PASS).
- ProjectCard.jsx: `variant="row"` (3-col row: meta+title / summary+tech / CTAs, `border-b border-line`, no cover image). Case-study vs contact link logic unchanged.
- Portfolio.jsx: hero gradient/grid-pattern/gradient-text removed (solid ink + rule); featured block reduced to a single row; project list is `flex flex-col` of row cards; CategoryTabs, depth filter, search, pagination kept.
- PortfolioCaseStudy.jsx: `lg:grid-cols-[12rem_1fr]` with sticky TOC (existing ids: business-challenge, solution-overview, technical-architecture, engineering-responsibilities, technologies, verified-outcomes); Section now hairline `border-t border-line` (no cards); related projects use row variant.

## Verification
- `node scripts/test-command-rail-tokens.mjs` -> PASS
- `vite build` OK
- Browser: /portfolio shows dense row list, no 3-col grid; case study TOC computed `position: sticky`, 192px wide at 1400px.

## Concerns
- Brief's anchors (#brief/#system/#delivery/#outcome) not used; kept existing section ids to avoid breaking links.
- Portfolio filter bar/depth buttons/empty state still carry some legacy slate/dark: classes (not in scope).
- Case study hero and Technologies/Integrations aside still use some legacy chip styling; JSX indentation of the case-study body not re-flowed after wrapping in the grid.
- Featured block only shows the first featured project.
