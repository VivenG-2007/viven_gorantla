"use client";

import React from "react";
import { ParticlePortrait } from "./ParticlePortrait";
import type { QualityConfig } from "./quality";

interface HeroSceneProps {
  quality: QualityConfig;
}

export function HeroScene({ quality }: HeroSceneProps) {
  return (
    <>
      {/* Warm ambient illumination for subtle golden/orange glow */}
      <ambientLight intensity={0.45} color="#fffbeb" />
      <directionalLight position={[3, 5, 4]} intensity={0.85} color="#fef3c7" />
      <pointLight position={[0, 2, 2.5]} intensity={0.8} color="#f59e0b" distance={7} />
      <pointLight position={[-2, -1, 1.5]} intensity={0.45} color="#f97316" distance={6} />

      {/* Dynamic 3D Particle Portrait with golden/orange theme */}
      <ParticlePortrait quality={quality} imageSrc="/images/portraits/viven-hero-clean.png" />
    </>
  );
}
