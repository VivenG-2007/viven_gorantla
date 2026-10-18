"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useMotionStore } from "@/lib/store";
import { awards } from "@/content/awards";
import { X, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import styles from "./Lightbox.module.scss";

export function Lightbox() {
  const item = useMotionStore((s) => s.lightboxItem);
  const setItem = useMotionStore((s) => s.setLightboxItem);
  const lenis = useMotionStore((s) => s.lenis);

  const awardsWithImages = awards.filter((a) => a.image !== null);
  const currentIndex = item ? awardsWithImages.findIndex((a) => a.id === item.id) : -1;

  useEffect(() => {
    if (item) {
      if (lenis) lenis.stop();
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setItem(null);
        } else if (e.key === "ArrowLeft") {
          const prevIdx = (currentIndex - 1 + awardsWithImages.length) % awardsWithImages.length;
          setItem(awardsWithImages[prevIdx]);
        } else if (e.key === "ArrowRight") {
          const nextIdx = (currentIndex + 1) % awardsWithImages.length;
          setItem(awardsWithImages[nextIdx]);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        if (lenis) lenis.start();
        document.body.style.overflow = "";
      };
    }
  }, [item, lenis, currentIndex, awardsWithImages, setItem]);

  if (!item) return null;

  const nextItem = () => {
    const nextIdx = (currentIndex + 1) % awardsWithImages.length;
    setItem(awardsWithImages[nextIdx]);
  };

  const prevItem = () => {
    const prevIdx = (currentIndex - 1 + awardsWithImages.length) % awardsWithImages.length;
    setItem(awardsWithImages[prevIdx]);
  };

  return (
    <AnimatePresence>
      <div
        className={styles.backdrop}
        onClick={() => setItem(null)}
        role="dialog"
        aria-modal="true"
        aria-label={`Evidence viewer: ${item.title}`}
        data-lenis-prevent
      >
        <motion.div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.topBar}>
            <div className={styles.badgeGroup}>
              <span className={styles.verificationBadge}>
                <ShieldCheck size={14} />
                <span>
                  {item.verification === "document"
                    ? "Certificate / Trophy Verified"
                    : item.verification === "training"
                    ? "Training Completion"
                    : item.verification === "self-reported"
                    ? "Self-Reported"
                    : "Public Profile"}
                </span>
              </span>
              <span className={styles.categoryBadge}>{item.category}</span>
            </div>

            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setItem(null)}
              aria-label="Close evidence viewer"
            >
              <X size={20} />
            </button>
          </div>

          <div className={styles.imageStage}>
            {item.image && (
              <div className={styles.imageContainer}>
                <Image
                  src={`/images/${item.image}.jpg`}
                  alt={item.caption || item.title}
                  width={1400}
                  height={1000}
                  className={styles.evidenceImage}
                  priority
                  unoptimized
                />
              </div>
            )}

            {awardsWithImages.length > 1 && (
              <>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.prevBtn}`}
                  onClick={prevItem}
                  aria-label="Previous proof image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.nextBtn}`}
                  onClick={nextItem}
                  aria-label="Next proof image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          <div className={styles.captionPanel}>
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{item.title}</h3>
              <span className={styles.date}>{item.date}</span>
            </div>
            <p className={styles.org}>{item.org}</p>
            <p className={styles.caption}>{item.caption}</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
