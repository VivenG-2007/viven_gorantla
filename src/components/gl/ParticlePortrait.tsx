"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useMotionStore } from "@/lib/store";
import {
  particlePortraitVertex,
  particlePortraitFragment,
} from "./shaders/particlePortrait.glsl";
import type { QualityConfig } from "./quality";

interface ParticlePortraitProps {
  quality: QualityConfig;
  imageSrc?: string;
}

export function ParticlePortrait({
  quality,
  imageSrc = "/images/portraits/viven-signature.jpg",
}: ParticlePortraitProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const backdropMeshRef = useRef<THREE.Mesh>(null);

  const { viewport } = useThree();
  const scrollProgress = useMotionStore((s) => s.scroll.progress);
  const motionOn = useMotionStore((s) => s.motionOn);

  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [backdropTexture, setBackdropTexture] = useState<THREE.Texture | null>(null);

  // Target and damped mouse pointer in world coordinates
  const pointerPos = useRef(new THREE.Vector2(999, 999));
  const targetPointerPos = useRef(new THREE.Vector2(999, 999));

  // Determine grid density based on GPU quality tier
  const gridResolution = useMemo(() => {
    switch (quality.preset) {
      case "high":
        return { width: 190, height: 240, haloCount: 750 };
      case "medium":
        return { width: 145, height: 185, haloCount: 400 };
      case "low":
      default:
        return { width: 110, height: 140, haloCount: 200 };
    }
  }, [quality.preset]);

  // Sample portrait image into dense 3D point cloud
  useEffect(() => {
    let active = true;
    let createdGeo: THREE.BufferGeometry | null = null;
    let createdTexture: THREE.Texture | null = null;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      if (!active) return;

      const { width: sampleW, height: sampleH, haloCount } = gridResolution;

      // Offscreen canvas for fast pixel reading
      const canvas = document.createElement("canvas");
      canvas.width = sampleW;
      canvas.height = sampleH;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, sampleW, sampleH);
      const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
      const data = imgData.data;

      // Also create a smoothed backdrop texture for the partially visible portrait behind particles
      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      createdTexture = texture;
      setBackdropTexture(texture);

      const positions: number[] = [];
      const origins: number[] = [];
      const colors: number[] = [];
      const params: number[] = []; // [goldFactor, shimmerSpeed, sizeMult, randomPhase]

      const cx = sampleW / 2;
      const cy = sampleH * 0.42;

      // 3D physical scaling
      const worldW = 2.75;
      const worldH = 3.45;

      for (let y = 0; y < sampleH; y++) {
        for (let x = 0; x < sampleW; x++) {
          const idx = (y * sampleW + x) * 4;
          const r = data[idx] / 255;
          const g = data[idx + 1] / 255;
          const b = data[idx + 2] / 255;
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          // Normalized coordinates relative to face center
          const nx = (x - cx) / (sampleW * 0.5);
          const ny = (y - cy) / (sampleH * 0.5);
          const distHead = Math.sqrt(nx * nx + ny * ny);

          // Background rejection: dark backdrop threshold
          // In signature.jpg, background is dark black (< 0.08)
          if (lum < 0.06 && distHead > 0.75) {
            continue;
          }

          // In dark suit regions at bottom, sample slightly less densely
          if (y > sampleH * 0.75 && lum < 0.12 && (x % 2 === 0 || y % 2 === 0)) {
            continue;
          }

          // World coordinates
          const wx = (x / sampleW - 0.5) * worldW;
          const wy = -(y / sampleH - 0.5) * worldH;

          // True Volumetric Head & Face Depth:
          // 1. Base convex head ellipsoid
          const ellipsoid = Math.sqrt(
            Math.max(0, 1.0 - Math.min(1.0, nx * nx * 1.35 + ny * ny * 0.95))
          );

          // 2. Anatomical facial relief:
          // Highlights (forehead, nose bridge, cheekbones) protrude towards the camera.
          // Eyes and mouth depressions recede slightly.
          const isCenterFace = distHead < 0.65;
          const relief = isCenterFace ? (lum - 0.45) * 0.35 : 0.0;
          const wz = ellipsoid * 0.48 + relief;

          origins.push(wx, wy, wz);
          positions.push(wx, wy, wz);

          // 3. Color Classification:
          // - Core face: Silver / grayscale
          // - Silhouette, hair rim, and shoulders: Warm amber / gold
          const isRim = distHead > 0.62 || nx > 0.38 || nx < -0.38 || y > sampleH * 0.65;
          const goldFactor = isRim
            ? Math.min(1.0, Math.pow(Math.max(0, distHead - 0.5) / 0.45, 1.3))
            : 0.0;

          // Silver/grayscale base for facial features
          const silverBase = Math.min(1.0, lum * 1.25);
          const faceColor = new THREE.Color(silverBase, silverBase * 0.98, silverBase * 0.96);

          // Warm gold color for silhouette
          const goldColor = new THREE.Color(1.0, 0.78, 0.32);
          const mixedColor = faceColor.clone().lerp(goldColor, goldFactor * 0.85);

          colors.push(mixedColor.r, mixedColor.g, mixedColor.b);

          // Parameters:
          // x: goldFactor, y: shimmerSpeed, z: sizeMult, w: randomPhase
          const shimmerSpeed = 0.5 + Math.random() * 1.5;
          const sizeMult = 0.75 + lum * 0.6 + Math.random() * 0.3;
          const randomPhase = Math.random();

          params.push(goldFactor, shimmerSpeed, sizeMult, randomPhase);
        }
      }

      // Add ambient drifting golden halo embers around the head and shoulders
      for (let i = 0; i < haloCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rad = 1.2 + Math.random() * 0.85;
        const hx = Math.cos(angle) * rad * (worldW * 0.52);
        const hy = Math.sin(angle) * rad * (worldH * 0.42) + 0.15;
        const hz = (Math.random() - 0.5) * 0.6;

        origins.push(hx, hy, hz);
        positions.push(hx, hy, hz);

        // Warm amber / gold colors for halo
        const haloGold = new THREE.Color(1.0, 0.75 + Math.random() * 0.15, 0.25 + Math.random() * 0.2);
        colors.push(haloGold.r, haloGold.g, haloGold.b);

        params.push(
          1.0, // Full gold factor
          0.8 + Math.random() * 1.2, // shimmer speed
          0.5 + Math.random() * 0.5, // slightly smaller particle
          Math.random() // phase
        );
      }

      // Build Three.js BufferGeometry
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute("aOrigin", new THREE.Float32BufferAttribute(origins, 3));
      geo.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 3));
      geo.setAttribute("aParams", new THREE.Float32BufferAttribute(params, 4));
      createdGeo = geo;
      setGeometry(geo);
    };

    return () => {
      active = false;
      if (createdGeo) createdGeo.dispose();
      if (createdTexture) createdTexture.dispose();
    };
  }, [imageSrc, gridResolution]);

  // Shader uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(999, 999) },
      uScatterRadius: { value: 0.95 },
      uScatterStrength: { value: 0.55 },
      uScrollProgress: { value: 0 },
      uBaseSize: { value: quality.preset === "high" ? 6.5 : 7.5 },
      uDpr: { value: Math.min(window?.devicePixelRatio || 1, 2) },
      uWaveSpeed: { value: 0.5 },
      uOpacity: { value: 0.95 },
    }),
    [quality.preset]
  );

  // Real-time animation loop
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = t;
      shaderMatRef.current.uniforms.uScrollProgress.value = scrollProgress;

      // Convert R3F normalized pointer (-1 to 1) to particle world units
      if (motionOn) {
        const worldPointerX = (state.pointer.x * viewport.width) / 2;
        const worldPointerY = (state.pointer.y * viewport.height) / 2;
        targetPointerPos.current.set(worldPointerX, worldPointerY);

        // Smooth spring-like damping for pointer position
        pointerPos.current.x = THREE.MathUtils.damp(
          pointerPos.current.x,
          targetPointerPos.current.x,
          6.5,
          delta
        );
        pointerPos.current.y = THREE.MathUtils.damp(
          pointerPos.current.y,
          targetPointerPos.current.y,
          6.5,
          delta
        );

        shaderMatRef.current.uniforms.uPointer.value.copy(pointerPos.current);
      }
    }

    if (groupRef.current) {
      // Subtle 3D volumetric parallax tilt based on cursor
      const targetRotY = motionOn ? state.pointer.x * 0.16 : 0;
      const targetRotX = motionOn ? -state.pointer.y * 0.12 : 0;

      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotY,
        4.0,
        delta
      );
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotX,
        4.0,
        delta
      );

      // Subtle breathing float oscillation
      groupRef.current.position.y = Math.sin(t * 0.75) * 0.04;
    }

    if (backdropMeshRef.current) {
      // Fade backdrop on scroll
      const mat = backdropMeshRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = THREE.MathUtils.clamp(0.14 * (1.0 - scrollProgress * 1.6), 0.0, 0.14);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Partially visible portrait plane behind particles for depth & mysterious aesthetic */}
      {backdropTexture && (
        <mesh ref={backdropMeshRef} position={[0, 0, -0.15]}>
          <planeGeometry args={[2.75, 3.45]} />
          <meshBasicMaterial
            map={backdropTexture}
            transparent
            opacity={0.14}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 3D Particle Portrait */}
      {geometry && (
        <points ref={pointsRef} geometry={geometry}>
          <shaderMaterial
            ref={shaderMatRef}
            vertexShader={particlePortraitVertex}
            fragmentShader={particlePortraitFragment}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  );
}
