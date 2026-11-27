# Task 5 Report: Services + Contact

Status: DONE (with concerns)

## Changes
- src/pages/Services.jsx: rewritten. Title + one sentence; each service is an `article.border-t.border-line.py-10` with Problem / What we build / Fit subheads; CTA "Discuss this" -> /contact. Icon map, gradients, rounded-3xl cards, glass CTA, grid-pattern hero removed. Process/FAQ/CTA restyled as hairline rows.
- src/pages/Contact.jsx: hero gradient/grid removed, left-aligned; form wrapper `bg-panel border border-line rounded-md p-6`; sidebar cards same surface; gradient Quick Response panel removed; inputs use border-line; submit keeps .btn-primary.
- scripts/test-command-rail-tokens.mjs: added Services/Contact assertions.
- src/data/services.js: unchanged.

## TDD
- Red: 6 failures before edits (Discuss this, border-t border-line, subheads, no icon/gradient, bg-panel wrapper, no gradients).
- Green: `node scripts/test-command-rail-tokens.mjs` -> PASS. `vite build` OK.
- Browser (vite preview): /services has 5 border-t articles, 6 "Discuss this" -> /contact links, Problem/What we build/Fit subheads on all; /contact form inside bg-panel border-line, btn-primary submit.

## Concerns
- Data has no problem/fit fields. Mapping: Problem = tagline, What we build = description + features, Fit = tools list. Copy may deserve dedicated problem/fit text later.
- Brief's original tests already passed pre-change; assertions were tightened to make them meaningful.
- Honeypot, validation, ref handling in Contact untouched.
