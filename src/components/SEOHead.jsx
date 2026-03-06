import { Helmet } from 'react-helmet-async'

const SITE = 'https://orchestrixlabs.com'
const DEFAULT_IMAGE = `${SITE}/og-image.png`

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Orchestrix Labs',
  url: SITE,
  logo: `${SITE}/favicon.svg`,
  description:
    'Orchestrix Labs builds AI systems, voice bots, automation pipelines, and full-stack web applications for businesses worldwide.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'hello@orchestrixlabs.com',
  },
  sameAs: [
    'https://linkedin.com/company/orchestrix-labs',
    'https://github.com/orchestrix-labs',
  ],
}

export default function SEOHead({ title, description, path = '', image = DEFAULT_IMAGE, schema }) {
  const fullTitle = title
    ? `${title} | Orchestrix Labs`
    : 'Orchestrix Labs | AI Development, Voice AI & Python Automation'
  const fullUrl = `${SITE}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  )
}
