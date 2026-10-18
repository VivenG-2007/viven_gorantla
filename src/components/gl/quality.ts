export type QualityPreset = "high" | "medium" | "low" | "off";

export interface QualityConfig {
  preset: QualityPreset;
  dpr: number;
  particles: number;
  bloom: boolean;
  portalShaders: boolean;
}

export function resolveQualityPreset(motionOn: boolean): QualityConfig {
  if (typeof window === "undefined" || !motionOn) {
    return {
      preset: "off",
      dpr: 1,
      particles: 0,
      bloom: false,
      portalShaders: false,
    };
  }

  // Check data saver
  const nav = navigator as any;
  if (nav?.connection?.saveData) {
    return {
      preset: "low",
      dpr: 1,
      particles: 3000,
      bloom: false,
      portalShaders: false,
    };
  }

  const isMobile = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Synchronous, zero-network WebGL capability detection (never hangs or relies on CDN)
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      return {
        preset: "off",
        dpr: 1,
        particles: 0,
        bloom: false,
        portalShaders: false,
      };
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo
      ? (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string).toLowerCase()
      : "";

    if (isMobile) {
      return {
        preset: "low",
        dpr: 1.0,
        particles: 3500,
        bloom: false,
        portalShaders: false,
      };
    }

    // High performance GPUs: dedicated Nvidia, AMD, Apple Silicon
    const isHighTier = /nvidia|geforce|rtx|gtx|radeon rx|apple m/i.test(renderer);
    if (isHighTier) {
      return {
        preset: "high",
        dpr: Math.min(window.devicePixelRatio || 1, 1.25),
        particles: 10000,
        bloom: false,
        portalShaders: true,
      };
    }

    // Standard integrated laptops (Intel Iris / UHD / AMD Vega)
    return {
      preset: "medium",
      dpr: 1.0,
      particles: 6500,
      bloom: false,
      portalShaders: true,
    };
  } catch {
    return {
      preset: isMobile ? "low" : "medium",
      dpr: 1.0,
      particles: isMobile ? 3500 : 6500,
      bloom: false,
      portalShaders: true,
    };
  }
}
