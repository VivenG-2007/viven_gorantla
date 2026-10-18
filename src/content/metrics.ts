export interface CodingMetrics {
  asOf: string;
  hive: {
    solved: number;
    language: string;
    submissions: number;
    window: string;
    platform: string;
    note: string;
  };
  leetcode: {
    badge: string;
    url: string;
    languageCounters: {
      C: number;
      MySQL: number;
      Java: number;
    };
    note: string;
  };
}

export const metrics: CodingMetrics = {
  asOf: "18 Oct 2026",
  hive: {
    solved: 273,
    language: "C",
    submissions: 488,
    window: "Nov 2025 – Oct 2026",
    platform: "GCET Hive (college coding platform)",
    note: "Screenshot snapshot; may change. Confidential student ID masked.",
  },
  leetcode: {
    badge: "50 Days Badge 2026",
    url: "https://leetcode.com/u/m5oBHEqoAY/",
    languageCounters: {
      C: 74,
      MySQL: 16,
      Java: 3,
    },
    note: "Language-specific problem counts — tracked separately per platform architecture; never summed as a single total.",
  },
};
