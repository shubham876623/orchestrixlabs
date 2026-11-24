import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  FiArrowRight, FiCode, FiCpu, FiGlobe, FiZap, FiMic,
  FiCheckCircle, FiStar, FiCloud,
} from 'react-icons/fi'
import { SiPython, SiDjango, SiFastapi, SiReact, SiOpenai,
         SiDocker, SiPostgresql, SiTailwindcss } from 'react-icons/si'
import SEOHead from '../components/SEOHead'
import TrustBar from '../components/TrustBar'
import FAQSection from '../components/FAQSection'
import ConsultationCTA from '../components/ConsultationCTA'
import ProjectCard from '../components/portfolio/ProjectCard'
import { services } from '../data/services'
import { FAQ, SITE, SOCIAL } from '../lib/site'
import { getSeoPage } from '../lib/seoPages'
import { getHomepageFeaturedProjects } from '../data/publishedProjects'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
}

function Section({ children, className = '' }) {
  const reduceMotion = useReducedMotion()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })
  if (reduceMotion) {
    return <section className={className}>{children}</section>
  }
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

const serviceIcons = {
  voice: FiMic, brain: FiCpu, code: FiCode, globe: FiGlobe, workflow: FiZap,
}

const SERVICE_PORTFOLIO_LINKS = {
  voice: '/portfolio?category=Voice%20AI',
  brain: '/portfolio?category=AI%20Agents',
  code: '/portfolio?category=Full-Stack%20Development',
  globe: '/portfolio?category=Data%20%26%20Analytics',
  workflow: '/portfolio?category=Automation',
}

const techStack = [
  { icon: SiPython, label: 'Python' },
  { icon: SiDjango, label: 'Django' },
  { icon: SiFastapi, label: 'FastAPI' },
  { icon: SiReact, label: 'React' },
  { icon: SiOpenai, label: 'OpenAI' },
  { icon: FiCloud, label: 'AWS' },
  { icon: SiDocker, label: 'Docker' },
  { icon: SiPostgresql, label: 'PostgreSQL' },
  { icon: SiTailwindcss, label: 'Tailwind' },
]

const fallbackTestimonials = [
  { client_name: 'Verified Upwork Client', client_role: 'AI Framework Development', rating: 5, tags: ['Collaborative', 'Committed to Quality'], quote: 'Love working with Shubham, he\'s the best at what he does and he always tries his best! Thanks Shubham!' },
  { client_name: 'Verified Upwork Client', client_role: 'Qualitative Data Analysis', rating: 5, tags: ['Committed to Quality'], quote: 'Shubham delivered high-quality work on the qualitative analysis project. He had a strong understanding of qualitative research methods, provided well-structured and insightful analysis and ensured that all deliverables were aligned with the project requirements.' },
  { client_name: 'Verified Upwork Client', client_role: 'Web Scraping & Data Collection', rating: 5, tags: ['Reliable', 'Committed to Quality', 'Solution Oriented'], quote: 'He was excellent to work with and would highly recommend. Fast, reliable, and did great work.' },
  { client_name: 'Verified Upwork Client', client_role: 'AI & Full-Stack Development', rating: 5, tags: ['Clear Communicator', 'Collaborative'], quote: 'Experienced coder for AI related projects offering full stack development, great communicator and cooperator.' },
]

function Hero() {
  const reduceMotion = useReducedMotion()
  // Keep hero content visible on first paint (opacity never 0) so LCP is not delayed by enter animation.
  const motionProps = (delay) =>
    reduceMotion
      ? { initial: false, animate: { opacity: 1 } }
      : {
          initial: { opacity: 1, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay },
        }

  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden pb-16 pt-28 text-center sm:pt-32">
      <div className="absolute inset-0 hero-gradient grid-pattern" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-950" aria-hidden="true" />

      <div className="container relative z-10">
        <p className="mb-6 font-display text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/90">
          {SITE.positioning}
        </p>

        <div className="mb-7 flex justify-center">
          <img
            src="/brand/logo-wordmark-dark.svg"
            alt="Orchestrix Labs"
            width={280}
            height={128}
            className="h-14 w-[12.75rem] object-contain sm:h-16 sm:w-[14.5rem]"
            decoding="async"
            fetchPriority="high"
          />
        </div>

        {/* Static hero copy (no enter animation) so LCP is not gated on Framer Motion hydration. */}
        <h1 className="mx-auto mb-5 max-w-4xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
          <span className="gradient-text block">{SITE.slogan}</span>
          <span className="mt-4 block text-lg font-medium leading-snug text-slate-200 sm:text-xl lg:text-2xl">
            AI systems engineering for operators who need production integrations — not demos alone.
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
          Voice AI, CRM automation, field operations, and retrieval systems — delivered with human-reviewed
          controls. Led by {SITE.founder} with {SITE.founderExperienceYears}+ years of professional engineering
          experience.
        </p>

        <motion.div
          {...motionProps(0.12)}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <Link to="/contact" className="btn-primary px-8 py-3.5 text-base">
            Request a Technical Consultation <FiArrowRight aria-hidden="true" />
          </Link>
          <Link to="/portfolio" className="btn-outline px-8 py-3.5 text-base">
            View Selected Work
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function WhoWeHelp() {
  const audiences = [
    {
      title: 'Operators & field-service teams',
      body: 'Connect CRM, estimating, and accounts without unsupervised financial posting.',
    },
    {
      title: 'Sales & support organizations',
      body: 'Qualify leads and handle high-volume conversations with voice and CRM write-back.',
    },
    {
      title: 'Product and ops leaders',
      body: 'Ship full-stack platforms, data pipelines, and RAG assistants with production discipline.',
    },
  ]
  return (
    <Section className="section-shell border-y border-white/[0.06] bg-dark-900/25">
      <div className="container">
        <motion.p variants={fadeUp} custom={0} className="section-tag mb-4 inline-flex">
          Who we help
        </motion.p>
        <motion.h2 variants={fadeUp} custom={1} className="section-heading mb-4 max-w-3xl">
          Built for teams that need systems that ship
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} className="section-sub mb-12">
          International clients come to Orchestrix Labs for integration-heavy AI engineering — clear ownership,
          verified stacks, and honest delivery boundaries.
        </motion.p>
        <div className="grid gap-5 md:grid-cols-3">
          {audiences.map((item, i) => (
            <motion.div key={item.title} variants={fadeUp} custom={i + 3} className="card">
              <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function ServicesPreview() {
  return (
    <Section className="section-shell">
      <div className="container">
        <div className="mb-14 text-center">
          <motion.span variants={fadeUp} custom={0} className="section-tag mb-4 inline-flex">
            Capabilities
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="section-heading mb-4">
            Engineering across the <span className="gradient-text">AI delivery stack</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="section-sub mx-auto">
            Voice agents, ML pipelines, full-stack platforms, data automation, and workflow systems —
            scoped for reliability and commercial use.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((svc, i) => {
            const Icon = serviceIcons[svc.icon]
            const to = SERVICE_PORTFOLIO_LINKS[svc.icon] || '/portfolio'
            return (
              <motion.div key={svc.id} custom={i} variants={fadeUp}>
                <Link
                  to={to}
                  className="card group block h-full hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.04] text-cyan-300">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-cyan-200">{svc.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-slate-400">{svc.tagline}</p>
                  <ul className="space-y-1.5">
                    {svc.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-slate-500">
                        <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-500" size={12} aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
                    See related projects <FiArrowRight aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <motion.div variants={fadeUp} custom={6} className="mt-10 text-center">
          <Link to="/services" className="btn-outline">
            View All Services <FiArrowRight aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </Section>
  )
}

function FeaturedWork() {
  const featuredProjects = getHomepageFeaturedProjects()

  return (
    <Section className="section-shell bg-dark-900/30">
      <div className="container">
        <div className="mb-12 text-center">
          <motion.span variants={fadeUp} custom={0} className="section-tag mb-4 inline-flex">
            Selected work
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="section-heading mb-4">
            Verified project experience international buyers can inspect
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="section-sub mx-auto">
            Five publication-approved case studies — not private archives, not pending GPT profiles.
          </motion.p>
        </div>

        {featuredProjects.length === 0 ? (
          <div className="mx-auto max-w-xl border border-white/[0.08] bg-dark-900/50 px-6 py-12 text-center">
            <p className="font-display text-xl text-white">Featured case studies coming soon</p>
            <Link to="/contact" className="btn-primary mt-8 inline-flex">
              Request Consultation <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {featuredProjects.map((project, i) => (
              <motion.div key={project.id} custom={i} variants={fadeUp}>
                <ProjectCard
                  project={{ ...project, hasCaseStudy: true }}
                  variant={i === 0 ? 'featured' : 'grid'}
                />
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          variants={fadeUp}
          custom={8}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link to="/portfolio" className="btn-primary">
            Explore Our Work <FiArrowRight aria-hidden="true" />
          </Link>
          <Link to="/portfolio?category=Automation" className="btn-outline">
            Explore Our AI Automation Work
          </Link>
        </motion.div>
      </div>
    </Section>
  )
}

function TechStackSection() {
  return (
    <Section className="section-shell">
      <div className="container">
        <motion.div variants={fadeUp} custom={0} className="mb-12 text-center">
          <span className="section-tag mb-4 inline-flex">Tech stack</span>
          <h2 className="section-heading mb-3">
            Tools chosen for <span className="gradient-text">reliability</span>
          </h2>
          <p className="text-base text-slate-500">
            Core technologies we use across production engagements.
          </p>
        </motion.div>
        <motion.div variants={fadeUp} custom={1} className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {techStack.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-cyan-500/25"
            >
              <Icon className="text-slate-400" size={26} aria-hidden="true" />
              <span className="text-center text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  )
}

function ProcessSection() {
  const steps = [
    { step: '01', title: 'Discovery', desc: 'Goals, stack, and constraints — then a clear plan and timeline.' },
    { step: '02', title: 'Architecture', desc: 'Technical design with milestones and explicit delivery boundaries.' },
    { step: '03', title: 'Build & iterate', desc: 'Working demos at milestones with feedback loops built in.' },
    { step: '04', title: 'Deploy & support', desc: 'Production deployment with documentation and ongoing support options.' },
  ]
  return (
    <Section className="section-shell bg-dark-900/30">
      <div className="container">
        <div className="mb-14 text-center">
          <motion.span variants={fadeUp} custom={0} className="section-tag mb-4 inline-flex">How it works</motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="section-heading">
            From idea to <span className="gradient-text">production</span>
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div key={s.step} custom={i} variants={fadeUp} className="card h-full">
              <span className="mb-3 block font-display text-3xl font-semibold gradient-text">{s.step}</span>
              <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Testimonials() {
  // Static verified quotes on the homepage avoid post-paint CLS from CMS card swaps.
  // Live CMS testimonials continue to hydrate on /reviews.
  const testimonials = fallbackTestimonials

  return (
    <Section className="section-shell">
      <div className="container">
        <div className="mb-12 text-center">
          <motion.span variants={fadeUp} custom={0} className="section-tag mb-4 inline-flex">
            Client feedback
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="section-heading mb-4">
            Verified founder credentials clients can check
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="section-sub mx-auto">
            Founder Upwork profile: 100% Job Success · Top Rated — separate from company age.
          </motion.p>
        </div>

        <motion.div variants={fadeUp} custom={3} className="mb-10 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 border border-[#14a800]/25 bg-[#14a800]/10 px-4 py-2.5">
            <span className="text-sm font-semibold text-[#14a800]">Top Rated</span>
          </div>
          <div className="flex items-center gap-2 border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5">
            <FiCheckCircle className="text-cyan-300" size={14} aria-hidden="true" />
            <span className="text-sm font-semibold text-white">100% Job Success</span>
          </div>
          <div className="border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-slate-300">
            <span className="font-semibold text-white">{SITE.founderExperienceYears}+</span> years founder experience
          </div>
        </motion.div>

        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div key={i} custom={i + 4} variants={fadeUp} className="card flex flex-col">
              <div
                className="mb-3 flex gap-0.5"
                role="img"
                aria-label={`${t.rating || 5} star rating`}
              >
                {[...Array(Math.round(Number(t.rating || t.stars || 5)))].map((_, j) => (
                  <FiStar key={j} className="text-amber-400" style={{ fill: '#FBBF24' }} size={13} aria-hidden="true" />
                ))}
              </div>
              <p className="mb-4 flex-1 text-sm italic leading-relaxed text-slate-300">
                “{t.quote || t.text}”
              </p>
              <div className="border-t border-white/[0.06] pt-3">
                <p className="text-xs font-semibold text-white">{t.client_name || t.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {t.client_role || t.role} · {t.source || 'Upwork'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} custom={9} className="text-center">
          <a
            href={SOCIAL.upwork}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-[#14a800]/30 bg-[#14a800]/10 px-5 py-3 text-sm font-semibold text-[#14a800] transition-colors hover:bg-[#14a800]/20"
          >
            View client reviews on Upwork
          </a>
        </motion.div>
      </div>
    </Section>
  )
}

function CTABanner() {
  return (
    <Section className="section-shell pt-8">
      <div className="container">
        <ConsultationCTA variant="consultation" />
      </div>
    </Section>
  )
}

export default function Home() {
  return (
    <>
      <SEOHead
        description={getSeoPage('/')?.description}
        path="/"
        faq={FAQ}
      />
      <Hero />
      <TrustBar />
      <WhoWeHelp />
      <ServicesPreview />
      <FeaturedWork />
      <TechStackSection />
      <ProcessSection />
      <Testimonials />
      <FAQSection />
      <CTABanner />
    </>
  )
}
