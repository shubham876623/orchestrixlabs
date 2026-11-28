import { useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import AbstractCover from './AbstractCover'

/** Normalizes `images` entries ('path' or { src, alt }) to approved, same-site image objects. */
export function projectImages(project) {
  return (project.images || [])
    .map((img) => (typeof img === 'string' ? { src: img, alt: '' } : img))
    .filter((img) => img && typeof img.src === 'string' && img.src.startsWith('/'))
}

/**
 * Project imagery: a swipeable carousel when the project has approved screenshots
 * (native scroll-snap, arrow buttons, dots), one image when it has one, otherwise the
 * stack-pipeline cover.
 */
export default function ProjectMedia({ project, className = 'aspect-[16/10]' }) {
  const images = projectImages(project)
  const track = useRef(null)
  const [index, setIndex] = useState(0)

  if (images.length === 0) {
    return (
      <AbstractCover
        tone={project.coverTone}
        title={project.title}
        stack={project.techPendingVerification ? [] : project.techCandidates || []}
        className={className}
      />
    )
  }

  const go = (next) => {
    const el = track.current
    if (!el) return
    const clamped = Math.max(0, Math.min(images.length - 1, next))
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className={`group/media relative overflow-hidden rounded-xl border border-border bg-paper-subtle ${className}`}>
      <div
        ref={track}
        className="flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-hide"
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        aria-roledescription="carousel"
        aria-label={`${project.title} screenshots`}
      >
        {images.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt || `${project.title}, screenshot ${i + 1} of ${images.length}`}
            loading={i === 0 ? 'eager' : 'lazy'}
            className="h-full w-full shrink-0 snap-center object-cover"
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          {[['Previous screenshot', -1, FiChevronLeft, 'left-2'], ['Next screenshot', 1, FiChevronRight, 'right-2']].map(
            ([label, step, Icon, side]) => (
              <button
                key={label}
                type="button"
                onClick={() => go(index + step)}
                disabled={step < 0 ? index === 0 : index === images.length - 1}
                aria-label={label}
                className={`absolute ${side} top-1/2 -translate-y-1/2 rounded-full border border-border bg-white/95 p-2 text-navy-primary shadow-sm transition-opacity disabled:opacity-0 sm:opacity-0 sm:group-hover/media:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent`}
              >
                <Icon size={18} aria-hidden="true" />
              </button>
            ),
          )}
          <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show screenshot ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/60'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
