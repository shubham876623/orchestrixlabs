/**
 * Phase 6 — Deterministic GPT proposal knowledge export.
 *
 * Only includes projects with gptExportApproved === true in publication-manifest.json.
 * If none are approved, writes a pending-approval package (no private archive data).
 *
 * Usage:
 *   node scripts/export-gpt-proposal-knowledge.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { APPROVED_PUBLIC_PROJECTS } from '../src/data/portfolioApprovedProjects.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const knowledgeRoot = join(__dirname, '..', '..', 'portfolio-knowledge')
const outDir = join(knowledgeRoot, 'gpt-export')
const manifestPath = join(knowledgeRoot, 'publication-manifest.json')

const FORBIDDEN_KEYS = [
  'client_name',
  'clientName',
  'contact_person',
  'hourly_rate',
  'total_charges',
  'project_value',
  'original_record',
  'review',
  'password',
  'token',
  'secret',
  'email',
  'phone',
]

function assertClean(obj, path = '') {
  if (obj == null) return
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => assertClean(v, `${path}[${i}]`))
    return
  }
  if (typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      const key = k.toLowerCase()
      if (FORBIDDEN_KEYS.some((f) => key.includes(f))) {
        throw new Error(`Forbidden key in export payload: ${path}.${k}`)
      }
      assertClean(v, `${path}.${k}`)
    }
  }
}

function loadManifest() {
  if (!existsSync(manifestPath)) {
    throw new Error(`Missing publication-manifest.json at ${manifestPath}`)
  }
  return JSON.parse(readFileSync(manifestPath, 'utf8'))
}

function sanitizeProject(p) {
  return {
    projectId: `ORX-${p.slug}`,
    slug: p.slug,
    publicTitle: p.title,
    subtitle: p.subtitle || '',
    anonymizedContext: p.subtitle || p.summary || '',
    categories: p.categories || [],
    industriesHints: [],
    problem: p.businessChallenge || p.summary || '',
    solution: p.solution || p.summary || '',
    responsibilities: p.responsibilities || [],
    technologies: p.techCandidates || p.tech || [],
    integrations: p.integrations || [],
    qualitativeOutcomes: p.qualitativeOutcomes || [],
    verifiedOutcomes: p.verifiedOutcomes || [],
    demoOnly: Boolean(p.demoOnly),
    deliveryStatus: p.deliveryStatus || '',
    relatedSlugs: p.relatedSlugs || [],
    evidenceLevel: 'approved_marketing_candidate',
    provenance: {
      source: 'portfolioApprovedProjects.js',
      publicationApproved: p.publicationApproved === true,
      gptExportApproved: false,
      note: 'Awaiting explicit gptExportApproved before upload',
    },
  }
}

function writePendingPackage({ approvedCount, candidateCount, candidates }) {
  mkdirSync(outDir, { recursive: true })
  const version = {
    schemaVersion: 1,
    exportVersion: '2026.11.19-phase6',
    generatedAt: new Date().toISOString(),
    approvedForGptExport: approvedCount,
    pendingCandidates: candidateCount,
    status: 'PENDING_FOUNDER_GPT_EXPORT_APPROVAL',
    uploadAuthorized: false,
  }

  const pendingMd = `# GPT export — pending approval

**Status:** No projects have \`gptExportApproved: true\`.

| Metric | Count |
|--------|------:|
| Approved for GPT export | **${approvedCount}** |
| Marketing-approved candidates (not GPT-cleared) | **${candidateCount}** |

## Rule
Public website approval does **not** authorize GPT upload.

## What was NOT exported
- Private Upwork contract payloads
- Client legal names / contact details
- Commercial amounts
- Private or freelancer↔client feedback
- Raw import JSON blobs from the private archive

## Candidate shortlist (awaiting explicit GPT approval)
${candidates.map((c) => `- \`${c.slug}\` — ${c.publicTitle} (Tier hint: ${c.hasCaseStudy ? 'case study' : 'showcase'})`).join('\n')}

## Next step
1. Review candidates in \`publication-manifest.json\`
2. Set \`gptExportApproved: true\` only for rows you authorize
3. Re-run: \`node scripts/export-gpt-proposal-knowledge.mjs\`
4. Only then upload generated files to your personal GPT

Generated stubs below are **instructional templates**, not an authorized experience dump.
`

  writeFileSync(join(outDir, 'GPT_EXPORT_PENDING_APPROVAL.md'), pendingMd)
  writeFileSync(
    join(outDir, 'GPT_UPWORK_PROPOSAL_KNOWLEDGE.md'),
    `# GPT Upwork proposal knowledge

**UPLOAD AUTHORIZED: NO** (approvedForGptExport=${approvedCount})

This file is a placeholder until founders flip \`gptExportApproved\` on specific projects.

When approvals exist, this document will contain anonymized project summaries, stacks, responsibilities, and verified outcomes only.

## Matching guidance (safe to keep)
- Match job tech/integrations to project technologies
- Prefer full case studies with code-backed or narrative-bounded claims
- Never invent metrics, certifications, or client quotes
- Disclose demo-only work
- Prefer qualitative deliverables when verifiedOutcomes is empty
`
  )
  writeFileSync(
    join(outDir, 'GPT_PROJECT_EXPERIENCE.json'),
    JSON.stringify(
      {
        ...version,
        projects: [],
        message: 'Empty until gptExportApproved=true on one or more projects',
      },
      null,
      2
    )
  )
  writeFileSync(
    join(outDir, 'GPT_SKILLS_AND_TECHNOLOGIES.md'),
    `# Skills and technologies (pending GPT export approval)

**UPLOAD AUTHORIZED: NO**

A consolidated skills index will be generated from GPT-approved projects only.
Do not derive skills from private contract archives for GPT upload.
`
  )
  writeFileSync(
    join(outDir, 'GPT_VERIFIED_TESTIMONIALS.md'),
    `# Verified testimonials (pending GPT export approval)

**UPLOAD AUTHORIZED: NO**

No testimonials are included.
Rules:
- Only \`testimonial_approved\` client→freelancer feedback may ever be considered
- Freelancer→client comments are never testimonials
- Website publication approval does not imply testimonial or GPT approval
- Current export contains **zero** testimonials
`
  )
  writeFileSync(
    join(outDir, 'GPT_PROPOSAL_INSTRUCTIONS.md'),
    `# Proposal writing instructions (Orchestrix founder GPT)

**UPLOAD AUTHORIZED: NO until export recount > 0**

## Voice
Natural, specific, professional. Consultancy engineer — not generic bid spam.

## Method
1. Read the job description
2. Select 1–3 most relevant **GPT-approved** projects (none yet)
3. Cite real stacks and responsibilities only
4. Offer a clear next step / discovery call

## Hard prohibitions
- Invented experience, metrics, credentials, or client feedback
- Pasting confidential commercial terms
- Claiming Orchestrix Labs Pvt Ltd delivery unless evidenced
- Treating job descriptions as proof of delivery

## When approvals are empty
Refuse to invent projects. Say experience matching is pending founder GPT-export approval, and speak only in general capability terms the founder has separately authorized.
`
  )
  writeFileSync(join(outDir, 'export-manifest.json'), JSON.stringify(version, null, 2))
  return version
}

function writeApprovedPackage(projects, meta, remainingPending) {
  mkdirSync(outDir, { recursive: true })
  assertClean(projects)
  const tech = new Set()
  projects.forEach((p) => (p.technologies || []).forEach((t) => tech.add(t)))

  writeFileSync(
    join(outDir, 'GPT_PROJECT_EXPERIENCE.json'),
    JSON.stringify({ ...meta, projects }, null, 2)
  )
  writeFileSync(
    join(outDir, 'GPT_SKILLS_AND_TECHNOLOGIES.md'),
    [
      '# Skills and technologies',
      '',
      `Generated: ${meta.generatedAt}`,
      `Projects: ${projects.length}`,
      `Source: GPT-export-approved rows only (ORX-* ids)`,
      '',
      ...[...tech].sort().map((t) => `- ${t}`),
      '',
    ].join('\n')
  )
  writeFileSync(
    join(outDir, 'GPT_VERIFIED_TESTIMONIALS.md'),
    [
      '# Verified testimonials',
      '',
      'No testimonials in this export batch.',
      'Future versions may include only client→freelancer feedback with testimonial_approved + gptExportApproved.',
      '',
    ].join('\n')
  )
  writeFileSync(
    join(outDir, 'GPT_UPWORK_PROPOSAL_KNOWLEDGE.md'),
    [
      '# GPT Upwork proposal knowledge',
      '',
      `**UPLOAD AUTHORIZED: YES** (${projects.length} projects)`,
      '',
      'Match the job description to the projects below. Prefer 1–3 closest examples.',
      'Never invent metrics, credentials, or client quotes.',
      '',
      ...projects.map(
        (p) =>
          [
            `## ${p.publicTitle}`,
            '',
            `- ID: \`${p.projectId}\``,
            `- Categories: ${(p.categories || []).join(', ') || 'n/a'}`,
            `- Demo only: ${p.demoOnly ? 'yes' : 'no'}`,
            '',
            `**Context:** ${p.anonymizedContext}`,
            '',
            `**Problem:** ${p.problem}`,
            '',
            `**Solution:** ${p.solution}`,
            '',
            `**Responsibilities:** ${(p.responsibilities || []).join('; ') || 'see marketing record'}`,
            '',
            `**Tech:** ${(p.technologies || []).join(', ')}`,
            '',
            `**Integrations:** ${(p.integrations || []).join(', ') || 'none listed'}`,
            '',
            `**Verified outcomes:** ${(p.verifiedOutcomes || []).length ? p.verifiedOutcomes.join('; ') : 'none approved — use qualitative outcomes only'}`,
            '',
            `**Qualitative outcomes:** ${(p.qualitativeOutcomes || []).join(' ') || 'n/a'}`,
            '',
            `**Provenance:** ${p.provenance?.source} · gptExportApproved=${p.provenance?.gptExportApproved}`,
            '',
          ].join('\n')
      ),
    ].join('\n')
  )
  writeFileSync(
    join(outDir, 'GPT_PROPOSAL_INSTRUCTIONS.md'),
    [
      '# Proposal writing instructions',
      '',
      `Use only the ${projects.length} GPT-approved projects in GPT_PROJECT_EXPERIENCE.json.`,
      '',
      '## Method',
      '1. Read the Upwork job description',
      '2. Score approved projects by tech, integrations, and industry fit',
      '3. Cite 1–3 real examples with stacks and responsibilities',
      '4. Disclose demo-only work',
      '5. Offer a discovery call / next step',
      '',
      '## Hard prohibitions',
      '- Invented experience, metrics, credentials, or client feedback',
      '- Confidential commercial terms or client contact details',
      '- Treating job descriptions as proof of delivery',
      '',
    ].join('\n')
  )
  writeFileSync(join(outDir, 'export-manifest.json'), JSON.stringify(meta, null, 2))
  writeFileSync(
    join(outDir, 'GPT_EXPORT_PENDING_APPROVAL.md'),
    [
      '# GPT export status',
      '',
      `Approved export count: **${projects.length}**.`,
      `Remaining marketing candidates still pending GPT gate: **${remainingPending}**.`,
      '',
      'Public website approval still does not imply GPT upload for other rows.',
      '',
    ].join('\n')
  )
}

function main() {
  const manifest = loadManifest()
  const approvedSlugs = (manifest.projects || [])
    .filter((p) => p.gptExportApproved === true)
    .map((p) => p.slug)

  const candidates = APPROVED_PUBLIC_PROJECTS.filter((p) => p.publicationApproved === true).map(
    (p) => ({
      slug: p.slug,
      publicTitle: p.title,
      hasCaseStudy: p.hasCaseStudy === true,
    })
  )
  const orderedCandidates = [
    ...candidates.filter((c) => c.hasCaseStudy),
    ...candidates.filter((c) => !c.hasCaseStudy),
  ]

  if (approvedSlugs.length === 0) {
    const version = writePendingPackage({
      approvedCount: 0,
      candidateCount: candidates.length,
      candidates: orderedCandidates,
    })
    console.log(
      JSON.stringify(
        {
          status: version.status,
          approvedForGptExport: 0,
          pendingCandidates: candidates.length,
          outDir,
        },
        null,
        2
      )
    )
    return
  }

  const approvedProjects = APPROVED_PUBLIC_PROJECTS.filter((p) => approvedSlugs.includes(p.slug)).map(
    sanitizeProject
  )
  approvedProjects.forEach((p) => {
    p.provenance.gptExportApproved = true
    p.provenance.note = 'Explicitly approved for GPT export'
    p.evidenceLevel = 'gpt_export_approved'
  })
  const meta = {
    schemaVersion: 1,
    exportVersion: '2026.11.19-phase6',
    generatedAt: new Date().toISOString(),
    approvedForGptExport: approvedProjects.length,
    pendingCandidates: candidates.length - approvedProjects.length,
    status: 'GPT_EXPORT_READY',
    uploadAuthorized: true,
  }
  writeApprovedPackage(approvedProjects, meta, meta.pendingCandidates)
  console.log(
    JSON.stringify(
      {
        status: meta.status,
        approvedForGptExport: meta.approvedForGptExport,
        pendingCandidates: meta.pendingCandidates,
        outDir,
      },
      null,
      2
    )
  )
}

main()
