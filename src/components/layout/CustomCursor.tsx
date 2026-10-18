"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useMotionStore } from "@/lib/store";
import styles from "./CustomCursor.module.scss";

export function CustomCursor() {
  const motionOn = useMotionStore((s) => s.motionOn);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>("");
  const [active, setActive] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Only enable on fine pointers (desktop mouse)
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || !motionOn) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    const cursor = cursorRef.current;
    if (!cursor) return;

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorTarget) {
        setLabel(cursorTarget.getAttribute("data-cursor") || "VIEW");
        setActive(true);
      } else if (target.closest("a, button, [role='button']")) {
        setLabel("");
        setActive(true);
      } else {
        setLabel("");
        setActive(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [motionOn]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      className={`${styles.cursor} ${active ? styles.active : ""} ${
        label ? styles.hasLabel : ""
      }`}
      aria-hidden="true"
    >
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
