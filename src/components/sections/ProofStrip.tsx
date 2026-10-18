"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useMotionStore } from "@/lib/store";
import styles from "./ProofStrip.module.scss";

export function ProofStrip() {
  const lenis = useMotionStore((s) => s.lenis);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      if (lenis) {
        lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
      window.history.pushState(null, "", href);
    }
  };

  return (
    <section className={styles.proofStrip} aria-label="Engineering and competitive track record">
      <div className={styles.container}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>
            <strong>8</strong>
            <span className={styles.statAccent}>+</span>
          </div>
          <p className={styles.statDesc}>production AI &amp; systems engineered</p>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statNumber}>
            <strong>1</strong>
            <span className={styles.statAccent}>st</span>
          </div>
          <p className={styles.statDesc}>place · Blackbox AI 1.0 (IEEE CS &amp; GCET)</p>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statNumber}>
            <strong>9</strong>
            <span className={styles.statAccent}>th</span>
          </div>
          <p className={styles.statDesc}>national rank · LaunchpadX-2026 (SNIST)</p>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statNumber}>
            <strong>350</strong>
            <span className={styles.statAccent}>+</span>
          </div>
          <p className={styles.statDesc}>DSA problems solved across Hive &amp; LeetCode</p>
        </div>

        <a
          href="#work"
          onClick={(e) => handleScrollTo(e, "#work")}
          className={styles.impactAction}
          aria-label="Navigate to engineering architectures and impact"
        >
          <span className={styles.impactText}>
            THE CODE.<br />THE REAL-WORLD PROOF.
          </span>
          <ArrowUpRight size={22} className={styles.impactArrow} />
        </a>
      </div>
    </section>
  );
}
