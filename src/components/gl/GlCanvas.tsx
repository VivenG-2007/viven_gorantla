"use client";

import { useEffect } from "react";
import { useMotionStore } from "@/lib/store";
import { resolveQualityPreset } from "./quality";

export function GlCanvas() {
  const motionOn = useMotionStore((s) => s.motionOn);
  const setGpuTier = useMotionStore((s) => s.setGpuTier);

  useEffect(() => {
    const q = resolveQualityPreset(motionOn);
    setGpuTier(q.preset);
  }, [motionOn, setGpuTier]);

  return null;
}
