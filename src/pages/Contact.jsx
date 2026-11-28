import { useSearchParams } from 'react-router-dom'
import {
  FiMail, FiLinkedin, FiGithub, FiInstagram, FiMapPin, FiClock, FiGlobe,
} from 'react-icons/fi'
import { SiUpwork } from 'react-icons/si'
import SEOHead from '../components/SEOHead'
import ContactFindUsSection from '../components/ContactFindUsSection'
import ProjectBriefForm from '../components/contact/ProjectBriefForm'
import { SITE, SOCIAL, mapsOpenUrl } from '../lib/site'
import { getSeoPage } from '../lib/seoPages'
import { getPublishedProjectBySlug } from '../data/publishedProjects'

const contactInfo = [
  { icon: FiMail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: FiMapPin, label: 'Office', value: SITE.address.formatted, href: mapsOpenUrl() },
  { icon: FiClock, label: 'Business hours', value: `${SITE.businessHours} (${SITE.timezone})`, href: null },
  { icon: FiGlobe, label: 'Serving', value: 'Clients worldwide, remote-first', href: null },
  { icon: FiLinkedin, label: 'LinkedIn', value: 'linkedin.com/company/orchestrix-labs', href: SOCIAL.linkedin },
  { icon: SiUpwork, label: 'Upwork', value: 'Top Rated agency profile', href: SOCIAL.upwork },
  { icon: FiGithub, label: 'GitHub', value: 'github.com/orchestrixlabs', href: SOCIAL.github },
  { icon: FiInstagram, label: 'Instagram', value: SOCIAL.instagramHandle, href: SOCIAL.instagram },
]

const nextSteps = [
  `We read your brief and reply within ${SITE.responseTime}.`,
  'A 30-minute call to pin down scope and constraints.',
  'A written proposal with timeline and cost.',
  'Build starts once you approve it.',
]

/** Safe portfolio ?ref= handling: allowlist lookup only, length and charset gated. */
function resolveSafeRefProject(raw) {
  if (!raw || typeof raw !== 'string') return null
  let decoded = ''
  try {
    decoded = decodeURIComponent(raw.trim())
  } catch {
    return null
  }
  if (!decoded || decoded.length > 80 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(decoded)) return null
  const project = getPublishedProjectBySlug(decoded)
  return project && project.publicationApproved === true ? project : null
}

export default function Contact() {
  const [searchParams] = useSearchParams()
  const refProject = resolveSafeRefProject(searchParams.get('ref') || '')
  const refTitle = refProject ? String(refProject.title || '').replace(/[<>`]/g, '').slice(0, 120) : ''
  const initialMessage = refTitle ? `I'm interested in something similar to "${refTitle}".\n\nContext:\n` : ''
  const seo = getSeoPage('/contact')

  return (
    <>
      <SEOHead
        title={seo?.title}
        description={seo?.description}
        path="/contact"
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]}
      />

      <section className="pb-10 pt-32 sm:pt-36">
        <div className="container">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-navy-primary sm:text-5xl">
            Tell us what you need to ship next
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-secondary">
            Share a short brief. We reply within {SITE.responseTime} with an honest assessment and a practical next step.
          </p>
          {refTitle && (
            <p className="mt-5 inline-block rounded-lg border border-border bg-paper-subtle px-4 py-2.5 text-sm text-navy-body">
              Asking about: <span className="font-semibold text-navy-primary">{refTitle}</span>
            </p>
          )}
        </div>
      </section>

      <section className="pb-20">
        <div className="container grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ProjectBriefForm initialMessage={initialMessage} />
          </div>

          <aside className="space-y-8 lg:col-span-5">
            <div>
              <h2 className="text-base font-semibold text-navy-primary">What happens next</h2>
              <ol className="mt-4 space-y-4">
                {nextSteps.map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-strong text-xs font-semibold text-navy-secondary">
                      {i + 1}
                    </span>
                    <span className="text-navy-body">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="border-t border-border pt-8">
              <h2 className="text-base font-semibold text-navy-primary">Other ways to reach us</h2>
              <ul className="mt-4 space-y-3.5">
                {contactInfo.map(({ icon: Icon, label, value, href }) => {
                  const body = (
                    <>
                      <Icon className="mt-0.5 shrink-0 text-navy-muted" size={17} aria-hidden="true" />
                      <span>
                        <span className="block text-sm text-navy-muted">{label}</span>
                        <span className="block text-navy-body group-hover:text-cyan-hover">{value}</span>
                      </span>
                    </>
                  )
                  return (
                    <li key={label}>
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3">
                          {body}
                        </a>
                      ) : (
                        <div className="flex items-start gap-3">{body}</div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <ContactFindUsSection />
    </>
  )
}
