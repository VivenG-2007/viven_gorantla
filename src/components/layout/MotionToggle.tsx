"use client";

import React from "react";
import { useMotionStore } from "@/lib/store";
import styles from "./MotionToggle.module.scss";

export function MotionToggle() {
  const motionOn = useMotionStore((s) => s.motionOn);
  const setMotionOn = useMotionStore((s) => s.setMotionOn);

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setMotionOn(!motionOn)}
      aria-label={`Motion: ${motionOn ? "ON" : "OFF"} - toggle animations`}
      title="Toggle animations and 3D effects"
    >
      <span className={styles.indicator} data-active={motionOn} />
      <span className={styles.label}>
        MOTION: <strong>{motionOn ? "ON" : "OFF"}</strong>
      </span>
    </button>
  );
}
