"use client";

import React, { useState } from "react";
import { stackCategories, getProjectsForTech } from "@/content/stack";
import { projects } from "@/content/projects";
import { Info } from "lucide-react";
import styles from "./TechConstellation.module.scss";

export function TechConstellation() {
  const [activeTech, setActiveTech] = useState<string | null>(null);

  const matchedProjects = activeTech ? getProjectsForTech(activeTech) : [];

  return (
    <section id="stack" className={`section-padding ${styles.stackSection}`}>
      <div className="container">
        <div className={styles.headerBlock}>
          <span className="section-label">08 / ARCHITECTURE CONSTELLATION</span>
          <h2 className={styles.sectionTitle}>Tools, Frameworks &amp; Protocols</h2>
          <p className={styles.sectionLead}>
            Technologies leveraged across projects, pipelines, and technical explorations. Hover or click any technology to see which systems implement it.
          </p>

          <div className={styles.captionBox}>
            <Info size={16} className={styles.infoIcon} />
            <p className={styles.captionText}>
              Technologies used across my projects and learning — not a claim of equal depth. No proficiency bars or fabricated percentage metrics.
            </p>
          </div>
        </div>

        {/* Dynamic Project Link Indicator Banner */}
        {activeTech && (
          <div className={styles.activeTechBanner}>
            <span className={styles.bannerKey}>ACTIVE SELECTION:</span>
            <strong className={styles.bannerTech}>{activeTech}</strong>
            <span className={styles.bannerArrow}>→</span>
            <span className={styles.bannerProjects}>
              {matchedProjects.length > 0 ? (
                matchedProjects.map((slug) => {
                  const proj = projects.find((p) => p.slug === slug);
                  return (
                    <a
                      key={slug}
                      href={`#work`}
                      className={styles.bannerProjectPill}
                    >
                      {proj?.title || slug}
                    </a>
                  );
                })
              ) : (
                <span className={styles.generalKnowledgeTag}>Foundational practice &amp; course deep dive</span>
              )}
            </span>
          </div>
        )}

        {/* Grouped Typographic Columns */}
        <div className={styles.categoryGrid}>
          {Object.entries(stackCategories).map(([category, items]) => (
            <div key={category} className={styles.categoryCard}>
              <h3 className={styles.categoryTitle}>{category}</h3>
              <div className={styles.tagsFlow}>
                {items.map((tech) => {
                  const isSelected = activeTech === tech;
                  const projCount = getProjectsForTech(tech).length;

                  return (
                    <button
                      key={tech}
                      type="button"
                      className={`${styles.techTag} ${isSelected ? styles.tagActive : ""}`}
                      onMouseEnter={() => setActiveTech(tech)}
                      onClick={() => setActiveTech(tech === activeTech ? null : tech)}
                      aria-label={`${tech} used in ${projCount} projects`}
                      data-cursor="TRACE"
                    >
                      <span className={styles.tagLabel}>{tech}</span>
                      {projCount > 0 && (
                        <span className={styles.countBadge}>{projCount}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
