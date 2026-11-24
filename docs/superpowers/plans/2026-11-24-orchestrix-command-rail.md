# Orchestrix Command Rail UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the Orchestrix Labs marketing site and dashboard into a Command Rail / operator-workshop UI without changing routes, brand logo/slogan, or cyan signal accent.

**Architecture:** Token-first redesign. Update Tailwind + `index.css` surfaces and shared primitives (`btn-*`, section shells, Navbar, Footer), then restructure page sections (Home → Portfolio → Services → Contact → Dashboard shell). Preserve SEO/prerender, portfolio gates, Clarity/consent, and `/api` Edge middleware auth behavior.

**Tech Stack:** Vite 5, React 18, React Router, Tailwind CSS 3, Framer Motion (minimize new motion), existing `SITE` constants in `src/lib/site.js`.

**Spec:** `docs/superpowers/specs/2026-11-24-orchestrix-command-rail-design.md`

## Global Constraints

- Keep logo, slogan (`Engineering Intelligence. Automating Growth.`), and cyan as the only signal accent
- Keep all existing routes
- No new product features; no private Upwork archive publish
- No glass/glow/eyebrow-spam / equal card-grid as default pattern
- Cards only for real interactions (forms, filters, dashboard widgets)
- At most one intentional page-load motion moment; honor `prefers-reduced-motion`
- Do not break `middleware.js` `/api` proxy or dashboard Bearer auth
- Deploy to production only after explicit user approval
- Local verify at `http://127.0.0.1:5173`

## File map

| File | Responsibility |
|------|----------------|
| `tailwind.config.js` | Map `ink`/`panel`/`line`/`copy`/`mute`; keep fonts; retune `dark.*` to ink/panel |
| `src/index.css` | CSS variables, btn/section primitives, kill glass/glow defaults |
| `scripts/test-command-rail-tokens.mjs` | Assert token + anti-pattern checks |
| `src/components/Navbar.jsx` | Sparse command chrome |
| `src/components/Footer.jsx` | Utility footer |
| `src/pages/Home.jsx` | Hero budget + work-log / list sections |
| `src/pages/Portfolio.jsx` | Work-log index density |
| `src/components/portfolio/ProjectCard.jsx` | List-row variant for index |
| `src/pages/Services.jsx` | Linear rule sections |
| `src/pages/Contact.jsx` | Operational form surface |
| `src/pages/Dashboard.jsx` | Shell colors/density only (no auth logic changes) |
| `src/components/ConsultationCTA.jsx` | Align CTA panel to command rail |

---

### Task 1: Design tokens + primitive CSS

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`
- Create: `scripts/test-command-rail-tokens.mjs`

**Interfaces:**
- Consumes: Spec palette hex values
- Produces: Tailwind colors `ink`, `panel`, `line`, `copy`, `mute`; updated `dark.950`=`#070B12`, `dark.900`=`#0E1520`, `dark.800`=`#1C2736`; CSS vars `--orch-ink` etc.; `.btn-primary` flat cyan (no indigo gradient); `.section-tag` no longer ALL-CAPS tracking spam (sentence-case quiet label or unused)

- [ ] **Step 1: Write the failing token test**

Create `scripts/test-command-rail-tokens.mjs`:

```js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const tw = fs.readFileSync(path.join(root, 'tailwind.config.js'), 'utf8')
const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8')

const failures = []
function must(cond, msg) { if (!cond) failures.push(msg) }

must(tw.includes("'#070B12'") || tw.includes('"#070B12"'), 'tailwind must map ink/dark-950 to #070B12')
must(tw.includes("'#0E1520'") || tw.includes('"#0E1520"'), 'tailwind must map panel/dark-900 to #0E1520')
must(tw.includes("'#1C2736'") || tw.includes('"#1C2736"'), 'tailwind must map line/dark-800 to #1C2736')
must(css.includes('--orch-ink'), 'index.css must define --orch-ink')
must(css.includes('--orch-panel'), 'index.css must define --orch-panel')
must(css.includes('--orch-line'), 'index.css must define --orch-line')
must(css.includes('--orch-copy'), 'index.css must define --orch-copy')
must(css.includes('--orch-mute'), 'index.css must define --orch-mute')
must(!/btn-primary[\s\S]*from-cyan-600 to-primary-600/.test(css), 'btn-primary must not use cyan-to-indigo gradient')
must(!css.includes('.glow {'), 'remove .glow utility (or leave unused and assert not present)')
must(!/section-tag[\s\S]*uppercase tracking-\[0\.18em\]/.test(css), 'section-tag must drop ALL-CAPS tracking spam')

if (failures.length) {
  console.error('FAIL\n' + failures.map(f => ' - ' + f).join('\n'))
  process.exit(1)
}
console.log('PASS command-rail tokens')
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node scripts/test-command-rail-tokens.mjs`  
Expected: `FAIL` with missing `#070B12` / `--orch-ink` messages

- [ ] **Step 3: Update `tailwind.config.js` colors**

Replace the `dark` and keep fonts; add named tokens. Keep `secondary` cyan scale as signal. Reduce reliance on indigo `primary` for fills (may keep scale for legacy classes but CTAs will use cyan):

```js
colors: {
  ink: '#070B12',
  panel: '#0E1520',
  line: '#1C2736',
  copy: '#C5D0DC',
  mute: '#7A8798',
  dark: {
    950: '#070B12',
    900: '#0E1520',
    800: '#1C2736',
    700: '#334155',
  },
  primary: {
    // keep keys for compatibility; prefer cyan for signal in new UI
    DEFAULT: '#0891B2',
    50: '#ECFEFF',
    100: '#CFFAFE',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
  },
  secondary: {
    DEFAULT: '#06B6D4',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
  },
},
```

- [ ] **Step 4: Update `src/index.css` primitives**

At top of `@layer base` / `:root` (inside `@layer base` on `html.dark` or `:root`):

```css
:root {
  --orch-ink: #070B12;
  --orch-panel: #0E1520;
  --orch-line: #1C2736;
  --orch-copy: #C5D0DC;
  --orch-mute: #7A8798;
  --orch-signal: #06B6D4;
}
```

Replace `.btn-primary` with flat signal (no gradient, no lift shadow glow):

```css
.btn-primary {
  @apply inline-flex items-center gap-2 px-6 py-3 bg-cyan-600
         text-white font-semibold rounded-md hover:bg-cyan-500
         transition-colors duration-150 cursor-pointer
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
         focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950;
}
```

Replace `.btn-outline` to use `border-line` / `text-copy` without hover glow wash.

Replace `.section-tag` with quiet sentence-case label (no uppercase tracking):

```css
.section-tag {
  @apply inline-flex items-center gap-2 text-mute text-xs font-medium;
}
```

Replace `.gradient-text` with solid white/display color (slogan stays readable; brand lock keeps slogan text, not gradient wash):

```css
.gradient-text {
  @apply text-white;
}
```

Remove or gut `.glow` / `.glow-cyan` blocks. Soften `.cta-panel` to `bg-panel border border-line` (no cyan gradient wash). Soften `.hero-gradient` to a single restrained ink radial (no indigo blob).

Update `body` to use `text-copy` where practical: `@apply bg-dark-950 text-copy font-sans antialiased;`

- [ ] **Step 5: Run test to verify it passes**

Run: `node scripts/test-command-rail-tokens.mjs`  
Expected: `PASS command-rail tokens`

- [ ] **Step 6: Visual smoke**

Run (if not already): `npm run dev -- --host 127.0.0.1 --port 5173`  
Open `http://127.0.0.1:5173/` — page should load with darker ink ground; no console errors.

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.js src/index.css scripts/test-command-rail-tokens.mjs
git commit -m "feat(ui): add command-rail design tokens and button primitives"
```

---

### Task 2: Navbar + Footer chrome

**Files:**
- Modify: `src/components/Navbar.jsx`
- Modify: `src/components/Footer.jsx`

**Interfaces:**
- Consumes: `dark-950`/`panel`/`line` tokens from Task 1; `BrandLogo`; existing `navLinks`
- Produces: Fixed header with `bg-panel/95 border-b border-line` when scrolled; no logo cyan drop-shadow; one primary CTA (`Contact`); footer utility-only

- [ ] **Step 1: Write failing chrome assertions into token test**

Append to `scripts/test-command-rail-tokens.mjs`:

```js
const nav = fs.readFileSync(path.join(root, 'src/components/Navbar.jsx'), 'utf8')
const foot = fs.readFileSync(path.join(root, 'src/components/Footer.jsx'), 'utf8')
must(!nav.includes('drop-shadow-[0_0_18px_rgba(0,239,253,0.18)]'), 'Navbar must remove logo glow drop-shadow')
must(!nav.includes('backdrop-blur-2xl'), 'Navbar must not use heavy glass blur')
must(nav.includes('Contact') || nav.includes('/contact'), 'Navbar keeps Contact CTA')
must(!/Newsletter|Subscribe/i.test(foot), 'Footer stays utility (no newsletter collage)')
```

- [ ] **Step 2: Run test — expect FAIL on drop-shadow / blur**

Run: `node scripts/test-command-rail-tokens.mjs`

- [ ] **Step 3: Restyle Navbar**

In `Navbar.jsx`:
- Remove `drop-shadow-[0_0_18px_rgba(0,239,253,0.18)]` from `BrandLogo`
- Scrolled state: `py-3 bg-panel/95 border-b border-line` (no `backdrop-blur-2xl`, no `shadow-xl shadow-black/20`)
- Unscrolled: `py-4 bg-ink/80` or transparent over ink
- Active link: `text-cyan-400` underline or left bar — not pill glow
- Keep theme toggle and mobile menu behavior
- Trim motion: if `initial={{ y: -80 }}` exists, set `initial={false}` or duration ≤0.2 to avoid hero competition

- [ ] **Step 4: Restyle Footer**

In `Footer.jsx`:
- Background `bg-panel border-t border-line`
- Keep link columns / legal / social; remove decorative gradients if present
- Text `text-copy` / `text-mute`

- [ ] **Step 5: Re-run token test — PASS**

Run: `node scripts/test-command-rail-tokens.mjs`

- [ ] **Step 6: Browser check**

Open `/` and `/contact` — nav readable; no glow on logo; Contact CTA visible.

- [ ] **Step 7: Commit**

```bash
git add src/components/Navbar.jsx src/components/Footer.jsx scripts/test-command-rail-tokens.mjs
git commit -m "feat(ui): restyle navbar and footer to command-rail chrome"
```

---

### Task 3: Home — hero budget + section hierarchy

**Files:**
- Modify: `src/pages/Home.jsx`
- Modify: `src/components/TrustBar.jsx` (quiet styling only if needed)
- Modify: `src/components/ConsultationCTA.jsx` (panel border only)

**Interfaces:**
- Consumes: `SITE` from `src/lib/site.js` (`slogan`, `positioning`, `founder`, `founderExperienceYears`)
- Produces: First viewport = brand + slogan + one line + CTA group only; below fold order: services list → work log → trust → CTA; remove section-tag ALL-CAPS usage and icon-card services preview

- [ ] **Step 1: Extend failing test for Home hero budget**

Append to `scripts/test-command-rail-tokens.mjs`:

```js
const home = fs.readFileSync(path.join(root, 'src/pages/Home.jsx'), 'utf8')
must(home.includes('SITE.slogan'), 'Home must keep SITE.slogan')
must(!/section-tag mb-4/.test(home) || (home.match(/section-tag/g) || []).length <= 2, 'Home must not spam section-tag eyebrows')
// Prefer list structure for services preview
must(home.includes('FeaturedWork') || home.includes('work'), 'Home keeps featured work section')
```

(Adjust assertions to match real function names after edit; final assert: no `WhoWeHelp` stats-style cards in first viewport — Hero component must not render TrustBar.)

Also assert:

```js
const heroStart = home.indexOf('function Hero')
const heroEnd = home.indexOf('function WhoWeHelp')
const heroBlock = home.slice(heroStart, heroEnd === -1 ? heroStart + 2500 : heroEnd)
must(!heroBlock.includes('TrustBar'), 'TrustBar must not be inside Hero')
must(heroBlock.includes('btn-primary') || heroBlock.includes('/contact'), 'Hero has primary CTA')
```

- [ ] **Step 2: Run test — expect FAIL if TrustBar still in Hero or tags spam**

- [ ] **Step 3: Rewrite Home structure**

Keep `SEOHead`. Export default order:

```jsx
<>
  <SEOHead ... />
  <Hero />
  <ServicesPreview />   {/* rule-separated list, not icon cards */}
  <FeaturedWork />      {/* work-log rows */}
  <TrustBar />          {/* after work, not hero */}
  <Testimonials />      {/* optional keep; quiet borders */}
  <CTABanner />
</>
```

Remove or demote `TechStackSection` / `ProcessSection` / `WhoWeHelp` from default page (YAGNI for command rail) — delete from render tree (functions may be deleted to avoid dead code).

**Hero content (exact structure):**
- Wordmark img `/brand/logo-wordmark-dark.svg` (existing)
- `h1`: `SITE.slogan` (solid white, not gradient wash)
- Supporting `p`: short ops line using `SITE.positioning` or the existing production line about voice AI / CRM / field ops
- CTAs: `Link to=/contact` `.btn-primary` “Start a project”; `Link to=/portfolio` `.btn-outline` “View work”
- No stats, no badges, no cards in Hero

**ServicesPreview:** map existing service titles to a vertical list with `border-t border-line` rows; each row: title + one sentence + link to `/services`.

**FeaturedWork:** take top approved projects (existing data helper); render as rows: title | categories | outcome one-liner | link — not `ProjectCard` grid.

- [ ] **Step 4: Quiet ConsultationCTA**

In `ConsultationCTA.jsx`, replace `cta-panel` gradient classes with `border border-line bg-panel`.

- [ ] **Step 5: Run tests + browser**

Run: `node scripts/test-command-rail-tokens.mjs` → PASS  
Open `/` — first viewport brand test; scroll shows list sections.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home.jsx src/components/ConsultationCTA.jsx src/components/TrustBar.jsx scripts/test-command-rail-tokens.mjs
git commit -m "feat(ui): restructure Home for command-rail hero and work log"
```

---

### Task 4: Portfolio work-log index + case study chrome

**Files:**
- Modify: `src/pages/Portfolio.jsx`
- Modify: `src/components/portfolio/ProjectCard.jsx`
- Modify: `src/pages/PortfolioCaseStudy.jsx` (sticky TOC / rule layout; keep content)

**Interfaces:**
- Consumes: `getAllProjectCards` / existing category helpers; `CategoryTabs`
- Produces: Default index layout = single-column dense list (work log); optional keep `CategoryTabs`; `ProjectCard` gains `variant="row"` for list density; case study uses border rules + sticky TOC on `lg:`

- [ ] **Step 1: Failing test for portfolio grid density**

```js
const portfolio = fs.readFileSync(path.join(root, 'src/pages/Portfolio.jsx'), 'utf8')
must(!portfolio.includes('xl:grid-cols-3'), 'Portfolio index must not use 3-column card grid as primary')
must(portfolio.includes('variant="row"') || portfolio.includes("variant='row'") || portfolio.includes('work-log'), 'Portfolio uses row/work-log presentation')
```

- [ ] **Step 2: Run — expect FAIL on `xl:grid-cols-3`**

- [ ] **Step 3: Add `row` variant to `ProjectCard.jsx`**

When `variant === 'row'`:
- Horizontal flex row: title + summary + tech chips + CTA
- `border-b border-line`, no rounded card shadow, no cover image required (optional tiny mark)
- Keep case-study vs contact link logic unchanged

- [ ] **Step 4: Update `Portfolio.jsx`**

- Remove hero gradient/grid-pattern opacity theater (use solid ink + rule under page title)
- Replace `md:grid-cols-2 xl:grid-cols-3` project grids with `flex flex-col` mapping `<ProjectCard variant="row" />`
- Featured block: at most one featured row, not large media card
- Keep filters/`CategoryTabs` behavior

- [ ] **Step 5: Case study layout**

In `PortfolioCaseStudy.jsx`:
- Desktop: `lg:grid lg:grid-cols-[12rem_1fr] gap-10` with sticky TOC links to `#brief #system #delivery #outcome` (match existing section ids or add ids)
- Hairline borders between sections; no glass cards

- [ ] **Step 6: Tests + browser**

Run: `node scripts/test-command-rail-tokens.mjs`  
Open `/portfolio` and one `/portfolio/:slug` — list density + readable case study.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Portfolio.jsx src/components/portfolio/ProjectCard.jsx src/pages/PortfolioCaseStudy.jsx scripts/test-command-rail-tokens.mjs
git commit -m "feat(ui): portfolio work-log index and case study rail"
```

---

### Task 5: Services + Contact

**Files:**
- Modify: `src/pages/Services.jsx`
- Modify: `src/pages/Contact.jsx`
- Modify: `src/data/services.js` only if structure requires label fields (prefer no data change)

**Interfaces:**
- Consumes: existing services data array
- Produces: Linear service blocks (problem → build → fit) with `border-t border-line`; Contact form kept as interaction card with `bg-panel border border-line`

- [ ] **Step 1: Failing tests**

```js
const services = fs.readFileSync(path.join(root, 'src/pages/Services.jsx'), 'utf8')
must(services.includes('/contact') || /Discuss/i.test(services), 'Services links to contact')
must(!/xl:grid-cols-3/.test(services), 'Services avoids 3-column icon mosaic as primary layout')
const contact = fs.readFileSync(path.join(root, 'src/pages/Contact.jsx'), 'utf8')
must(
  contact.includes('border-line') || contact.includes('bg-panel') || contact.includes('bg-dark-900'),
  'Contact keeps bordered form surface',
)
```

- [ ] **Step 2: Run — document current FAIL reasons**

- [ ] **Step 3: Restyle Services**

- Page title + one supporting sentence  
- For each service: section with `border-t border-line py-10`  
- Subheads: Problem / What we build / Fit (use existing copy fields)  
- CTA text: `Discuss this` → `/contact`  
- Remove icon grids if present

- [ ] **Step 4: Restyle Contact**

- Short operational intro  
- Form wrapper: `bg-panel border border-line rounded-md p-6` (interaction card OK)  
- Primary submit uses `.btn-primary`  
- No decorative gradient panels

- [ ] **Step 5: Tests + browser `/services` `/contact`**

- [ ] **Step 6: Commit**

```bash
git add src/pages/Services.jsx src/pages/Contact.jsx scripts/test-command-rail-tokens.mjs
git commit -m "feat(ui): command-rail Services and Contact surfaces"
```

---

### Task 6: Dashboard shell polish (no auth changes)

**Files:**
- Modify: `src/pages/Dashboard.jsx` (classNames / layout chrome only)

**Interfaces:**
- Consumes: Existing `STORAGE_KEY`, `authHeader`, `loadAll`, `forceLogout` logic — **do not alter auth control flow**
- Produces: Sidebar `bg-panel border-r border-line`; active nav `text-cyan-400 bg-transparent border-l-2 border-cyan-500`; denser tables; remove heavy `rounded-2xl` glow panels where easy

- [ ] **Step 1: Safety test — auth symbols still present**

```js
const dash = fs.readFileSync(path.join(root, 'src/pages/Dashboard.jsx'), 'utf8')
must(dash.includes("orchestrix_dash_secret"), 'Dashboard auth storage key unchanged')
must(dash.includes('forceLogout') || dash.includes('setAuthed(false)'), 'Dashboard logout path remains')
must(dash.includes('/api/dashboard/stats/'), 'Dashboard still calls stats API')
```

- [ ] **Step 2: Run — must PASS before visual edits (baseline)**

- [ ] **Step 3: Visual-only class updates**

- Outer shell: `bg-ink` / `bg-dark-950`  
- Sidebar: `bg-panel border-r border-line`  
- Active page button: left cyan border, no `bg-primary-500/15` pill wash if it reads as SaaS  
- Stat cards: `border border-line bg-panel rounded-md` (keep structure)  
- Do **not** change `loadAll`, `LoginScreen` attempt logic, axios usage, or storage key

- [ ] **Step 4: Browser auth smoke**

Open `/dashboard` — login screen renders.  
Run: `curl.exe -s -o NUL -w "%{http_code} %{content_type}\n" http://127.0.0.1:5173/api/dashboard/stats/`  
Expected: `401` and `application/json` (via Vite proxy)

- [ ] **Step 5: Re-run token test + auth asserts — PASS**

- [ ] **Step 6: Commit**

```bash
git add src/pages/Dashboard.jsx scripts/test-command-rail-tokens.mjs
git commit -m "feat(ui): align dashboard shell with command-rail system"
```

---

### Task 7: Remaining public pages light pass + acceptance

**Files:**
- Modify: `src/pages/About.jsx`, `src/pages/Reviews.jsx`, `src/pages/PortfolioWorkHistory.jsx`, `src/pages/PrivacyPolicy.jsx` (class/token alignment only; no content rewrite)
- Modify: `docs/superpowers/specs/2026-11-24-orchestrix-command-rail-design.md` status → Implemented (partial/complete)

**Interfaces:**
- Consumes: Shared tokens/primitives
- Produces: No page left on old glass/glow hero patterns; acceptance checklist signed off locally

- [ ] **Step 1: Sweep anti-patterns**

Search and remove obvious `glow`, `backdrop-blur-2xl`, `hero-gradient grid-pattern` theater from About/Reviews/Work History headers where present. Keep content.

Run:

```bash
rg -n "glow-cyan|backdrop-blur-2xl|section-tag mb-4 inline-flex" src/pages
```

Expected after fix: few or zero matches in marketing pages (Privacy may keep dense legal layout).

- [ ] **Step 2: Full token test**

Run: `node scripts/test-command-rail-tokens.mjs` → PASS

- [ ] **Step 3: Acceptance checklist (manual)**

- [ ] `/` first viewport: logo + slogan dominate; no stats/cards  
- [ ] `/portfolio` reads as work log  
- [ ] `/services` linear blocks  
- [ ] `/contact` form works  
- [ ] `/dashboard` login UI shows; API still JSON 401  
- [ ] Mobile width ~390px usable  
- [ ] Keyboard Tab shows focus rings on CTAs  

- [ ] **Step 4: Commit**

```bash
git add src/pages/About.jsx src/pages/Reviews.jsx src/pages/PortfolioWorkHistory.jsx src/pages/PrivacyPolicy.jsx docs/superpowers/specs/2026-11-24-orchestrix-command-rail-design.md
git commit -m "feat(ui): finish command-rail pass on remaining public pages"
```

- [ ] **Step 5: Stop — ask user before production deploy**

Do **not** `git push` / Vercel deploy unless user explicitly requests.

---

## Spec coverage self-check

| Spec requirement | Task |
|------------------|------|
| Palette tokens ink/panel/line/copy/mute + cyan signal | Task 1 |
| Keep Syne + Source Sans | Task 1 (fonts unchanged) |
| No ALL-CAPS eyebrow spam | Tasks 1, 3 |
| Navbar/Footer command chrome | Task 2 |
| Home hero budget + below-fold order | Task 3 |
| Portfolio work log + case study rail | Task 4 |
| Services linear / Contact form card | Task 5 |
| Dashboard visual only; auth intact | Task 6 |
| Full public site + acceptance | Task 7 |
| No deploy without approval | Task 7 Step 5 |
| Preserve `/api` proxy | Task 6 curl check |

## Placeholder scan

No TBD/TODO steps; commands and code included.

## Type/name consistency

- Storage key remains `orchestrix_dash_secret`
- CSS vars: `--orch-ink|panel|line|copy|mute|signal`
- `ProjectCard` variant: `'row' | 'grid' | 'featured'`
