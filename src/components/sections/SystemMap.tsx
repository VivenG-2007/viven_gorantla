"use client";

import React, { useState } from "react";
import { StatusChip } from "@/components/ui/StatusChip";
import styles from "./SystemMap.module.scss";

interface StageInfo {
  id: string;
  name: string;
  num: string;
  role: string;
  tech: string;
  status: "documented" | "in-progress" | "planned";
  explanation: string;
}

const PATCHLINE_STAGES: StageInfo[] = [
  {
    id: "p1",
    name: "Source Code",
    num: "01",
    role: "Target Codebase Ingestion",
    tech: "GitHub API / Tree-sitter",
    status: "documented",
    explanation: "Ingests developer repositories or pull request diffs, extracting Abstract Syntax Trees (AST) to identify syntax boundaries without running arbitrary code.",
  },
  {
    id: "p2",
    name: "Static Analysis",
    num: "02",
    role: "Deterministic Vulnerability Scanner",
    tech: "Semgrep Rules / Regex Engine",
    status: "documented",
    explanation: "Runs fast, deterministic security rules (OWASP Top 10, CWE patterns) to anchor the AI. Only real linters ground the findings—no generative hallucinations.",
  },
  {
    id: "p3",
    name: "Context / Retrieval",
    num: "03",
    role: "Dependency & Context Assembly",
    tech: "Elasticsearch / MongoDB / Redis",
    status: "documented",
    explanation: "Retrieves enclosing functions, imported type definitions, and framework versions so the model understands semantic scope rather than seeing isolated code fragments.",
  },
  {
    id: "p4",
    name: "Model Routing",
    num: "04",
    role: "Adaptive LLM Selection",
    tech: "Featherless AI / Azure OpenAI Fallback",
    status: "documented",
    explanation: "Routes queries dynamically based on token complexity and budget constraints. Employs low-latency open weights primarily with commercial failover fallbacks.",
  },
  {
    id: "p5",
    name: "Candidate Fix",
    num: "05",
    role: "Synthesizing Minimal Unified Diff",
    tech: "Python FastAPI / Pydantic Schemas",
    status: "documented",
    explanation: "The LLM generates structured replacement chunks restricted strictly to the vulnerable lines, preserving style guidelines, comments, and neighboring logic.",
  },
  {
    id: "p6",
    name: "Verification",
    num: "06",
    role: "Isolated Patch Re-testing",
    tech: "Sandboxed AST & Semgrep Validation",
    status: "documented",
    explanation: "Applies the proposed patch in memory and re-executes static linters. If the vulnerability persists or syntax errors emerge, the candidate is discarded.",
  },
  {
    id: "p7",
    name: "Human Review",
    num: "07",
    role: "Developer Oversight & PR Approval",
    tech: "GitHub PR / Interactive Web UI",
    status: "documented",
    explanation: "Final verification remains strictly human-in-the-loop. The developer inspects side-by-side diffs, test evidence, and approves pull request creation.",
  },
];

const CRISIS_STAGES: StageInfo[] = [
  {
    id: "c1",
    name: "Sensor Event",
    num: "01",
    role: "Real-time Telemetry Ingestion",
    tech: "SSE / Zod Validation / Idempotency Store",
    status: "in-progress",
    explanation: "Ingests environmental telemetry (rainfall mm/hr, river gauge levels, road sensors) through strict Zod schemas and deduplicating idempotency caches.",
  },
  {
    id: "c2",
    name: "Simulation Engine",
    num: "02",
    role: "Deterministic Fixed-point Cascades",
    tech: "SimulationEngine / SimulationClock",
    status: "in-progress",
    explanation: "Calculates cascading failures deterministically: rainfall -> road inundation -> bridge structural compromise -> power substation failure.",
  },
  {
    id: "c3",
    name: "Risk & Blast Radius",
    num: "03",
    role: "Impact Radius & Population Assessment",
    tech: "BlastRadiusEngine / Dijkstra Routing",
    status: "in-progress",
    explanation: "Computes topological blast radius across hospital power grids, municipal wards, and risk-weighted routing paths for emergency responders.",
  },
  {
    id: "c4",
    name: "AI Recommendation",
    num: "04",
    role: "Structured Action Proposals",
    tech: "CommanderAgent / Azure OpenAI Client",
    status: "in-progress",
    explanation: "Proposes structured emergency actions (reroute ambulances, deploy mobile pumps) conforming to strict schema definitions under budget gates.",
  },
  {
    id: "c5",
    name: "Action Validator",
    num: "05",
    role: "Policy & Hallucination Guardrail",
    tech: "ActionValidator / Policy Engine",
    status: "in-progress",
    explanation: "Checks proposed actions against hard safety policies, resource availability, and hallucination bounds before allowing any queue insertion.",
  },
  {
    id: "c6",
    name: "Human Approval (RBAC)",
    num: "06",
    role: "Role-Based Commander Authorization",
    tech: "RBAC (OPERATOR vs COMMANDER)",
    status: "in-progress",
    explanation: "Critical actions (e.g. MASS_EVACUATION) return HTTP 403 Forbidden unless an authenticated COMMANDER with cryptographic credential signs off.",
  },
  {
    id: "c7",
    name: "Execute + Audit",
    num: "07",
    role: "Immutable Audit Log & SSE Broadcast",
    tech: "Audit Ledger / Client Event Stream",
    status: "in-progress",
    explanation: "Dispatches approved actions to responder feeds, broadcasts state changes via Server-Sent Events, and appends cryptographically signed entries to the audit trail.",
  },
];

export function SystemMap() {
  const [pipeline, setPipeline] = useState<"patchline" | "crisis">("patchline");
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);

  const stages = pipeline === "patchline" ? PATCHLINE_STAGES : CRISIS_STAGES;
  const currentStage = stages[activeStageIdx] || stages[0];

  return (
    <section id="systems" className={`section-padding ${styles.mapSection}`}>
      <div className="container">
        <div className={styles.headerRow}>
          <div>
            <span className="section-label">03 / HOW I THINK</span>
            <h2 className={styles.sectionTitle}>Interactive Signal Architecture</h2>
            <p className={styles.leadText}>
              &ldquo;The AI proposes. Software verifies. A human approves.&rdquo;
            </p>
          </div>

          {/* Pipeline Switcher Toggle */}
          <div className={styles.toggleGroup}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${pipeline === "patchline" ? styles.toggleActive : ""}`}
              onClick={() => {
                setPipeline("patchline");
                setActiveStageIdx(0);
              }}
            >
              PatchLine (Code Security)
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${pipeline === "crisis" ? styles.toggleActive : ""}`}
              onClick={() => {
                setPipeline("crisis");
                setActiveStageIdx(0);
              }}
            >
              Crisis Commander (Digital Twin)
            </button>
          </div>
        </div>

        {/* Interactive Signal Flow Diagram */}
        <div className={styles.flowLayout}>
          {/* Node Rail */}
          <div className={styles.nodesRail} role="tablist" aria-label="Pipeline stages">
            {stages.map((stage, idx) => (
              <button
                key={stage.id}
                role="tab"
                aria-selected={idx === activeStageIdx}
                className={`${styles.nodeBtn} ${idx === activeStageIdx ? styles.nodeActive : ""}`}
                onClick={() => setActiveStageIdx(idx)}
                data-cursor="SELECT"
              >
                <div className={styles.nodeLeft}>
                  <span className={styles.nodeNum}>{stage.num}</span>
                  <div className={styles.nodeIndicator}>
                    <span className={styles.nodeDot} />
                    {idx < stages.length - 1 && <span className={styles.nodeLine} />}
                  </div>
                </div>

                <div className={styles.nodeContent}>
                  <span className={styles.nodeTitle}>{stage.name}</span>
                  <span className={styles.nodeRole}>{stage.role}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Stage Diagnostic Inspector Card */}
          <div className={styles.inspectorCard}>
            <div className={styles.cardTop}>
              <div className={styles.cardStageNum}>STAGE {currentStage.num} OF 07</div>
              <StatusChip status={currentStage.status} />
            </div>

            <h3 className={styles.cardStageTitle}>{currentStage.name}</h3>
            <p className={styles.cardRoleLabel}>{currentStage.role}</p>

            <div className={styles.divider} />

            <div className={styles.fieldBlock}>
              <h4 className={styles.fieldTitle}>SYSTEM ARCHITECTURE & ROLE</h4>
              <p className={styles.fieldContent}>{currentStage.explanation}</p>
            </div>

            <div className={styles.fieldBlock}>
              <h4 className={styles.fieldTitle}>GROUNDING TECHNOLOGY</h4>
              <div className={styles.techBadge}>
                <code>{currentStage.tech}</code>
              </div>
            </div>

            <div className={styles.quoteBlock}>
              <p>
                {pipeline === "patchline"
                  ? "Static analysis findings provide the ground truth for LLM candidates. No patches execute without isolated AST verification and developer review."
                  : "Cascading physics and topological reachability are deterministic. Generative models only propose responses under strict policy and role-based authority."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
