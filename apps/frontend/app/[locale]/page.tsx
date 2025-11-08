// apps/frontend/app/[locale]/page.tsx
"use client";

import { useTranslations } from "next-intl";
import HeroRings from "@/components/hero/HeroRings";
import ScrollHint from "@/components/hero/ScrollHint";

export default function LocaleHomePage() {
  const t = useTranslations();

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Dekorasi lingkaran di kanan */}
      <HeroRings />

      {/* Hero: teks kiri, ring kanan, SIZE DIPERTAHANKAN */}
      <section className="relative z-10 mx-auto flex max-w-6xl items-center px-6 pt-24 pb-20 lg:px-8">
        <div className="max-w-3xl">
          {/* EXACT: text-4xl + md:text-5xl */}
          <h1 className="text-4xl md:text-5xl font-semibold text-[#585858]">
            {t("hero.headline")}
          </h1>

          {/* EXACT: text-lg */}
          <p className="mt-4 text-lg text-black/70">
            {t("home.subHeadline")}
          </p>
        </div>

        {/* Ruang kosong agar HeroRings tetap komposisi kanan */}
        <div className="hidden flex-1 lg:block" />
      </section>

      {/* Scroll hint di bawah tengah */}
      <div className="absolute inset-x-0 bottom-10 flex justify-center">
        <ScrollHint targetId="page-2" />
      </div>
    </main>
  );
}
