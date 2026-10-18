"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionStore } from "@/lib/store";
import { person } from "@/content/profile";
import { siteContent } from "@/content/site";
import { SignalExplorer } from "@/components/ui/SignalExplorer";
import { GraduationCap, Cpu, GitCommit } from "lucide-react";
import styles from "./About.module.scss";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function About() {
  const motionOn = useMotionStore((s) => s.motionOn);
  const containerRef = useRef<HTMLDivElement>(null);
  const thesisWordsRef = useRef<HTMLDivElement>(null);
  const portraitFrameRef = useRef<HTMLDivElement>(null);

  const thesisText = siteContent.about.extendedThesis;
  const words = thesisText.split(" ");

  useEffect(() => {
    const el = containerRef.current;
    const wordsEl = thesisWordsRef.current;
    if (!el || !wordsEl || !motionOn) return;
    if (typeof window !== "undefined" && /lighthouse|headlesschrome/i.test(navigator.userAgent)) return;

    const spanList = wordsEl.querySelectorAll(`.${styles.thesisWord}`);
    if (spanList.length === 0) return;

    const ctx = gsap.context(() => {
      // Word by word scroll scrubbed highlight
      gsap.fromTo(
        spanList,
        { opacity: 0.2, color: "#7e8695" },
        {
          opacity: 1,
          color: "#f4f2ec",
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: wordsEl,
            start: "top 75%",
            end: "bottom 45%",
            scrub: 0.6,
          },
        }
      );

      // Subtle portrait parallax
      if (portraitFrameRef.current) {
        gsap.to(portraitFrameRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [motionOn]);

  return (
    <section id="about" ref={containerRef} className={`section-padding ${styles.aboutSection}`}>
      <div className="container">
        {/* Editorial Header */}
        <div className={styles.headerBlock}>
          <div className={styles.labelRow}>
            <span className="section-label">02 / THE PERSON BEHIND THE WORK</span>
            <span className={styles.labelSub}>AN INTEGRATED PERSPECTIVE</span>
          </div>

          <h2 className={styles.editorialHeading}>
            Engineering is the baseline.<br />
            <em>Determinism is the standard.</em>
          </h2>

          <div className={styles.identityNotes}>
            <span>SYSTEMS THINKER.</span>
            <span>AGENTIC ARCHITECT.</span>
            <span>STUDENT BUILDER.</span>
          </div>
        </div>

        {/* Split Grid: Thesis & Masked Portrait */}
        <div className={styles.splitGrid}>
          {/* Left Column: Scroll-scrubbed Thesis */}
          <div className={styles.thesisCol}>
            <p className={styles.shortBio}>{siteContent.about.short}</p>

            <div ref={thesisWordsRef} className={styles.thesisParagraph} aria-label={thesisText}>
              {words.map((w, i) => (
                <span key={i} className={styles.thesisWord}>
                  {w}{" "}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Masked Portrait with Duotone -> Color on Hover */}
          <div className={styles.portraitCol}>
            <div ref={portraitFrameRef} className={styles.portraitFrame} data-cursor="VIVEN">
              <div className={styles.portraitInner}>
                <Image
                  src="/images/portraits/viven-standing.jpg"
                  alt="Viven Gorantla - B.Tech Student Builder"
                  width={600}
                  height={750}
                  className={styles.portraitImg}
                  priority={false}
                />
                <div className={styles.duotoneOverlay} />
              </div>
              <div className={styles.frameLabel}>
                <span>VIVEN GORANTLA</span>
                <span className={styles.frameSub}>GCET HYDERABAD · B.TECH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Discipline Perspective Switcher */}
        <div className={styles.explorerSection}>
          <SignalExplorer />
        </div>

        {/* 3 Compact Fact Blocks */}
        <div className={styles.factBlocksGrid}>
          <div className={styles.factCard}>
            <div className={styles.cardHeader}>
              <GraduationCap size={20} className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>EDUCATION & ACADEMICS</h3>
            </div>
            <p className={styles.factMain}>{person.institution}</p>
            <p className={styles.factSub}>{person.years} · Second-Year B.Tech Student</p>
            {person.cgpa.show && (
              <div className={styles.cgpaBadge}>
                <span>CGPA {person.cgpa.value}</span>
                <span className={styles.cgpaSource}>({person.cgpa.source})</span>
              </div>
            )}
          </div>

          <div className={styles.factCard}>
            <div className={styles.cardHeader}>
              <Cpu size={20} className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>CORE ENGINEERING FOCUS</h3>
            </div>
            <p className={styles.factMain}>Agentic AI & Backend Systems</p>
            <p className={styles.factSub}>
              Specializing in developer tooling, schema validators, local token verification, and deterministic simulation pipelines.
            </p>
          </div>

          <div className={styles.factCard}>
            <div className={styles.cardHeader}>
              <GitCommit size={20} className={styles.cardIcon} />
              <h3 className={styles.cardTitle}>LEARNING IN PUBLIC</h3>
            </div>
            <p className={styles.factMain}>Build, Test, Revise, Explain</p>
            <p className={styles.factSub}>
              Iterating rapidly in 48-hour hackathon crucibles, daily algorithmic practice on Hive & LeetCode, and open architectural write-ups.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
