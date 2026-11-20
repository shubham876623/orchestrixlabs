import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import {
  ANALYTICS_CONSENT_EVENT,
  getAnalyticsConsent,
} from '../lib/analyticsConsent'
import {
  grantClarityConsent,
  initClarity,
  isClarityAgentActive,
  isClarityScriptPresent,
  isPrivateAdminPath,
  navigateToPrivateAdmin,
  setPrivateRouteMask,
  startClarityAfterPrivateRoute,
  stopClarityForPrivateRoute,
  tagClarityPage,
  withdrawClarity,
} from '../lib/clarity'

const FULL_NAV_GUARD = '__orch_private_full_nav'

/**
 * Load Microsoft Clarity once after analytics consent is granted.
 * Private admin routes (/dashboard, /staff, /admin): never init; if an agent is
 * already live from a public SPA page, stop + force a full document load so
 * Clarity cannot keep recording in the same document.
 */
export default function useClarity() {
  const { pathname, search, hash } = useLocation()
  const wasPrivateRef = useRef(isPrivateAdminPath(pathname))

  useLayoutEffect(() => {
    const sync = () => {
      const consent = getAnalyticsConsent()
      const onPrivate = isPrivateAdminPath(pathname)

      setPrivateRouteMask(onPrivate)

      if (consent !== 'granted') {
        if (
          consent === 'denied' &&
          (isClarityScriptPresent() || isClarityAgentActive())
        ) {
          withdrawClarity({ reload: false })
        }
        wasPrivateRef.current = onPrivate
        return
      }

      if (onPrivate) {
        const clarityLive = isClarityScriptPresent() || isClarityAgentActive()
        stopClarityForPrivateRoute()
        wasPrivateRef.current = true

        // SPA entry into a private route with a live Clarity document: full reload.
        // Skip if this document already loaded directly on a private path (no script).
        if (clarityLive && typeof window !== 'undefined' && !window[FULL_NAV_GUARD]) {
          window[FULL_NAV_GUARD] = true
          navigateToPrivateAdmin(`${pathname}${search || ''}${hash || ''}`)
        }
        return
      }

      const leavingPrivate = wasPrivateRef.current
      const hadScript = isClarityScriptPresent()
      if (typeof window !== 'undefined') window[FULL_NAV_GUARD] = false
      initClarity()
      grantClarityConsent()
      if (leavingPrivate && hadScript) startClarityAfterPrivateRoute()
      wasPrivateRef.current = false
      tagClarityPage(pathname)
    }

    sync()
    window.addEventListener(ANALYTICS_CONSENT_EVENT, sync)
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, sync)
  }, [pathname, search, hash])
}
