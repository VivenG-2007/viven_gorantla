"use client";

import React from "react";
import { View, PerspectiveCamera } from "@react-three/drei";
import { HeroScene } from "./HeroScene";
import type { QualityPreset } from "./quality";
import styles from "@/components/sections/Hero.module.scss";

interface Hero3DViewProps {
  gpuTier: QualityPreset;
}

export default function Hero3DView({ gpuTier }: Hero3DViewProps) {
  return (
    <View className={styles.r3fView}>
      <PerspectiveCamera makeDefault position={[0, 0.05, 4.5]} fov={44} />
      <HeroScene
        quality={{
          preset: gpuTier,
          dpr: gpuTier === "high" ? 1.75 : gpuTier === "medium" ? 1.5 : 1.2,
          particles: gpuTier === "high" ? 45000 : gpuTier === "medium" ? 25000 : 12000,
          bloom: gpuTier === "high",
          portalShaders: gpuTier !== "low",
        }}
      />
    </View>
  );
}
