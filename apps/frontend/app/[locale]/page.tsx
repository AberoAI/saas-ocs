// apps/frontend/app/[locale]/page.tsx

"use client";

import HeroSection from "@/components/landingpage/hero";
import Page1Section from "@/components/landingpage/page1";
import Page2Section from "@/components/landingpage/page2";
import Page3Section from "@/components/landingpage/page3";
import Page4Section from "@/components/landingpage/page4";
import Page5Section from "@/components/landingpage/page5";
import Page6Section from "@/components/landingpage/page6";
import Page7Section from "@/components/landingpage/page7";
import Page8ClosingSection from "@/components/landingpage/Page8ClosingSection";

export default function LocaleHomePage() {
  return (
    <main className="pin-root relative bg-white overflow-x-hidden">
      <HeroSection />
      <Page1Section />
      <Page2Section />
      <Page3Section />
      <Page4Section />
      <Page5Section />

      <div aria-hidden="true" className="h-[6vh] bg-white" />

      <Page6Section />
      <Page7Section />
      <Page8ClosingSection />
    </main>
  );
}
