"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useMotionStore } from "@/lib/store";
import { liquidChromeVertex, liquidChromeFragment } from "./shaders/liquidChrome.glsl";

export function LiquidChromePlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const scrollProgress = useMotionStore((s) => s.scroll.progress);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: size.width / Math.max(1, size.height) },
      uPointer: { value: 1.0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [size]
  );

  useFrame((state, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
      matRef.current.uniforms.uAspect.value = size.width / Math.max(1, size.height);
      matRef.current.uniforms.uRes.value.set(size.width, size.height);
      matRef.current.uniforms.uScroll.value = scrollProgress;

      // Mouse coords normalized to 0..1
      const mx = (state.pointer.x + 1) * 0.5;
      const my = (1 - state.pointer.y) * 0.5;
      matRef.current.uniforms.uMouse.value.lerp(new THREE.Vector2(mx, my), 0.08);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -4]}>
      <planeGeometry args={[viewport.width * 1.5, viewport.height * 1.5]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={liquidChromeVertex}
        fragmentShader={liquidChromeFragment}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}
