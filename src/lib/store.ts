import { create } from "zustand";
import type Lenis from "lenis";
import type { Award } from "@/content/awards";

export type GpuTier = "high" | "medium" | "low" | "off";

interface MotionState {
  motionOn: boolean;
  gpuTier: GpuTier;
  lenis: Lenis | null;
  scroll: {
    velocity: number;
    progress: number;
  };
  activeSection: string;
  commandDeckOpen: boolean;
  menuOpen: boolean;
  lightboxItem: Award | null;
  hoveredTech: string | null;
  selectedTech: string | null;

  setMotionOn: (val: boolean) => void;
  setGpuTier: (tier: GpuTier) => void;
  setLenis: (lenis: Lenis | null) => void;
  setActiveSection: (section: string) => void;
  setCommandDeckOpen: (open: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  setLightboxItem: (item: Award | null) => void;
  setHoveredTech: (tech: string | null) => void;
  setSelectedTech: (tech: string | null) => void;
}

export const useMotionStore = create<MotionState>((set) => ({
  motionOn: true,
  gpuTier: "high",
  lenis: null,
  scroll: {
    velocity: 0,
    progress: 0,
  },
  activeSection: "intro",
  commandDeckOpen: false,
  menuOpen: false,
  lightboxItem: null,
  hoveredTech: null,
  selectedTech: null,

  setMotionOn: (val) => {
    try {
      localStorage.setItem("viven-motion-pref", val ? "on" : "off");
      document.documentElement.setAttribute("data-motion", val ? "on" : "off");
    } catch {
      // Ignore localStorage errors
    }
    set({ motionOn: val });
  },

  setGpuTier: (tier) => set({ gpuTier: tier }),
  setLenis: (lenis) => set({ lenis }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setCommandDeckOpen: (commandDeckOpen) => set({ commandDeckOpen }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setLightboxItem: (lightboxItem) => set({ lightboxItem }),
  setHoveredTech: (hoveredTech) => set({ hoveredTech }),
  setSelectedTech: (selectedTech) => set({ selectedTech }),
}));
