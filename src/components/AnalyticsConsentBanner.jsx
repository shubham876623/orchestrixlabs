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
      <div className="pointer-events-auto mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-white/10 bg-dark-950/95 p-4 shadow-[0_-8px_40px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">Cookie Settings</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">{statusLabel}</p>
          </div>
          {hasAnalyticsConsentDecision() && (
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-white"
              aria-label="Close cookie settings"
            >
              Close
            </button>
          )}
        </div>
        <p className="text-sm leading-relaxed text-slate-400">
          With your opt-in, we use Microsoft Clarity (session analytics and heatmaps) and limited first-party
          page-view analytics on public marketing pages only. Form inputs and the admin dashboard are protected.
          Declining keeps the site working. See our{' '}
          <Link
            to="/privacy-policy#cookies-analytics"
            className="text-cyan-300 underline-offset-2 hover:text-white hover:underline"
            onClick={() => setOpen(false)}
          >
            Privacy Policy
          </Link>
          . You can change this choice anytime via Cookie Settings in the footer.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => choose('denied')}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-white/25 hover:text-white"
          >
            {consent === 'granted' ? 'Withdraw analytics' : 'Decline'}
          </button>
          <button
            type="button"
            onClick={() => choose('granted')}
            className="rounded-xl bg-cyan-500/90 px-4 py-2.5 text-sm font-semibold text-dark-950 transition-colors hover:bg-cyan-400"
          >
            {consent === 'granted' ? 'Keep analytics on' : 'Accept analytics'}
          </button>
        </div>
      </div>
    </div>
  )
}
