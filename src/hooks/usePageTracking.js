import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../lib/axios'
import {
  ANALYTICS_CONSENT_EVENT,
  getAnalyticsConsent,
} from '../lib/analyticsConsent'
import {
  isPrivateAdminPath,
  sanitizeAnalyticsPath,
  sanitizeAnalyticsReferrer,
} from '../lib/clarity'

/**
 * First-party pageview analytics — gated behind the same analytics consent as Clarity.
 * No session IDs. Paths/referrers are stripped of query strings and fragments.
 */
export default function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    const send = () => {
      if (getAnalyticsConsent() !== 'granted') return
      if (isPrivateAdminPath(location.pathname)) return

      const path = sanitizeAnalyticsPath(location.pathname)
      if (
        !path ||
        path.startsWith('/dashboard') ||
        path.startsWith('/staff') ||
        path.startsWith('/admin') ||
        path.startsWith('/api')
      ) {
        return
      }

      api
        .post('/api/track/', {
          path,
          referrer: sanitizeAnalyticsReferrer(document.referrer || ''),
          screen_width: window.screen.width,
          screen_height: window.screen.height,
          language: navigator.language || '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
        })
        .catch(() => {})
    }

    send()
    window.addEventListener(ANALYTICS_CONSENT_EVENT, send)
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, send)
  }, [location.pathname])
}
