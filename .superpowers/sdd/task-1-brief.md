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
