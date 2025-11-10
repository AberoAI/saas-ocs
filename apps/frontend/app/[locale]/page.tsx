"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import HeroRings from "@/components/hero/HeroRings";
import ScrollHint from "@/components/hero/ScrollHint";
import PinnedClusterSection from "@/components/sections/PinnedClusterSection";

export default function LocaleHomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const isEn = locale === "en";
  const isTr = locale === "tr";
  const brandBlue = "#26658C";

  const prefersReducedMotion = useReducedMotion();

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
    // PENTING: hanya block horizontal, vertical scroll bebas untuk sticky
    <main className="relative bg-white overflow-x-hidden">
      <HeroRings />

      {/* PAGE 0: Hero section */}
      <section className="relative z-10 mx-auto flex min-h-[75vh] md:min-h-[80vh] items-center max-w-6xl px-4 lg:px-6">
        <div className="max-w-3xl -mt-[7px]">
          {/* Headline */}
          <motion.h1
            initial={
              prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 18 }
            }
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
            initial={
              prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 14 }
            }
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

        {/* ScrollHint hanya milik hero (Page 0) → menuju cluster (Page 1–3) */}
        <motion.div
          className="pointer-events-auto absolute inset-x-0 bottom-6 md:bottom-8 flex justify-center"
          initial={
            prefersReducedMotion
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 6 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            delay: scrollDelay,
            ease: "easeOut",
          }}
        >
          <ScrollHint targetId="page-1" />
        </motion.div>
      </section>

      {/* Spacer tipis antara Hero & pinned cluster */}
      <div aria-hidden="true" className="h-[6vh] bg-white" />

      {/* PAGE 1–3: Pinned Scroll Transition cluster */}
      <PinnedClusterSection sectionId="page-1" />

      {/* PAGE 4+: Scroll normal lagi (contoh sederhana, silakan ganti kontennya) */}
      <section
        id="page-4"
        className="bg-white py-24 border-t border-slate-100"
      >
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <h2 className="text-3xl font-semibold text-slate-900">
            AberoAI in real operations.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-700">
            Use this section for proof, metrics, or feature overview. Scroll here
            is fully normal again after the pinned 3-step cluster.
          </p>
        </div>
      </section>
    </main>
  );
}
