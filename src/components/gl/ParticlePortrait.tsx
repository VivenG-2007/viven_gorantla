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

  const pointerPos = useRef(new THREE.Vector2(999, 999));
  const targetPointerPos = useRef(new THREE.Vector2(999, 999));

  // Determine grid density based on GPU quality tier
  const gridResolution = useMemo(() => {
    switch (quality.preset) {
      case "high":
        return { width: 110, height: 140, haloCount: 180 };
      case "medium":
        return { width: 90, height: 115, haloCount: 100 };
      case "low":
      default:
        return { width: 70, height: 90, haloCount: 50 };
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
        const worldW = 2.75;
        const worldH = 3.45;

        for (let y = 0; y < sampleH; y++) {
          for (let x = 0; x < sampleW; x++) {
            const idx = (y * sampleW + x) * 4;
            const r = data[idx] / 255;
            const g = data[idx + 1] / 255;
            const b = data[idx + 2] / 255;
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            const nx = (x - cx) / (sampleW * 0.5);
            const ny = (y - cy) / (sampleH * 0.5);
            const distHead = Math.sqrt(nx * nx + ny * ny);

            if (lum < 0.06 && distHead > 0.75) continue;
            if (y > sampleH * 0.75 && lum < 0.12 && (x % 2 === 0 || y % 2 === 0)) continue;

            const wx = (x / sampleW - 0.5) * worldW;
            const wy = -(y / sampleH - 0.5) * worldH;

            const ellipsoid = Math.sqrt(
              Math.max(0, 1.0 - Math.min(1.0, nx * nx * 1.35 + ny * ny * 0.95))
            );

            const isCenterFace = distHead < 0.65;
            const relief = isCenterFace ? (lum - 0.45) * 0.35 : 0.0;
            const wz = ellipsoid * 0.48 + relief;

            origins.push(wx, wy, wz);
            positions.push(wx, wy, wz);

            const isRim = distHead > 0.62 || nx > 0.38 || nx < -0.38 || y > sampleH * 0.65;
            const goldFactor = isRim
              ? Math.min(1.0, Math.pow(Math.max(0, distHead - 0.5) / 0.45, 1.3))
              : 0.0;

            const silverBase = Math.min(1.0, lum * 1.25);
            const faceColor = new THREE.Color(silverBase, silverBase * 0.98, silverBase * 0.96);
            const goldColor = new THREE.Color(1.0, 0.78, 0.32);
            const mixedColor = faceColor.clone().lerp(goldColor, goldFactor * 0.85);

            colors.push(mixedColor.r, mixedColor.g, mixedColor.b);

            const shimmerSpeed = 0.5 + Math.random() * 1.5;
            const sizeMult = 0.75 + lum * 0.6 + Math.random() * 0.3;
            const randomPhase = Math.random();

            params.push(goldFactor, shimmerSpeed, sizeMult, randomPhase);
          }
        }

        // Ambient halo embers
        for (let i = 0; i < haloCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const rad = 1.2 + Math.random() * 0.85;
          const hx = Math.cos(angle) * rad * (worldW * 0.52);
          const hy = Math.sin(angle) * rad * (worldH * 0.42) + 0.15;
          const hz = (Math.random() - 0.5) * 0.6;

          origins.push(hx, hy, hz);
          positions.push(hx, hy, hz);

          const haloGold = new THREE.Color(1.0, 0.75 + Math.random() * 0.15, 0.25 + Math.random() * 0.2);
          colors.push(haloGold.r, haloGold.g, haloGold.b);
          params.push(1.0, 0.8 + Math.random() * 1.2, 0.5 + Math.random() * 0.5, Math.random());
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute("aOrigin", new THREE.Float32BufferAttribute(origins, 3));
        geo.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 3));
        geo.setAttribute("aParams", new THREE.Float32BufferAttribute(params, 4));

        createdGeo = geo;
        setGeometry(geo);
      } catch (err) {
        console.warn("Portrait canvas sampling failed, using procedural point cloud fallback", err);
        const fallbackGeo = buildProceduralFacePoints(sampleW, sampleH, haloCount);
        createdGeo = fallbackGeo;
        setGeometry(fallbackGeo);
      }
    };

    const img = new Image();
    // Only set crossOrigin if loading external http URL
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
    // 1. Offscreen culling: If user scrolled past hero, pause rendering to save 100% GPU
    if (scrollProgress > 0.82) {
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
      shaderMatRef.current.uniforms.uScrollProgress.value = scrollProgress;

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

      groupRef.current.position.y = Math.sin(t * 0.75) * 0.04;
    }

    if (backdropMeshRef.current) {
      const mat = backdropMeshRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = THREE.MathUtils.clamp(0.14 * (1.0 - scrollProgress * 1.6), 0.0, 0.14);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Partially visible portrait plane behind particles */}
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
