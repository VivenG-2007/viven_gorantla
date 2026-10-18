export interface Person {
  name: string;
  role: string;
  institution: string;
  years: string;
  cgpa: {
    value: string;
    source: string;
    show: boolean;
  };
  links: {
    github: string;
    linkedin: string;
    leetcode: string;
    patchline: string;
    blackboxEvent: string;
    launchpadPost: string;
  };
  email: string | null;
  resumeUrl: string | null;
}

export const person: Person = {
  name: "Viven Gorantla",
  role: "Student & tech enthusiast · turning magic into logic",
  institution: "Geethanjali College of Engineering and Technology (GCET), Hyderabad",
  years: "2025–2029",
  cgpa: {
    value: "9.36",
    source: "as of sem-2",
    show: true, // Single switch to toggle CGPA visibility
  },
  links: {
    github: "https://github.com/VivenG-2007",
    linkedin: "https://www.linkedin.com/in/viven-gorantla",
    leetcode: "https://leetcode.com/u/m5oBHEqoAY/",
    patchline: "https://github.com/VivenG-2007/patchline.ai",
    blackboxEvent: "https://ieee-blackbox-ai.github.io/",
    launchpadPost: "https://www.linkedin.com/posts/viven-gorantla_hackathon-launchpadx2026-teamwork-activity-7497669691776270336-6HY4",
  },
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL || null,
};
