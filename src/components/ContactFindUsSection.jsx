import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiExternalLink, FiMapPin } from 'react-icons/fi'
import { SITE, mapsEmbedUrl, mapsOpenUrl } from '../lib/site'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function ContactFindUsSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.12 })
  const mapsUrl = mapsOpenUrl()
  const embedUrl = mapsEmbedUrl()

  return (
    <motion.section
      id="find-us"
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      className="pb-4 pt-2 scroll-mt-28"
      aria-labelledby="find-us-heading"
    >
      <div className="container">
        <span className="section-tag mb-4 inline-flex">Office</span>
        <h2 id="find-us-heading" className="section-heading text-2xl md:text-3xl mb-3">
          Find us
        </h2>
        <p className="section-sub max-w-2xl mb-5">
          Remote-first for clients worldwide. Our Mohali office is available for scheduled in-person meetings.
        </p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-start gap-2 text-sm text-navy-secondary hover:text-cyan-accent transition-colors mb-6 max-w-xl"
        >
          <FiMapPin className="flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
          <span>{SITE.address.formatted}</span>
        </a>
        <div className="bg-paper-subtle border border-border rounded-md overflow-hidden">
          <div className="relative w-full aspect-video min-h-[280px] md:min-h-[360px]">
            <iframe
              title={`Google Maps — ${SITE.address.formatted}`}
              src={embedUrl}
              className="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
        <p className="mt-4 text-sm">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-navy-secondary hover:text-cyan-accent underline-offset-2 hover:underline transition-colors"
          >
            Open in Google Maps
            <FiExternalLink size={14} aria-hidden="true" />
          </a>
        </p>
      </div>
    </motion.section>
  )
}