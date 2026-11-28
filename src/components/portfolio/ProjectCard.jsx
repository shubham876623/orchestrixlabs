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

  if (variant === 'row') {
    return (
      <article className="group border-b border-border py-6 sm:py-7">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)_auto] md:items-start md:gap-8">
          <div>
            <p className="mb-2 text-xs text-navy-muted">
              {project.primaryCategory} · {hasCaseStudy ? 'Case study' : 'Engagement summary'}
              {isDemo ? ' · Interactive demo' : ''}
              {project.flagshipRank === 1 ? ' · Flagship' : ''}
            </p>
            <h3 className="font-display text-lg font-semibold leading-snug text-navy-primary">
              <Link
                to={detailTo}
                aria-label={`${detailLabel}: ${project.title}`}
                className="transition-colors hover:text-cyan-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                {project.title}
              </Link>
            </h3>
          </div>

          <div>
            <p className="line-clamp-3 text-sm leading-relaxed text-navy-body">{project.summary}</p>
            {techPreview.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-navy-muted" aria-label="Technologies">
                {techPreview.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 md:flex-col md:items-end md:gap-1">
            <Link
              to={detailTo}
              className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-cyan-hover transition-colors hover:text-cyan-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              {detailLabel} <FiArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to={consultTo}
              className="inline-flex min-h-[44px] items-center text-sm text-navy-muted transition-colors hover:text-navy-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              {consultLabel}
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className={[
        'group flex h-full flex-col overflow-hidden border transition-all duration-300',
        'border-slate-200/90 bg-white ',
        featured
          ? 'rounded-none sm:rounded-sm md:flex-row md:items-stretch md:border-l-2 md:border-l-cyan-600/50 '
          : 'rounded-sm hover:-translate-y-0.5 hover:border-cyan-700/25 ',
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
            stack={project.techPendingVerification ? [] : project.techCandidates || []}
            className={featured ? 'h-56 md:h-full min-h-[13rem]' : 'h-44 sm:h-48'}
          />
        )}
      </Link>

      <div className={`flex flex-1 flex-col ${featured ? 'p-6 sm:p-8' : 'p-5 sm:p-6'}`}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="border border-slate-200 bg-slate-50 rounded-full px-2.5 py-0.5 text-xs font-semibold text-slate-700 ">
            {project.primaryCategory}
          </span>
          {hasCaseStudy ? (
            <span className="border border-status-success/40 bg-status-success-bg rounded-full px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ">
              Case study
            </span>
          ) : (
            <span className="border border-slate-200 bg-slate-50 rounded-full px-2.5 py-0.5 text-xs font-semibold text-slate-600 ">
              Engagement summary
            </span>
          )}
          {isDemo && (
            <span className="border border-border bg-paper-subtle rounded-full px-2.5 py-0.5 text-xs font-semibold text-sky-800 ">
              Interactive demo
            </span>
          )}
          {project.flagshipRank === 1 && (
            <span className="border border-cyan-accent bg-cyan-subtle rounded-full px-2.5 py-0.5 text-xs font-semibold text-cyan-800 ">
              Flagship
            </span>
          )}
        </div>

        <h3
          className={`font-display font-semibold leading-snug text-slate-900 ${
            featured ? 'text-2xl sm:text-[1.65rem]' : 'text-xl'
          }`}
        >
          <Link
            to={detailTo}
            className="transition-colors hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 "
          >
            {project.title}
          </Link>
        </h3>

        {project.subtitle && featured && (
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 ">
            {project.subtitle}
          </p>
        )}

        <p
          className={`mt-3 flex-1 leading-relaxed text-slate-600 ${
            featured ? 'text-[0.95rem] line-clamp-4' : 'text-sm line-clamp-3'
          }`}
        >
          {project.summary}
        </p>

        {project.deliveryStatus && (
          <p className="mt-3 text-xs leading-relaxed text-navy-muted line-clamp-2">
            {project.deliveryStatus}
          </p>
        )}

        {techPreview.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
            {techPreview.map((t) => (
              <span
                key={t}
                className="border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 "
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200 pt-4 ">
          <Link
            to={detailTo}
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-cyan-800 transition-colors hover:text-cyan-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 "
          >
            {detailLabel} <FiArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <Link
            to={consultTo}
            className="inline-flex min-h-[44px] items-center text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 "
          >
            {consultLabel}
          </Link>
        </div>
      </div>
    </article>
  )
}
