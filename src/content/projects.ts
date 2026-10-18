export type ProjectStatus = "documented" | "in-progress" | "planned" | "to-confirm";

export interface ProjectMetric {
  label: string;
  value: string;
  note?: string;
}

export interface Project {
  slug: string;
  featured: boolean;
  order: number;
  title: string;
  alias?: string;
  category: string;
  repo: string | null;
  demo: string | null;
  status: ProjectStatus;
  pitch: string;
  problem?: string;
  approach?: string;
  disclaimer?: string;
  note?: string;
  architecture?: string[];
  decisions?: string[];
  features?: string[];
  flow?: string[];
  metrics?: ProjectMetric[];
  planned?: string[];
  stack?: string[];
  result?: string;
  learned?: string;
}

export const projects: Project[] = [
  {
    slug: "patchline",
    featured: true,
    order: 1,
    title: "PatchLine",
    alias: "HackWave AI (PatchLine)",
    category: "AI-assisted code security · developer tooling",
    repo: "https://github.com/VivenG-2007/patchline.ai",
    demo: null,
    status: "documented", // architecture documented in the public README; don't claim production-hardened
    pitch: "Moves from a static list of vulnerability warnings toward tested, human-reviewed fix proposals.",
    problem: "Scanners flag issues but stop there; developers still triage, research, patch and verify by hand.",
    approach: "Static-analysis findings ground AI-assisted enrichment and candidate fixes; a separate verification step checks patches; a human approves any pull request.",
    architecture: [
      "Next.js / React / TypeScript frontend",
      "Auth service — Node.js/Express, MongoDB, Redis; issues RS256-signed JWTs",
      "Core API — Node.js/Express, Supabase, Redis; gateway to the AI service; GitHub/Jira OAuth integrations documented",
      "AI service — Python/FastAPI, MongoDB, Redis, Azure Blob Storage, Elasticsearch",
      "Analysis — Semgrep, Tree-sitter, regex rules",
      "Model routing — Featherless AI primary; OpenAI / Azure OpenAI fallbacks documented",
      "Deploy config — Docker Compose, Render Blueprint (Vercel mentioned for the frontend)",
    ],
    decisions: [
      "Split services by responsibility instead of one monolith",
      "Downstream services verify JWTs locally with the public key (no auth-service call per request)",
      "Static findings are the grounding for AI output, not an afterthought",
      "Human approval stays in the loop for pull requests",
      "Reproducible config: env vars, Docker Compose, Render blueprint",
    ],
    flow: [
      "Source Code",
      "Static Analysis",
      "Context / Retrieval",
      "Model Routing",
      "Candidate Fix",
      "Verification",
      "Human Review",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Express",
      "FastAPI",
      "Python",
      "MongoDB",
      "Redis",
      "Supabase",
      "Azure Blob",
      "Elasticsearch",
      "Semgrep",
      "Tree-sitter",
      "Docker",
      "Render",
    ],
    learned: "", // Write-up coming state rendered gracefully
  },
  {
    slug: "crisis-commander",
    featured: true,
    order: 2,
    title: "Crisis Commander",
    category: "AI crisis digital twin · human-in-the-loop decision support",
    repo: null,
    demo: null,
    status: "in-progress",
    disclaimer: "Advisory prototype built for a simulated Hyderabad flood scenario — not a certified emergency system.",
    pitch: "A simulation-first command console where AI recommends actions, but role-based approval decides what executes.",
    problem: "In a cascading crisis (rainfall → road flooding → bridge collapse → hospital power failure → ambulance rerouting) decisions must be fast, explainable and safely gated.",
    approach: "Deterministic cascading simulation engine + risk and blast-radius engines; an AI commander proposes structured, schema-validated actions; policy/hallucination validators check them; critical actions require COMMANDER approval and are fully audited.",
    architecture: [
      "Next.js (App Router) + TypeScript strict + Zod schemas; MapLibre GL map; SVG dependency graph",
      "SimulationEngine (deterministic fixed-point cascades), SimulationClock, IdempotencyStore, RiskEngine, BlastRadiusEngine, ConfidenceCalculator",
      "EventPipeline: validate → idempotency → simulate → audit → SSE broadcast",
      "Risk-weighted Dijkstra routing; WhatIfEngine that clones state, applies a change, compares outcomes",
      "AI layer: StructuredAiAction (Zod), ActionValidator, ModelClient (Azure OpenAI client + deterministic fallback when no credentials), CommanderAgent with budget gate",
      "RBAC: OPERATOR vs COMMANDER; critical actions (e.g. MASS_EVACUATION) return 403 unless a COMMANDER approves",
    ],
    metrics: [
      {
        label: "automated tests passing",
        value: "139",
        note: "as of project notes, Sept 2026 — confirm before publishing",
      },
      {
        label: "API routes",
        value: "11",
      },
    ],
    planned: [
      "Neo4j, Supabase, MongoDB, ChromaDB backends",
      "Real Azure OpenAI credentials",
      "Full 8-agent roster (only CommanderAgent exists now)",
      "UI wiring for all critical actions",
    ],
    flow: [
      "Sensor event",
      "Simulation",
      "Risk & blast radius",
      "AI recommendation",
      "Validator",
      "Human approval (RBAC)",
      "Execute + audit",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Zod",
      "MapLibre GL",
      "Vitest",
      "Azure OpenAI (optional)",
      "SSE",
    ],
  },
  {
    slug: "blackbox-ai",
    featured: true,
    order: 3,
    title: "BLACKBOX AI 1.0 — Probe & Model the Unknown",
    category: "AI/ML challenge · black-box probing, surrogate modelling",
    repo: null,
    demo: null,
    status: "to-confirm",
    result: "1st place — GCET IEEE Student Branch / IEEE Computer Society, 6–7 Oct 2026 (per certificate, team localhost:420)",
    pitch: "Reverse-engineering a hidden scoring system under a fixed query budget by being deliberate about every probe.",
    approach: "Phase 1: understand the input space before training anything — range discovery, baseline, one-factor-at-a-time (OFAT) experiments and feature analysis, with MongoDB Atlas as the source of truth. Later phases: statistical analysis → retrieval (ChromaDB) → LLM-generated hypotheses → active learning → surrogate models → validation, with a configurable explore/validate budget split.",
    architecture: [
      "Python 3.11+, PyMongo, NumPy, Pandas, SciPy, Pydantic",
      "CLI: init · discover-ranges · baseline · analyze-features · status",
      "MongoDB Atlas as the experiment ledger",
      "(Later) ChromaDB RAG + foundation model + ML surrogates + active learning",
    ],
    note: "Describe methodology only. Do NOT publish the organisers' hidden schema, scoring details or anything that could breach event rules. Mark each phase Implemented/Planned once Viven confirms.",
    flow: [
      "Input Space Probing",
      "OFAT Experiments",
      "Ledger Ingestion",
      "Statistical Analysis",
      "LLM Hypotheses",
      "Surrogate Validation",
    ],
    stack: [
      "Python",
      "MongoDB Atlas",
      "NumPy",
      "Pandas",
      "SciPy",
      "Pydantic",
      "ChromaDB",
    ],
  },
  {
    slug: "auth-service",
    featured: false,
    order: 4,
    title: "Reusable Authentication Microservice",
    category: "Backend infrastructure",
    repo: null,
    demo: null,
    status: "to-confirm",
    pitch: "Authentication built once, reused across hackathons and side projects.",
    features: [
      "Register / login",
      "JWT auth with refresh-token rotation",
      "HttpOnly cookies",
      "Email verification",
      "Forgot / reset password",
      "RBAC",
      "Redis-backed rate limiting",
      "Logout from all devices",
      "Docker",
      "Azure deployment",
      "A PROJECT_NAME env var gives a new project its own MongoDB database and Redis namespace with zero code changes",
    ],
    stack: ["Node.js", "Express", "MongoDB Atlas", "Redis", "Docker", "Azure"],
  },
  {
    slug: "dbforge-ai",
    featured: false,
    order: 5,
    title: "DBForge AI",
    category: "AI-assisted database design (PBL project)",
    repo: null,
    demo: null,
    status: "in-progress",
    pitch: "Turn a visual ER diagram or a plain-English prompt into a validated, deployed PostgreSQL schema on Supabase.",
    approach: "LLM generation (Gemini primary, Azure-hosted model as fallback), schema validation, Supabase deployment, shared Redis rate limiting.",
    stack: [
      "PostgreSQL",
      "Supabase",
      "Gemini API",
      "Azure AI Foundry",
      "Redis (Upstash)",
    ],
  },
  {
    slug: "self-healing-qa",
    featured: false,
    order: 6,
    title: "Self-Healing Autonomous QA Engineer",
    category: "Agentic AI prototype",
    repo: null,
    demo: null,
    status: "to-confirm",
    pitch: "Autonomous test failure diagnosis and AST-guided candidate repair in isolated sandboxes.",
    note: "Project name appears as a variant spelling on LinkedIn — use this title and flag it. Confirm whether it's a standalone codebase or a precursor to PatchLine; if unclear, present it as a 'concept & prototype' inside the More Builds list, not a full case study.",
    flow: [
      "Plan",
      "Inspect (AST)",
      "Execute (sandbox)",
      "Diagnose",
      "Fix candidate",
      "Verify",
    ],
    stack: [
      "Groq + Llama 3.3 70B",
      "FastAPI",
      "ARQ + Redis",
      "Supabase",
      "ChromaDB",
      "Next.js",
      "AST analysis",
    ],
  },
  {
    slug: "azure-ha-cost-study",
    featured: false,
    order: 7,
    title: "High-Availability Azure Architecture & Cost Study",
    category: "Cloud / FinOps learning case study",
    repo: null,
    demo: null,
    status: "documented",
    pitch: "A zone-redundant design (Vercel frontend, Azure App Service Premium, PostgreSQL Flexible Server with zone-redundant HA, Azure Managed Redis, Blob Storage) costed for a short two-day demo window at ≈ ₹276 (estimate).",
    note: "Label as design + estimate unless Viven provides the actual bill/provisioning evidence.",
    stack: [
      "Azure App Service",
      "PostgreSQL HA",
      "Azure Redis",
      "Azure Blob",
      "FinOps",
    ],
  },
  {
    slug: "library-manager",
    featured: false,
    order: 8,
    title: "Library Manager (Java)",
    category: "Fundamentals",
    repo: null,
    demo: null,
    status: "documented",
    pitch: "Plain-Java console app — Book, Member, Loan, Library service, custom checked/unchecked exceptions, collections-based design.",
    stack: ["Java"],
  },
];
