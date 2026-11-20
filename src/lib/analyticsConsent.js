/**
 * Optional analytics consent preferences (default: undecided → treated as denied for loading).
 * Gates Microsoft Clarity and first-party /api/track/ pageviews until the visitor opts in.
 */
export const ANALYTICS_CONSENT_KEY = 'orch_analytics_consent'
export const ANALYTICS_CONSENT_EVENT = 'orch:analytics-consent'
export const OPEN_PRIVACY_PREFERENCES_EVENT = 'orch:open-privacy-preferences'

/** @typedef {'granted' | 'denied'} AnalyticsConsentValue */

export function getAnalyticsConsent() {
  try {
    const value = localStorage.getItem(ANALYTICS_CONSENT_KEY)
    if (value === 'granted' || value === 'denied') return value
  } catch {
    /* private mode / blocked storage */
  }
  return null
}

/** @param {AnalyticsConsentValue} value */
export function setAnalyticsConsent(value) {
  if (value !== 'granted' && value !== 'denied') return
  try {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, value)
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: { value } })
    )
  }
}

export function hasAnalyticsConsentDecision() {
  return getAnalyticsConsent() !== null
}

/** Open the persistent Cookie Settings / Privacy Preferences panel. */
export function openPrivacyPreferences() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(OPEN_PRIVACY_PREFERENCES_EVENT))
}
