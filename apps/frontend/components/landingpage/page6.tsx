// apps/frontend/components/landingpage/page6.tsx
"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Page6BubbleTagShowcase from "@/components/landingpage/animations/Page6BubbleTagShowcase";

export default function Page6Section() {
  const t = useTranslations();
  const locale = useLocale();
  const isEn = locale === "en";
  const isTr = locale === "tr";

  const headline = t("page6.headline");
  const headlineLines = headline.split("\n");

  // Headline coloring:
  // #26658C for: "Trusted" / "güvendiği"
  // #585858 for the rest
  const renderHeadline = () => {
    const highlightEn = "Trusted";
    const highlightTr = "güvendiği";
    const highlight = isEn ? highlightEn : isTr ? highlightTr : "";

    return (
      <>
        {headlineLines.map((line, idx) => {
          if (highlight && line.includes(highlight)) {
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

  // Bubble text (dual-language, fixed line breaks as requested)
  const bubble1 = isTr
    ? ["Uluslararası hasta bakım", "ekipleriyle tasarlandı"]
    : ["Designed with international", "patient-care teams"];

  const bubble2 = isTr
    ? ["Çok dilli ve sınır ötesi operasyonları", "desteklemek için inşa edildi"]
    : ["Built to support multilingual", "and cross-border operations"];

  const bubble3 = isTr
    ? ["Karmaşık klinik iletişim", "ortamlarında benimsenmiştir"]
    : ["Adopted in complex clinical", "communication environments"];

  // ✅ Position rules:
  // - English: keep as-is (do not change)
  // - Turkish: ONLY bubble2 moves 30px to the right (right: -130px -> -160px)
  const bubble1Pos = "top-[34px] left-[-130px]";
  const bubble2Pos = isTr
    ? "top-[160px] right-[-160px]"
    : "top-[160px] right-[-130px]";
  const bubble3Pos = "bottom-[70px] right-[-140px]";

  return (
    <section id="page-6" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Surface Container */}
        <div
          className="bg-[#F9FCFD] px-10 py-12 md:px-12 md:py-14"
          style={{ borderRadius: "clamp(18px, 2.2vw, 32px)" }}
        >
          <div className="mt-4 md:mt-0 md:flex md:items-start md:justify-between md:gap-10">
            {/* Kiri: headline */}
            <div className="md:w-3/5">
              {/* Headline */}
              <h2 className="mt-4 md:mt-[80px] text-[36px] md:text-[42px] font-semibold">
                {renderHeadline()}
              </h2>
            </div>

            {/* Kanan: photo + bubbles */}
            <div className="mt-10 md:mt-4 md:w-2/5 md:pl-8 flex justify-center translate-x-[-100px]">
              <div className="relative w-full max-w-[300px]">
                {/* Image (middle layer) */}
                <Image
                  src="/landingpage/page6.webp"
                  alt="Clinic team"
                  width={1200}
                  height={1615}
                  className="relative z-20 w-full max-w-[300px] h-auto rounded-[28px]"
                  sizes="300px"
                  priority={false}
                  unoptimized
                />

                {/* Bubbles */}
                <Page6BubbleTagShowcase
                  lines={bubble1}
                  className={bubble1Pos}
                />
                <Page6BubbleTagShowcase
                  lines={bubble2}
                  className={bubble2Pos}
                />
                <Page6BubbleTagShowcase
                  lines={bubble3}
                  className={bubble3Pos}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
