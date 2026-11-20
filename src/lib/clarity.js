/**
 * Microsoft Clarity loader (SPA-safe, consent-gated, single insert).
 * Project ID: zg04s48gdr
 *
 * Hard opt-out:
 * - Never call initClarity until analytics consent is granted.
 * - Withdrawal signals denied consent, stops the agent, clears cookies we can
 *   remove, and best-effort tears down the script stub. Removing the script
 *   element alone does NOT guarantee the agent has stopped; callers that
 *   withdraw after a prior grant should reload the document after persisting
 *   the denied preference so Clarity cannot initialize again.
 * - On /dashboard*, do not init; if an agent is already running, stop() and mask.
 */

export const CLARITY_PROJECT_ID = 'zg04s48gdr'
export const CLARITY_SCRIPT_ID = 'ms-clarity-script'

/** Query / fragment keys that must never appear in analytics paths or tags. */
export const SENSITIVE_QUERY_PARAMS = [
  'token',
  'access_token',
  'code',
  'email',
  'session',
  'auth',
  'key',
]

function ensureClarityQueue() {
  if (typeof window === 'undefined') return
  if (typeof window.clarity === 'function') return
  window.clarity = function clarity() {
    ;(window.clarity.q = window.clarity.q || []).push(arguments)
  }
}

function callClarity(command, ...args) {
  if (typeof window === 'undefined') return
  ensureClarityQueue()
  try {
    window.clarity(command, ...args)
  } catch {
    /* Clarity may not be fully bootstrapped yet; queued calls still help */
  }
}

export function isClarityScriptPresent() {
  if (typeof document === 'undefined') return false
  return (
    !!document.getElementById(CLARITY_SCRIPT_ID) ||
    !!document.querySelector(`script[src*="clarity.ms/tag/${CLARITY_PROJECT_ID}"]`)
  )
}

export function isClarityAgentActive() {
  return typeof window !== 'undefined' && typeof window.clarity === 'function'
}

/**
 * True for authenticated / administrative SPA routes that must never run Clarity
 * or optional first-party pageview analytics.
 */
export function isPrivateAdminPath(pathname = '') {
  const path = String(pathname).split('?')[0].split('#')[0]
  if (path === '/dashboard' || path.startsWith('/dashboard/')) return true
  if (path === '/staff' || path.startsWith('/staff/')) return true
  if (path === '/admin' || path.startsWith('/admin/')) return true
  return false
}

/** @deprecated Use isPrivateAdminPath — kept as alias for existing imports/tests. */
export function isDashboardPath(pathname = '') {
  return isPrivateAdminPath(pathname)
}

/**
 * Force a full document load into a private admin route so Clarity cannot keep
 * a live SPA agent from a prior public page. Preserves path/query/hash.
 * @param {string} [href]
 */
export function navigateToPrivateAdmin(href) {
  if (typeof window === 'undefined') return
  const target = href || `${window.location.pathname}${window.location.search}${window.location.hash}`
  try {
    window.location.assign(target)
  } catch {
    window.location.href = target
  }
}

/**
 * Strip query strings and fragments from a path or URL for analytics.
 * @param {string} raw
 * @returns {string}
 */
export function sanitizeAnalyticsPath(raw) {
  const value = String(raw || '').trim()
  if (!value) return '/'
  try {
    if (/^https?:\/\//i.test(value)) {
      const u = new URL(value)
      return (u.pathname || '/').slice(0, 255) || '/'
    }
  } catch {
    /* fall through */
  }
  const pathOnly = value.split('?')[0].split('#')[0]
  const normalized = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`
  return normalized.slice(0, 255) || '/'
}

/**
 * Strip query/fragment from a referrer URL; keep origin + pathname only.
 * @param {string} raw
 * @returns {string}
 */
export function sanitizeAnalyticsReferrer(raw) {
  const value = String(raw || '').trim()
  if (!value) return ''
  try {
    if (/^https?:\/\//i.test(value)) {
      const u = new URL(value)
      return `${u.origin}${u.pathname}`.slice(0, 500)
    }
  } catch {
    return ''
  }
  return value.split('?')[0].split('#')[0].slice(0, 500)
}

/**
 * Inject Clarity once. Safe to call repeatedly.
 * @returns {boolean} true if script is present after the call
 */
export function initClarity() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false
  if (isClarityScriptPresent()) return true

  ensureClarityQueue()

  const existing = document.querySelector(
    `script[src="https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}"]`
  )
  if (existing) {
    if (!existing.id) existing.id = CLARITY_SCRIPT_ID
    return true
  }

  const script = document.createElement('script')
  script.id = CLARITY_SCRIPT_ID
  script.async = true
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`
  const first = document.getElementsByTagName('script')[0]
  if (first?.parentNode) {
    first.parentNode.insertBefore(script, first)
  } else {
    document.head.appendChild(script)
  }
  return true
}

/** Signal Clarity that analytics cookies/storage are allowed. */
export function grantClarityConsent() {
  callClarity('consentv2', {
    ad_Storage: 'denied',
    analytics_Storage: 'granted',
  })
}

/** Best-effort clear of known Clarity first-party cookies. */
function clearClarityCookies() {
  if (typeof document === 'undefined') return
  const names = ['_clck', '_clsk', 'CLID', 'ANONCHK', 'MR', 'MUID', 'SM']
  const domains = ['', window.location.hostname, `.${window.location.hostname}`]
  for (const name of names) {
    for (const domain of domains) {
      const domainPart = domain ? `; domain=${domain}` : ''
      document.cookie = `${name}=; Max-Age=0; path=/${domainPart}`
    }
  }
}

/**
 * Best-effort teardown of script tags. Optionally installs a hard no-op so
 * late Clarity callbacks cannot queue work. Does not guarantee in-flight
 * beacons already handed to the browser are aborted.
 */
function teardownClarityDom({ hardDisable = false } = {}) {
  if (typeof document === 'undefined') return
  const nodes = document.querySelectorAll(
    `#${CLARITY_SCRIPT_ID}, script[src*="clarity.ms/tag/${CLARITY_PROJECT_ID}"], script[src*="clarity.ms"]`
  )
  nodes.forEach((node) => {
    try {
      node.remove()
    } catch {
      /* ignore */
    }
  })
  if (typeof window !== 'undefined') {
    try {
      if (hardDisable) {
        window.clarity = function disabledClarity() {
          /* drop all commands — do not queue */
        }
      } else {
        window.clarity = function clarity() {
          ;(window.clarity.q = window.clarity.q || []).push(arguments)
        }
        window.clarity.q = []
      }
    } catch {
      /* ignore */
    }
  }
}

/**
 * Hard opt-out: stop agent, erase cookies via documented consent(false), disable
 * the global, tear down scripts, optionally reload.
 *
 * Important: do NOT call consentv2({ analytics_Storage: 'denied' }) here.
 * Microsoft documents that denied consentv2 restarts Clarity in "no-consent mode"
 * (limited tracking without cookies), which is incompatible with hard opt-out.
 *
 * @param {{ reload?: boolean }} [options]
 */
export function withdrawClarity(options = {}) {
  const { reload = false } = options
  if (typeof window === 'undefined') return

  if (isClarityAgentActive() || isClarityScriptPresent()) {
    ensureClarityQueue()
    // Order matters: stop first, then legacy consent(false) to erase cookies.
    callClarity('stop')
    callClarity('consent', false)
    clearClarityCookies()
    teardownClarityDom({ hardDisable: true })
    clearClarityCookies()
  }

  if (reload) {
    try {
      window.location.reload()
    } catch {
      /* ignore */
    }
  }
}

/** @deprecated Prefer withdrawClarity for full opt-out */
export function denyClarityConsent() {
  withdrawClarity()
}

/**
 * Stop collection for private routes (SPA-safe).
 * Prefer stop over pause so the agent does not keep a live session on /dashboard.
 */
export function stopClarityForPrivateRoute() {
  if (!isClarityAgentActive() && !isClarityScriptPresent()) return
  callClarity('stop')
  setPrivateRouteMask(true)
}

/** Restart Clarity after leaving a private route (script already present). */
export function startClarityAfterPrivateRoute() {
  callClarity('start')
}

/** Apply / clear document-level mask while on private routes. */
export function setPrivateRouteMask(active) {
  if (typeof document === 'undefined') return
  const root = document.getElementById('root') || document.body
  if (!root) return
  if (active) root.setAttribute('data-clarity-mask', 'true')
  else root.removeAttribute('data-clarity-mask')
}

/** Tag the current SPA route for Clarity filters (does not re-insert the script). */
export function tagClarityPage(pathname) {
  if (isDashboardPath(pathname)) return
  const safePath = sanitizeAnalyticsPath(pathname)
  callClarity('set', 'page_path', safePath || '/')
}
