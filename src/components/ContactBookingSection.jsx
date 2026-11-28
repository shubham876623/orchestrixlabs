import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiCalendar, FiExternalLink } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import {
  BOOKING,
  SECURE_BOOKING,
  calComEmbedUrl,
  getCalComBookingUrl,
  getCalComSecureBookingUrl,
} from '../lib/site'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function ContactBookingSection({ standalone = false, secure = false }) {
  const bookingUrl = secure ? getCalComSecureBookingUrl() : getCalComBookingUrl()
  if (!bookingUrl) return null

  const meta = secure ? SECURE_BOOKING : BOOKING
  const sectionId = secure ? 'book-secure' : 'book'
  const embedUrl = calComEmbedUrl(bookingUrl)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })
  const show = standalone || inView

  return (
    <motion.section
      id={sectionId}
      ref={ref}
      initial={standalone ? 'visible' : 'hidden'}
      animate={show ? 'visible' : 'hidden'}
      variants={fadeUp}
      className={`scroll-mt-28 ${standalone ? (secure ? 'py-10 border-t border-border' : 'pb-16') : 'py-10 border-b border-border'}`}
      aria-labelledby={`${sectionId}-heading`}
    >
      <div className="container">
        {standalone && secure && (
          <>
            <h2 id={`${sectionId}-heading`} className="text-navy-primary font-bold text-xl mb-2">
              {meta.eventLabel}
            </h2>
            <p className="text-sm text-navy-body mb-6 max-w-2xl">
              For sensitive topics (NDA, security review, or private architecture). This link is not listed in site
              navigation; share only when appropriate.
            </p>
          </>
        )}
        {!standalone && (
          <>
            <span className="section-tag mb-4 inline-flex">Schedule</span>
            <h2 id={`${sectionId}-heading`} className="section-heading text-2xl md:text-3xl mb-3">
              Book a time
            </h2>
            <p className="section-sub max-w-2xl mb-6">
              Pick a {meta.durationLabel} for a {meta.eventLabel.toLowerCase()}. Prefer a written brief first?{' '}
              <Link to="/contact" className="text-cyan-accent hover:text-cyan-hover underline-offset-2 hover:underline">
                Use the consultation form
              </Link>
              .
            </p>
          </>
        )}
        {standalone && !secure && (
          <h2 id={`${sectionId}-heading`} className="sr-only">
            Cal.com scheduler
          </h2>
        )}
        <div className="bg-paper-subtle border border-border rounded-md overflow-hidden max-sm:-mx-1 max-sm:rounded-lg sm:mx-0">
          <div className="relative w-full min-h-[min(72vh,640px)] sm:min-h-[520px] md:min-h-[600px]">
            <iframe
              title={`Cal.com — ${meta.eventLabel}`}
              src={embedUrl}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              allow="camera; microphone; clipboard-write"
            />
          </div>
        </div>
        <p className="mt-4 text-sm">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-navy-secondary hover:text-cyan-accent underline-offset-2 hover:underline transition-colors"
          >
            <FiCalendar size={14} aria-hidden="true" />
            Open scheduler in a new tab
            <FiExternalLink size={14} aria-hidden="true" />
          </a>
        </p>
      </div>
    </motion.section>
  )
}