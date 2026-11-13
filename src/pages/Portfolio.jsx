import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowRight, FiSearch } from 'react-icons/fi'
import SEOHead from '../components/SEOHead'
import DraftPreviewBanner from '../components/portfolio/DraftPreviewBanner'
import CategoryTabs from '../components/portfolio/CategoryTabs'
import ProjectCard from '../components/portfolio/ProjectCard'
import {
  PORTFOLIO_CATEGORIES,
  getVisiblePublishedProjects,
  isDraftPortfolioMode,
} from '../data/publishedProjects'

function countByCategory(projects) {
  const counts = { 'All Projects': projects.length }
  PORTFOLIO_CATEGORIES.forEach((c) => {
    if (c === 'All Projects') return
    counts[c] = projects.filter((p) => p.categories.includes(c)).length
  })
  return counts
}

export default function Portfolio() {
  const reduceMotion = useReducedMotion()
  const [searchParams, setSearchParams] = useSearchParams()

  const categoryParam = searchParams.get('category') || 'All Projects'
  const category = PORTFOLIO_CATEGORIES.includes(categoryParam) ? categoryParam : 'All Projects'
  const query = searchParams.get('q') || ''

  const setCategory = (next) => {
    const params = new URLSearchParams(searchParams)
    if (!next || next === 'All Projects') params.delete('category')
    else params.set('category', next)
    setSearchParams(params, { replace: true })
  }

  const setQuery = (next) => {
    const params = new URLSearchParams(searchParams)
    const value = next.trim()
    if (!value) params.delete('q')
    else params.set('q', value)
    setSearchParams(params, { replace: true })
  }

  const visibleProjects = useMemo(() => getVisiblePublishedProjects(), [])

  const counts = useMemo(() => countByCategory(visibleProjects), [visibleProjects])

  const visibleCategories = useMemo(
    () => PORTFOLIO_CATEGORIES.filter((c) => c === 'All Projects' || (counts[c] || 0) > 0),
    [counts]
  )

  const activeCategory = visibleCategories.includes(category) ? category : 'All Projects'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return visibleProjects.filter((p) => {
      const catOk = activeCategory === 'All Projects' || p.categories.includes(activeCategory)
      const qOk =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.categories.some((c) => c.toLowerCase().includes(q))
      return catOk && qOk
    })
  }, [activeCategory, query, visibleProjects])

  const fade = (delay = 0) =>
    reduceMotion
      ? { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.35 },
        }

  return (
    <>
      <SEOHead
        title="Portfolio"
        description="Selected AI engineering and software engagements from Orchestrix Labs — voice AI, automation, full-stack platforms, and data systems."
        path="/portfolio"
        noindex={isDraftPortfolioMode()}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Portfolio', path: '/portfolio' },
        ]}
      />

      <DraftPreviewBanner />

      <section className="relative overflow-hidden pb-8 pt-28 sm:pb-10 sm:pt-32">
        <div className="absolute inset-0 hero-gradient grid-pattern opacity-40 dark:opacity-70" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/40 to-slate-50 dark:via-transparent dark:to-dark-950" aria-hidden="true" />
        <div className="container relative z-10">
          <motion.p {...fade(0)} className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-300/80">
            Portfolio
          </motion.p>
          <motion.h1
            {...fade(0.04)}
            className="max-w-3xl font-display text-[2rem] font-semibold leading-[1.12] text-slate-900 dark:text-white sm:text-5xl lg:text-[3.25rem]"
          >
            Engineering that international teams can inspect and trust.
          </motion.h1>
          <motion.p
            {...fade(0.08)}
            className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:mt-5 sm:text-lg"
          >
            Selected engagements across voice AI, agents, automation, and full-stack systems.
            Public case studies stay limited to verified, approved detail.
          </motion.p>
          <motion.div {...fade(0.12)} className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
            <Link to="/contact" className="btn-primary">
              Discuss a similar build <FiArrowRight />
            </Link>
            <Link to="/work-history" className="btn-outline">
              Browse full work history
            </Link>
          </motion.div>
        </div>
      </section>

      {visibleProjects.length > 0 && (
        <section className="sticky top-[4.25rem] z-30 border-y border-slate-200/80 bg-white/95 py-4 backdrop-blur-xl dark:border-white/[0.06] dark:bg-dark-950/95 dark:supports-[backdrop-filter]:bg-dark-950/80">
          <div className="container space-y-4">
            <CategoryTabs
              categories={visibleCategories}
              active={activeCategory}
              counts={counts}
              onChange={setCategory}
            />
            <label className="relative block max-w-md">
              <span className="sr-only">Search projects</span>
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or category"
                className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:placeholder:text-slate-600"
              />
            </label>
          </div>
        </section>
      )}

      <section className="py-10 sm:py-14">
        <div className="container">
          <div
            id="portfolio-panel"
            role="tabpanel"
            aria-label={`${activeCategory} projects`}
          >
            {visibleProjects.length > 0 && (
              <p className="mb-6 text-sm text-slate-500">
                Showing <span className="font-medium text-slate-800 dark:text-slate-300">{filtered.length}</span> of {visibleProjects.length}{isDraftPortfolioMode() ? ' draft' : ''} projects
                {activeCategory !== 'All Projects' ? ` in ${activeCategory}` : ''}
              </p>
            )}

            {visibleProjects.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-dark-900/40 sm:px-10">
                <p className="font-display text-xl text-slate-900 dark:text-white">Case studies coming soon</p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  We publish portfolio work only after explicit publication approval. Tell us about the system you want built — we will respond with a practical scope and timeline.
                </p>
                <Link to="/contact" className="btn-primary mt-8 inline-flex">
                  Request Consultation <FiArrowRight />
                </Link>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center dark:border-white/10 dark:bg-dark-900/40">
                <p className="font-display text-xl text-slate-900 dark:text-white">No projects in this view</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
                  Try another category or clear search. Empty categories stay hidden until published projects exist.
                </p>
                <button
                  type="button"
                  className="btn-outline mt-6"
                  onClick={() => {
                    setCategory('All Projects')
                    setQuery('')
                  }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((project, i) => (
                  <motion.div
                    key={project.id}
                    {...(reduceMotion
                      ? { initial: false }
                      : {
                          initial: { opacity: 0, y: 14 },
                          animate: { opacity: 1, y: 0 },
                          transition: { delay: Math.min(i * 0.03, 0.2), duration: 0.3 },
                        })}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-14 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-dark-900 to-dark-950 p-7 text-center sm:mt-16 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              Need a production AI system, not a demo?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              Tell us about the workflow you want automated. We will respond with a practical scope and timeline.
            </p>
            <Link to="/contact" className="btn-primary mt-6">
              Request Consultation <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
