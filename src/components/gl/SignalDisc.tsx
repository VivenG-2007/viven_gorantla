"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useMotionStore } from "@/lib/store";
import { signalDiscVertex, signalDiscFragment } from "./shaders/signalDisc.glsl";

const STAGES = [
  "Source Code",
  "Static Analysis",
  "Context / Retrieval",
  "Model Routing",
  "Candidate Fix",
  "Verification",
  "Human Review",
];

export function SignalDisc() {
  const groupRef = useRef<THREE.Group>(null);
  const faceMatRef = useRef<THREE.ShaderMaterial>(null);
  const nodesRef = useRef<THREE.Group>(null);

  const scrollProgress = useMotionStore((s) => s.scroll.progress);

  const faceUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uViolet: { value: new THREE.Color("#8B5CF6") },
      uCyan: { value: new THREE.Color("#F59E0B") },
    }),
    []
  );

  // Positions for 7 orbit nodes
  const nodePositions = useMemo(() => {
    return STAGES.map((_, i) => {
      const angle = (i / STAGES.length) * Math.PI * 2;
      const radius = 2.45;
      return new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      );
    });
  }, []);

  // Orbit ring points for LineLoop
  const orbitPoints = useMemo(() => {
    const pts = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * 2.45, 0, Math.sin(theta) * 2.45));
    }
    return pts;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (faceMatRef.current) {
      faceMatRef.current.uniforms.uTime.value = t;
      faceMatRef.current.uniforms.uPointer.value.set(
        state.pointer.x * 0.5,
        state.pointer.y * 0.5
      );
    }

    if (groupRef.current) {
      // Damped pointer tilt
      const targetRotX = 0.55 + state.pointer.y * 0.15;
      const targetRotY = state.pointer.x * 0.25;
      const targetRotZ = scrollProgress * 0.6; // Scroll driven rotation

      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotX,
        4,
        delta
      );
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotY,
        4,
        delta
      );
      groupRef.current.rotation.z = THREE.MathUtils.damp(
        groupRef.current.rotation.z,
        targetRotZ,
        4,
        delta
      );

      // Micro float oscillation
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.08;
    }

    if (nodesRef.current) {
      nodesRef.current.rotation.y = t * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Outer Polished Chrome Rim */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.045, 24, 80]} />
        <meshPhysicalMaterial
          color="#d1d5db"
          metalness={1.0}
          roughness={0.15}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      {/* Vinyl Disc Face (Shader with conic sheen & micro-grooves) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.98, 80]} />
        <shaderMaterial
          ref={faceMatRef}
          vertexShader={signalDiscVertex}
          fragmentShader={signalDiscFragment}
          uniforms={faceUniforms}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Dark Central Core */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.08, 36]} />
        <meshPhysicalMaterial
          color="#0b0d12"
          metalness={0.9}
          roughness={0.3}
          clearcoat={0.8}
        />
      </mesh>

      {/* Center Spindle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.16, 24]} />
        <meshStandardMaterial color="#e2e8f0" metalness={1} roughness={0.1} />
      </mesh>

      {/* Orbit Ring with Emissive Pipeline Nodes */}
      <group ref={nodesRef}>
        {/* Hair-thin orbit ring */}
        <lineLoop>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(orbitPoints.flatMap((p) => [p.x, p.y, p.z])),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.35}
            linewidth={1}
          />
        </lineLoop>

        {/* 7 Pipeline Stage Nodes */}
        {nodePositions.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#f59e0b" : "#8b5cf6"}
              emissive={i % 2 === 0 ? "#f59e0b" : "#8b5cf6"}
              emissiveIntensity={1.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
