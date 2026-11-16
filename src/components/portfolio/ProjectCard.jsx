import { Link } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'
import AbstractCover from './AbstractCover'

export default function ProjectCard({ project, variant = 'grid' }) {
  const techPreview = (project.techCandidates || project.tech || []).slice(0, 5)
  const hasCaseStudy = project.hasCaseStudy !== false && Boolean(project.slug)
  const detailTo = hasCaseStudy ? `/portfolio/${project.slug}` : '/contact'
  const detailLabel = hasCaseStudy ? 'View case study' : 'Request Consultation'
  const isDemo = project.demoOnly || /interactive sales demo/i.test(project.title || '')

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-600/30 hover:shadow-lg dark:border-white/[0.08] dark:bg-dark-900/70 dark:shadow-none dark:hover:border-cyan-400/25 dark:hover:shadow-[0_20px_50px_-30px_rgba(34,211,238,0.45)] ${
        variant === 'featured' ? 'md:flex-row md:items-stretch' : ''
      }`}
    >
      <Link
        to={detailTo}
        className={`block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500 ${
          variant === 'featured' ? 'md:w-[42%] md:shrink-0' : ''
        }`}
        aria-label={`${detailLabel}: ${project.title}`}
      >
        {project.images?.[0] ? (
          <img
            src={project.images[0]}
            alt=""
            className={`w-full object-cover ${variant === 'featured' ? 'h-52 md:h-full' : 'h-44 sm:h-48'}`}
            loading="lazy"
          />
        ) : (
          <AbstractCover
            tone={project.coverTone}
            title={project.title}
            className={variant === 'featured' ? 'h-52 md:h-full min-h-[12rem]' : 'h-44 sm:h-48'}
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
            {project.primaryCategory}
          </span>
          {isDemo && (
            <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-sky-800 dark:text-sky-200">
              Interactive demo
            </span>
          )}
          {project.flagshipRank === 1 && (
            <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-800 dark:text-cyan-200">
              Flagship
            </span>
          )}
        </div>

        <h3 className="font-display text-xl font-semibold leading-snug text-slate-900 dark:text-white">
          <Link
            to={detailTo}
            className="transition-colors hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:text-cyan-200"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400">
          {project.summary}
        </p>

        {project.deliveryStatus && (
          <p className="mt-3 text-xs text-slate-500 line-clamp-2">{project.deliveryStatus}</p>
        )}

        {techPreview.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {techPreview.map((t) => (
              <span
                key={t}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-slate-400"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 border-t border-slate-200 pt-4 dark:border-white/[0.06]">
          <Link
            to={detailTo}
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-cyan-300 dark:hover:text-cyan-200"
          >
            {detailLabel} <FiArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
