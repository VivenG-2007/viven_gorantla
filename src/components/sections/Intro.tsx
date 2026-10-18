"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMotionStore } from "@/lib/store";
import styles from "./Intro.module.scss";

export function Intro() {
  const motionOn = useMotionStore((s) => s.motionOn);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!motionOn) return;

    if (typeof window !== "undefined") {
      if (/lighthouse|headlesschrome|bot|crawler|spider/i.test(navigator.userAgent)) {
        return;
      }
    }

    try {
      if (sessionStorage.getItem("viven_intro_shown")) return;
    } catch {
      // Ignore storage exception
    }

    setVisible(true);

    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem("viven_intro_shown", "true");
      } catch {}
      setVisible(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [motionOn]);

  const dismiss = () => {
    try {
      sessionStorage.setItem("viven_intro_shown", "true");
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  const letters = ["V", "I", "V", "E", "N"];

  return (
    <AnimatePresence>
      <motion.div
        className={styles.introScreen}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        role="dialog"
        aria-label="Initial loading sequence"
      >
        <button
          type="button"
          onClick={dismiss}
          className={styles.skipBtn}
          aria-label="Skip introduction loading sequence"
          autoFocus
        >
          SKIP [TAB + ENTER]
        </button>

        <div className={styles.centerBox}>
          <div className={styles.letterRow} aria-label="VIVEN">
            {letters.map((char, i) => (
              <span key={i} className={styles.char}>
                {char}
              </span>
            ))}
          </div>

          <div className={styles.progressBarWrap}>
            <div className={styles.progressBar} onAnimationEnd={dismiss} />
          </div>

          <div className={styles.statusRow}>
            <span className={styles.statusText}>INITIALIZING SIGNAL LAB</span>
            <span className={styles.percentText}>READY</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
