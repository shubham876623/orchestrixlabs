/**
 * Static + behavioral unit checks for Microsoft Clarity privacy controls (no deploy).
 * Distinguishes code-level assertions from live browser/network verification.
 */
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const backendRoot = join(root, '..', 'orchestrix-backend')
let failed = 0

function fail(msg) {
  console.error(`FAIL: ${msg}`)
  failed += 1
}

function ok(msg) {
  console.log(`PASS: ${msg}`)
}

const files = {
  clarity: join(root, 'src/lib/clarity.js'),
  consent: join(root, 'src/lib/analyticsConsent.js'),
  hook: join(root, 'src/hooks/useClarity.js'),
  tracking: join(root, 'src/hooks/usePageTracking.js'),
  banner: join(root, 'src/components/AnalyticsConsentBanner.jsx'),
  footer: join(root, 'src/components/Footer.jsx'),
  app: join(root, 'src/App.jsx'),
  contact: join(root, 'src/pages/Contact.jsx'),
  dashboard: join(root, 'src/pages/Dashboard.jsx'),
  privacy: join(root, 'src/pages/PrivacyPolicy.jsx'),
  indexHtml: join(root, 'index.html'),
  vercel: join(root, 'vercel.json'),
  trackView: join(backendRoot, 'analytics/views.py'),
  settings: join(backendRoot, 'orchestrix/settings.py'),
  purgeCmd: join(backendRoot, 'analytics/management/commands/purge_expired_pageviews.py'),
}

for (const [name, path] of Object.entries(files)) {
  if (!existsSync(path)) fail(`missing ${name}: ${path}`)
}

const clarity = readFileSync(files.clarity, 'utf8')
const consent = readFileSync(files.consent, 'utf8')
const hook = readFileSync(files.hook, 'utf8')
const tracking = readFileSync(files.tracking, 'utf8')
const banner = readFileSync(files.banner, 'utf8')
const footer = readFileSync(files.footer, 'utf8')
const app = readFileSync(files.app, 'utf8')
const contact = readFileSync(files.contact, 'utf8')
const dashboard = readFileSync(files.dashboard, 'utf8')
const privacy = readFileSync(files.privacy, 'utf8')
const indexHtml = readFileSync(files.indexHtml, 'utf8')
const vercel = readFileSync(files.vercel, 'utf8')
const trackView = existsSync(files.trackView) ? readFileSync(files.trackView, 'utf8') : ''
const settings = existsSync(files.settings) ? readFileSync(files.settings, 'utf8') : ''
const purgeCmd = existsSync(files.purgeCmd) ? readFileSync(files.purgeCmd, 'utf8') : ''

if (!clarity.includes('zg04s48gdr')) fail('Clarity project ID missing')
else ok('Clarity project ID present')

if (!clarity.includes('analytics_Storage') || !clarity.includes('ad_Storage')) {
  fail('consentv2 must use ad_Storage and analytics_Storage')
} else ok('consentv2 parameter names present')

if (!clarity.includes('withdrawClarity') || !clarity.includes('reload')) {
  fail('withdrawClarity must support document reload fallback')
} else ok('withdrawClarity supports reload fallback')

if (!/withdrawClarity[\s\S]*consentv2[\s\S]*analytics_Storage:\s*['"]denied['"]/.test(clarity)) {
  ok('withdrawClarity does not use consentv2 denied restart path')
} else {
  fail('withdrawClarity must not call consentv2 denied (restarts no-consent mode)')
}

if (!clarity.includes("'stop'") && !clarity.includes('"stop"')) fail('stop API missing')
else ok('stop API present for private routes / withdrawal')

if (!clarity.includes('sanitizeAnalyticsPath')) fail('path sanitizer missing')
else ok('analytics path sanitizer present')

if (!hook.includes('stopClarityForPrivateRoute') || !hook.includes('setPrivateRouteMask')) {
  fail('useClarity must stop + mask on dashboard SPA navigation')
} else ok('useClarity hard-stops dashboard routes')

if (!hook.includes('useLayoutEffect')) fail('dashboard stop should use useLayoutEffect')
else ok('dashboard stop uses useLayoutEffect')

if (hook.includes('pauseClarity') || hook.includes("'pause'")) {
  fail('useClarity should not rely on pause-only for private routes')
} else ok('useClarity does not use pause-only for private routes')

if (!consent.includes('OPEN_PRIVACY_PREFERENCES_EVENT') || !footer.includes('openPrivacyPreferences')) {
  fail('persistent Cookie Settings control missing')
} else ok('Cookie Settings footer control present')

if (!banner.includes('Withdraw') && !banner.includes('withdraw')) {
  fail('banner must support withdrawal after prior consent')
} else ok('banner supports withdrawal')

if (!banner.includes('reload')) fail('banner must reload after withdrawing prior Clarity grant')
else ok('banner reload-on-withdraw path present')

if (/clarity\.ms\/tag/.test(indexHtml)) fail('Clarity must not be hard-coded in index.html')
else ok('index.html has no unconditional Clarity snippet')

if (!app.includes('useClarity') || !app.includes('AnalyticsConsentBanner')) {
  fail('App.jsx must wire useClarity + consent banner')
} else ok('App wires Clarity hook and consent banner')

if (!contact.includes('data-clarity-mask="true"')) fail('Contact form missing Clarity mask')
else ok('Contact form masked')

const dashMasks = [...dashboard.matchAll(/data-clarity-mask="true"/g)].length
if (dashMasks < 2) fail(`Dashboard expected >=2 clarity masks, found ${dashMasks}`)
else ok(`Dashboard masked (${dashMasks} attributes)`)

if (!privacy.toLowerCase().includes('cookie settings')) fail('Privacy Policy must mention Cookie Settings')
else ok('Privacy Policy mentions Cookie Settings')

if (!privacy.toLowerCase().includes('microsoft clarity')) fail('Privacy Policy must disclose Clarity')
else ok('Privacy Policy discloses Clarity')

if (!privacy.toLowerCase().includes('90') || !privacy.toLowerCase().includes('retention')) {
  fail('Privacy Policy must describe ~90-day first-party analytics retention')
} else ok('Privacy Policy describes first-party retention')

if (!privacy.toLowerCase().includes('opt in') && !privacy.toLowerCase().includes('opt-in')) {
  fail('Privacy Policy must describe opt-in for first-party analytics')
} else ok('Privacy Policy describes opt-in analytics')

if (!vercel.includes('clarity.ms')) fail('CSP must allow clarity.ms')
else ok('vercel.json CSP allows Clarity')

if (/GTM-|googletagmanager|gtag\(/.test(indexHtml + app)) {
  fail('Unexpected GTM/gtag found')
} else ok('No GTM/gtag duplicate surface in index/App')

if (!tracking.includes("getAnalyticsConsent() !== 'granted'")) {
  fail('usePageTracking must gate on analytics consent')
} else ok('usePageTracking gated on analytics consent')

if (tracking.includes('session_id') || tracking.includes('_orch_sid')) {
  fail('usePageTracking must not send session identifiers')
} else ok('usePageTracking omits session identifiers')

if (!tracking.includes('sanitizeAnalyticsPath')) {
  fail('usePageTracking must sanitize paths')
} else ok('usePageTracking sanitizes paths')

if (!trackView.includes('ip_address=None') || trackView.includes('ip-api.com')) {
  fail('TrackPageView must not store raw IP or call ip-api.com')
} else ok('TrackPageView omits raw IP and geo lookup')

if (trackView.includes("session_id=raw_sid") || /session_id\s*=\s*raw_/.test(trackView)) {
  fail('TrackPageView must not persist client session ids')
} else ok('TrackPageView omits session ids')

if (!settings.includes('ANALYTICS_PAGEVIEW_RETENTION_DAYS')) {
  fail('ANALYTICS_PAGEVIEW_RETENTION_DAYS missing from settings')
} else ok('Retention setting present')

if (!purgeCmd.includes('PageView') || !purgeCmd.includes('dry-run')) {
  fail('purge_expired_pageviews command incomplete')
} else ok('purge_expired_pageviews command present')

// Behavioral: consent module round-trip in Node with mock localStorage
globalThis.localStorage = (() => {
  const store = new Map()
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  }
})()
globalThis.window = {
  dispatchEvent() {},
  addEventListener() {},
  removeEventListener() {},
  location: { hostname: 'localhost', reload() {} },
}

const consentMod = await import(pathToFileURL(files.consent).href)
consentMod.setAnalyticsConsent('granted')
if (consentMod.getAnalyticsConsent() !== 'granted') fail('consent persistence granted')
else ok('consent persistence granted')
consentMod.setAnalyticsConsent('denied')
if (consentMod.getAnalyticsConsent() !== 'denied') fail('consent persistence denied')
else ok('consent persistence denied / withdrawal storage')

const clarityMod = await import(pathToFileURL(files.clarity).href)
if (!clarityMod.isPrivateAdminPath('/dashboard')) fail('dashboard path detect')
else ok('dashboard path detection')
if (!clarityMod.isPrivateAdminPath('/dashboard/')) fail('dashboard trailing slash')
else ok('dashboard trailing-slash detection')
if (!clarityMod.isPrivateAdminPath('/dashboard/visitors')) fail('nested dashboard path')
else ok('nested dashboard path detection')
if (!clarityMod.isPrivateAdminPath('/staff')) fail('staff path detect')
else ok('staff path detection')
if (!clarityMod.isPrivateAdminPath('/staff/contracts')) fail('nested staff path')
else ok('nested staff path detection')
if (clarityMod.isPrivateAdminPath('/contact')) fail('false positive private path')
else ok('non-private path detection')
if (!app.includes('usePrivateAdminNavigation')) {
  fail('App must wire full-document private admin navigation')
} else ok('App wires private admin full-document navigation')

if (clarityMod.sanitizeAnalyticsPath('/contact?email=a@b.com&token=secret') !== '/contact') {
  fail('sanitizeAnalyticsPath must strip query strings')
} else ok('sanitizeAnalyticsPath strips query strings')

if (clarityMod.sanitizeAnalyticsPath('/about#team') !== '/about') {
  fail('sanitizeAnalyticsPath must strip fragments')
} else ok('sanitizeAnalyticsPath strips fragments')

const ref = clarityMod.sanitizeAnalyticsReferrer('https://example.com/page?email=x#frag')
if (ref.includes('?') || ref.includes('#') || ref.includes('email=')) {
  fail('sanitizeAnalyticsReferrer must strip query/fragment')
} else ok('sanitizeAnalyticsReferrer strips query/fragment')

if (!Array.isArray(clarityMod.SENSITIVE_QUERY_PARAMS) || !clarityMod.SENSITIVE_QUERY_PARAMS.includes('token')) {
  fail('SENSITIVE_QUERY_PARAMS must document console masking keys')
} else ok('SENSITIVE_QUERY_PARAMS documented for console alignment')

console.log('\nNOTE: Live browser/network verification is separate (test:clarity-browser).')

if (failed) {
  console.error(`\ntest-clarity-integration: ${failed} failure(s)`)
  process.exit(1)
}
console.log('\ntest-clarity-integration: PASS (code-level)')
