/**
 * Real-browser check of contact form v2 against a LOCAL backend (never production).
 * Usage: BASE=http://127.0.0.1:5175 DASHBOARD_SECRET=... SHOTS=dir node scripts/test-contact-form-browser.mjs
 * The Vite dev server must proxy /api to a local Django (VITE_PROXY_API=http://127.0.0.1:<port>).
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const BASE = process.env.BASE || 'http://127.0.0.1:5175'
const SECRET = process.env.DASHBOARD_SECRET || ''
const SHOTS = process.env.SHOTS || ''
if (/orchestrixlabs\.com|railway\.app/.test(BASE)) throw new Error('Refusing to run against production')
if (SHOTS) mkdirSync(SHOTS, { recursive: true })

const results = []
const check = (name, ok, detail = '') => results.push({ name, ok, detail })
const PDF = Buffer.from('%PDF-1.7\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n')
const stamp = Date.now()

const browser = await chromium.launch()
try {
  for (const [label, viewport] of [['desktop', { width: 1366, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport })
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    await page.goto(`${BASE}/contact`, { waitUntil: 'networkidle' })
    if (SHOTS) await page.screenshot({ path: join(SHOTS, `contact-${label}.png`), fullPage: true })

    // 1. Missing fields: inline errors, no request
    await page.getByRole('button', { name: 'Send project brief' }).click()
    check(`${label}: empty submit shows 3 field errors`, (await page.getByRole('alert').count()) === 3)

    // 2. Refused file type shows a clear error and is not attached
    await page.locator('input[type=file]').setInputFiles({ name: 'tool.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('MZ') })
    check(`${label}: .exe refused client-side`, await page.getByText('Attach a PDF, Word (.doc, .docx) or .txt file.').isVisible())

    // 3. Happy path with a PDF
    await page.getByLabel('Your name').fill(`Ada ${label} Tester`)
    await page.getByLabel('Work email').fill(`ada.${label}.${stamp}@example.com`)
    await page.getByLabel('Project description').fill('We need a voice agent that takes restaurant orders and writes them into our CRM.')
    await page.locator('input[type=file]').setInputFiles({ name: `brief-${label}.pdf`, mimeType: 'application/pdf', buffer: PDF })
    check(`${label}: file chip shows name`, await page.getByText(`brief-${label}.pdf`).isVisible())
    await page.getByRole('button', { name: 'Send project brief' }).click()
    const thanks = page.getByText(/Our team will contact you soon/)
    await thanks.waitFor({ timeout: 15000 }).catch(() => {})
    check(`${label}: thank-you message shown`, await thanks.isVisible())
    check(`${label}: thank-you is on screen and focused`, await thanks.isVisible() && (await page.evaluate(() => {
      const r = document.activeElement?.getBoundingClientRect(); return document.activeElement?.tagName === 'H2' && r && r.top >= 0 && r.bottom <= innerHeight
    })))
    check(`${label}: receipt names the file`, await page.getByText(`brief-${label}.pdf`).isVisible())
    if (SHOTS) await page.screenshot({ path: join(SHOTS, `contact-${label}-thanks.png`), fullPage: false })
    check(`${label}: no page errors`, errors.length === 0, errors.join(' | '))
    await page.close()
  }

  // 4. The lead and its file land in the leads dashboard API
  if (SECRET) {
    const ctx = await browser.newContext()
    const res = await ctx.request.get(`${BASE}/api/dashboard/contacts/`, { headers: { Authorization: `Bearer ${SECRET}` } })
    const leads = res.ok() ? await res.json() : []
    const mine = leads.filter((l) => String(l.email).endsWith(`.${stamp}@example.com`))
    check('dashboard: both leads present', mine.length === 2, `found ${mine.length}`)
    check('dashboard: each lead has its PDF', mine.every((l) => l.attachments?.length === 1 && l.attachments[0].kind === 'pdf'))
    if (mine[0]?.attachments?.[0]) {
      const a = mine[0].attachments[0]
      const dl = await ctx.request.get(`${BASE}/api/dashboard/contacts/${mine[0].id}/attachments/${a.id}/`, { headers: { Authorization: `Bearer ${SECRET}` } })
      check('dashboard: download returns the exact bytes as an attachment',
        dl.ok() && Buffer.compare(await dl.body(), PDF) === 0 && /^attachment;/.test(dl.headers()['content-disposition'] || ''))
    }
    await ctx.close()
  }
} finally {
  await browser.close()
}

for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok || !r.detail ? '' : `  (${r.detail})`}`)
const failed = results.filter((r) => !r.ok).length
console.log(failed ? `VERDICT: ${failed} check(s) failed` : `VERDICT: contact form v2 OK (${results.length} checks)`)
process.exit(failed ? 1 : 0)
