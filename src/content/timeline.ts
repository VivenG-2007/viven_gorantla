export interface TimelineEntry {
  date: string;
  title: string;
  also?: string;
  highlight?: boolean;
}

export const timeline: TimelineEntry[] = [
  {
    date: "2025",
    title: "Commences B.Tech at Geethanjali College of Engineering and Technology (GCET, 2025–2029)",
  },
  {
    date: "May 2026",
    title: "AWS Cloud Quest: Cloud Practitioner — training completed",
    also: "AI Agents 101 (AMD), AWS ML/AI fundamentals, Intro to MCP (Anthropic)",
  },
  {
    date: "Jun 2026",
    title: "MongoDB Overview: Core Concepts and Architecture course completed",
  },
  {
    date: "Aug 2026",
    title: "Joins Robotics Club GCET as active volunteer",
  },
  {
    date: "22–23 Aug 2026",
    title: "LaunchpadX-2026 at SNIST — Secured 9th Position (Trophy & Certificate)",
    highlight: true,
  },
  {
    date: "4 Oct 2026",
    title: "AWS SimuLearn: Cloud Practitioner — training completed",
  },
  {
    date: "6–7 Oct 2026",
    title: "BLACKBOX AI 1.0 — 1st Place Winner (IEEE CS / IEEE GCET-SB)",
    highlight: true,
  },
  {
    date: "15–16 Oct 2026",
    title: "DECODEX 2.0 'Build your own AI agent' — Certificate of Merit",
    highlight: true,
  },
];
