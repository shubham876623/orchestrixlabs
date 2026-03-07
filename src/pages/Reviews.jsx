import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiCheckCircle, FiStar } from 'react-icons/fi'
import { SiUpwork } from 'react-icons/si'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import SEOHead from '../components/SEOHead'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

function Section({ children, className = '' }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.section>
  )
}

function useSiteStats() {
  const defaults = { total_earnings: '$100K+', total_hours: 4828, total_jobs: 143, years_experience: 6, jss_score: 100 }
  const [s, setS] = useState(defaults)
  useEffect(() => {
    axios.get('/api/site-stats/').then(r => {
      if (r.data && typeof r.data === 'object' && !Array.isArray(r.data))
        setS(prev => ({ ...prev, ...r.data }))
    }).catch(() => {})
  }, [])
  return s
}

const testimonials = [
  {
    name: 'Verified Upwork Client',
    role: 'AI Framework Development',
    stars: 5,
    tags: ['Collaborative', 'Committed to Quality'],
    text: "Love working with Shubham, he's the best at what he does and he always tries his best! Thanks Shubham!",
  },
  {
    name: 'Verified Upwork Client',
    role: 'Qualitative Data Analysis',
    stars: 5,
    tags: ['Committed to Quality'],
    text: 'Shubham delivered high-quality work on the qualitative analysis project. He had a strong understanding of qualitative research methods, provided well-structured and insightful analysis and ensured that all deliverables were aligned with the project requirements.',
  },
  {
    name: 'Verified Upwork Client',
    role: 'Web Scraping & Data Collection',
    stars: 5,
    tags: ['Reliable', 'Committed to Quality', 'Solution Oriented'],
    text: 'He was excellent to work with and would highly recommend. Fast, reliable, and did great work.',
  },
  {
    name: 'Verified Upwork Client',
    role: 'AI & Full-Stack Development',
    stars: 5,
    tags: ['Clear Communicator', 'Collaborative'],
    text: 'Experienced coder for AI related projects offering full stack development, great communicator and cooperator.',
  },
  {
    name: 'Verified Upwork Client',
    role: 'Django Backend Development',
    stars: 5,
    tags: ['Reliable', 'Solution Oriented'],
    text: 'Shubham is a skilled developer who completed the project ahead of schedule. He understood the requirements immediately and delivered clean, well-documented code.',
  },
  {
    name: 'Verified Upwork Client',
    role: 'Python Automation',
    stars: 5,
    tags: ['Collaborative', 'Accountable for Outcomes'],
    text: 'Really great experience. Shubham was proactive in flagging potential issues early and always kept us in the loop. Will definitely hire again.',
  },
]

const insightBadges = [
  { label: 'Collaborative',            count: 28 },
  { label: 'Clear Communicator',       count: 24 },
  { label: 'Committed to Quality',     count: 23 },
  { label: 'Reliable',                 count: 18 },
  { label: 'Solution Oriented',        count: 15 },
  { label: 'Accountable for Outcomes', count: 8  },
]

export default function Reviews() {
  const siteStats = useSiteStats()

  return (
    <>
      <SEOHead
        title="Client Reviews — Orchestrix Labs"
        description="133+ verified Upwork reviews. 100% Job Success Score. Top Rated. See what clients say about working with Orchestrix Labs."
        path="/reviews"
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient grid-pattern" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-950" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-secondary-500/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="container relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="section-tag mb-5 inline-flex"
          >
            Client Reviews
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white mb-5"
          >
            Trusted by clients{' '}
            <span className="gradient-text">worldwide</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="section-sub mx-auto mb-10"
          >
            {siteStats.total_jobs}+ projects delivered. {siteStats.jss_score}% Job Success Score. Top Rated on Upwork.
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-10"
          >
            <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#14a800]/10 border border-[#14a800]/25">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#14a800">
                <path d="M11.5 2C6.26 2 2 6.26 2 11.5S6.26 21 11.5 21 21 16.74 21 11.5 16.74 2 11.5 2zm-2 15.5-4-4 1.41-1.41L9.5 14.67l7.59-7.59L18.5 8.5l-9 9z"/>
              </svg>
              <span className="text-[#14a800] font-bold text-sm">Top Rated</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-500/10 border border-primary-500/20">
              <FiCheckCircle className="text-primary-400" size={16} />
              <span className="text-white font-bold text-sm">100% Job Success</span>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <span className="text-slate-300 text-sm"><span className="font-bold text-white">{siteStats.total_jobs}</span> Projects Delivered</span>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <span className="text-slate-300 text-sm"><span className="font-bold text-white">{siteStats.total_hours.toLocaleString()}</span> Engineering Hours</span>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <span className="text-slate-300 text-sm"><span className="font-bold text-white">{siteStats.total_earnings}</span> Revenue Generated</span>
            </div>
          </motion.div>

          {/* Skill insight badges */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {insightBadges.map(({ label, count }) => (
              <span
                key={label}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-slate-400 text-xs font-medium"
              >
                <span className="w-5 h-5 rounded-full bg-primary-500/20 text-primary-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {count}
                </span>
                {label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Review cards */}
      <Section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {testimonials.map((t, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} className="card flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.stars)].map((_, j) => (
                    <FiStar key={j} className="text-amber-400" style={{ fill: '#FBBF24' }} size={13} />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-4 italic">
                  "{t.text}"
                </p>
                {/* Skill tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {t.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Author */}
                <div className="pt-3 border-t border-white/[0.05] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-400 text-xs font-bold">V</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-xs">{t.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{t.role} · Upwork</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Upwork CTA */}
          <Section className="text-center">
            <motion.div variants={fadeUp} custom={0} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://www.upwork.com/agencies/1464061503601672192/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#14a800]/10 border border-[#14a800]/30 text-[#14a800] font-semibold text-sm hover:bg-[#14a800]/20 transition-all duration-200"
              >
                <SiUpwork size={16} />
                View all 133 reviews on Upwork
              </a>
              <Link to="/contact" className="btn-primary text-sm px-6 py-3">
                Start a Project <FiArrowRight />
              </Link>
            </motion.div>
          </Section>
        </div>
      </Section>
    </>
  )
}
