"use client";

import React, { useState, useEffect } from "react";
import { person } from "@/content/profile";
import { useMotionStore } from "@/lib/store";
import { ArrowUp, Code2, Mail, FileText } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import styles from "./Footer.module.scss";

export function Footer() {
  const lenis = useMotionStore((s) => s.lenis);
  const [istTime, setIstTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setIstTime(now.toLocaleTimeString("en-US", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.5 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer id="contact" className={styles.footer}>
      <div className="container">
        <div className={styles.topSection}>
          <div className={styles.headingBlock}>
            <span className="section-label">11 / CONTACT & SIGNAL</span>
            <h2 className={styles.giantTitle}>
              Let&apos;s build systems.<br />
              <em>That actually hold up.</em>
            </h2>
            <p className={styles.subtext}>
              Exploring agentic AI architectures, developer tools, and verifiable backend systems.
              Based in Hyderabad, India · Computing at the edge.
            </p>
          </div>

          <div className={styles.ctaGrid}>
            <a
              href={person.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.ctaBtn} ${styles.ctaPrimary}`}
              data-cursor="CONNECT"
            >
              <LinkedinIcon size={18} />
              <span>Connect on LinkedIn</span>
              <span className={styles.btnArrow}>↗</span>
            </a>

            <a
              href={person.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
              data-cursor="CODE"
            >
              <GithubIcon size={18} />
              <span>GitHub Profile</span>
              <span className={styles.btnArrow}>↗</span>
            </a>

            <a
              href={person.links.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
              data-cursor="STATS"
            >
              <Code2 size={18} />
              <span>LeetCode Practice</span>
              <span className={styles.btnArrow}>↗</span>
            </a>

            {person.email && (
              <a
                href={`mailto:${person.email}`}
                className={styles.ctaBtn}
                data-cursor="MAIL"
              >
                <Mail size={18} />
                <span>{person.email}</span>
              </a>
            )}

            {person.resumeUrl && (
              <a
                href={person.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaBtn}
                data-cursor="RESUME"
              >
                <FileText size={18} />
                <span>Resume (PDF)</span>
              </a>
            )}
          </div>
        </div>

        <div className={styles.metaRow}>
          <div className={styles.timeBlock}>
            <span className={styles.timeDot} />
            <span className={styles.monoKey}>HYDERABAD, IN (IST):</span>
            <span className={styles.monoVal}>{istTime || "12:00:00 PM"}</span>
          </div>

          <div className={styles.copyBlock}>
            <span>{person.name} · B.Tech GCET 2025–2029</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className={styles.backTopBtn}
            aria-label="Back to top"
            data-cursor="TOP"
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
