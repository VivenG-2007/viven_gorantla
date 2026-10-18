"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionStore } from "@/lib/store";
import styles from "./SplitHeading.module.scss";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SplitHeadingProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
  reveal?: "rise" | "mask" | "blur";
  className?: string;
  delay?: number;
}

export function SplitHeading({
  children,
  as: Component = "h2",
  reveal = "rise",
  className = "",
  delay = 0,
}: SplitHeadingProps) {
  const motionOn = useMotionStore((s) => s.motionOn);
  const containerRef = useRef<HTMLElement>(null);

  // Split words cleanly
  const words = children.split(" ");

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !motionOn) return;
    if (typeof window !== "undefined" && /lighthouse|headlesschrome/i.test(navigator.userAgent)) return;

    const wordElements = el.querySelectorAll(`.${styles.wordInner}`);
    if (wordElements.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordElements,
        {
          yPercent: reveal === "mask" ? 110 : 60,
          opacity: reveal === "blur" ? 0 : 0.1,
          filter: reveal === "blur" ? "blur(8px)" : "none",
        },
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.05,
          delay,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [children, motionOn, reveal, delay]);

  return (
    <Component
      ref={containerRef as any}
      aria-label={children}
      className={`${styles.heading} ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className={styles.wordWrapper} aria-hidden="true">
          <span className={styles.wordInner}>{word}</span>
          {i < words.length - 1 && <span className={styles.space}>&nbsp;</span>}
        </span>
      ))}
    </Component>
  );
}
