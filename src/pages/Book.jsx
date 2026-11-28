import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEOHead from '../components/SEOHead'
import ContactBookingSection from '../components/ContactBookingSection'
import { BOOKING, hasCalComBooking, hasCalComSecureBooking, SITE } from '../lib/site'
import { getSeoPage } from '../lib/seoPages'

export default function Book() {
  if (!hasCalComBooking()) {
    return <Navigate to="/contact" replace />
  }

  const seo = getSeoPage('/book')

  return (
    <>
      <SEOHead
        title={seo?.title}
        description={seo?.description}
        path="/book"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Book a call', path: '/book' },
        ]}
      />

      <section className="pt-36 pb-6">
        <div className="container">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-tag mb-5 inline-flex"
          >
            Schedule
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="section-heading mb-4"
          >
            Book a {BOOKING.durationLabel}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="section-sub max-w-2xl"
          >
            Pick a time for a {BOOKING.eventLabel.toLowerCase()}. Prefer to send a written brief first?{' '}
            <Link to="/contact" className="text-cyan-accent hover:text-cyan-hover underline-offset-2 hover:underline">
              Request consultation
            </Link>{' '}
            and we will reply within {SITE.responseTime}.
          </motion.p>
        </div>
      </section>

      <ContactBookingSection standalone />
      {hasCalComSecureBooking() && <ContactBookingSection standalone secure />}
    </>
  )
}