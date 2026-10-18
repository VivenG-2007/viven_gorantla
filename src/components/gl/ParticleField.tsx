"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface ParticleFieldProps {
  count?: number;
}

export function ParticleField({ count = 2500 }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, seeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sd = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Cylindrical/spherical dispersion around center
      const r = 3.5 + Math.random() * 8.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;

      pos[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = r * Math.sin(phi);
      pos[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);

      sd[i] = Math.random();
    }

    return { positions: pos, seeds: sd };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 18.0 },
      uViolet: { value: new THREE.Color("#8B5CF6") },
      uCyan: { value: new THREE.Color("#22D3EE") },
    }),
    []
  );

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta * 0.4;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  const vertexShader = /* glsl */ `
    attribute float aSeed;
    varying float vSeed;
    uniform float uTime;
    uniform float uSize;

    void main() {
      vSeed = aSeed;
      vec3 pos = position;

      // Layered sine curl motion on GPU
      float t = uTime + aSeed * 6.2831;
      pos.x += sin(pos.y * 0.5 + t) * 0.2;
      pos.y += cos(pos.x * 0.5 + t * 0.8) * 0.2;
      pos.z += sin(pos.z * 0.5 + t * 0.6) * 0.2;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = uSize * (1.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = /* glsl */ `
    varying float vSeed;
    uniform vec3 uViolet;
    uniform vec3 uCyan;

    void main() {
      // Soft circular point sprite
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      if (dist > 0.5) discard;
      float alpha = smoothstep(0.5, 0.0, dist) * 0.45;

      vec3 color = mix(uViolet, uCyan, vSeed);
      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aSeed"
          args={[seeds, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
