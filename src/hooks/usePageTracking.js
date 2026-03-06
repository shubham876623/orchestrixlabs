import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

export default function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    // Skip dashboard/admin routes
    if (location.pathname.startsWith('/dashboard')) return

    axios.post('/api/track/', {
      path: location.pathname,
      referrer: document.referrer || '',
    }).catch(() => {}) // silently ignore tracking failures
  }, [location.pathname])
}
