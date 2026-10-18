"use client";

import React, { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useMotionStore } from "@/lib/store";
import { person } from "@/content/profile";
import { ArrowDown, ArrowUpRight, ChevronDown } from "lucide-react";
import styles from "./Hero.module.scss";

const Hero3DView = dynamic(() => import("@/components/gl/Hero3DView"), {
  ssr: false,
});

export function Hero() {
  const motionOn = useMotionStore((s) => s.motionOn);
  const gpuTier = useMotionStore((s) => s.gpuTier);
  const lenis = useMotionStore((s) => s.lenis);
  const viewContainerRef = useRef<HTMLDivElement>(null);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      if (lenis) {
        lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
      window.history.pushState(null, "", href);
    }
  };

  const isWebGlActive = motionOn && gpuTier !== "off" && gpuTier !== null;

  return (
    <section id="intro" className={styles.heroSection}>
      {/* 1. Deep black background with subtle vignette */}
      <div className={styles.bgVignette} aria-hidden="true" />

      {/* 2. 3D WebGL Canvas Layer (Dynamic 3D Particle Portrait) */}
      <div ref={viewContainerRef} className={styles.viewLayer} aria-hidden="true">
        {isWebGlActive ? (
          <Hero3DView gpuTier={gpuTier} />
        ) : (
          <div className={styles.staticFallback}>
            <div className={styles.staticAmbientGlow} />
            <div className={styles.fallbackImageWrap}>
              <Image
                src="/images/portraits/viven-signature.jpg"
                alt={person.name}
                width={500}
                height={625}
                className={styles.fallbackPortrait}
                priority
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Subtle atmospheric scrim for typography contrast */}
      <div className={styles.scrim} aria-hidden="true" />

      {/* 4. Fine cinematic grain */}
      <div className={styles.cinematicGrain} aria-hidden="true" />

      {/* 5. Editorial Foreground Content */}
      <div className={styles.heroContainer}>
        {/* Top: Letter-spaced muted warm-gray tagline */}
        <div className={styles.taglineWrapper}>
          <span className={styles.tagline}>A HUMAN PERSPECTIVE ON TECHNOLOGY</span>
        </div>

        {/* Center: Enormous, elegant editorial serif name overlapping portrait */}
        <div className={styles.nameBlock}>
          <h1 className={styles.oversizedName}>
            <span className={styles.nameReveal}>
              {person.name || "Viven Gorantla"}
            </span>
          </h1>
        </div>

        {/* Supporting description and minimal CTAs */}
        <div className={styles.bottomBlock}>
          <p className={styles.twoLineIntro}>
            I am a student &amp; tech enthusiast<br />
            who loves turning magic into logic.
          </p>

          <div className={styles.ctaGroup}>
            <a
              href="#work"
              onClick={(e) => handleCtaClick(e, "#work")}
              className={styles.pillCta}
              data-cursor="WORK"
            >
              <span>Explore my work</span>
              <ArrowDown size={14} className={styles.ctaArrow} />
            </a>

            <a
              href="#contact"
              onClick={(e) => handleCtaClick(e, "#contact")}
              className={styles.pillCta}
              data-cursor="CONTACT"
            >
              <span>Start a conversation</span>
              <ArrowUpRight size={14} className={styles.ctaArrow} />
            </a>
          </div>

          {/* Bottom metadata and scroll cue */}
          <div className={styles.footerCaptionRow}>
            <a
              href="#about"
              onClick={(e) => handleCtaClick(e, "#about")}
              className={styles.scrollIndicator}
              aria-label="Scroll down to explore about section"
            >
              <span className={styles.scrollLine} />
              <ChevronDown size={14} className={styles.scrollChevron} />
            </a>
            <span className={styles.bottomCaption}>BUILDING &amp; TEACHING SINCE 2021</span>
          </div>
        </div>
      </div>
    </section>
  );
}
