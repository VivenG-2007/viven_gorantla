export type VerificationType = "document" | "self-reported" | "training" | "profile";
export type AwardCategory = "Hackathon" | "Training" | "Coding" | "Community";

export interface Award {
  id: string;
  title: string;
  org: string;
  date: string;
  category: AwardCategory;
  verification: VerificationType;
  caption: string;
  image: string | null;
  image2?: string | null;
  badge?: string | null;
}

export interface LearningItem {
  title: string;
  org: string;
  date: string;
}

export const awards: Award[] = [
  {
    id: "blackbox",
    title: "BLACKBOX AI 1.0 — 1st Place",
    org: "IEEE Computer Society · GCET IEEE Student Branch",
    date: "6–7 Oct 2026",
    category: "Hackathon",
    verification: "document",
    caption: "Certificate of Achievement (team: localhost:420, per certificate).",
    image: "awards/blackbox-certificate",
  },
  {
    id: "launchpadx",
    title: "LaunchpadX-2026 — 9th Position",
    org: "SNIST, Hyderabad · CSE · with VetriAI",
    date: "22–23 Aug 2026",
    category: "Hackathon",
    verification: "document",
    caption: "Trophy + Certificate of Achievement. '9th of 240 teams' is self-reported (team BrainBox).",
    image: "awards/launchpadx-trophy",
    image2: "awards/launchpadx-certificate",
  },
  {
    id: "decodex",
    title: "DECODEX 2.0 — Certificate of Merit",
    org: "Hackability × GCET Data Science × ISTE",
    date: "15–16 Oct 2026",
    category: "Hackathon",
    verification: "document",
    caption: "Two-day workshop 'Build your own AI agent'. Position of merit — no numeric rank printed.",
    image: "awards/decodex-certificate",
  },
  {
    id: "hackwave",
    title: "HackWave 3.0 — Top 20 of 127 teams",
    org: "SNIST",
    date: "2026",
    category: "Hackathon",
    verification: "self-reported",
    caption: "Self-reported placement; PatchLine was the project.",
    image: null,
  },
  {
    id: "aws-simulearn",
    title: "AWS SimuLearn: Cloud Practitioner",
    org: "AWS Training & Certification",
    date: "4 Oct 2026",
    category: "Training",
    verification: "training",
    caption: "Training completion certificate (not the AWS Certified Cloud Practitioner exam).",
    image: "training/aws-simulearn-certificate",
    badge: "training/aws-simulearn-badge",
  },
  {
    id: "aws-cloudquest",
    title: "AWS Cloud Quest: Cloud Practitioner",
    org: "AWS Training & Certification",
    date: "24 May 2026",
    category: "Training",
    verification: "training",
    caption: "Training completion certificate.",
    image: "training/aws-cloudquest-certificate",
  },
  {
    id: "leetcode50",
    title: "LeetCode 50 Days Badge 2026",
    org: "LeetCode",
    date: "2026",
    category: "Coding",
    verification: "profile",
    caption: "Solved problems on 50+ days in 2026.",
    image: "coding/leetcode-50-days",
  },
  {
    id: "robotics",
    title: "Volunteer — Robotics Club, GCET",
    org: "GCET",
    date: "from Aug 2026",
    category: "Community",
    verification: "profile",
    caption: "Role per LinkedIn; no leadership claim.",
    image: null,
  },
];

export const learning: LearningItem[] = [
  {
    title: "MongoDB Overview: Core Concepts and Architecture",
    org: "MongoDB",
    date: "Jun 2026",
  },
  {
    title: "AI Agents 101: Building AI Agents with MCP and Open-Source Inference",
    org: "AMD AI Academy",
    date: "May 2026",
  },
  {
    title: "Fundamentals of Machine Learning and AI",
    org: "AWS",
    date: "May 2026",
  },
  {
    title: "Introduction to Model Context Protocol",
    org: "Anthropic",
    date: "May 2026",
  },
];
