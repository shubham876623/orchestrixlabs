import { Helmet } from 'react-helmet-async'
import { SITE } from '../lib/site'
import { getSeoPage, HOME_META_DESCRIPTION } from '../lib/seoPages'
import {
  organizationSchema,
  professionalServiceSchema,
  websiteSchema,
  faqSchema,
  breadcrumbSchema,
} from '../lib/seoSchemas'

export default function SEOHead({
  title,
  description,
  path = '',
  image = SITE.ogImage,
  noindex = false,
  faq,
  breadcrumbs,
  extraSchemas = [],
}) {
  const page = getSeoPage(path)
  const resolvedDescription = description || page?.description || HOME_META_DESCRIPTION
  const resolvedTitleBase = title || page?.title
  const fullTitle = resolvedTitleBase
    ? (resolvedTitleBase.includes('Orchestrix Labs')
        ? resolvedTitleBase
        : `${resolvedTitleBase} — Orchestrix Labs`)
    : `Orchestrix Labs — ${SITE.slogan}`
  const fullUrl = `${SITE.url}${path || '/'}`

  const schemas = [
    organizationSchema(),
    professionalServiceSchema(),
    websiteSchema(),
    ...(faq ? [faqSchema(faq)] : []),
    ...(breadcrumbs ? [breadcrumbSchema(breadcrumbs)] : []),
    ...extraSchemas,
  ]

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="author" content={SITE.name} />
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        }
      />
      <link rel="canonical" href={fullUrl} />

      <meta name="geo.region" content="IN-PB" />
      <meta name="geo.placename" content="Mohali, Punjab, India" />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Orchestrix Labs — AI Development Agency" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="Orchestrix Labs — AI Development Agency" />

      <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable site summary" />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
