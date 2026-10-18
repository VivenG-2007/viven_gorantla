"use client";

import React, { useRef, useEffect, useCallback } from "react";

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
  className?: string;
  alt?: string;
}

export function DotMatrixPortrait({
  src,
  dotSpacing = 4,
  maxDotRadius = 1.8,
  width = 500,
  height = 625,
  className,
  alt = "Dot matrix portrait",
}: DotMatrixPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawnRef = useRef(false);

  const draw = useCallback(() => {
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
    ctx.clearRect(0, 0, cw, ch);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Draw image to an offscreen canvas to sample pixels
      const offscreen = document.createElement("canvas");
      offscreen.width = cw;
      offscreen.height = ch;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0, cw, ch);
      const imgData = offCtx.getImageData(0, 0, cw, ch);
      const data = imgData.data;

      // Center of the face for rim detection
      const faceCx = cw * 0.5;
      const faceCy = ch * 0.40;
      const faceRadiusX = cw * 0.38;
      const faceRadiusY = ch * 0.32;

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
          const distFromCenter = Math.sqrt(nx * nx + ny * ny);

          // Dot size proportional to luminance
          const dotRadius = maxDotRadius * (0.3 + lum * 0.7);

          // Determine color: grayscale center, golden-orange rim
          const isRim = distFromCenter > 0.75 || y > ch * 0.62;
          const rimFactor = isRim
            ? Math.min(1.0, Math.pow(Math.max(0, distFromCenter - 0.55) / 0.5, 1.2))
            : 0.0;

          if (rimFactor > 0.05) {
            // Golden-orange rim dots
            const orangeR = Math.round((lum * 0.6 + 0.4) * 255);
            const orangeG = Math.round((lum * 0.35 + 0.2) * rimFactor * 255 + lum * (1 - rimFactor) * 255);
            const orangeB = Math.round(lum * (1 - rimFactor * 0.8) * 100);
            ctx.fillStyle = `rgba(${Math.min(255, orangeR)}, ${Math.min(255, orangeG)}, ${Math.min(255, orangeB)}, ${a * 0.9})`;
          } else {
            // Grayscale silver-white face dots
            const gray = Math.round(lum * 245);
            ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, ${a * 0.92})`;
          }

          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      drawnRef.current = true;
    };

    img.onerror = () => {
      console.warn("DotMatrixPortrait: failed to load", src);
    };

    img.src = src;
    if (img.complete && img.naturalWidth > 0) {
      img.onload?.(new Event("load") as any);
    }
  }, [src, dotSpacing, maxDotRadius, width, height]);

  useEffect(() => {
    drawnRef.current = false;
    draw();
  }, [draw]);

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
