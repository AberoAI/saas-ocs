// apps/frontend/app/components/landingpage/page3.tsx
"use client";

import { useTranslations } from "next-intl";
import Page3AnimatedCubeShowCase from "@/components/landingpage/animations/Page3AnimatedCubeShowCase";

export default function Page3Section() {
  const t = useTranslations();

  const showcaseHeadline = t("hero.showcase.headline");
  const headlineLines = showcaseHeadline.split("\n");

  return (
    <section id="page-3" className="relative z-10 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Surface Container */}
        <div
          className="bg-[#F9FCFD] p-10 md:p-12"
          style={{ borderRadius: "clamp(18px, 2.2vw, 32px)" }}
        >
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="space-y-5">
              <div className="space-y-1">
                {/* Brand label */}
                <p className="font-poppins text-[35px] font-semibold tracking-wide text-[#26658C]">
                  AberoAI
                </p>

                {/* Main headline */}
                <h2 className="font-poppins font-medium text-[38px] tracking-tight text-[#585858] md:text-[42px]">
                  {headlineLines.map((line, idx) => (
                    <span key={idx} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
              </div>

              {/* Subheadline (same as old) */}
              <p className="font-poppins text-[18px] leading-relaxed text-slate-700 md:text-[20px] md:max-w-xl">
                {t("hero.showcase.sub")}
              </p>

              {/* Body (same as old) */}
              <p className="font-poppins whitespace-pre-line text-sm leading-relaxed text-slate-700 md:text-base md:max-w-2xl">
                {t("hero.showcase.body")}
              </p>

              {/* Microline (same size/color as old, but with partial italic) */}
              <p className="font-poppins text-[13px] leading-relaxed text-slate-400 md:max-w-md">
                <span className="block">
                  {t("hero.showcase.microlineLine1")}
                </span>
                <span className="block">
                  {t("hero.showcase.microlineLine2Normal")}
                  <span className="italic">
                    {t("hero.showcase.microlineLine2Em")}
                  </span>
                  {t("hero.showcase.microlineLine2After")}
                </span>
              </p>
            </div>

            {/* Showcase (right column) */}
            <div className="flex justify-center overflow-visible pt-6 md:pt-8">
              <Page3AnimatedCubeShowCase />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
