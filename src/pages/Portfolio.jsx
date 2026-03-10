import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiX, FiCheck, FiArrowRight, FiExternalLink, FiStar, FiClock } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../lib/axios'
import SEOHead from '../components/SEOHead'
import { projects as localProjects } from '../data/projects'

const categories = ['All', 'Voice AI & Chatbots', 'Machine Learning & AI', 'Web Scraping & Automation', 'Full-Stack Development', 'Workflow Automation']

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
}

const categoryColors = {
  'Voice AI & Chatbots':           'bg-violet-500/10  border-violet-500/20  text-violet-400',
  'Machine Learning & AI':         'bg-indigo-500/10  border-indigo-500/20  text-indigo-400',
  'Web Scraping & Automation':     'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  'Full-Stack Development':        'bg-cyan-500/10    border-cyan-500/20    text-cyan-400',
  'Workflow Automation':           'bg-orange-500/10  border-orange-500/20  text-orange-400',
}

function StarRating({ rating }) {
  if (!rating) return null
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          size={12}
          className={i < full || (i === full && half) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
          style={i < full || (i === full && half) ? { fill: 'currentColor' } : {}}
        />
      ))}
      <span className="text-slate-400 text-xs ml-1">{rating}</span>
    </div>
  )
}

function ProjectModal({ project, onClose }) {
  if (!project) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-dark-900 border border-white/[0.08] rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full border text-xs font-medium ${categoryColors[project.category] || 'bg-primary-500/10 border-primary-500/20 text-primary-400'}`}>
                {project.category}
              </span>
              {project.status === 'in_progress' && (
                <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-medium flex items-center gap-1">
                  <FiClock size={10} /> In Progress
                </span>
              )}
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors">
              <FiX size={18} />
            </button>
          </div>

          <h2 className="text-white font-bold text-2xl mb-3">{project.title}</h2>

          {/* Rating + Client + Value row */}
          <div className="flex items-center gap-4 flex-wrap mb-4">
            {project.rating && <StarRating rating={Number(project.rating)} />}
            {project.client_name && <span className="text-slate-400 text-xs">Client: {project.client_name}</span>}
            {project.project_value && <span className="text-emerald-400 text-xs font-medium">{project.project_value}</span>}
            {project.hours_worked && <span className="text-slate-400 text-xs">{project.hours_worked} hours</span>}
            {project.start_date && project.completion_date && (
              <span className="text-slate-500 text-xs">
                {new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} — {new Date(project.completion_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>

          <p className="text-slate-400 text-sm leading-relaxed mb-6">{project.description}</p>

          {/* Client review */}
          {project.review && (
            <div className="mb-6 bg-primary-500/5 border border-primary-500/15 rounded-xl p-4">
              <p className="text-slate-300 text-sm italic leading-relaxed">"{project.review}"</p>
              {project.client_name && <p className="text-primary-400 text-xs mt-2 font-medium">— {project.client_name}</p>}
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Key Features</h3>
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
            <div className="mb-6">
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

          {/* Tech */}
          <div className="pt-5 border-t border-white/[0.06]">
            <h3 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map(t => (
                <span key={t} className="px-3 py-1 bg-white/[0.04] border border-white/[0.08] rounded-lg text-slate-300 text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Link to="/contact" onClick={onClose} className="btn-primary w-full justify-center">
              Build Something Similar <FiArrowRight />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function ProjectCard({ project, index, onClick }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      layout
      className="group card hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => onClick(project)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${categoryColors[project.category] || 'bg-primary-500/10 border-primary-500/20 text-primary-400'}`}>
            {project.category}
          </span>
          {project.status === 'in_progress' && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-medium flex items-center gap-1">
              <FiClock size={9} /> In Progress
            </span>
          )}
        </div>
        <FiExternalLink className="text-slate-600 group-hover:text-slate-400 transition-colors" size={14} />
      </div>

      <h3 className="text-white font-bold text-base mb-2 group-hover:text-primary-300 transition-colors leading-snug">
        {project.title}
      </h3>

      {/* Rating row */}
      {project.rating && (
        <div className="flex items-center gap-3 mb-2">
          <StarRating rating={Number(project.rating)} />
          {project.project_value && <span className="text-slate-500 text-xs">{project.project_value}</span>}
          {project.hours_worked && <span className="text-slate-500 text-xs">{project.hours_worked}h</span>}
        </div>
      )}

      {/* Client review snippet */}
      {project.review ? (
        <p className="text-slate-400 text-sm leading-relaxed mb-3 flex-1 italic line-clamp-2">
          "{project.review}"
        </p>
      ) : (
        <p className="text-slate-400 text-sm leading-relaxed mb-3 flex-1 line-clamp-2">{project.summary}</p>
      )}

      {/* Tags */}
      {project.tags && project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Impact or tech at bottom */}
      {!project.review && project.impact && project.impact.length > 0 && (
        <div className="space-y-1.5 mb-4">
          {project.impact.slice(0, 2).map(imp => (
            <div key={imp} className="flex items-center gap-2 text-xs text-emerald-400">
              <FiCheck size={11} className="flex-shrink-0" />
              {imp}
            </div>
          ))}
        </div>
      )}

      <div className="pt-3 border-t border-white/[0.05] flex flex-wrap gap-1.5 mt-auto">
        {project.tech.slice(0, 4).map(t => (
          <span key={t} className="px-2 py-0.5 bg-white/[0.03] border border-white/[0.06] rounded text-slate-500 text-xs">
            {t}
          </span>
        ))}
        {project.tech.length > 4 && (
          <span className="text-slate-600 text-xs px-1 py-0.5">+{project.tech.length - 4}</span>
        )}
      </div>
    </motion.div>
  )
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All')
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

  const completedCount = projects.filter(p => (p.status || 'completed') === 'completed').length
  const inProgressCount = projects.filter(p => p.status === 'in_progress').length

  const filtered = projects
    .filter(p => {
      const pStatus = p.status || 'completed'
      if (statusFilter !== 'all' && pStatus !== statusFilter) return false
      if (activeCategory !== 'All' && p.category !== activeCategory) return false
      return true
    })

  return (
    <>
      <SEOHead
        title="Portfolio"
        description="200+ production projects across Voice AI, Machine Learning, Full-Stack Development, Web Scraping, and Workflow Automation. See real case studies and results from Orchestrix Labs."
        path="/portfolio"
      />

      {/* Hero */}
      <section className="relative pt-36 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient grid-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-950" />
        <div className="container relative z-10">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-tag mb-5 inline-flex">
            Portfolio
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="section-heading mb-5">
            Our work speaks for itself.<br />
            <span className="gradient-text">Real projects. Real results.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="section-sub mx-auto">
            Every project shipped to production, actively used by clients, and delivering measurable business impact.
          </motion.p>
        </div>
      </section>

      {/* Status Tabs + Category Filters */}
      <section className="py-4 sticky top-16 z-40 bg-dark-950/90 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="container space-y-3">
          {/* Status tabs */}
          <div className="flex items-center gap-2">
            {[
              { id: 'completed', label: 'Completed', count: completedCount },
              { id: 'in_progress', label: 'In Progress', count: inProgressCount },
              { id: 'all', label: 'All', count: projects.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  statusFilter === tab.id
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-white hover:border-white/[0.15]'
                }`}
              >
                {tab.label}
                <span className="text-xs opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-white/[0.1] text-white border border-white/[0.15]'
                    : 'text-slate-500 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16" ref={ref}>
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-5 bg-white/[0.06] rounded-lg w-1/3 mb-4" />
                  <div className="h-4 bg-white/[0.06] rounded w-3/4 mb-2" />
                  <div className="h-4 bg-white/[0.06] rounded w-full mb-2" />
                  <div className="h-4 bg-white/[0.06] rounded w-2/3 mb-6" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-white/[0.04] rounded w-16" />
                    <div className="h-6 bg-white/[0.04] rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-sm">No projects match the current filters.</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                    onClick={setSelectedProject}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
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
          <h2 className="section-heading mb-4">Have a project in mind?</h2>
          <p className="section-sub mx-auto mb-8">Let's discuss what we can build together.</p>
          <Link to="/contact" className="btn-primary text-base px-8 py-3.5">
            Start a Conversation <FiArrowRight />
          </Link>
        </div>
      </section>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </>
  )
}
