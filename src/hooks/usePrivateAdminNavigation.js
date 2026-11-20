import { useEffect } from 'react'
import {
  isClarityAgentActive,
  isClarityScriptPresent,
  isPrivateAdminPath,
  stopClarityForPrivateRoute,
} from '../lib/clarity'

/**
 * Intercept in-app link clicks from public → private admin routes and force a
 * full document navigation. This prevents a live Clarity SPA agent from the
 * public page from continuing into /dashboard or /staff.
 *
 * Login state is preserved: dashboard secret stays in localStorage; staff session
 * cookies remain for same-origin full loads.
 */
export default function usePrivateAdminNavigation() {
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = event.target?.closest?.('a[href]')
      if (!anchor) return
      if (anchor.target && anchor.target !== '_self') return

      let url
      try {
        url = new URL(anchor.href, window.location.origin)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) return
      if (!isPrivateAdminPath(url.pathname)) return
      if (isPrivateAdminPath(window.location.pathname)) return

      event.preventDefault()
      event.stopPropagation()

      // Stop the agent before unloading so dashboard markup is less likely to be
      // included in a final collect. Residual public-session flush may still occur.
      if (isClarityScriptPresent() || isClarityAgentActive()) {
        stopClarityForPrivateRoute()
      }

      window.location.assign(`${url.pathname}${url.search}${url.hash}`)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])
}
