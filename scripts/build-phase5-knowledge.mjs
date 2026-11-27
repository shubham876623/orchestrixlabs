/**
 * Phase 5 — build Git-safe portfolio-knowledge library from approved marketing bundle only.
 * Does not read contracts.csv or print client PII.
 */
import { APPROVED_PUBLIC_PROJECTS } from '../src/data/portfolioApprovedProjects.js'
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', '..', 'portfolio-knowledge')

function ensureDir(p) {
  mkdirSync(p, { recursive: true })
}

const inv = JSON.parse(readFileSync(join(root, 'project-inventory.json'), 'utf8'))
ensureDir(join(root, 'projects'))
ensureDir(join(root, 'services'))
ensureDir(join(root, 'categories'))
ensureDir(join(root, 'proposal-knowledge'))
ensureDir(join(root, 'export-manifests'))

const evidence = { schemaVersion: 1, generatedAt: new Date().toISOString(), entries: [] }
const pubManifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  marketingApprovedCount: 34,
  indexableCaseStudies: 10,
  preserveExistingApprovals: true,
  autoPublish: false,
  projects: [],
}

for (const p of APPROVED_PUBLIC_PROJECTS) {
  const id = `ORX-${p.slug}`
  const dir = join(root, 'projects', id)
  ensureDir(dir)
  const invRow = inv.projects.find((x) => x.marketingSlug === p.slug)

  const projectJson = {
    internalProjectId: id,
    osRecordId: p.osRecordId || null,
    inventoryRef: p.inventoryRef || null,
    marketingSlug: p.slug,
    publicTitle: p.title,
    subtitle: p.subtitle || '',
    engagementType: p.engagementType || 'freelance_client',
    engagementLabel: p.engagementLabel || '',
    primaryCategoryLegacy: p.primaryCategory,
    categories: p.categories || [],
    taxonomy: {
      primary: invRow?.primaryCategory,
      secondary: invRow?.secondaryTags || [],
    },
    publicationApproved: p.publicationApproved === true,
    hasCaseStudy: p.hasCaseStudy === true,
    featured: Boolean(p.featured),
    flagshipRank: p.flagshipRank ?? null,
    demoOnly: Boolean(p.demoOnly),
    conditional: Boolean(p.conditional),
    deliveryStatus: p.deliveryStatus || '',
    techCandidates: p.techCandidates || [],
    technologyRoles: p.technologyRoles || [],
    integrations: p.integrations || [],
    relatedSlugs: p.relatedSlugs || [],
    modules: p.modules || [],
    ranking: invRow?.ranking,
    relatedContracts: [],
    sync: {
      editorialPortfolioSlug: p.slug,
      marketingBundle: 'portfolioApprovedProjects.js',
      neverOverwriteManualEditorial: true,
    },
  }
  writeFileSync(join(dir, 'project.json'), JSON.stringify(projectJson, null, 2))

  writeFileSync(
    join(dir, 'overview.md'),
    [
      `# ${p.title}`,
      '',
      `**Internal ID:** ${id}`,
      `**Marketing slug:** ${p.slug}`,
      `**Publication:** ${p.publicationApproved ? 'approved (preserve)' : 'not approved'}`,
      `**Case study depth:** ${p.hasCaseStudy ? 'Flagship (Tier A)' : 'Showcase (Tier B)'}`,
      '',
      '## Summary',
      '',
      p.summary || '',
      '',
      '## Positioning',
      '',
      p.subtitle || '',
      '',
      '## Delivery status',
      '',
      p.deliveryStatus || '—',
      '',
      '## Provenance',
      '',
      '- Source: orchestrix-frontend/src/data/portfolioApprovedProjects.js',
      p.osRecordId ? `- OS record: ${p.osRecordId}` : null,
      p.inventoryRef ? `- Inventory ref: ${p.inventoryRef}` : null,
      '',
    ]
      .filter((x) => x !== null)
      .join('\n')
  )

  const lines = []
  lines.push(`# Case study — ${p.title}`, '')
  lines.push(
    '> Editorial draft derived only from publication-approved marketing copy. No invented metrics. Not a new publication approval.',
    ''
  )
  lines.push('## 1. Project title and positioning', '', `**Title:** ${p.title}`)
  if (p.subtitle) lines.push(`**Positioning:** ${p.subtitle}`)
  lines.push('', '## 2. Industry and business context', '', p.subtitle || p.summary || '')
  lines.push('', '## 3. Problem or operational challenge', '', p.businessChallenge || p.summary || '_Not yet expanded for showcase-only projects._')
  lines.push('', '## 4. Solution overview', '', p.solution || p.summary || '_Showcase summary only._')
  lines.push('', '## 5. Engineering responsibilities', '')
  if ((p.responsibilities || []).length) p.responsibilities.forEach((r) => lines.push(`- ${r}`))
  else lines.push(p.engagementLabel || '_Not listed._')
  lines.push('', '## 6. System architecture', '', p.architectureSummary || '_Architecture narrative not published for this listing._')
  lines.push('', '## 7. Technology stack', '')
  ;(p.techCandidates || []).forEach((t) => lines.push(`- ${t}`))
  if ((p.technologyRoles || []).length) {
    lines.push('', '### Technology roles', '')
    p.technologyRoles.forEach((t) => lines.push(`- ${t}`))
  }
  lines.push('', '## 8. Important integrations', '')
  if ((p.integrations || []).length) p.integrations.forEach((t) => lines.push(`- ${t}`))
  else lines.push('_None listed._')
  if (p.integrationsNote) lines.push('', p.integrationsNote)
  lines.push('', '## 9. Implementation approach', '')
  if ((p.modules || []).length) {
    p.modules.forEach((m) => lines.push(`- **${m.id}. ${m.title}** (${m.status}): ${m.summary}`))
  } else if ((p.features || []).length) {
    p.features.forEach((f) => lines.push(`- ${f}`))
  } else lines.push(p.solution || p.summary || '_See overview._')
  lines.push(
    '',
    '## 10. Engineering challenges and decisions',
    '',
    p.techConflictNote ||
      p.featuresNote ||
      p.outcomesNote ||
      'Delivery boundaries are stated explicitly in the solution and module statuses where available. Unverified percentages and financial claims are withheld.'
  )
  lines.push('', '## 11. Verified or observed outcomes', '')
  if ((p.verifiedOutcomes || []).length) p.verifiedOutcomes.forEach((o) => lines.push(`- **Verified:** ${o}`))
  else if ((p.qualitativeOutcomes || []).length) {
    lines.push('Observed / qualitative (not independently quantified):', '')
    p.qualitativeOutcomes.forEach((o) => lines.push(`- ${o}`))
  } else lines.push('_No verified numeric outcomes approved. Do not invent metrics._')
  if (p.outcomesNote) lines.push('', `*${p.outcomesNote}*`)
  lines.push(
    '',
    '## 12. Client feedback',
    '',
    '_Not included unless testimonial_approved in the private editorial system. Freelancer-to-client comments are never public testimonials._',
    '',
    '## 13. Related projects',
    ''
  )
  if ((p.relatedSlugs || []).length) p.relatedSlugs.forEach((s) => lines.push(`- /portfolio/${s}`))
  else lines.push('_Related slugs not yet curated for this project._')
  lines.push(
    '',
    '## 14. Consultation CTA',
    '',
    p.closingCta || 'Discuss a Similar Project',
    '',
    `Suggested link: /contact?ref=${p.slug}`,
    ''
  )
  writeFileSync(join(dir, 'case-study.md'), lines.join('\n'))

  writeFileSync(
    join(dir, 'architecture.md'),
    [
      `# Architecture — ${p.title}`,
      '',
      p.architectureSummary || 'No architecture summary in approved marketing bundle.',
      '',
      '## Diagram status',
      '',
      '- Editable diagram source: **requested** (not fabricated)',
      '- Accuracy rule: diagrams must match verified implementation notes only',
      `- Asset placeholder: abstract cover tone \`${p.coverTone || 'default'}\``,
      '',
    ].join('\n')
  )

  writeFileSync(
    join(dir, 'evidence.md'),
    [
      `# Evidence — ${p.title}`,
      '',
      '| Claim area | Status | Notes |',
      '|---|---|---|',
      `| Marketing publication | ${p.publicationApproved ? 'Approved' : 'Not approved'} | Preserve existing gate |`,
      `| Case study page | ${p.hasCaseStudy ? 'Indexable full CS' : 'Card/summary only'} | |`,
      `| Verified numeric outcomes | ${(p.verifiedOutcomes || []).length ? 'Present' : 'Empty'} | Do not invent |`,
      `| Screenshots | ${(p.images || []).length ? 'Listed' : 'None approved'} | Placeholder / abstract cover only |`,
      `| Tech verification | ${p.techPendingVerification ? 'Pending' : 'Cleared in approved bundle'} | |`,
      `| Demo disclaimer | ${p.demoOnly ? 'Required' : 'N/A'} | |`,
      '',
      'Private Upwork archive may contain related contracts; raw contract payloads are **not** stored in this Git-safe library.',
      '',
    ].join('\n')
  )

  writeFileSync(
    join(dir, 'asset-manifest.json'),
    JSON.stringify(
      {
        internalProjectId: id,
        approvedImages: p.images || [],
        coverTone: p.coverTone || null,
        placeholders: (p.images || []).length
          ? []
          : [
              {
                type: 'abstract_cover',
                tone: p.coverTone || 'default',
                request: 'Authorized product screenshot if available',
              },
            ],
        forbidden: [
          'api_keys',
          'customer_pii',
          'internal_dashboards_with_live_data',
          'unapproved_client_logos',
        ],
      },
      null,
      2
    )
  )

  evidence.entries.push({
    projectId: id,
    slug: p.slug,
    sources: [
      {
        id: 'S-APPROVED',
        path: 'orchestrix-frontend/src/data/portfolioApprovedProjects.js',
        role: 'public_marketing_authority',
      },
      p.osRecordId
        ? {
            id: 'S-OS',
            path: '00_Company_Management/Portfolio_Knowledge/records',
            role: 'editorial_os',
            ref: p.osRecordId,
          }
        : null,
      {
        id: 'S-CONTRACT-ARCHIVE',
        path: 'private UpworkContract DB / out-of-git JSON',
        role: 'private_evidence_only',
        note: 'counts only in public docs',
      },
    ].filter(Boolean),
    verificationGaps: invRow?.editorialFlags?.incomplete || [],
    conflicts: invRow?.editorialFlags?.conflicts || [],
  })

  pubManifest.projects.push({
    slug: p.slug,
    internalProjectId: id,
    publicationApproved: true,
    indexableCaseStudy: p.hasCaseStudy === true,
    sitemapEligible: p.hasCaseStudy === true,
    gptExportApproved: false,
    websiteLive: true,
    notes: 'Existing approval preserved; GPT export requires separate gate',
  })
}

writeFileSync(join(root, 'evidence-register.json'), JSON.stringify(evidence, null, 2))
writeFileSync(join(root, 'publication-manifest.json'), JSON.stringify(pubManifest, null, 2))

const services = [
  { id: 'voice-ai', label: 'Voice AI & Chatbots', categoryIds: ['voice-ai'], projectSlugs: [] },
  {
    id: 'ml-ai',
    label: 'Machine Learning & AI',
    categoryIds: ['ai-agents-llm', 'document-ai'],
    projectSlugs: [],
  },
  {
    id: 'fullstack',
    label: 'Full-Stack Development',
    categoryIds: ['saas-fullstack', 'custom-backend'],
    projectSlugs: [],
  },
  {
    id: 'scraping',
    label: 'Web Scraping & Automation',
    categoryIds: ['data-web-automation'],
    projectSlugs: [],
  },
  {
    id: 'automation',
    label: 'Workflow Automation & Integration',
    categoryIds: ['bpa', 'crm-integrations'],
    projectSlugs: [],
  },
]
for (const s of services) {
  s.projectSlugs = inv.projects
    .filter(
      (p) =>
        s.categoryIds.includes(p.primaryCategory) ||
        p.secondaryTags.some((t) => s.categoryIds.includes(t))
    )
    .map((p) => p.marketingSlug)
  writeFileSync(join(root, 'services', `${s.id}.json`), JSON.stringify(s, null, 2))
}
writeFileSync(join(root, 'services', 'index.json'), JSON.stringify({ services }, null, 2))

const byCat = {}
for (const p of inv.projects) {
  byCat[p.primaryCategory] = byCat[p.primaryCategory] || []
  byCat[p.primaryCategory].push(p.marketingSlug)
}
writeFileSync(join(root, 'categories', 'index.json'), JSON.stringify({ byPrimaryCategory: byCat }, null, 2))

console.log('OK projects', APPROVED_PUBLIC_PROJECTS.length, 'root', root)
