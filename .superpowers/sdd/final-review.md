# Final Review — Command Rail UI Redesign

**Range:** `734c54d..9c82b41` (8 commits, 21 files, +560 / −851)
**Spec:** `docs/superpowers/specs/2026-11-24-orchestrix-command-rail-design.md`
**Plan:** `docs/superpowers/plans/2026-11-24-orchestrix-command-rail.md`
**Reviewer mode:** read-only (no git mutation). I ran `scripts/test-command-rail-tokens.mjs`, a `vite build` to a temp dir (deleted afterward), and the existing `test:*` scripts.

## Verification run

| Check | Result |
|-------|--------|
| `node scripts/test-command-rail-tokens.mjs` | PASS |
| `vite build` (temp outDir) | PASS (493 modules, CSS compiles) |
| `test:gates` (portfolio publication gates) | 52/52 PASS |
| `test:work-history`, `test:clarity` | PASS |
| `test:phase8` / `test:prerender-seo` | FAIL, but caused by the stale local `dist/` (no prerendered routes). `prerender-routes.mjs` and `seoPages.js` are untouched and prerender H1 comes from `seoPages`, not `Home.jsx`. **Not attributable to this diff**, but re-run after a real `npm run build` before deploy. |
| `middleware.js`, `src/lib/axios`, dashboard auth/storage key, `loadAll`, `LoginScreen` logic | Not touched (diff is className-only in `Dashboard.jsx`) |
| Live dev server `127.0.0.1:5173` | Currently serving **500 on `/src/index.css`** (`The text-copy class does not exist`). The server was started before `tailwind.config.js` changed and has a stale Tailwind config. A fresh build is fine. Restart it before doing the manual acceptance pass. |

## Strengths

- **Token-first architecture was followed.** `tailwind.config.js` and `index.css` carry ink/panel/line/copy/mute, and `dark.950/900/800` are retuned to the spec hexes. Most page work is thin class swaps, as the spec intended.
- **Home matches the spec closely.** The hero is wordmark + `SITE.slogan` + one ops line + `Start a project` / `View work`, with no stats, badges, cards, or TrustBar. The below-fold order is Services list → Work log → Trust → Testimonials → FAQ → CTA. Services and work are rule-separated rows (`border-t border-line`), not icon or card grids. Motion was removed from Home entirely.
- **Anti-pattern removal is real.** Glow utilities (`.glow`, `.glow-cyan`), the cyan→indigo button gradient, the logo drop-shadow, `backdrop-blur-2xl` and the hero grid/gradient theater are gone. `.section-tag` is no longer ALL-CAPS tracked. `.gradient-text` is solid. `.cta-panel` is flat.
- **Portfolio is a true work log.** `ProjectCard variant="row"` is added and the index and related lists use it (no `xl:grid-cols-3`). Filters (`CategoryTabs`, search, depth) are preserved. The case study gets a `lg:grid-cols-[12rem_1fr]` sticky rail and hairline sections. Case-study vs contact link logic is unchanged.
- **Services is linear** (Problem / What we build / Fit, `border-t border-line`, `Discuss this` to `/contact`). Cyan is used only on actions. Contact keeps the form as the one bordered surface.
- **Dashboard is visual-only.** Sidebar is `bg-panel border-r border-line` with a cyan left rail on the active item. Widgets are `rounded-md border-line bg-panel`. Table padding is denser. Auth, API and storage are untouched, and the token test guards those symbols.
- **FAQ rewrite** removed framer-motion and `react-intersection-observer` from that component and gained `aria-hidden` on the chevron and a focus ring.
- **Process discipline:** per-task commits, a regression script that encodes the spec's anti-patterns, and `.superpowers/sdd` reports.

## Issues

### Critical

None.

### Important

**I1. Light mode regresses on several surfaces.**
The spec says to keep the dual-theme behavior "unless something breaks", and the Navbar toggle still ships. The new classes are fixed-dark colors with no light-mode counterpart, and the existing `html:not(.dark)` overrides in `src/index.css` (lines ~38-62) only cover `bg-dark-950/900/*`, `text-white` and `border-white/*`. I switched to light in a built copy of `/contact` and read computed styles:

- `.bg-panel` is still `rgb(14,21,32)`, while its `text-white` headings are forced by the existing `!important` rule to `rgb(15,23,42)`. That gives **dark text on a dark panel** (Contact "Get in touch" card, form wrapper, Home empty-state, Dashboard if toggled).
- `text-copy` (`#C5D0DC`) is a fixed pale colour. On the `slate-50` light body it is nearly invisible. It is used for the Home hero paragraph, Portfolio intro, the Services body, and the **entire case-study body**. The old `PortfolioCaseStudy` `Section` was `text-slate-600 dark:text-slate-300` on a white card, so this is a clear regression.
- `.gradient-text` is now `text-white`, but the light override only targets the `.text-white` class. The About, Reviews and other headings that wrap words in `gradient-text` render **white on near-white** in light mode.
- Home Testimonials use `bg-ink` cards with `text-white` names, so they are dark-on-dark in light mode.

Contact's `.card` panels were already dark in light mode before this branch, so part of the page was already broken. The Home, Portfolio, Services and case-study body text regressions are new.

Fix options, in order of cost:
1. **Smallest:** define `--orch-*` variables per theme. Under `html:not(.dark)`, set `copy` to slate-700, `mute` to slate-500, `panel` to white and `line` to slate-200. Map the Tailwind colors to `rgb(var(--…))`. Then `.gradient-text` gets the same light override as `text-white`.
2. **Policy decision:** if light mode is intentionally unsupported for the redesign, remove the toggle (or lock to dark) and record that in the spec. Shipping a toggle that produces unreadable pages is the worst outcome.

**I2. Manual acceptance has not been done against a working server.**
Plan Task 7 Step 3 is a human checklist (hero, `/portfolio`, `/services`, `/contact` form submit, `/dashboard` login + `/api/dashboard/stats/` returning JSON, 390px width, Tab focus). The only dev server on `:5173` is currently broken (stale Tailwind, 500 on CSS), so any "verified" claim against it should not be trusted. Do not mark the spec "Implemented" or deploy until someone restarts the dev server and signs the checklist. The plan itself says deploy only after explicit approval, which still stands.

### Minor

**M1. `::selection` is still indigo** (`index.css` ~line 72, `rgba(99,102,241,.3)`). This contradicts "cyan is the only signal accent". One-line fix: use `rgba(6,182,212,.3)` or `var(--orch-signal)`. **Triage: fix before merge** (trivial).

**M2. Navbar Upwork secondary CTA** (`Navbar.jsx` ~line 100) keeps the `#14a800` green outline with `rounded-xl`, next to the cyan primary and an `rounded-xl` theme toggle. The spec asks for "logo + sparse links + one primary CTA". There are also 7 links. The green is third-party brand colour, not signal cyan. **Triage: defer or accept.** Upwork is the real buyer channel for this audience. Optionally demote it to a text link or move it to the footer later.

**M3. FAQ still on Home.** Not in the spec's below-fold order, but `SEOHead faq={FAQ}` emits FAQPage JSON-LD for the homepage. Removing the visible FAQ while keeping the schema would mismatch content and markup. **Triage: accept** (keep it quieted as done). If it is ever removed, remove the schema too.

**M4. Services "Problem" / "Fit" mapping.** `Problem` shows `svc.tagline` and `Fit` shows `svc.tools.join(' · ')` (a tool list). A buyer would read "Fit" as "who this is for". The structure matches the spec; the labels are slightly misleading. **Triage: accept for now, rename `Fit` to `Stack` or add real fields (needs data/copy approval; the spec forbids a broad copy rewrite).**

**M5. Remaining-page pass is shallow.**
- About still has centered headings with a `section-tag` above every H2 (Our Story / Our Values / Expertise / Tech Stack) and `.card` grids. Spec says no label above every heading.
- Contact still has `section-tag … inline-flex` above the H1.
- Plan Task 7's `rg` for `section-tag mb-4 inline-flex` would still match Contact.
- `Reviews` is left with an empty line where background blobs were removed.

The plan scoped Task 7 as "alignment only", so this is acceptable for merge. Track it as follow-up.

**M6. Reduced-motion.** `index.css` only zeroes CSS animations and transitions. Framer-motion entrance animations on Contact, About, Reviews and Work History (`initial={{opacity:0,y:20}}`) are not gated (only Portfolio uses `useReducedMotion`). Home has none. Optional: wrap the app in `<MotionConfig reducedMotion="user">`, which is a one-line fix.

**M7. Hygiene.**
- `ConsultationCTA.jsx` and `TrustBar.jsx` gained a UTF-8 BOM on line 1 (visible in the diff as `﻿import`). `Navbar.jsx`, `FAQSection.jsx` and the token test lost their trailing newline. These are tooling artifacts and are harmless to Vite, but they add noise to diffs.
- `scripts/test-command-rail-tokens.mjs` is not wired into `package.json` (e.g. `test:command-rail`). It also asserts on class-string substrings, so it is brittle (a regression guard, not a behavior test).
- Dead or near-dead CSS: `.hero-gradient`, `.grid-pattern`, `.noise`, `.glass` and `.card` are still defined. Several are now unused or only used by About/Reviews. The `--orch-*` variables are defined but not consumed (Tailwind has hard-coded hexes), so there are two sources of truth for the palette.
- The `primary-*` Tailwind scale was remapped from indigo to cyan globally. This is intentional per plan, but it silently recolours any remaining `primary-*` usage (Dashboard buttons, skip-link, scrollbar hover). Visually consistent; just be aware.

## Spec / plan coverage

| Requirement | Status |
|-------------|--------|
| Tokens (ink/panel/line/copy/mute + cyan signal), fonts kept | Done |
| Navbar / Footer chrome | Done (M2 residual) |
| Home hero budget + below-fold structure | Done |
| Portfolio work log + case-study rail | Done |
| Services linear / Contact form-as-card | Done (M4) |
| Dashboard visual-only, auth/API intact | Done |
| Remaining pages light pass | Partial (M5), acceptable per plan |
| No eyebrow spam | Mostly (About, Contact residual) |
| Mobile / keyboard / reduced-motion | Focus rings present; mobile and manual checks unverified (I2); M6 |
| Light-mode "keep dual-theme" | **Not met (I1)** |
| No deploy without approval | Respected (nothing deployed) |

## Triage of the supplied minor-findings ledger

| Ledger item | Verdict |
|-------------|---------|
| `::selection` indigo | Fix now (M1, one line) |
| Upwork CTA in nav | Defer / accept (M2) |
| FAQ on Home | Accept (M3, schema parity) |
| Problem/Fit mapped from tagline/tools | Accept; rename label or follow up (M4) |
| Manual acceptance not human-signed | **Blocks merge/deploy** (I2), and the dev server needs a restart |

## Assessment

**Ready with fixes.**

The implementation follows the spec and plan well. Home, Portfolio, Services and Dashboard land the command-rail direction without touching auth, the API proxy, SEO prerender, or the publication gates. The build and the gate tests pass.

Before merge:
1. Resolve light mode (I1), either by making `copy`/`mute`/`panel`/`line`/`gradient-text` theme-aware or by deliberately dropping the toggle.
2. Restart the dev server and complete the human acceptance checklist, including `/api/dashboard/stats/` returning JSON (I2).
3. Change `::selection` to cyan (M1).

Everything else is acceptable as follow-up.

## Fix

- src/index.css: added light-mode overrides for .text-copy (#0f172a), .bg-panel / .bg-dark-900 / .bg-dark-900/80 (light surface), .gradient-text (dark; white retained under .dark).
- ::selection changed to rgba(6,182,212,0.35); dark text on selection in light mode.
- tailwind.config.js: copy/mute/panel/ink/line already correctly under theme.extend.colors; no change needed.
- Results: node scripts/test-command-rail-tokens.mjs -> PASS; vite build succeeds (no text-copy error).
- Not addressed here: I2 (dev server /api/dashboard/stats/ and human acceptance checklist).
