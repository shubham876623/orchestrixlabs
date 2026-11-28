# Cal.com hybrid booking — design spec

**Approved:** 2026-11-27 (user choices via design consultation)  
**Branch:** `redesign-v2`  
**Deploy:** Only after explicit user approval  

## Goals

1. Connect **Cal.com** (synced to **Google Calendar** in Cal.com admin — not on-site Google OAuth).
2. **Hybrid flow:** keep contact form for project context; add prominent **pick a time** via Cal.com embed on Contact.
3. Align **“Book a call” / “Book a 30-min call”** CTAs with real scheduling (not only the form).
4. Document booking URL in env; mention Cal.com in privacy policy.

## Non-goals

- Google Calendar API / OAuth on the marketing site
- Replacing the Django contact API
- HubSpot Meetings integration on the public site
- Production deploy in this change set

## User decisions (locked)

| Topic | Choice |
|-------|--------|
| Stack | Cal.com linked to Google Calendar |
| Flow | Hybrid: form + Cal embed |
| CTA behavior | Primary book CTAs → `/contact#book` (scroll to embed); form remains on same page |

## Configuration

- **Env:** `VITE_CALCOM_BOOKING_URL` — full public event URL, e.g. `https://cal.com/orchestrixlabs/discovery`
- **Source of truth in app:** `BOOKING.url` derived from `import.meta.env.VITE_CALCOM_BOOKING_URL` in `src/lib/site.js`
- **Embed:** append `embed=true` query param for iframe (`calComEmbedUrl()`)
- **Fallback:** if URL empty, CTAs behave as today (`/contact` only); embed section hidden with console warning in dev

## Contact page layout

Order (existing + new):

1. Hero (unchanged)
2. Find us (`#find-us`) — already shipped
3. **Book a time** (`#book`) — new section: heading, short copy, Cal iframe, link “Open scheduler in new tab”
4. Form + sidebar grid (unchanged)

Post-form success (optional enhancement in plan): add link “Pick a time on the calendar” → `#book`.

## CTA matrix

| Location | New target |
|----------|------------|
| Navbar desktop/mobile “Book a call” | `/contact#book` when `BOOKING.url` set |
| Home hero + mid-page “Book a 30-min call” | `/contact#book` when set |
| WhoItsFor “Book a 30-min call” | same |
| “Request consultation” / portfolio CTAs | stay `/contact` (context-first) unless copy updated later |

## Privacy

Add Cal.com under third-party scheduling in Privacy Policy (processors / external services section), with link to [Cal.com Privacy](https://cal.com/privacy).

## Testing

- `scripts/test-site-booking.mjs` — asserts helpers + env example documents `VITE_CALCOM_BOOKING_URL`
- Playwright `tests/e2e/features/contact-booking.spec.ts` — `#book` visible when env set in `playwright.config.ts`
- Existing E2E updated: nav book button navigates to `/contact` with hash or scroll target

## Founder setup (manual, not code)

1. Create Cal.com account; connect Google Calendar.
2. Create **30-min discovery** event type; copy public link into `VITE_CALCOM_BOOKING_URL` (local `.env` + production env).