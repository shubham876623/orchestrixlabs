/** Publication-approved projects shipped in approved_public builds. */
export const APPROVED_PUBLIC_PROJECTS = [
  {
    "id": "prj-2026-005",
    "slug": "ai-estimating-field-ops",
    "title": "AI-Powered Estimating, CRM & Operations Automation",
    "subtitle": "Connecting AI-assisted estimating, CRM workflows, financial administration, and field operations for an Australian service business.",
    "primaryCategory": "AI Agents",
    "categories": [
      "AI Agents",
      "Automation",
      "CRM Integrations",
      "Full-Stack Development"
    ],
    "summary": "As Technical Lead on a long-term freelance engagement, I developed and maintained AI-assisted estimating, GoHighLevel CRM integrations, AroFlo workflow automation, and human-reviewed invoice processing for an Australian field-service business. The work spanned interconnected applications, middleware services, operational improvements, and ongoing backend engineering.",
    "businessChallenge": "The business needed one reliable path from inquiry to quote to administration — connecting CRM ownership, estimating, AroFlo quoting, and invoice handling without unsupervised Xero posting or disconnected tools.",
    "solution": "Delivered work centers on AI-assisted estimating (scope, quantities, human review, and AroFlo push) and operational GoHighLevel CRM integrations (opportunities, inspections, pipeline updates, and quote-status sync). Accounts workflows add Gmail invoice intake, matching, duplicate checks, and review before AroFlo bill push, with staff-controlled Xero send. Existing GoHighLevel pipeline/reporting supports day-to-day CRM visibility and is separate from a newer estimating dashboard that remains under local/partial development. The broader Operations Agent remains partial/planned. Backend services, middleware, and Render-hosted components continue as live/ongoing engineering — not presented as one fully deployed six-module product.",
    "responsibilities": [
      "Technical Lead ownership of architecture, delivery, and production troubleshooting",
      "GoHighLevel pipelines, workflows, webhooks, and custom-menu embeds",
      "AI estimating workspace with human review before AroFlo writes",
      "CRM ↔ AroFlo quote create/status synchronization",
      "Gmail invoice automation with review gates and AroFlo bill push",
      "Backend services on Render, Playwright-assisted ERP office flows where APIs were incomplete"
    ],
    "features": [
      "AI-assisted estimating: quote descriptions, quantities, human review, and AroFlo push",
      "GoHighLevel opportunity workflows, lead-source handling, site-inspection handoffs, and pipeline updates",
      "Quote-status synchronization between GoHighLevel and AroFlo",
      "Existing GoHighLevel pipeline/reporting for CRM operations (separate from the newer estimating dashboard)",
      "Gmail invoice processing with supplier matching, duplicate protection, multi-job invoices, and PO/bill matching",
      "Invoice review/approval with AroFlo bill push — Xero send remains staff-controlled",
      "Backend integrations, Playwright-assisted ERP office automation, and Render-hosted services"
    ],
    "featuresNote": "",
    "modules": [
      {
        "id": "A",
        "title": "AI Estimating Agent",
        "status": "Live",
        "summary": "Live estimating used in real workflows: scope generation, quantities, human review, and AroFlo integration."
      },
      {
        "id": "B",
        "title": "GoHighLevel CRM Automation",
        "status": "Live / Partial",
        "summary": "Opportunity workflows, inspections, pipeline updates, quote-status sync, and existing CRM pipeline/reporting. Not every messaging journey is claimed active."
      },
      {
        "id": "C",
        "title": "Accounts & Invoice Automation",
        "status": "Live / Partial",
        "summary": "Gmail invoice intake, supplier matching, duplicate protection, multi-job invoices, PO/bill matching, review, and AroFlo bill push — without autonomous Xero posting."
      },
      {
        "id": "D",
        "title": "Operations Agent",
        "status": "Partial / Planned",
        "summary": "Broader field-operations agent is not claimed as fully deployed. Evidence-supported PO/bill automation is documented under Accounts."
      },
      {
        "id": "E",
        "title": "Estimating Dashboard",
        "status": "Local / Partial",
        "summary": "Newer estimating dashboard architecture and reporting views remain local/partial — not claimed as a complete production deployment. Existing GHL pipeline reporting stays with CRM."
      },
      {
        "id": "F",
        "title": "Backend Engineering & Reliability",
        "status": "Live / Ongoing",
        "summary": "Python/FastAPI and Node middleware, React apps, Playwright ERP assistance, Gmail integrations, Render hosting, and production troubleshooting."
      }
    ],
    "techCandidates": [
      "GoHighLevel",
      "AroFlo",
      "Xero",
      "Python",
      "FastAPI",
      "Node.js",
      "React",
      "Vite",
      "OpenAI",
      "Playwright",
      "Gmail API",
      "Render",
      "SQLite"
    ],
    "technologyRoles": [
      "GoHighLevel — CRM pipelines, workflows, webhooks, and reporting embeds",
      "AroFlo — field-service ERP quoting and bill workflows",
      "Xero — staff-controlled accounting send only (not autonomous posting)",
      "Python / FastAPI / Node.js — middleware and backend services",
      "React / Vite — estimating and accounts application interfaces",
      "OpenAI — AI-assisted estimating generation support",
      "Playwright — ERP office automation where API write paths were incomplete",
      "Gmail API — invoice email intake",
      "Render — hosting for confirmed service components",
      "SQLite — application data store for relevant services"
    ],
    "techPendingVerification": false,
    "integrations": [
      "GoHighLevel workflows & webhooks",
      "AroFlo API / Office automation",
      "Gmail",
      "Website form capture",
      "GoHighLevel Conversations SMS"
    ],
    "integrationsNote": "Financial workflows include human review and approval. Autonomous posting to Xero is not claimed.",
    "architectureSummary": "Active path: inquiries create GoHighLevel opportunities with staff notification; inspection/quoting stages can trigger middleware that creates or updates AroFlo quotes and writes quote identity back to the CRM; estimators use AI-assisted scope generation with human review before AroFlo push; quote status synchronizes for pipeline truth; supplier invoices enter a Gmail-driven review queue and approved bills push to AroFlo, while Xero send stays staff-controlled. Existing GoHighLevel pipeline/reporting supports CRM operations. Local/partial: newer estimating dashboard architecture and views are under development and are not claimed as a complete production deployment. Partial/planned: broader Operations Agent capabilities beyond accounts PO/bill automation. Hosting references are limited to Render for confirmed components.",
    "qualitativeOutcomes": [
      "Streamlined quote preparation through AI-assisted scope generation and review.",
      "Connected CRM opportunity workflows with AroFlo estimating and quote administration.",
      "Added invoice matching, duplicate checks, and review controls to accounts workflows.",
      "Developed backend integrations and reliability improvements supporting ongoing business operations."
    ],
    "outcomesNote": "Qualitative engineering descriptions only. No percentages, time savings, financial results, or reliability benchmarks.",
    "verifiedOutcomes": [],
    "images": [],
    "coverTone": "automation",
    "engagementType": "freelance_client",
    "engagementLabel": "Technical Lead / Full-Stack & AI Automation Engineer (Freelance)",
    "relatedSlugs": [],
    "featured": true,
    "flagshipRank": 1,
    "verificationStatus": "published",
    "publicationApproved": true,
    "conditional": false,
    "osRecordId": "PRJ-2026-005"
  }
]
