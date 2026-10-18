"use client";

import React, { useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { useMotionStore } from "@/lib/store";
import { resolveQualityPreset, type QualityConfig } from "./quality";
import styles from "./GlCanvas.module.scss";

export function GlCanvas() {
  const motionOn = useMotionStore((s) => s.motionOn);
  const setGpuTier = useMotionStore((s) => s.setGpuTier);
  const [quality, setQuality] = useState<QualityConfig | null>(null);
  const [contextLost, setContextLost] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    resolveQualityPreset(motionOn).then((q) => {
      if (mounted) {
        setQuality(q);
        setGpuTier(q.preset);
      }
    });
    return () => {
      mounted = false;
    };
  }, [motionOn, setGpuTier]);

  if (!quality || quality.preset === "off" || contextLost) {
    return null;
  }

  return (
    <div ref={containerRef} className={styles.canvasWrapper} aria-hidden="true">
      <Canvas
        frameloop="always"
        dpr={[1, quality.dpr]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        camera={{ position: [0, 0.4, 5.2], fov: 45 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            console.warn("WebGL context lost. Falling back to static mode.");
            setContextLost(true);
            setGpuTier("off");
          });
          gl.domElement.addEventListener("webglcontextrestored", () => {
            console.info("WebGL context restored.");
            setContextLost(false);
          });
        }}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
      >
        <View.Port />
      </Canvas>
    </div>
  );
}
