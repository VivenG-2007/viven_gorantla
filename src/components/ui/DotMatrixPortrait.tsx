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
  /** Multiplier for wave distortion and dispersal intensity */
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
  batchIndex: number;
}

interface ColorBucket {
  fill: string;
  dots: MatrixDot[];
}

export function DotMatrixPortrait({
  src,
  dotSpacing = 4,
  maxDotRadius = 1.9,
  width = 520,
  height = 600,
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

  // Render a single frame with wave distortion and fade-away
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLoadedRef.current) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const cw = width;
    const ch = height;
    ctx.clearRect(0, 0, cw, ch);

    const buckets = bucketsRef.current;
    const p = motionOn ? scrollCurrentRef.current : 0;
    const wavePhase = wavePhaseRef.current;
    const isResting = p < 0.001;

    // Calculate fade away opacity: goes from 1.0 down to 0.0 as user scrolls
    // Reaches completely 0 (invisible) by ~72% through the hero section scroll
    const fade = Math.max(0, Math.min(1, 1.0 - Math.pow(p / 0.72, 1.25)));

    // When fully faded out, canvas is clear and invisible (zero draw overhead)
    if (fade <= 0.001) {
      return;
    }

    ctx.globalAlpha = fade;

    // Minimal vertical wave amplitude strictly along the Y axis
    const ampY = (8 + 12 * p) * waveIntensity * p;

    for (let b = 0; b < buckets.length; b++) {
      const bucket = buckets[b];
      const dots = bucket.dots;
      const count = dots.length;

      ctx.fillStyle = bucket.fill;
      ctx.beginPath();

      if (isResting) {
        // Pristine resting dot matrix portrait (100% sharp, zero distortion)
        for (let i = 0; i < count; i++) {
          const d = dots[i];
          ctx.moveTo(d.x + d.r, d.y);
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        }
      } else {
        // Minimal wave animation strictly along the Y axis that fades out to invisible
        const waveFreqX = Math.PI * 7.5; // Wave frequency across horizontal columns
        const waveFreqY = Math.PI * 2.5;

        for (let i = 0; i < count; i++) {
          const d = dots[i];

          const normX = d.x / cw; // 0 to 1 across width
          const normY = d.y / ch; // 0 to 1 down height

          // Wave displacement strictly along the Y axis
          const wave1 = Math.sin(normX * waveFreqX - wavePhase * 4.2 + normY * waveFreqY);
          const wave2 = Math.sin(normX * (waveFreqX * 0.5) - wavePhase * 2.6);
          const combinedWave = wave1 * 0.78 + wave2 * 0.22;

          // Pure Y-axis displacement (minimal, elegant vertical wave ripple)
          const dy = combinedWave * ampY;

          const curX = d.x; // Strictly zero displacement on X axis
          const curY = d.y + dy;

          // Subtle dot radius scaling as points fade into complete invisibility
          const curR = Math.max(0.18, d.r * Math.pow(fade, 0.55));

          ctx.moveTo(curX + curR, curY);
          ctx.arc(curX, curY, curR, 0, Math.PI * 2);
        }
      }

      ctx.fill();
    }

    ctx.globalAlpha = 1.0;
  }, [width, height, waveIntensity, motionOn]);

  // Main animation ticker
  const tick = useCallback(() => {
    const target = scrollTargetRef.current;
    const current = scrollCurrentRef.current;
    const diff = target - current;

    // Smooth physics lerp
    scrollCurrentRef.current += diff * 0.09;

    // Wave phase ripples while scrolling or moving
    wavePhaseRef.current += 0.038 * (scrollCurrentRef.current * 1.6 + 0.2);

    renderFrame();

    // Check if animation has settled at either resting state (0) or fully invisible (1)
    const almostDone = Math.abs(scrollCurrentRef.current - target) < 0.001;
    if (almostDone) {
      if (target === 0) {
        scrollCurrentRef.current = 0;
        renderFrame(); // Crisp resting state
        isAnimatingRef.current = false;
        rafIdRef.current = null;
        return;
      } else if (target >= 0.99) {
        scrollCurrentRef.current = 1;
        renderFrame(); // Fully invisible state
        isAnimatingRef.current = false;
        rafIdRef.current = null;
        return;
      }
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

    // Normalized progress: 0 at top, 1.0 as you scroll past the hero section
    const target = Math.min(Math.max(scrollY / (heroHeight * 0.72), 0), 1);
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
    // Only set crossOrigin on remote URLs to prevent browser security blocks on local static files
    if (src.startsWith("http://") || src.startsWith("https://")) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => {
      const offscreen = document.createElement("canvas");
      offscreen.width = cw;
      offscreen.height = ch;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      // Preserve natural aspect ratio and position portrait elegantly
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = cw / ch;
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

      if (imgAspect > canvasAspect) {
        sw = img.naturalHeight * canvasAspect;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / canvasAspect;
        sy = (img.naturalHeight - sh) * 0.12; // keep top of head visible
      }

      offCtx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
      const imgData = offCtx.getImageData(0, 0, cw, ch);
      const data = imgData.data;

      // Face center for horizontal and radial wave calculations
      const faceCx = cw * 0.5;
      const faceCy = ch * 0.38;

      const bucketMap = new Map<string, MatrixDot[]>();

      for (let y = 0; y < ch; y += dotSpacing) {
        for (let x = 0; x < cw; x += dotSpacing) {
          const idx = (y * cw + x) * 4;
          const r = data[idx] / 255;
          const g = data[idx + 1] / 255;
          const b = data[idx + 2] / 255;
          const a = data[idx + 3] / 255;

          if (a < 0.12) continue;

          // Skip pure black background
          if (r < 0.03 && g < 0.03 && b < 0.03) continue;

          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum < 0.035 && a < 0.75) continue;

          const dotRadius = maxDotRadius * (0.35 + lum * 0.65);

          // All dots are pure white only (monochrome minimalism)
          // Opacity is mapped to luminance and alpha for rich tonal definition
          const dotAlpha = Math.min(1.0, Math.max(0.18, (lum * 0.78 + 0.22) * a));
          // Quantize into ~16 opacity buckets for 120 FPS batching
          const qAlpha = (Math.round(dotAlpha * 16) / 16).toFixed(2);
          const fillKey = `rgba(255,255,255,${qAlpha})`;

          const distFromCenter = Math.hypot(x - faceCx, y - faceCy);
          const angle = Math.atan2(y - faceCy, x - faceCx);
          const phase = angle * 2.0 + distFromCenter * 0.04;
          const batchIndex = Math.floor((y / ch) * 8) + Math.floor((x / cw) * 3);

          const dot: MatrixDot = {
            x,
            y,
            r: dotRadius,
            distFromCenter,
            angle,
            phase,
            batchIndex,
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
