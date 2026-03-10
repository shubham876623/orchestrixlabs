import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  FiX, FiCheck, FiArrowRight, FiExternalLink, FiStar, FiClock,
  FiChevronDown, FiChevronUp, FiGlobe, FiImage,
} from 'react-icons/fi'
import { SiUpwork } from 'react-icons/si'
import { Link } from 'react-router-dom'
import api from '../lib/axios'
import SEOHead from '../components/SEOHead'
import { projects as localProjects } from '../data/projects'

const UPWORK_PROFILE = 'https://www.upwork.com/agencies/1464061503601672192/'

const insightBadges = [
  { label: 'Collaborative', count: 28 },
  { label: 'Clear Communicator', count: 24 },
  { label: 'Committed to Quality', count: 23 },
  { label: 'Reliable', count: 18 },
  { label: 'Solution Oriented', count: 15 },
  { label: 'Accountable for Outcomes', count: 8 },
  { label: 'Professional', count: 5 },
]

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating, size = 14 }) {
  if (!rating) return null
  const r = Number(rating)
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          size={size}
          className={i < Math.round(r) ? 'text-amber-400' : 'text-slate-700'}
          style={i < Math.round(r) ? { fill: 'currentColor' } : {}}
        />
      ))}
      <span className="text-slate-300 text-sm font-semibold ml-1">{r.toFixed(1)}</span>
    </div>
  )
}

// ─── Project Detail Modal ─────────────────────────────────────────────────────
function ProjectDetailModal({ project, onClose }) {
  if (!project) return null

  const dateRange = project.start_date && project.completion_date
    ? `${new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(project.completion_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : project.start_date
    ? `Started ${new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : ''

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-dark-900 border border-white/[0.08] rounded-2xl max-w-3xl w-full my-8"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-white/[0.06]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-white font-bold text-xl sm:text-2xl leading-tight mb-3">{project.title}</h2>
                <div className="flex items-center gap-3 flex-wrap">
                  {project.rating && <StarRating rating={project.rating} />}
                  {dateRange && (
                    <span className="text-slate-500 text-sm">{dateRange}</span>
                  )}
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors flex-shrink-0 ml-4">
                <FiX size={20} />
              </button>
            </div>

            {/* Client review */}
            {project.review && (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 mt-4">
                <p className="text-slate-300 text-sm leading-relaxed italic">"{project.review}"</p>
              </div>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-4 flex-wrap mt-4 text-sm">
              {project.project_value && (
                <span className="text-white font-semibold">{project.project_value}</span>
              )}
              {project.price_type && (
                <span className="text-slate-400">{project.price_type}</span>
              )}
              {project.hours_worked && (
                <span className="text-slate-400">{project.hours_worked} hours</span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Job Description (what client posted) */}
            {project.job_description && (
              <div>
                <h3 className="text-white font-semibold text-sm mb-2 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary-500 rounded-full" />
                  What the Client Needed
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{project.job_description}</p>
              </div>
            )}

            {/* What we delivered */}
            {project.deliverables && (
              <div>
                <h3 className="text-white font-semibold text-sm mb-2 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full" />
                  What We Delivered
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{project.deliverables}</p>
              </div>
            )}

            {/* Description fallback */}
            {!project.job_description && !project.deliverables && project.description && (
              <div>
                <h3 className="text-white font-semibold text-sm mb-2 uppercase tracking-wider">About This Project</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>
              </div>
            )}

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div>
                <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Key Deliverables</h3>
                <ul className="space-y-2">
                  {project.highlights.map(h => (
                    <li key={h} className="flex items-start gap-2.5 text-slate-300 text-sm">
                      <FiCheck className="text-emerald-400 mt-0.5 flex-shrink-0" size={14} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Impact */}
            {project.impact && project.impact.length > 0 && (
              <div>
                <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Impact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.impact.map(imp => (
                    <div key={imp} className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className="text-emerald-300 text-xs">{imp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {project.tech && project.tech.length > 0 && (
              <div>
                <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map(t => (
                    <span key={t} className="px-3 py-1 bg-white/[0.04] border border-white/[0.08] rounded-lg text-slate-300 text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Images */}
            {project.images && project.images.length > 0 && (
              <div>
                <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                  <FiImage size={14} /> Project Screenshots
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.images.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden border border-white/[0.08] hover:border-primary-500/40 transition-colors">
                      <img src={url} alt={`${project.title} screenshot ${i + 1}`} className="w-full h-auto" loading="lazy" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer buttons */}
          <div className="p-6 sm:p-8 border-t border-white/[0.06] flex flex-col sm:flex-row gap-3">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.1] text-slate-300 hover:text-white hover:border-white/[0.2] text-sm font-medium transition-all">
                <FiGlobe size={14} /> View Live Project
              </a>
            )}
            {project.upwork_url && (
              <a href={project.upwork_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[#14a800]/40 text-[#14a800] hover:bg-[#14a800]/10 text-sm font-medium transition-all">
                <SiUpwork size={14} /> View on Upwork
              </a>
            )}
            <Link to="/contact" onClick={onClose} className="btn-primary justify-center flex-1 sm:flex-none">
              Build Something Similar <FiArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Single Job Row (Upwork style) ────────────────────────────────────────────
function JobRow({ project, onClick }) {
  const dateRange = project.start_date && project.completion_date
    ? `${new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(project.completion_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : project.start_date
    ? `Started ${new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : ''

  return (
    <div className="border-b border-white/[0.06] hover:bg-white/[0.015] transition-colors">
      <div className="p-5 sm:p-6">
        {/* Title */}
        <h3
          className="text-primary-400 font-semibold text-base sm:text-lg cursor-pointer hover:text-primary-300 transition-colors mb-2 leading-snug"
          onClick={() => onClick(project)}
        >
          {project.title}
        </h3>

        {/* Rating + Date row */}
        <div className="flex items-center gap-3 flex-wrap mb-3">
          {project.rating && <StarRating rating={project.rating} size={13} />}
          {dateRange && (
            <>
              <span className="text-slate-600">|</span>
              <span className="text-slate-500 text-sm">{dateRange}</span>
            </>
          )}
          {project.status === 'in_progress' && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-medium flex items-center gap-1">
              <FiClock size={9} /> In Progress
            </span>
          )}
        </div>

        {/* Client Review */}
        {project.review && (
          <p className="text-slate-400 text-sm leading-relaxed mb-3 italic">
            "{project.review}"
          </p>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.map(tag => (
              <span key={tag} className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-400 text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Value + Hours row */}
        <div className="flex items-center gap-6 flex-wrap text-sm text-slate-500">
          {project.project_value && (
            <span className="font-medium text-slate-300">{project.project_value}</span>
          )}
          {project.price_type && <span>{project.price_type}</span>}
          {project.hours_worked && <span>{project.hours_worked} hours</span>}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-4">
          {project.upwork_url ? (
            <a
              href={project.upwork_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#14a800]/30 text-[#14a800] hover:bg-[#14a800]/10 hover:border-[#14a800]/50 text-xs font-medium transition-all"
            >
              <SiUpwork size={12} /> View on Upwork
            </a>
          ) : (
            <a
              href={UPWORK_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#14a800]/30 text-[#14a800] hover:bg-[#14a800]/10 hover:border-[#14a800]/50 text-xs font-medium transition-all"
            >
              <SiUpwork size={12} /> View on Upwork
            </a>
          )}
          <Link
            to="/contact"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-500/10 border border-primary-500/25 text-primary-400 hover:bg-primary-500/20 text-xs font-medium transition-all"
          >
            <FiArrowRight size={12} /> Build Something Similar
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [statusFilter, setStatusFilter] = useState('completed')
  const [selectedProject, setSelectedProject] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 })

  useEffect(() => {
    api.get('/api/projects/')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) setProjects(res.data)
        else setProjects(localProjects)
      })
      .catch(() => setProjects(localProjects))
      .finally(() => setLoading(false))
  }, [])

  const completedProjects = projects.filter(p => (p.status || 'completed') === 'completed')
  const inProgressProjects = projects.filter(p => p.status === 'in_progress')

  const filtered = statusFilter === 'completed' ? completedProjects
    : statusFilter === 'in_progress' ? inProgressProjects
    : projects

  return (
    <>
      <SEOHead
        title="Work History"
        description="133+ completed jobs and 10 in-progress projects. See our full work history with real client ratings, reviews, and verified results from Upwork."
        path="/portfolio"
      />

      {/* Hero */}
      <section className="relative pt-36 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient grid-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-950" />
        <div className="container relative z-10">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-tag mb-5 inline-flex">
            Work History
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="section-heading mb-5">
            Real projects. Real ratings.<br />
            <span className="gradient-text">Verified on Upwork.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="section-sub mx-auto">
            Every project listed here is a real engagement with verifiable client feedback.
            No stock templates. No fake reviews. Just work that speaks for itself.
          </motion.p>
        </div>
      </section>

      {/* Insight Badges Bar */}
      <section className="py-6 border-b border-white/[0.05]">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mb-4">
            <p className="text-slate-500 text-xs uppercase tracking-wider font-medium">Insights from completed jobs</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {insightBadges.map(badge => (
              <span
                key={badge.label}
                className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-300 text-xs sm:text-sm font-medium hover:border-primary-500/30 hover:bg-primary-500/5 transition-all cursor-default"
              >
                {badge.label} <span className="text-primary-400 font-bold ml-1">{badge.count}</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Work History Section */}
      <section className="py-12" ref={ref}>
        <div className="container max-w-4xl">
          {/* Tabs */}
          <div className="flex items-center gap-0 border-b border-white/[0.08] mb-0">
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 ${
                statusFilter === 'completed'
                  ? 'text-white border-primary-500'
                  : 'text-slate-500 border-transparent hover:text-white'
              }`}
            >
              Completed jobs ({completedProjects.length})
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 ${
                statusFilter === 'in_progress'
                  ? 'text-white border-primary-500'
                  : 'text-slate-500 border-transparent hover:text-white'
              }`}
            >
              In progress ({inProgressProjects.length})
            </button>
          </div>

          {/* Job List */}
          {loading ? (
            <div className="space-y-0">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="border-b border-white/[0.06] p-6 animate-pulse">
                  <div className="h-5 bg-white/[0.06] rounded w-2/3 mb-3" />
                  <div className="h-4 bg-white/[0.04] rounded w-1/3 mb-3" />
                  <div className="h-4 bg-white/[0.04] rounded w-full mb-2" />
                  <div className="h-4 bg-white/[0.04] rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-sm">No {statusFilter === 'in_progress' ? 'in-progress' : 'completed'} projects to show yet.</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : { opacity: 0 }} transition={{ duration: 0.4 }}>
              {filtered.map(project => (
                <JobRow
                  key={project.id}
                  project={project}
                  onClick={setSelectedProject}
                />
              ))}
            </motion.div>
          )}

          {/* View on Upwork CTA */}
          <div className="text-center py-10">
            <a
              href={UPWORK_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#14a800]/40 text-[#14a800] hover:bg-[#14a800]/10 hover:border-[#14a800]/70 text-sm font-semibold transition-all"
            >
              <SiUpwork size={16} /> View full profile on Upwork
            </a>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-16 bg-dark-900/40 border-y border-white/[0.05]">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { v: '143+',   l: 'Projects Delivered' },
              { v: '100%',   l: 'Job Success Score' },
              { v: '$100K+', l: 'Revenue Generated' },
              { v: '4,824',  l: 'Engineering Hours' },
            ].map(({ v, l }) => (
              <div key={l}>
                <div className="text-3xl font-black gradient-text mb-1">{v}</div>
                <p className="text-slate-500 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="container">
          <h2 className="section-heading mb-4">Ready to start your project?</h2>
          <p className="section-sub mx-auto mb-8">
            Join 143+ clients who trusted us with their vision.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/contact" className="btn-primary text-base px-8 py-3.5">
              Start a Conversation <FiArrowRight />
            </Link>
            <a
              href={UPWORK_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-base px-8 py-3.5"
            >
              <SiUpwork size={16} /> Hire on Upwork
            </a>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </>
  )
}
