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

const nav = fs.readFileSync(path.join(root, 'src/components/Navbar.jsx'), 'utf8')
const foot = fs.readFileSync(path.join(root, 'src/components/Footer.jsx'), 'utf8')
must(!nav.includes('drop-shadow-[0_0_18px_rgba(0,239,253,0.18)]'), 'Navbar must remove logo glow drop-shadow')
must(!nav.includes('backdrop-blur-2xl'), 'Navbar must not use heavy glass blur')
must(nav.includes('Contact') || nav.includes('/contact'), 'Navbar keeps Contact CTA')
must(!/Newsletter|Subscribe/i.test(foot), 'Footer stays utility (no newsletter collage)')

if (failures.length) {
  console.error('FAIL\n' + failures.map(f => ' - ' + f).join('\n'))
  process.exit(1)
}
console.log('PASS command-rail tokens')