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

      {/* Hero section: vertikal di tengah */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-6rem)] items-center max-w-6xl px-6 lg:px-8">
        {/* Kiri: teks */}
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#585858]">
            {t("hero.headline")}
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
