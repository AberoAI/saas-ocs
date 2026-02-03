// apps/frontend/components/landingpage/page2.tsx
"use client";

import { useTranslations, useLocale } from "next-intl";
import Page2DashboardShowCase from "@/components/landingpage/animations/Page2DashboardShowCase";

export default function Page2Section() {
  const t = useTranslations();
  const locale = useLocale();
  const isEn = locale === "en";
  const isTr = locale === "tr";

  // PAGE 2 HEADLINE: highlight "Stability" / "İstikrar" dengan #26658C
  // Sisanya menggunakan #585858
  const renderPage2Headline = () => {
    const headline = t("page2.headline");
    const [rawLine1, rawLine2] = headline.split("\n");
    const line1 = rawLine1 ?? "";
    const line2 = rawLine2 ?? "";

    const highlight = isEn ? "Stability" : isTr ? "İstikrar" : "";

    if (!highlight || !line1.includes(highlight)) {
      // Fallback: tampilkan apa adanya dengan warna default #585858
      return (
        <>
          {line1 && <span className="block text-[#585858]">{line1}</span>}
          {line2 && <span className="block text-[#585858]">{line2}</span>}
        </>
      );
    }

    const [before, after] = line1.split(highlight);

    return (
      <>
        <span className="block">
          {before && <span className="text-[#585858]">{before}</span>}
          <span className="text-[#26658C]">{highlight}</span>
          {after && <span className="text-[#585858]">{after}</span>}
        </span>
        {line2 && <span className="block text-[#585858]">{line2}</span>}
      </>
    );
  };

  return (
    <section id="page-2" className="relative z-10 bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mt-4 md:mt-0 md:flex md:items-start md:justify-between md:gap-10">
          {/* KIRI: Headline + subheadline */}
          <div className="md:w-3/5">
            <h2 className="mt-4 text-2xl md:text-3xl font-semibold">
              {renderPage2Headline()}
            </h2>

            {/* SUBHEADLINE PAGE 2: tetap */}
            <p className="mt-4 max-w-2xl text-[17px] md:text-[19px] leading-relaxed text-slate-700">
              {t("page2.subheadline")}
            </p>
          </div>

          {/* KANAN: Body + microline */}
          <div className="mt-10 md:mt-16 md:w-2/5 md:pl-8 md:translate-y-[40px]">
            <ul className="text-sm md:text-base leading-relaxed text-slate-700 space-y-1 list-disc pl-4">
              <li>{t("page2.body.0")}</li>
              <li>{t("page2.body.1")}</li>
              <li>{t("page2.body.2")}</li>
              <li>{t("page2.body.3")}</li>
            </ul>
            <p className="mt-4 text-xs md:text-sm leading-relaxed text-slate-500 italic">
              {t("page2.microline")}
            </p>
          </div>
        </div>

        {/* Showcase (below all Page 2 text) */}
        <div className="mt-20 md:mt-24">
          <Page2DashboardShowCase />
        </div>
      </div>
    </section>
  );
}
