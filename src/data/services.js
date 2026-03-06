export const services = [
  {
    id: 'voice-ai',
    icon: 'voice',
    title: 'Voice AI & Chatbots',
    tagline: 'Intelligent agents that talk, listen, and act',
    description:
      'We design and deploy production-grade voice AI systems and intelligent chatbots that handle real conversations — from lead qualification to customer support — using the latest LLMs, telephony APIs, and real-time infrastructure.',
    features: [
      'AI voice agents via Twilio, Retell.ai & SynthFlow',
      'GPT-4 powered conversational flows with function calling',
      'Calendar booking, CRM logging and SMS follow-ups',
      'Multi-language and bilingual support',
      'Human handoff and voicemail fallback',
      '24/7 production-ready deployment',
    ],
    tools: ['Twilio', 'Retell.ai', 'SynthFlow', 'OpenAI GPT-4', 'FastAPI', 'Supabase'],
    color: 'from-violet-500 to-purple-600',
    accent: 'violet',
  },
  {
    id: 'ml-ai',
    icon: 'brain',
    title: 'Machine Learning & AI',
    tagline: 'Custom AI solutions trained on your data',
    description:
      'From RAG-powered document assistants to computer vision pipelines, we build and deploy custom ML models and AI integrations that solve real business problems — not generic demos.',
    features: [
      'RAG (Retrieval-Augmented Generation) systems with FAISS & LangChain',
      'Custom model training and fine-tuning',
      'Computer vision and image processing pipelines',
      'Multi-agent AI orchestration',
      'OpenAI, Anthropic, and open-source LLM integration',
      'Local, private and cloud-based deployments',
    ],
    tools: ['OpenAI', 'LangChain', 'FAISS', 'PyTorch', 'Replicate', 'Hugging Face'],
    color: 'from-indigo-500 to-blue-600',
    accent: 'indigo',
  },
  {
    id: 'fullstack',
    icon: 'code',
    title: 'Full-Stack Development',
    tagline: 'Scalable web applications built to last',
    description:
      'End-to-end web development with Python backends and modern React frontends. We architect, build, and deploy production-grade applications — from SaaS platforms to enterprise tools.',
    features: [
      'Django, FastAPI & Flask backends',
      'React + Vite frontend with Tailwind CSS',
      'RESTful API design with Swagger documentation',
      'PostgreSQL, MySQL, Supabase database design',
      'AWS, Azure & DigitalOcean deployment',
      'CI/CD pipelines, Nginx, SSL configuration',
    ],
    tools: ['Django', 'FastAPI', 'React', 'PostgreSQL', 'AWS', 'Docker'],
    color: 'from-cyan-500 to-teal-600',
    accent: 'cyan',
  },
  {
    id: 'scraping',
    icon: 'globe',
    title: 'Web Scraping & Automation',
    tagline: 'Turn any website into structured data',
    description:
      'We build reliable, production-grade scrapers and browser automation bots that extract, transform, and deliver the data you need — at scale, with anti-bot bypass and smart retry logic.',
    features: [
      'Scrapy, Selenium & Playwright scrapers',
      'CAPTCHA and anti-bot bypass techniques',
      'Proxy rotation and rate limiting',
      'Structured CSV, Excel, JSON, database output',
      'Scheduled and triggered scraping pipelines',
      'Google Maps, LinkedIn, MCA and custom portals',
    ],
    tools: ['Python', 'Selenium', 'Playwright', 'Scrapy', 'BeautifulSoup', 'Pandas'],
    color: 'from-emerald-500 to-green-600',
    accent: 'emerald',
  },
  {
    id: 'automation',
    icon: 'workflow',
    title: 'Workflow Automation & Integration',
    tagline: 'Connect your tools. Automate your operations.',
    description:
      'We integrate your existing software stack and automate repetitive workflows using n8n, Zapier, custom APIs and Python — saving your team dozens of hours every week.',
    features: [
      'n8n and Zapier workflow design and deployment',
      'CRM, email and calendar automations',
      'Third-party API integration (20+ platforms)',
      'Data entry and form automation',
      'ETL pipelines and report generation',
      'Slack, Notion, Google Workspace integrations',
    ],
    tools: ['n8n', 'Zapier', 'Gmail API', 'HubSpot', 'Airtable', 'Google Sheets'],
    color: 'from-orange-500 to-amber-600',
    accent: 'orange',
  },
]

export const process = [
  {
    step: '01',
    title: 'Discovery Call',
    description: 'We understand your goals, requirements, and constraints. You get a clear project breakdown and timeline — no surprises.',
  },
  {
    step: '02',
    title: 'Architecture & Planning',
    description: 'We design the technical architecture, select the right stack, and break the project into clear, deliverable milestones.',
  },
  {
    step: '03',
    title: 'Build & Iterate',
    description: 'We build fast and show progress regularly. You get working demos at each milestone, with feedback loops baked in.',
  },
  {
    step: '04',
    title: 'Deploy & Support',
    description: 'We deploy to production with proper monitoring, SSL, and documentation. Post-launch support is always available.',
  },
]
