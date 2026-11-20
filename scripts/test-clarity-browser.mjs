/**
 * Live browser/network checks for Clarity + first-party track consent gates.
 * Requires a running local preview (default http://127.0.0.1:4173).
 *
 * Usage:
 *   npm run build:production
 *   npx vite preview --host 127.0.0.1 --port 4173
 *   npm run test:clarity-browser
 *
 * Exit codes:
 *   0 = all live checks passed
 *   1 = failures
 *   2 = environment unavailable (server not reachable / playwright missing)
 */
const BASE = process.env.CLARITY_BROWSER_BASE || 'http://127.0.0.1:4173'

let chromium
try {
  ;({ chromium } = await import('playwright'))
} catch {
  console.error(
    'SKIP/ENV: playwright is not installed locally.\n' +
      'Install with: npm i -D playwright && npx playwright install chromium\n' +
      'This is NOT a PASS for live browser/network behavior.'
  )
  process.exit(2)
}

const CLARITY_HOST = /clarity\.ms|bing\.com\/geolocation|c\.bing\.com/i
const TRACK_PATH = /\/api\/track\/?/i
/** Clarity collect / upload endpoints that carry session payload */
const CLARITY_COLLECT = /clarity\.ms\/(collect|receive|track)|m\.clarity\.ms|n\.clarity\.ms|www\.clarity\.ms\/collect/i

let failed = 0
function fail(msg) {
  console.error(`FAIL: ${msg}`)
  failed += 1
}
function ok(msg) {
  console.log(`PASS: ${msg}`)
}
function info(msg) {
  console.log(`INFO: ${msg}`)
}

function classifyClarityUrl(url) {
  if (CLARITY_COLLECT.test(url)) return 'collect_or_upload'
  if (/clarity\.ms\/tag\//i.test(url)) return 'tag_script'
  if (/scripts\.clarity\.ms/i.test(url)) return 'agent_script'
  if (/c\.bing\.com|bing\.com\/geolocation/i.test(url)) return 'bing_aux'
  if (/clarity\.ms/i.test(url)) return 'clarity_other'
  return 'unknown'
}

async function collectDuring(page, action, settleMs = 2500) {
  const clarity = []
  const track = []
  const onReq = (req) => {
    const url = req.url()
    const entry = {
      url,
      method: req.method(),
      resourceType: req.resourceType(),
      postDataBytes: req.postDataBuffer()?.length ?? 0,
      ts: Date.now(),
      kind: classifyClarityUrl(url),
    }
    if (CLARITY_HOST.test(url)) clarity.push(entry)
    if (TRACK_PATH.test(url)) track.push(entry)
  }
  page.on('request', onReq)
  const t0 = Date.now()
  await action()
  await page.waitForTimeout(settleMs)
  page.off('request', onReq)
  for (const e of clarity) e.offsetMs = e.ts - t0
  for (const e of track) e.offsetMs = e.ts - t0
  return { clarity, track }
}

async function acceptAnalytics(page) {
  const accept = page.getByRole('button', { name: /Accept analytics/i })
  await accept.waitFor({ timeout: 8000 })
  await accept.click()
  await page.waitForTimeout(800)
}

async function main() {
  let browser
  try {
    const probe = await fetch(BASE, { signal: AbortSignal.timeout(3000) }).catch(() => null)
    if (!probe || !probe.ok) {
      console.error(
        `SKIP/ENV: preview not reachable at ${BASE}. Start vite preview, then re-run.\n` +
          'This is NOT a PASS for live browser/network behavior.'
      )
      process.exit(2)
    }

    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()
    const page = await context.newPage()

    // 1) First visit — no consent
    {
      const { clarity, track } = await collectDuring(page, async () => {
        await page.goto(BASE + '/', { waitUntil: 'networkidle' })
      }, 3000)
      if (clarity.length) fail(`Clarity requests before consent: ${clarity[0].url}`)
      else ok('No Clarity network requests before consent')
      if (track.length) fail(`/api/track/ before consent`)
      else ok('No /api/track/ before consent')
      const scriptCount = await page.locator('#ms-clarity-script, script[src*="clarity.ms/tag"]').count()
      if (scriptCount > 0) fail(`Clarity script present before consent (${scriptCount})`)
      else ok('No Clarity script before consent')
    }

    // 2) Accept analytics
    {
      const { clarity, track } = await collectDuring(page, async () => {
        await acceptAnalytics(page)
        await page.goto(BASE + '/about', { waitUntil: 'networkidle' }).catch(() => {})
      }, 4000)
      const scriptCount = await page.locator('#ms-clarity-script, script[src*="clarity.ms/tag"]').count()
      if (scriptCount < 1 && clarity.length < 1) {
        fail('After accept: expected Clarity script and/or clarity.ms requests')
      } else ok('After accept: Clarity script and/or network activity observed')
      if (track.length < 1) {
        console.warn('WARN: no /api/track/ request after accept (backend/proxy may be offline)')
      } else ok('After accept: /api/track/ request attempted')
      const consent = await page.evaluate(() => localStorage.getItem('orch_analytics_consent'))
      if (consent !== 'granted') fail(`consent storage expected granted, got ${consent}`)
      else ok('Consent persisted as granted')
    }

    // 3) Public page with active Clarity → /dashboard via in-app link (full-document guard)
    {
      await page.goto(BASE + '/about', { waitUntil: 'networkidle' })
      const consent = await page.evaluate(() => localStorage.getItem('orch_analytics_consent'))
      if (consent !== 'granted') await acceptAnalytics(page)
      await page.waitForTimeout(1500)
      const hadScriptBefore = await page.locator('#ms-clarity-script, script[src*="clarity.ms/tag"]').count()
      if (hadScriptBefore < 1) {
        console.warn('WARN: Clarity script not yet present before dashboard nav (CDN may be slow)')
      }

      await page.evaluate(() => {
        const a = document.createElement('a')
        a.href = '/dashboard'
        a.id = 'orch-test-dashboard-link'
        a.textContent = 'Open dashboard'
        document.body.appendChild(a)
      })

      const transition = await collectDuring(page, async () => {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => null),
          page.click('#orch-test-dashboard-link'),
        ])
      }, 500)

      const finalPath = new URL(page.url()).pathname
      if (finalPath !== '/dashboard' && !finalPath.startsWith('/dashboard')) {
        fail(`public→dashboard expected /dashboard, got ${finalPath}`)
      } else ok('public→dashboard reached /dashboard via full-document navigation')

      const masked = await page.evaluate(() => {
        const root = document.getElementById('root') || document.body
        return root?.getAttribute('data-clarity-mask') === 'true'
      })
      if (!masked) fail('Dashboard root missing data-clarity-mask after public→dashboard')
      else ok('Dashboard root masked after public→dashboard')

      const scriptCount = await page.locator('#ms-clarity-script, script[src*="clarity.ms/tag"]').count()
      if (scriptCount > 0) {
        fail(`Clarity script still present on dashboard (count=${scriptCount}, before=${hadScriptBefore})`)
      } else ok('No Clarity script on dashboard after full-document isolation')

      // Phase B: only requests after the dashboard document is active
      const afterLoad = await collectDuring(page, async () => {
        await page.waitForTimeout(2500)
      }, 500)

      const transitionCollect = transition.clarity.filter((c) => c.kind === 'collect_or_upload')
      const afterCollect = afterLoad.clarity.filter((c) => c.kind === 'collect_or_upload')

      if (transitionCollect.length) {
        console.warn('WARN: Clarity collect during public→dashboard transition (may be public-session flush):')
        for (const c of transitionCollect) {
          console.warn(
            `  - ${c.method} ${c.url} bytes=${c.postDataBytes} type=${c.resourceType} t=${c.offsetMs}ms`
          )
        }
      } else ok('No Clarity collect during public→dashboard transition')

      if (afterCollect.length) {
        fail(
          `Clarity collect AFTER dashboard document loaded: ${afterCollect
            .map((c) => `${c.method} ${c.url} (${c.postDataBytes}b)`)
            .join(' | ')}`
        )
      } else ok('No Clarity collect after dashboard document loaded')

      if (transition.track.length + afterLoad.track.length > 0) {
        console.warn(`WARN: /api/track/ around public→dashboard`)
      } else ok('No /api/track/ during public→dashboard')

      info(
        `transition Clarity (${transition.clarity.length}): ` +
          (transition.clarity.length
            ? transition.clarity.map((c) => `${c.method} ${c.kind} bytes=${c.postDataBytes} url=${c.url}`).join(' || ')
            : 'none')
      )
    }

    // 3b) Soft SPA history transition with live Clarity (exercises useClarity full-nav fallback)
    {
      await page.goto(BASE + '/services', { waitUntil: 'networkidle' })
      const consent = await page.evaluate(() => localStorage.getItem('orch_analytics_consent'))
      if (consent !== 'granted') await acceptAnalytics(page)
      await page.waitForTimeout(1200)

      const transition = await collectDuring(page, async () => {
        await page.evaluate(() => {
          window.history.pushState({}, '', '/dashboard')
          window.dispatchEvent(new PopStateEvent('popstate'))
        })
        await page.waitForTimeout(800)
        await page.waitForURL(/\/dashboard/, { timeout: 10000 }).catch(() => {})
        await page.waitForLoadState('domcontentloaded').catch(() => {})
      }, 500)

      const scriptCount = await page.locator('#ms-clarity-script, script[src*="clarity.ms/tag"]').count()
      const masked = await page.evaluate(() => {
        const root = document.getElementById('root') || document.body
        return root?.getAttribute('data-clarity-mask') === 'true'
      })
      if (!masked) fail('SPA soft-nav dashboard missing mask')
      else ok('SPA soft-nav dashboard masked')
      if (scriptCount > 0) {
        fail(`SPA soft-nav left Clarity script on dashboard (count=${scriptCount})`)
      } else ok('SPA soft-nav: no Clarity script on dashboard document')

      const afterLoad = await collectDuring(page, async () => {
        await page.waitForTimeout(2500)
      }, 500)

      const transitionCollect = transition.clarity.filter((c) => c.kind === 'collect_or_upload')
      const afterCollect = afterLoad.clarity.filter((c) => c.kind === 'collect_or_upload')
      if (transitionCollect.length) {
        console.warn('WARN: SPA soft-nav transition Clarity collect (possible public flush):')
        for (const c of transitionCollect) {
          console.warn(`  - ${c.method} ${c.url} bytes=${c.postDataBytes} t=${c.offsetMs}ms`)
        }
      } else ok('SPA soft-nav: no Clarity collect during transition')
      if (afterCollect.length) {
        fail(`SPA soft-nav Clarity collect AFTER dashboard ready: ${afterCollect[0].url}`)
      } else ok('SPA soft-nav: no Clarity collect after dashboard ready')
      info(
        `SPA soft-nav transition Clarity (${transition.clarity.length}): ` +
          (transition.clarity.length
            ? transition.clarity.map((c) => `${c.method} ${c.kind} bytes=${c.postDataBytes} url=${c.url}`).join(' || ')
            : 'none')
      )
    }

    // 4) Direct /staff — same private protections
    {
      const { clarity } = await collectDuring(page, async () => {
        await page.goto(BASE + '/staff', { waitUntil: 'networkidle' })
      }, 2500)
      const masked = await page.evaluate(() => {
        const root = document.getElementById('root') || document.body
        return root?.getAttribute('data-clarity-mask') === 'true'
      })
      if (!masked) fail('/staff root missing data-clarity-mask')
      else ok('/staff root masked')
      const scriptCount = await page.locator('#ms-clarity-script, script[src*="clarity.ms/tag"]').count()
      if (scriptCount > 0) fail(`Clarity script on /staff (${scriptCount})`)
      else ok('No Clarity script on /staff')
      const collectReqs = clarity.filter((c) => c.kind === 'collect_or_upload')
      if (collectReqs.length) fail(`Clarity collect on /staff: ${collectReqs[0].url}`)
      else ok('No Clarity collect/upload on /staff')
    }

    // 5) Withdraw — capture exact Clarity request details
    {
      await page.goto(BASE + '/contact', { waitUntil: 'networkidle' })
      let consent = await page.evaluate(() => localStorage.getItem('orch_analytics_consent'))
      if (consent !== 'granted') {
        await acceptAnalytics(page)
        await page.waitForTimeout(2000)
      }
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('orch:open-privacy-preferences'))
      })
      const withdraw = page.getByRole('button', { name: /Withdraw analytics/i })
      await withdraw.waitFor({ timeout: 5000 })

      const { clarity, track } = await collectDuring(page, async () => {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => null),
          withdraw.click(),
        ])
      }, 3000)

      consent = await page.evaluate(() => localStorage.getItem('orch_analytics_consent'))
      if (consent !== 'denied') fail(`after withdraw expected denied, got ${consent}`)
      else ok('Consent persisted as denied after withdraw')

      const scriptCount = await page.locator('#ms-clarity-script, script[src*="clarity.ms/tag"]').count()
      if (scriptCount > 0) fail(`Clarity script still present after withdraw/reload (${scriptCount})`)
      else ok('No Clarity script after withdraw/reload')

      // After reload, continue listening briefly for any post-reload Clarity activity
      const postReload = await collectDuring(page, async () => {
        await page.waitForTimeout(2500)
      }, 500)

      if (clarity.length) {
        console.warn(
          'WARN: Clarity request(s) during withdraw/teardown BEFORE reload completed (not assumed empty of analytics):'
        )
        for (const c of clarity) {
          console.warn(
            `  - method=${c.method} type=${c.resourceType} kind=${c.kind} bytes=${c.postDataBytes} t=${c.offsetMs}ms url=${c.url}`
          )
        }
      } else ok('No Clarity requests during withdraw/teardown window')

      const postCollect = postReload.clarity.filter((c) => c.kind === 'collect_or_upload')
      if (postCollect.length || postReload.clarity.length) {
        fail(
          `Clarity activity AFTER withdraw reload: ${postReload.clarity
            .map((c) => `${c.method} ${c.kind} ${c.url} (${c.postDataBytes}b)`)
            .join(' | ')}`
        )
      } else ok('No Clarity activity after withdraw reload settled')

      if (track.length || postReload.track.length) fail(`/api/track/ after withdraw`)
      else ok('No /api/track/ after withdraw')
    }

    // 6) Denied remains blocked
    {
      const { clarity } = await collectDuring(page, async () => {
        await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' })
        await page.goto(BASE + '/dashboard', { waitUntil: 'domcontentloaded' })
        await page.goto(BASE + '/services', { waitUntil: 'networkidle' })
      }, 2500)
      const scriptCount = await page.locator('#ms-clarity-script, script[src*="clarity.ms/tag"]').count()
      if (scriptCount > 0 || clarity.length) {
        fail('Denied consent still produced Clarity script/network after navigation cycle')
      } else ok('Denied consent remains blocked across navigation cycle')
    }
  } catch (err) {
    fail(`browser harness error: ${err?.message || err}`)
  } finally {
    if (browser) await browser.close()
  }

  if (failed) {
    console.error(`\ntest-clarity-browser: ${failed} failure(s)`)
    process.exit(1)
  }
  console.log('\ntest-clarity-browser: PASS (live browser/network)')
}

main()
