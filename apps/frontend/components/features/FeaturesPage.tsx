// apps/frontend/components/features/FeaturesPage.tsx
"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { useMemo, useRef, useEffect, useState } from "react";
import useStepScroll from "@/hooks/useStepScroll";
import { BRAND, EASE } from "./constants";
import type { IntlMessages, Locale } from "./types";
import { TextAnimate } from "../../registry/magicui/text-animate";

// Stage (lazy)
const InstantChatStage = dynamic(() => import("./stages/InstantChatStage"));
const AnalyticsTableStage = dynamic(() => import("./stages/AnalyticsTableStage"));
const AnalyticsRealtimeStage = dynamic(() => import("./stages/AnalyticsRealtimeStage"));
const HandoffStage = dynamic(() => import("./stages/HandoffStage"));

/* Scroll indicator */
function ScrollIndicator({ delay = 0.1 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: EASE, delay }}
      className="mt-6 sm:mt-7 inline-flex items-center gap-2 text-foreground/60 justify-center"
    >
      <span className="text-sm">Scroll</span>
      <span className="animate-bounce" aria-hidden>
        ↓
      </span>
    </motion.div>
  );
}

export default function FeaturesPage() {
  const t = useTranslations("features");
  const pathnameRaw = usePathname() || "/";
  const m = pathnameRaw.match(/^\/([A-Za-z-]{2,5})(?:\/|$)/);
  const localePrefix = m?.[1] ? `/${m[1]}` : "";
  const locale = (m?.[1]?.toLowerCase() || "") as Locale;
  const prefersReduced = useReducedMotion();

  const items: { key: keyof IntlMessages["features"]["cards"]; icon: string }[] = [
    { key: "instant", icon: "⚡️" },
    { key: "multitenant", icon: "🏢" },
    { key: "analytics", icon: "📊" },
    { key: "handoff", icon: "🤝" },
    { key: "multilingual", icon: "🌐" },
    { key: "booking", icon: "📅" },
  ];

  const stageFade = useMemo(
    () => ({
      initial: { opacity: 0, y: prefersReduced ? 0 : 8 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
      exit: { opacity: 0, y: prefersReduced ? 0 : -6, transition: { duration: 0.22, ease: EASE } },
    }),
    [prefersReduced]
  );

  const BRAND_BG_12 = `${BRAND}1F`;

  // Sticky viewport multi-step
  const TOTAL_STEPS = items.length + 2;
  const { containerRef, step } = useStepScroll({
    totalSteps: TOTAL_STEPS,
    reduceMotion: !!prefersReduced,
  });

  const featureTitleRef = useRef<HTMLHeadingElement>(null);
  const heroPlayedRef = useRef(false);
  useEffect(() => {
    heroPlayedRef.current = true;
  }, []);
  const shouldAnimateHero = !prefersReduced && !heroPlayedRef.current;
  const [headlineDone, setHeadlineDone] = useState(!shouldAnimateHero);

  return (
    <main className="mx-auto max-w-6xl px-6">
      <div ref={containerRef} className="relative" style={{ height: `calc(var(--vvh, 100vh) * ${TOTAL_STEPS})` }}>
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="w-full">
            <AnimatePresence mode="wait">
              {/* HERO */}
              {step === 0 && (
                <section key="step-hero" className="relative text-center">
                  {/* Headline */}
                  {shouldAnimateHero ? (
                    <TextAnimate
                      animation="blurIn"
                      by="character"
                      once
                      as="h1"
                      className="mt-2.5 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight"
                      onDone={() => setHeadlineDone(true)}
                    >
                      {t("title")}
                    </TextAnimate>
                  ) : (
                    <h1 className="mt-2.5 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
                      {t("title")}
                    </h1>
                  )}

                  {/* Subheadline + Scroll */}
                  {shouldAnimateHero ? (
                    headlineDone ? (
                      <>
                        <TextAnimate
                          animation="fadeInUp"
                          by="word"
                          once
                          as="p"
                          className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg italic text-foreground/70 mx-auto leading-snug"
                        >
                          {t("subtitle")}
                        </TextAnimate>
                        <ScrollIndicator delay={0.2} />
                      </>
                    ) : (
                      <>
                        <p className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg italic text-transparent mx-auto leading-snug">
                          {t("subtitle")}
                        </p>
                        <div className="mt-6 sm:mt-7 h-5" />
                      </>
                    )
                  ) : (
                    <>
                      <p className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg italic text-foreground/70 mx-auto leading-snug">
                        {t("subtitle")}
                      </p>
                      <ScrollIndicator delay={0} />
                    </>
                  )}
                </section>
              )}

              {/* ...sisanya tetap */}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
