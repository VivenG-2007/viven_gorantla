"use client";

import React, { useState } from "react";
import { siteContent } from "@/content/site";
import { ChevronDown, CheckCircle2 } from "lucide-react";
import styles from "./Principles.module.scss";

export function Principles() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="principles" className={`section-padding ${styles.principlesSection}`}>
      <div className="container">
        <div className={styles.headerBlock}>
          <span className="section-label">10 / HOW I WORK</span>
          <h2 className={styles.sectionTitle}>Builder Principles</h2>
          <p className={styles.sectionLead}>
            Core heuristics distilled through rapid prototyping, hackathon marathons, and debugging autonomous workflows.
          </p>
        </div>

        <div className={styles.accordionWrap}>
          {siteContent.principles.map((p, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={p.num}
                className={`${styles.accordionItem} ${isOpen ? styles.open : ""}`}
                onClick={() => toggle(idx)}
                data-cursor="EXPAND"
              >
                <div className={styles.itemHeader}>
                  <div className={styles.headerLeft}>
                    <span className={styles.numeral}>{p.num}</span>
                    <h3 className={styles.title}>{p.title}</h3>
                  </div>

                  <div className={styles.headerRight}>
                    <span className={styles.tagline}>{p.tagline}</span>
                    <button
                      type="button"
                      className={styles.chevronBtn}
                      aria-label={`Toggle principle ${p.title}`}
                      aria-expanded={isOpen}
                    >
                      <ChevronDown
                        size={20}
                        className={`${styles.chevron} ${isOpen ? styles.chevronRotated : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className={styles.itemBody} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.exampleCard}>
                      <div className={styles.exampleTag}>
                        <CheckCircle2 size={16} />
                        <span>DEMONSTRATED IN PRACTICE</span>
                      </div>
                      <p className={styles.exampleText}>{p.example}</p>
                    </div>
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
