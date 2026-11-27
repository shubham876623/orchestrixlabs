import { Link } from 'react-router-dom'
import { FiArrowRight, FiStar } from 'react-icons/fi'
import SEOHead from '../components/SEOHead'
import FAQSection from '../components/FAQSection'
import ConsultationCTA from '../components/ConsultationCTA'
import CaseStudyCard from '../components/home/CaseStudyCard'
import HowWeWork from '../components/home/HowWeWork'
import WhoItsFor from '../components/home/WhoItsFor'
import FounderSection from '../components/home/FounderSection'
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
    <section className="relative min-h-[85vh] flex flex-col justify-center border-b border-border pt-24 pb-16 sm:pt-28 sm:pb-20">
      <div className="container">
        {/* Logo - shown once on first screen */}
        <div className="mb-10">
          <img
            src="/brand/logo-wordmark-dark.svg"
            alt="Orchestrix Labs"
            width={280}
            height={64}
            className="h-12 w-auto sm:h-14"
            decoding="async"
            fetchPriority="high"
          />
        </div>

        {/* Clear statement - no buzzwords */}
        <h1 className="max-w-3xl font-sans text-4xl sm:text-5xl lg:text-6xl font-semibold text-navy-primary tracking-tight leading-tight text-balance">
          We build AI integrations that actually ship to production
        </h1>
        
        <p className="mt-6 max-w-xl text-lg text-navy-body leading-relaxed">
          Voice AI systems, CRM automation, and field-ops tools for companies with real users and real deadlines.
        </p>

        {/* Single CTA */}
        <div className="mt-10">
          <Link to="/contact" className="btn-primary">
            Book a 30-min call
          </Link>
        </div>

        {/* Workflow diagram placeholder - will be real diagram later */}
        <div className="mt-16 p-8 bg-paper-elevated border border-border rounded-lg">
          <div className="flex items-center justify-between gap-4 overflow-x-auto">
            <div className="flex flex-col items-center min-w-[140px]">
              <div className="w-12 h-12 rounded-full bg-cyan-subtle flex items-center justify-center mb-3">
                <span className="text-2xl font-semibold text-cyan-accent">1</span>
              </div>
              <span className="text-sm font-medium text-navy-primary text-center">Discovery</span>
              <span className="text-xs text-navy-secondary text-center mt-1">Requirements & Planning</span>
            </div>
            
            <div className="text-cyan-accent flex-shrink-0" aria-hidden="true">→</div>
            
            <div className="flex flex-col items-center min-w-[140px]">
              <div className="w-12 h-12 rounded-full bg-cyan-subtle flex items-center justify-center mb-3">
                <span className="text-2xl font-semibold text-cyan-accent">2</span>
              </div>
              <span className="text-sm font-medium text-navy-primary text-center">Architecture</span>
              <span className="text-xs text-navy-secondary text-center mt-1">System Design & APIs</span>
            </div>
            
            <div className="text-cyan-accent flex-shrink-0" aria-hidden="true">→</div>
            
            <div className="flex flex-col items-center min-w-[140px]">
              <div className="w-12 h-12 rounded-full bg-cyan-subtle flex items-center justify-center mb-3">
                <span className="text-2xl font-semibold text-cyan-accent">3</span>
              </div>
              <span className="text-sm font-medium text-navy-primary text-center">Development</span>
              <span className="text-xs text-navy-secondary text-center mt-1">Build & Integration</span>
            </div>
            
            <div className="text-cyan-accent flex-shrink-0" aria-hidden="true">→</div>
            
            <div className="flex flex-col items-center min-w-[140px]">
              <div className="w-12 h-12 rounded-full bg-cyan-subtle flex items-center justify-center mb-3">
                <span className="text-2xl font-semibold text-cyan-accent">4</span>
              </div>
              <span className="text-sm font-medium text-navy-primary text-center">Deploy</span>
              <span className="text-xs text-navy-secondary text-center mt-1">Testing & Launch</span>
            </div>
          </div>
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
  const featuredProjects = getHomepageFeaturedProjects().slice(0, 3)

  return (
    <section className="section">
      <div className="container">
        <div className="mb-12">
          <h2 className="section-heading mb-4">Case Studies</h2>
          <p className="section-subheading">
            Real projects, real results. Here's what we've shipped to production.
          </p>
        </div>

        {featuredProjects.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-xl font-medium text-navy-primary mb-6">
              Featured case studies coming soon
            </p>
            <Link to="/contact" className="btn-primary">
              Book a 30-min call
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <CaseStudyCard key={project.id} project={project} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link to="/portfolio" className="link inline-flex items-center gap-2">
            View all work <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <div className="mb-12">
          <h2 className="section-heading mb-4">Client Reviews</h2>
          <p className="text-navy-secondary">
            Real feedback from verified Upwork clients. Founder profile: 
            <span className="font-semibold text-navy-primary"> 100% Job Success • Top Rated • {SITE.founderExperienceYears}+ years experience</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fallbackTestimonials.map((testimonial) => (
            <figure key={testimonial.client_role} className="card p-6">
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
        <div className="mt-10 text-center">
          <a
            href={SOCIAL.upwork}
            target="_blank"
            rel="noopener noreferrer"
            className="link inline-flex items-center gap-2"
          >
            View all reviews on Upwork <FiArrowRight aria-hidden="true" />
          </a>
        </div>
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
      <HowWeWork />
      <WhoItsFor />
      <FounderSection />
      <Testimonials />
      <FAQSection />
      <CTABanner />
    </>
  )
}
