// apps/frontend/components/landingpage/Page8ClosingSection.tsx

"use client";

import FaqLanding from "@/components/faq/FaqLanding";
import Footer from "@/components/footer/Footer";

export default function Page8ClosingSection() {
  return (
    <section
      id="page-8"
      className="bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(209,237,255,0.6)_25%,rgba(154,190,212,0.6)_48%,rgba(38,101,140,0.7)_100%)]"
    >
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        {/* FAQ — match HERO height rules */}
        <div className="relative min-h-[calc(100vh-72px)] pt-[96px] pb-[24px]">
          <FaqLanding />
        </div>
      </div>

      {/* EXTRA SPACE between FAQ and Footer */}
      <div aria-hidden="true" className="h-[64px] md:h-[96px]" />

      {/* Footer lives INSIDE gradient */}
      <Footer variant="onDark" />
    </section>
  );
}
