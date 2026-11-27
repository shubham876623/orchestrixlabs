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
