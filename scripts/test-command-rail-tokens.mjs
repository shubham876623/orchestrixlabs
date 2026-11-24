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

const home = fs.readFileSync(path.join(root, 'src/pages/Home.jsx'), 'utf8')
must(home.includes('SITE.slogan'), 'Home must keep SITE.slogan')
must((home.match(/section-tag/g) || []).length <= 2, 'Home must not spam section-tag eyebrows')
must(home.includes('FeaturedWork'), 'Home keeps featured work section')
must(!/function (WhoWeHelp|TechStackSection|ProcessSection)/.test(home), 'Home drops WhoWeHelp/TechStack/Process sections')
const heroStart = home.indexOf('function Hero')
const heroEnd = home.indexOf('function ServicesPreview')
const heroBlock = home.slice(heroStart, heroEnd === -1 ? heroStart + 2500 : heroEnd)
must(heroStart !== -1, 'Home defines Hero')
must(!heroBlock.includes('TrustBar'), 'TrustBar must not be inside Hero')
must(!heroBlock.includes('gradient-text'), 'Hero h1 must be solid, not gradient')
must(heroBlock.includes('btn-primary') && heroBlock.includes('/contact'), 'Hero has primary CTA')
const order = ['<Hero />', '<ServicesPreview />', '<FeaturedWork />', '<TrustBar />', '<Testimonials />', '<CTABanner />'].map((s) => home.indexOf(s))
must(order.every((v, i) => v !== -1 && (i === 0 || v > order[i - 1])), 'Home section order: Hero, Services, Work, Trust, Testimonials, CTA')

const cta = fs.readFileSync(path.join(root, 'src/components/ConsultationCTA.jsx'), 'utf8')
must(!cta.includes('cta-panel') && cta.includes('border-line') && cta.includes('bg-panel'), 'ConsultationCTA uses quiet border-line bg-panel panel')
const portfolio = fs.readFileSync(path.join(root, 'src/pages/Portfolio.jsx'), 'utf8')
must(!portfolio.includes('xl:grid-cols-3'), 'Portfolio index must not use 3-column card grid as primary')
must(portfolio.includes('variant="row"') || portfolio.includes("variant='row'") || portfolio.includes('work-log'), 'Portfolio uses row/work-log presentation')
must(!portfolio.includes('hero-gradient') && !portfolio.includes('grid-pattern') && !portfolio.includes('gradient-text'), 'Portfolio hero drops gradient/grid-pattern theater')
must(portfolio.includes('CategoryTabs') && portfolio.includes('setCategory'), 'Portfolio keeps category filters')
const card = fs.readFileSync(path.join(root, 'src/components/portfolio/ProjectCard.jsx'), 'utf8')
must(card.includes("variant === 'row'") && card.includes('border-line'), 'ProjectCard supports row variant with border-line')
must(card.includes('/portfolio/${project.slug}') && card.includes('/contact?ref='), 'ProjectCard keeps case-study vs contact link logic')
const caseStudy = fs.readFileSync(path.join(root, 'src/pages/PortfolioCaseStudy.jsx'), 'utf8')
must(caseStudy.includes('lg:grid-cols-[12rem_1fr]'), 'Case study uses 12rem TOC rail grid on lg')
must(caseStudy.includes('lg:sticky') && caseStudy.includes('Case study sections'), 'Case study has sticky TOC nav')
const sectionFn = caseStudy.slice(caseStudy.indexOf('function Section'), caseStudy.indexOf('function PendingBlock'))
must(sectionFn.includes('border-line') && !/bg-white|bg-dark|rounded|shadow/.test(sectionFn), 'Case study Section uses hairline rule, not a glass/white card')

if (failures.length) {
  console.error('FAIL\n' + failures.map(f => ' - ' + f).join('\n'))
  process.exit(1)
}
console.log('PASS command-rail tokens')