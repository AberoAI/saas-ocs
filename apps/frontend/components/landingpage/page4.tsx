"use client";

import { useTranslations, useLocale } from "next-intl";
import Page4OperationalFlowShowcase from "@/components/landingpage/animations/Page4OperationalFlowShowcase";

export default function Page4Section() {
  const t = useTranslations();
  const locale = useLocale();
  const isEn = locale === "en";
  const isTr = locale === "tr";

  const headline = t("page4.headline");
  const [rawLine1, rawLine2] = headline.split("\n");
  const line1 = rawLine1 ?? "";
  const line2 = rawLine2 ?? "";

  const subheadline = t("page4.subheadline");
  const [subLine1Raw, subLine2Raw] = subheadline.split("\n");
  const subLine1 = subLine1Raw ?? "";
  const subLine2 = subLine2Raw ?? "";

  // Headline coloring:
  // #585858 for: "One system" + "Complete operational" / "Tek bir sistem" + "Tam operasyonel"
  // #26658C for: "clarity" / "berraklık"
  const renderHeadline = () => {
    if (isEn) {
      const highlight = "clarity";
      if (!line2.includes(highlight)) {
        return (
          <>
            {line1 && <span className="block text-[#585858]">{line1}</span>}
            {line2 && <span className="block text-[#585858]">{line2}</span>}
          </>
        );
      }

      const [before, after] = line2.split(highlight);

      return (
        <>
          {line1 && <span className="block text-[#585858]">{line1}</span>}
          <span className="block">
            {before && <span className="text-[#585858]">{before}</span>}
            <span className="text-[#26658C]">{highlight}</span>
            {after && <span className="text-[#585858]">{after}</span>}
          </span>
        </>
      );
    }

    if (isTr) {
      const highlight = "berraklık";
      if (!line2.includes(highlight)) {
        return (
          <>
            {line1 && <span className="block text-[#585858]">{line1}</span>}
            {line2 && <span className="block text-[#585858]">{line2}</span>}
          </>
        );
      }

      const [before, after] = line2.split(highlight);

      return (
        <>
          {line1 && <span className="block text-[#585858]">{line1}</span>}
          <span className="block">
            {before && <span className="text-[#585858]">{before}</span>}
            <span className="text-[#26658C]">{highlight}</span>
            {after && <span className="text-[#585858]">{after}</span>}
          </span>
        </>
      );
    }

    // Fallback (kalau locale lain)
    return (
      <>
        {line1 && <span className="block text-[#585858]">{line1}</span>}
        {line2 && <span className="block text-[#585858]">{line2}</span>}
      </>
    );
  };

  const flowLabels = isTr
    ? {
        inquiry: "Talep",
        context: "Hasta Bağlamı",
        care: "Bakım",
        aftercare: "Tedavi Sonrası Bakım",
        followup: "Takip",
        continuity: "Süreklilik",
      }
    : {
        inquiry: "Inquiry",
        context: "Context",
        care: "Care",
        aftercare: "Aftercare",
        followup: "Follow-up",
        continuity: "Continuity",
      };

  return (
    <section id="page-4" className="relative z-10 bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        {/* Headline centered */}
        <div className="mt-4 text-center">
          {/* +3px */}
          <h2 className="mt-4 text-[33px] md:text-[41px] font-semibold">
            {renderHeadline()}
          </h2>
        </div>

        {/* Showcase directly under headline */}
        <div className="mt-12">
          <Page4OperationalFlowShowcase labels={flowLabels} />
        </div>

        {/* Subheadline/body/microline under showcase, same format/position as before */}
        <div className="mt-12">
          <p className="mt-4 max-w-2xl text-[17px] md:text-[19px] leading-relaxed text-slate-700">
            {subLine1 && <span className="block">{subLine1}</span>}
            {subLine2 && <span className="block">{subLine2}</span>}
          </p>

          <ul className="mt-6 max-w-2xl text-sm md:text-base leading-relaxed text-slate-700 space-y-1 list-disc pl-4">
            <li>{t("page4.body.0")}</li>
            <li>{t("page4.body.1")}</li>
            <li>{t("page4.body.2")}</li>
          </ul>

          <p className="mt-4 max-w-2xl text-xs md:text-sm leading-relaxed text-slate-500 italic">
            {t("page4.microline")}
          </p>
        </div>
      </div>
    </section>
  );
}
