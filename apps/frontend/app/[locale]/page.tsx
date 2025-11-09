// apps/frontend/app/[locale]/page.tsx
"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import HeroRings from "@/components/hero/HeroRings";
import ScrollHint from "@/components/hero/ScrollHint";
import AboutShowcase from "@/components/about/AboutShowcase";

export default function LocaleHomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const isEn = locale === "en";
  const isTr = locale === "tr";
  const brandBlue = "#26658C";

  const prefersReducedMotion = useReducedMotion();

  // Timing konfigurasi animasi
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

  const aboutTitle =
    t("about.title", {
      defaultMessage: "Engineered for real operations. Built for trust.",
    }) || "Engineered for real operations. Built for trust.";

  const aboutSubtitle =
    t("about.subtitle", {
      defaultMessage:
        "AberoAI centralizes WhatsApp, AI, and your internal workflows into one reliable, scalable layer designed for clinics, hospitality, and high-touch services that cannot afford chaos.",
    }) ||
    "AberoAI centralizes WhatsApp, AI, and your internal workflows into one reliable, scalable layer.";

  const aboutPoints = [
    t("about.point1", {
      defaultMessage:
        "24/7 multilingual AI agents with safe human handoff — no leads lost at 2 AM.",
    }),
    t("about.point2", {
      defaultMessage:
        "Booking, follow-up, and after-care flows structured for real operations, not just chatbot demos.",
    }),
    t("about.point3", {
      defaultMessage:
        "Enterprise-grade architecture: secure, modular, and ready to scale across locations & teams.",
    }),
  ];

  return (
    <main className="relative overflow-hidden bg-white">
      {/* Background rings (decorative) */}
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

        {/* ScrollHint hanya milik hero (PAGE 0) */}
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

      {/* PAGE 1: About / Trust Section */}
      <section className="relative flex min-h-[110vh] items-start justify-center pt-[10vh] pb-[5vh]">
        <AboutShowcase
          id="page-1"
          aria-label={aboutTitle}
          className="mt-0 mb-0"
        >
          <div className="flex h-full w-full flex-col items-center justify-center px-4 lg:px-10">
            <div className="max-w-5xl space-y-4 md:space-y-5 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
                {aboutTitle}
              </h2>

              <p className="text-sm md:text-base leading-relaxed text-slate-700">
                {aboutSubtitle}
              </p>

              <ul className="mt-4 grid gap-3 text-sm md:text-[15px] text-slate-800/90 md:grid-cols-3">
                {aboutPoints.map((point, index) => (
                  <li
                    key={index}
                    className="rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm ring-1 ring-slate-200/80 px-3.5 py-2.5 text-left"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </AboutShowcase>
      </section>
    </main>
  );
}
