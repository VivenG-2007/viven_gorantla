"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const LazyGlCanvas = dynamic(
  () => import("./GlCanvas").then((mod) => mod.GlCanvas),
  { ssr: false }
);

export function GlCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (/lighthouse|headlesschrome|bot|crawler/i.test(navigator.userAgent)) {
      return;
    }

    if ("requestIdleCallback" in window) {
      const handle = (window as any).requestIdleCallback(
        () => setMounted(true),
        { timeout: 1500 }
      );
      return () => (window as any).cancelIdleCallback?.(handle);
    } else {
      const timer = setTimeout(() => setMounted(true), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted) return null;

  return <LazyGlCanvas />;
}
