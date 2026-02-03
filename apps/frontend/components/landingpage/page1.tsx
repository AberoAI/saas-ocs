// apps/frontend/components/landingpage/page1.tsx
"use client";

import type React from "react";
import { useTranslations, useLocale } from "next-intl";
import Page1ProblemList from "@/components/page1/Page1ProblemList";

export default function Page1Section() {
  const t = useTranslations();
  const locale = useLocale();
  const isEn = locale === "en";
  const isTr = locale === "tr";

  const renderPage1Headline = () => {
    const headline = t("page1.headline");
    const [rawLine1, rawLine2] = headline.split("\n");
    const line1 = rawLine1 ?? "";
    const line2 = rawLine2 ?? "";

    let trSecondLineNode: React.ReactNode | null = null;

    if (isTr && line2) {
      const highlight = "tanıdık";
      const index = line2.indexOf(highlight);

      if (index === -1) {
        // Fallback: whole line same softer color
        trSecondLineNode = (
          <span className="text-[#757575] font-medium">{line2}</span>
        );
      } else {
        const before = line2.slice(0, index);
        const after = line2.slice(index + highlight.length);

        trSecondLineNode = (
          <span>
            {before && (
              <span className="text-[#757575] font-normal">{before}</span>
            )}
            <span className="text-[#484848] font-medium">{highlight}</span>
            {after && (
              <span className="text-[#757575] font-normal">{after}</span>
            )}
          </span>
        );
      }
    }

    return (
      <span className="flex flex-col gap-[5px]">
        {isEn && (
          <>
            {/* "Does this feel" → regular */}
            <span className="text-[#757575] font-normal">{line1}</span>
            {/* "familiar?" → medium */}
            {line2 && (
              <span className="text-[#484848] font-medium">{line2}</span>
            )}
          </>
        )}

        {isTr && (
          <>
            {/* "Bu durum size, dan geliyor mu?" → regular */}
            <span className="text-[#757575] font-normal">{line1}</span>
            {/* "tanıdık" dalam line2 → medium, sisanya regular */}
            {line2 && trSecondLineNode}
          </>
        )}

        {!isEn && !isTr && (
          <>
            <span>{line1}</span>
            {line2 && <span>{line2}</span>}
          </>
        )}
      </span>
    );
  };

  // NOTE (Page 1 EN vs TR layout):
  // - Right column (body) selalu pakai md:translate-x-[15%] untuk SEMUA locale.
  // - Headline EN saja yang digeser md:translate-x-[10%] supaya jarak ke body tidak terlalu jauh.
  // - Jika suatu saat kamu mengubah offset body (15%), ingat untuk mengecek ulang offset EN headline (10%)
  //   agar balance visual EN tetap terjaga. TR dibiarkan tetap 0 (tanpa translate).
  // Kelas headline Page 1:
  // - Basis layout sama
  // - Tambah translate-x 10% HANYA untuk English di md+
  const page1HeadlineClass =
    "text-5xl md:text-6xl font-semibold text-slate-900 md:w-1/2" +
    (isEn ? " md:translate-x-[10%]" : "");

  return (
    <section id="page-1" className="relative z-10 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Surface Container */}
        <div
          className="bg-[#F9FCFD] px-8 py-14 md:px-12 md:py-16"
          style={{ borderRadius: "clamp(18px, 2.2vw, 32px)" }}
        >
          <div className="mt-4 md:mt-0 md:flex md:items-center md:justify-between md:gap-10">
            {/* Headline kiri — +20% lebih besar, jarak 5px antar baris, warna sesuai locale */}
            <h2 className={page1HeadlineClass}>{renderPage1Headline()}</h2>

            {/* Body di kanan → digeser total 15% ke kanan pada md+
              NOTE: offset 15% ini berlaku untuk semua locale.
              Kalau angka ini diganti, cek juga offset EN headline (10%) di page1HeadlineClass. */}
            <div className="mt-4 md:mt-0 md:w-1/2 md:translate-x-[15%]">
              <Page1ProblemList />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
