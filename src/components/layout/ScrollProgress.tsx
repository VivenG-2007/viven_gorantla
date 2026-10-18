"use client";

import React, { useEffect, useState } from "react";
import { useMotionStore } from "@/lib/store";
import styles from "./ScrollProgress.module.scss";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const lenis = useMotionStore((s) => s.lenis);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const p = Math.min(Math.max(scrollY / totalHeight, 0), 1);
        setProgress(p);
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    if (lenis) {
      const handleLenisScroll = ({ progress: p }: { progress: number }) => {
        setProgress(Math.min(Math.max(p, 0), 1));
      };
      lenis.on("scroll", handleLenisScroll);
      return () => {
        lenis.off("scroll", handleLenisScroll);
      };
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lenis]);

  return (
    <div className={styles.progressContainer} aria-hidden="true">
      <div
        className={styles.progressBar}
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
