"use client";

import React, { useState } from "react";
import { projects } from "@/content/projects";
import { StatusChip } from "@/components/ui/StatusChip";
import { ChevronDown, Layers, Server, Database, Cloud, Terminal } from "lucide-react";
import styles from "./MoreBuilds.module.scss";

export function MoreBuilds() {
  const secondaryProjects = projects.filter((p) => !p.featured);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const toggleExpand = (slug: string) => {
    setExpandedSlug(expandedSlug === slug ? null : slug);
  };

  const getIconForCategory = (cat: string) => {
    if (cat.includes("Backend")) return <Server size={18} />;
    if (cat.includes("database")) return <Database size={18} />;
    if (cat.includes("Cloud")) return <Cloud size={18} />;
    if (cat.includes("Agentic")) return <Layers size={18} />;
    return <Terminal size={18} />;
  };

  return (
    <section id="builds" className={`section-padding ${styles.buildsSection}`}>
      <div className="container">
        <div className={styles.headerBlock}>
          <span className="section-label">05 / REUSABLE INFRASTRUCTURE</span>
          <h2 className={styles.sectionTitle}>More Builds &amp; Prototypes</h2>
          <p className={styles.sectionLead}>
            Microservices, schema generators, and cloud studies engineered across hackathons and academic deep dives.
          </p>
        </div>

        <div className={styles.tableWrap}>
          {secondaryProjects.map((p) => {
            const isExpanded = expandedSlug === p.slug;

            return (
              <div
                key={p.slug}
                className={`${styles.row} ${isExpanded ? styles.expanded : ""}`}
                onClick={() => toggleExpand(p.slug)}
                data-cursor="EXPAND"
              >
                <div className={styles.rowMain}>
                  <div className={styles.categoryBadge}>
                    {getIconForCategory(p.category)}
                    <span>{p.category}</span>
                  </div>

                  <div className={styles.titleCol}>
                    <h3 className={styles.projectTitle}>{p.title}</h3>
                    <p className={styles.pitchText}>{p.pitch}</p>
                  </div>

                  <div className={styles.stackCol}>
                    {p.stack?.slice(0, 4).map((tech) => (
                      <span key={tech} className={styles.stackTag}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className={styles.statusCol}>
                    <StatusChip status={p.status} />
                  </div>

                  <button
                    type="button"
                    className={styles.expandTrigger}
                    aria-label={`Toggle details for ${p.title}`}
                    aria-expanded={isExpanded}
                  >
                    <ChevronDown
                      size={18}
                      className={`${styles.chevron} ${isExpanded ? styles.chevronRotated : ""}`}
                    />
                  </button>
                </div>

                {isExpanded && (
                  <div className={styles.expandedContent} onClick={(e) => e.stopPropagation()}>
                    {p.features && (
                      <div className={styles.detailSection}>
                        <h4 className={styles.detailHeading}>KEY CAPABILITIES:</h4>
                        <ul className={styles.featureList}>
                          {p.features.map((feat, i) => (
                            <li key={i}>{feat}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {p.approach && (
                      <div className={styles.detailSection}>
                        <h4 className={styles.detailHeading}>APPROACH & ARCHITECTURE:</h4>
                        <p className={styles.detailBody}>{p.approach}</p>
                      </div>
                    )}

                    {p.flow && (
                      <div className={styles.detailSection}>
                        <h4 className={styles.detailHeading}>PIPELINE FLOW:</h4>
                        <div className={styles.flowChain}>
                          {p.flow.map((step, i) => (
                            <React.Fragment key={i}>
                              <span className={styles.flowStep}>{step}</span>
                              {i < p.flow!.length - 1 && <span className={styles.flowArrow}>→</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}

                    {p.note && (
                      <div className={styles.noteBox}>
                        <span className={styles.noteTag}>NOTE:</span>
                        <p>{p.note}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
