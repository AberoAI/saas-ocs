"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import HeroRings from "@/components/hero/HeroRings";
import ScrollHint from "@/components/hero/ScrollHint";

export default function LocaleHomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const isEn = locale === "en";
  const isTr = locale === "tr";
  const brandBlue = "#26658C";

  const prefersReducedMotion = useReducedMotion();

  // Timing konfigurasi animasi (urutan smooth & stabil)
  const heroDuration = prefersReducedMotion ? 0 : 0.55;
  const subDuration = prefersReducedMotion ? 0 : 0.45;

  const heroDelay = 0;
  const subDelay = prefersReducedMotion ? 0 : heroDelay + heroDuration + 0.12;
  const scrollDelay = prefersReducedMotion ? 0 : subDelay + subDuration + 0.18;

  const renderHeadline = () => {
    if (isEn) {
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
      const full = t("hero.headline");
      const target = "%65";
      const idx = full.indexOf(target);
      if (idx === -1) return <>{full}</>;
      const before = full.slice(0, idx);
      const after = full.slice(idx + target.length);
      return (
        <>
          {before}
          <span style={{ color: brandBlue }}>{target}</span>
          {after}
        </>
      );
    }

    return <>{t("hero.headline")}</>;
  };

  return (
    <main className="relative overflow-hidden bg-white">
      {/* Background rings */}
      <HeroRings />

      {/* Hero section */}
      <section className="relative z-10 mx-auto flex min-h-[75vh] md:min-h-[80vh] items-center max-w-6xl px-4 lg:px-6">
        <div className="max-w-3xl -mt-[7px]">
          {/* Headline */}
          <motion.h1
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: heroDuration,
              delay: heroDelay,
              ease: "easeOut",
            }}
            className="text-4xl md:text-5xl font-semibold text-[#585858]"
          >
            {renderHeadline()}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: subDuration,
              delay: subDelay,
              ease: "easeOut",
            }}
            className={
              isTr
                ? "mt-6 text-[16px] leading-relaxed text-black/70"
                : "mt-4 text-[16px] text-black/70"
            }
          >
            {t("home.subHeadline")}
          </motion.p>
        </div>

        <div className="hidden flex-1 lg:block" />
      </section>

      {/* ScrollHint: muncul terakhir → lanjut animasi bounce */}
      <motion.div
        className="absolute inset-x-0 bottom-6 md:bottom-8 flex justify-center"
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.5,
          delay: scrollDelay,
          ease: "easeOut",
        }}
      >
        <ScrollHint targetId="page-2" />
      </motion.div>
    </main>
  );
}
