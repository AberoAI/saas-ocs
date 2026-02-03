// apps/frontend/components/landingpage/hero.tsx
"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import HeroRings from "@/components/hero/HeroRings";
import ScrollHint from "@/components/hero/ScrollHint";

export default function HeroSection() {
  const t = useTranslations();
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
      <span className="inline-block text-center">
        <span className="block lg:whitespace-nowrap font-normal">{line1}</span>
        <span className="block font-semibold mt-[5px] text-[#26658C]">
          {line2}
        </span>
      </span>
    );
  };

  const renderSubHeadline = () => {
    const before = t("home.subHeadlineBefore");
    const foundations = t("home.subHeadlineFoundations");

    return (
      <>
        <span className="text-[#585858]">{before}</span>{" "}
        <span className="font-semibold text-[#757575]">{foundations}</span>
      </>
    );
  };

  return (
    <section className="relative z-10 bg-white overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        {/* HERO CONTAINER */}
        <div className="relative min-h-[calc(100vh-72px)] pt-[96px] pb-[24px]">
          {/* BLOK TEKS HERO (mandiri) */}
          <div className="max-w-3xl text-center mx-auto">
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
              className="text-4xl md:text-5xl font-normal leading-tight text-[#585858] flex justify-center"
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
              className="mt-[27px] text-[16px] leading-relaxed"
            >
              {renderSubHeadline()}
            </motion.p>
          </div>

          {/* BLOK HERO RINGS (mandiri) */}
          <div className="mt-10 w-full pointer-events-none flex items-center justify-center">
            <div className="translate-y-[10px] md:translate-x-[60px]">
              <HeroRings />
            </div>
          </div>

          {/* SCROLL ARROW */}
          <motion.div
            className="pointer-events-auto absolute left-1/2 -translate-x-1/2 flex justify-center 
                       top-[420px] sm:top-[450px] md:top-[480px]"
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
        </div>
      </div>
    </section>
  );
}
