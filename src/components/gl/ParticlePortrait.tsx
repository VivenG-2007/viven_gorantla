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

function buildProceduralFacePoints(sampleW: number, sampleH: number, haloCount: number) {
  const positions: number[] = [];
  const origins: number[] = [];
  const colors: number[] = [];
  const params: number[] = [];

  const worldW = 2.75;
  const worldH = 3.45;
  const cx = sampleW / 2;
  const cy = sampleH * 0.42;

  for (let y = 0; y < sampleH; y += 2) {
    for (let x = 0; x < sampleW; x += 2) {
      const nx = (x - cx) / (sampleW * 0.48);
      const ny = (y - cy) / (sampleH * 0.48);
      const rad = Math.sqrt(nx * nx * 1.3 + ny * ny * 0.95);

      if (rad > 1.15 && y < sampleH * 0.65) continue;
      if (y >= sampleH * 0.65 && Math.abs(nx) > 1.45) continue;

      const wx = (x / sampleW - 0.5) * worldW;
      const wy = -(y / sampleH - 0.5) * worldH;

      const ellipsoid = Math.sqrt(Math.max(0, 1.0 - Math.min(1.0, rad * rad)));
      const isNose = Math.abs(nx) < 0.12 && ny > -0.15 && ny < 0.25;
      const noseRelief = isNose ? (1.0 - Math.abs(nx) / 0.12) * 0.22 : 0;
      const wz = ellipsoid * 0.48 + noseRelief;

      origins.push(wx, wy, wz);
      positions.push(wx, wy, wz);

      const isRim = rad > 0.65 || Math.abs(nx) > 0.45 || y > sampleH * 0.65;
      const goldFactor = isRim ? Math.min(1.0, (rad - 0.5) / 0.5) : 0.0;
      const silver = 0.85;
      const c = new THREE.Color(silver, silver * 0.96, silver * 0.92).lerp(
        new THREE.Color(1.0, 0.78, 0.32),
        goldFactor * 0.85
      );
      colors.push(c.r, c.g, c.b);
      params.push(goldFactor, 0.8 + Math.random(), 0.9 + Math.random() * 0.3, Math.random());
    }
  }

  for (let i = 0; i < haloCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 1.15 + Math.random() * 0.8;
    const hx = Math.cos(angle) * r * (worldW * 0.52);
    const hy = Math.sin(angle) * r * (worldH * 0.42) + 0.15;
    const hz = (Math.random() - 0.5) * 0.6;
    origins.push(hx, hy, hz);
    positions.push(hx, hy, hz);
    const haloGold = new THREE.Color(1.0, 0.78, 0.28);
    colors.push(haloGold.r, haloGold.g, haloGold.b);
    params.push(1.0, 0.8 + Math.random(), 0.6, Math.random());
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("aOrigin", new THREE.Float32BufferAttribute(origins, 3));
  geo.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute("aParams", new THREE.Float32BufferAttribute(params, 4));
  return geo;
}

export function ParticlePortrait({
  quality,
  imageSrc = "/images/portraits/viven-hero-clean.png",
}: ParticlePortraitProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);
  const backdropMeshRef = useRef<THREE.Mesh>(null);

  const { viewport } = useThree();
  const motionOn = useMotionStore((s) => s.motionOn);

  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [backdropTexture, setBackdropTexture] = useState<THREE.Texture | null>(null);

  const pointerPos = useRef(new THREE.Vector2(999, 999));
  const targetPointerPos = useRef(new THREE.Vector2(999, 999));

  // Determine grid density based on GPU quality tier
  const gridResolution = useMemo(() => {
    switch (quality.preset) {
      case "high":
        return { width: 115, height: 145, haloCount: 220 };
      case "medium":
        return { width: 95, height: 120, haloCount: 120 };
      case "low":
      default:
        return { width: 75, height: 95, haloCount: 60 };
    }
  }, [quality.preset]);

  // Sample portrait image into dense 3D point cloud
  useEffect(() => {
    let active = true;
    let createdGeo: THREE.BufferGeometry | null = null;
    let createdTexture: THREE.Texture | null = null;

    const { width: sampleW, height: sampleH, haloCount } = gridResolution;

    const processLoadedImage = (img: HTMLImageElement) => {
      if (!active) return;

      try {
        const canvas = document.createElement("canvas");
        canvas.width = sampleW;
        canvas.height = sampleH;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("2D context unavailable");

        ctx.drawImage(img, 0, 0, sampleW, sampleH);
        const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
        const data = imgData.data;

        const texture = new THREE.CanvasTexture(canvas);
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        createdTexture = texture;
        setBackdropTexture(texture);

        const positions: number[] = [];
        const origins: number[] = [];
        const colors: number[] = [];
        const params: number[] = [];

        const cx = sampleW / 2;
        const cy = sampleH * 0.42;
        const worldW = 2.85;
        const worldH = 3.55;

        for (let y = 0; y < sampleH; y++) {
          for (let x = 0; x < sampleW; x++) {
            const idx = (y * sampleW + x) * 4;
            const r = data[idx] / 255;
            const g = data[idx + 1] / 255;
            const b = data[idx + 2] / 255;
            const a = data[idx + 3] / 255;

            // If transparent cutout background, skip empty background pixels
            if (a < 0.2) continue;

            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            if (lum < 0.04 && a < 0.85) continue;

            const nx = (x - cx) / (sampleW * 0.5);
            const ny = (y - cy) / (sampleH * 0.5);
            const distHead = Math.sqrt(nx * nx + ny * ny);

            const wx = (x / sampleW - 0.5) * worldW;
            const wy = -(y / sampleH - 0.5) * worldH + 0.12;

            const ellipsoid = Math.sqrt(
              Math.max(0, 1.0 - Math.min(1.0, nx * nx * 1.3 + ny * ny * 0.95))
            );

            const isCenterFace = distHead < 0.65;
            const relief = isCenterFace ? (lum - 0.45) * 0.32 : 0.0;
            const wz = ellipsoid * 0.46 + relief;

            origins.push(wx, wy, wz);
            positions.push(wx, wy, wz);

            // Rim particles: hair outline and shoulders receive full golden-orange warmth
            const isRim = distHead > 0.58 || Math.abs(nx) > 0.38 || y > sampleH * 0.62;
            const goldFactor = isRim
              ? Math.min(1.0, Math.pow(Math.max(0, distHead - 0.46) / 0.44, 1.2))
              : 0.2; // Subtle golden warmth even on face

            // Warm gold and orange palette
            const silverBase = Math.min(1.0, lum * 1.25);
            const faceColor = new THREE.Color(silverBase, silverBase * 0.95, silverBase * 0.88);
            const goldColor = new THREE.Color(1.0, 0.76, 0.24); // Radiant Gold
            const mixedColor = faceColor.clone().lerp(goldColor, goldFactor * 0.92);

            colors.push(mixedColor.r, mixedColor.g, mixedColor.b);

            const shimmerSpeed = 0.6 + Math.random() * 1.4;
            const sizeMult = 0.82 + lum * 0.5 + Math.random() * 0.3;
            const randomPhase = Math.random();

            params.push(goldFactor, shimmerSpeed, sizeMult, randomPhase);
          }
        }

        // Ambient halo embers around the silhouette
        for (let i = 0; i < haloCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const rad = 1.15 + Math.random() * 0.8;
          const hx = Math.cos(angle) * rad * (worldW * 0.52);
          const hy = Math.sin(angle) * rad * (worldH * 0.42) + 0.15;
          const hz = (Math.random() - 0.5) * 0.6;

          origins.push(hx, hy, hz);
          positions.push(hx, hy, hz);

          const isOrange = Math.random() > 0.45;
          const emberColor = isOrange
            ? new THREE.Color(0.97, 0.52, 0.12)
            : new THREE.Color(1.0, 0.82, 0.30);

          colors.push(emberColor.r, emberColor.g, emberColor.b);
          params.push(1.0, 0.8 + Math.random() * 1.2, 0.55 + Math.random() * 0.45, Math.random());
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute("aOrigin", new THREE.Float32BufferAttribute(origins, 3));
        geo.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 3));
        geo.setAttribute("aParams", new THREE.Float32BufferAttribute(params, 4));

        createdGeo = geo;
        setGeometry(geo);
      } catch (err) {
        console.warn("Portrait canvas sampling failed, using procedural fallback", err);
        const fallbackGeo = buildProceduralFacePoints(sampleW, sampleH, haloCount);
        createdGeo = fallbackGeo;
        setGeometry(fallbackGeo);
      }
    };

    const img = new Image();
    if (imageSrc.startsWith("http")) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => processLoadedImage(img);
    img.onerror = () => {
      console.warn("Portrait image failed to load, using procedural fallback");
      const fallbackGeo = buildProceduralFacePoints(sampleW, sampleH, haloCount);
      createdGeo = fallbackGeo;
      setGeometry(fallbackGeo);
    };

    img.src = imageSrc;
    if (img.complete && img.naturalWidth > 0) {
      processLoadedImage(img);
    }

    return () => {
      active = false;
      if (createdGeo) createdGeo.dispose();
      if (createdTexture) createdTexture.dispose();
    };
  }, [imageSrc, gridResolution]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(999, 999) },
      uScatterRadius: { value: 0.95 },
      uScatterStrength: { value: 0.55 },
      uScrollProgress: { value: 0 },
      uBaseSize: { value: 5.5 },
      uDpr: { value: 1.0 },
      uWaveSpeed: { value: 0.5 },
      uOpacity: { value: 0.95 },
    }),
    []
  );

  // Real-time animation loop
  useFrame((state, delta) => {
    // 1. Direct scroll tracking for the hero section
    const currentScroll = typeof window !== "undefined" ? window.scrollY : 0;
    const heroH = typeof window !== "undefined" ? window.innerHeight : 800;
    const heroScrollProgress = Math.min(Math.max(currentScroll / (heroH * 0.85), 0.0), 1.0);

    // Offscreen culling: If user scrolled past hero, pause rendering to save 100% GPU
    if (heroScrollProgress >= 1.0 && currentScroll > heroH * 1.3) {
      if (groupRef.current && groupRef.current.visible) {
        groupRef.current.visible = false;
      }
      return;
    } else if (groupRef.current && !groupRef.current.visible) {
      groupRef.current.visible = true;
    }

    const t = state.clock.getElapsedTime();

    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = t;
      shaderMatRef.current.uniforms.uScrollProgress.value = heroScrollProgress;

      if (motionOn) {
        const worldPointerX = (state.pointer.x * viewport.width) / 2;
        const worldPointerY = (state.pointer.y * viewport.height) / 2;
        targetPointerPos.current.set(worldPointerX, worldPointerY);

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
      const targetRotY = motionOn ? state.pointer.x * 0.14 : 0;
      const targetRotX = motionOn ? -state.pointer.y * 0.10 : 0;

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

      groupRef.current.position.y = Math.sin(t * 0.85) * 0.035;
    }

    if (backdropMeshRef.current) {
      const mat = backdropMeshRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = THREE.MathUtils.clamp(0.28 * (1.0 - heroScrollProgress * 1.5), 0.0, 0.28);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Partially visible portrait plane behind particles so face likeness is unmistakable */}
      {backdropTexture && (
        <mesh ref={backdropMeshRef} position={[0, 0.12, -0.15]}>
          <planeGeometry args={[2.85, 3.55]} />
          <meshBasicMaterial
            map={backdropTexture}
            transparent
            opacity={0.28}
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
