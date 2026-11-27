# Task 2 Report: Navbar + Footer chrome

**Branch:** `feat/command-rail-ui`  
**Base:** Task 1 (`4bebe36` — command-rail tokens and button primitives)  
**Date:** 2026-11-24

## Status

**DONE**

## Commits

| SHA | Subject |
|-----|---------|
| `8134b05` | `feat(ui): restyle navbar and footer to command-rail chrome` |

## TDD workflow

| Step | Action | Result |
|------|--------|--------|
| 1 | Appended chrome assertions to `scripts/test-command-rail-tokens.mjs` | Done |
| 2 | `node scripts/test-command-rail-tokens.mjs` | FAIL (drop-shadow, backdrop-blur-2xl) |
| 3 | Restyled `Navbar.jsx` | Done |
| 4 | Restyled `Footer.jsx` | Done |
| 5 | Re-ran token test | PASS |
| 6 | Browser check `/` and `/contact` | PASS (via `vite preview` on 4173) |
| 7 | Git commit | Done |

## Files changed

- `scripts/test-command-rail-tokens.mjs` — navbar/footer source assertions
- `src/components/Navbar.jsx` — command-rail header chrome
- `src/components/Footer.jsx` — utility footer on panel tokens

## Navbar changes

- Removed logo `drop-shadow-[0_0_18px_rgba(0,239,253,0.18)]` from `BrandLogo`.
- Scrolled: `py-3 bg-panel/95 border-b border-line` (no `backdrop-blur-2xl`, no `shadow-xl`).
- Unscrolled: `py-4 bg-ink/80` (replaces transparent + heavy glass).
- Active nav: `text-cyan-400` with left accent bar; removed `layoutId` pill glow.
- Header motion: `initial={false}` — no slide-in competing with hero.
- Mobile drawer: `bg-panel/95 border-b border-line`, no blur; active links use left border.
- Theme toggle / nav links use `text-mute`, `text-copy`, `border-line`.
- Preserved: `navLinks`, mobile menu, theme toggle, Upwork link, `/contact` primary CTA (`btn-primary`).

## Footer changes

- Shell: `bg-panel border-t border-line`.
- Typography: `text-copy` headings, `text-mute` body/links (replaced slate scale).
- Social chips: `bg-ink border-line` (no primary gradient hover).
- Removed footer bar `animate-pulse` on availability dot.
- Legal bar link accent: `text-cyan-400` for consultation link.
- No newsletter/subscribe content (unchanged; test asserts absence).

## Tests

```text
node scripts/test-command-rail-tokens.mjs
→ PASS command-rail tokens
```

```text
npm run build:review
→ built successfully
```

## Browser verification

- **/** — Nav readable on ink hero; Home active with cyan + left bar; logo without glow; Request Consultation CTA visible.
- **/contact** — Contact nav item active; CTA visible in header.

Note: local `npm run dev` on 5173 showed intermittent PostCSS `@apply text-copy` errors during HMR; production `vite build` and `vite preview` rendered correctly.

## Self-review

### Strengths

- Aligns with brief interfaces: consumes `ink` / `panel` / `line` / `copy` / `mute` tokens; flat chrome without glass blur or logo glow.
- Token test encodes regressions for drop-shadow, blur, Contact CTA, and footer utility scope.
- Minimal scope: only Navbar, Footer, and test script touched.

### Concerns / follow-ups

1. **Secondary CTA:** Upwork button remains beside primary Contact CTA; brief names one primary CTA but does not require removing Upwork — acceptable unless product wants sole CTA.
2. **CTA copy:** Primary button still reads “Request Consultation” while nav link is “Contact”; both route to `/contact` — consistent with prior behavior.
3. **Dev HMR:** If `text-copy` @apply errors persist on dev server, may need a separate fix in `index.css` / Tailwind content (out of Task 2 scope; build passes).

### Checklist (brief)

- [x] Fixed header panel/line when scrolled
- [x] No logo cyan drop-shadow
- [x] Contact CTA preserved
- [x] Footer utility-only (no newsletter)
- [x] Active link not pill glow
- [x] Trimmed header entrance motion

## Report path

`.superpowers/sdd/task-2-report.md`