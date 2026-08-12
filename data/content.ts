// Single source of truth for all page copy and data.
// Mirrors the approved Claude Design (Portfolio.dc.html): blue accent, name "Winayagatar".

export const SITE_URL = "https://wyna.dev";

export const site = {
  name: "Winayagatar",
  fullName: "I Made Winayagatar Arya Bhanu",
  title: "AI Full-Stack Developer & Automation Engineer",
  cliHandle: "winayagatar",
  availability: "AVAILABLE FOR WORK",
  locationLine1: "Tabanan, Bali",
  locationLine2: "Indonesia",
  relocation: "Open to relocation — Kuala Lumpur, Malaysia",
  heroOneLiner:
    "I build web apps and automation systems. Four products are live in production, with 50+ bots delivered for clients since 2023.",
  metaDescription:
    "Winayagatar builds production web apps and automation systems. Four products are live, with 50+ bots delivered since 2023.",
  email: "atar@wyna.dev",
  github: "https://github.com/ryuken25",
  githubHandle: "ryuken25",
  telegram: "https://t.me/kenshi25",
  telegramHandle: "kenshi25",
  whatsapp: "https://wa.me/6281338109102",
  resume: "/resume.pdf",
  photo: "/arya.jpg",
  photoWebp: "/arya.webp",
  photoAlt: "Portrait of Winayagatar in a dark suit.",
} as const;

export interface TermLine {
  mark: string;
  tone: string;
  text: string;
}

export const terminalLines: TermLine[] = [
  { mark: "$", tone: "#4c8df6", text: "winayagatar --status" },
  { mark: "›", tone: "#49525f", text: "checking deployments..." },
  { mark: "●", tone: "#34d399", text: "LIVE  questpay      kenshi-questpay.vercel.app" },
  { mark: "●", tone: "#34d399", text: "LIVE  kenshi-notes  kenshi-notes.vercel.app" },
  { mark: "●", tone: "#34d399", text: "LIVE  ganga-sched   ganga-schedule-universal.vercel.app" },
  { mark: "◐", tone: "#fbbf24", text: "WIP   kenshi-chord  audio → chord, FastAPI + Whisper" },
  { mark: "●", tone: "#34d399", text: "LIVE  mellogang     mellogang.vercel.app" },
  { mark: "›", tone: "#49525f", text: "4 live · 50+ bots delivered · since 2023" },
  { mark: "✓", tone: "#4c8df6", text: "open to roles in Kuala Lumpur, Malaysia" },
];

export type Badge = "LIVE" | "IN PROGRESS" | "CLIENT WORK" | "";

export interface Project {
  name: string;
  desc: string;
  tags: string[];
  live: string;
  repo: string;
  badge: Badge;
}

export interface ProjectDetail {
  eyebrow: string;
  overview: string;
  problem: string;
  shipped: string[];
  role: string;
}

export const projectDetails: Record<string, ProjectDetail> = {
  "Kenshi Kaigo": {
    eyebrow: "education platform · live",
    overview: "A Japanese 介護福祉士 exam-prep app built for repeated practice, not a one-time quiz.",
    problem: "Learners need to move between Japanese text, furigana, Indonesian support, lessons, and mock exams without losing their place.",
    shipped: [
      "13 sections and 152 progressive levels",
      "six-year mock-exam experience",
      "custom ruby layout for stable kanji readings across browsers",
      "three-way kanji / furigana / Indonesian reading mode",
    ],
    role: "product, frontend, data model, browser QA, and production delivery",
  },
  QuestPay: {
    eyebrow: "creator payments · live",
    overview: "A checkout desk for creators who need a clearer path from order to payment release.",
    problem: "A creator workflow can get messy when briefs, payment status, and delivery state live in different places.",
    shipped: [
      "creator-facing checkout flow",
      "persistent Postgres-backed data",
      "payment and release state handling",
      "production deployment and post-launch ownership",
    ],
    role: "solo build from schema and UI through payment flow and deploy",
  },
  "Ganga Schedule Universal": {
    eyebrow: "schedule app · live",
    overview: "A class-schedule app with a seasonal interface instead of a static school-dashboard feel.",
    problem: "Schedules are functional, but they do not have to feel frozen or disconnected from the time of year.",
    shipped: [
      "schedule-focused information architecture",
      "season-aware visual treatment",
      "responsive Next.js interface",
      "production deployment on Vercel",
    ],
    role: "full-stack implementation and product interface",
  },
  "Kenshi Notes": {
    eyebrow: "notes · live",
    overview: "An Obsidian-style notes app backed by persistent Postgres storage.",
    problem: "A notes interface is only useful when the writing survives refreshes, devices, and long sessions.",
    shipped: [
      "notes-first workspace",
      "persistent Neon Postgres backend",
      "Next.js application shell",
      "production hosting and maintenance path",
    ],
    role: "application architecture, UI, persistence, and deployment",
  },
  "Mellogang Visuals": {
    eyebrow: "client system · live",
    overview: "An ordering and production-tracking system for a photo and video studio.",
    problem: "Studio work crosses clients, editors, payments, schedules, and deliverables. The system keeps those handoffs visible.",
    shipped: [
      "Admin, Editor, and Client access levels",
      "OTP and Google OAuth entry points",
      "payment verification and shoot scheduling",
      "PDF invoice generation",
    ],
    role: "end-to-end client delivery with backend, frontend, and production support",
  },
  "Kenshi Chord": {
    eyebrow: "audio intelligence · in progress",
    overview: "An audio-to-chord project exploring how vocals and music can become useful chord charts.",
    problem: "Turning an audio file into something a musician can work with requires more than a transcript.",
    shipped: [
      "FastAPI backend foundation",
      "Whisper-based audio processing direction",
      "chord-recognition model experiments",
      "ongoing research and implementation",
    ],
    role: "research, backend, and model integration",
  },
  "Automation bots": {
    eyebrow: "private client work",
    overview: "A body of automation work for scraping, Telegram and web flows, and bulk processing.",
    problem: "Repeated operational work eats time when every client process is handled by hand.",
    shipped: [
      "50+ bots delivered since 2023",
      "browser automation and scraping workflows",
      "Telegram and web task flows",
      "scheduled and bulk-processing jobs",
    ],
    role: "automation design, implementation, debugging, and handover",
  },
  "Kenshi Downloader": {
    eyebrow: "media utility · live",
    overview: "A media downloader with a queue-oriented interface and server-side fetching.",
    problem: "Media tasks become easier to follow when queue state and progress are visible instead of hidden behind a single form.",
    shipped: [
      "queue-based interaction model",
      "server-side fetching path",
      "responsive Next.js interface",
      "production deployment",
    ],
    role: "product interface and full-stack implementation",
  },
  "Zano OCR": {
    eyebrow: "document tool · live",
    overview: "An OCR workflow that turns an uploaded image into structured text through an LLM pass.",
    problem: "Raw OCR output is rarely the final format people need to use.",
    shipped: [
      "image upload flow",
      "OCR processing path",
      "structured text response",
      "LLM-assisted cleanup layer",
    ],
    role: "frontend, API integration, and deployment",
  },
  VERSE: {
    eyebrow: "web3 experience",
    overview: "An immersive landing experience built around 3D space and scroll-driven movement.",
    problem: "A Web3 product can feel like a brochure when the landing page does not give the idea a sense of place.",
    shipped: [
      "3D scene foundation",
      "scroll-driven camera movement",
      "interactive landing-page direction",
      "React Three Fiber exploration",
    ],
    role: "creative frontend and interaction engineering",
  },
  ShipOS: {
    eyebrow: "internal tooling",
    overview: "An internal dashboard shell for keeping deploys and client work in one place.",
    problem: "Small delivery details get lost when project status lives across chats, terminals, and separate dashboards.",
    shipped: [
      "deploy-oriented dashboard shell",
      "client-work tracking direction",
      "Next.js interface",
      "internal operations workflow",
    ],
    role: "product structure and application interface",
  },
  "starter-auth-api": {
    eyebrow: "developer starter",
    overview: "A reusable authentication API starting point for projects that need sessions, OTP, OAuth, and role guards.",
    problem: "Every new app should not have to rebuild the same authentication edges from scratch.",
    shipped: [
      "session-oriented auth structure",
      "OTP and OAuth integration direction",
      "role-guard pattern",
      "REST API starter shape",
    ],
    role: "API structure and reusable backend patterns",
  },
};

export const PREVIEW_COUNT = 6;

export const projects: Project[] = [
  {
    name: "Kenshi Kaigo",
    desc: "Japanese caregiver-certification (介護福祉士) exam prep: 13 sections, 152 levels, a six-year mock exam, and a three-mode 漢字/ふりがな/Indonesian switch built on a custom flex ruby layout instead of the browser engine, so readings never collide and Safari matches Chrome. Ships behind gates that measure real glyph boxes in WebKit, Firefox and Chromium at seven viewport widths.",
    tags: ["React", "Vite", "Neon Postgres", "Vercel Functions"],
    live: "https://kaigo.wyna.dev",
    repo: "https://github.com/ryuken25/kenshi-kaigo-e-learning",
    badge: "LIVE",
  },
  {
    name: "QuestPay",
    desc: "Web3 creator checkout desk. Built and run solo: UI, database, payment/release flow, production deploy.",
    tags: ["Next.js", "TypeScript", "Neon Postgres"],
    live: "https://kenshi-questpay.vercel.app",
    repo: "https://github.com/ryuken25/kenshi-questpay",
    badge: "LIVE",
  },
  {
    name: "Ganga Schedule Universal",
    desc: "Class-schedule web app with a seasonal UI that shifts with the time of year.",
    tags: ["TypeScript", "Next.js", "Neon"],
    live: "https://ganga-schedule-universal.vercel.app",
    repo: "",
    badge: "LIVE",
  },
  {
    name: "Kenshi Notes",
    desc: "Obsidian-style notes app on a persistent Postgres backend.",
    tags: ["Next.js 16", "Neon Postgres"],
    live: "https://kenshi-notes.vercel.app",
    repo: "",
    badge: "LIVE",
  },
  {
    name: "Mellogang Visuals",
    desc: "Ordering and production-tracking system for a photo/video studio: role-based access (Admin/Editor/Client), payment verification, scheduling, OTP + Google OAuth, PDF invoices.",
    tags: ["PHP", "CodeIgniter 4", "MySQL", "React", "Tailwind"],
    live: "https://mellogang.vercel.app/",
    repo: "https://github.com/ryuken25/mellogang-website",
    badge: "CLIENT WORK",
  },
  {
    name: "Kenshi Chord",
    desc: "In progress: building audio-to-chord transcription with Whisper and chord-recognition models on a FastAPI backend.",
    tags: ["Python", "FastAPI", "Whisper", "ML"],
    live: "",
    repo: "https://github.com/ryuken25/kenshi-chord",
    badge: "IN PROGRESS",
  },
  {
    name: "Automation bots",
    desc: "50+ bots for scraping, Telegram/web flows, bulk processing, and multi-account operations. Mostly private client work — happy to walk through them in an interview.",
    tags: ["Python", "Node.js", "Playwright"],
    live: "",
    repo: "",
    badge: "",
  },
  {
    name: "Kenshi Downloader",
    desc: "Media downloader with a queue UI and server-side fetching.",
    tags: ["Next.js", "TypeScript"],
    live: "https://kenshi-downloader.vercel.app",
    repo: "",
    badge: "LIVE",
  },
  {
    name: "Zano OCR",
    desc: "Document OCR tool: upload an image, get structured text back through an LLM pass.",
    tags: ["Next.js", "OCR", "LLM API"],
    live: "https://zano-ocr.vercel.app",
    repo: "",
    badge: "LIVE",
  },
  {
    name: "VERSE",
    desc: "Immersive 3D Web3 landing experience with scroll-driven camera moves.",
    tags: ["Three.js", "React Three Fiber"],
    live: "",
    repo: "https://github.com/ryuken25",
    badge: "",
  },
  {
    name: "ShipOS",
    desc: "Internal dashboard shell for tracking deploys and client work in one place.",
    tags: ["Next.js", "Postgres"],
    live: "",
    repo: "https://github.com/ryuken25",
    badge: "",
  },
  {
    name: "starter-auth-api",
    desc: "Reusable auth API starter: sessions, OTP, OAuth, and role guards ready to drop into a project.",
    tags: ["Node.js", "REST", "JWT"],
    live: "",
    repo: "https://github.com/ryuken25",
    badge: "",
  },
];

export const badgeStyles: Record<
  Exclude<Badge, "">,
  { fg: string; bg: string; bd: string }
> = {
  LIVE: { fg: "#34d399", bg: "rgba(52,211,153,0.09)", bd: "rgba(52,211,153,0.32)" },
  "IN PROGRESS": { fg: "#fbbf24", bg: "rgba(251,191,36,0.09)", bd: "rgba(251,191,36,0.3)" },
  "CLIENT WORK": { fg: "#8fb8fb", bg: "rgba(76,141,246,0.12)", bd: "rgba(76,141,246,0.38)" },
};

export const filters = ["All", "Live", "AI & Automation", "Client work"] as const;
export type Filter = (typeof filters)[number];

export interface ProofStat {
  count: number;
  from: number;
  suffix: string;
  display: string;
  label: string;
}

export const proofStats: ProofStat[] = [
  { count: 4, from: 0, suffix: "", display: "4", label: "live apps in production" },
  { count: 50, from: 0, suffix: "+", display: "50+", label: "automation bots delivered" },
  { count: 2023, from: 1990, suffix: "", display: "2023", label: "freelancing since" },
];

export const ticker = [
  "TypeScript",
  "Next.js",
  "React",
  "Node.js",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "Prisma",
  "Playwright",
  "LLM APIs",
  "AI agents",
  "Tailwind",
  "PHP",
  "MySQL",
  "Vercel",
];

export interface SkillGroup {
  group: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  { group: "Languages", items: ["TypeScript", "JavaScript", "Python", "PHP", "SQL"] },
  {
    group: "Web",
    items: [
      "React",
      "Next.js",
      "Node.js",
      "Tailwind CSS",
      "REST APIs",
      "Prisma",
      "PostgreSQL (Neon)",
      "MySQL",
      "Supabase",
    ],
  },
  {
    group: "AI & Automation",
    items: [
      "LLM APIs (OpenAI, Claude, Gemini)",
      "AI agents & tool calling",
      "prompt engineering",
      "Playwright scraping",
      "Telegram/web bots",
      "scheduled jobs",
    ],
  },
  {
    group: "Delivery",
    items: ["Git/GitHub", "Vercel", "env & secrets hygiene", "staged releases"],
  },
];

export interface Job {
  role: string;
  period: string;
  periodTone: "live" | "accent";
  meta: string;
  desc?: string;
  bullets: string[];
  tags: string[];
  pulse: boolean;
}

export const experience: Job[] = [
  {
    role: "Freelance Full-Stack & Automation Developer",
    period: "2023 — PRESENT",
    periodTone: "live",
    meta: "Independent · Bali, Indonesia",
    desc: "Web apps, scraping pipelines, and internal tools for clients — from requirements through deploy and support. Uses LLM APIs for structured extraction and agent workflows, with human review before anything ships.",
    bullets: [
      "4 products running in production on Vercel + Neon",
      "50+ automation bots delivered for scraping, Telegram flows, and bulk processing",
      "Direct client ownership: scoping, pricing, delivery, and post-launch support",
    ],
    tags: ["TypeScript", "Next.js", "Python", "Playwright", "LLM APIs"],
    pulse: true,
  },
  {
    role: "Full-Stack Developer & Video Editor (contract)",
    period: "2025",
    periodTone: "accent",
    meta: "Mellogang Visuals · photo/video studio",
    desc: "Built the agency's ordering and production-tracking system end to end, now live at mellogang.vercel.app.",
    bullets: [
      "Role-based access for Admin / Editor / Client with OTP + Google OAuth",
      "Payment verification, shoot scheduling, and PDF invoice generation",
    ],
    tags: ["PHP", "CodeIgniter 4", "MySQL", "React", "Tailwind"],
    pulse: false,
  },
  {
    role: "S.Kom Information Systems",
    period: "2026",
    periodTone: "accent",
    meta: "ITB STIKOM Bali",
    bullets: ["2nd place, OSN-K Informatics 2020"],
    tags: [],
    pulse: false,
  },
];

export const about =
  "I am an Information Systems graduate (S.Kom) from ITB STIKOM Bali, 2026, and I have been freelancing since 2023. I work AI-first: LLM tooling is part of my daily workflow for speed, but I own the architecture, the code review, and the deploys myself. I am based in Bali and ready to relocate to Malaysia with an employer-sponsored Employment Pass.";

export const credentials =
  "S.Kom Information Systems, ITB STIKOM Bali (2026) · 2nd place, OSN-K Informatics 2020";

export const contactCopy =
  "Open to full-time roles in Malaysia or remote, plus contract and freelance work.";

// Section eyebrow labels (numbered) from the design.
export const eyebrows = {
  projects: "01 — WORK",
  skills: "02 — STACK",
  experience: "03 — TRACK RECORD",
  about: "04 — BACKGROUND",
  contact: "05 — SAY HELLO",
} as const;
