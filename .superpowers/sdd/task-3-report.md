# Task 3 report: Home hero budget + section hierarchy

**Status:** DONE_WITH_CONCERNS
**Commit:** feat(ui): restructure Home for command-rail hero and work log

## Changes
- `Home.jsx`: Hero = wordmark + `SITE.slogan` (solid white h1) + one line + CTAs ("Start a project" / "View work"). No gradient, stats, badges, cards, TrustBar.
- Order: Hero, ServicesPreview (rule-separated list), FeaturedWork (work-log rows via `getHomepageFeaturedProjects`), TrustBar, Testimonials, FAQSection (kept), CTABanner.
- Removed WhoWeHelp, TechStackSection, ProcessSection, framer-motion section wrappers, section-tag usage, icon cards, ProjectCard grid.
- `TrustBar.jsx`: quiet tokens (border-line, bg-panel, text-mute/copy), no blur or brand colours.
- `ConsultationCTA.jsx`: `cta-panel` -> `border border-line bg-panel`.
- Extended `scripts/test-command-rail-tokens.mjs` (hero budget, order, removed sections, CTA panel).

## Tests
- `node scripts/test-command-rail-tokens.mjs`: PASS (was FAIL before edit).
- `npm run build:review`: OK.
- `test-phase8-ux`: 20/21; `test-phase81-release-audit`: 2 hard fails. All are "missing prerender file" checks (need a prerendered build, not `build:review`); unrelated to Home.

## Concerns
- No browser visual check performed.
- Hero copy "Start a project" / "View work" replaces prior CTA labels per brief; FAQSection retained though not in brief order.
- Featured work rows link to `/portfolio/:slug` (all featured items have case studies).

## Task 3 review fixes (2026-11-24)

**Status:** DONE  
**Commit:** `7320d84` fix(ui): point Home services rows to /services and quiet FAQ

- `ServicesPreview` rows now link to `/services` (removed `SERVICE_PORTFOLIO_LINKS` portfolio category URLs).
- `FAQSection` restyled for command-rail: `section-shell`, rule-separated accordion, no `section-tag` / `gradient-text` / `card` / framer-motion.

### Tests (post-fix)
- `node scripts/test-command-rail-tokens.mjs`: PASS command-rail tokens