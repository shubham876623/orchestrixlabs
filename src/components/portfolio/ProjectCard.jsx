import { Link } from 'react-router-dom'
import { FiArrowUpRight } from 'react-icons/fi'
import AbstractCover from './AbstractCover'

export default function ProjectCard({ project }) {
  const techPreview = (project.techCandidates || []).slice(0, 4)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-600/30 hover:shadow-lg dark:border-white/[0.08] dark:bg-dark-900/70 dark:shadow-none dark:hover:border-cyan-400/25 dark:hover:shadow-[0_20px_50px_-30px_rgba(34,211,238,0.45)]">
      <Link
        to={`/portfolio/${project.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500"
        aria-label={`View case study: ${project.title}`}
      >
        {project.images?.[0] ? (
          <img
            src={project.images[0]}
            alt=""
            className="h-44 w-full object-cover sm:h-48"
            loading="lazy"
          />
        ) : (
          <AbstractCover
            tone={project.coverTone}
            title={project.title}
            className="h-44 sm:h-48"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
            {project.primaryCategory}
          </span>
          {project.conditional && (
            <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-200">
              Conditional
            </span>
          )}
          <span className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] text-slate-500 dark:border-white/10">
            Draft preview
          </span>
        </div>

        <h3 className="font-display text-xl font-semibold leading-snug text-slate-900 dark:text-white">
          <Link
            to={`/portfolio/${project.slug}`}
            className="transition-colors hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:hover:text-cyan-200"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-400">
          {project.summary}
        </p>

        <p className="mt-3 text-xs text-slate-500">{project.engagementLabel}</p>

        {techPreview.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {techPreview.map((t) => (
              <span
                key={t}
                className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-slate-400"
                title={project.techPendingVerification ? 'Pending verification' : undefined}
              >
                {t}
              </span>
            ))}
            {project.techPendingVerification && (
              <span className="px-1 text-[11px] text-slate-500">pending verify</span>
            )}
          </div>
        )}

        {project.techConflictNote && (
          <p className="mt-3 text-xs leading-relaxed text-amber-800 dark:text-amber-200/80">{project.techConflictNote}</p>
        )}

        <div className="mt-5 border-t border-slate-200 pt-4 dark:border-white/[0.06]">
          <Link
            to={`/portfolio/${project.slug}`}
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-cyan-700 transition-colors hover:text-cyan-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:text-cyan-300 dark:hover:text-cyan-200"
          >
            View case study <FiArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
