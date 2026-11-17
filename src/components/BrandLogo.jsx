import { Link } from 'react-router-dom'

const ASSETS = {
  wordmark: '/brand/logo-wordmark-dark.svg',
  mark: '/brand/logo-mark-dark.svg',
}

/**
 * Official Orchestrix Labs brand mark — dark-theme primary.
 * - nav/footer: full wordmark (icon + Orchestrix LABS)
 * - mark: icon only (compact / admin)
 */
export default function BrandLogo({
  variant = 'nav',
  to = '/',
  className = '',
  imgClassName = '',
  link = true,
}) {
  const isMark = variant === 'mark'
  const src = isMark ? ASSETS.mark : ASSETS.wordmark
  const img = (
    <img
      src={src}
      alt="Orchestrix Labs"
      width={isMark ? 36 : 168}
      height={isMark ? 36 : 77}
      className={
        isMark
          ? `h-9 w-9 shrink-0 object-contain ${imgClassName}`
          : `h-8 w-[7.25rem] sm:h-9 sm:w-[8.25rem] shrink-0 object-contain object-left ${imgClassName}`
      }
      decoding="async"
    />
  )

  if (!link) {
    return <span className={`inline-flex items-center ${className}`}>{img}</span>
  }

  return (
    <Link
      to={to}
      className={`inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg ${className}`}
      aria-label="Orchestrix Labs home"
    >
      {img}
    </Link>
  )
}

export { ASSETS as BRAND_LOGO_ASSETS }
