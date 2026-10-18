import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  CheckCircle,
  Clock,
  Compass,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import styles from "./CaseStudy.module.scss";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vivengorantla.dev";
  const projectUrl = `${baseUrl}/work/${project.slug}`;

  return {
    title: `${project.title} — Architectural Case Study`,
    description: project.pitch,
    keywords: [
      project.title,
      project.category,
      ...(project.stack || []),
      "Viven Gorantla",
      "Software Architecture",
      "AI Engineering",
    ],
    alternates: {
      canonical: projectUrl,
    },
    openGraph: {
      title: `${project.title} — Architectural Case Study | Viven Gorantla`,
      description: project.pitch,
      url: projectUrl,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Architectural Case Study | Viven Gorantla`,
      description: project.pitch,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vivengorantla.dev";
  const currentIdx = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIdx + 1) % projects.length];

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${project.title} — Architecture Case Study`,
    description: project.pitch,
    author: {
      "@type": "Person",
      name: "Viven Gorantla",
      url: baseUrl,
    },
    url: `${baseUrl}/work/${project.slug}`,
    about: project.category,
    keywords: project.stack?.join(", "),
  };

  return (
    <article className={styles.caseStudyArticle}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <div className="container">
        {/* Navigation Breadcrumb */}
        <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
          <Link href="/#work" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>BACK TO ARCHITECTURES</span>
          </Link>
          <span className={styles.crumbDivider}>/</span>
          <span className={styles.crumbCurrent}>{project.title}</span>
        </nav>

        {/* Hero Header */}
        <header className={styles.caseHeader}>
          <div className={styles.headerMeta}>
            <span className="section-label">CASE STUDY / 0{currentIdx + 1}</span>
            <StatusChip status={project.status} />
          </div>

          <h1 className={styles.mainTitle}>{project.title}</h1>
          <p className={styles.categorySub}>{project.category}</p>
          <p className={styles.pitchLead}>{project.pitch}</p>

          {project.repo && (
            <div className={styles.repoRow}>
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.repoBtn}
              >
                <GithubIcon size={18} />
                <span>View Repository on GitHub</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Important Disclaimers / Notes */}
          {project.disclaimer && (
            <div className={styles.disclaimerBox}>
              <ShieldAlert size={20} className={styles.alertIcon} />
              <div>
                <strong>SIMULATION ADVISORY PROTOTYPE:</strong>
                <p>{project.disclaimer}</p>
              </div>
            </div>
          )}

          {project.note && (
            <div className={styles.noteBox}>
              <Compass size={20} className={styles.noteIcon} />
              <div>
                <strong>METHODOLOGY NOTE:</strong>
                <p>{project.note}</p>
              </div>
            </div>
          )}
        </header>

        {/* Section 1: Problem & Approach */}
        <div className={styles.twoColSection}>
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>The Problem &amp; Bottleneck</h2>
            <p className={styles.blockBody}>
              {project.problem ||
                "Traditional static scanners flag vulnerabilities without synthesizing verified patch proposals, placing the entire burden of research, triage, and AST validation on the engineer."}
            </p>
          </div>

          <div className={styles.block}>
            <h2 className={styles.blockTitle}>Engineered Approach</h2>
            <p className={styles.blockBody}>
              {project.approach ||
                "A decoupled microservice architecture where deterministic linters ground LLM generation, patches are validated in isolated sandboxes, and humans retain final approval."}
            </p>
          </div>
        </div>

        {/* Section 2: Architecture Diagram (SVG generated from architecture array) */}
        {project.architecture && (
          <section className={styles.archSection}>
            <h2 className={styles.sectionSubtitle}>System Architecture &amp; Service Boundaries</h2>
            <div className={styles.archContainer}>
              <div className={styles.diagramNodes}>
                {project.architecture.map((item, i) => (
                  <div key={i} className={styles.diagramNode}>
                    <div className={styles.nodeIndex}>0{i + 1}</div>
                    <div className={styles.nodeText}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section 3: Key Engineering Decisions */}
        {project.decisions && (
          <section className={styles.decisionsSection}>
            <h2 className={styles.sectionSubtitle}>Key Architectural Decisions</h2>
            <div className={styles.decisionsGrid}>
              {project.decisions.map((decision, i) => (
                <div key={i} className={styles.decisionCard}>
                  <div className={styles.decisionNum}>DECISION {i + 1}</div>
                  <p className={styles.decisionText}>{decision}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 4: Implementation Status Breakdown (Three Column) */}
        <section className={styles.statusBreakdown}>
          <h2 className={styles.sectionSubtitle}>Implementation Reality &amp; Roadmap</h2>
          <div className={styles.threeColGrid}>
            <div className={styles.statusCol}>
              <div className={styles.statusColHeader}>
                <CheckCircle size={18} className={styles.iconDone} />
                <h3>Implemented &amp; Validated</h3>
              </div>
              <ul className={styles.statusList}>
                {project.architecture?.slice(0, 4).map((item, i) => (
                  <li key={i}>{item}</li>
                )) || <li>Core domain schemas &amp; API boundaries</li>}
              </ul>
            </div>

            <div className={styles.statusCol}>
              <div className={styles.statusColHeader}>
                <Clock size={18} className={styles.iconProgress} />
                <h3>In Active Iteration</h3>
              </div>
              <ul className={styles.statusList}>
                {project.architecture?.slice(4, 7).map((item, i) => (
                  <li key={i}>{item}</li>
                )) || <li>Telemetry benchmarks &amp; fallback model routing</li>}
              </ul>
            </div>

            <div className={styles.statusCol}>
              <div className={styles.statusColHeader}>
                <Compass size={18} className={styles.iconPlanned} />
                <h3>Planned Next Steps</h3>
              </div>
              <ul className={styles.statusList}>
                {project.planned?.map((plan, i) => (
                  <li key={i}>{plan}</li>
                )) || <li>Production distributed worker queues and load simulations</li>}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5: Technology Stack */}
        {project.stack && (
          <section className={styles.techSection}>
            <h2 className={styles.sectionSubtitle}>Verified Technology Stack</h2>
            <div className={styles.chipsRow}>
              {project.stack.map((t) => (
                <span key={t} className={styles.techBadge}>
                  {t}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Section 6: Trade-offs & What I Learned */}
        <section className={styles.learnedSection}>
          <h2 className={styles.sectionSubtitle}>Trade-offs &amp; Technical Learnings</h2>
          <div className={styles.learnedCard}>
            {project.learned ? (
              <p className={styles.learnedBody}>{project.learned}</p>
            ) : (
              <div className={styles.pendingState}>
                <p>
                  <em>
                    Technical write-up and retrospective currently being documented by Viven.
                    Grounding architecture and test suite verified in project repository notes.
                  </em>
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Next Project Footer Link */}
        <footer className={styles.caseFooter}>
          <div className={styles.nextPrompt}>NEXT ARCHITECTURE:</div>
          <Link href={`/work/${nextProject.slug}`} className={styles.nextProjectCard}>
            <div>
              <span className={styles.nextCategory}>{nextProject.category}</span>
              <h3 className={styles.nextTitle}>{nextProject.title}</h3>
            </div>
            <ArrowRight size={24} className={styles.nextArrow} />
          </Link>
        </footer>
      </div>
    </article>
  );
}
