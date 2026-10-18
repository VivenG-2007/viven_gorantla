"use client";

import React, { useState } from "react";
import Image from "next/image";
import { awards, type Award, type AwardCategory } from "@/content/awards";
import { useMotionStore } from "@/lib/store";
import { ShieldCheck, Award as TrophyIcon } from "lucide-react";
import styles from "./AwardGallery.module.scss";

const FILTERS: (AwardCategory | "All")[] = [
  "All",
  "Hackathon",
  "Training",
  "Coding",
  "Community",
];

export function AwardGallery() {
  const setLightboxItem = useMotionStore((s) => s.setLightboxItem);
  const [activeFilter, setActiveFilter] = useState<AwardCategory | "All">("All");

  const filteredAwards =
    activeFilter === "All"
      ? awards
      : awards.filter((a) => a.category === activeFilter);

  const getVerificationLabel = (v: Award["verification"]) => {
    switch (v) {
      case "document":
        return "Certificate / Trophy Supplied";
      case "training":
        return "Training Completed";
      case "self-reported":
        return "Self-Reported Placement";
      case "profile":
        return "Profile Verified";
      default:
        return v;
    }
  };

  return (
    <section id="proof" data-theme="paper" className={`section-padding ${styles.gallerySection}`}>
      <div className="container">
        <div className={styles.headerBlock}>
          <span className={styles.paperLabel}>06 / HONEST EVIDENCE &amp; PROOF</span>
          <h2 className={styles.sectionTitle}>Certificates, Trophies &amp; Milestones</h2>
          <p className={styles.sectionLead}>
            Every credential is captioned honestly. No inflated rankings, no unverified claims.
            Click any tile to inspect the full uncropped document.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className={styles.filterRow} role="tablist" aria-label="Evidence filters">
          {FILTERS.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeFilter === cat}
              className={`${styles.filterBtn} ${activeFilter === cat ? styles.filterActive : ""}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Evidence Grid */}
        <div className={styles.galleryGrid}>
          {filteredAwards.map((item) => (
            <div
              key={item.id}
              className={`${styles.awardCard} ${
                item.id === "launchpadx" || item.id === "blackbox" ? styles.heroCard : ""
              }`}
              onClick={() => item.image && setLightboxItem(item)}
              data-cursor={item.image ? "INSPECT" : ""}
            >
              {item.image ? (
                <div className={styles.cardImageWrap}>
                  <Image
                    src={`/images/${item.image}.jpg`}
                    alt={item.caption || item.title}
                    width={800}
                    height={600}
                    className={styles.cardImg}
                    unoptimized
                  />
                  <div className={styles.imgTagOverlay}>
                    <span className={styles.inspectPill}>CLICK TO INSPECT</span>
                  </div>
                </div>
              ) : (
                <div className={styles.typographicTile}>
                  <TrophyIcon size={32} className={styles.typoIcon} />
                  <span className={styles.typoCategory}>{item.category}</span>
                </div>
              )}

              <div className={styles.cardContent}>
                <div className={styles.cardMetaTop}>
                  <span className={styles.dateLabel}>{item.date}</span>
                  <span className={styles.verifyPill}>
                    <ShieldCheck size={12} />
                    {getVerificationLabel(item.verification)}
                  </span>
                </div>

                <h3 className={styles.awardTitle}>{item.title}</h3>
                <p className={styles.orgLabel}>{item.org}</p>
                <p className={styles.captionText}>{item.caption}</p>
              </div>
            </div>
          ))}

          {/* Group Photo: Team at DECODEX 2.0 Presentation Context */}
          {activeFilter === "All" || activeFilter === "Hackathon" ? (
            <div
              className={styles.awardCard}
              onClick={() =>
                setLightboxItem({
                  id: "decodex-group-photo",
                  title: "DECODEX 2.0 Workshop Presentation",
                  org: "Hackability × GCET Data Science × ISTE",
                  date: "15–16 Oct 2026",
                  category: "Hackathon",
                  verification: "document",
                  caption: "Team at DECODEX 2.0 presentation (team/event context only; no individual identification).",
                  image: "team/decodex-group",
                })
              }
              data-cursor="INSPECT"
            >
              <div className={styles.cardImageWrap}>
                <Image
                  src="/images/team/decodex-group.jpg"
                  alt="Team at DECODEX 2.0 presentation"
                  width={800}
                  height={600}
                  className={styles.cardImg}
                  unoptimized
                />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardMetaTop}>
                  <span className={styles.dateLabel}>15–16 Oct 2026</span>
                  <span className={styles.verifyPill}>Event Context</span>
                </div>
                <h3 className={styles.awardTitle}>Team at DECODEX 2.0 presentation</h3>
                <p className={styles.orgLabel}>Hackability × GCET Data Science</p>
                <p className={styles.captionText}>
                  Event context photo from the 2-day workshop on building AI agents.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
