import { useState, useEffect, useCallback } from 'react'
import api from '../lib/axios'
import {
  FiMail, FiEye, FiUsers, FiTrendingUp, FiCheck, FiArchive,
  FiRefreshCw, FiLogOut, FiEdit2, FiSave, FiX, FiMessageSquare,
  FiPlus, FiTrash2, FiFolder, FiStar, FiClock, FiCheckCircle,
  FiHome, FiGrid, FiSettings, FiChevronDown,
} from 'react-icons/fi'

const STORAGE_KEY = 'orchestrix_dash_secret'

function authHeader() {
  const s = localStorage.getItem(STORAGE_KEY) || ''
  return { Authorization: `Bearer ${s}` }
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = 'primary' }) {
  const colors = {
    primary: 'text-primary-400 bg-primary-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber:   'text-amber-400   bg-amber-500/10',
    rose:    'text-rose-400    bg-rose-500/10',
    violet:  'text-violet-400  bg-violet-500/10',
  }
  return (
    <div className="bg-dark-900 border border-white/[0.07] rounded-2xl p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-slate-500 text-xs mb-0.5">{label}</p>
        <p className="text-white font-bold text-2xl leading-none">{value ?? '—'}</p>
        {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Contact Row ──────────────────────────────────────────────────────────────
const CONTACT_STATUSES = ['new', 'discussion', 'in_progress', 'started_work', 'completed', 'archived']
const contactStatusColors = {
  new:          'bg-amber-500/15 text-amber-400 border-amber-500/30',
  discussion:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
  in_progress:  'bg-violet-500/15 text-violet-400 border-violet-500/30',
  started_work: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  completed:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  archived:     'bg-rose-500/15 text-rose-400 border-rose-500/30',
}
const contactStatusLabels = {
  new: 'New', discussion: 'Discussion', in_progress: 'In Progress',
  started_work: 'Started Work', completed: 'Completed', archived: 'Archived',
}

function ContactRow({ contact, onStatusChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-dark-900 border border-white/[0.07] rounded-xl overflow-hidden">
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold text-sm">{contact.name}</span>
            <span className="text-slate-500 text-xs">{contact.email}</span>
            {contact.service && (
              <span className="px-2 py-0.5 rounded bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs">
                {contact.service}
              </span>
            )}
            {contact.budget && <span className="text-slate-500 text-xs">{contact.budget}</span>}
          </div>
          <p className="text-slate-400 text-xs mt-0.5 truncate">{contact.message || '(no message)'}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${contactStatusColors[contact.status] || contactStatusColors.new}`}>
            {contactStatusLabels[contact.status] || contact.status}
          </span>
          <span className="text-slate-600 text-xs hidden sm:inline">
            {new Date(contact.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/[0.05] p-4 bg-dark-950/50">
          <p className="text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{contact.message || '(no message)'}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 text-xs mr-2">Status:</span>
            {CONTACT_STATUSES.map(s => (
              <button
                key={s}
                onClick={() => onStatusChange(contact.id, s)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  contact.status === s
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'border-white/[0.1] text-slate-400 hover:text-white hover:border-white/[0.2]'
                }`}
              >
                {contactStatusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Site Stats Editor ────────────────────────────────────────────────────────
function SiteStatsEditor() {
  const [stats, setStats] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    api.get('/api/dashboard/site-stats/', { headers: authHeader() })
      .then(r => { setStats(r.data); setForm(r.data) })
  }, [])

  useEffect(() => { load() }, [load])

  const save = async () => {
    setSaving(true)
    try {
      const r = await api.patch('/api/dashboard/site-stats/', form, { headers: authHeader() })
      setStats(r.data)
      setEditing(false)
    } finally { setSaving(false) }
  }

  if (!stats) return <div className="text-slate-500 text-sm p-6">Loading...</div>

  const fields = [
    { key: 'total_earnings', label: 'Total Earnings', type: 'text' },
    { key: 'total_jobs', label: 'Total Jobs', type: 'number' },
    { key: 'total_hours', label: 'Total Hours', type: 'number' },
    { key: 'years_experience', label: 'Years Experience', type: 'number' },
    { key: 'jss_score', label: 'JSS Score (%)', type: 'number' },
  ]

  return (
    <div className="bg-dark-900 border border-white/[0.07] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold text-base">Public Site Stats</h3>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white border border-white/[0.1] text-xs transition-colors">
              <FiX size={12} /> Cancel
            </button>
            <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs transition-colors disabled:opacity-60">
              <FiSave size={12} /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white border border-white/[0.1] text-xs transition-colors">
            <FiEdit2 size={12} /> Edit
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {fields.map(({ key, label, type }) => (
          <div key={key}>
            <label className="text-slate-500 text-xs mb-1 block">{label}</label>
            {editing ? (
              <input
                type={type}
                value={form[key] ?? ''}
                onChange={e => setForm(f => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                className="w-full bg-dark-950 border border-white/[0.1] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary-500/60 transition-colors"
              />
            ) : (
              <p className="text-white font-semibold text-lg">{stats[key]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Project Form Modal ───────────────────────────────────────────────────────
const CATEGORIES = [
  'Voice AI & Chatbots', 'Machine Learning & AI', 'Web Scraping & Automation',
  'Full-Stack Development', 'Workflow Automation',
]

const emptyProject = {
  title: '', category: 'Full-Stack Development', status: 'in_progress',
  summary: '', description: '', tech: [], highlights: [], impact: [], tags: [],
  featured: false, order: 0, client_name: '', rating: '', review: '',
  project_value: '', hours_worked: '', price_type: '', start_date: '', completion_date: '',
  job_description: '', deliverables: '', live_url: '', upwork_url: '', video_url: '', images: [],
}

function ProjectFormModal({ project, onClose, onSave }) {
  const isEdit = !!project?.id
  const [form, setForm] = useState(() => {
    if (!project) return { ...emptyProject }
    return {
      ...emptyProject,
      ...project,
      rating: project.rating ?? '',
      hours_worked: project.hours_worked ?? '',
      start_date: project.start_date || '',
      completion_date: project.completion_date || '',
      tech: project.tech || [],
      highlights: project.highlights || [],
      impact: project.impact || [],
      tags: project.tags || [],
      images: project.images || [],
    }
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // temp inputs for array fields
  const [techInput, setTechInput] = useState('')
  const [highlightInput, setHighlightInput] = useState('')
  const [impactInput, setImpactInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [imageInput, setImageInput] = useState('')

  const addToArray = (key, input, setInput) => {
    if (!input.trim()) return
    setForm(f => ({ ...f, [key]: [...f[key], input.trim()] }))
    setInput('')
  }
  const removeFromArray = (key, idx) => {
    setForm(f => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        rating: form.rating === '' ? null : Number(form.rating),
        hours_worked: form.hours_worked === '' ? null : Number(form.hours_worked),
        order: Number(form.order) || 0,
        start_date: form.start_date || null,
        completion_date: form.completion_date || null,
      }
      if (isEdit) {
        const r = await api.patch(`/api/dashboard/projects/${project.id}/`, payload, { headers: authHeader() })
        onSave(r.data, 'update')
      } else {
        const r = await api.post('/api/dashboard/projects/', payload, { headers: authHeader() })
        onSave(r.data, 'create')
      }
    } catch (err) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Failed to save.')
    } finally { setSaving(false) }
  }

  const inputCls = 'w-full bg-dark-950 border border-white/[0.1] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary-500/60 transition-colors'
  const labelCls = 'text-slate-400 text-xs font-medium mb-1 block'

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-dark-900 border border-white/[0.08] rounded-2xl w-full max-w-3xl my-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <h2 className="text-white font-bold text-lg">{isEdit ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1"><FiX size={20} /></button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Title + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={`${inputCls} cursor-pointer`}>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-dark-900">{c}</option>)}
              </select>
            </div>
          </div>

          {/* Status + Featured + Order */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={`${inputCls} cursor-pointer`}>
                <option value="in_progress" className="bg-dark-900">In Progress</option>
                <option value="completed" className="bg-dark-900">Completed</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Order</label>
              <input type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Featured</label>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                className={`w-full px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                  form.featured ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-dark-950 border-white/[0.1] text-slate-400'
                }`}
              >
                {form.featured ? '★ Featured' : '☆ Not Featured'}
              </button>
            </div>
            <div>
              <label className={labelCls}>Rating (1-5)</label>
              <input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} className={inputCls} placeholder="e.g. 5.0" />
            </div>
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Client Name</label>
              <input value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Project Value</label>
              <input value={form.project_value} onChange={e => setForm(f => ({ ...f, project_value: e.target.value }))} className={inputCls} placeholder="e.g. $1,454.16" />
            </div>
            <div>
              <label className={labelCls}>Price Type</label>
              <input value={form.price_type} onChange={e => setForm(f => ({ ...f, price_type: e.target.value }))} className={inputCls} placeholder="e.g. $25.00 /hr or Fixed price" />
            </div>
            <div>
              <label className={labelCls}>Hours Worked</label>
              <input type="number" value={form.hours_worked} onChange={e => setForm(f => ({ ...f, hours_worked: e.target.value }))} className={inputCls} />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Start Date</label>
              <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Completion Date</label>
              <input type="date" value={form.completion_date} onChange={e => setForm(f => ({ ...f, completion_date: e.target.value }))} className={inputCls} />
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Live Project URL</label>
              <input value={form.live_url} onChange={e => setForm(f => ({ ...f, live_url: e.target.value }))} className={inputCls} placeholder="https://..." />
            </div>
            <div>
              <label className={labelCls}>Upwork Job URL</label>
              <input value={form.upwork_url} onChange={e => setForm(f => ({ ...f, upwork_url: e.target.value }))} className={inputCls} placeholder="https://www.upwork.com/..." />
            </div>
            <div>
              <label className={labelCls}>Demo Video (YouTube/Loom)</label>
              <input value={form.video_url} onChange={e => setForm(f => ({ ...f, video_url: e.target.value }))} className={inputCls} placeholder="https://youtu.be/... or https://loom.com/..." />
            </div>
          </div>

          {/* Summary + Description */}
          <div>
            <label className={labelCls}>Summary</label>
            <textarea rows={2} value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} className={`${inputCls} resize-none`} placeholder="Brief one-line summary..." />
          </div>

          {/* Job Description (what client posted) */}
          <div>
            <label className={labelCls}>Job Description (what client posted)</label>
            <textarea rows={3} value={form.job_description} onChange={e => setForm(f => ({ ...f, job_description: e.target.value }))} className={`${inputCls} resize-none`} placeholder="Paste the original job posting..." />
          </div>

          {/* Deliverables (what you provided) */}
          <div>
            <label className={labelCls}>What We Delivered</label>
            <textarea rows={3} value={form.deliverables} onChange={e => setForm(f => ({ ...f, deliverables: e.target.value }))} className={`${inputCls} resize-none`} placeholder="What you built / delivered..." />
          </div>

          <div>
            <label className={labelCls}>Description (extra detail)</label>
            <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={`${inputCls} resize-none`} />
          </div>

          {/* Client Review */}
          <div>
            <label className={labelCls}>Client Review</label>
            <textarea rows={2} value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))} className={`${inputCls} resize-none`} placeholder="Client's feedback from Upwork..." />
          </div>

          {/* Array fields: Images */}
          <ArrayField label="Project Images (paste URLs)" items={form.images} input={imageInput} setInput={setImageInput} onAdd={() => addToArray('images', imageInput, setImageInput)} onRemove={i => removeFromArray('images', i)} placeholder="https://i.imgur.com/..." />

          {/* Array fields: Tech */}
          <ArrayField label="Tech Stack" items={form.tech} input={techInput} setInput={setTechInput} onAdd={() => addToArray('tech', techInput, setTechInput)} onRemove={i => removeFromArray('tech', i)} placeholder="e.g. React" />
          <ArrayField label="Highlights" items={form.highlights} input={highlightInput} setInput={setHighlightInput} onAdd={() => addToArray('highlights', highlightInput, setHighlightInput)} onRemove={i => removeFromArray('highlights', i)} placeholder="Key feature..." />
          <ArrayField label="Impact" items={form.impact} input={impactInput} setInput={setImpactInput} onAdd={() => addToArray('impact', impactInput, setImpactInput)} onRemove={i => removeFromArray('impact', i)} placeholder="Business impact..." />
          <ArrayField label="Tags (Badges)" items={form.tags} input={tagInput} setInput={setTagInput} onAdd={() => addToArray('tags', tagInput, setTagInput)} onRemove={i => removeFromArray('tags', i)} placeholder="e.g. Collaborative" />

          {error && <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-lg px-4 py-3">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/[0.06]">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-400 hover:text-white border border-white/[0.1] text-sm transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ArrayField({ label, items, input, setInput, onAdd, onRemove, placeholder }) {
  return (
    <div>
      <label className="text-slate-400 text-xs font-medium mb-1 block">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), onAdd())}
          className="flex-1 bg-dark-950 border border-white/[0.1] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-primary-500/60 transition-colors"
          placeholder={placeholder}
        />
        <button type="button" onClick={onAdd} className="px-3 py-2 rounded-lg bg-primary-500/20 text-primary-400 text-sm hover:bg-primary-500/30 transition-colors">
          <FiPlus size={14} />
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1 px-2 py-1 bg-white/[0.04] border border-white/[0.08] rounded-lg text-slate-300 text-xs">
              {item}
              <button onClick={() => onRemove(i)} className="text-slate-500 hover:text-rose-400 ml-0.5"><FiX size={10} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Project Manager Section ──────────────────────────────────────────────────
function ProjectManager() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, in_progress, completed
  const [showForm, setShowForm] = useState(false)
  const [editProject, setEditProject] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    api.get('/api/dashboard/projects/', { headers: authHeader() })
      .then(r => setProjects(r.data))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = (project, type) => {
    if (type === 'create') setProjects(prev => [project, ...prev])
    else setProjects(prev => prev.map(p => p.id === project.id ? project : p))
    setShowForm(false)
    setEditProject(null)
  }

  const handleDelete = async (id) => {
    if (deleting === id) {
      await api.delete(`/api/dashboard/projects/${id}/`, { headers: authHeader() })
      setProjects(prev => prev.filter(p => p.id !== id))
      setDeleting(null)
    } else {
      setDeleting(id)
      setTimeout(() => setDeleting(null), 3000) // reset after 3s if not confirmed
    }
  }

  const handleMarkComplete = (project) => {
    setEditProject({ ...project, status: 'completed' })
    setShowForm(true)
  }

  const filtered = filter === 'all' ? projects : projects.filter(p => p.status === filter)
  const inProgress = projects.filter(p => p.status === 'in_progress').length
  const completed = projects.filter(p => p.status === 'completed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-white font-bold text-xl">Projects</h2>
          <p className="text-slate-500 text-sm">{projects.length} total · {inProgress} in progress · {completed} completed</p>
        </div>
        <button
          onClick={() => { setEditProject(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
        >
          <FiPlus size={16} /> Add Project
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/[0.06] pb-1">
        {[
          { id: 'all', label: 'All Projects', count: projects.length },
          { id: 'in_progress', label: 'In Progress', count: inProgress, color: 'text-amber-400' },
          { id: 'completed', label: 'Completed', count: completed, color: 'text-emerald-400' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              filter === t.id ? 'text-white border-b-2 border-primary-500' : 'text-slate-500 hover:text-white'
            }`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              t.id === 'in_progress' && t.count > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.06] text-slate-400'
            }`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Project List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="bg-dark-900 border border-white/[0.07] rounded-xl p-5 animate-pulse h-24" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FiFolder size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No {filter === 'all' ? '' : filter.replace('_', ' ')} projects yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(project => (
            <div key={project.id} className="bg-dark-900 border border-white/[0.07] rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-white font-semibold text-sm">{project.title}</h3>
                    {project.featured && <FiStar size={12} className="text-amber-400" />}
                    <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${
                      project.status === 'completed'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}>
                      {project.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-slate-500 text-xs">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs truncate">{project.summary}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    {project.client_name && <span>Client: {project.client_name}</span>}
                    {project.rating && <span className="flex items-center gap-0.5"><FiStar size={10} className="text-amber-400" /> {project.rating}</span>}
                    {project.project_value && <span>{project.project_value}</span>}
                    {project.hours_worked && <span>{project.hours_worked}h</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {project.status === 'in_progress' && (
                    <button
                      onClick={() => handleMarkComplete(project)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-medium hover:bg-emerald-500/25 transition-colors"
                    >
                      <FiCheckCircle size={12} /> Complete
                    </button>
                  )}
                  <button
                    onClick={() => { setEditProject(project); setShowForm(true) }}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      deleting === project.id
                        ? 'text-rose-400 bg-rose-500/15 hover:bg-rose-500/25'
                        : 'text-slate-400 hover:text-rose-400 hover:bg-white/[0.06]'
                    }`}
                    title={deleting === project.id ? 'Click again to confirm' : 'Delete'}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <ProjectFormModal
          project={editProject}
          onClose={() => { setShowForm(false); setEditProject(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const attempt = async () => {
    setLoading(true)
    setError('')
    try {
      await api.get('/api/dashboard/stats/', {
        headers: { Authorization: `Bearer ${password}` },
      })
      localStorage.setItem(STORAGE_KEY, password)
      onLogin()
    } catch {
      setError('Incorrect password.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-black text-sm">OL</span>
          </div>
          <h1 className="text-white font-bold text-xl">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Orchestrix Labs — Admin</p>
        </div>
        <div className="bg-dark-900 border border-white/[0.07] rounded-2xl p-6">
          <label className="text-slate-400 text-xs font-medium mb-1.5 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            placeholder="Enter dashboard password"
            className="w-full bg-dark-950 border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary-500/60 transition-colors mb-3"
            autoFocus
          />
          {error && <p className="text-rose-400 text-xs mb-3">{error}</p>}
          <button
            onClick={attempt}
            disabled={loading || !password}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Checking...' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const PAGES = [
  { id: 'overview', label: 'Overview', icon: FiHome },
  { id: 'projects', label: 'Projects', icon: FiGrid },
  { id: 'contacts', label: 'Leads', icon: FiMail },
  { id: 'settings', label: 'Settings', icon: FiSettings },
]

export default function Dashboard() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem(STORAGE_KEY))
  const [stats, setStats] = useState(null)
  const [contacts, setContacts] = useState([])
  const [page, setPage] = useState('overview')
  const [contactTab, setContactTab] = useState('new')
  const [refreshing, setRefreshing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const loadAll = useCallback(async () => {
    setRefreshing(true)
    try {
      const [s, c] = await Promise.all([
        api.get('/api/dashboard/stats/', { headers: authHeader() }),
        api.get('/api/dashboard/contacts/', { headers: authHeader() }),
      ])
      setStats(s.data)
      setContacts(c.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      setAuthed(false)
    } finally { setRefreshing(false) }
  }, [])

  useEffect(() => {
    if (authed) loadAll()
  }, [authed, loadAll])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/api/dashboard/contacts/${id}/`, { status: newStatus }, { headers: authHeader() })
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
    } catch { /* ignore */ }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setAuthed(false)
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  const newContacts = contacts.filter(c => c.status === 'new')
  const activeContacts = contacts.filter(c => ['discussion', 'in_progress', 'started_work'].includes(c.status))
  const doneContacts = contacts.filter(c => ['completed', 'archived'].includes(c.status))

  const contactTabs = [
    { id: 'new', label: 'New', count: newContacts.length, color: 'amber' },
    { id: 'active', label: 'Active', count: activeContacts.length, color: 'blue' },
    { id: 'done', label: 'Done', count: doneContacts.length },
    { id: 'all', label: 'All', count: contacts.length },
  ]
  const shownContacts = contactTab === 'new' ? newContacts
    : contactTab === 'active' ? activeContacts
    : contactTab === 'done' ? doneContacts
    : contacts

  return (
    <div className="min-h-screen bg-dark-950 text-white flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-white/[0.06] bg-dark-900/50 fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-white font-black text-xs">OL</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Orchestrix Labs</p>
              <p className="text-slate-500 text-xs">Admin Dashboard</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {PAGES.map(p => (
            <button
              key={p.id}
              onClick={() => setPage(p.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                page === p.id
                  ? 'bg-primary-500/15 text-primary-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <p.icon size={16} />
              {p.label}
              {p.id === 'contacts' && newContacts.length > 0 && (
                <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full">{newContacts.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/[0.06]">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-rose-400 hover:bg-white/[0.04] transition-all">
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <aside className="absolute left-0 inset-y-0 w-60 bg-dark-900 border-r border-white/[0.06] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <span className="text-white font-black text-xs">OL</span>
                </div>
                <p className="text-white font-semibold text-sm">Dashboard</p>
              </div>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {PAGES.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setPage(p.id); setSidebarOpen(false) }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    page === p.id ? 'bg-primary-500/15 text-primary-400' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <p.icon size={16} />
                  {p.label}
                </button>
              ))}
            </nav>
            <div className="p-3 border-t border-white/[0.06]">
              <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-rose-400 transition-all">
                <FiLogOut size={16} /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60">
        {/* Top bar */}
        <header className="border-b border-white/[0.06] bg-dark-950/90 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center justify-between h-14 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
              </button>
              <h1 className="text-white font-semibold text-sm">{PAGES.find(p => p.id === page)?.label}</h1>
            </div>
            <button
              onClick={loadAll}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white border border-white/[0.08] text-xs transition-colors disabled:opacity-50"
            >
              <FiRefreshCw size={12} className={refreshing ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl">
          {/* ── Overview Page ── */}
          {page === 'overview' && (
            <div className="space-y-8">
              {stats ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <StatCard icon={FiEye} label="Total Visits" value={stats.visits.total} color="primary" />
                  <StatCard icon={FiTrendingUp} label="This Week" value={stats.visits.this_week} color="emerald" />
                  <StatCard icon={FiMail} label="New Leads" value={stats.contacts.unread} color={stats.contacts.unread > 0 ? 'amber' : 'emerald'} sub={stats.contacts.unread > 0 ? 'Needs attention' : 'All caught up'} />
                  <StatCard icon={FiGrid} label="Total Projects" value={stats.projects?.total || 0} color="violet" sub={`${stats.projects?.in_progress || 0} in progress`} />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => <div key={i} className="bg-dark-900 border border-white/[0.07] rounded-2xl p-5 animate-pulse h-24" />)}
                </div>
              )}

              {/* Top Pages */}
              {stats && stats.top_pages.length > 0 && (
                <div className="bg-dark-900 border border-white/[0.07] rounded-2xl p-6">
                  <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
                    <FiEye size={16} className="text-primary-400" /> Top Pages
                  </h3>
                  <div className="space-y-2">
                    {stats.top_pages.map(({ path, count }) => {
                      const max = stats.top_pages[0]?.count || 1
                      return (
                        <div key={path} className="flex items-center gap-3">
                          <span className="text-slate-400 text-xs font-mono w-40 truncate flex-shrink-0">{path || '/'}</span>
                          <div className="flex-1 bg-white/[0.04] rounded-full h-2 overflow-hidden">
                            <div className="h-full bg-primary-500/60 rounded-full transition-all" style={{ width: `${(count / max) * 100}%` }} />
                          </div>
                          <span className="text-slate-400 text-xs w-8 text-right flex-shrink-0">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Recent leads preview */}
              {newContacts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold text-base">New Leads</h3>
                    <button onClick={() => setPage('contacts')} className="text-primary-400 text-xs hover:underline">View all</button>
                  </div>
                  <div className="space-y-3">
                    {newContacts.slice(0, 3).map(c => (
                      <ContactRow key={c.id} contact={c} onStatusChange={handleStatusChange} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Projects Page ── */}
          {page === 'projects' && <ProjectManager />}

          {/* ── Contacts / Leads Page ── */}
          {page === 'contacts' && (
            <div className="space-y-6">
              <h2 className="text-white font-bold text-xl">Leads & Contacts</h2>
              <div className="flex items-center gap-1 border-b border-white/[0.06] pb-1 overflow-x-auto">
                {contactTabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setContactTab(t.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors flex-shrink-0 ${
                      contactTab === t.id ? 'text-white border-b-2 border-primary-500' : 'text-slate-500 hover:text-white'
                    }`}
                  >
                    {t.label}
                    {t.count > 0 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        t.color === 'amber' && t.count > 0 ? 'bg-amber-500/20 text-amber-400'
                        : t.color === 'blue' && t.count > 0 ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-white/[0.06] text-slate-400'
                      }`}>{t.count}</span>
                    )}
                  </button>
                ))}
              </div>
              {shownContacts.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <FiCheck size={32} className="mx-auto mb-3 text-emerald-500/50" />
                  <p className="text-sm">{contactTab === 'new' ? 'No new leads!' : 'Nothing here.'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {shownContacts.map(c => <ContactRow key={c.id} contact={c} onStatusChange={handleStatusChange} />)}
                </div>
              )}
            </div>
          )}

          {/* ── Settings Page ── */}
          {page === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-white font-bold text-xl">Settings</h2>
              <SiteStatsEditor />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
