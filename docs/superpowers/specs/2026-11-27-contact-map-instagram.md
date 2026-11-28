# Contact map embed + Instagram URL — design spec

**Approved:** 2026-11-27  
**Branch:** `redesign-v2`  
**Deploy:** Only after explicit user approval  

## Goals

1. Embed an interactive Google Map on `/contact` in a dedicated **Find us** section (between page hero and form/sidebar).
2. Make the public office address **clickable** everywhere it appears as plain text (footer, privacy policy).
3. Update the official Instagram profile URL to `https://www.instagram.com/orchestrixlabs` site-wide (UI, JSON-LD, llms.txt).

## Non-goals

- Google Maps JavaScript API / paid embed key
- Footer-only map (user chose Contact embed + clickable links elsewhere)
- Production deploy in this change set

## Contact page — Find us (option C)

- **Anchor:** `id="find-us"`
- **Placement:** After hero section (`pt-36`), before form grid (`Section className="py-16"`).
- **Content:** Section tag, heading, one line on remote-first + Mohali office, linked formatted address, map card, “Open in Google Maps” text link.
- **Map:** Lazy-loaded `iframe` using query embed URL derived from `SITE.address.formatted` (no API key).
- **Heights:** `min-h-[280px]` mobile, `md:min-h-[360px]`, `aspect-video` wrapper, `rounded-md`, `border-border`, `bg-paper-subtle`.
- **Motion:** Reuse Contact page `Section` / `fadeUp` patterns.

## Clickable address (elsewhere)

- **Footer:** Replace plain `<p>` address with `<a href={mapsOpenUrl()} target="_blank" rel="noopener noreferrer">` matching email link hover tokens.
- **Privacy policy:** Operations location address → same maps URL, underline on hover.
- **Contact sidebar Office row:** Keep behavior; switch `href` to shared `mapsOpenUrl()` (DRY).

## Instagram

- **Canonical URL:** `https://www.instagram.com/orchestrixlabs`
- **Display handle on Contact:** `@orchestrixlabs` (from `SOCIAL.instagramHandle` in `site.js`)
- **Sources of truth:** `src/lib/site.js` → `SOCIAL.instagram` (+ handle); propagate via existing `Object.values(SOCIAL)` in `seoSchemas.js`; update static copies in `index.html` JSON-LD `sameAs` and `public/llms.txt`.

## Privacy / performance

- Iframe `loading="lazy"`, `referrerPolicy="no-referrer-when-downgrade"`, descriptive `title` for screen readers.
- Third-party Google content may set cookies; no new cookie banner copy required unless legal asks.

## Verification

- `node scripts/test-site-location-social.mjs`
- `npm run test:e2e` (Chromium + mobile projects)
- Manual: `/contact#find-us`, footer address + Instagram links