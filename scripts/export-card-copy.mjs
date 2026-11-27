import { writeFileSync } from 'node:fs'
import { EXPANDED_PORTFOLIO_CARDS } from '../src/data/portfolioExpandedCards.js'

const lines = EXPANDED_PORTFOLIO_CARDS.map((c, i) => {
  const bits = [
    `### ${i + 1}. ${c.title}`,
    `- Category: ${c.primaryCategory}`,
    `- Summary: ${c.summary}`,
    `- Tech: ${(c.techCandidates || []).join(', ')}`,
    `- Delivery: ${c.deliveryStatus || '—'}`,
    `- Case study: ${c.hasCaseStudy ? 'yes' : 'card only'}`,
  ]
  if (c.demoOnly) bits.push('- Badge: Interactive demo')
  if (c.holdPublicationUntil) bits.push(`- Hold: ${c.holdPublicationUntil}`)
  return bits.join('\n')
})

const out = [
  `# Public-facing card copy (${EXPANDED_PORTFOLIO_CARDS.length})`,
  '',
  ...lines,
  '',
].join('\n')

const dest =
  '../../00_Company_Management/Brand_Marketing/PORTFOLIO_PUBLIC_CARD_COPY_2026-11-13.md'
writeFileSync(dest, out)
console.log('Wrote', dest, 'count=', EXPANDED_PORTFOLIO_CARDS.length)
