// apps/frontend/app/[locale]/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import HeroRings from "@/components/hero/HeroRings";
import ScrollHint from "@/components/hero/ScrollHint";

export default function LocaleHomePage() {
  const t = useTranslations();

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      {/* Dekorasi lingkaran di kanan */}
      <HeroRings />

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-6xl items-center px-6 pt-24 pb-20 lg:px-8">
        {/* Kiri: teks */}
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-[#585858]">
            {t("hero.headline")}
          </h1>

          <p className="mt-4 text-lg md:text-xl text-black/70">
            {t("home.subHeadline")}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/about"
              className="rounded-full bg-[#26658C] px-7 py-3 text-sm md:text-base font-medium text-white hover:opacity-90 transition"
            >
              {t("cta.primary")}
            </Link>
            <Link
              href="/demo"
              className="rounded-full border border-[#26658C] px-7 py-3 text-sm md:text-base font-medium text-[#26658C] hover:bg-[#26658C]/5 transition"
            >
              {t("cta.secondary")}
            </Link>
          </div>
        </div>

        {/* Kanan: ruang kosong agar HeroRings kelihatan seperti di desain */}
        <div className="hidden flex-1 lg:block" />
      </section>

      {/* Scroll hint di bawah tengah */}
      <div className="absolute inset-x-0 bottom-10 flex justify-center">
        <ScrollHint targetId="page-2" />
      </div>
    </main>
  );
}
