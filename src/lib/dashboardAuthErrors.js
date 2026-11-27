/**
 * Copy for dashboard sign-in failures, keyed by HTTP status.
 * 429 comes from the backend's dashboard_auth throttle and carries Retry-After (seconds).
 */
export function signInErrorMessage(status, retryAfterSeconds = null) {
  if (status === 401 || status === 403) {
    return 'Incorrect password — or this IP is temporarily locked after too many failed attempts. Wait 15 minutes, then retry with DASHBOARD_SECRET from Railway.'
  }
  if (status === 429) {
    const seconds = Number(retryAfterSeconds)
    if (Number.isFinite(seconds) && seconds > 0) {
      const minutes = Math.ceil(seconds / 60)
      return `Too many sign-in attempts from this network. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`
    }
    return 'Too many sign-in attempts from this network. Try again later.'
  }
  if (status === 502) {
    return 'API proxy is down (HTML instead of JSON). Wait for redeploy, then hard-refresh.'
  }
  return `Sign-in failed (${status}). Try again.`
}
