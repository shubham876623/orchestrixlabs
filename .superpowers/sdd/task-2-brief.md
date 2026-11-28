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
