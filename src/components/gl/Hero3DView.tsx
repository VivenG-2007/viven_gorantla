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
          dpr: gpuTier === "high" ? 1.2 : 1.0,
          particles: gpuTier === "high" ? 10000 : gpuTier === "medium" ? 6500 : 3500,
          bloom: false,
          portalShaders: gpuTier !== "low",
        }}
      />
    </View>
  );
}
