import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowRight, FiSearch } from 'react-icons/fi'
import SEOHead from '../components/SEOHead'
import DraftPreviewBanner from '../components/portfolio/DraftPreviewBanner'
import CategoryTabs from '../components/portfolio/CategoryTabs'
import ProjectCard from '../components/portfolio/ProjectCard'
import { SITE, SOCIAL, STATS } from '../lib/site'
import { getSeoPage } from '../lib/seoPages'
import {
  PORTFOLIO_CATEGORIES,
  getAllProjectCards,
  getFeaturedCaseStudies,
  isDraftPortfolioMode,
} from '../data/publishedProjects'

const PAGE_SIZE = 12

function countByCategory(projects) {
  const counts = { 'All Projects': projects.length }
  PORTFOLIO_CATEGORIES.forEach((c) => {
    if (c === 'All Projects') return
    counts[c] = projects.filter((p) => (p.categories || []).includes(c)).length
  })
  return counts
}

export default function Portfolio() {
  const reduceMotion = useReducedMotion()
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)

  const categoryParam = searchParams.get('category') || 'All Projects'
  const category = PORTFOLIO_CATEGORIES.includes(categoryParam) ? categoryParam : 'All Projects'
  const query = searchParams.get('q') || ''

  const setCategory = (next) => {
    setPage(1)
    const params = new URLSearchParams(searchParams)
    if (!next || next === 'All Projects') params.delete('category')
    else params.set('category', next)
    setSearchParams(params, { replace: true })
  }

  const setQuery = (next) => {
    setPage(1)
    const params = new URLSearchParams(searchParams)
    const value = next.trim()
    if (!value) params.delete('q')
    else params.set('q', value)
    setSearchParams(params, { replace: true })
  }

  const allCards = useMemo(() => getAllProjectCards(), [])
  const featured = useMemo(() => {
    const bySlug = new Map(allCards.map((c) => [c.slug, c]))
    return getFeaturedCaseStudies()
      .slice(0, 10)
      .map((p) => {
        const card = bySlug.get(p.slug)
        if (!card) return { ...p, hasCaseStudy: true }
        return {
          ...p,
          summary: card.summary || p.summary,
          deliveryStatus: card.deliveryStatus || p.deliveryStatus,
          techCandidates: card.techCandidates || p.techCandidates,
          demoOnly: card.demoOnly || p.demoOnly,
          hasCaseStudy: true,
        }
      })
  }, [allCards])
  const counts = useMemo(() => countByCategory(allCards), [allCards])

  const visibleCategories = useMemo(
    () => PORTFOLIO_CATEGORIES.filter((c) => c === 'All Projects' || (counts[c] || 0) > 0),
    [counts]
  )

  const activeCategory = visibleCategories.includes(category) ? category : 'All Projects'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allCards.filter((p) => {
      const cats = p.categories || []
      const catOk = activeCategory === 'All Projects' || cats.includes(activeCategory)
      const qOk =
        !q ||
        (p.title || '').toLowerCase().includes(q) ||
        (p.summary || '').toLowerCase().includes(q) ||
        cats.some((c) => c.toLowerCase().includes(q)) ||
        (p.techCandidates || []).some((t) => t.toLowerCase().includes(q))
      return catOk && qOk
    })
  }, [activeCategory, query, allCards])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

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
        title={getSeoPage('/portfolio')?.title}
        description={getSeoPage('/portfolio')?.description}
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
            Verified AI engineering and{' '}
            <span className="gradient-text">software case studies</span>
          </motion.h1>
          <motion.p
            {...fade(0.08)}
            className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:mt-5 sm:text-lg"
          >
            Verified engineering across voice AI, agents, automation, CRM, full-stack platforms, and data systems.
            Case studies publish only after explicit approval.
          </motion.p>
          <motion.div {...fade(0.12)} className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8">
            <Link to="/contact" className="btn-primary">
              Request Consultation <FiArrowRight />
            </Link>
            <Link to="/work-history" className="btn-outline">
              Browse Work History
            </Link>
          </motion.div>

          <motion.div
            {...fade(0.16)}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-200/80 pt-5 text-sm text-slate-600 dark:border-white/10 dark:text-slate-400"
          >
            <p>
              <span className="font-semibold text-slate-900 dark:text-white">Founder credentials</span>
              {' '}({SITE.founder}) — Top Rated on Upwork · {STATS.jss} Job Success · {SITE.founderExperienceYears}+ years engineering experience
            </p>
            <a
              href={SOCIAL.upwork}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-cyan-700 underline-offset-2 hover:underline dark:text-cyan-300"
            >
              Upwork profile
            </a>
          </motion.div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="border-b border-slate-200/80 py-10 dark:border-white/[0.06] sm:py-14">
          <div className="container">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300/80">
                  Featured case studies
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                  Flagship work international teams can inspect
                </h2>
              </div>
              <Link to="/contact" className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                Request Consultation
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {featured.map((project, i) => (
                <motion.div
                  key={project.id}
                  {...(reduceMotion
                    ? { initial: false }
                    : {
                        initial: { opacity: 0, y: 14 },
                        animate: { opacity: 1, y: 0 },
                        transition: { delay: Math.min(i * 0.04, 0.24), duration: 0.3 },
                      })}
                >
                  <ProjectCard project={{ ...project, hasCaseStudy: true }} variant={i === 0 ? 'featured' : 'grid'} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="sticky top-[4.25rem] z-30 border-y border-slate-200/80 bg-white/95 py-4 backdrop-blur-xl dark:border-white/[0.06] dark:bg-dark-950/95">
        <div className="container space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                All projects
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {allCards.length} verified distinct families — not every Upwork job is a separate product.
              </p>
            </div>
          </div>
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
              placeholder="Search by title, category, or technology"
              className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:placeholder:text-slate-600"
            />
          </label>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="container">
          <p className="mb-6 text-sm text-slate-500">
            Showing <span className="font-medium text-slate-800 dark:text-slate-300">{filtered.length}</span> of {allCards.length} projects
            {activeCategory !== 'All Projects' ? ` in ${activeCategory}` : ''}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center dark:border-white/10 dark:bg-dark-900/40">
              <p className="font-display text-xl text-slate-900 dark:text-white">No projects in this view</p>
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
            <>
              <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                {paged.map((project, i) => (
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

              {pageCount > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    className="btn-outline"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Page {safePage} of {pageCount}
                  </span>
                  <button
                    type="button"
                    className="btn-outline"
                    disabled={safePage >= pageCount}
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          <div className="mt-14 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-dark-900 to-dark-950 p-7 text-center sm:mt-16 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              Need a production AI system, not a demo?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              Tell us about the workflow you want automated. We respond within {SITE.responseTime} with a practical scope.
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
