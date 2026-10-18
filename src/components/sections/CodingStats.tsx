"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { metrics } from "@/content/metrics";
import { useMotionStore } from "@/lib/store";
import { Code2, ExternalLink, Terminal, Award as BadgeIcon } from "lucide-react";
import styles from "./CodingStats.module.scss";

export function CodingStats() {
  const setLightboxItem = useMotionStore((s) => s.setLightboxItem);

  // Illustrative abstract grid cells (clearly labelled illustrative)
  const gridCells = useMemo(() => {
    return Array.from({ length: 98 }).map((_, i) => {
      // Deterministic pseudo-intensity
      const intensity = ((i * 17 + 5) % 5);
      return intensity;
    });
  }, []);

  return (
    <section id="coding" className={`section-padding ${styles.codingSection}`}>
      <div className="container">
        <div className={styles.headerBlock}>
          <span className="section-label">07 / CODING PRACTICE &amp; METRICS</span>
          <h2 className={styles.sectionTitle}>Algorithmic Consistency</h2>
          <p className={styles.sectionLead}>
            Daily practice across college competitive platforms and LeetCode. Metrics are honest snapshots as of {metrics.asOf}.
          </p>
        </div>

        <div className={styles.statsGrid}>
          {/* Panel 1: GCET Hive Platform (C language focus) */}
          <div className={styles.statPanel}>
            <div className={styles.panelTop}>
              <div className={styles.platformBadge}>
                <Terminal size={16} />
                <span>GCET HIVE PLATFORM</span>
              </div>
              <span className={styles.snapshotDate}>Snapshot {metrics.asOf}</span>
            </div>

            <div className={styles.mainMetricRow}>
              <div className={styles.numberBlock}>
                <span className={styles.bigNum}>{metrics.hive.solved}</span>
                <span className={styles.numUnit}>PROBLEMS SOLVED</span>
              </div>
              <div className={styles.langPill}>Primary Language: {metrics.hive.language}</div>
            </div>

            <div className={styles.metaDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>Total Submissions:</span>
                <span className={styles.detailVal}>{metrics.hive.submissions}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>Active Window:</span>
                <span className={styles.detailVal}>{metrics.hive.window}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>Privacy Status:</span>
                <span className={styles.privacyTag}>Confidential Student ID Masked</span>
              </div>
            </div>

            {/* Illustrative Contribution Grid */}
            <div className={styles.heatmapBlock}>
              <div className={styles.heatmapHeader}>
                <span className={styles.heatmapTitle}>ACTIVITY DENSITY PATTERN</span>
                <span className={styles.illustrativeTag}>[ILLUSTRATIVE PATTERN]</span>
              </div>
              <div className={styles.gridCells} aria-hidden="true">
                {gridCells.map((val, idx) => (
                  <div
                    key={idx}
                    className={styles.cell}
                    data-intensity={val}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Panel 2: LeetCode Verified Badge & Separate Language Counters */}
          <div className={styles.statPanel}>
            <div className={styles.panelTop}>
              <div className={styles.platformBadge}>
                <Code2 size={16} />
                <span>LEETCODE PROFILE</span>
              </div>
              <a
                href={metrics.leetcode.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.profileLink}
                data-cursor="PROFILE"
              >
                <span>View Profile</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className={styles.badgeShowcase}>
              <div
                className={styles.badgeThumbnail}
                onClick={() =>
                  setLightboxItem({
                    id: "leetcode50",
                    title: "LeetCode 50 Days Badge 2026",
                    org: "LeetCode",
                    date: "2026",
                    category: "Coding",
                    verification: "profile",
                    caption: "Official LeetCode achievement badge awarded for solving algorithmic problems on 50+ days in 2026.",
                    image: "coding/leetcode-50-days",
                  })
                }
                data-cursor="INSPECT"
              >
                <Image
                  src="/images/coding/leetcode-50-days.jpg"
                  alt="LeetCode 50 Days Badge 2026"
                  width={240}
                  height={120}
                  className={styles.badgeImg}
                  unoptimized
                />
                <span className={styles.thumbInspectPill}>INSPECT BADGE</span>
              </div>

              <div className={styles.badgeInfo}>
                <div className={styles.badgeHeaderTag}>
                  <BadgeIcon size={14} className={styles.badgeIcon} />
                  <span>ANNUAL MILESTONE</span>
                </div>
                <h3 className={styles.badgeTitle}>{metrics.leetcode.badge}</h3>
                <p className={styles.badgeSubtitle}>
                  Awarded for solving algorithmic problems on 50+ distinct days in 2026.
                </p>
              </div>
            </div>

            <div className={styles.countersBox}>
              <h4 className={styles.countersHeading}>
                LANGUAGE-SPECIFIC SOLVE COUNTS:
              </h4>
              <p className={styles.counterWarning}>
                *Tracked separately per platform; never summed as a single total.
              </p>

              <div className={styles.chipsRow}>
                <div className={styles.langCountCard}>
                  <span className={styles.countNumber}>
                    {metrics.leetcode.languageCounters.C}
                  </span>
                  <span className={styles.countLang}>C Problems</span>
                </div>

                <div className={styles.langCountCard}>
                  <span className={styles.countNumber}>
                    {metrics.leetcode.languageCounters.MySQL}
                  </span>
                  <span className={styles.countLang}>MySQL Problems</span>
                </div>

                <div className={styles.langCountCard}>
                  <span className={styles.countNumber}>
                    {metrics.leetcode.languageCounters.Java}
                  </span>
                  <span className={styles.countLang}>Java Problems</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
