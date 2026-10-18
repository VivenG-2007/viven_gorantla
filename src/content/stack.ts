import { projects } from "./projects";

export const stackCategories: Record<string, string[]> = {
  "Languages": ["C", "C++", "Python", "JavaScript", "TypeScript", "SQL / MySQL", "Java"],
  "Frontend": ["Next.js", "React", "TypeScript", "MapLibre GL"],
  "Backend": ["FastAPI", "Node.js", "Express", "REST APIs"],
  "Data & storage": [
    "MongoDB",
    "Supabase / PostgreSQL",
    "Redis",
    "ChromaDB",
    "Elasticsearch",
    "Azure Blob",
  ],
  "AI & analysis": [
    "Groq / Llama 3.3 70B",
    "Gemini API",
    "RAG",
    "Model routing",
    "Semgrep",
    "Tree-sitter",
    "AST analysis",
  ],
  "Infra & cloud": ["Docker", "Docker Compose", "Render", "Vercel", "Azure", "AWS"],
  "Security patterns": [
    "RS256 JWT",
    "Refresh-token rotation",
    "HttpOnly cookies",
    "RBAC",
    "Redis rate limiting",
  ],
};

// Map each technology item to associated project slugs
export function getProjectsForTech(tech: string): string[] {
  const normalized = tech.toLowerCase();
  const matchedSlugs: string[] = [];

  for (const p of projects) {
    if (!p.stack && !p.architecture) continue;
    const combined = [
      ...(p.stack || []),
      ...(p.architecture || []),
      ...(p.features || []),
    ].join(" ").toLowerCase();

    // Check direct matching or aliases
    if (
      combined.includes(normalized) ||
      (normalized === "sql / mysql" && (combined.includes("sql") || combined.includes("mysql") || combined.includes("postgres"))) ||
      (normalized === "supabase / postgresql" && (combined.includes("supabase") || combined.includes("postgres"))) ||
      (normalized === "groq / llama 3.3 70b" && (combined.includes("groq") || combined.includes("llama"))) ||
      (normalized === "rs256 jwt" && combined.includes("jwt")) ||
      (normalized === "rest apis" && (combined.includes("api") || combined.includes("express") || combined.includes("fastapi")))
    ) {
      matchedSlugs.push(p.slug);
    }
  }

  return matchedSlugs;
}
