# Orchestrix Labs — Design System (redesign-v2)

## Positioning

Production AI engineering for operators with real deadlines.

**Memorable line:** *We ship production AI and automation — not demos.*

## Color (paper theme)

- Surfaces: `paper-base`, `paper-elevated`, `paper-subtle`
- Text: `navy-primary`, `navy-body`, `navy-secondary`, `navy-muted`
- Signal accent: `cyan-accent` — primary actions and active nav only

## Typography

- IBM Plex Sans
- Hero: semibold, tight tracking, balanced line lengths
- Body: relaxed leading, max measure ~65ch

## Layout

- Editorial sections over equal card grids
- Case studies as rows with clear hierarchy
- Contact: Request consultation form → Find us (map)
- Book: dedicated `/book` page with Cal.com embed

## CTAs

- **Book a 30-min call** → `/book` when `VITE_CALCOM_BOOKING_URL` is set
- **Request consultation** / portfolio CTAs → `/contact` (context-first)

## Motion

- One intentional reveal per block; honor `prefers-reduced-motion`
- Avoid stacking fade-up on every section

## Trust

- Verified Upwork and portfolio claims only
- No invented client or project counts
- Privacy policy lists real processors (Cal.com, Google Maps, analytics, etc.)