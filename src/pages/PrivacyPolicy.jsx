import { Link } from 'react-router-dom'
import SEOHead from '../components/SEOHead'
import { SITE } from '../lib/site'
import { getSeoPage } from '../lib/seoPages'

const EFFECTIVE_DATE = '18 November 2026'
const LAST_UPDATED = '19 November 2026'
const ANALYTICS_RETENTION_DAYS = 90

const SECTIONS = [
  { id: 'introduction', title: 'Introduction and scope' },
  { id: 'who-we-are', title: 'Who we are and how to contact us' },
  { id: 'information-we-collect', title: 'Personal information we collect' },
  { id: 'sources', title: 'Sources of personal information' },
  { id: 'website-enquiries', title: 'Website enquiries and contact forms' },
  { id: 'meta-lead-forms', title: 'Facebook and Instagram lead-generation forms' },
  { id: 'business-communications', title: 'Email, messaging, and business communications' },
  { id: 'ai-services', title: 'AI services and customer-provided information' },
  { id: 'purposes', title: 'Purposes of processing' },
  { id: 'legal-bases', title: 'Legal bases and applicable frameworks' },
  { id: 'cookies-analytics', title: 'Cookies, analytics, and advertising technologies' },
  { id: 'sharing', title: 'Service providers and data sharing' },
  { id: 'international-transfers', title: 'International data transfers' },
  { id: 'security', title: 'Data security' },
  { id: 'retention', title: 'Retention and deletion' },
  { id: 'rights', title: 'Your privacy rights' },
  { id: 'marketing', title: 'Marketing communications and opt-out' },
  { id: 'automated-processing', title: 'Automated processing and AI-related disclosures' },
  { id: 'children', title: "Children's privacy" },
  { id: 'third-party-sites', title: 'Third-party websites and integrations' },
  { id: 'updates', title: 'Policy updates' },
  { id: 'contact-requests', title: 'Privacy-related contact requests' },
]

function SectionHeading({ id, number, children }) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 font-display text-xl font-semibold text-navy-primary sm:text-2xl"
    >
      <span className="mr-2 text-cyan-400/90">{String(number).padStart(2, '0')}.</span>
      {children}
    </h2>
  )
}

export default function PrivacyPolicy() {
  return (
    <>
      <SEOHead
        title={getSeoPage('/privacy-policy')?.title}
        description={getSeoPage('/privacy-policy')?.description}
        path="/privacy-policy"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Privacy Policy', path: '/privacy-policy' },
        ]}
      />

      <section className="relative overflow-hidden pt-36 pb-12">
        <div className="container relative z-10">
          <p className="section-tag mb-5">Legal</p>
          <h1 className="section-heading mb-4 max-w-3xl">Privacy Policy</h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            This Privacy Policy explains how Orchestrix Labs handles personal information when you visit
            our website, submit an enquiry, respond to our Meta lead forms, or engage us for technology
            services.
          </p>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-slate-400">
            <div>
              <dt className="inline text-slate-500">Effective date:&nbsp;</dt>
              <dd className="inline text-slate-300">{EFFECTIVE_DATE}</dd>
            </div>
            <div>
              <dt className="inline text-slate-500">Last updated:&nbsp;</dt>
              <dd className="inline text-slate-300">{LAST_UPDATED}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <nav
                aria-label="Privacy Policy contents"
                className="rounded-2xl border border-white/[0.07] bg-dark-900/40 p-5"
              >
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Contents
                </p>
                <ol className="max-h-[70vh] space-y-1.5 overflow-y-auto pr-1 text-sm">
                  {SECTIONS.map((section, index) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block rounded-lg px-2 py-1.5 text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-navy-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      >
                        <span className="mr-1.5 text-slate-600">{String(index + 1).padStart(2, '0')}</span>
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <article className="max-w-3xl space-y-12 text-[15px] leading-relaxed text-slate-300 sm:text-base">
              <section className="space-y-4" aria-labelledby="introduction">
                <SectionHeading id="introduction" number={1}>
                  Introduction and scope
                </SectionHeading>
                <p>
                  Orchestrix Labs (&quot;Orchestrix Labs&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides AI development
                  and AI agents, business process automation, custom software development, SaaS development,
                  web and mobile application development, CRM and API integrations, IT consulting, and related
                  technology services.
                </p>
                <p>
                  This Privacy Policy applies to personal information we collect through{' '}
                  <a href={SITE.url} className="text-cyan-300 hover:text-navy-primary underline-offset-2 hover:underline">
                    {SITE.url}
                  </a>
                  , our public business profiles, enquiry and lead forms (including Facebook and Instagram Instant
                  Forms), and related business communications about our services.
                </p>
                <p>
                  This Policy does not cover privacy practices of third-party websites, marketplaces, or platforms
                  that we do not control (for example Upwork, LinkedIn, GitHub, Meta, or Google), except to the
                  extent we receive personal information from those platforms in connection with an enquiry or
                  engagement.
                </p>
                <p>
                  Where we process personal information on behalf of a client under a services contract (for
                  example building or operating a system for that client), that client&apos;s instructions and
                  privacy notice typically govern how that information is handled. This Policy focuses on
                  information we collect for our own business operations and marketing.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="who-we-are">
                <SectionHeading id="who-we-are" number={2}>
                  Who we are and how to contact us
                </SectionHeading>
                <ul className="list-disc space-y-2 pl-5 text-slate-300">
                  <li>
                    <span className="text-slate-400">Brand / trading name:</span> Orchestrix Labs
                  </li>
                  <li>
                    <span className="text-slate-400">Website:</span>{' '}
                    <a href={SITE.url} className="text-cyan-300 hover:text-navy-primary underline-offset-2 hover:underline">
                      {SITE.url}
                    </a>
                  </li>
                  <li>
                    <span className="text-slate-400">General enquiries:</span>{' '}
                    <a href={`mailto:${SITE.email}`} className="text-cyan-300 hover:text-navy-primary underline-offset-2 hover:underline">
                      {SITE.email}
                    </a>
                  </li>
                  <li>
                    <span className="text-slate-400">Privacy requests:</span>{' '}
                    <a href={`mailto:${SITE.privacyEmail}`} className="text-cyan-300 hover:text-navy-primary underline-offset-2 hover:underline">
                      {SITE.privacyEmail}
                    </a>
                  </li>
                  <li>
                    <span className="text-slate-400">Operations location (public contact address):</span>{' '}
                    {SITE.address.formatted}
                  </li>
                </ul>
                <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-100/90">
                  Registered legal entity name, company registration number, and registered office status are
                  subject to confirmation and are not stated as final facts in this Policy. If you need formal
                  contracting details, contact us before relying on this page for incorporation status.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="information-we-collect">
                <SectionHeading id="information-we-collect" number={3}>
                  Personal information we collect
                </SectionHeading>
                <p>Depending on how you interact with us, we may collect:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <strong className="text-navy-primary font-medium">Identity and contact details</strong> — such as
                    name, email address, phone or WhatsApp number (if you provide one), company name, job title,
                    and country or city.
                  </li>
                  <li>
                    <strong className="text-navy-primary font-medium">Enquiry and project details</strong> — service
                    interest, budget range (if provided), project description, requirements, files you choose to
                    send, and related business context.
                  </li>
                  <li>
                    <strong className="text-navy-primary font-medium">Communication content</strong> — messages,
                    emails, call notes, and follow-up correspondence.
                  </li>
                  <li>
                    <strong className="text-navy-primary font-medium">Technical and usage data</strong> — when you opt in
                    to optional analytics: page paths (without query strings or fragments), sanitized referring
                    URL, coarse browser/device/OS category, screen size, language, and timezone. With the same
                    opt-in, Microsoft Clarity may also process interaction data on public pages. Separately, when
                    you submit a contact enquiry we may capture the submitting IP address for security and abuse
                    prevention (not as optional marketing analytics).
                  </li>
                  <li>
                    <strong className="text-navy-primary font-medium">Preference data</strong> — for example a theme
                    preference stored locally in your browser.
                  </li>
                </ul>
                <p>
                  We do not intentionally seek special-category or sensitive personal information through our
                  public website forms. Please do not submit health, biometric, government ID, or similar sensitive
                  data unless we specifically request it under a contract and with appropriate safeguards.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="sources">
                <SectionHeading id="sources" number={4}>
                  Sources of personal information
                </SectionHeading>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Directly from you (website contact form, email, calls, meetings, messaging apps).</li>
                  <li>Through Meta lead-generation Instant Forms on Facebook or Instagram.</li>
                  <li>From public or business profiles you share with us (for example LinkedIn or Upwork), when relevant to an enquiry or engagement.</li>
                  <li>Automatically from your device when you opt in to optional analytics (first-party page views and Microsoft Clarity, described below).</li>
                  <li>From service providers that help us operate hosting, email delivery, analytics (Microsoft Clarity when opted in), or advertising tools, where applicable.</li>
                </ul>
              </section>

              <section className="space-y-4" aria-labelledby="website-enquiries">
                <SectionHeading id="website-enquiries" number={5}>
                  Website enquiries and contact forms
                </SectionHeading>
                <p>
                  Our <Link to="/contact" className="text-cyan-300 hover:text-navy-primary underline-offset-2 hover:underline">Request Consultation</Link>{' '}
                  form may collect your name, email address, selected service, optional budget range, and message.
                  Submissions are sent to our backend systems, stored so we can respond and manage the enquiry, and
                  may trigger an internal email notification to our team.
                </p>
                <p>
                  We also capture the submitting IP address with the enquiry for security, abuse prevention, and
                  operational troubleshooting. A honeypot field may be used to reduce automated spam; it is not
                  intended for human applicants.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="meta-lead-forms">
                <SectionHeading id="meta-lead-forms" number={6}>
                  Facebook and Instagram lead-generation forms
                </SectionHeading>
                <p>
                  When you submit a Facebook or Instagram lead form promoting Orchestrix Labs, Meta collects the
                  information you enter and makes that lead available to us. Our Instant Forms are configured to
                  collect: <strong className="font-medium text-navy-primary">name</strong>,{' '}
                  <strong className="font-medium text-navy-primary">email</strong>,{' '}
                  <strong className="font-medium text-navy-primary">company information</strong>,{' '}
                  <strong className="font-medium text-navy-primary">project requirements</strong>,{' '}
                  <strong className="font-medium text-navy-primary">budget</strong>, and{' '}
                  <strong className="font-medium text-navy-primary">timeline</strong>. If a particular form variant also
                  asks for phone number or other optional business details, we will use those only to respond to
                  the same enquiry.
                </p>
                <p>We use Meta lead information to:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Respond to your enquiry and discuss potential services</li>
                  <li>Qualify whether our services are a fit for your needs</li>
                  <li>Keep records of business development communications</li>
                  <li>Improve our forms and campaign relevance based on aggregate performance</li>
                </ul>
                <p>
                  We may contact you by email, phone, WhatsApp, or other channel you provided, about the enquiry you
                  submitted. We do not treat lead-form submission as consent for unrelated promotional campaigns
                  beyond responding to and following up on that business enquiry, unless a separate clear consent is
                  obtained where required.
                </p>
                <p>
                  Meta also processes information under its own terms and policies. Review Meta&apos;s privacy
                  materials for how Meta handles Instant Form data on its platform. You can request correction or
                  deletion of lead information we hold by emailing{' '}
                  <a href={`mailto:${SITE.privacyEmail}`} className="text-cyan-300 hover:text-navy-primary underline-offset-2 hover:underline">
                    {SITE.privacyEmail}
                  </a>
                  .
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="business-communications">
                <SectionHeading id="business-communications" number={7}>
                  Email, messaging, and business communications
                </SectionHeading>
                <p>
                  If you email us, message us on LinkedIn, Instagram, Upwork, WhatsApp, or other business channels,
                  or speak with us by phone or video, we process the contact details and content needed to understand
                  and respond to your request, manage a proposal or project, and keep appropriate business records.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="ai-services">
                <SectionHeading id="ai-services" number={8}>
                  AI services and customer-provided information
                </SectionHeading>
                <p>
                  When you engage Orchestrix Labs for AI agents, automation, software, or integrations, you or your
                  organisation may provide business data, content, credentials (through agreed secure channels),
                  prompts, transcripts, CRM records, or other materials needed to deliver the work.
                </p>
                <p>
                  How that information is processed depends on the statement of work, data processing terms (if any),
                  and the tools selected for the engagement. Third-party AI or cloud providers may process data under
                  their own terms when configured for a project. We do not claim in this Policy that customer data is
                  never used for model training by every upstream provider; training and retention settings must be
                  reviewed per provider and project configuration.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="purposes">
                <SectionHeading id="purposes" number={9}>
                  Purposes of processing
                </SectionHeading>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Responding to enquiries and providing consultations</li>
                  <li>Evaluating fit, preparing proposals, and delivering contracted services</li>
                  <li>Operating, securing, and improving our website and internal operations</li>
                  <li>Understanding aggregate website traffic and campaign performance</li>
                  <li>Communicating about projects, invoices, and support</li>
                  <li>Complying with legal obligations and defending legal claims where applicable</li>
                  <li>Preventing spam, fraud, and abuse</li>
                </ul>
              </section>

              <section className="space-y-4" aria-labelledby="legal-bases">
                <SectionHeading id="legal-bases" number={10}>
                  Legal bases and applicable frameworks
                </SectionHeading>
                <p>
                  Orchestrix Labs operates from India and works with business customers in multiple countries. Which
                  privacy or data-protection law applies depends on factors such as where you are located, where
                  processing occurs, the nature of the relationship, and legal thresholds or exemptions. This Policy
                  does not claim that Orchestrix Labs is certified, audited, or fully compliant with every
                  international privacy regime.
                </p>
                <p>Where a law applies, processing may be based on one or more of the following, as relevant:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Your consent (for example certain marketing or optional cookies, where required)</li>
                  <li>Steps taken at your request before entering a contract, or performance of a contract</li>
                  <li>Legitimate interests in responding to business enquiries and operating our website, balanced against your rights</li>
                  <li>Legal obligations applicable to us</li>
                  <li>Other bases recognised under applicable law (including India&apos;s Digital Personal Data Protection Act, 2023 and related Rules, as and when their operative provisions apply to our processing)</li>
                </ul>
                <p>
                  Frameworks that may be relevant to international customers—subject to applicability review—include
                  the EU GDPR and ePrivacy rules, UK GDPR and Data Protection Act 2018, Australia&apos;s Privacy Act
                  1988 and Australian Privacy Principles, certain US state privacy laws (including California
                  requirements where thresholds are met), Canada&apos;s PIPEDA and provincial laws, and the UAE
                  Federal Personal Data Protection Law. Applicability is not assumed solely because a visitor is
                  located in those jurisdictions.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="cookies-analytics">
                <SectionHeading id="cookies-analytics" number={11}>
                  Cookies, analytics, and advertising technologies
                </SectionHeading>
                <p>
                  Our marketing website uses limited first-party technologies. In particular, we may store a theme
                  preference in local browser storage and an analytics consent preference in local storage when you
                  accept or decline optional analytics. Optional analytics are off by default until you opt in.
                </p>
                <p>
                  With your explicit opt-in, our first-party page-view analytics may record the page path (without
                  URL query strings or fragments), a sanitized referrer, coarse device/browser/OS category derived
                  from the browser user-agent at collection time (the raw user-agent string is not stored), screen
                  size, language, and timezone. We do not store raw IP addresses or persistent session identifiers
                  for this optional page-view analytics. Dashboard access to aggregated analytics is restricted to
                  authorised internal users.
                </p>
                <p>
                  With the same opt-in consent, we may also use <strong className="text-navy-primary font-medium">Microsoft Clarity</strong>{' '}
                  (session analytics and heatmaps; Clarity project configured for this site) on public marketing
                  pages. Clarity may set cookies or similar technologies and process interaction data such as clicks,
                  scrolls, and page views. Clarity is not initialised on the private admin dashboard. If you navigate
                  there after consenting on a public page, collection is stopped for that private route and the
                  dashboard UI is masked as an additional safeguard. Contact-form fields and other input values are
                  masked so typed content is not uploaded to Clarity. Complete isolation of an already-running
                  third-party session-replay agent inside a single-page app cannot be guaranteed solely by client
                  masking; we also configure URL exclusions in the Clarity console for dashboard paths.
                </p>
                <p>
                  You can accept or decline optional analytics on first visit, and change or withdraw that choice
                  anytime using the persistent <strong className="text-navy-primary font-medium">Cookie Settings</strong>{' '}
                  control in the site footer. Withdrawing consent persists your denial, signals denied analytics
                  storage to Clarity, stops collection where supported, clears Clarity cookies we can remove from
                  this browser, and reloads the page when Clarity was previously active so it cannot re-initialise
                  without a new opt-in. Declining or withdrawing optional analytics does not affect essential site
                  operation (for example serving pages, security controls, or processing a contact enquiry you
                  submit). Separate security and operational logs (such as IP captured with a contact-form submission
                  for abuse prevention) are not the same as optional analytics and are handled under those purposes.
                </p>
                <p>
                  Optional first-party page-view records are retained for approximately{' '}
                  {ANALYTICS_RETENTION_DAYS} days, after which they are eligible for automated deletion via our
                  retention cleanup process. You may also request deletion by emailing {SITE.privacyEmail}.
                </p>
                <p>
                  As of the last update of this Policy, we have not identified third-party advertising pixels (such
                  as Meta Pixel) embedded in the public website codebase. If we add tag managers or ad pixels later,
                  we will update this Policy and, where required, provide appropriate notices or choices.
                </p>
                <p>
                  Meta may use cookies or similar technologies on Facebook and Instagram when you view or submit
                  lead ads; those technologies are governed by Meta&apos;s policies. Microsoft&apos;s processing of
                  Clarity data is also subject to Microsoft&apos;s applicable terms and privacy documentation.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="sharing">
                <SectionHeading id="sharing" number={12}>
                  Service providers and data sharing
                </SectionHeading>
                <p>We may share personal information with:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    <strong className="text-navy-primary font-medium">Infrastructure and hosting providers</strong> that
                    host our website frontend, backend APIs, and databases
                  </li>
                  <li>
                    <strong className="text-navy-primary font-medium">Microsoft Clarity</strong> (Microsoft Corporation /
                    Microsoft services), which processes session analytics and heatmap data when you opt in to
                    optional analytics on public marketing pages. Microsoft may process data in the United States
                    and other locations where Microsoft operates, subject to Microsoft&apos;s terms and privacy
                    documentation
                  </li>
                  <li>
                    <strong className="text-navy-primary font-medium">Email delivery providers</strong> used to send
                    internal enquiry notifications or business email
                  </li>
                  <li>
                    <strong className="text-navy-primary font-medium">Meta Platforms</strong> when you interact with our
                    Facebook or Instagram pages or lead forms
                  </li>
                  <li>
                    <strong className="text-navy-primary font-medium">Professional advisers</strong> such as legal or
                    accounting advisers, where needed
                  </li>
                  <li>
                    <strong className="text-navy-primary font-medium">Authorities</strong> when required by law or to
                    protect rights, safety, and security
                  </li>
                </ul>
                <p>
                  We do not sell personal information. We also do not share enquiry data with unrelated third parties
                  for their independent marketing. Project subcontractors or specialists, if engaged for delivery,
                  would receive only what is needed under confidentiality arrangements.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="international-transfers">
                <SectionHeading id="international-transfers" number={13}>
                  International data transfers
                </SectionHeading>
                <p>
                  We operate from India and may use service providers or collaborate with customers in other
                  countries. Personal information may therefore be processed in India and in other locations where
                  our providers or collaborators operate — including, when you opt in to Microsoft Clarity,
                  processing by Microsoft in the United States and other regions where Microsoft operates. Where a
                  transfer is restricted by applicable law, we will take steps required by that law (for example
                  contractual or organisational measures). Specific transfer mechanisms can be confirmed for a given
                  engagement on request. This Policy does not claim worldwide legal certification or adequacy for
                  every jurisdiction.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="security">
                <SectionHeading id="security" number={14}>
                  Data security
                </SectionHeading>
                <p>
                  We apply reasonable technical and organisational measures appropriate to our size and the nature of
                  the information we handle, including access controls for administrative tools, transport security
                  for the public website (HTTPS), and rate limiting on public enquiry endpoints. No method of
                  transmission or storage is completely secure, and we do not claim ISO 27001, SOC 2, or similar
                  certifications in this Policy.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="retention">
                <SectionHeading id="retention" number={15}>
                  Retention and deletion
                </SectionHeading>
                <p>
                  We retain personal information only as long as needed for the purposes described in this Policy,
                  including responding to enquiries, delivering services, maintaining business records, resolving
                  disputes, and meeting legal or accounting requirements. Retention periods vary by record type.
                </p>
                <p>
                  Optional first-party page-view analytics records are configured for approximately{' '}
                  {ANALYTICS_RETENTION_DAYS}-day retention and are eligible for automated purge after that period.
                  Contact enquiries, project records, and security-related logs may be retained longer where needed
                  for business, legal, or abuse-prevention purposes. Microsoft Clarity retention for opted-in
                  session data is also governed by Microsoft&apos;s product settings and policies.
                </p>
                <p>
                  You may request deletion or correction of personal information we hold about you by contacting{' '}
                  <a href={`mailto:${SITE.privacyEmail}`} className="text-cyan-300 hover:text-navy-primary underline-offset-2 hover:underline">
                    {SITE.privacyEmail}
                  </a>
                  . We may retain limited information where we have a lawful need to do so (for example to complete
                  a transaction, comply with law, or prevent abuse).
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="rights">
                <SectionHeading id="rights" number={16}>
                  Your privacy rights
                </SectionHeading>
                <p>
                  Depending on the law that applies to you, you may have rights to request access, correction,
                  deletion, restriction, portability, withdrawal of consent, or to object to certain processing, and
                  to lodge a complaint with a supervisory authority. India&apos;s DPDP framework provides data
                  principal rights that take effect according to the government&apos;s notified commencement
                  schedule; other jurisdictions provide analogous rights under their own statutes.
                </p>
                <p>
                  To exercise available rights regarding information Orchestrix Labs controls, email{' '}
                  <a href={`mailto:${SITE.privacyEmail}`} className="text-cyan-300 hover:text-navy-primary underline-offset-2 hover:underline">
                    {SITE.privacyEmail}
                  </a>
                  . We may need to verify your identity before fulfilling a request. If we process data only as a
                  service provider for a client, we may direct your request to that client.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="marketing">
                <SectionHeading id="marketing" number={17}>
                  Marketing communications and opt-out
                </SectionHeading>
                <p>
                  We use enquiry and lead information primarily to respond to business interest in our services. If
                  we send optional marketing emails beyond enquiry follow-up, we will do so in line with applicable
                  law and provide a way to opt out. You can opt out of marketing emails by using unsubscribe links
                  where provided or by emailing {SITE.privacyEmail}. Operational messages about an active enquiry or
                  project may still be sent.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="automated-processing">
                <SectionHeading id="automated-processing" number={18}>
                  Automated processing and AI-related disclosures
                </SectionHeading>
                <p>
                  We may use software tools to organise enquiries, reduce spam, or assist internal drafting. We do
                  not use website enquiry submissions alone to make solely automated decisions that produce legal or
                  similarly significant effects about you without human involvement. Client AI systems we build may
                  include automated components under that client&apos;s instructions and disclosures.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="children">
                <SectionHeading id="children" number={19}>
                  Children&apos;s privacy
                </SectionHeading>
                <p>
                  Our website and services are directed to businesses and professionals. We do not knowingly collect
                  personal information from children. If you believe a child has provided personal information to us,
                  contact {SITE.privacyEmail} and we will take appropriate steps.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="third-party-sites">
                <SectionHeading id="third-party-sites" number={20}>
                  Third-party websites and integrations
                </SectionHeading>
                <p>
                  Our site may link to third-party sites and profiles (including Upwork, LinkedIn, GitHub,
                  Instagram, and Google Maps). Those services have their own privacy policies. We are not responsible
                  for their content or practices.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="updates">
                <SectionHeading id="updates" number={21}>
                  Policy updates
                </SectionHeading>
                <p>
                  We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top
                  will change when we do. Material updates may also be highlighted on this page or communicated
                  through appropriate channels. Continued use of the website after an update means you should review
                  the revised Policy.
                </p>
              </section>

              <section className="space-y-4" aria-labelledby="contact-requests">
                <SectionHeading id="contact-requests" number={22}>
                  Privacy-related contact requests
                </SectionHeading>
                <p>
                  For privacy questions, access or deletion requests, or concerns about Meta lead data we hold,
                  contact:
                </p>
                <p>
                  <a href={`mailto:${SITE.privacyEmail}`} className="text-cyan-300 hover:text-navy-primary underline-offset-2 hover:underline">
                    {SITE.privacyEmail}
                  </a>
                </p>
                <p>
                  General project enquiries can continue to use{' '}
                  <Link to="/contact" className="text-cyan-300 hover:text-navy-primary underline-offset-2 hover:underline">
                    our contact form
                  </Link>{' '}
                  or{' '}
                  <a href={`mailto:${SITE.email}`} className="text-cyan-300 hover:text-navy-primary underline-offset-2 hover:underline">
                    {SITE.email}
                  </a>
                  .
                </p>
              </section>

              <p className="border-t border-white/[0.06] pt-8 text-sm text-slate-500">
                This page is provided for transparency and Meta lead-generation use. It is not legal advice. Formal
                compliance assessment for specific jurisdictions should be completed with qualified counsel before
                relying on any compliance representation.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
