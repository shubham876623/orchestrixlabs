/** Publication-approved projects shipped in approved_public builds (34). */
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
    "summary": "AI-assisted estimating, GoHighLevel CRM integrations, AroFlo workflow automation, and human-reviewed invoice processing for field-service operations.",
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
      "React"
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
    "coverTone": "agents",
    "engagementType": "freelance_client",
    "engagementLabel": "Technical Lead / Full-Stack & AI Automation Engineer (Freelance)",
    "relatedSlugs": [
      "retail-flooring-automation-suite",
      "hubspot-voice-lead-qualification",
      "erp-bills-entry-automation"
    ],
    "featured": true,
    "flagshipRank": 1,
    "verificationStatus": "published",
    "publicationApproved": true,
    "conditional": false,
    "osRecordId": "PRJ-2026-005",
    "deliveryStatus": "Long-term engagement",
    "hasCaseStudy": true,
    "inventoryRef": "INV-020",
    "demoOnly": false
  },
  {
    "id": "prj-2026-001",
    "slug": "restaurant-voice-ordering",
    "title": "Multi-Tenant Restaurant Voice Ordering Platform",
    "subtitle": "Voice phone ordering connected to multi-tenant kitchen and staff operations.",
    "primaryCategory": "Voice AI",
    "categories": [
      "Voice AI",
      "SaaS Platforms",
      "Full-Stack Development"
    ],
    "summary": "Multi-tenant restaurant platform pairing SynthFlow voice intake with FastAPI operations for orders, printing, SMS, and an Expo self-service client.",
    "businessChallenge": "Restaurants needed phone orders captured accurately without relying only on counter staff, with kitchen-ready tickets and controls that work across more than one location.",
    "solution": "A voice-assisted ordering path connected to a multi-tenant FastAPI backend. SynthFlow webhooks deliver call events; orders are parsed into structured tickets, stored in Supabase, optionally printed via PrintNode, and can trigger Twilio SMS updates. Staff authenticate through JWT/API-key role controls. Customers can also order through an Expo/React Native self-service app. Public claims are limited to modules present in the local codebase.",
    "responsibilities": [
      "Implemented the FastAPI multi-tenant backend and order APIs",
      "Built SynthFlow webhook intake and OpenAI-assisted order/menu parsing services",
      "Implemented PrintNode receipt printing and Twilio SMS notification paths",
      "Implemented JWT/API-key authentication with four staff roles",
      "Built Expo/React Native self-service ordering screens"
    ],
    "features": [
      "SynthFlow webhook intake for inbound/completed voice-order events (implemented in code)",
      "AI-assisted order parsing into structured kitchen tickets (implemented in code)",
      "PrintNode thermal receipt printing with CJK-capable formatting path (implemented in code)",
      "Twilio SMS notification helpers (implemented in code)",
      "Multi-tenant data model with four roles: super admin, restaurant admin, KDS, front desk (implemented in code)",
      "Order APIs for kitchen/staff workflows with API-key or JWT auth (implemented in code)",
      "Expo self-service ordering client (menu, cart, checkout) (implemented in code)",
      "Menu PDF/text parsing helpers and translation assist services (implemented in code)",
      "Analytics API endpoints (implemented in code)"
    ],
    "deliveryStatus": "Active engagement",
    "techCandidates": [
      "Python",
      "FastAPI",
      "SynthFlow",
      "Twilio",
      "Supabase",
      "Expo"
    ],
    "techPendingVerification": false,
    "technologyRoles": [
      "FastAPI / Python — multi-tenant ordering backend (code)",
      "SynthFlow — voice webhook events (code)",
      "OpenAI — order/menu parsing and translation assist (code)",
      "Twilio — SMS notifications (code)",
      "PrintNode — cloud thermal printing (code)",
      "Supabase — persistence substrate (code)",
      "Expo / React Native / TypeScript — customer ordering client (code)"
    ],
    "integrations": [
      "SynthFlow webhooks",
      "Twilio SMS",
      "PrintNode",
      "OpenAI",
      "Supabase"
    ],
    "architectureSummary": "Inbound SynthFlow call event → webhook handlers identify restaurant/menu context → completed-order webhook → parse/normalize → persist order + items in Supabase → optional PrintNode print + Twilio SMS → staff consume order APIs with role-based auth; customers may place orders via the Expo client. Hosting topology is not asserted.",
    "qualitativeOutcomes": [
      "Phone orders can land as structured tickets instead of ad-hoc notes.",
      "Multi-location tenancy and four staff roles are modeled in the application.",
      "Printing and SMS paths exist for operational handoff."
    ],
    "verifiedOutcomes": [],
    "closingText": "Share your restaurant ordering constraints and target stack. We will respond with a practical delivery plan.",
    "closingCta": "Request Consultation",
    "images": [],
    "coverTone": "voice",
    "abstractVisual": "Dark teal abstract waveform over a kitchen-ticket grid — no product UI claimed",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [
      "hubspot-voice-lead-qualification",
      "twilio-outbound-call-center"
    ],
    "featured": true,
    "flagshipRank": 2,
    "verificationStatus": "published",
    "publicationApproved": true,
    "conditional": false,
    "osRecordId": "PRJ-2026-001",
    "inventoryRef": "INV-001",
    "demoOnly": false,
    "hasCaseStudy": true
  },
  {
    "id": "prj-2026-002",
    "slug": "hubspot-voice-lead-qualification",
    "title": "HubSpot + Voice AI Lead Qualification Pipeline",
    "subtitle": "Form-triggered SynthFlow voice qualification with HubSpot meeting and CRM logging.",
    "primaryCategory": "Voice AI",
    "categories": [
      "Voice AI",
      "CRM Integrations",
      "Automation"
    ],
    "summary": "HubSpot form events trigger SynthFlow voice qualification and meeting booking, with results logged back to the CRM for sales follow-up.",
    "businessChallenge": "Inbound form leads went cold when sales could not call immediately. The business needed faster first contact without losing CRM ownership of qualification and meetings.",
    "solution": "An event-driven pipeline scoped by the active engagement: HubSpot form submission triggers a SynthFlow.ai outbound qualification call, meeting booking uses HubSpot Meetings APIs, and call results are written back to HubSpot. Public copy reflects contract + portfolio narrative scope; local application source for this engagement was not available for line-by-line verification.",
    "responsibilities": [
      "Connected HubSpot form/webhook events to SynthFlow outbound calling",
      "Configured voice qualification flow for inbound leads",
      "Integrated HubSpot Meetings availability/booking into the post-call path",
      "Logged call outcomes back into HubSpot for sales visibility"
    ],
    "features": [
      "Form/webhook-triggered SynthFlow auto-call on lead submit (contract + narrative scope)",
      "Voice lead qualification conversation (narrative scope; script details client-specific)",
      "HubSpot Meetings booking after qualification (contract + narrative scope)",
      "Call result logging back to HubSpot (narrative scope)"
    ],
    "deliveryStatus": "Active engagement",
    "techCandidates": [
      "Python",
      "SynthFlow.ai",
      "HubSpot API",
      "Webhooks"
    ],
    "techPendingVerification": false,
    "technologyRoles": [
      "HubSpot API / Meetings API — lead events, booking, CRM logging (contract/narrative)",
      "SynthFlow.ai — outbound voice qualification (contract/narrative)",
      "Python / Webhooks — orchestration (narrative; exact service shape pending confirmation)"
    ],
    "integrations": [
      "HubSpot",
      "SynthFlow.ai"
    ],
    "architectureSummary": "HubSpot form submit → webhook/automation → SynthFlow outbound qualification call → meeting booked via HubSpot Meetings → call status/recording/transcript fields logged to HubSpot for human sales ownership. Autonomous deal-closing is not claimed.",
    "qualitativeOutcomes": [
      "Creates a systematic first-touch path for fresh inbound form leads.",
      "Keeps qualification and meeting outcomes inside HubSpot for sales follow-up."
    ],
    "verifiedOutcomes": [],
    "closingText": "Share your CRM and voice-qualification constraints. We will respond with a practical integration plan.",
    "closingCta": "Request Consultation",
    "images": [],
    "coverTone": "crm",
    "abstractVisual": "Abstract CRM node graph with a single voice waveform — no screenshots claimed",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [
      "restaurant-voice-ordering",
      "twilio-outbound-call-center"
    ],
    "featured": true,
    "flagshipRank": 3,
    "verificationStatus": "published",
    "publicationApproved": true,
    "conditional": false,
    "osRecordId": "PRJ-2026-002",
    "inventoryRef": "INV-002",
    "demoOnly": false,
    "hasCaseStudy": true
  },
  {
    "id": "prj-2026-003",
    "slug": "twilio-outbound-call-center",
    "title": "Twilio Outbound Call Center & Auto-Dialer",
    "subtitle": "Twilio-powered outbound dialing with campaign and operator control surfaces.",
    "primaryCategory": "Voice AI",
    "categories": [
      "Voice AI",
      "Full-Stack Development",
      "SaaS Platforms"
    ],
    "summary": "Outbound call-center platform built on Twilio Voice, with campaign controls and operator workflows for scalable dialing operations.",
    "businessChallenge": "Manual outbound dialing did not scale. The client needed programmable calling infrastructure with operational controls rather than ad-hoc softphone use.",
    "solution": "A Twilio Voice-centered outbound platform described across the active engagement and portfolio narrative: auto-dialer orchestration, agent/admin surfaces, and campaign/lead administration. Public copy does not assert compliance certification or incident-free production claims. No private local codebase was available for this verification pass.",
    "responsibilities": [
      "Built outbound call orchestration against Twilio Voice APIs",
      "Implemented application services for campaigns, leads, and dial state",
      "Delivered operator and administrative control surfaces for day-to-day dialing operations",
      "Applied dialing safeguards described in the engagement narrative (founder confirmation pending for exact shipped set)"
    ],
    "features": [
      "Twilio-based outbound dialing orchestration (contract + narrative scope)",
      "Campaign / lead administration surfaces (narrative scope)",
      "Operator-facing call workflow controls (narrative scope)",
      "REST-oriented campaign/lead management described in portfolio sources (narrative scope)"
    ],
    "deliveryStatus": "Active engagement",
    "techCandidates": [
      "Python",
      "FastAPI",
      "Twilio",
      "React",
      "PostgreSQL"
    ],
    "techPendingVerification": false,
    "technologyRoles": [
      "Twilio Voice — outbound call control (contract/narrative)",
      "Python / FastAPI — telephony API (narrative)",
      "React — operator/admin UI (narrative)",
      "PostgreSQL — operational persistence (narrative)"
    ],
    "integrations": [
      "Twilio Voice"
    ],
    "architectureSummary": "Campaign/lead configuration → dialer service places Twilio outbound calls → operator UI reflects call workflow → outcomes stored for operations review. Compliance and recording policies are confirmation-gated and not certified in this copy.",
    "qualitativeOutcomes": [
      "Moves outbound calling from purely manual dialing toward programmable campaign control.",
      "Gives operators a dedicated surface for outbound call workflows."
    ],
    "verifiedOutcomes": [],
    "closingText": "Share your outbound calling constraints and compliance requirements. We will respond with a practical telephony plan.",
    "closingCta": "Request Consultation",
    "images": [],
    "coverTone": "voice",
    "abstractVisual": "Abstract dialer rings on a dark ops console — no live UI claimed",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [
      "restaurant-voice-ordering",
      "hubspot-voice-lead-qualification"
    ],
    "featured": true,
    "flagshipRank": 4,
    "verificationStatus": "published",
    "publicationApproved": true,
    "conditional": false,
    "osRecordId": "PRJ-2026-003",
    "inventoryRef": "INV-005",
    "demoOnly": false,
    "hasCaseStudy": true
  },
  {
    "id": "prj-2026-004",
    "slug": "bilingual-hr-ai-assistant",
    "title": "Bilingual Multi-Agent HR Copilot (RAG)",
    "subtitle": "Arabic + English HR assistance grounded in organization documents and productivity connectors.",
    "primaryCategory": "AI Agents",
    "categories": [
      "AI Agents"
    ],
    "summary": "Bilingual HR assistant that answers from organization documents using retrieval-augmented generation and multi-agent task routing for policy and operations support.",
    "businessChallenge": "HR teams needed faster, consistent answers from internal policy material and help drafting routine artifacts without sending proprietary documents to unmanaged tools.",
    "solution": "A RAG-centered multi-agent assistant: specialized agents for policy drafting and organizational development tasks, grounded in indexed documents, with optional email/calendar/drive connectors for drafting and scheduling support.",
    "responsibilities": [
      "Designed retrieval-augmented answer flows over HR document corpora",
      "Structured multi-agent task routing for HR workflows",
      "Integrated productivity APIs for drafting and scheduling assistance (candidate set)",
      "Kept bilingual (Arabic/English) interaction as a first-class requirement"
    ],
    "features": [
      "RAG answers grounded in organization documents (narrative scope)",
      "Multi-agent task specialization for HR workflows (narrative scope)",
      "Bilingual Arabic + English interaction support (narrative scope)",
      "Document-oriented drafting assistance (narrative scope)"
    ],
    "deliveryStatus": "Completed engagement",
    "techCandidates": [
      "Python",
      "OpenAI GPT-4",
      "LangChain",
      "FAISS"
    ],
    "techPendingVerification": false,
    "technologyRoles": [
      "OpenAI GPT-4 — generation and agent reasoning (narrative)",
      "LangChain / FAISS — retrieval pipeline (narrative)"
    ],
    "integrations": [
      "Document RAG store (narrative)"
    ],
    "architectureSummary": "Documents indexed into a vector store → user query routed to specialized agents → answers grounded in retrieved context → optional connector actions for drafts/scheduling. No claim of unsupervised HR decision-making.",
    "qualitativeOutcomes": [
      "Reduced time spent searching internal HR policy material during routine questions.",
      "Provided a bilingual assistant pattern suitable for mixed-language HR operations."
    ],
    "verifiedOutcomes": [],
    "images": [],
    "coverTone": "agents",
    "abstractVisual": "Bilingual typographic abstract with soft document shards — no employee data shown",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [
      "hubspot-voice-lead-qualification",
      "healthcare-ops-sales-demo"
    ],
    "featured": true,
    "flagshipRank": 5,
    "verificationStatus": "published",
    "publicationApproved": true,
    "conditional": false,
    "osRecordId": "PRJ-2026-004",
    "inventoryRef": "INV-007",
    "demoOnly": false,
    "capabilities": [
      "Document-grounded RAG answers for HR policy questions",
      "Multi-agent task routing for HR workflows",
      "Bilingual Arabic and English interaction support"
    ],
    "hasCaseStudy": true
  },
  {
    "id": "prj-2026-006",
    "slug": "django-ecommerce-data-pipeline",
    "title": "Django E-commerce & Supplier Data Pipeline",
    "subtitle": "Supplier ingestion, catalog modeling, and REST APIs on a Django/PostgreSQL stack.",
    "primaryCategory": "Full-Stack Development",
    "categories": [
      "Full-Stack Development",
      "SaaS Platforms",
      "Data & Analytics"
    ],
    "summary": "Django/PostgreSQL catalog expansion with supplier scraping/ETL and REST APIs for structured product data.",
    "businessChallenge": "Supplier product data arrived in inconsistent formats. The business needed reliable ingestion into a maintainable commerce database with APIs the storefront could consume.",
    "solution": "Backend expansion on an existing Django e-commerce site: supplier scraping/ETL into cleaned product records, PostgreSQL modeling, admin extensions, and Django REST Framework APIs. Public copy follows the ended Django/DB engagement plus portfolio narrative; no private local codebase was available for line-by-line verification.",
    "responsibilities": [
      "Extended Django backend systems for supplier product ingestion",
      "Designed PostgreSQL structures for catalog storage",
      "Built scraping/ETL paths to clean and load supplier records",
      "Exposed catalog data through Django REST Framework APIs"
    ],
    "features": [
      "Supplier product ingestion into structured catalog records (contract + narrative scope)",
      "PostgreSQL-backed catalog modeling (narrative scope)",
      "Scrapy/BeautifulSoup supplier extraction where source sites required it (narrative scope)",
      "Celery-oriented ETL/validation path described in portfolio sources (narrative scope)",
      "Django REST Framework APIs for catalog consumers (narrative scope)",
      "Django admin extensions for catalog operations (narrative scope)"
    ],
    "deliveryStatus": "Completed engagement",
    "techCandidates": [
      "Python",
      "Django",
      "PostgreSQL",
      "Scrapy",
      "Celery",
      "DRF"
    ],
    "techPendingVerification": false,
    "technologyRoles": [
      "Django / DRF — commerce API and admin surface (narrative)",
      "PostgreSQL — catalog system of record (narrative)",
      "Scrapy / BeautifulSoup — supplier extraction (narrative)",
      "Celery — asynchronous pipeline jobs (narrative)"
    ],
    "integrations": [
      "Supplier web/data sources (anonymized)",
      "PostgreSQL"
    ],
    "architectureSummary": "Supplier sources → extract/transform jobs → normalized product tables in PostgreSQL → DRF APIs for storefront/admin consumers. Full storefront redesign is not claimed.",
    "qualitativeOutcomes": [
      "Moved supplier catalog updates toward structured, queryable database records.",
      "Reduced reliance on manual copy-paste product onboarding for recurring supplier feeds."
    ],
    "verifiedOutcomes": [],
    "closingText": "Share your catalog and supplier-feed constraints. We will respond with a practical data-pipeline plan.",
    "closingCta": "Request Consultation",
    "images": [],
    "coverTone": "fullstack",
    "abstractVisual": "Abstract pipeline belts feeding a catalog lattice — no storefront UI claimed",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [
      "legacy-desktop-to-flask",
      "ml-background-removal"
    ],
    "featured": true,
    "flagshipRank": 6,
    "verificationStatus": "published",
    "publicationApproved": true,
    "conditional": false,
    "osRecordId": "PRJ-2026-006",
    "inventoryRef": "INV-029",
    "demoOnly": false,
    "hasCaseStudy": true
  },
  {
    "id": "prj-2026-007",
    "slug": "legacy-desktop-to-flask",
    "title": "Legacy Desktop → Modern Flask Web Platform",
    "subtitle": "Rewriting a VBScript desktop business app into a maintainable browser-based platform.",
    "primaryCategory": "Full-Stack Development",
    "categories": [
      "Full-Stack Development"
    ],
    "summary": "Modernization that replaced a legacy VBScript desktop application with a maintainable Flask web platform and MySQL data migration.",
    "businessChallenge": "A critical desktop application was hard to maintain and difficult to access outside the original workstation environment. The client needed a browser-based replacement without losing core business workflows.",
    "solution": "A Flask web rewrite with MySQL persistence, replacing workstation-bound desktop forms with browser-accessible modules.",
    "responsibilities": [
      "Rewrote legacy VBScript workflows into Flask application modules",
      "Migrated data from the legacy database engine to MySQL",
      "Delivered a browser-accessible replacement for the desktop application"
    ],
    "features": [
      "Browser-accessible replacement for legacy desktop workflows",
      "MySQL-backed persistence after migration from the legacy store",
      "Maintainable Python/Flask application structure"
    ],
    "deliveryStatus": "Completed engagement",
    "techCandidates": [
      "Python",
      "Flask",
      "MySQL"
    ],
    "techPendingVerification": false,
    "technologyRoles": [
      "Flask / Python — web application (contract + narrative)",
      "MySQL — migrated system of record (narrative)"
    ],
    "integrations": [],
    "architectureSummary": "Users authenticate to Flask app → business modules replace desktop forms → MySQL stores operational data → external storage/payments called where the legacy process required them. Exact module inventory should be confirmed before publication.",
    "qualitativeOutcomes": [
      "Moved a workstation-bound desktop process onto a maintainable web stack.",
      "Improved access control posture with modern authentication options including MFA."
    ],
    "verifiedOutcomes": [],
    "images": [],
    "coverTone": "fullstack",
    "abstractVisual": "Desktop window dissolving into a clean web frame — abstract only",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [
      "django-ecommerce-data-pipeline",
      "ai-estimating-field-ops"
    ],
    "featured": true,
    "flagshipRank": 7,
    "verificationStatus": "published",
    "publicationApproved": true,
    "conditional": false,
    "osRecordId": "PRJ-2026-007",
    "inventoryRef": "INV-030",
    "demoOnly": false,
    "capabilities": [
      "VBScript desktop workflows rewritten as Flask web modules",
      "Legacy database migrated to MySQL",
      "Browser-accessible replacement for workstation-bound processes"
    ],
    "hasCaseStudy": true
  },
  {
    "id": "prj-2026-008",
    "slug": "ml-background-removal",
    "title": "Custom ML Background-Removal Pipeline",
    "subtitle": "Batch computer-vision processing for product-image background removal.",
    "primaryCategory": "Data & Analytics",
    "categories": [
      "Data & Analytics",
      "AI Agents"
    ],
    "summary": "Batch machine-learning pipeline for automated background removal on product imagery — built for offline processing rather than interactive editing.",
    "businessChallenge": "Manual masking of complex product photos did not scale. The client needed an offline/batch pipeline that could process irregular shapes with consistent exports.",
    "solution": "A Python CV/ML processing pipeline for segmentation and background removal with batch export, using the stack confirmed across primary portfolio sources.",
    "responsibilities": [
      "Implemented batch image processing pipeline in Python",
      "Configured segmentation/background-removal inference for product photos",
      "Produced exportable cleaned assets for downstream catalog use"
    ],
    "features": [
      "Batch background-removal processing for product image sets",
      "U-2-Net segmentation with OpenCV preprocessing and export",
      "Offline/batch orientation suitable for catalog preparation"
    ],
    "deliveryStatus": "Completed engagement",
    "techCandidates": [
      "Python",
      "PyTorch",
      "U-2-Net",
      "OpenCV"
    ],
    "techPendingVerification": false,
    "technologyRoles": [
      "Python — pipeline orchestration (narrative)",
      "PyTorch / U-2-Net — segmentation (named in both primary portfolio sources)",
      "OpenCV / Pillow — image I/O and export (projects.js; OpenCV also in DOCX)"
    ],
    "integrations": [],
    "architectureSummary": "Input image batch → preprocessing → segmentation/matting model → composited export. Exact model weights and training/finetune steps remain confirmation-gated.",
    "qualitativeOutcomes": [
      "Reduced reliance on fully manual masking for catalog image preparation.",
      "Enabled repeatable batch processing instead of one-off editor work."
    ],
    "verifiedOutcomes": [],
    "images": [],
    "coverTone": "ml",
    "abstractVisual": "Product silhouette lifting from a noisy background field — abstract, no real SKUs",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [
      "django-ecommerce-data-pipeline",
      "healthcare-ops-sales-demo"
    ],
    "featured": false,
    "flagshipRank": 8,
    "verificationStatus": "published",
    "publicationApproved": true,
    "conditional": false,
    "osRecordId": "PRJ-2026-008",
    "inventoryRef": "INV-013",
    "demoOnly": false,
    "capabilities": [
      "Batch background-removal processing for product image sets",
      "U-2-Net segmentation with OpenCV preprocessing and export",
      "Offline-oriented pipeline suitable for catalog preparation"
    ],
    "hasCaseStudy": true
  },
  {
    "id": "prj-2026-009",
    "slug": "healthcare-ops-sales-demo",
    "title": "Healthcare Operations — Interactive Sales Demo",
    "subtitle": "Interactive sales demo only — not a live healthcare operations platform.",
    "primaryCategory": "AI Agents",
    "categories": [
      "AI Agents",
      "SaaS Platforms"
    ],
    "summary": "Interactive React sales demo for a healthcare-operations narrative. KPIs are illustrative demo data — not a deployed clinical system.",
    "businessChallenge": "Sales conversations needed one clickable walkthrough of a connected healthcare-operations narrative instead of multiple disconnected prototypes.",
    "solution": "An interactive front-end sales demo (React/Vite) with a guided journey, human-review exception path, and demo-state KPI tiles. Explicitly illustrative data only. No live EHR, payer, or clinic production integrations.",
    "responsibilities": [
      "Built the interactive React demo application and routing",
      "Implemented demo-state-driven KPI storytelling with consistency checks",
      "Designed the human-review exception pause/continue narrative",
      "Packaged deployments for sales presentation environments"
    ],
    "features": [
      "Interactive sales-demo journey for prospect walkthroughs (demo only)",
      "Human-review exception path demonstrating staff oversight in the demo narrative",
      "Dashboard KPI panels driven by demo state (illustrative demo data only)",
      "Before/with comparison storytelling for sales conversations",
      "Simulated completion screen for demo narrative closure — not a live EHR"
    ],
    "deliveryStatus": "Interactive demo deliverable",
    "techCandidates": [
      "React",
      "Vite",
      "Tailwind CSS"
    ],
    "techPendingVerification": false,
    "technologyRoles": [
      "React / Vite — interactive demo UI",
      "React Context — demo KPI/journey state",
      "Vercel / Netlify — static/demo hosting",
      "Google Apps Script — related onboarding form tooling (adjacent deliverable)"
    ],
    "integrations": [],
    "architectureSummary": "Pure front-end demo: journey steps mutate DemoStateContext → KPI tiles update consistently → human-review gate can pause automation narrative → completion screen. Optional static hosting packages for sales sites. Adjacent onboarding forms are separate related tooling.",
    "qualitativeOutcomes": [
      "Gave sales teams one coherent walkthrough instead of multiple disconnected prototypes.",
      "Made human oversight visible in the automation story via the review exception path."
    ],
    "verifiedOutcomes": [],
    "images": [],
    "coverTone": "agents",
    "abstractVisual": "Clean clinical workflow ribbon with “illustrative data” marking — no PHI",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement (sales demo)",
    "relatedSlugs": [
      "bilingual-hr-ai-assistant",
      "retail-flooring-automation-suite"
    ],
    "featured": true,
    "flagshipRank": 9,
    "verificationStatus": "published",
    "publicationApproved": true,
    "conditional": true,
    "osRecordId": "PRJ-2026-009",
    "inventoryRef": "INV-006",
    "demoOnly": true,
    "hasCaseStudy": true
  },
  {
    "id": "prj-2026-010",
    "slug": "retail-flooring-automation-suite",
    "title": "Retail Flooring Automation Suite",
    "subtitle": "RAG support chatbot, local lead discovery, and executive sales-report generation for a flooring retailer.",
    "primaryCategory": "AI Agents",
    "categories": [
      "AI Agents",
      "CRM Integrations",
      "Data & Analytics",
      "Automation"
    ],
    "summary": "Automation suite for a retail flooring business: knowledge-grounded customer assistant with CRM lead capture, local lead discovery, and executive Excel reporting from sales exports.",
    "businessChallenge": "A regional flooring retailer needed faster enquiry handling, cleaner CRM lead intake from local markets, and repeatable sales reporting without analyst bottlenecks.",
    "solution": "Three coordinated tools: (1) RAG chatbot answering only from a verified knowledge base and creating CRM contacts for qualified leads, (2) Google Places–based lead discovery with deduplication into CRM, (3) Tkinter desktop report generator transforming RBOS exports into multi-sheet executive workbooks.",
    "responsibilities": [
      "Built RAG chatbot with embeddings/vector retrieval and CRM lead capture",
      "Implemented local Places lead scraper with deduplication into CRM",
      "Delivered desktop report-pack generator for non-technical staff",
      "Configured YAML-driven business rules to avoid hard-coded logic churn"
    ],
    "features": [
      "Knowledge-grounded chatbot that refuses invented pricing/policy answers",
      "Qualified lead capture into CRM with duplicate/conflict handling",
      "Local business discovery scraper with category targeting and Excel export",
      "CRM push with phone/company deduplication across runs",
      "Desktop GUI report pack generating multiple executive sales worksheets",
      "YAML configuration for mappings, buckets, and CRM settings"
    ],
    "deliveryStatus": "Suite engagement",
    "techCandidates": [
      "Python",
      "FastAPI",
      "OpenAI",
      "HubSpot API",
      "Pandas"
    ],
    "techPendingVerification": false,
    "technologyRoles": [
      "OpenAI embeddings + GPT-4o-mini — grounded chatbot answers",
      "ChromaDB / NumPy — vector retrieval modes",
      "HubSpot CRM API — contact create/dedupe",
      "Google Places API — local lead discovery",
      "Pandas / OpenPyXL — report pack generation",
      "Tkinter — staff-facing desktop GUI",
      "Vercel / EC2 — chatbot hosting options"
    ],
    "integrations": [
      "HubSpot CRM",
      "Google Places API",
      "OpenAI"
    ],
    "architectureSummary": "Chatbot: markdown KB → embeddings → retrieval → constrained answers → optional HubSpot contact create. Scraper: Places search → normalize/dedupe → Excel + HubSpot. Reports: RBOS export → YAML-mapped transforms → multi-sheet workbook via desktop GUI.",
    "qualitativeOutcomes": [
      "Gave staff a constrained AI assistant for common customer questions without inventing policy.",
      "Reduced manual CRM typing for newly discovered local leads.",
      "Enabled non-technical users to regenerate executive sales packs from raw exports."
    ],
    "verifiedOutcomes": [],
    "images": [],
    "coverTone": "automation",
    "abstractVisual": "Floor-plan grid with CRM nodes and report sheets — brand marks omitted",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [
      "healthcare-ops-sales-demo",
      "hubspot-voice-lead-qualification"
    ],
    "featured": true,
    "flagshipRank": 10,
    "verificationStatus": "published",
    "publicationApproved": true,
    "conditional": false,
    "osRecordId": "PRJ-2026-010",
    "inventoryRef": "INV-041",
    "demoOnly": false,
    "capabilities": [
      "Knowledge-grounded chatbot with CRM lead capture",
      "Local business lead discovery into CRM",
      "Executive Excel report generation from sales exports"
    ],
    "hasCaseStudy": true
  },
  {
    "id": "card-inv-037",
    "slug": "n8n-ai-email-assistant",
    "title": "AI Email Assistant (n8n + OpenAI)",
    "primaryCategory": "Automation",
    "categories": [
      "Automation",
      "AI Agents"
    ],
    "summary": "Workflow automation that summarizes inbound email, drafts replies, and logs outcomes to productivity tools.",
    "techCandidates": [
      "n8n",
      "OpenAI",
      "Google Sheets"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "automation",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-037",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-012",
    "slug": "ai-image-studio-platform",
    "title": "AI Image Studio Platform",
    "primaryCategory": "SaaS Platforms",
    "categories": [
      "SaaS Platforms",
      "AI Agents"
    ],
    "summary": "Full-stack AI image platform for custom model training, generation, and editing workflows used by product creative teams.",
    "techCandidates": [
      "Django",
      "React",
      "Replicate API",
      "PostgreSQL"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "ml",
    "demoOnly": false,
    "capabilities": [
      "Custom model training via hosted ML APIs",
      "Image generation and editing workflows",
      "Authenticated SaaS application with stored assets"
    ],
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-012",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-003",
    "slug": "executive-scheduling-voice-receptionist",
    "title": "AI Voice Receptionist for Executive Scheduling",
    "primaryCategory": "Voice AI",
    "categories": [
      "Voice AI",
      "CRM Integrations"
    ],
    "summary": "Voice receptionist for executive scheduling workflows with calendar booking and structured lead logging through a FastAPI backend.",
    "techCandidates": [
      "Retell.ai",
      "Twilio",
      "FastAPI"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "voice",
    "demoOnly": false,
    "capabilities": [
      "Voice receptionist for scheduling conversations",
      "Calendar booking support via function calling",
      "Structured lead and call logging"
    ],
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-003",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-044",
    "slug": "company-lead-scraper",
    "title": "Company Lead Data Collection Pipeline",
    "primaryCategory": "Data & Analytics",
    "categories": [
      "Data & Analytics"
    ],
    "summary": "Long-running data collection pipeline for company names, domains, and research fields used in B2B workflows.",
    "techCandidates": [
      "Python",
      "Scraping",
      "CSV/DB"
    ],
    "deliveryStatus": "Long engagement",
    "coverTone": "ml",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-044",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-022",
    "slug": "county-property-records-scraper",
    "title": "County Property Records Extraction",
    "primaryCategory": "Data & Analytics",
    "categories": [
      "Data & Analytics"
    ],
    "summary": "Structured extraction of county property records into clean datasets for downstream analysis.",
    "techCandidates": [
      "Python",
      "Selenium",
      "CSV/DB export"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "ml",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-022",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-024",
    "slug": "liveaboard-cruise-bigquery",
    "title": "Cruise Inventory Scraper + BigQuery",
    "primaryCategory": "Data & Analytics",
    "categories": [
      "Data & Analytics"
    ],
    "summary": "Scraping and warehouse loading pipeline for cruise inventory signals into BigQuery for analytics.",
    "techCandidates": [
      "Python",
      "BigQuery",
      "ETL"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "ml",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-024",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-038",
    "slug": "aspnet-data-entry-automation",
    "title": "Data Entry Automation for ASP.NET Systems",
    "primaryCategory": "Automation",
    "categories": [
      "Automation"
    ],
    "summary": "Browser automation that extracts invoice fields and injects them into secured internal ASP.NET applications.",
    "techCandidates": [
      "Selenium",
      "Zapier",
      "Python"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "automation",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-038",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-043",
    "slug": "dreambooth-finetune-pipeline",
    "title": "DreamBooth Fine-tuning Pipeline",
    "primaryCategory": "AI Agents",
    "categories": [
      "AI Agents",
      "Data & Analytics"
    ],
    "summary": "Automated fine-tuning pipeline for custom image models with batch generation controls.",
    "techCandidates": [
      "Python",
      "DreamBooth",
      "Stable Diffusion"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "ml",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-043",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-004",
    "slug": "emma-voice-receptionist",
    "title": "Emma — AI Voice Receptionist",
    "primaryCategory": "Voice AI",
    "categories": [
      "Voice AI"
    ],
    "summary": "Voice-powered receptionist handling inbound calls for property operations, with programmable telephony and conversational AI.",
    "techCandidates": [
      "Twilio",
      "GPT-4",
      "Python"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "voice",
    "demoOnly": false,
    "capabilities": [
      "Inbound voice receptionist flows",
      "Programmable telephony integration",
      "Conversational AI for property operations enquiries"
    ],
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-004",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-045",
    "slug": "enterprise-web-scraper",
    "title": "Enterprise Web Data Extraction",
    "primaryCategory": "Data & Analytics",
    "categories": [
      "Data & Analytics"
    ],
    "summary": "Complex extraction from dynamic, authenticated enterprise sites into structured datasets for operations teams.",
    "techCandidates": [
      "Python",
      "Selenium",
      "APIs"
    ],
    "deliveryStatus": "Long engagement",
    "coverTone": "ml",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-045",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-015",
    "slug": "epc-rating-vision-extraction",
    "title": "EPC Rating Extraction (Computer Vision)",
    "primaryCategory": "Data & Analytics",
    "categories": [
      "Data & Analytics"
    ],
    "summary": "Vision pipeline that extracts energy-performance certificate fields from document imagery into structured records.",
    "techCandidates": [
      "Python",
      "OpenCV",
      "OCR"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "ml",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-015",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-014",
    "slug": "erp-bills-entry-automation",
    "title": "ERP Bills Entry Automation",
    "primaryCategory": "Automation",
    "categories": [
      "Automation"
    ],
    "summary": "Automation that extracts bill data and posts structured entries into an ERP workflow, reducing manual transcription.",
    "techCandidates": [
      "Python",
      "OCR",
      "ERP APIs"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "automation",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-014",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-023",
    "slug": "google-maps-location-intelligence",
    "title": "Google Maps Location Intelligence",
    "primaryCategory": "Data & Analytics",
    "categories": [
      "Data & Analytics"
    ],
    "summary": "Location intelligence extraction for clinics and buildings within custom geographies using Places APIs and structured export.",
    "techCandidates": [
      "Python",
      "Google Places API"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "ml",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-023",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-032",
    "slug": "llm-query-platform",
    "title": "LLM Query Platform",
    "primaryCategory": "AI Agents",
    "categories": [
      "AI Agents",
      "SaaS Platforms"
    ],
    "summary": "Application layer for structured LLM querying with controlled prompts and operational guardrails.",
    "techCandidates": [
      "Python",
      "OpenAI",
      "FastAPI"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "agents",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-032",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-025",
    "slug": "mca-master-data-scraper",
    "title": "MCA Master Data Collection Pipeline",
    "primaryCategory": "Data & Analytics",
    "categories": [
      "Data & Analytics"
    ],
    "summary": "Automated collection of company master-data fields with resilient fetching and structured CSV export for research teams.",
    "techCandidates": [
      "Python",
      "Proxies",
      "CSV export"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "ml",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-025",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-048",
    "slug": "omnichannel-ai-support-bot",
    "title": "Omni-channel AI Support Bot",
    "primaryCategory": "AI Agents",
    "categories": [
      "AI Agents",
      "Automation"
    ],
    "summary": "Unified support assistant spanning web and messaging channels with escalation paths to human agents.",
    "techCandidates": [
      "Python",
      "GPT-4",
      "Messaging APIs"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "agents",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-048",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-009",
    "slug": "private-document-rag-assistant",
    "title": "Private Document Knowledge Assistant (RAG)",
    "primaryCategory": "AI Agents",
    "categories": [
      "AI Agents",
      "Data & Analytics"
    ],
    "summary": "Private retrieval assistant over approved documents with local vector search and grounded answers. Built for secure document Q&A — not a medical advice or diagnostic system.",
    "techCandidates": [
      "Python",
      "FAISS",
      "GPT-4",
      "FastAPI"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "agents",
    "demoOnly": false,
    "capabilities": [
      "Local vector search over uploaded documents",
      "Grounded answers from approved document context",
      "FastAPI-backed private assistant pattern"
    ],
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-009",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-046",
    "slug": "government-register-scraper",
    "title": "Public Register Data Extraction",
    "primaryCategory": "Data & Analytics",
    "categories": [
      "Data & Analytics"
    ],
    "summary": "Multi-source extraction from public registers into structured research datasets.",
    "techCandidates": [
      "Python",
      "Scraping",
      "ETL"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "ml",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-046",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-039",
    "slug": "pyspark-etl-pipeline",
    "title": "PySpark ETL Pipeline",
    "primaryCategory": "Data & Analytics",
    "categories": [
      "Data & Analytics"
    ],
    "summary": "Distributed ETL pipeline work in PySpark for transforming operational datasets into analytics-ready tables.",
    "techCandidates": [
      "PySpark",
      "Python",
      "Data warehouse"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "ml",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-039",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-034",
    "slug": "qualitative-data-analysis-platform",
    "title": "Qualitative Data Analysis Platform",
    "primaryCategory": "Data & Analytics",
    "categories": [
      "Data & Analytics",
      "Full-Stack Development"
    ],
    "summary": "Platform support for qualitative coding and analysis workflows with structured exports for research teams.",
    "techCandidates": [
      "Python",
      "NLP",
      "Web app"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "ml",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-034",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-033",
    "slug": "school-management-system",
    "title": "School Management System",
    "primaryCategory": "Full-Stack Development",
    "categories": [
      "Full-Stack Development",
      "SaaS Platforms"
    ],
    "summary": "Full-stack school operations software covering core administrative workflows for staff and records.",
    "techCandidates": [
      "Python",
      "Django",
      "PostgreSQL"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "fullstack",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-033",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-018",
    "slug": "tally-stock-automation",
    "title": "Tally ERP & Stock Automation",
    "primaryCategory": "Automation",
    "categories": [
      "Automation"
    ],
    "summary": "Stock and accounting automation around Tally ERP processes for faster operational updates.",
    "techCandidates": [
      "Python",
      "Tally",
      "Automation"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "automation",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-018",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-042",
    "slug": "text-to-cad-generator",
    "title": "Text-to-CAD AI Generator",
    "primaryCategory": "AI Agents",
    "categories": [
      "AI Agents"
    ],
    "summary": "AI-assisted generation path from natural-language descriptions toward CAD-oriented design outputs.",
    "techCandidates": [
      "Python",
      "GPT-4",
      "CAD APIs"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "agents",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-042",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  },
  {
    "id": "card-inv-021",
    "slug": "uk-property-intelligence-scraper",
    "title": "UK Property Intelligence Data Pipeline",
    "primaryCategory": "Data & Analytics",
    "categories": [
      "Data & Analytics"
    ],
    "summary": "Multi-source property intelligence pipeline collecting and normalizing listing and market signals for research workflows.",
    "techCandidates": [
      "Python",
      "Scrapy",
      "PostgreSQL"
    ],
    "deliveryStatus": "Completed engagement",
    "coverTone": "ml",
    "demoOnly": false,
    "featured": false,
    "flagshipRank": null,
    "hasCaseStudy": false,
    "publicationApproved": true,
    "verificationStatus": "published",
    "inventoryRef": "INV-021",
    "engagementType": "freelance_client",
    "engagementLabel": "Founder freelance engagement",
    "relatedSlugs": [],
    "images": [],
    "techPendingVerification": false
  }
]
