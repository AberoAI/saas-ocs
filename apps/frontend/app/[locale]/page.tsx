"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import HeroRings from "@/components/hero/HeroRings";
import ScrollHint from "@/components/hero/ScrollHint";

export default function LocaleHomePage() {
  const t = useTranslations();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <HeroRings />

      <section className="relative z-10 mx-auto max-w-6xl px-8 pt-28 pb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold text-[#585858]">
          {t("hero.headline")}
        </h1>
        <p className="mt-4 text-lg text-black/70 max-w-2xl mx-auto">
          {t("home.subHeadline")}
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/about"
            className="rounded-full bg-[#26658C] px-6 py-3 text-white font-medium hover:opacity-90"
          >
            {t("cta.primary")}
          </Link>
          <Link
            href="/demo"
            className="rounded-full border border-[#26658C] px-6 py-3 text-[#26658C] font-medium hover:bg-[#26658C]/10"
          >
            {t("cta.secondary")}
          </Link>
        </div>
      </section>

      <div className="absolute bottom-10 inset-x-0 flex justify-center">
        <ScrollHint targetId="page-2" />
      </div>
    </main>
  );
}
