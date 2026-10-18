import React from "react";
import { Intro } from "@/components/sections/Intro";
import { Hero } from "@/components/sections/Hero";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { ProofMarquee } from "@/components/sections/ProofMarquee";
import { About } from "@/components/sections/About";
import { SystemMap } from "@/components/sections/SystemMap";
import { WorkPortals } from "@/components/sections/WorkPortals";
import { MoreBuilds } from "@/components/sections/MoreBuilds";
import { AwardGallery } from "@/components/sections/AwardGallery";
import { CodingStats } from "@/components/sections/CodingStats";
import { TechConstellation } from "@/components/sections/TechConstellation";
import { Journey } from "@/components/sections/Journey";
import { Principles } from "@/components/sections/Principles";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main>
      <Intro />
      <Hero />
      <ProofStrip />
      <ProofMarquee />
      <About />
      <SystemMap />
      <WorkPortals />
      <MoreBuilds />
      <AwardGallery />
      <CodingStats />
      <TechConstellation />
      <Journey />
      <Principles />
      <Footer />
    </main>
  );
}
