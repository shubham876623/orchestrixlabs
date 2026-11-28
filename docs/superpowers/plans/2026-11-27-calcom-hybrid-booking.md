# Cal.com Hybrid Booking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Cal.com scheduling on the Contact page (hybrid with the existing form) and route primary “Book a call” CTAs to `/contact#book`, driven by `VITE_CALCOM_BOOKING_URL`.

**Architecture:** Centralize booking URL helpers in `src/lib/site.js`. Render a `ContactBookingSection` with a lazy Cal.com iframe when a URL is configured; reuse a small `BookCallLink` for nav/hero links. Gate configuration with a Node test script; verify with Playwright. Google Calendar sync happens only inside Cal.com (founder setup).

**Tech Stack:** Vite 5, React 18, React Router, Tailwind CSS 3, Playwright, Cal.com embed iframe (no npm Cal SDK).

**Spec:** `docs/superpowers/specs/2026-11-27-calcom-hybrid-booking.md`

## Global Constraints

- Branch: `redesign-v2` in `orchestrixlabs/my website/orchestrix-frontend`
- Light paper theme: `paper-*`, `navy-*`, `cyan-accent` tokens only
- Do not remove or weaken the contact form or `/api/contact/` submission
- Booking URL from env: `VITE_CALCOM_BOOKING_URL` (no hardcoded production URL in `site.js` source)
- Example URL for tests/docs only: `https://cal.com/orchestrixlabs/discovery` — founder replaces with live event link
- External links: `rel="noopener noreferrer"`; embed iframe `loading="lazy"` and descriptive `title`
- No Google OAuth or Calendar API on the frontend
- Do **not** deploy until the user explicitly approves
- Playwright `baseURL`: `http://localhost:5174`; pass `VITE_CALCOM_BOOKING_URL` into `webServer.env` so E2E sees the embed
- Memorable positioning line (design): *This agency ships production AI and automation — not demos.*

---

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/site.js` | `getCalComBookingUrl`, `calComEmbedUrl`, `contactBookHref`, `BOOKING` labels |
| `.env.example` | Document `VITE_CALCOM_BOOKING_URL` |
| `playwright.config.ts` | Inject test booking URL for dev server |
| `scripts/test-site-booking.mjs` | Assert helpers + `.env.example` |
| `package.json` | `test:site-booking` script |
| `src/components/ContactBookingSection.jsx` | `#book` section + Cal iframe |
| `src/components/BookCallLink.jsx` | DRY `Link` to `/contact#book` or `/contact` |
| `src/pages/Contact.jsx` | Insert booking section; success state link to `#book` |
| `src/components/Navbar.jsx` | Book CTA via `BookCallLink` |
| `src/pages/Home.jsx` | Hero CTAs via `BookCallLink` |
| `src/components/home/WhoItsFor.jsx` | Book CTA via `BookCallLink` |
| `src/pages/PrivacyPolicy.jsx` | Cal.com scheduling processor note |
| `DESIGN.md` | Enterprise polish principles (paper theme) |
| `src/components/ConsultationCTA.jsx` | Align tokens to paper theme |
| `tests/e2e/features/contact-booking.spec.ts` | E2E for `#book` + nav hash |
| `tests/e2e/pages/HomePage.ts` | Update `navigateToBook` expectation if needed |

---

### Task 1: Booking URL helpers + env example

**Files:**
- Modify: `src/lib/site.js`
- Create: `.env.example`
- Create: `scripts/test-site-booking.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces:
  - `export const BOOKING = { durationLabel: '30-min call', eventLabel: 'Discovery call' }`
  - `export function getCalComBookingUrl(): string`
  - `export function calComEmbedUrl(bookingUrl?: string): string`
  - `export function contactBookHref(): '/contact#book' | '/contact'`
  - `export function hasCalComBooking(): boolean`

- [ ] **Step 1: Write the failing test**

Create `scripts/test-site-booking.mjs`:

```js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const sitePath = path.join(root, 'src/lib/site.js')
const siteSrc = fs.readFileSync(sitePath, 'utf8')
const envExample = fs.readFileSync(path.join(root, '.env.example'), 'utf8')

const failures = []
function must(cond, msg) {
  if (!cond) failures.push(msg)
}

must(siteSrc.includes('export function getCalComBookingUrl'), 'site.js must export getCalComBookingUrl')
must(siteSrc.includes('export function calComEmbedUrl'), 'site.js must export calComEmbedUrl')
must(siteSrc.includes('export function contactBookHref'), 'site.js must export contactBookHref')
must(envExample.includes('VITE_CALCOM_BOOKING_URL='), '.env.example must document VITE_CALCOM_BOOKING_URL')
must(
  !/https:\/\/cal\.com\/[a-z0-9-]+\/[a-z0-9-]+/.test(siteSrc),
  'do not hardcode a real cal.com URL in site.js (use import.meta.env only)',
)

if (failures.length) {
  console.error('test-site-booking FAILED:\n' + failures.map((f) => `  - ${f}`).join('\n'))
  process.exit(1)
}

const siteFileUrl = new URL('../src/lib/site.js', import.meta.url).href
const { calComEmbedUrl, contactBookHref, getCalComBookingUrl } = await import(siteFileUrl)

const sample = 'https://cal.com/orchestrixlabs/discovery'
const embed = calComEmbedUrl(sample)
must(embed.includes('embed=true'), 'calComEmbedUrl must set embed=true')
must(embed.startsWith('https://cal.com/'), 'embed must preserve cal.com host')

process.env.VITE_CALCOM_BOOKING_URL = sample
// Re-import not possible in same process without dynamic reload — assert pure helpers only above.
// contactBookHref depends on import.meta.env at build time; smoke empty:
must(typeof contactBookHref() === 'string', 'contactBookHref returns string')
must(['/contact', '/contact#book'].includes(contactBookHref()) || contactBookHref().startsWith('/contact'), 'contactBookHref must be contact path')

console.log('test-site-booking OK')
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd "C:/Users/HP/OneDrive/Desktop/shubham persnol/orchestrixlabs/my website/orchestrix-frontend"
node scripts/test-site-booking.mjs
```

Expected: FAIL (missing helpers / missing `.env.example`)

- [ ] **Step 3: Implement helpers**

Append to `src/lib/site.js` (after map helpers):

```js
export const BOOKING = {
  durationLabel: '30-min call',
  eventLabel: 'Discovery call',
}

/** Public Cal.com event URL from Vite env; empty when unset. */
export function getCalComBookingUrl() {
  const raw = import.meta.env.VITE_CALCOM_BOOKING_URL
  return typeof raw === 'string' && raw.trim() ? raw.trim() : ''
}

export function hasCalComBooking() {
  return getCalComBookingUrl().length > 0
}

/** iframe-friendly Cal.com URL. */
export function calComEmbedUrl(bookingUrl = getCalComBookingUrl()) {
  if (!bookingUrl) return ''
  try {
    const u = new URL(bookingUrl)
    u.searchParams.set('embed', 'true')
    return u.toString()
  } catch {
    return ''
  }
}

/** Primary “book a call” route — hash scrolls to embed on Contact. */
export function contactBookHref() {
  return hasCalComBooking() ? '/contact#book' : '/contact'
}
```

Create `.env.example`:

```bash
# Public Cal.com event link (connect Google Calendar inside Cal.com admin)
VITE_CALCOM_BOOKING_URL=https://cal.com/orchestrixlabs/discovery

# Optional: local API proxy (see vite.config.js)
# VITE_PROXY_API=http://127.0.0.1:8000
```

Add to `package.json` scripts:

```json
"test:site-booking": "node scripts/test-site-booking.mjs",
```

- [ ] **Step 4: Run test**

```bash
npm run test:site-booking
```

Expected: `test-site-booking OK`

- [ ] **Step 5: Commit**

```bash
git add src/lib/site.js .env.example scripts/test-site-booking.mjs package.json
git commit -m "feat: add Cal.com booking URL helpers and env example"
```

---

### Task 2: Contact booking section (`#book`)

**Files:**
- Create: `src/components/ContactBookingSection.jsx`
- Modify: `src/pages/Contact.jsx`
- Modify: `playwright.config.ts`
- Create: `tests/e2e/features/contact-booking.spec.ts`

**Interfaces:**
- Consumes: `getCalComBookingUrl`, `calComEmbedUrl`, `BOOKING` from `../lib/site`
- Produces: default export `ContactBookingSection` (renders `null` when no URL)

- [ ] **Step 1: Write failing E2E**

Create `tests/e2e/features/contact-booking.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test.describe('Contact — Cal.com booking', () => {
  test('shows book section with Cal embed when env is set', async ({ page }) => {
    await page.goto('/contact')
    const section = page.locator('#book')
    await expect(section).toBeVisible()
    await expect(section.getByRole('heading', { name: /book a time/i })).toBeVisible()
    const iframe = section.locator('iframe[title*="Cal"]')
    await expect(iframe).toBeVisible()
    await expect(iframe).toHaveAttribute('loading', 'lazy')
    const src = await iframe.getAttribute('src')
    expect(src).toContain('cal.com')
    expect(src).toContain('embed=true')
  })

  test('nav Book a call goes to contact hash', async ({ page }) => {
    await page.goto('/')
    await page.locator('header a', { hasText: 'Book a call' }).first().click()
    await expect(page).toHaveURL(/\/contact#book/)
    await expect(page.locator('#book')).toBeVisible()
  })
})
```

In `playwright.config.ts`, extend `webServer`:

```ts
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      VITE_CALCOM_BOOKING_URL:
        process.env.VITE_CALCOM_BOOKING_URL ||
        'https://cal.com/orchestrixlabs/discovery',
    },
  },
```

- [ ] **Step 2: Run E2E — expect RED**

```bash
npm run test:e2e -- tests/e2e/features/contact-booking.spec.ts --project=chromium --workers=1
```

Expected: FAIL — `#book` not found

- [ ] **Step 3: Create `ContactBookingSection.jsx`**

```jsx
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiCalendar, FiExternalLink } from 'react-icons/fi'
import { BOOKING, calComEmbedUrl, getCalComBookingUrl } from '../lib/site'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function ContactBookingSection() {
  const bookingUrl = getCalComBookingUrl()
  if (!bookingUrl) return null

  const embedUrl = calComEmbedUrl(bookingUrl)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })

  return (
    <motion.section
      id="book"
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className="py-10 scroll-mt-28 border-b border-border"
      aria-labelledby="book-heading"
    >
      <div className="container">
        <span className="section-tag mb-4 inline-flex">Schedule</span>
        <h2 id="book-heading" className="section-heading text-2xl md:text-3xl mb-3">
          Book a time
        </h2>
        <p className="section-sub max-w-2xl mb-6">
          Pick a {BOOKING.durationLabel} for a {BOOKING.eventLabel.toLowerCase()}. You can still send a written brief below
          if you prefer async first contact.
        </p>
        <div className="bg-paper-subtle border border-border rounded-md overflow-hidden">
          <div className="relative w-full min-h-[520px] md:min-h-[600px]">
            <iframe
              title={`Cal.com — ${BOOKING.eventLabel}`}
              src={embedUrl}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              allow="camera; microphone; clipboard-write"
            />
          </div>
        </div>
        <p className="mt-4 text-sm">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-navy-secondary hover:text-cyan-accent underline-offset-2 hover:underline transition-colors"
          >
            <FiCalendar size={14} aria-hidden="true" />
            Open scheduler in a new tab
            <FiExternalLink size={14} aria-hidden="true" />
          </a>
        </p>
      </div>
    </motion.section>
  )
}
```

- [ ] **Step 4: Wire `Contact.jsx`**

Add import:

```js
import ContactBookingSection from '../components/ContactBookingSection'
```

Insert **after** `<ContactFindUsSection />` and **before** the form `<Section className="py-16">`:

```jsx
      <ContactBookingSection />
```

In the form success block, after the thank-you copy, add:

```jsx
                    {hasCalComBooking() && (
                      <a href="#book" className="btn-primary text-sm px-5 py-2.5 mt-2 inline-flex">
                        Pick a time on the calendar
                      </a>
                    )}
```

Add `hasCalComBooking` to the `site.js` import line.

- [ ] **Step 5: Run E2E**

```bash
npm run test:e2e -- tests/e2e/features/contact-booking.spec.ts --project=chromium --workers=1
```

Expected: first test PASS; second may FAIL until Task 3

- [ ] **Step 6: Commit**

```bash
git add src/components/ContactBookingSection.jsx src/pages/Contact.jsx playwright.config.ts tests/e2e/features/contact-booking.spec.ts
git commit -m "feat: add Cal.com booking section on contact page"
```

---

### Task 3: `BookCallLink` + primary CTAs

**Files:**
- Create: `src/components/BookCallLink.jsx`
- Modify: `src/components/Navbar.jsx`
- Modify: `src/pages/Home.jsx`
- Modify: `src/components/home/WhoItsFor.jsx`

**Interfaces:**
- Consumes: `contactBookHref`, `BOOKING` from `../lib/site`
- Produces: `BookCallLink` with props `{ className?, children? }`

- [ ] **Step 1: Create `BookCallLink.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { BOOKING, contactBookHref } from '../lib/site'

export default function BookCallLink({ className = 'btn-primary', children }) {
  const label = children ?? `Book a ${BOOKING.durationLabel}`
  return (
    <Link to={contactBookHref()} className={className}>
      {label}
    </Link>
  )
}
```

- [ ] **Step 2: Update `Navbar.jsx`**

```js
import BookCallLink from './BookCallLink'
```

Replace desktop CTA:

```jsx
          <BookCallLink className="btn-primary text-sm">Book a call</BookCallLink>
```

Replace mobile CTA:

```jsx
              <BookCallLink className="btn-primary mt-2">Book a call</BookCallLink>
```

- [ ] **Step 3: Update `Home.jsx`**

```js
import BookCallLink from '../components/BookCallLink'
```

Replace both hero `Link to="/contact"` book buttons with:

```jsx
          <BookCallLink />
```

and

```jsx
            <BookCallLink />
```

(Second instance may use different wrapper — keep className `btn-primary` via default.)

- [ ] **Step 4: Update `WhoItsFor.jsx`**

```js
import BookCallLink from '../BookCallLink'
```

Replace book link with `<BookCallLink />`.

- [ ] **Step 5: Run tests**

```bash
npm run test:e2e -- tests/e2e/features/contact-booking.spec.ts --project=chromium --workers=1
npm run test:e2e -- --project=chromium --workers=2
```

Expected: all PASS (17+ tests)

- [ ] **Step 6: Commit**

```bash
git add src/components/BookCallLink.jsx src/components/Navbar.jsx src/pages/Home.jsx src/components/home/WhoItsFor.jsx
git commit -m "feat: route primary book CTAs to contact booking embed"
```

---

### Task 4: Privacy policy + local env

**Files:**
- Modify: `src/pages/PrivacyPolicy.jsx`
- Create (local only, gitignored if needed): `.env` with real URL

**Interfaces:**
- None new; copy-only change plus founder env

- [ ] **Step 1: Add Cal.com disclosure**

In the third-party / scheduling section of `PrivacyPolicy.jsx` (near existing Google Maps mention), add a paragraph:

```jsx
                <p>
                  When you book a call through our embedded scheduler,{' '}
                  <a
                    href="https://cal.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-300 hover:text-navy-primary underline-offset-2 hover:underline"
                  >
                    Cal.com
                  </a>{' '}
                  processes your name, email, and chosen time slot to create the appointment. Cal.com is
                  configured by Orchestrix Labs to sync with our Google Calendar; we do not embed Google sign-in
                  on this website for booking.
                </p>
```

- [ ] **Step 2: Founder creates `.env` (not committed)**

```bash
cp .env.example .env
# Edit VITE_CALCOM_BOOKING_URL to the live Cal.com event link
```

Restart `npm run dev`.

- [ ] **Step 3: Manual verify**

1. `http://localhost:5174/contact#book` loads embed
2. Nav “Book a call” lands on hash
3. Form still submits
4. Success state shows calendar link when env set

- [ ] **Step 4: Commit (privacy only)**

```bash
git add src/pages/PrivacyPolicy.jsx
git commit -m "docs: disclose Cal.com scheduling in privacy policy"
```

---

### Task 5: Design system doc + ConsultationCTA token alignment

**Files:**
- Create: `DESIGN.md`
- Modify: `src/components/ConsultationCTA.jsx`

- [ ] **Step 1: Write `DESIGN.md`** (excerpt — write full file)

```markdown
# Orchestrix Labs — Design System (redesign-v2)

## Positioning
Production AI engineering for operators with real deadlines. Memorable line: *We ship production AI and automation — not demos.*

## Color (paper theme)
- Paper base, elevated, subtle surfaces
- Navy primary/body/secondary text
- Cyan accent: primary actions and active nav only

## Typography
- IBM Plex Sans; hero semibold tracking-tight; body leading-relaxed; max measure ~65ch

## Layout
- Editorial sections over equal card grids; case studies as rows
- One primary CTA per viewport: Book (`/contact#book`) vs Request consultation (`/contact`)

## Motion
- Single reveal per section max; honor prefers-reduced-motion

## Trust
- Verified Upwork claims only; no invented counts; privacy lists real processors (Cal.com, Google Maps, etc.)
```

- [ ] **Step 2: Fix `ConsultationCTA.jsx` classes**

Replace `border-line bg-panel` with `border-border bg-paper-subtle`.

Replace `font-display text-xl ... text-slate-900 dark:text-navy-primary` with `text-navy-primary font-bold text-xl`.

Replace body `text-slate-600 dark:text-slate-300` with `text-navy-body`.

- [ ] **Step 3: Visual smoke**

```bash
npm run dev
```

Skim Home, Contact, Portfolio case study CTA panel.

- [ ] **Step 4: Commit**

```bash
git add DESIGN.md src/components/ConsultationCTA.jsx
git commit -m "docs: add DESIGN.md and align consultation CTA tokens"
```

---

### Task 6: Founder Cal.com setup (manual checklist)

**Files:** none

- [ ] Connect **Google Calendar** in Cal.com → Settings → Calendars
- [ ] Create event **Discovery — 30 min**; set IST availability; buffers as needed
- [ ] Copy public link → `VITE_CALCOM_BOOKING_URL` in hosting env (Railway/Vercel/etc.) before production cutover
- [ ] Test booking creates event in Google Calendar
- [ ] Confirm email reminders in Cal.com

---

## Self-review

| Spec requirement | Task |
|------------------|------|
| Cal.com + Google via Cal admin | Task 6 |
| Hybrid form + embed | Tasks 2–4 |
| CTAs → `/contact#book` | Task 3 |
| Env-driven URL | Task 1 |
| Privacy disclosure | Task 4 |
| Tests | Tasks 1–3 |
| DESIGN.md enterprise direction | Task 5 |
| No deploy until approval | All tasks |

Placeholder scan: none.

Type consistency: `contactBookHref`, `getCalComBookingUrl`, `hasCalComBooking`, `calComEmbedUrl` defined in Task 1, used in Tasks 2–3.