import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Navigation } from "@/components/layout/Navigation";
import { MenuOverlay } from "@/components/layout/MenuOverlay";
import { CommandDeck } from "@/components/layout/CommandDeck";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { Lightbox } from "@/components/ui/Lightbox";
import { SkipLink } from "@/components/layout/SkipLink";
import { person } from "@/content/profile";
import { GlCanvas } from "@/components/gl/GlCanvasWrapper";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Analytics } from "@vercel/analytics/next";
import "@/styles/globals.scss";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const viewport: Viewport = {
  themeColor: "#050608",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vivengorantla.dev";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Viven Gorantla — AI Systems, Developer Tools & Backend Engineering",
    template: "%s | Viven Gorantla",
  },
  description:
    "Second-year B.Tech student at GCET Hyderabad building AI developer tools, agentic workflows, backend systems, and cloud infrastructure.",
  keywords: [
    "Viven Gorantla",
    "Agentic AI",
    "Developer Tools",
    "Backend Systems",
    "Cloud Engineering",
    "PatchLine",
    "Crisis Commander",
    "BLACKBOX AI",
    "GCET Hyderabad",
    "AI Systems Engineer",
    "Full Stack Architecture",
  ],
  authors: [{ name: "Viven Gorantla", url: baseUrl }],
  creator: "Viven Gorantla",
  publisher: "Viven Gorantla",
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Viven Gorantla — AI Systems, Developer Tools & Backend Engineering",
    description:
      "Second-year B.Tech student building AI developer tools, agentic workflows, backend systems, and cloud infrastructure.",
    url: baseUrl,
    siteName: "Viven Gorantla Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Viven Gorantla — AI Systems, Developer Tools & Backend Engineering",
    description:
      "Second-year B.Tech student building AI developer tools, agentic workflows, backend systems, and cloud infrastructure.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${baseUrl}/#person`,
        name: person.name,
        jobTitle: "Student Developer & AI Systems Builder",
        disambiguatingDescription:
          "Second-year B.Tech student at GCET Hyderabad building AI developer tools, agentic workflows, and backend systems.",
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: person.institution,
        },
        url: baseUrl,
        sameAs: [
          person.links.github,
          person.links.linkedin,
          person.links.leetcode,
        ],
        knowsAbout: [
          "Agentic AI",
          "Developer Tools",
          "Backend Architecture",
          "Cloud Infrastructure",
          "Static Code Analysis",
          "Deterministic Simulation",
          "Python",
          "TypeScript",
          "Next.js",
          "Node.js",
          "FastAPI",
          "Docker",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "Viven Gorantla — AI Engineering Portfolio",
        description:
          "Production-grade portfolio and architectural case studies by Viven Gorantla.",
        publisher: {
          "@id": `${baseUrl}/#person`,
        },
      },
      {
        "@type": "ProfilePage",
        "@id": `${baseUrl}/#webpage`,
        url: baseUrl,
        name: "Viven Gorantla — AI Systems, Developer Tools & Backend Engineering",
        isPartOf: {
          "@id": `${baseUrl}/#website`,
        },
        mainEntity: {
          "@id": `${baseUrl}/#person`,
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable} ${cormorant.variable}`}
    >
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM context file" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body>
        <ScrollProgress />
        <SkipLink />
        <SmoothScroll>
          <GlCanvas />
          <Navigation />
          <MenuOverlay />
          <CommandDeck />
          <Lightbox />
          <CustomCursor />
          <div id="main-content">{children}</div>
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  );
}
