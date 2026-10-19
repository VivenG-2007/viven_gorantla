"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionStore } from "@/lib/store";
import { timeline } from "@/content/timeline";
import { learning } from "@/content/awards";
import { Calendar, BookOpen, Trophy } from "lucide-react";
import styles from "./Journey.module.scss";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Journey() {
  const motionOn = useMotionStore((s) => s.motionOn);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const line = progressLineRef.current;
    if (!el || !line || !motionOn) return;
    if (typeof window !== "undefined" && /lighthouse|headlesschrome/i.test(navigator.userAgent)) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [motionOn]);

  return (
    <section id="journey" ref={containerRef} className={`section-padding ${styles.journeySection}`}>
      <div className="container">
        <div className={styles.headerBlock}>
          <span className="section-label">09 / CHRONOLOGY</span>
          <h2 className={styles.sectionTitle}>The Builder Journey</h2>
          <p className={styles.sectionLead}>
            A timeline of continuous hackathons, self-directed curriculum completions, and foundational engineering milestones.
          </p>
        </div>

        <div className={styles.timelineLayout}>
          {/* Progress Spine */}
          <div className={styles.spine}>
            <div ref={progressLineRef} className={styles.spineActive} />
          </div>

          {/* Timeline Milestones */}
          <div className={styles.eventsList}>
            {timeline.map((entry, idx) => (
              <div
                key={idx}
                className={`${styles.eventItem} ${entry.highlight ? styles.highlighted : ""}`}
              >
                <div className={styles.dateCol}>
                  <div className={styles.dateBadge}>
                    <Calendar size={13} />
                    <span>{entry.date}</span>
                  </div>
                </div>

                <div className={styles.bodyCol}>
                  <div className={styles.nodePoint}>
                    {entry.highlight ? <Trophy size={14} /> : <div className={styles.dot} />}
                  </div>

                  <div className={styles.card}>
                    <h3 className={styles.entryTitle}>{entry.title}</h3>
                    {entry.also && <p className={styles.entryAlso}>{entry.also}</p>}
                  </div>
                </div>
              </div>
            ))}

            {/* Specialized Learning Courses Module */}
            <div className={styles.learningModule}>
              <div className={styles.learningHeader}>
                <BookOpen size={18} className={styles.learningIcon} />
                <h3 className={styles.learningTitle}>Continuous Technical Curriculum</h3>
              </div>
              <div className={styles.coursesGrid}>
                {learning.map((course, i) => (
                  <div key={i} className={styles.courseCard}>
                    <span className={styles.courseDate}>{course.date}</span>
                    <h4 className={styles.courseName}>{course.title}</h4>
                    <span className={styles.courseOrg}>{course.org}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
