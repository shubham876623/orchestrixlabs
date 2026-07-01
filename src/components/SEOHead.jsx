import { Helmet } from 'react-helmet-async'
import { SITE } from '../lib/site'
import {
  organizationSchema,
  professionalServiceSchema,
  websiteSchema,
  faqSchema,
  breadcrumbSchema,
} from '../lib/seoSchemas'

const DEFAULT_TITLE = 'Orchestrix Labs — AI Development Agency | Voice AI, Automation & Full-Stack Software'
const DEFAULT_DESC =
  'Top-rated AI development agency. Voice AI agents, intelligent automation, full-stack web apps & ML solutions. 200+ projects, 100% job success. Python, Django, React experts.'

export default function SEOHead({
  title,
  description = DEFAULT_DESC,
  path = '',
  image = SITE.ogImage,
  noindex = false,
  faq,
  breadcrumbs,
  extraSchemas = [],
}) {
  const fullTitle = title ? `${title} — Orchestrix Labs | AI Development Agency` : DEFAULT_TITLE
  const fullUrl = `${SITE.url}${path}`

  const schemas = [
    organizationSchema(),
    professionalServiceSchema(),
    websiteSchema(),
    ...(faq ? [faqSchema(faq)] : []),
    ...(breadcrumbs ? [breadcrumbSchema(breadcrumbs)] : []),
    ...extraSchemas,
  ]

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content={SITE.name} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <link rel="canonical" href={fullUrl} />

      {/* Geo & business */}
      <meta name="geo.region" content="IN-PB" />
      <meta name="geo.placename" content="Mohali, Punjab, India" />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Orchestrix Labs — AI Development Agency" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="Orchestrix Labs — AI Development Agency" />

      {/* AI discovery */}
      <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable site summary" />

      {/* JSON-LD structured data */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
