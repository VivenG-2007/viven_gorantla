"use client";

import React from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { ParticlePortrait } from "./ParticlePortrait";
import type { QualityConfig } from "./quality";

interface HeroSceneProps {
  quality: QualityConfig;
}

export function HeroScene({ quality }: HeroSceneProps) {
  return (
    <>
      {/* Deep cinematic black background */}
      <color attach="background" args={["#050608"]} />

      {/* Faint ambient illumination for subtle depth */}
      <ambientLight intensity={0.35} color="#ffffff" />
      <directionalLight position={[3, 5, 4]} intensity={0.8} color="#f8fafc" />
      <pointLight position={[0, 2, 2.5]} intensity={0.6} color="#fbbf24" distance={6} />
      <pointLight position={[-2, -1, 1.5]} intensity={0.3} color="#f59e0b" distance={5} />

      {/* Dynamic 3D Particle Portrait */}
      <ParticlePortrait quality={quality} imageSrc="/images/portraits/viven-signature.jpg" />

      {/* Subtle Post-processing (High quality tier) */}
      {quality.bloom && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            luminanceThreshold={0.82}
            luminanceSmoothing={0.3}
            intensity={0.4}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.2} darkness={0.7} />
        </EffectComposer>
      )}
    </>
  );
}
