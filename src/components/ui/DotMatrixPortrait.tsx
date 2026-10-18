"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useMotionStore } from "@/lib/store";

interface DotMatrixPortraitProps {
  src: string;
  /** Spacing between dot centers in px */
  dotSpacing?: number;
  /** Max dot radius in px */
  maxDotRadius?: number;
  /** Canvas CSS width */
  width?: number;
  /** Canvas CSS height */
  height?: number;
  /** Intensity multiplier for the subtle scroll wave distortion (default 1.0) */
  waveIntensity?: number;
  className?: string;
  alt?: string;
}

interface MatrixDot {
  x: number;
  y: number;
  r: number;
  distFromCenter: number;
  angle: number;
  phase: number;
}

interface ColorBucket {
  fill: string;
  dots: MatrixDot[];
}

export function DotMatrixPortrait({
  src,
  dotSpacing = 4,
  maxDotRadius = 1.8,
  width = 500,
  height = 625,
  waveIntensity = 1.0,
  className,
  alt = "Dot matrix portrait",
}: DotMatrixPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bucketsRef = useRef<ColorBucket[]>([]);
  const isLoadedRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const scrollTargetRef = useRef(0);
  const scrollCurrentRef = useRef(0);
  const wavePhaseRef = useRef(0);

  const motionOn = useMotionStore((s) => s.motionOn);
  const lenis = useMotionStore((s) => s.lenis);

  // Render a single frame with current scroll distortion
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLoadedRef.current) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const cw = width;
    const ch = height;
    ctx.clearRect(0, 0, cw, ch);

    const buckets = bucketsRef.current;
    const currentProgress = motionOn ? scrollCurrentRef.current : 0;
    const wavePhase = wavePhaseRef.current;
    const isResting = currentProgress < 0.001;

    const baseAmp = 13 * waveIntensity * currentProgress;

    // Draw batched color buckets
    for (let b = 0; b < buckets.length; b++) {
      const bucket = buckets[b];
      const dots = bucket.dots;
      const count = dots.length;

      ctx.fillStyle = bucket.fill;
      ctx.beginPath();

      if (isResting) {
        // Pristine resting dot matrix (zero distortion)
        for (let i = 0; i < count; i++) {
          const d = dots[i];
          ctx.moveTo(d.x + d.r, d.y);
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        }
      } else {
        // Subtle distorted wave animation focused on face dots
        for (let i = 0; i < count; i++) {
          const d = dots[i];

          // Harmonic waves across face coordinates
          const ky = d.y * 0.024;
          const kx = d.x * 0.022;
          const w1 = Math.sin(ky + wavePhase + d.phase);
          const w2 = Math.cos(kx + wavePhase * 0.85);
          const ripple = Math.sin(d.distFromCenter * 0.028 - wavePhase * 1.3);

          const dx = (w1 * 0.68 + ripple * 0.32) * baseAmp;
          const dy = (w2 * 0.6 + w1 * 0.4) * (baseAmp * 0.72);

          const curX = d.x + dx;
          const curY = d.y + dy;

          // Subtle harmonic breathing on dot radius
          const curR = Math.max(
            0.35,
            d.r * (1 + 0.12 * Math.sin(d.distFromCenter * 0.025 + wavePhase) * currentProgress)
          );

          ctx.moveTo(curX + curR, curY);
          ctx.arc(curX, curY, curR, 0, Math.PI * 2);
        }
      }

      ctx.fill();
    }
  }, [width, height, waveIntensity, motionOn]);

  // Main animation ticker
  const tick = useCallback(() => {
    // Smooth lerp towards scroll target
    const target = scrollTargetRef.current;
    const current = scrollCurrentRef.current;
    const diff = target - current;

    scrollCurrentRef.current += diff * 0.085;

    // Advance wave phase slightly when scrolling or moving
    wavePhaseRef.current += 0.035 * (scrollCurrentRef.current * 1.5 + 0.15);

    renderFrame();

    // Determine if animation can sleep
    const almostDone = Math.abs(scrollCurrentRef.current - target) < 0.001;
    if (almostDone && target === 0) {
      scrollCurrentRef.current = 0;
      renderFrame(); // Ensure resting frame is drawn exactly at 0
      isAnimatingRef.current = false;
      rafIdRef.current = null;
      return;
    }

    rafIdRef.current = requestAnimationFrame(tick);
  }, [renderFrame]);

  // Wake the animation loop whenever scroll changes
  const wakeAnimation = useCallback(() => {
    if (!isAnimatingRef.current) {
      isAnimatingRef.current = true;
      rafIdRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  // Handle scroll events
  const onScrollUpdate = useCallback(() => {
    const scrollY = typeof window !== "undefined" ? window.scrollY || document.documentElement.scrollTop : 0;
    const heroHeight = typeof window !== "undefined" ? window.innerHeight || 800 : 800;

    // Normalized progress through the hero section (0 at top, 1.0 as you scroll past hero)
    const target = Math.min(Math.max(scrollY / (heroHeight * 0.75), 0), 1);
    scrollTargetRef.current = target;
    wakeAnimation();
  }, [wakeAnimation]);

  // Load and sample image pixels once into color-batched buckets
  const loadAndSample = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const cw = width;
    const ch = height;

    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${ch}px`;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const offscreen = document.createElement("canvas");
      offscreen.width = cw;
      offscreen.height = ch;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0, cw, ch);
      const imgData = offCtx.getImageData(0, 0, cw, ch);
      const data = imgData.data;

      // Face center for rim and radial calculation
      const faceCx = cw * 0.5;
      const faceCy = ch * 0.40;
      const faceRadiusX = cw * 0.38;
      const faceRadiusY = ch * 0.32;

      // Bucket map for high-performance canvas batching
      const bucketMap = new Map<string, MatrixDot[]>();

      for (let y = 0; y < ch; y += dotSpacing) {
        for (let x = 0; x < cw; x += dotSpacing) {
          const idx = (y * cw + x) * 4;
          const r = data[idx] / 255;
          const g = data[idx + 1] / 255;
          const b = data[idx + 2] / 255;
          const a = data[idx + 3] / 255;

          if (a < 0.15) continue;

          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum < 0.03 && a < 0.8) continue;

          // Normalized distance from face center for rim detection
          const nx = (x - faceCx) / faceRadiusX;
          const ny = (y - faceCy) / faceRadiusY;
          const distNorm = Math.sqrt(nx * nx + ny * ny);

          const dotRadius = maxDotRadius * (0.3 + lum * 0.7);

          // Determine color: grayscale center, golden-orange rim
          const isRim = distNorm > 0.75 || y > ch * 0.62;
          const rimFactor = isRim
            ? Math.min(1.0, Math.pow(Math.max(0, distNorm - 0.55) / 0.5, 1.2))
            : 0.0;

          let fillKey: string;
          if (rimFactor > 0.05) {
            // Golden-orange rim dots (quantized for batching)
            const orangeR = Math.min(255, Math.round((lum * 0.6 + 0.4) * 255));
            const orangeG = Math.min(255, Math.round((lum * 0.35 + 0.2) * rimFactor * 255 + lum * (1 - rimFactor) * 255));
            const orangeB = Math.min(255, Math.round(lum * (1 - rimFactor * 0.8) * 100));
            // Quantize to ~16 color bins
            const qR = Math.round(orangeR / 8) * 8;
            const qG = Math.round(orangeG / 8) * 8;
            const qB = Math.round(orangeB / 8) * 8;
            fillKey = `rgba(${qR},${qG},${qB},${(a * 0.9).toFixed(2)})`;
          } else {
            // Grayscale silver-white face dots (quantized)
            const gray = Math.round(lum * 245);
            const qGray = Math.round(gray / 8) * 8;
            fillKey = `rgba(${qGray},${qGray},${qGray},${(a * 0.92).toFixed(2)})`;
          }

          const distFromCenter = Math.hypot(x - faceCx, y - faceCy);
          const angle = Math.atan2(y - faceCy, x - faceCx);
          const phase = angle * 2.0 + distFromCenter * 0.04;

          const dot: MatrixDot = {
            x,
            y,
            r: dotRadius,
            distFromCenter,
            angle,
            phase,
          };

          let list = bucketMap.get(fillKey);
          if (!list) {
            list = [];
            bucketMap.set(fillKey, list);
          }
          list.push(dot);
        }
      }

      const buckets: ColorBucket[] = [];
      bucketMap.forEach((dots, fill) => {
        buckets.push({ fill, dots });
      });

      bucketsRef.current = buckets;
      isLoadedRef.current = true;

      // Draw initial resting frame
      renderFrame();
    };

    img.onerror = () => {
      console.warn("DotMatrixPortrait: failed to load", src);
    };

    img.src = src;
    if (img.complete && img.naturalWidth > 0) {
      img.onload?.(new Event("load") as any);
    }
  }, [src, dotSpacing, maxDotRadius, width, height, renderFrame]);

  // Initial load
  useEffect(() => {
    isLoadedRef.current = false;
    loadAndSample();

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [loadAndSample]);

  // Scroll listeners (Lenis + Native scroll)
  useEffect(() => {
    const handleScroll = () => {
      onScrollUpdate();
    };

    if (lenis) {
      const handleLenis = () => {
        onScrollUpdate();
      };
      lenis.on("scroll", handleLenis);
      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        lenis.off("scroll", handleLenis);
        window.removeEventListener("scroll", handleScroll);
      };
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lenis, onScrollUpdate]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label={alt}
      style={{ imageRendering: "auto" }}
    />
  );
}
