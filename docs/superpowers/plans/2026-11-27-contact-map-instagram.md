# Contact Map Embed + Instagram URL Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lazy-loaded Google Maps embed on `/contact` (Find us section), make office addresses open Google Maps from footer and privacy policy, and point all Instagram links to `https://www.instagram.com/orchestrixlabs`.

**Architecture:** Centralize map and social URLs in `src/lib/site.js` (`mapsOpenUrl`, `mapsEmbedUrl`, `SOCIAL.instagram`, `SOCIAL.instagramHandle`). Add a focused `ContactFindUsSection` component; wire Contact, Footer, and PrivacyPolicy to shared helpers. Gate constants with a small Node test script; guard behavior with Playwright E2E tests.

**Tech Stack:** Vite 5, React 18, Tailwind CSS 3, Framer Motion, react-intersection-observer, Playwright (`@playwright/test`).

**Spec:** `docs/superpowers/specs/2026-11-27-contact-map-instagram.md`

## Global Constraints

- Branch: `redesign-v2` under `orchestrixlabs/my website/orchestrix-frontend`
- Light paper theme only; use existing tokens (`paper-subtle`, `border-border`, `text-navy-*`, `cyan-accent`)
- Address text: `C157, Phase 7, Industrial Area, Mohali, Punjab, India` from `SITE.address.formatted` — do not invent coordinates
- Instagram canonical URL: `https://www.instagram.com/orchestrixlabs`
- Instagram display handle: `@orchestrixlabs`
- Map: Google query embed iframe — **no** Maps JavaScript API key
- External map links: `target="_blank"` + `rel="noopener noreferrer"`
- Do **not** deploy to production until the user explicitly approves
- Local E2E expects dev server at `http://localhost:5174` (see `playwright.config.ts`); if `npm run dev` binds another port, set `server.port: 5174` in `vite.config.js` or align Playwright `baseURL`

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/site.js` | `mapsOpenUrl`, `mapsEmbedUrl`, updated `SOCIAL.instagram` + `instagramHandle` |
| `scripts/test-site-location-social.mjs` | Assert map URL helpers and Instagram URL in source |
| `src/components/ContactFindUsSection.jsx` | Find us UI + lazy iframe |
| `src/pages/Contact.jsx` | Insert section between hero and form; DRY office `href` |
| `src/components/Footer.jsx` | Clickable address via `mapsOpenUrl()` |
| `src/pages/PrivacyPolicy.jsx` | Clickable operations address |
| `index.html` | JSON-LD `sameAs` Instagram entry |
| `public/llms.txt` | Instagram line for LLM crawlers |
| `package.json` | `test:site-location-social` script |
| `tests/e2e/features/contact-map.spec.ts` | E2E for map section, footer address, Instagram |

---

### Task 1: Site constants — maps helpers + Instagram

**Files:**
- Modify: `src/lib/site.js`
- Create: `scripts/test-site-location-social.mjs`
- Modify: `package.json` (scripts section)

**Interfaces:**
- Consumes: `SITE.address.formatted` (existing)
- Produces:
  - `export function mapsOpenUrl(addressFormatted = SITE.address.formatted): string`
  - `export function mapsEmbedUrl(addressFormatted = SITE.address.formatted): string`
  - `SOCIAL.instagram === 'https://www.instagram.com/orchestrixlabs'`
  - `SOCIAL.instagramHandle === '@orchestrixlabs'`

- [ ] **Step 1: Write the failing site constants test**

Create `scripts/test-site-location-social.mjs`:

```js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const sitePath = path.join(root, 'src/lib/site.js')
const siteSrc = fs.readFileSync(sitePath, 'utf8')

const failures = []
function must(cond, msg) {
  if (!cond) failures.push(msg)
}

must(
  siteSrc.includes("instagram: 'https://www.instagram.com/orchestrixlabs'"),
  'SOCIAL.instagram must be https://www.instagram.com/orchestrixlabs',
)
must(
  siteSrc.includes("instagramHandle: '@orchestrixlabs'"),
  'SOCIAL must define instagramHandle @orchestrixlabs',
)
must(siteSrc.includes('export function mapsOpenUrl'), 'site.js must export mapsOpenUrl')
must(siteSrc.includes('export function mapsEmbedUrl'), 'site.js must export mapsEmbedUrl')
must(
  !siteSrc.includes('orchestrix_labs__ai_dev_agency'),
  'remove old Instagram handle URL from site.js',
)

if (failures.length) {
  console.error('test-site-location-social FAILED:\n' + failures.map((f) => `  - ${f}`).join('\n'))
  process.exit(1)
}

const { SITE, SOCIAL, mapsOpenUrl, mapsEmbedUrl } = await import(`file://${sitePath.replace(/\\/g, '/')}`)

must(
  mapsOpenUrl() === `https://maps.google.com/?q=${encodeURIComponent(SITE.address.formatted)}`,
  'mapsOpenUrl must match google search URL',
)
must(
  mapsEmbedUrl().includes('output=embed'),
  'mapsEmbedUrl must use output=embed',
)
must(
  mapsEmbedUrl().includes(encodeURIComponent(SITE.address.formatted)),
  'mapsEmbedUrl must encode formatted address',
)
must(SOCIAL.instagram === 'https://www.instagram.com/orchestrixlabs', 'runtime SOCIAL.instagram mismatch')

console.log('test-site-location-social OK')
```

- [ ] **Step 2: Run test to verify it fails**

Run from repo root `orchestrix-frontend`:

```bash
node scripts/test-site-location-social.mjs
```

Expected: FAIL (missing `mapsOpenUrl` / wrong Instagram)

- [ ] **Step 3: Implement `site.js` helpers and Instagram**

In `src/lib/site.js`, replace the `SOCIAL` block and append helpers after `export const SOCIAL` (keep `SITE` unchanged):

```js
export const SOCIAL = {
  linkedin: 'https://linkedin.com/company/orchestrix-labs',
  github: 'https://github.com/orchestrixlabs',
  upwork: 'https://www.upwork.com/agencies/1464061503601672192/',
  instagram: 'https://www.instagram.com/orchestrixlabs',
  instagramHandle: '@orchestrixlabs',
}

/** Open Google Maps in a new tab (search by formatted address). */
export function mapsOpenUrl(addressFormatted = SITE.address.formatted) {
  return `https://maps.google.com/?q=${encodeURIComponent(addressFormatted)}`
}

/** Lazy iframe embed — no API key required. */
export function mapsEmbedUrl(addressFormatted = SITE.address.formatted) {
  const q = encodeURIComponent(addressFormatted)
  return `https://maps.google.com/maps?q=${q}&output=embed`
}
```

Note: `seoSchemas.js` uses `Object.values(SOCIAL)` — `instagramHandle` is included in JSON-LD `sameAs`. Exclude non-URL entries:

In `src/lib/seoSchemas.js`, replace both `sameAs: Object.values(SOCIAL),` occurrences with:

```js
    sameAs: Object.entries(SOCIAL)
      .filter(([key]) => key !== 'instagramHandle')
      .map(([, url]) => url),
```

- [ ] **Step 4: Add npm script and run test**

In `package.json` scripts, add:

```json
"test:site-location-social": "node scripts/test-site-location-social.mjs",
```

Run:

```bash
npm run test:site-location-social
```

Expected: `test-site-location-social OK`

- [ ] **Step 5: Commit**

```bash
git add src/lib/site.js src/lib/seoSchemas.js scripts/test-site-location-social.mjs package.json
git commit -m "feat: centralize maps URLs and update Instagram profile"
```

---

### Task 2: Contact Find us section component

**Files:**
- Create: `src/components/ContactFindUsSection.jsx`
- Modify: `src/pages/Contact.jsx`

**Interfaces:**
- Consumes: `mapsOpenUrl`, `mapsEmbedUrl`, `SITE` from `../lib/site`
- Produces: default export `ContactFindUsSection` rendering `#find-us` section with iframe

- [ ] **Step 1: Write the failing E2E test (map section)**

Create `tests/e2e/features/contact-map.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test.describe('Contact — Find us map', () => {
  test('shows find-us section with map iframe', async ({ page }) => {
    await page.goto('/contact')
    const section = page.locator('#find-us')
    await expect(section).toBeVisible()
    await expect(section.getByRole('heading', { name: /find us/i })).toBeVisible()
    const iframe = section.locator('iframe[title*="Google Maps"]')
    await expect(iframe).toBeVisible()
    await expect(iframe).toHaveAttribute('loading', 'lazy')
  })

  test('footer address and Instagram use canonical URLs', async ({ page }) => {
    await page.goto('/')
    const addressLink = page.locator('footer a[href*="maps.google"]')
    await expect(addressLink).toBeVisible()
    await expect(addressLink).toContainText(/Mohali/)
    const instagram = page.locator('footer a[aria-label="Instagram"]')
    await expect(instagram).toHaveAttribute('href', 'https://www.instagram.com/orchestrixlabs')
  })
})
```

- [ ] **Step 2: Run E2E to verify failure**

```bash
npm run test:e2e -- tests/e2e/features/contact-map.spec.ts --project=chromium
```

Expected: FAIL — `#find-us` not found (and possibly footer address link missing)

- [ ] **Step 3: Create `ContactFindUsSection.jsx`**

```jsx
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiExternalLink, FiMapPin } from 'react-icons/fi'
import { SITE, mapsEmbedUrl, mapsOpenUrl } from '../lib/site'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function ContactFindUsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.12 })
  const mapsUrl = mapsOpenUrl()
  const embedUrl = mapsEmbedUrl()

  return (
    <motion.section
      id="find-us"
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className="pb-4 pt-2 scroll-mt-28"
      aria-labelledby="find-us-heading"
    >
      <div className="container">
        <span className="section-tag mb-4 inline-flex">Office</span>
        <h2 id="find-us-heading" className="section-heading text-2xl md:text-3xl mb-3">
          Find us
        </h2>
        <p className="section-sub max-w-2xl mb-5">
          Remote-first for clients worldwide. Our Mohali office is available for scheduled in-person meetings.
        </p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-start gap-2 text-sm text-navy-secondary hover:text-cyan-accent transition-colors mb-6 max-w-xl"
        >
          <FiMapPin className="flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
          <span>{SITE.address.formatted}</span>
        </a>
        <div className="bg-paper-subtle border border-border rounded-md overflow-hidden">
          <div className="relative w-full aspect-video min-h-[280px] md:min-h-[360px]">
            <iframe
              title={`Google Maps — ${SITE.address.formatted}`}
              src={embedUrl}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
        <p className="mt-4 text-sm">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-navy-secondary hover:text-cyan-accent underline-offset-2 hover:underline transition-colors"
          >
            Open in Google Maps
            <FiExternalLink size={14} aria-hidden="true" />
          </a>
        </p>
      </div>
    </motion.section>
  )
}
```

- [ ] **Step 4: Wire into `Contact.jsx`**

Add import:

```js
import ContactFindUsSection from '../components/ContactFindUsSection'
import { mapsOpenUrl, SOCIAL } from '../lib/site'
```

Update Instagram row in `contactInfo` (replace hardcoded value/href):

```js
  { icon: FiInstagram, label: 'Instagram', value: SOCIAL.instagramHandle, href: SOCIAL.instagram },
```

Update Office row href:

```js
  { icon: FiMapPin, label: 'Office', value: SITE.address.formatted, href: mapsOpenUrl() },
```

Insert **between** the closing `</section>` of the hero (line ~171) and `<Section className="py-16">`:

```jsx
      <ContactFindUsSection />
```

- [ ] **Step 5: Run E2E map test**

```bash
npm run test:e2e -- tests/e2e/features/contact-map.spec.ts --project=chromium
```

Expected: first test PASS; footer test may still FAIL until Task 3

- [ ] **Step 6: Commit**

```bash
git add src/components/ContactFindUsSection.jsx src/pages/Contact.jsx tests/e2e/features/contact-map.spec.ts
git commit -m "feat: add Find us map section on contact page"
```

---

### Task 3: Clickable address — Footer and Privacy Policy

**Files:**
- Modify: `src/components/Footer.jsx`
- Modify: `src/pages/PrivacyPolicy.jsx`

**Interfaces:**
- Consumes: `mapsOpenUrl` from `../lib/site` (Footer) / `../../lib/site` path as used in PrivacyPolicy (`../lib/site`)

- [ ] **Step 1: Footer — replace plain address paragraph**

In `Footer.jsx`, add import:

```js
import { SITE, SOCIAL, mapsOpenUrl } from '../lib/site'
```

Replace the address `<p>...</p>` block (lines ~50–53) with:

```jsx
              <a
                href={mapsOpenUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-navy-muted hover:text-cyan-accent text-xs leading-relaxed max-w-sm transition-colors"
              >
                <FiMapPin className="flex-shrink-0 mt-0.5" size={12} aria-hidden="true" focusable="false" />
                {SITE.address.formatted}
              </a>
```

(`SOCIAL` import already supplies Instagram icon link — no Footer change needed for Instagram beyond Task 1 `site.js`.)

- [ ] **Step 2: Privacy Policy — link operations address**

In `PrivacyPolicy.jsx`, add `mapsOpenUrl` to the existing `SITE` import:

```js
import { SITE, mapsOpenUrl } from '../lib/site'
```

Replace the operations location list item body:

```jsx
                  <li>
                    <span className="text-slate-400">Operations location (public contact address):</span>{' '}
                    <a
                      href={mapsOpenUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-300 hover:text-navy-primary underline-offset-2 hover:underline"
                    >
                      {SITE.address.formatted}
                    </a>
                  </li>
```

- [ ] **Step 3: Run full E2E suite**

```bash
npm run test:e2e --project=chromium
```

Expected: all tests PASS (including new contact-map spec)

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.jsx src/pages/PrivacyPolicy.jsx
git commit -m "feat: link office address to Google Maps sitewide"
```

---

### Task 4: Static SEO copies — index.html + llms.txt

**Files:**
- Modify: `index.html` (JSON-LD `sameAs`)
- Modify: `public/llms.txt`

**Interfaces:**
- Consumes: canonical Instagram URL (must match `SOCIAL.instagram`)

- [ ] **Step 1: Extend failing test for static files**

Append to `scripts/test-site-location-social.mjs` before the final OK log:

```js
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
const llms = fs.readFileSync(path.join(root, 'public/llms.txt'), 'utf8')

must(
  indexHtml.includes('https://www.instagram.com/orchestrixlabs'),
  'index.html sameAs must list new Instagram URL',
)
must(
  !indexHtml.includes('orchestrix_labs__ai_dev_agency'),
  'index.html must not contain old Instagram URL',
)
must(
  llms.includes('https://www.instagram.com/orchestrixlabs'),
  'public/llms.txt must list new Instagram URL',
)
must(
  !llms.includes('orchestrix_labs__ai_dev_agency'),
  'public/llms.txt must not contain old Instagram URL',
)
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm run test:site-location-social
```

- [ ] **Step 3: Update static files**

In `index.html`, replace the Instagram entry inside `sameAs`:

```json
        "https://www.instagram.com/orchestrixlabs",
```

In `public/llms.txt`, replace the Instagram line:

```text
- Instagram: https://www.instagram.com/orchestrixlabs
```

- [ ] **Step 4: Run tests**

```bash
npm run test:site-location-social
npm run test:e2e --project=chromium
```

Expected: both PASS

- [ ] **Step 5: Commit**

```bash
git add index.html public/llms.txt scripts/test-site-location-social.mjs
git commit -m "chore: sync Instagram URL in JSON-LD and llms.txt"
```

---

### Task 5: Manual QA checklist (no deploy)

**Files:** none

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Open `http://localhost:5174/contact#find-us` (or the port Vite prints if not 5174).

- [ ] **Step 2: Verify UI**

1. Hero → **Find us** → form grid order is correct.
2. Map iframe loads and pan/zoom works inside the frame.
3. “Open in Google Maps” opens correct location in a new tab.
4. Footer address link opens Google Maps.
5. `/privacy-policy` operations address is linked.
6. Footer + Contact Instagram → `https://www.instagram.com/orchestrixlabs`.
7. No old `orchestrix_labs__ai_dev_agency` in page source (`view-source` or DevTools).

- [ ] **Step 3: Document for user review**

Add a short note to `docs/DESIGN-IMPROVEMENTS.md` or `docs/status.md` (parent `my website/docs/status.md` if that is your tracker):

```markdown
## 2026-11-27 — Contact map + Instagram
- Contact: Find us embed + #find-us
- Footer / Privacy: clickable office address
- Instagram → https://www.instagram.com/orchestrixlabs
- E2E: tests/e2e/features/contact-map.spec.ts
```

**Do not** run production build/deploy unless the user asks.

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| Find us section option C on Contact | Task 2 |
| Lazy Google iframe embed, no API key | Task 1–2 |
| Clickable footer + privacy address | Task 3 |
| Instagram URL site-wide | Task 1, 4, Contact row Task 2 |
| `seoSchemas` excludes handle from sameAs | Task 1 |
| E2E coverage | Task 2–4 |
| No deploy until approval | Task 5 |

Placeholder scan: none — all steps include concrete paths and code.

Type consistency: `mapsOpenUrl` / `mapsEmbedUrl` / `SOCIAL.instagram` / `instagramHandle` defined in Task 1, consumed in Tasks 2–4.