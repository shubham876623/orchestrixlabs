/**
 * Phase 7 — Generate approval reviews, sanitized GPT profiles, shortlist,
 * verification checklist, and contract-link suggestion stubs (no client PII).
 *
 * Does NOT flip gptExportApproved. Does NOT publish.
 *
 *   node scripts/build-phase7-approval-packs.mjs
 */
import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { APPROVED_PUBLIC_PROJECTS } from '../src/data/portfolioApprovedProjects.js'
import { privateList } from './lib/privateDenylist.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const knowledge = join(__dirname, '..', '..', 'portfolio-knowledge')
const outRoot = join(knowledge, 'phase7')
const reviewsDir = join(outRoot, 'approval-reviews')
const profilesDir = join(outRoot, 'gpt-profiles')

const FORBIDDEN_SUBSTRINGS = [
  ...privateList('build-phase7-approval-packs#1'),
  'hourly_rate',
  'total_charges',
]

const GPT_SHORTLIST_ORDER = [
  'restaurant-voice-ordering',
  'ai-estimating-field-ops',
  'hubspot-voice-lead-qualification',
  'twilio-outbound-call-center',
  'bilingual-hr-ai-assistant',
  'retail-flooring-automation-suite',
  'django-ecommerce-data-pipeline',
  'ml-background-removal',
  'legacy-desktop-to-flask',
  'n8n-ai-email-assistant',
]

const VERIFICATION_BY_SLUG = {
  'ai-estimating-field-ops': [
    'Production vs local module boundaries confirmed?',
    'AroFlo API vs Playwright coverage?',
    'Any founder-approved numeric outcomes?',
    'Public naming of GHL/AroFlo/Xero OK?',
  ],
  'hubspot-voice-lead-qualification': [
    'Private repo available for architecture verify?',
    'Exact HubSpot objects written?',
    'Meetings API vs workflow-only?',
    'Any approved conversion metrics?',
  ],
  'restaurant-voice-ordering': [
    'Production hosting mention allowed?',
    'Tenant count (count only)?',
    'PrintNode/SMS production vs code-complete?',
    'Screenshot authorization without PII?',
  ],
  'twilio-outbound-call-center': [
    'Safeguards shipped vs planned?',
    'Recording/consent language allowed?',
    'Stack confirmation FastAPI/React/Postgres?',
    'Code access for diagrams?',
  ],
  'bilingual-hr-ai-assistant': [
    'Vector store / model providers public-safe?',
    'Which connectors are live?',
    'Arabic + English production use confirmed?',
    'Data residency constraints for copy?',
  ],
  'healthcare-ops-sales-demo': [
    'Demo-only labeling retained on every surface?',
    'No clinical/EHR claims slipped into GPT profile?',
  ],
}

function hashContent(obj) {
  return createHash('sha256').update(JSON.stringify(obj)).digest('hex').slice(0, 16)
}

function assertClean(text) {
  for (const bad of FORBIDDEN_SUBSTRINGS) {
    if (String(text).includes(bad)) {
      throw new Error(`Forbidden substring in Phase 7 pack: ${bad}`)
    }
  }
}

function keywordsFor(p) {
  const bag = new Set([
    ...(p.categories || []),
    ...(p.techCandidates || []),
    ...(p.integrations || []).map((i) => String(i).split(/[&,/]/)[0].trim()),
    p.primaryCategory,
    p.hasCaseStudy ? 'case-study' : 'engagement-summary',
    p.demoOnly ? 'demo-only' : 'delivery',
  ].filter(Boolean))
  return [...bag].map((k) => String(k).toLowerCase()).slice(0, 24)
}

function referenceHints(p) {
  const title = p.title
  const hints = [
    `On a similar ${p.primaryCategory || 'engineering'} brief, I led ${title} — focusing on ${(p.responsibilities || [])[0] || 'delivery ownership'}.`,
    `Relevant stack overlap: ${(p.techCandidates || []).slice(0, 4).join(', ') || 'see profile'}.`,
  ]
  if (p.demoOnly) {
    hints.push('Disclose clearly that this was an interactive sales demo with illustrative data, not a production clinical system.')
  }
  if (!(p.verifiedOutcomes || []).length) {
    hints.push('Do not invent metrics; describe qualitative delivery and responsibilities only.')
  }
  return hints
}

function challengesFrom(p) {
  if (Array.isArray(p.modules) && p.modules.length) {
    return p.modules.map((m) => `${m.title} (${m.status}): ${m.summary}`)
  }
  return [
    p.architectureSummary
      ? `Architecture constraint: ${p.architectureSummary.slice(0, 220)}…`
      : 'Confirm engineering challenges with founder before stronger claims.',
  ]
}

function gptSuitability(p) {
  const reasons = []
  let score = 0
  if (p.hasCaseStudy) {
    score += 40
    reasons.push('Full case study available')
  }
  if ((p.techCandidates || []).length >= 3) {
    score += 15
    reasons.push('Clear tech stack')
  }
  if ((p.responsibilities || []).length >= 3) {
    score += 15
    reasons.push('Concrete responsibilities')
  }
  if ((p.integrations || []).length) {
    score += 10
    reasons.push('Named integrations')
  }
  if (p.demoOnly) {
    score -= 20
    reasons.push('Demo-only — GPT use only with explicit disclosure')
  }
  if (!(p.verifiedOutcomes || []).length) {
    score -= 5
    reasons.push('No numeric verified outcomes (qualitative only)')
  }
  if (p.conditional) {
    score -= 5
    reasons.push('Conditional publication row')
  }
  const rank = GPT_SHORTLIST_ORDER.indexOf(p.slug)
  if (rank >= 0) score += 25 - rank
  return {
    score,
    recommendation:
      score >= 70 ? 'review_first' : score >= 45 ? 'review_after_shortlist' : 'defer_or_enrich',
    reasons,
  }
}

function buildProfile(p) {
  const projectId = `ORX-${p.slug}`
  const body = {
    projectId,
    slug: p.slug,
    publicTitle: p.title,
    anonymizedDescription: p.subtitle || p.summary || '',
    category: p.primaryCategory || '',
    categories: p.categories || [],
    businessProblem: p.businessChallenge || p.summary || '',
    actualSolution: p.solution || '',
    engineeringResponsibilities: p.responsibilities || [],
    technologies: p.techCandidates || [],
    technologyRoles: p.technologyRoles || [],
    integrations: p.integrations || [],
    engineeringChallenges: challengesFrom(p),
    architectureSummary: p.architectureSummary || '',
    verifiedOutcomes: p.verifiedOutcomes || [],
    qualitativeOutcomes: p.qualitativeOutcomes || [],
    deliveryStatus: p.deliveryStatus || '',
    demoOnly: Boolean(p.demoOnly),
    hasCaseStudy: Boolean(p.hasCaseStudy),
    engagementLabel: p.engagementLabel || '',
    proposalKeywords: keywordsFor(p),
    howToReferenceNaturally: referenceHints(p),
    evidenceReferences: [
      {
        id: 'S-APPROVED',
        path: 'orchestrix-frontend/src/data/portfolioApprovedProjects.js',
        role: 'public_marketing_authority',
      },
      p.osRecordId
        ? { id: 'S-OS', ref: p.osRecordId, role: 'editorial_os_id_only' }
        : null,
      p.inventoryRef
        ? { id: 'S-INV', ref: p.inventoryRef, role: 'inventory_ref_only' }
        : null,
      {
        id: 'S-CASE-IMPROVED',
        path: `portfolio-knowledge/projects/${projectId}/case-study-improved.md`,
        role: 'local_editorial_draft',
        optional: !p.hasCaseStudy,
      },
    ].filter(Boolean),
    confidentialityRisks: [
      'Do not include client legal names or team UIDs',
      'Do not include commercial amounts or rates',
      'Do not include private feedback text',
      p.demoOnly ? 'Must remain labeled demo-only' : null,
    ].filter(Boolean),
    missingVerificationQuestions: VERIFICATION_BY_SLUG[p.slug] || [
      'Any founder-approved numeric outcomes?',
      'Screenshot / diagram rights?',
      'Integration naming still accurate?',
    ],
    gptExportSuitability: gptSuitability(p),
    publicationApproved: p.publicationApproved === true,
    gptExportApproved: false,
    provenance: {
      source: 'portfolioApprovedProjects.js',
      osRecordId: p.osRecordId || null,
      inventoryRef: p.inventoryRef || null,
      generatedBy: 'build-phase7-approval-packs.mjs',
    },
  }
  const contentVersion = hashContent({
    publicTitle: body.publicTitle,
    businessProblem: body.businessProblem,
    actualSolution: body.actualSolution,
    technologies: body.technologies,
    engineeringResponsibilities: body.engineeringResponsibilities,
    verifiedOutcomes: body.verifiedOutcomes,
    qualitativeOutcomes: body.qualitativeOutcomes,
  })
  body.contentVersion = contentVersion
  return body
}

function buildReview(profile) {
  return {
    projectId: profile.projectId,
    slug: profile.slug,
    publicTitle: profile.publicTitle,
    anonymizedDescription: profile.anonymizedDescription,
    verifiedTechnologies: profile.technologies,
    engineeringResponsibilities: profile.engineeringResponsibilities,
    verifiedOutcomes: profile.verifiedOutcomes,
    qualitativeOutcomesOnly: profile.qualitativeOutcomes,
    evidenceReferences: profile.evidenceReferences,
    confidentialityRisks: profile.confidentialityRisks,
    gptExportSuitability: profile.gptExportSuitability,
    missingVerificationQuestions: profile.missingVerificationQuestions,
    contentVersion: profile.contentVersion,
    recommendedAction:
      profile.gptExportSuitability.recommendation === 'review_first'
        ? 'Founder review for GPT export (do not auto-approve)'
        : profile.gptExportSuitability.recommendation === 'review_after_shortlist'
          ? 'Queue after shortlist'
          : 'Enrich evidence before GPT review',
    gates: {
      publicationApproved: profile.publicationApproved,
      gptExportApproved: false,
      note: 'Website approval does not authorize GPT upload',
    },
  }
}

function contractLinkSuggestions(projects) {
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    rule: 'Suggestions only. Never auto-link on similar names. Manual confirmation required. No client PII in this file.',
    preserveCounts: { marketingProjects: 34, privateContracts: 143 },
    suggestions: projects.map((p) => {
      const criteria = []
      if (p.osRecordId) criteria.push({ type: 'osRecordId', value: p.osRecordId })
      if (p.inventoryRef) criteria.push({ type: 'inventoryRef', value: p.inventoryRef })
      criteria.push({
        type: 'staff_title_keyword_search',
        value: (p.title || '').split(/[–—,:]/)[0].trim().slice(0, 48),
        note: 'Search staff contracts by keyword; confirm manually',
      })
      if ((p.techCandidates || []).length) {
        criteria.push({
          type: 'skills_overlap_hint',
          value: p.techCandidates.slice(0, 5),
          note: 'Weak signal only — insufficient alone to link',
        })
      }
      return {
        marketingProjectId: `ORX-${p.slug}`,
        marketingSlug: p.slug,
        matchCriteria: criteria,
        confidence: p.osRecordId || p.inventoryRef ? 'medium_pending_staff_confirm' : 'low_keyword_only',
        requiresManualConfirmation: true,
        autoLinkForbidden: true,
        proposedContractIds: [],
        staffLookupHint:
          'Open /staff → Contracts, search keywords/skills, then Link selected contract on Editorial project after human review.',
      }
    }),
  }
}

function main() {
  mkdirSync(reviewsDir, { recursive: true })
  mkdirSync(profilesDir, { recursive: true })

  const profiles = APPROVED_PUBLIC_PROJECTS.map(buildProfile)
  const reviews = profiles.map(buildReview)

  for (const profile of profiles) {
    assertClean(JSON.stringify(profile))
    writeFileSync(join(profilesDir, `${profile.projectId}.json`), JSON.stringify(profile, null, 2))
    writeFileSync(
      join(profilesDir, `${profile.projectId}.md`),
      [
        `# ${profile.publicTitle}`,
        '',
        `ID: \`${profile.projectId}\` · contentVersion: \`${profile.contentVersion}\``,
        `GPT export approved: **false** (default)`,
        '',
        `## Category`,
        profile.category,
        '',
        `## Business problem`,
        profile.businessProblem,
        '',
        `## Actual solution`,
        profile.actualSolution,
        '',
        `## Technologies`,
        profile.technologies.map((t) => `- ${t}`).join('\n') || '- (none listed)',
        '',
        `## Integrations`,
        profile.integrations.map((t) => `- ${t}`).join('\n') || '- (none listed)',
        '',
        `## Responsibilities`,
        profile.engineeringResponsibilities.map((t) => `- ${t}`).join('\n'),
        '',
        `## Engineering challenges`,
        profile.engineeringChallenges.map((t) => `- ${t}`).join('\n'),
        '',
        `## Verified delivery`,
        `Verified outcomes: ${profile.verifiedOutcomes.length ? profile.verifiedOutcomes.join('; ') : 'none approved'}`,
        '',
        `Qualitative:`,
        ...profile.qualitativeOutcomes.map((t) => `- ${t}`),
        '',
        `## Proposal keywords`,
        profile.proposalKeywords.join(', '),
        '',
        `## How to reference`,
        ...profile.howToReferenceNaturally.map((t) => `- ${t}`),
        '',
        `## Missing verification`,
        ...profile.missingVerificationQuestions.map((t) => `- ${t}`),
        '',
      ].join('\n')
    )
  }

  for (const review of reviews) {
    writeFileSync(join(reviewsDir, `${review.projectId}.json`), JSON.stringify(review, null, 2))
  }

  const shortlist = GPT_SHORTLIST_ORDER.map((slug, i) => {
    const profile = profiles.find((p) => p.slug === slug)
    return {
      rank: i + 1,
      projectId: profile.projectId,
      slug,
      publicTitle: profile.publicTitle,
      suitabilityScore: profile.gptExportSuitability.score,
      reasons: profile.gptExportSuitability.reasons,
      contentVersion: profile.contentVersion,
      gptExportApproved: false,
    }
  })

  writeFileSync(
    join(outRoot, 'GPT_APPROVAL_SHORTLIST.md'),
    [
      '# Ranked GPT approval shortlist (Phase 7)',
      '',
      'Do **not** auto-set `gptExportApproved=true`. Review in staff GPT tab or flip manifest + registry deliberately.',
      '',
      '| Rank | Project | Score | Why first |',
      '|-----:|---------|------:|-----------|',
      ...shortlist.map(
        (s) =>
          `| ${s.rank} | \`${s.slug}\` — ${s.publicTitle} | ${s.suitabilityScore} | ${s.reasons.slice(0, 2).join('; ')} |`
      ),
      '',
      '## Defer from first GPT batch',
      '- `healthcare-ops-sales-demo` — demo-only; only after explicit disclosure rules',
      '- Card-only scrapers without case studies — enrich first',
      '',
    ].join('\n')
  )
  writeFileSync(join(outRoot, 'gpt-approval-shortlist.json'), JSON.stringify({ shortlist }, null, 2))

  writeFileSync(
    join(outRoot, 'contract-link-suggestions.json'),
    JSON.stringify(contractLinkSuggestions(APPROVED_PUBLIC_PROJECTS), null, 2)
  )

  const checklist = {
    schemaVersion: 1,
    projects: reviews.map((r) => ({
      projectId: r.projectId,
      slug: r.slug,
      contentVersion: r.contentVersion,
      verifiedOutcomesCount: (r.verifiedOutcomes || []).length,
      missingQuestions: r.missingVerificationQuestions,
      gptSuitability: r.gptExportSuitability.recommendation,
      evidenceOk: (r.evidenceReferences || []).some((e) => e.id === 'S-APPROVED'),
    })),
  }
  writeFileSync(join(outRoot, 'evidence-verification-checklist.json'), JSON.stringify(checklist, null, 2))
  writeFileSync(
    join(outRoot, 'EVIDENCE_VERIFICATION_CHECKLIST.md'),
    [
      '# Evidence & verification checklist',
      '',
      '| Project | Verified outcomes | GPT suitability | Open questions |',
      '|---------|------------------:|-----------------|----------------|',
      ...checklist.projects.map(
        (p) =>
          `| \`${p.slug}\` | ${p.verifiedOutcomesCount} | ${p.gptSuitability} | ${p.missingQuestions.length} |`
      ),
      '',
    ].join('\n')
  )

  // Local approval registry — all false, tracks content versions for stale detection
  const registry = {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    rule: 'gptExportApproved defaults false; edits changing contentVersion require re-review',
    projects: profiles.map((p) => ({
      projectId: p.projectId,
      slug: p.slug,
      contentVersion: p.contentVersion,
      gptExportApproved: false,
      approvedContentVersion: null,
      approvedAt: null,
      approvedBy: null,
      stale: false,
    })),
  }
  writeFileSync(join(outRoot, 'gpt-approval-registry.json'), JSON.stringify(registry, null, 2))

  // Index for staff UI / exporter enrichment
  writeFileSync(
    join(outRoot, 'gpt-profiles-index.json'),
    JSON.stringify(
      {
        schemaVersion: 1,
        count: profiles.length,
        profiles: profiles.map((p) => ({
          projectId: p.projectId,
          slug: p.slug,
          publicTitle: p.publicTitle,
          contentVersion: p.contentVersion,
          hasCaseStudy: p.hasCaseStudy,
          demoOnly: p.demoOnly,
          suitability: p.gptExportSuitability.recommendation,
          score: p.gptExportSuitability.score,
        })),
      },
      null,
      2
    )
  )

  const manifestPath = join(knowledge, 'publication-manifest.json')
  if (existsSync(manifestPath)) {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    const flipped = (manifest.projects || []).filter((p) => p.gptExportApproved === true)
    if (flipped.length) {
      console.warn('WARNING: publication-manifest has gptExportApproved=true rows — Phase 7 did not change them.')
    }
  }

  console.log(
    JSON.stringify(
      {
        profiles: profiles.length,
        reviews: reviews.length,
        shortlist: shortlist.length,
        outRoot,
        gptExportApprovedStill: 0,
      },
      null,
      2
    )
  )
}

main()
