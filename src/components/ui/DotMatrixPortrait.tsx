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
    const fade = Math.max(0, Math.min(1, 1.0 - Math.pow(p, 1.25)));

    // When fully faded out, canvas is clear and invisible (zero draw overhead)
    if (fade <= 0.002) {
      return;
    }

    ctx.globalAlpha = fade;

    // Progressive wave parameters that form distinct flowing wave batches
    const waveAmp = (22 + 70 * p) * waveIntensity * p;
    const disperseSpeed = (75 * Math.pow(p, 1.35)) * waveIntensity;

    for (let b = 0; b < buckets.length; b++) {
      const bucket = buckets[b];
      const dots = bucket.dots;
      const count = dots.length;

      ctx.fillStyle = bucket.fill;
      ctx.beginPath();

      if (isResting) {
        // Pristine resting dot matrix portrait
        for (let i = 0; i < count; i++) {
          const d = dots[i];
          ctx.moveTo(d.x + d.r, d.y);
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        }
      } else {
        // Points distort into flowing batches of waves and disperse as they fade
        for (let i = 0; i < count; i++) {
          const d = dots[i];

          // 1. Transverse traveling wave batch
          const w1 = Math.sin(d.y * 0.026 + wavePhase * 3.8 + d.batchIndex * 0.75);
          // 2. Longitudinal cross wave
          const w2 = Math.cos(d.x * 0.022 - wavePhase * 3.0 + d.phase);
          // 3. Concentric radial ripple from the portrait center
          const ripple = Math.sin(d.distFromCenter * 0.032 - wavePhase * 4.2);

          // Wave dispersal heading: dots separate along wave crests
          const waveHeading = d.angle + w1 * 0.7;
          const disperseDist = (d.distFromCenter * 0.32 + disperseSpeed) * p;

          const dx = (w1 * 0.65 + ripple * 0.35) * waveAmp + Math.cos(waveHeading) * disperseDist;
          const dy = (w2 * 0.6 + w1 * 0.4) * (waveAmp * 0.82) + Math.sin(waveHeading) * (disperseDist * 0.85) - (p * 45);

          const curX = d.x + dx;
          const curY = d.y + dy;

          // Points shrink and dissolve as wave disperses
          const curR = Math.max(
            0.2,
            d.r * Math.pow(fade, 0.65) * (1 + 0.15 * Math.sin(d.distFromCenter * 0.025 + wavePhase) * (1 - p))
          );

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
    img.crossOrigin = "anonymous";

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

      // Face center for rim and radial wave calculations
      const faceCx = cw * 0.5;
      const faceCy = ch * 0.38;
      const faceRadiusX = cw * 0.36;
      const faceRadiusY = ch * 0.30;

      const bucketMap = new Map<string, MatrixDot[]>();

      for (let y = 0; y < ch; y += dotSpacing) {
        for (let x = 0; x < cw; x += dotSpacing) {
          const idx = (y * cw + x) * 4;
          const r = data[idx] / 255;
          const g = data[idx + 1] / 255;
          const b = data[idx + 2] / 255;
          const a = data[idx + 3] / 255;

          if (a < 0.15) continue;

          // Ignore black background
          if (r < 0.03 && g < 0.03 && b < 0.03) continue;

          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum < 0.035 && a < 0.75) continue;

          // Normalized distance from face center for rim detection
          const nx = (x - faceCx) / faceRadiusX;
          const ny = (y - faceCy) / faceRadiusY;
          const distNorm = Math.sqrt(nx * nx + ny * ny);

          const dotRadius = maxDotRadius * (0.35 + lum * 0.65);

          // Determine color: grayscale silver-white face, golden-orange rim on outer silhouette
          const isRim = distNorm > 0.78 || y > ch * 0.65;
          const rimFactor = isRim
            ? Math.min(1.0, Math.pow(Math.max(0, distNorm - 0.55) / 0.5, 1.2))
            : 0.0;

          let fillKey: string;
          if (rimFactor > 0.05) {
            // Golden-orange rim dots
            const orangeR = Math.min(255, Math.round((lum * 0.6 + 0.4) * 255));
            const orangeG = Math.min(255, Math.round((lum * 0.35 + 0.2) * rimFactor * 255 + lum * (1 - rimFactor) * 255));
            const orangeB = Math.min(255, Math.round(lum * (1 - rimFactor * 0.8) * 100));
            // Quantize to ~16 color bins for fast Canvas 2D path batching
            const qR = Math.round(orangeR / 8) * 8;
            const qG = Math.round(orangeG / 8) * 8;
            const qB = Math.round(orangeB / 8) * 8;
            fillKey = `rgba(${qR},${qG},${qB},${(a * 0.92).toFixed(2)})`;
          } else {
            // Grayscale silver-white face dots
            const gray = Math.round(lum * 245);
            const qGray = Math.round(gray / 8) * 8;
            fillKey = `rgba(${qGray},${qGray},${qGray},${(a * 0.94).toFixed(2)})`;
          }

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
