"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./SignalExplorer.module.scss";

interface Discipline {
  id: string;
  tabLabel: string;
  numeral: string;
  eyebrow: string;
  centerTag: string;
  heading: string;
  story: string;
  strengths: string[];
  linkHref: string;
  linkLabel: string;
}

const disciplines: Discipline[] = [
  {
    id: "agents",
    tabLabel: "Agentic Systems",
    numeral: "01 / 03",
    eyebrow: "DAGS · RECOVERY LOOPS · MULTI-MODEL",
    centerTag: "DETERMINISM",
    heading: "Make AI execute with deterministic guarantees.",
    story:
      "Multi-agent state machines that isolate AST diffs, verify candidate patches against regression tests, and enforce hard RBAC boundaries before human sign-off.",
    strengths: ["LangGraph", "Tree-sitter", "Semgrep", "Deterministic DAGs", "JWT Gateways"],
    linkHref: "/work/patchline",
    linkLabel: "Inspect PatchLine Architecture",
  },
  {
    id: "tooling",
    tabLabel: "Developer Tooling",
    numeral: "02 / 03",
    eyebrow: "CLI ENGINES · AST PARSING · LOCAL-FIRST",
    centerTag: "SUB-SECOND",
    heading: "Eliminate latency between thought and execution.",
    story:
      "Sub-second terminal telemetry, local cryptographic token verifiers, and custom Git hooks engineered for builders who live in fast feedback loops.",
    strengths: ["Node.js CLI", "TypeScript", "Tree-sitter AST", "Git Hooks", "Docker Compose"],
    linkHref: "/work/devvault",
    linkLabel: "Inspect DevVault & Tooling",
  },
  {
    id: "edge",
    tabLabel: "Edge Vision & AI",
    numeral: "03 / 03",
    eyebrow: "ONNX · MEDIAPIPE · YOLOV8",
    centerTag: "PERCEPTION",
    heading: "Spatial intelligence executed on-device.",
    story:
      "Low-latency computer vision pipelines combining YOLOv8 keypoint tracking with MediaPipe hand landmark meshes for accessible real-time sign language synthesis.",
    strengths: ["YOLOv8", "OpenCV", "MediaPipe", "WebGL Shaders", "On-Device Inference"],
    linkHref: "/work/signwave",
    linkLabel: "Inspect SignWave Vision",
  },
];

export function SignalExplorer() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const active = disciplines[activeIdx];

  return (
    <div className={styles.explorerCard}>
      {/* Topline Bar */}
      <div className={styles.topline}>
        <span className={styles.eyebrow}>{active.eyebrow}</span>
        <span className={styles.numeral} aria-hidden="true">
          {active.numeral}
        </span>
      </div>

      {/* Visual Canvas Area with Dynamic Geometry */}
      <div className={styles.visualCanvas} aria-hidden="true">
        <div className={`${styles.dynamicShape} ${styles[`shape_${active.id}`]}`}>
          {/* Moving Radar Sweep Beam */}
          <div className={styles.radarSweep} />

          {/* Concentric Expanding Pulse Wave Rings */}
          <div className={styles.pulseWave1} />
          <div className={styles.pulseWave2} />
          <div className={styles.pulseWave3} />

          {/* Rotating Orbital Rings with Glowing Satellite Nodes */}
          <div className={styles.ring1}>
            <span className={styles.satelliteDot1} />
          </div>
          <div className={styles.ring2}>
            <span className={styles.satelliteDot2} />
          </div>
          <div className={styles.ring3} />
          <div className={styles.ringOuter} />

          {/* Digital Reticle Crosshairs */}
          <div className={styles.crosshairX} />
          <div className={styles.crosshairY} />
          <div className={styles.gridOverlay} />
        </div>

        <span className={styles.centerBadge}>
          <span className="signal-text">{active.centerTag}</span>
        </span>
      </div>

      {/* Discipline Toggle Buttons */}
      <div className={styles.optionsGroup} role="group" aria-label="Explore my engineering disciplines">
        {disciplines.map((d, idx) => (
          <button
            key={d.id}
            type="button"
            className={`${styles.optionBtn} ${idx === activeIdx ? styles.activeOption : ""}`}
            aria-pressed={idx === activeIdx}
            onClick={() => setActiveIdx(idx)}
          >
            <span>{d.tabLabel}</span>
            <span className={styles.optionArrow} aria-hidden="true">
              ↗
            </span>
          </button>
        ))}
      </div>

      {/* Dynamic Story & Details */}
      <div className={styles.storyContent} aria-live="polite">
        <h3 className={styles.storyHeading}>{active.heading}</h3>
        <p className={styles.storyLead}>{active.story}</p>

        <div className={styles.strengthsRow}>
          {active.strengths.map((s) => (
            <span key={s} className={styles.strengthTag}>
              {s}
            </span>
          ))}
        </div>

        <Link href={active.linkHref} className={styles.storyLink}>
          <span>{active.linkLabel}</span>
          <ArrowUpRight size={15} />
        </Link>
      </div>

      <p className={styles.hintText}>Select an engineering discipline to inspect architectural principles.</p>
    </div>
  );
}
