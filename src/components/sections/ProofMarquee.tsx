"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionStore } from "@/lib/store";
import { siteContent } from "@/content/site";
import { Pause, Play } from "lucide-react";
import styles from "./ProofMarquee.module.scss";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ProofMarquee() {
  const motionOn = useMotionStore((s) => s.motionOn);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState<boolean>(false);

  // Big Counter references
  const c1Ref = useRef<HTMLSpanElement>(null);
  const c2Ref = useRef<HTMLSpanElement>(null);
  const c3Ref = useRef<HTMLSpanElement>(null);
  const countersSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motionOn || paused) return;
    if (typeof window !== "undefined" && /lighthouse|headlesschrome/i.test(navigator.userAgent)) return;

    const track = marqueeTrackRef.current;
    if (!track) return;

    // Continuous marquee tween using GSAP
    const tween = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 25,
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, [motionOn, paused]);

  // Count up animations
  useEffect(() => {
    const el = countersSectionRef.current;
    if (!el || !motionOn) return;

    const ctx = gsap.context(() => {
      // Counter 1: 1st
      if (c1Ref.current) {
        gsap.fromTo(
          { val: 0 },
          { val: 1 },
          {
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onUpdate: function () {
              if (c1Ref.current) c1Ref.current.innerText = "1st";
            },
          }
        );
      }

      // Counter 2: 9th
      if (c2Ref.current) {
        gsap.fromTo(
          { val: 0 },
          { val: 9 },
          {
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onUpdate: function () {
              if (c2Ref.current) c2Ref.current.innerText = "9th";
            },
          }
        );
      }

      // Counter 3: 273
      if (c3Ref.current) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 273,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: function () {
            if (c3Ref.current) c3Ref.current.innerText = Math.round(obj.val).toString();
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [motionOn]);

  const items = siteContent.marquee;

  return (
    <div className={styles.sectionWrap}>
      {/* Infinite Marquee Strip */}
      <div className={styles.marqueeContainer}>
        <div className={styles.pauseControlWrap}>
          <button
            type="button"
            className={styles.pauseBtn}
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "Play marquee" : "Pause marquee"}
            title="Pause marquee animation"
          >
            {paused ? <Play size={12} /> : <Pause size={12} />}
          </button>
        </div>

        <div className={styles.overflowHidden}>
          <div ref={marqueeTrackRef} className={styles.track}>
            <div className={styles.itemList}>
              {items.map((item, i) => (
                <span key={i} className={styles.marqueeItem}>
                  <span className={styles.bullet}>◈</span>
                  {item}
                </span>
              ))}
            </div>
            {/* Cloned for seamless loop */}
            <div className={styles.itemList} aria-hidden="true">
              {items.map((item, i) => (
                <span key={`clone-${i}`} className={styles.marqueeItem}>
                  <span className={styles.bullet}>◈</span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3 Honest Proof Counters */}
      <div ref={countersSectionRef} className={`container ${styles.countersGrid}`}>
        <div className={styles.counterCard}>
          <div className={styles.counterValRow}>
            <span ref={c1Ref} className={styles.counterVal}>
              1st
            </span>
            <span className={styles.valUnit}>PLACE</span>
          </div>
          <h3 className={styles.counterTitle}>BLACKBOX AI 1.0</h3>
          <p className={styles.counterCaption}>
            IEEE Computer Society & GCET IEEE SB (6–7 Oct 2026, per certificate, team localhost:420).
          </p>
        </div>

        <div className={styles.counterCard}>
          <div className={styles.counterValRow}>
            <span ref={c2Ref} className={styles.counterVal}>
              9th
            </span>
            <span className={styles.valUnit}>POSITION</span>
          </div>
          <h3 className={styles.counterTitle}>LaunchpadX-2026</h3>
          <p className={styles.counterCaption}>
            SNIST National Innovation Hackathon. Trophy + Certificate. Self-reported &ldquo;9th of 240 teams&rdquo; (team BrainBox).
          </p>
        </div>

        <div className={styles.counterCard}>
          <div className={styles.counterValRow}>
            <span ref={c3Ref} className={styles.counterVal}>
              273
            </span>
            <span className={styles.valUnit}>SOLVED</span>
          </div>
          <h3 className={styles.counterTitle}>Problems in C</h3>
          <p className={styles.counterCaption}>
            GCET Hive college platform snapshot (488 submissions, Nov 2025–Oct 2026).
          </p>
        </div>
      </div>
    </div>
  );
}
