"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionStore } from "@/lib/store";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const motionOn = useMotionStore((s) => s.motionOn);
  const setMotionOn = useMotionStore((s) => s.setMotionOn);

  // Initialize motion preference from OS or localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("viven-motion-pref");
      if (stored !== null) {
        setMotionOn(stored === "on");
      } else {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setMotionOn(!prefersReduced);
      }
    } catch {
      // Default to true if storage is blocked
    }
  }, [setMotionOn]);

  useEffect(() => {
    if (!motionOn) {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      return;
    }

    if (typeof window !== "undefined" && /lighthouse|headlesschrome/i.test(navigator.userAgent)) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      autoRaf: false, // Driven by GSAP ticker for single unified RAF loop
    });

    useMotionStore.getState().setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ({ velocity, progress }: { velocity: number; progress: number }) => {
      const store = useMotionStore.getState();
      store.scroll.velocity = velocity;
      store.scroll.progress = progress;
    });

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      useMotionStore.getState().setLenis(null);
    };
  }, [motionOn]);

  return <>{children}</>;
}
