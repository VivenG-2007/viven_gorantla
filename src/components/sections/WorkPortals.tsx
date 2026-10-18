"use client";

import React from "react";
import Link from "next/link";
import { projects } from "@/content/projects";
import { StatusChip } from "@/components/ui/StatusChip";
import { ArrowUpRight, Shield, Terminal, Activity } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import styles from "./WorkPortals.module.scss";

export function WorkPortals() {
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="work" className={`section-padding ${styles.workSection}`}>
      <div className="container">
        {/* Editorial Section Header */}
        <div className={styles.headerBlock}>
          <div className={styles.labelRow}>
            <span className="section-label">04 / SELECTED WORK</span>
            <span className={styles.labelSub}>ENGINEERED &amp; SHIPPED</span>
          </div>
          <h2 className={styles.sectionTitle}>
            Ideas are a start.<br />
            <em>This is the architecture.</em>
          </h2>
          <p className={styles.sectionLead}>
            Three core systems exploring code security triage, crisis digital twin simulations, and empirical black-box probing.
          </p>
        </div>

        <div className={styles.portalsList}>
          {featured.map((project, idx) => (
            <article key={project.slug} className={styles.portalCard}>
              <div className={styles.portalGrid}>
                {/* Left: Project Metadata & Copy */}
                <div className={styles.infoCol}>
                  <div className={styles.topRow}>
                    <span className={styles.orderNumeral}>0{idx + 1}</span>
                    <StatusChip status={project.status} />
                  </div>

                  <h3 className={styles.projectTitle}>
                    <Link href={`/work/${project.slug}`} className={styles.titleLink}>
                      {project.title}
                    </Link>
                  </h3>

                  <p className={styles.category}>{project.category}</p>
                  <p className={styles.pitch}>{project.pitch}</p>

                  {project.problem && (
                    <div className={styles.problemBox}>
                      <span className={styles.problemLabel}>THE BOTTLENECK:</span>
                      <p>{project.problem}</p>
                    </div>
                  )}

                  <div className={styles.stackChips}>
                    {project.stack?.slice(0, 6).map((tech) => (
                      <span key={tech} className={styles.techChip}>
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className={styles.actionsRow}>
                    <Link
                      href={`/work/${project.slug}`}
                      className={styles.caseStudyBtn}
                      data-cursor="CASE STUDY"
                    >
                      <span>Read Case Study</span>
                      <ArrowUpRight size={16} />
                    </Link>

                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.sourceBtn}
                        data-cursor="SOURCE"
                      >
                        <GithubIcon size={16} />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: Architectural Portal Visualizer with Browser Frame */}
                <div className={styles.visualCol}>
                  <Link
                    href={`/work/${project.slug}`}
                    className={styles.portalVisualFrame}
                    aria-label={`Inspect ${project.title} architecture`}
                    data-cursor="PORTAL"
                  >
                    {/* Realistic Browser Top Bar */}
                    <div className={styles.workBrowserBar}>
                      <span className={styles.browserDots}>
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className={styles.browserDomain}>
                        {project.slug === "patchline"
                          ? "patchline.ai"
                          : project.slug === "crisis-commander"
                          ? "crisis-commander.sys"
                          : "blackbox-probe.ai"}
                      </span>
                      <span className={styles.browserExt}>↗</span>
                    </div>

                    <div className={styles.portalCanvasMock}>
                      <div className={styles.gridOverlay} />
                      
                      {project.slug === "patchline" && (
                        <div className={styles.archGraphic}>
                          <Shield size={44} className={styles.graphicIcon} />
                          <div className={styles.terminalLines}>
                            <code>&gt; tree-sitter.parse(diff)</code>
                            <code>&gt; semgrep.scan() -&gt; 0 findings</code>
                            <code>&gt; verifier.retest() -&gt; PASSED</code>
                          </div>
                        </div>
                      )}

                      {project.slug === "crisis-commander" && (
                        <div className={styles.archGraphic}>
                          <Activity size={44} className={styles.graphicIcon} />
                          <div className={styles.terminalLines}>
                            <code>&gt; simulation_engine.fixed_point()</code>
                            <code>&gt; blast_radius.compute_dijkstra()</code>
                            <code>&gt; rbac.gate(COMMANDER) -&gt; 200 OK</code>
                          </div>
                        </div>
                      )}

                      {project.slug === "blackbox-ai" && (
                        <div className={styles.archGraphic}>
                          <Terminal size={44} className={styles.graphicIcon} />
                          <div className={styles.terminalLines}>
                            <code>&gt; probe.discover_ranges()</code>
                            <code>&gt; ofat.analyze_sensitivity()</code>
                            <code>&gt; ledger.append(atlas_db)</code>
                          </div>
                        </div>
                      )}

                      <div className={styles.portalFooter}>
                        <span className={styles.portalBadge}>SPECIFICATION MAP</span>
                        <span className={styles.inspectHint}>INSPECT ARCHITECTURE →</span>
                      </div>
                    </div>

                    {/* Floating corner artwork arrow */}
                    <span className={styles.workArtworkArrow} aria-hidden="true">
                      <ArrowUpRight size={20} />
                    </span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
