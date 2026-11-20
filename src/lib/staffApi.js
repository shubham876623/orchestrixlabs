/**
 * Staff editorial API client — session cookies + CSRF.
 * Never stores DASHBOARD_SECRET. Token is optional CLI fallback only.
 */
import api from './axios'

function readCookie(name) {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : ''
}

export async function ensureCsrf() {
  const { data } = await api.get('/api/staff/csrf/', { withCredentials: true })
  return data.csrfToken || readCookie('csrftoken')
}

async function withCsrf(config = {}) {
  const csrf = await ensureCsrf()
  return {
    withCredentials: true,
    ...config,
    headers: {
      ...(config.headers || {}),
      'X-CSRFToken': csrf,
    },
  }
}

export async function staffLogin(username, password) {
  const cfg = await withCsrf()
  const { data } = await api.post('/api/staff/login/', { username, password }, cfg)
  return data
}

export async function staffLogout() {
  const cfg = await withCsrf()
  const { data } = await api.post('/api/staff/logout/', {}, cfg)
  return data
}

export async function staffMe() {
  const { data } = await api.get('/api/staff/me/', { withCredentials: true })
  return data
}

export async function listContracts(params = {}) {
  const { data } = await api.get('/api/staff/contracts/', { withCredentials: true, params })
  return Array.isArray(data) ? data : data.results || []
}

export async function getContract(contractId) {
  const { data } = await api.get(`/api/staff/contracts/${encodeURIComponent(contractId)}/`, {
    withCredentials: true,
  })
  return data
}

export async function patchContract(contractId, body) {
  const cfg = await withCsrf()
  const { data } = await api.patch(
    `/api/staff/contracts/${encodeURIComponent(contractId)}/`,
    body,
    cfg
  )
  return data
}

export async function listEditorialProjects(params = {}) {
  const { data } = await api.get('/api/staff/editorial-projects/', { withCredentials: true, params })
  return Array.isArray(data) ? data : data.results || []
}

export async function createEditorialProject(body) {
  const cfg = await withCsrf()
  const { data } = await api.post('/api/staff/editorial-projects/', body, cfg)
  return data
}

export async function getEditorialProject(slug) {
  const { data } = await api.get(`/api/staff/editorial-projects/${encodeURIComponent(slug)}/`, {
    withCredentials: true,
  })
  return data
}

export async function patchEditorialProject(slug, body) {
  const cfg = await withCsrf()
  const { data } = await api.patch(
    `/api/staff/editorial-projects/${encodeURIComponent(slug)}/`,
    body,
    cfg
  )
  return data
}

export async function previewEditorialProject(slug) {
  const { data } = await api.get(
    `/api/staff/editorial-projects/${encodeURIComponent(slug)}/preview/`,
    { withCredentials: true }
  )
  return data
}

export async function linkContract(body) {
  const cfg = await withCsrf()
  const { data } = await api.post('/api/staff/contract-links/', body, cfg)
  return data
}

export async function unlinkContract(id) {
  const cfg = await withCsrf({ data: { id } })
  await api.delete('/api/staff/contract-links/', cfg)
}

export async function listAuditLogs(params = {}) {
  const { data } = await api.get('/api/staff/audit-logs/', { withCredentials: true, params })
  return Array.isArray(data) ? data : data.results || []
}

export async function listGptExportProfiles(params = {}) {
  const { data } = await api.get('/api/staff/gpt-export-profiles/', {
    withCredentials: true,
    params,
  })
  return Array.isArray(data) ? data : data.results || []
}

export async function decideGptExport(slug, { approve, note = '', content_version = '' }) {
  const cfg = await withCsrf()
  const { data } = await api.post(
    `/api/staff/gpt-export-profiles/${encodeURIComponent(slug)}/decision/`,
    { approve, note, content_version },
    cfg
  )
  return data
}

export async function listGptExportDecisions(params = {}) {
  const { data } = await api.get('/api/staff/gpt-export-decisions/', {
    withCredentials: true,
    params,
  })
  return Array.isArray(data) ? data : data.results || []
}

export async function syncGptProfileSnapshot(slug, { gpt_profile_snapshot, gpt_content_version }) {
  return patchEditorialProject(slug, { gpt_profile_snapshot, gpt_content_version })
}
