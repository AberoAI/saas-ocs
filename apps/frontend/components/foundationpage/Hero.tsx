// apps/frontend/components/foundationpage/Hero.tsx
"use client";

import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations();

  const headline = t("foundation.hero.headline");
  const lines = headline.split("\n");

  return (
    <section id="foundation-hero" className="relative z-10 bg-white py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mt-4 md:mt-0 md:flex md:items-start md:justify-between md:gap-10">
          <div className="md:w-3/5">
            <p className="text-xs uppercase tracking-wide text-black/40">
              {t("foundation.hero.kicker")}
            </p>

            <h1 className="mt-4 text-[33px] md:text-[39px] font-semibold text-[#585858]">
              {lines.map((line, idx) => (
                <span key={idx} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </div>

          <div className="hidden md:block md:w-2/5 md:pl-8" />
        </div>
      </div>
    </section>
  );
}
