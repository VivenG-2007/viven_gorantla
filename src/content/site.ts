export interface NavItem {
  label: string;
  href: string;
  numeral: string;
}

export const navItems: NavItem[] = [
  { label: "Intro", href: "#intro", numeral: "01" },
  { label: "About", href: "#about", numeral: "02" },
  { label: "Systems", href: "#systems", numeral: "03" },
  { label: "Selected Work", href: "#work", numeral: "04" },
  { label: "More Builds", href: "#builds", numeral: "05" },
  { label: "Proof & Awards", href: "#proof", numeral: "06" },
  { label: "Coding Stats", href: "#coding", numeral: "07" },
  { label: "Constellation", href: "#stack", numeral: "08" },
  { label: "Timeline", href: "#journey", numeral: "09" },
  { label: "How I Work", href: "#principles", numeral: "10" },
  { label: "Contact", href: "#contact", numeral: "11" },
];

export const siteContent = {
  hero: {
    headline: "I BUILD SYSTEMS THAT MAKE AI USEFUL.",
    subline:
      "Viven Gorantla — student developer exploring agentic AI, developer tools, backend systems and cloud infrastructure.",
    ctas: [
      { label: "EXPLORE THE WORK", href: "#work" },
      { label: "HOW I THINK", href: "#systems" },
      { label: "LET'S CONNECT", href: "#contact" },
    ],
    orbitNodes: [
      { label: "AGENTIC AI", section: "#systems" },
      { label: "BACKEND SYSTEMS", section: "#work" },
      { label: "DEVELOPER TOOLS", section: "#work" },
      { label: "CLOUD", section: "#stack" },
    ],
    educationBadge: "B.Tech · GCET Hyderabad · 2025–2029",
  },
  marquee: [
    "PLAN / BUILD / TEST / VERIFY / REPEAT",
    "1ST PLACE · BLACKBOX AI 1.0 (IEEE CS)",
    "9TH POSITION · LAUNCHPADX-2026 (SNIST)",
    "TOP 20 OF 127 TEAMS · HACKWAVE 3.0 (SELF-REPORTED)",
    "273 SOLVED IN C · GCET HIVE",
    "50 DAYS BADGE 2026 · LEETCODE",
  ],
  about: {
    short:
      "I'm Viven, a second-year B.Tech student at Geethanjali College of Engineering and Technology. I like working where AI meets software engineering: building tools, connecting backend services, exploring agentic workflows, and thinking about how to verify what an AI system produces. Hackathons and side projects are how I learn — build, test, revise, explain.",
    extendedThesis:
      "My interest isn't making an AI demo respond. It's the engineering around it: how a task is broken down, how context is retrieved, how models are chosen, how services trust each other, how permissions are enforced, and how the result is checked. That thread runs through PatchLine, Crisis Commander, my BLACKBOX AI work and the reusable backend infrastructure I keep building. I'm still learning — this site shows the progress through real code, diagrams, and evidence.",
  },
  principles: [
    {
      num: "01",
      title: "Understand the problem",
      tagline: "Before writing prompt templates or API routes, dissect the core failure mode.",
      example: "In PatchLine, the failure mode wasn't finding vulnerabilities — static linters already do that. The real bottleneck was manual triage, context assembly, and patch verification. We targeted the triage bottleneck rather than rebuilding a linter.",
    },
    {
      num: "02",
      title: "Design the workflow",
      tagline: "Map the state machine, token budget, and dependency boundaries explicitly.",
      example: "In BLACKBOX AI 1.0, we avoided naive random sampling or burning budget immediately on LLMs. Phase 1 strictly ran range discovery and OFAT feature sensitivity, saving surrogate modeling for when the input boundaries were mapped.",
    },
    {
      num: "03",
      title: "Build the system",
      tagline: "Decouple services cleanly: independent auth, typed schemas, and reproducible runtime environments.",
      example: "Our reusable auth microservice isolates RS256 JWT signing from downstream consumers. Downstream services verify tokens locally via public keys with zero network hops to the auth service per request.",
    },
    {
      num: "04",
      title: "Verify the result",
      tagline: "The AI proposes. Software verifies. A human approves.",
      example: "In Crisis Commander, AI commander actions must pass deterministic schema validators and safety bounds. Critical actions like mass evacuations enforce role-based 403 barriers requiring explicit human commander signoff.",
    },
    {
      num: "05",
      title: "Learn and iterate",
      tagline: "Every hackathon is a crucible for diagnosing edge cases and stress-testing mental models.",
      example: "Moving from command-line tools to full distributed architectures across LaunchpadX and DECODEX showed where asynchronous message queues, rate limits, and fallback models become essential.",
    },
  ],
};
