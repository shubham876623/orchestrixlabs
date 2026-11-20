import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const VARIANTS = {
  similar: {
    title: 'Discuss a Similar Project',
    body: 'Share the workflow you want automated. We respond with a practical scope — no inflated promises.',
    cta: 'Discuss a Similar Project',
  },
  consultation: {
    title: 'Request a Technical Consultation',
    body: 'Tell us your stack, constraints, and timeline. We reply within one business day with clear next steps.',
    cta: 'Request a Technical Consultation',
  },
  automation: {
    title: 'Explore Our AI Automation Work',
    body: 'See how we connect CRM, voice, field ops, and retrieval systems for operators who need production delivery.',
    cta: 'Explore AI Automation Work',
    to: '/portfolio?category=Automation',
  },
  voice: {
    title: 'Talk About Your Voice AI Requirements',
    body: 'From inbound qualification to multi-tenant ordering — we build telephony systems with human-reviewed controls.',
    cta: 'Discuss Voice AI',
  },
}

/**
 * Non-intrusive consultation CTA. Never pulls private contracts or GPT profiles.
 */
export default function ConsultationCTA({
  variant = 'consultation',
  href,
  className = '',
  compact = false,
}) {
  const config = VARIANTS[variant] || VARIANTS.consultation
  const to = href || config.to || '/contact'

  return (
    <aside
      className={[
        'cta-panel',
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8',
        className,
      ].join(' ')}
    >
      <h2 className="font-display text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
        {config.title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
        {config.body}
      </p>
      <Link to={to} className="btn-primary mt-5">
        {config.cta} <FiArrowRight aria-hidden="true" />
      </Link>
    </aside>
  )
}
