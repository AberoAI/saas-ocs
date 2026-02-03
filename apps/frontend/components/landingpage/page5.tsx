// apps/frontend/components/landingpage/page5.tsx
"use client";

import { useTranslations, useLocale } from "next-intl";
import Page5ContinuityShowcase from "@/components/landingpage/animations/Page5ContinuityShowcase";

export default function Page5Section() {
  const t = useTranslations();
  const locale = useLocale();
  const isEn = locale === "en";
  const isTr = locale === "tr";

  const headline = t("page5.headline");
  const headlineLines = headline.split("\n");

  const body = t("page5.body");
  const bodyLines = body.split("\n");

  // Headline coloring:
  // #26658C for: "Your clinic" / "Kliniğiniz"
  // #585858 for the rest
  const renderHeadline = () => {
    const highlightEn = "Your clinic";
    const highlightTr = "Kliniğiniz";
    const highlight = isEn ? highlightEn : isTr ? highlightTr : "";

    return (
      <>
        {headlineLines.map((line, idx) => {
          if (idx === 0 && highlight && line.includes(highlight)) {
            const [before, after] = line.split(highlight);
            return (
              <span key={idx} className="block">
                {before && <span className="text-[#585858]">{before}</span>}
                <span className="text-[#26658C]">{highlight}</span>
                {after && <span className="text-[#585858]">{after}</span>}
              </span>
            );
          }

          return (
            <span key={idx} className="block text-[#585858]">
              {line}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <section id="page-5" className="relative z-10 bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        {/* Centered text block */}
        <div className="mx-auto mt-4 max-w-4xl text-center">
          <h2 className="mt-4 text-[33px] md:text-[39px] font-semibold">
            {renderHeadline()}
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-[17px] md:text-[19px] leading-relaxed text-slate-700">
            {t("page5.subheadline")}
          </p>

          <p className="mx-auto mt-6 max-w-3xl text-sm md:text-base leading-relaxed text-slate-700">
            {bodyLines.map((line, idx) => (
              <span key={idx} className="block">
                {line}
              </span>
            ))}
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-xs md:text-sm leading-relaxed text-slate-500 italic">
            {t("page5.microline")}
          </p>
        </div>

        {/* Showcase (wajib berada di bawah text page 5) */}
        <div className="mt-14">
          <Page5ContinuityShowcase />
        </div>
      </div>
    </section>
  );
}
