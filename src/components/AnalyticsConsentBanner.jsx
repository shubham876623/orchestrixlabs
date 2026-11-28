import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  getAnalyticsConsent,
  hasAnalyticsConsentDecision,
  OPEN_PRIVACY_PREFERENCES_EVENT,
  setAnalyticsConsent,
} from '../lib/analyticsConsent'
import {
  isClarityScriptPresent,
  isPrivateAdminPath,
  withdrawClarity,
} from '../lib/clarity'

/**
 * First-visit opt-in banner + persistent Cookie Settings / Privacy Preferences panel.
 * Hidden on private admin routes (/dashboard, /staff, /admin).
 *
 * Withdrawal after a prior grant persists "denied" then reloads the document so
 * Clarity cannot keep a live SPA agent transmitting.
 */
export default function AnalyticsConsentBanner() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [consent, setConsent] = useState(() => getAnalyticsConsent())

  useEffect(() => {
    if (isPrivateAdminPath(pathname)) {
      setOpen(false)
      return
    }
    setConsent(getAnalyticsConsent())
    // Show immediately; copy stays compact so hero remains the LCP candidate.
    if (!hasAnalyticsConsentDecision()) setOpen(true)
  }, [pathname])

  useEffect(() => {
    const onOpen = () => {
      if (isPrivateAdminPath(window.location.pathname)) return
      setConsent(getAnalyticsConsent())
      setOpen(true)
    }
    window.addEventListener(OPEN_PRIVACY_PREFERENCES_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_PRIVACY_PREFERENCES_EVENT, onOpen)
  }, [])

  if (!open || isPrivateAdminPath(pathname)) return null

  const choose = (value) => {
    const previous = getAnalyticsConsent()
    const hadClarity = isClarityScriptPresent() || typeof window.clarity === 'function'

    if (value === 'denied') {
      // Persist first so a reload boots with denied consent and never re-inits Clarity.
      setAnalyticsConsent('denied')
      setConsent('denied')
      setOpen(false)
      const needsReload = previous === 'granted' || hadClarity
      withdrawClarity({ reload: needsReload })
      return
    }

    setAnalyticsConsent('granted')
    setConsent('granted')
    setOpen(false)
  }

  const statusLabel =
    consent === 'granted'
      ? 'Optional analytics (Microsoft Clarity and first-party page views) are currently allowed.'
      : consent === 'denied'
        ? 'Optional analytics are currently declined.'
        : 'Choose whether optional analytics may run on public pages.'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie settings and privacy preferences"
      className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-5 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto flex max-w-3xl flex-col gap-4 rounded-xl border border-border-strong bg-paper-elevated p-4 shadow-xl sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-navy-primary">Cookie Settings</p>
            <p className="mt-1 text-sm leading-relaxed text-navy-secondary">{statusLabel}</p>
          </div>
          {hasAnalyticsConsentDecision() && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-sm text-navy-secondary hover:bg-paper-subtle hover:text-navy-primary"
              aria-label="Close cookie settings"
            >
              Close
            </button>
          )}
        </div>
        <p className="text-sm leading-relaxed text-navy-body">
          With your opt-in, Microsoft Clarity and limited first-party page-view analytics run on public pages
          only. Decline anytime — see our{' '}
          <Link
            to="/privacy-policy#cookies-analytics"
            className="font-medium text-cyan-hover underline underline-offset-2 hover:text-navy-primary"
            onClick={() => setOpen(false)}
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => choose('denied')}
            className="btn-secondary"
          >
            {consent === 'granted' ? 'Withdraw analytics' : 'Decline'}
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className="btn-secondary"
          >
            {consent === 'granted' ? 'Keep analytics on' : 'Accept analytics'}
          </button>
        </div>
      </div>
    </div>
  )
}
