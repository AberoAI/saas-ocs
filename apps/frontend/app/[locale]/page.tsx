"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import HeroRings from "@/components/hero/HeroRings";
import ScrollHint from "@/components/hero/ScrollHint";
import ScrollCluster from "@/components/ScrollCluster";

export default function LocaleHomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const isEn = locale === "en";
  const isTr = locale === "tr";
  const brandBlue = "#26658C";
  const foundationsColor = "#757575";

  const prefersReducedMotion = useReducedMotion();

  const heroDuration = prefersReducedMotion ? 0 : 0.55;
  const subDuration = prefersReducedMotion ? 0 : 0.45;

  const heroDelay = 0;
  const subDelay = prefersReducedMotion ? 0 : heroDelay + heroDuration + 0.12;
  const scrollDelay = prefersReducedMotion ? 0 : subDelay + subDuration + 0.18;

  const renderHeadline = () => {
    const line1 = t("hero.headlineLine1");
    const line2 = t("hero.headlineLine2");

    return (
      <>
        {/* Line 1: e.g. "65% of international patients don’t wait" */}
        <span className="block mx-auto w-fit lg:whitespace-nowrap">
          {line1}
        </span>
        {/* Line 2: e.g. "They move on" */}
        <span className="block mx-auto w-fit" style={{ color: brandBlue }}>
          {line2}
        </span>
      </>
    );
  };

  const renderSubHeadline = () => {
    const before = t("home.subHeadlineBefore");
    const foundations = t("home.subHeadlineFoundations");

    return (
      <>
        {before}{" "}
        <span
          style={{
            color: foundationsColor,
            fontWeight: 600,
          }}
        >
          {foundations}
        </span>
      </>
    );
  };

  return (
    <main className="pin-root relative bg-white overflow-x-hidden">
      <HeroRings />

      {/* PAGE 0: Hero (normal scroll) */}
      <section className="relative z-10 mx-auto flex min-h-[75vh] md:min-h-[80vh] items-center justify-center max-w-6xl px-4 lg:px-6">
        <div className="max-w-3xl -mt-[22vh] text-center mx-auto">
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
            {renderSubHeadline()}
          </motion.p>
        </div>

        {/* Scroll hint → PAGE 1 (first normal section) */}
        <motion.div
          className="pointer-events-auto absolute inset-x-0 bottom-[22vh] md:bottom-[24vh] flex justify-center"
          initial={
            prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
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

      {/* PAGE 1: normal scroll section */}
      <section
        id="page-1"
        className="relative z-10 bg-white py-24 border-t border-slate-100"
      >
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            PAGE 01 • CONTEXT
          </p>
          <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-slate-900">
            {t("page1.headline")}
          </h2>
          <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-slate-700">
            {t("page1.body.0")}
            <br />
            {t("page1.body.1")}
            <br />
            {t("page1.body.2")}
            <br />
            {t("page1.body.3")}
          </p>
        </div>
      </section>

      {/* PAGE 2: normal scroll section */}
      <section id="page-2" className="relative z-10 bg-white py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            PAGE 02 • WHAT ABEROAI IS
          </p>
          <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-slate-900">
            {t("page2.headline")}
          </h2>
          <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-slate-700">
            {t("page2.subheadline")}
          </p>
          <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-slate-700">
            {t("page2.body.0")}
            <br />
            {t("page2.body.1")}
            <br />
            {t("page2.body.2")}
            <br />
            {t("page2.body.3")}
          </p>
          <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed text-slate-700">
            {t("page2.microline")}
          </p>
        </div>
      </section>

      <div aria-hidden="true" className="h-[6vh] bg-white" />

      <ScrollCluster />

      <section id="page-6" className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <h2 className="text-3xl font-semibold text-slate-900">
            AberoAI in real operations.
          </h2>
          <p className="mt-4 max-w-2xl text-slate-700">
            This section scrolls normally again after the pinned 3-step cluster.
          </p>
        </div>
      </section>
    </main>
  );
}
