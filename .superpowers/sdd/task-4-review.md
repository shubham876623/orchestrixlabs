# Task 4 Review: Portfolio work-log index + case study chrome

**Reviewer:** SDD read-only review  
**Base:** `7320d84fc6148f05af3c55fda6281af1275dc2b2`  
**Head:** `69af30fe1f5a7eb2025bceca3b19d681ac8fcaf2`  
**Commit:** `69af30f` — `feat(ui): portfolio work-log index and case study rail` (branch `feat/command-rail-ui`)

## Must-verify (reviewer checklist)

| Check | Verdict | Evidence |
|-------|---------|----------|
| No `xl:grid-cols-3` on primary portfolio index | ✅ | `Portfolio.jsx` project list is `flex flex-col`; no `xl:grid-cols-3` anywhere under `src/` |
| `ProjectCard` / index uses `variant="row"` | ✅ | Featured + paginated list + related rows use `variant="row"`; `ProjectCard.jsx` implements `variant === 'row'` |
| Case study sticky TOC on `lg:` | ✅ | `lg:grid lg:grid-cols-[12rem_1fr]` wrapper; nav `lg:sticky lg:top-28` with `aria-label="Case study sections"` |
| Filters preserved (`CategoryTabs`, depth, search, pagination) | ✅ | `CategoryTabs` + `setCategory`, `setDepth`, URL `searchParams`, search input, page controls unchanged in behavior |

## Return spec (task brief)

| Requirement | ✅/❌ |
|-------------|------|
| Portfolio index: no 3-column card grid as primary | ✅ |
| Portfolio index: row / work-log presentation | ✅ |
| Hero: drop `hero-gradient`, `grid-pattern`, `gradient-text` | ✅ |
| Hero: solid ink + rule under page title | ✅ |
| Featured: at most one featured row (not large media card) | ✅ |
| Keep `CategoryTabs` / category filter behavior | ✅ |
| `ProjectCard` `variant="row"`: horizontal row, `border-b border-line`, no card shadow shell | ✅ |
| `ProjectCard`: case-study vs contact link logic unchanged | ✅ |
| Case study: `lg:grid-cols-[12rem_1fr]` TOC rail | ✅ |
| Case study: sticky TOC links to section anchors | ✅ (see Issues — id scheme) |
| Case study sections: hairline rules, no glass/white cards in `Section` | ✅ |
| TDD: Task 4 assertions in `test-command-rail-tokens.mjs` | ✅ |
| Token test PASS | ✅ |
| Scope files: `Portfolio.jsx`, `ProjectCard.jsx`, `PortfolioCaseStudy.jsx`, test script | ✅ |

**Overall spec:** ✅ — Primary must-verify items and brief deliverables are met. Residual styling/anchor notes are non-blocking.

## Strengths

1. **Index density** — Replacing `md:grid-cols-2 xl:grid-cols-3` with a ruled column of row cards matches command-rail “work log” intent; related projects on case study pages follow the same pattern.

2. **Row variant clarity** — Three-column row grid (meta/title · summary/tech · CTAs) preserves scanability without cover-image card chrome; links and consultation CTA logic mirror the grid variant.

3. **Case study rail** — Desktop TOC in a 12rem column with sticky positioning and simplified section chrome (`border-t border-line`) improves long-form readability versus bordered card stacks.

4. **Filter continuity** — Category, depth, search, and pagination logic and URL param wiring are intact; only filter bar surface tokens were partially updated (`bg-ink`, `border-line` on sticky strip).

5. **Regression harness** — Eight new portfolio/case-study assertions encode the contract; verified locally: `PASS command-rail tokens`.

## Issues

### Critical

*None.*

### Important

*None.*

### Minor

1. **TOC anchor ids vs brief copy** — Brief suggests `#brief #system #delivery #outcome`; implementation keeps existing ids (`business-challenge`, `solution-overview`, etc.). Intentional to avoid breaking in-page links; brief wording is aspirational, not failing.

2. **Legacy tokens outside core list** — Filter bar labels (`text-slate-500`), empty state, and some case-study hero/aside chip classes still use pre-command-rail slate/amber patterns. Out of stated scope but visible next to quiet rows.

3. **Featured cardinality** — Only `featured[0]` renders; brief allows “at most one” — correct, but other featured projects no longer surface in the featured band (behavior change, not spec violation).

4. **Automated vs visual** — Report cites browser sticky/width checks; this review re-ran token tests only. Quick `/portfolio` and one `/portfolio/:slug` pass still recommended before merge.

5. **Test gaps** — Harness does not assert removal of `md:grid-cols-2` on index (only `xl:grid-cols-3`); does not assert featured count === 1.

## Verification

```text
node scripts/test-command-rail-tokens.mjs
→ PASS command-rail tokens
```

Source grep: no `xl:grid-cols-3` under `src/`; `Portfolio.jsx` contains `variant="row"` and `CategoryTabs`; `PortfolioCaseStudy.jsx` contains `lg:grid-cols-[12rem_1fr]` and `lg:sticky`.

## Task quality

**Approved**

Task 4 meets the portfolio work-log index and case study rail contract. Must-verify: no primary 3-column index grid, row variant, sticky TOC on large breakpoints, and preserved filters. Follow-up styling on filter/empty-state and case-study hero chips may be folded into a later command-rail polish pass.