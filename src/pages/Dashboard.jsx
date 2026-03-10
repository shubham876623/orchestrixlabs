import { useState, useEffect, useCallback } from 'react'
import api from '../lib/axios'
import {
  FiMail, FiEye, FiUsers, FiTrendingUp, FiCheck, FiArchive,
  FiRefreshCw, FiLogOut, FiEdit2, FiSave, FiX, FiMessageSquare,
} from 'react-icons/fi'

const STORAGE_KEY = 'orchestrix_dash_secret'

// ─── Auth helper ─────────────────────────────────────────────────────────────
function authHeader() {
  const s = localStorage.getItem(STORAGE_KEY) || ''
  return { Authorization: `Bearer ${s}` }
}

// ─── Small reusable stat card ────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = 'primary' }) {
  const colors = {
    primary: 'text-primary-400 bg-primary-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber:   'text-amber-400   bg-amber-500/10',
    rose:    'text-rose-400    bg-rose-500/10',
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

// ─── Contact row ─────────────────────────────────────────────────────────────
function ContactRow({ contact, onStatusChange }) {
  const [open, setOpen] = useState(false)
  const statusColors = {
    new:      'bg-amber-500/15 text-amber-400 border-amber-500/30',
    read:     'bg-slate-500/15 text-slate-400 border-slate-500/30',
    replied:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    archived: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  }
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
            {contact.budget && (
              <span className="text-slate-500 text-xs">{contact.budget}</span>
            )}
          </div>
          <p className="text-slate-400 text-xs mt-0.5 truncate">{contact.message}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${statusColors[contact.status] || statusColors.new}`}>
            {contact.status}
          </span>
          <span className="text-slate-600 text-xs">
            {new Date(contact.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/[0.05] p-4 bg-dark-950/50">
          <p className="text-slate-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{contact.message}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 text-xs mr-2">Mark as:</span>
            {['new', 'read', 'replied', 'archived'].map(s => (
              <button
                key={s}
                onClick={() => onStatusChange(contact.id, s)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  contact.status === s
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'border-white/[0.1] text-slate-400 hover:text-white hover:border-white/[0.2]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Site stats editor ────────────────────────────────────────────────────────
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
    } finally {
      setSaving(false)
    }
  }

  if (!stats) return <div className="text-slate-500 text-sm">Loading...</div>

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
        <h3 className="text-white font-semibold text-base">Site Stats (shown publicly)</h3>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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

// ─── Login screen ─────────────────────────────────────────────────────────────
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
    } finally {
      setLoading(false)
    }
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
export default function Dashboard() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem(STORAGE_KEY))
  const [stats, setStats] = useState(null)
  const [contacts, setContacts] = useState([])
  const [activeTab, setActiveTab] = useState('unread')
  const [refreshing, setRefreshing] = useState(false)

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
      // Token expired or invalid — log out
      localStorage.removeItem(STORAGE_KEY)
      setAuthed(false)
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (authed) loadAll()
  }, [authed, loadAll])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/api/dashboard/contacts/${id}/`, { status: newStatus }, { headers: authHeader() })
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
      if (stats) {
        setStats(prev => ({
          ...prev,
          contacts: {
            ...prev.contacts,
            unread: contacts.filter(c => (c.id === id ? newStatus : c.status) === 'new').length,
            read: contacts.filter(c => (c.id === id ? newStatus : c.status) !== 'new').length,
          },
        }))
      }
    } catch { /* ignore */ }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setAuthed(false)
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  const unread = contacts.filter(c => c.status === 'new')
  const read = contacts.filter(c => c.status !== 'new')
  const shownContacts = activeTab === 'unread' ? unread : activeTab === 'read' ? read : contacts

  const tabs = [
    { id: 'unread', label: 'Unread', count: unread.length, color: 'text-amber-400' },
    { id: 'read',   label: 'Read / Replied', count: read.length },
    { id: 'all',    label: 'All Contacts', count: contacts.length },
  ]

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-dark-950/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-white font-black text-xs">OL</span>
            </div>
            <div>
              <span className="text-white font-semibold text-sm">Dashboard</span>
              <span className="text-slate-500 text-xs ml-2">Orchestrix Labs</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadAll}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-400 hover:text-white border border-white/[0.08] text-xs transition-colors disabled:opacity-50"
            >
              <FiRefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-400 hover:text-rose-400 border border-white/[0.08] text-xs transition-colors">
              <FiLogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Stats Row */}
        {stats ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard icon={FiEye}         label="Total Visits"    value={stats.visits.total}        color="primary" />
            <StatCard icon={FiTrendingUp}  label="Visits Today"    value={stats.visits.today}        color="emerald" />
            <StatCard icon={FiTrendingUp}  label="This Week"       value={stats.visits.this_week}    color="emerald" />
            <StatCard icon={FiTrendingUp}  label="This Month"      value={stats.visits.this_month}   color="primary" />
            <StatCard icon={FiMail}        label="Total Contacts"  value={stats.contacts.total}      color="amber" />
            <StatCard icon={FiMessageSquare} label="Unread Leads"  value={stats.contacts.unread}     color={stats.contacts.unread > 0 ? 'rose' : 'emerald'}
              sub={stats.contacts.unread > 0 ? 'Needs attention' : 'All caught up'}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-dark-900 border border-white/[0.07] rounded-2xl p-5 animate-pulse h-24" />
            ))}
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
                      <div
                        className="h-full bg-primary-500/60 rounded-full transition-all"
                        style={{ width: `${(count / max) * 100}%` }}
                      />
                    </div>
                    <span className="text-slate-400 text-xs w-8 text-right flex-shrink-0">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Leads / Contacts */}
        <div>
          <div className="flex items-center gap-1 mb-4 border-b border-white/[0.06] pb-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                  activeTab === t.id
                    ? 'text-white border-b-2 border-primary-500'
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {t.label}
                {t.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    t.id === 'unread' && t.count > 0
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-white/[0.06] text-slate-400'
                  }`}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {shownContacts.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <FiCheck size={32} className="mx-auto mb-3 text-emerald-500/50" />
              <p className="text-sm">{activeTab === 'unread' ? 'No unread messages — all clear!' : 'Nothing here yet.'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shownContacts.map(contact => (
                <ContactRow key={contact.id} contact={contact} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </div>

        {/* Site Stats Editor */}
        <SiteStatsEditor />

      </main>
    </div>
  )
}
