import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../lib/axios'

// Generate a session ID that persists for the browser tab session
function getSessionId() {
  let sid = sessionStorage.getItem('_orch_sid')
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem('_orch_sid', sid)
  }
  return sid
}

export default function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    // Skip dashboard/admin routes
    if (location.pathname.startsWith('/dashboard')) return

    api.post('/api/track/', {
      path: location.pathname,
      referrer: document.referrer || '',
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      language: navigator.language || '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
      session_id: getSessionId(),
    }).catch(() => {}) // silently ignore tracking failures
  }, [location.pathname])
}
