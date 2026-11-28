/**
 * Real-browser checks for the navbar and site search (local dev server only).
 * Usage: BASE=http://localhost:5180 SHOTS=dir node scripts/test-nav-search-browser.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:5180'
const SHOTS = process.env.SHOTS || ''
if (/orchestrixlabs\.com|railway\.app/.test(BASE)) throw new Error('Refusing to run against production')

const results = []
const check = (name, ok, detail = '') => results.push({ name, ok, detail })
const browser = await chromium.launch()
try {
  // Desktop
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } })
  await page.addInitScript(() => localStorage.setItem('orch_analytics_consent', 'denied'))
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto(`${BASE}/services`, { waitUntil: 'networkidle' })
  check('desktop: active link marked aria-current', (await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Services' }).getAttribute('aria-current')) === 'page')
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/nav-desktop.png`, clip: { x: 0, y: 0, width: 1366, height: 120 } })

  await page.keyboard.press('Control+k')
  const dialog = page.getByRole('dialog', { name: 'Search the site' })
  check('desktop: Ctrl+K opens search', await dialog.isVisible())
  check('desktop: search input focused', await page.evaluate(() => document.activeElement?.getAttribute('role') === 'combobox'))
  await page.keyboard.type('voice')
  const options = dialog.getByRole('option')
  check('desktop: typing shows results', (await options.count()) > 0)
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/search-desktop.png` })
  await page.keyboard.press('ArrowDown')
  const target = await options.nth(1).locator('span span').first().textContent()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(400)
  check('desktop: Enter navigates and closes', !(await dialog.isVisible()) && page.url() !== `${BASE}/services`, `${target} -> ${page.url()}`)

  await page.keyboard.press('/')
  check('desktop: "/" opens search', await dialog.isVisible())
  await page.keyboard.type('zzzz-nothing')
  check('desktop: empty state explains next step', await dialog.getByText(/Nothing matches/).isVisible())
  await page.keyboard.press('Escape')
  check('desktop: Esc closes search', !(await dialog.isVisible()))
  check('desktop: no page errors', errors.length === 0, errors.join(' | '))
  await page.close()

  // Mobile
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await m.addInitScript(() => localStorage.setItem('orch_analytics_consent', 'denied'))
  await m.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  await m.getByRole('button', { name: 'Open menu' }).click()
  const menu = m.getByRole('navigation', { name: 'Mobile' })
  check('mobile: menu opens', await menu.isVisible())
  check('mobile: page behind does not scroll', (await m.evaluate(() => document.body.style.overflow)) === 'hidden')
  if (SHOTS) await m.screenshot({ path: `${SHOTS}/nav-mobile-open.png` })
  await m.keyboard.press('Escape')
  check('mobile: Esc closes menu', !(await menu.isVisible()))
  await m.getByRole('button', { name: 'Open menu' }).click()
  await menu.getByRole('link', { name: 'Reviews' }).click()
  await m.waitForURL(/\/reviews$/)
  check('mobile: link navigates and menu closes', !(await menu.isVisible()))
  await m.getByRole('button', { name: 'Search the site' }).click()
  check('mobile: search button opens search', await m.getByRole('dialog', { name: 'Search the site' }).isVisible())
  await m.close()
} finally {
  await browser.close()
}

for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`)
const failed = results.filter((r) => !r.ok).length
console.log(failed ? `VERDICT: ${failed} check(s) failed` : `VERDICT: navbar + search OK (${results.length} checks)`)
process.exit(failed ? 1 : 0)
