"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { HeroScene } from "./HeroScene";
import type { QualityPreset } from "./quality";
import styles from "@/components/sections/Hero.module.scss";

interface Hero3DViewProps {
  gpuTier: QualityPreset;
}

export default function Hero3DView({ gpuTier }: Hero3DViewProps) {
  const safeDpr = gpuTier === "high" ? 1.25 : 1.0;

  return (
    <div className={styles.r3fCanvasContainer}>
      <Canvas
        camera={{ position: [0, 0.05, 4.2], fov: 44 }}
        dpr={[1, safeDpr]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          depth: true,
          stencil: false,
        }}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
      >
        <HeroScene
          quality={{
            preset: gpuTier === "off" ? "medium" : gpuTier,
            dpr: safeDpr,
            particles: gpuTier === "high" ? 12000 : 7500,
            bloom: false,
            portalShaders: true,
          }}
        />
      </Canvas>
    </div>
  );
}
