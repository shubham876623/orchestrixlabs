# Orchestrix Labs — Command Rail UI Redesign

**Date:** 2026-11-24  
**Status:** Approved — implementation plan written (`docs/superpowers/plans/2026-11-24-orchestrix-command-rail.md`)  
**Product:** Orchestrix Labs marketing site + admin dashboard (`orchestrix-frontend`)  
**Audience:** Serious Upwork / enterprise buyers evaluating AI automation & ops engineering  
**Primary job:** Make the site feel like a real operator workshop — not a generic AI SaaS template

---

## 1. Decisions locked

| Decision | Choice |
|----------|--------|
| Scope | Full public site + dashboard polish |
| Personality | Operator workshop — dark industrial, cyan as tool accent only, dense useful layout |
| Depth | Structure + visuals — rethink section order/hierarchy; **keep existing routes** |
| Brand lock | Keep **logo**, **slogan**, and **current cyan accent**; redesign layout / type / spacing |
| Approach | **Command rail** (ops-console rhythm) |

---

## 2. Visual system

### Palette

| Token | Hex | Role |
|-------|-----|------|
| `ink` | `#070B12` | Page ground |
| `panel` | `#0E1520` | Nav, strips, dashboard chrome |
| `line` | `#1C2736` | Hairline rules (not soft glass borders) |
| `copy` | `#C5D0DC` | Body text |
| `mute` | `#7A8798` | Secondary text |
| `signal` | Existing cyan (Tailwind primary/cyan) | CTAs, focus rings, active nav only — **not** large backgrounds |

### Typography

- Keep **Syne** (display / brand) + **Source Sans 3** (UI / body).
- Tighter type scale: fewer sizes, stronger weight contrast.
- **Do not** use ALL-CAPS eyebrow spam or a decorative label above every heading.
- Prose line length ≈ **72ch** max; left-aligned.

### Layout principles

- Left-aligned content; horizontal rules and spacing define sections.
- Avoid identical rounded “SaaS card” grids as the default container.
- Cards only where they wrap a **real interaction** (forms, filters, dashboard widgets).
- Cyan reserved for primary actions and selected states.
- Motion: at most **one** intentional page-load moment; respect `prefers-reduced-motion`.
- No neon glow, glassmorphism stacks, floating badges, or pill-stat strips in the hero.

### Explicit anti-patterns (reject)

- Glass cards + soft grey shadows on every block  
- Gradient washes as decoration  
- Tracked-out ALL-CAPS eyebrows above every H2  
- Icon mosaics for services  
- Equal-sized portfolio card tiles as the primary index pattern  

---

## 3. Page structure (routes unchanged)

Routes stay: `/`, `/services`, `/portfolio`, `/portfolio/:slug`, `/work-history`, `/about`, `/reviews`, `/contact`, `/privacy-policy`, `/dashboard`, `/staff`.

### Home (`/`) — first viewport

1. Brand wordmark + slogan as hero-level signal  
2. One short ops supporting line  
3. One CTA group (`Contact` / `Portfolio`)  
4. **No** stats strip, card grid, floating badges, or secondary marketing blocks in the first viewport  

**Below fold (order):**

1. Services as a tight rule-separated list (not icon cards)  
2. Selected work as a **work log** (title / stack / outcome)  
3. Trust / verified credentials  
4. Closing CTA  

### Services (`/services`)

- One job per block: problem → what we build → fit  
- Linear sections with rules  
- Cyan only on “Discuss this” / contact links  

### Portfolio (`/portfolio`) + case studies

- Index = filterable **work log** (list/table density), not equal card tiles  
- Case study = brief → system → delivery → outcome  
- Desktop: left rail or sticky TOC  

### Contact (`/contact`)

- Form is the interaction surface (may remain card-like)  
- Copy short and operational  

### Dashboard (`/dashboard`)

- Same command-rail language: denser tables, quieter sidebar  
- Cyan for active nav + primary buttons only  
- **Auth, API proxy, and session behavior unchanged** — visual/structure polish only  

### Shared chrome

- **Navbar:** logo + sparse links + one primary CTA  
- **Footer:** utility links, not marketing collage  

---

## 4. Implementation boundaries

### In scope

1. Token pass: CSS variables + Tailwind theme mapping (`ink` / `panel` / `line` / `copy` / `mute` / signal cyan)  
2. Restyle shared primitives: `Navbar`, `Footer`, `btn-primary` / `btn-outline`, section shells  
3. Page passes in order: **Home → Portfolio → Services → Contact → Dashboard shell** (marketing first)  
4. Preserve SEO/prerender, portfolio content gates, Clarity/consent, dashboard auth/API  

### Out of scope

- New product features  
- Broad copy rewrite (label tightening only where needed for clarity)  
- New illustrations / 3D / generative backgrounds  
- Full light-mode redesign (keep current dual-theme behavior unless something breaks)  

### Done when

- First viewport passes brand test (logo/slogan dominate; not generic SaaS)  
- No glass-card / glow / eyebrow spam on marketing pages  
- Portfolio reads as a work log; dashboard feels like the same system  
- Mobile usable; keyboard focus visible; reduced motion respected  
- No regressions on `/api` Edge middleware proxy or dashboard login session  

### Verification

- Spot-check Home, Portfolio, Contact, Dashboard in browser after each major page  
- Confirm `/api/dashboard/stats/` still returns JSON (not HTML) via same-origin proxy  
- Local: `http://127.0.0.1:5173` · Production only after explicit deploy approval  

---

## 5. Architecture notes (existing codebase)

- App: Vite + React SPA (`src/App.jsx`, lazy routes)  
- Styles: `src/index.css` + Tailwind  
- Brand copy/constants: `src/lib/site.js`  
- Portfolio data: approved static catalog + gates (do not publish private Upwork archive)  
- API: same-origin `/api` via `middleware.js` → Railway  

Implementation should prefer updating tokens and shared components first so page edits stay thin.

---

## 6. Success criteria (acceptance)

1. A stranger removing the nav still recognizes Orchestrix branding in the first viewport.  
2. Site does not read as “AI SaaS template” (no card kit / glow / eyebrow spam).  
3. Operator-workshop density without clutter: one purpose per section.  
4. Dashboard visually belongs to the same system as marketing.  
5. Existing auth and SEO behavior remain intact.  

---

## 7. Next step after this spec is approved

Invoke **writing-plans** to produce `docs/superpowers/plans/2026-11-24-orchestrix-command-rail.md` with bite-sized implementation tasks, then execute task-by-task with browser verification.
