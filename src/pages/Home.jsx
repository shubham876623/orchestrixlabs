import { Link } from 'react-router-dom'
import { FiArrowRight, FiStar } from 'react-icons/fi'
import SEOHead from '../components/SEOHead'
import FAQSection from '../components/FAQSection'
import ConsultationCTA from '../components/ConsultationCTA'
import { services } from '../data/services'
import { FAQ, SITE, SOCIAL } from '../lib/site'
import { getSeoPage } from '../lib/seoPages'
import { getHomepageFeaturedProjects } from '../data/publishedProjects'

const fallbackTestimonials = [
  { client_name: 'Verified Upwork Client', client_role: 'AI Framework Development', rating: 5, quote: 'Love working with Shubham, he\'s the best at what he does and he always tries his best! Thanks Shubham!' },
  { client_name: 'Verified Upwork Client', client_role: 'Qualitative Data Analysis', rating: 5, quote: 'Shubham delivered high-quality work on the qualitative analysis project. He had a strong understanding of qualitative research methods, provided well-structured and insightful analysis and ensured that all deliverables were aligned with the project requirements.' },
  { client_name: 'Verified Upwork Client', client_role: 'Web Scraping & Data Collection', rating: 5, quote: 'He was excellent to work with and would highly recommend. Fast, reliable, and did great work.' },
  { client_name: 'Verified Upwork Client', client_role: 'AI & Full-Stack Development', rating: 5, quote: 'Experienced coder for AI related projects offering full stack development, great communicator and cooperator.' },
]

function Hero() {
  return (
    <section className="flex min-h-[88vh] flex-col justify-center border-b border-line pb-16 pt-28 sm:pt-32">
      <div className="container">
        <img
          src="/brand/logo-wordmark-dark.svg"
          alt="Orchestrix Labs"
          width={280}
          height={128}
          className="mb-8 h-14 w-[12.75rem] object-contain sm:h-16 sm:w-[14.5rem]"
          decoding="async"
          fetchPriority="high"
        />
        <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {SITE.slogan}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-copy sm:text-lg">
          Voice AI, CRM automation, and field-ops systems — production integrations, not demos.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link to="/contact" className="btn-primary">
            Start a project <FiArrowRight aria-hidden="true" />
          </Link>
          <Link to="/portfolio" className="btn-outline">
            View work
          </Link>
        </div>
      </div>
    </section>
  )
}

function SectionHead({ title, to, linkLabel }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
      {to && (
        <Link to={to} className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200">
          {linkLabel} <FiArrowRight aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

function ServicesPreview() {
  return (
    <section className="section-shell">
      <div className="container">
        <SectionHead title="What we build" to="/services" linkLabel="All services" />
        <ul className="border-b border-line">
          {services.map((svc) => (
            <li key={svc.id} className="border-t border-line">
              <Link
                to="/services"
                className="group grid gap-2 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:grid-cols-[18rem_1fr_auto] md:items-baseline md:gap-8"
              >
                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-200">{svc.title}</h3>
                <p className="text-sm leading-relaxed text-copy">{svc.tagline}</p>
                <FiArrowRight className="hidden text-mute group-hover:text-cyan-300 md:block" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function FeaturedWork() {
  const featuredProjects = getHomepageFeaturedProjects()

  return (
    <section className="section-shell border-t border-line">
      <div className="container">
        <SectionHead title="Work log" to="/portfolio" linkLabel="All work" />
        {featuredProjects.length === 0 ? (
          <div className="border border-line bg-panel px-6 py-10">
            <p className="font-display text-xl text-white">Featured case studies coming soon</p>
            <Link to="/contact" className="btn-primary mt-6">
              Request Consultation <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <ul className="border-b border-line">
            {featuredProjects.map((project) => (
              <li key={project.id} className="border-t border-line">
                <Link
                  to={`/portfolio/${project.slug}`}
                  className="group grid gap-2 py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 md:grid-cols-[16rem_12rem_1fr_auto] md:items-baseline md:gap-8"
                >
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-200">{project.title}</h3>
                  <p className="text-sm text-mute">{(project.categories || [project.primaryCategory]).slice(0, 2).join(' · ')}</p>
                  <p className="line-clamp-2 text-sm leading-relaxed text-copy">{project.summary}</p>
                  <FiArrowRight className="hidden text-mute group-hover:text-cyan-300 md:block" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="section-shell">
      <div className="container">
        <SectionHead title="Client feedback" />
        <p className="-mt-4 mb-8 max-w-2xl text-sm text-mute">
          Founder Upwork profile: 100% Job Success · Top Rated · {SITE.founderExperienceYears}+ years engineering experience.
        </p>
        <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2">
          {fallbackTestimonials.map((t) => (
            <figure key={t.client_role} className="flex flex-col bg-ink p-6">
              <div className="mb-3 flex gap-0.5" role="img" aria-label={`${t.rating} star rating`}>
                {[...Array(t.rating)].map((_, j) => (
                  <FiStar key={j} className="text-amber-400" style={{ fill: '#FBBF24' }} size={13} aria-hidden="true" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-copy">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-xs text-mute">
                <span className="font-semibold text-white">{t.client_name}</span> · {t.client_role} · Upwork
              </figcaption>
            </figure>
          ))}
        </div>
        <a
          href={SOCIAL.upwork}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
        >
          View client reviews on Upwork <FiArrowRight aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}

function CTABanner() {
  return (
    <section className="section-shell pt-8">
      <div className="container">
        <ConsultationCTA variant="consultation" />
      </div>
    </section>
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
      <ServicesPreview />
      <FeaturedWork />
      <Testimonials />
      <FAQSection />
      <CTABanner />
    </>
  )
}
