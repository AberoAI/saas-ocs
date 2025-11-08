// apps/frontend/app/[locale]/page.tsx
"use client";

import { useTranslations, useLocale } from "next-intl";
import HeroRings from "@/components/hero/HeroRings";
import ScrollHint from "@/components/hero/ScrollHint";

export default function LocaleHomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const isEn = locale === "en";
  const isTr = locale === "tr";

  const brandBlue = "#26658C";

  const renderHeadline = () => {
    if (isEn) {
      // "Over 65% of customers cancel" + "due to slow responses"
      const line1 = t("hero.headlineLine1");
      const highlight = "Over 65%";
      const rest = line1.slice(highlight.length);

      return (
        <>
          <span style={{ color: brandBlue }}>{highlight}</span>
          {rest}
          <br />
          {t("hero.headlineLine2")}
        </>
      );
    }

    if (isTr) {
      // "Müşterilerin %65’i, geç yanıtlar yüzünden işlemi iptal ediyor"
      const full = t("hero.headline");
      const target = "%65";
      const idx = full.indexOf(target);

      if (idx === -1) {
        return <>{full}</>;
      }

      const before = full.slice(0, idx);
      const after = full.slice(idx + target.length); // '’i, geç ...' tetap ikut after

      return (
        <>
          {before}
          <span style={{ color: brandBlue }}>{target}</span>
          {after}
        </>
      );
    }

    // fallback locale lain
    return <>{t("hero.headline")}</>;
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Dekorasi lingkaran di kanan */}
      <HeroRings />

      {/* Hero section: vertikal di tengah */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] items-center max-w-6xl px-6 lg:px-8">
        {/* Kiri: teks */}
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#585858]">
            {renderHeadline()}
          </h1>

          <p className="mt-4 text-lg text-black/70">
            {t("home.subHeadline")}
          </p>
        </div>

        {/* Kanan: ruang kosong agar HeroRings tetap pada posisi visual */}
        <div className="hidden flex-1 lg:block" />
      </section>

      {/* Scroll hint */}
      <div className="absolute inset-x-0 bottom-10 flex justify-center">
        <ScrollHint targetId="page-2" />
      </div>
    </main>
  );
}
