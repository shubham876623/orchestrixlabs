import { Link } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'
import AbstractCover from './AbstractCover'

export default function ProjectCard({ project, variant = 'grid' }) {
  const techPreview = (project.techCandidates || project.tech || []).slice(0, 5)
  const hasCaseStudy = project.hasCaseStudy === true && Boolean(project.slug)
  const detailTo = hasCaseStudy ? `/portfolio/${project.slug}` : `/contact?ref=${project.slug || 'portfolio'}`
  const detailLabel = hasCaseStudy ? 'View case study' : 'Discuss a Similar Project'
  const consultTo = `/contact?ref=${project.slug || 'portfolio'}`
  const consultLabel = hasCaseStudy ? 'Discuss a Similar Project' : 'Request a Technical Consultation'
  const isDemo = project.demoOnly || /interactive sales demo/i.test(project.title || '')
  const featured = variant === 'featured'

  return (
    <article
      className={[
        'group flex h-full flex-col overflow-hidden border transition-all duration-300',
        'border-slate-200/90 bg-white dark:border-white/[0.08] dark:bg-dark-900/80',
        featured
          ? 'rounded-none sm:rounded-sm md:flex-row md:items-stretch md:border-l-2 md:border-l-cyan-600/50 dark:md:border-l-cyan-400/40'
          : 'rounded-sm hover:-translate-y-0.5 hover:border-cyan-700/25 dark:hover:border-cyan-400/20',
      ].join(' ')}
    >
      <Link
        to={detailTo}
        className={`relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500 ${
          featured ? 'md:w-[44%] md:shrink-0' : ''
        }`}
        aria-label={`${detailLabel}: ${project.title}`}
      >
        {project.images?.[0] ? (
          <img
            src={project.images[0]}
            alt=""
            className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] ${
              featured ? 'h-56 md:h-full' : 'h-44 sm:h-48'
            }`}
            loading="lazy"
          />
        ) : (
          <AbstractCover
            tone={project.coverTone}
            title={project.title}
            className={featured ? 'h-56 md:h-full min-h-[13rem]' : 'h-44 sm:h-48'}
          />
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent opacity-60 dark:opacity-80"
          aria-hidden="true"
        />
      </Link>

      <div className={`flex flex-1 flex-col ${featured ? 'p-6 sm:p-8' : 'p-5 sm:p-6'}`}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
            {project.primaryCategory}
          </span>
          {hasCaseStudy ? (
            <span className="border border-emerald-600/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-800 dark:border-emerald-400/25 dark:text-emerald-200">
              Case study
            </span>
          ) : (
            <span className="border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-400">
              Engagement summary
            </span>
          )}
          {isDemo && (
            <span className="border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-800 dark:text-sky-200">
              Interactive demo
            </span>
          )}
          {project.flagshipRank === 1 && (
            <span className="border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-800 dark:text-cyan-200">
              Flagship
            </span>
          )}
        </div>

        <h3
          className={`font-display font-semibold leading-snug text-slate-900 dark:text-white ${
            featured ? 'text-2xl sm:text-[1.65rem]' : 'text-xl'
          }`}
        >
          <Link
            to={detailTo}
            className="transition-colors hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:text-cyan-200"
          >
            {project.title}
          </Link>
        </h3>

        {project.subtitle && featured && (
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
            {project.subtitle}
          </p>
        )}

        <p
          className={`mt-3 flex-1 leading-relaxed text-slate-600 dark:text-slate-400 ${
            featured ? 'text-[0.95rem] line-clamp-4' : 'text-sm line-clamp-3'
          }`}
        >
          {project.summary}
        </p>

        {project.deliveryStatus && (
          <p className="mt-3 text-xs leading-relaxed text-slate-500 line-clamp-2">
            {project.deliveryStatus}
          </p>
        )}

        {techPreview.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
            {techPreview.map((t) => (
              <span
                key={t}
                className="border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-slate-400"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200 pt-4 dark:border-white/[0.06]">
          <Link
            to={detailTo}
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-cyan-800 transition-colors hover:text-cyan-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-cyan-300 dark:hover:text-cyan-200"
          >
            {detailLabel} <FiArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <Link
            to={consultTo}
            className="inline-flex min-h-[44px] items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {consultLabel}
          </Link>
        </div>
      </div>
    </article>
  )
}
