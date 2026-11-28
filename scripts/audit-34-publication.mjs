import { writeFileSync } from 'node:fs'
import { EXPANDED_PORTFOLIO_CARDS } from '../src/data/portfolioExpandedCards.js'
import { DRAFT_ONLY_PROJECTS } from '../src/data/portfolioDraftCatalog.js'
import { APPROVED_PUBLIC_PROJECTS } from '../src/data/portfolioApprovedProjects.js'
import { privatePatternPairs, privateRegex } from './lib/privateDenylist.mjs'

const CONFIDENTIAL = [
  ...privatePatternPairs('audit-34-publication#1'),
]

const draftBySlug = new Map(DRAFT_ONLY_PROJECTS.map((p) => [p.slug, p]))
const approvedBySlug = new Map(APPROVED_PUBLIC_PROJECTS.map((p) => [p.slug, p]))

function auditCard(c, n) {
  const issues = []
  const warnings = []
  const blob = JSON.stringify(c)

  if (c.holdPublicationUntil || c.publishReady === false || String(c.clarification || '').startsWith('BLOCKED')) {
    issues.push(`HOLD: ${c.holdPublicationUntil || c.clarification}`)
  }

  for (const [re, label] of CONFIDENTIAL) {
    if (re.test(blob)) issues.push(`CONFIDENTIAL_LEAK: ${label}`)
  }

  // Airtable/Odoo only allowed if both present as conflict note in confidentiality field — still fail if in public title/summary/tech
  const publicSurface = [c.title, c.summary, c.deliveryStatus, ...(c.techCandidates || []), ...(c.capabilities || [])].join(
    ' '
  )
  if (/Airtable|Odoo/i.test(publicSurface)) issues.push('CRM_CONFLICT_ON_PUBLIC_SURFACE')

  if (/\b(95%|10,000\+|5000\+|5,000\+|70%\s*workload|80%|60%)\b/i.test(publicSurface)) {
    issues.push('UNVERIFIED_METRIC_ON_PUBLIC_SURFACE')
  }

  if (/confirmation-gated|pending verification|pending founder|unconfirmed|do not invent/i.test(c.summary || '')) {
    issues.push('INTERNAL_LANGUAGE_IN_SUMMARY')
  }

  if (c.demoOnly && !/demo/i.test(`${c.title} ${c.summary} ${c.deliveryStatus}`)) {
    issues.push('DEMO_NOT_LABELED')
  }

  if (!c.inventoryRef) issues.push('MISSING_INV')
  if (!c.title || !c.summary || !(c.techCandidates || []).length) issues.push('INCOMPLETE_CARD')

  // Evidence depth: thin inventory-only with generic tech gets warning, not hard fail unless Factory-level
  if (c.evidenceStatus === 'evidence_thin') issues.push('EVIDENCE_THIN')
  if ((c.techCandidates || []).length === 1 && c.techCandidates[0] === 'Python') {
    warnings.push('STACK_MINIMAL_PYTHON_ONLY')
  }

  const draft = draftBySlug.get(c.slug)
  const approved = approvedBySlug.get(c.slug)
  if (c.hasCaseStudy && !draft && !approved) {
    warnings.push('CASE_STUDY_FLAG_WITHOUT_MODULE')
  }
  if (draft?.publicationApproved === true) issues.push('DRAFT_MODULE_ALREADY_APPROVED_UNEXPECTED')
  if (approved && c.slug !== 'ai-estimating-field-ops') {
    warnings.push('UNEXPECTED_APPROVED_MODULE')
  }

  // ML specific
  if (c.slug === 'ml-background-removal') {
    const allowed = new Set(['Python', 'PyTorch', 'U-2-Net', 'OpenCV'])
    for (const t of c.techCandidates || []) {
      if (!allowed.has(t)) issues.push(`ML_UNVERIFIED_TECH: ${t}`)
    }
    if (c.techPendingVerification) issues.push('ML_STILL_TECH_PENDING')
  }

  // Healthcare demo
  if (c.slug === 'healthcare-ops-sales-demo') {
    if (!c.demoOnly) issues.push('HEALTHCARE_MISSING_DEMO_FLAG')
    if (!/interactive sales demo|illustrative demo/i.test(`${c.title} ${c.summary}`)) {
      issues.push('HEALTHCARE_DEMO_WORDING_WEAK')
    }
  }

  // Sensitive domain retitle
  if (c.slug === 'private-document-rag-assistant' && privateRegex('audit-34-publication#2').test(publicSurface)) {
    issues.push('SENSITIVE_CLINICAL_WORDING')
  }
  if (privateRegex('audit-34-publication#3').test(c.slug || '')) {
    issues.push('SENSITIVE_OR_BRAND_SLUG')
  }

  return {
    n,
    id: c.id,
    slug: c.slug,
    inv: c.inventoryRef,
    title: c.title,
    summary: c.summary,
    category: c.primaryCategory,
    tech: c.techCandidates,
    delivery: c.deliveryStatus,
    featured: !!c.featuredWave,
    rank: c.flagshipRank || null,
    demoOnly: !!c.demoOnly,
    evidence: c.evidenceStatus || 'inventory_curated',
    confidentiality: c.confidentiality || null,
    capabilities: c.capabilities || null,
    publicationApprovedInCard: !!c.publicationApproved,
    livePublicationApproved: !!(approved?.publicationApproved || draft?.publicationApproved),
    issues,
    warnings,
    pass: issues.length === 0,
  }
}

const audited = EXPANDED_PORTFOLIO_CARDS.map((c, i) => auditCard(c, i + 1))
const blocked = audited.filter((r) => r.issues.some((i) => i.startsWith('HOLD:')))
const candidates = audited.filter((r) => !r.issues.some((i) => i.startsWith('HOLD:')))
const failed = candidates.filter((r) => !r.pass)
const passed = candidates.filter((r) => r.pass)
const featured = passed.filter((r) => r.featured).sort((a, b) => (a.rank || 99) - (b.rank || 99))

const report = {
  inventoryTotal: EXPANDED_PORTFOLIO_CARDS.length,
  blocked,
  failed,
  passed,
  featured,
  warningsOnly: passed.filter((r) => r.warnings.length),
  verdict:
    blocked.length === 1 &&
    blocked[0].n === 17 &&
    failed.length === 0 &&
    passed.length === 34
      ? 'PASS_34'
      : 'FAIL',
}

writeFileSync('tmp-audit-34.json', JSON.stringify(report, null, 2))
console.log('verdict', report.verdict)
console.log('passed', passed.length)
console.log('failed', failed.length)
failed.forEach((r) => console.log('FAIL', r.n, r.slug, r.issues.join(' | ')))
console.log('blocked', blocked.map((b) => `${b.n}:${b.slug}`).join(', '))
passed
  .filter((r) => r.warnings.length)
  .forEach((r) => console.log('WARN', r.n, r.slug, r.warnings.join(' | ')))
console.log(
  'featured',
  featured.map((f) => `${f.rank}:${f.slug}`).join(' | ')
)
