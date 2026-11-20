import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createEditorialProject,
  decideGptExport,
  getContract,
  getEditorialProject,
  linkContract,
  listAuditLogs,
  listContracts,
  listEditorialProjects,
  listGptExportDecisions,
  listGptExportProfiles,
  patchContract,
  patchEditorialProject,
  previewEditorialProject,
  staffLogin,
  staffLogout,
  staffMe,
} from '../lib/staffApi'

const STATUSES = ['imported', 'reviewed', 'drafted', 'approved', 'published']

function WarningBanner({ children }) {
  return (
    <div className="mb-4 border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
      {children}
    </div>
  )
}

function LoginPanel({ onLoggedIn }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const data = await staffLogin(username, password)
      onLoggedIn(data.user)
    } catch (err) {
      setError('Staff login failed. Check credentials and CSRF/session proxy.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md py-24">
      <h1 className="font-display text-2xl font-semibold text-white">Editorial staff login</h1>
      <p className="mt-2 text-sm text-slate-400">
        Session cookie auth (HttpOnly). Does not use DASHBOARD_SECRET.
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block text-sm text-slate-300">
          Username
          <input
            className="mt-1 w-full border border-white/10 bg-dark-900 px-3 py-2 text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="block text-sm text-slate-300">
          Password
          <input
            type="password"
            className="mt-1 w-full border border-white/10 bg-dark-900 px-3 py-2 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="text-sm text-rose-300">{error}</p>}
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

export default function StaffEditorial() {
  const [user, setUser] = useState(null)
  const [boot, setBoot] = useState(true)
  const [tab, setTab] = useState('contracts')
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [privateOnly, setPrivateOnly] = useState(false)
  const [contracts, setContracts] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [detail, setDetail] = useState(null)
  const [projects, setProjects] = useState([])
  const [projectSlug, setProjectSlug] = useState('')
  const [project, setProject] = useState(null)
  const [preview, setPreview] = useState(null)
  const [audits, setAudits] = useState([])
  const [msg, setMsg] = useState('')
  const [newProject, setNewProject] = useState({ slug: '', title: '', summary: '' })
  const [gptProfiles, setGptProfiles] = useState([])
  const [gptSelected, setGptSelected] = useState(null)
  const [gptDecisions, setGptDecisions] = useState([])
  const [gptNote, setGptNote] = useState('')

  const refreshContracts = useCallback(async () => {
    const params = {}
    if (q.trim()) params.q = q.trim()
    if (statusFilter) params.editorial_status = statusFilter
    if (privateOnly) params.is_private = 'true'
    setContracts(await listContracts(params))
  }, [q, statusFilter, privateOnly])

  useEffect(() => {
    staffMe()
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setBoot(false))
  }, [])

  const refreshGpt = useCallback(async () => {
    setGptProfiles(await listGptExportProfiles())
    setGptDecisions(await listGptExportDecisions())
  }, [])

  useEffect(() => {
    if (!user) return
    refreshContracts().catch(() => setMsg('Failed to load contracts'))
    listEditorialProjects().then(setProjects).catch(() => {})
    listAuditLogs().then(setAudits).catch(() => {})
    refreshGpt().catch(() => {})
  }, [user, refreshContracts, refreshGpt])

  const restrictedWarning = useMemo(() => {
    if (!detail) return null
    if (detail.is_private || (detail.access_type && detail.access_type !== 'PublicAccess') || detail.opening_hidden) {
      return 'Restricted contract (private / AuthAccess / hidden). Publication requires explicit acknowledgement.'
    }
    return null
  }, [detail])

  if (boot) {
    return <div className="py-32 text-center text-slate-400">Checking staff session…</div>
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-950 px-4">
        <LoginPanel onLoggedIn={setUser} />
      </div>
    )
  }

  const openContract = async (id) => {
    setSelectedId(id)
    setDetail(await getContract(id))
    setTab('contracts')
  }

  const saveContractEditorial = async (patch) => {
    setMsg('')
    try {
      const body = { ...patch }
      if (restrictedWarning && (patch.publication_approved || patch.editorial_status === 'published')) {
        body.restricted_ack = true
      }
      const updated = await patchContract(selectedId, body)
      setDetail(updated)
      setMsg('Contract editorial saved.')
      await refreshContracts()
      setAudits(await listAuditLogs())
    } catch {
      setMsg('Save failed — check workflow rules / restricted acknowledgement.')
    }
  }

  const openProject = async (slug) => {
    setProjectSlug(slug)
    setProject(await getEditorialProject(slug))
    setPreview(null)
    setTab('projects')
  }

  const saveProject = async () => {
    if (!project) return
    setMsg('')
    try {
      const updated = await patchEditorialProject(project.slug, {
        title: project.title,
        summary: project.summary,
        problem: project.problem,
        solution: project.solution,
        engineering_approach: project.engineering_approach,
        technologies: project.technologies || [],
        verified_outcomes: project.verified_outcomes || [],
        qualitative_outcomes: project.qualitative_outcomes || [],
        draft_notes: project.draft_notes,
        testimonial_draft: project.testimonial_draft,
        testimonial_approved: project.testimonial_approved,
        case_study_approved: project.case_study_approved,
        publication_approved: project.publication_approved,
        restricted_linkage_acknowledged: project.restricted_linkage_acknowledged,
        editorial_status: project.editorial_status,
        featured: project.featured,
        marketing_slug: project.marketing_slug,
        restricted_ack: project.restricted_linkage_acknowledged,
      })
      setProject(updated)
      setMsg('Editorial project saved. Marketing portfolio is NOT auto-updated.')
      setProjects(await listEditorialProjects())
      setAudits(await listAuditLogs())
    } catch {
      setMsg('Project save failed — restricted contracts may need acknowledgement.')
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-200">
      <header className="border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Orchestrix Labs</p>
            <h1 className="font-display text-xl font-semibold text-white">Editorial portfolio dashboard</h1>
            <p className="text-xs text-slate-500">Signed in as {user.username} · session auth</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/dashboard" className="btn-outline text-xs">
              Legacy dashboard
            </a>
            <a href="/portfolio" className="btn-outline text-xs">
              Public portfolio
            </a>
            <button
              type="button"
              className="btn-outline text-xs"
              onClick={async () => {
                await staffLogout()
                setUser(null)
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr] sm:px-6">
        <nav className="space-y-2">
          {[
            ['contracts', 'Contracts (143)'],
            ['projects', 'Editorial projects'],
            ['gpt', 'GPT export approvals'],
            ['audit', 'Audit log'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`block w-full border px-3 py-2 text-left text-sm ${
                tab === id
                  ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-100'
                  : 'border-white/10 text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
          <WarningBanner>
            Edits never auto-publish to the 34 marketing projects. GPT export approval is separate from
            website publication. Private/AuthAccess contracts require acknowledgement.
          </WarningBanner>
        </nav>

        <main>
          {msg && <p className="mb-4 text-sm text-cyan-200">{msg}</p>}

          {tab === 'contracts' && (
            <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
              <section>
                <div className="mb-3 flex flex-wrap gap-2">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search title, id, client"
                    className="min-h-[40px] flex-1 border border-white/10 bg-dark-900 px-3 text-sm"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-white/10 bg-dark-900 px-2 text-sm"
                  >
                    <option value="">All statuses</option>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2 text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={privateOnly}
                      onChange={(e) => setPrivateOnly(e.target.checked)}
                    />
                    Private only
                  </label>
                  <button type="button" className="btn-outline text-xs" onClick={refreshContracts}>
                    Refresh
                  </button>
                </div>
                <ul className="max-h-[70vh] space-y-2 overflow-auto border border-white/10 p-2">
                  {contracts.map((c) => (
                    <li key={c.contract_id}>
                      <button
                        type="button"
                        onClick={() => openContract(c.contract_id)}
                        className={`w-full border px-3 py-2 text-left text-sm ${
                          selectedId === c.contract_id
                            ? 'border-cyan-400/40 bg-cyan-400/5'
                            : 'border-transparent hover:border-white/10'
                        }`}
                      >
                        <span className="font-medium text-white">{c.title || c.contract_id}</span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {c.contract_id} · {c.editorial_status}
                          {c.is_private ? ' · PRIVATE' : ''}
                          {c.access_type && c.access_type !== 'PublicAccess' ? ` · ${c.access_type}` : ''}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="border border-white/10 p-4">
                {!detail ? (
                  <p className="text-sm text-slate-500">Select a contract to review original staff-only detail.</p>
                ) : (
                  <div className="space-y-4">
                    {restrictedWarning && <WarningBanner>{restrictedWarning}</WarningBanner>}
                    <h2 className="font-display text-lg text-white">{detail.title}</h2>
                    <p className="text-xs text-slate-500">{detail.contract_id}</p>
                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{detail.description}</p>
                    <div className="grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
                      <p>Client (staff only): {detail.client_name || '—'}</p>
                      <p>Access: {detail.access_type || '—'}</p>
                      <p>Website eligible: {String(detail.public_website_eligible)}</p>
                      <p>Testimonial eligible: {String(detail.public_testimonial_eligible)}</p>
                    </div>
                    <details className="border border-white/10 p-3 text-xs">
                      <summary className="cursor-pointer text-slate-300">original_record (staff only)</summary>
                      <pre className="mt-2 max-h-64 overflow-auto text-[11px] text-slate-500">
                        {JSON.stringify(detail.original_record || {}, null, 2)}
                      </pre>
                    </details>
                    <div className="flex flex-wrap gap-2">
                      <select
                        value={detail.editorial_status}
                        onChange={(e) => setDetail({ ...detail, editorial_status: e.target.value })}
                        className="border border-white/10 bg-dark-900 px-2 py-1 text-sm"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={!!detail.case_study_approved}
                          onChange={(e) => setDetail({ ...detail, case_study_approved: e.target.checked })}
                        />
                        Case study approved
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={!!detail.testimonial_approved}
                          onChange={(e) => setDetail({ ...detail, testimonial_approved: e.target.checked })}
                        />
                        Testimonial approved
                      </label>
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={!!detail.publication_approved}
                          onChange={(e) => setDetail({ ...detail, publication_approved: e.target.checked })}
                        />
                        Publication approved
                      </label>
                    </div>
                    <textarea
                      className="min-h-[80px] w-full border border-white/10 bg-dark-900 p-2 text-sm"
                      value={detail.internal_notes || ''}
                      onChange={(e) => setDetail({ ...detail, internal_notes: e.target.value })}
                      placeholder="Internal notes"
                    />
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() =>
                        saveContractEditorial({
                          editorial_status: detail.editorial_status,
                          case_study_approved: detail.case_study_approved,
                          testimonial_approved: detail.testimonial_approved,
                          publication_approved: detail.publication_approved,
                          internal_notes: detail.internal_notes,
                        })
                      }
                    >
                      Save workflow
                    </button>
                    {detail.feedback_entries?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-white">Feedback (review before testimonial approval)</h3>
                        <ul className="mt-2 space-y-2 text-xs text-slate-400">
                          {detail.feedback_entries.map((f) => (
                            <li key={f.id} className="border border-white/10 p-2">
                              <p>
                                {f.direction} · rating {f.rating ?? '—'} · written={String(f.has_written_review)}
                              </p>
                              <p className="mt-1 whitespace-pre-wrap">{f.comment || '(no comment)'}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>
          )}

          {tab === 'projects' && (
            <div className="space-y-6">
              <section className="border border-white/10 p-4">
                <h2 className="font-display text-lg text-white">Create editorial project</h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <input
                    placeholder="slug"
                    className="border border-white/10 bg-dark-900 px-2 py-2 text-sm"
                    value={newProject.slug}
                    onChange={(e) => setNewProject({ ...newProject, slug: e.target.value })}
                  />
                  <input
                    placeholder="title"
                    className="border border-white/10 bg-dark-900 px-2 py-2 text-sm"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                  <button
                    type="button"
                    className="btn-outline text-sm"
                    onClick={async () => {
                      const created = await createEditorialProject(newProject)
                      setProjects(await listEditorialProjects())
                      await openProject(created.slug)
                    }}
                  >
                    Create
                  </button>
                </div>
              </section>

              <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <ul className="max-h-[60vh] space-y-2 overflow-auto border border-white/10 p-2">
                  {projects.map((p) => (
                    <li key={p.slug}>
                      <button
                        type="button"
                        className="w-full border border-transparent px-3 py-2 text-left text-sm hover:border-white/10"
                        onClick={() => openProject(p.slug)}
                      >
                        <span className="text-white">{p.title}</span>
                        <span className="block text-xs text-slate-500">
                          {p.slug} · {p.editorial_status}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                {project && (
                  <section className="space-y-3 border border-white/10 p-4">
                    {(project.warnings || []).map((w) => (
                      <WarningBanner key={w}>{w}</WarningBanner>
                    ))}
                    <input
                      className="w-full border border-white/10 bg-dark-900 px-3 py-2 text-lg text-white"
                      value={project.title}
                      onChange={(e) => setProject({ ...project, title: e.target.value })}
                    />
                    {['summary', 'problem', 'solution', 'engineering_approach', 'draft_notes', 'testimonial_draft'].map(
                      (field) => (
                        <label key={field} className="block text-xs uppercase tracking-wide text-slate-500">
                          {field.replaceAll('_', ' ')}
                          <textarea
                            className="mt-1 min-h-[70px] w-full border border-white/10 bg-dark-900 p-2 text-sm normal-case text-slate-200"
                            value={project[field] || ''}
                            onChange={(e) => setProject({ ...project, [field]: e.target.value })}
                          />
                        </label>
                      )
                    )}
                    <div className="flex flex-wrap gap-3 text-xs">
                      <select
                        value={project.editorial_status}
                        onChange={(e) => setProject({ ...project, editorial_status: e.target.value })}
                        className="border border-white/10 bg-dark-900 px-2 py-1"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {[
                        ['case_study_approved', 'Case study approved'],
                        ['testimonial_approved', 'Testimonial approved'],
                        ['publication_approved', 'Publication approved'],
                        ['restricted_linkage_acknowledged', 'Ack restricted contracts'],
                        ['featured', 'Featured'],
                      ].map(([key, label]) => (
                        <label key={key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!project[key]}
                            onChange={(e) => setProject({ ...project, [key]: e.target.checked })}
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="btn-primary" onClick={saveProject}>
                        Save draft
                      </button>
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={async () => setPreview(await previewEditorialProject(project.slug))}
                      >
                        Preview (sanitized)
                      </button>
                      {detail && (
                        <button
                          type="button"
                          className="btn-outline"
                          onClick={async () => {
                            await linkContract({
                              contract: detail.id,
                              project: project.id,
                              is_primary: true,
                            })
                            await openProject(project.slug)
                            setMsg(`Linked contract ${detail.contract_id}`)
                          }}
                        >
                          Link selected contract
                        </button>
                      )}
                    </div>
                    {preview && (
                      <pre className="max-h-80 overflow-auto border border-white/10 bg-black/40 p-3 text-[11px] text-slate-400">
                        {JSON.stringify(preview, null, 2)}
                      </pre>
                    )}
                    {project.contract_links?.length > 0 && (
                      <ul className="text-xs text-slate-400">
                        {project.contract_links.map((l) => (
                          <li key={l.id}>
                            {l.contract_id} {l.is_private ? '(PRIVATE)' : ''} {l.access_type}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                )}
              </div>
            </div>
          )}

          {tab === 'gpt' && (
            <div className="space-y-4">
              <WarningBanner>
                GPT export approval does <strong>not</strong> publish to the website and does not upload to
                ChatGPT. Defaults remain false until you explicitly approve a sanitized profile version.
              </WarningBanner>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-outline text-xs" onClick={() => refreshGpt()}>
                  Refresh GPT profiles
                </button>
                <p className="text-xs text-slate-500 self-center">
                  Seed locally: <code>python manage.py sync_gpt_profiles_phase7</code> after building Phase 7
                  packs.
                </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                <ul className="max-h-[70vh] space-y-2 overflow-auto border border-white/10 p-2">
                  {gptProfiles.length === 0 && (
                    <li className="p-3 text-xs text-slate-500">
                      No editorial GPT profiles yet. Run Phase 7 sync command after migrate (local only).
                    </li>
                  )}
                  {gptProfiles.map((p) => (
                    <li key={p.slug}>
                      <button
                        type="button"
                        className={`w-full border px-3 py-2 text-left text-sm ${
                          gptSelected?.slug === p.slug
                            ? 'border-cyan-400/40 bg-cyan-400/5'
                            : 'border-transparent hover:border-white/10'
                        }`}
                        onClick={() => setGptSelected(p)}
                      >
                        <span className="text-white">{p.title}</span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {p.slug} · GPT {p.gpt_export_approved ? 'APPROVED' : 'pending'}
                          {p.gpt_export_stale ? ' · STALE' : ''}
                          {p.publication_approved ? ' · site-approved' : ''}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                <section className="border border-white/10 p-4">
                  {!gptSelected ? (
                    <p className="text-sm text-slate-500">
                      Select a sanitized project profile to review for GPT export.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {(gptSelected.warnings || []).map((w) => (
                        <WarningBanner key={w}>{w}</WarningBanner>
                      ))}
                      <h2 className="font-display text-lg text-white">{gptSelected.title}</h2>
                      <p className="text-xs text-slate-500">
                        contentVersion: {gptSelected.gpt_content_version || '—'} · approvedVersion:{' '}
                        {gptSelected.gpt_approved_content_version || '—'}
                      </p>
                      <p className="text-xs text-slate-400">
                        Website publicationApproved: {String(gptSelected.publication_approved)} (independent)
                      </p>
                      <pre className="max-h-80 overflow-auto border border-white/10 bg-black/40 p-3 text-[11px] text-slate-400">
                        {JSON.stringify(gptSelected.gpt_profile_snapshot || {}, null, 2)}
                      </pre>
                      <textarea
                        className="min-h-[60px] w-full border border-white/10 bg-dark-900 p-2 text-sm"
                        placeholder="Approval note (optional)"
                        value={gptNote}
                        onChange={(e) => setGptNote(e.target.value)}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={async () => {
                            try {
                              const data = await decideGptExport(gptSelected.slug, {
                                approve: true,
                                note: gptNote,
                                content_version: gptSelected.gpt_content_version,
                              })
                              setGptSelected(data.project)
                              setMsg('GPT export approved for this content version only. Website unchanged.')
                              await refreshGpt()
                              setAudits(await listAuditLogs())
                            } catch {
                              setMsg('GPT approve failed — check snapshot, version, or auth.')
                            }
                          }}
                        >
                          Approve GPT export
                        </button>
                        <button
                          type="button"
                          className="btn-outline"
                          onClick={async () => {
                            try {
                              const data = await decideGptExport(gptSelected.slug, {
                                approve: false,
                                note: gptNote || 'revoked',
                              })
                              setGptSelected(data.project)
                              setMsg('GPT export approval revoked.')
                              await refreshGpt()
                              setAudits(await listAuditLogs())
                            } catch {
                              setMsg('GPT revoke failed.')
                            }
                          }}
                        >
                          Revoke GPT export
                        </button>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">Recent GPT decisions</h3>
                        <ul className="mt-2 space-y-1 text-xs text-slate-400">
                          {gptDecisions
                            .filter((d) => d.project_slug === gptSelected.slug)
                            .slice(0, 8)
                            .map((d) => (
                              <li key={d.id}>
                                {new Date(d.created_at).toLocaleString()} ·{' '}
                                {d.approved ? 'approved' : 'revoked'} · v={d.content_version} ·{' '}
                                {d.actor_username || '—'}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {tab === 'audit' && (
            <section className="border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 text-slate-500">
                  <tr>
                    <th className="p-2">When</th>
                    <th className="p-2">Action</th>
                    <th className="p-2">Object</th>
                    <th className="p-2">Actor</th>
                    <th className="p-2">Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {audits.map((a) => (
                    <tr key={a.id} className="border-b border-white/5">
                      <td className="p-2 text-slate-500">{new Date(a.created_at).toLocaleString()}</td>
                      <td className="p-2">{a.action}</td>
                      <td className="p-2">
                        {a.object_type}:{a.object_id}
                      </td>
                      <td className="p-2">{a.actor_username || '—'}</td>
                      <td className="p-2 text-slate-400">{a.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
