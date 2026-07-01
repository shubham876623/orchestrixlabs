import { SITE, SOCIAL, SERVICES_SEO, FAQ } from './site'

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: SITE.logo,
    image: SITE.ogImage,
    description:
      'Top-rated AI development agency specializing in voice AI agents, intelligent automation, machine learning, and full-stack web applications. 200+ projects delivered worldwide with 100% job success.',
    foundingDate: SITE.founded,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: SITE.email,
        availableLanguage: ['English', 'Hindi'],
        areaServed: 'Worldwide',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: SITE.email,
        url: `${SITE.url}/contact`,
      },
    ],
    sameAs: Object.values(SOCIAL),
    founder: {
      '@type': 'Person',
      name: SITE.founder,
      jobTitle: SITE.founderTitle,
    },
  }
}

export function professionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE.url}/#business`,
    name: SITE.name,
    url: SITE.url,
    image: SITE.ogImage,
    description:
      'AI development agency offering voice AI, machine learning, full-stack development, web scraping, and workflow automation for businesses worldwide.',
    priceRange: '$$',
    areaServed: { '@type': 'Place', name: 'Worldwide' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    email: SITE.email,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'AI & Software Development Services',
      itemListElement: SERVICES_SEO.map((name, i) => ({
        '@type': 'Offer',
        position: i + 1,
        itemOffered: { '@type': 'Service', name, provider: { '@id': `${SITE.url}/#organization` } },
      })),
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      bestRating: '5',
      ratingCount: '133',
      reviewCount: '133',
    },
    sameAs: Object.values(SOCIAL),
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.tagline,
    publisher: { '@id': `${SITE.url}/#organization` },
    inLanguage: 'en',
  }
}

export function faqSchema(items = FAQ) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  }
}
