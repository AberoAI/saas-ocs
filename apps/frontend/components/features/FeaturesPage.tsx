// apps/frontend/components/features/FeaturesPage.tsx
"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { useMemo, useRef, useEffect, useState, useLayoutEffect, useCallback } from "react";
import useStepScroll from "@/hooks/useStepScroll";
import { BRAND, EASE } from "./constants";
import type { IntlMessages, Locale } from "./types";
import { TextAnimate } from "../../registry/magicui/text-animate";

// Stage (lazy)
const InstantChatStage = dynamic(() => import("./stages/InstantChatStage"));
const AnalyticsTableStage = dynamic(() => import("./stages/AnalyticsTableStage"));
const AnalyticsRealtimeStage = dynamic(() => import("./stages/AnalyticsRealtimeStage"));
const HandoffStage = dynamic(() => import("./stages/HandoffStage"));

/* Quote splitter kecil */
function splitQuoted(desc: string): { quote?: string; rest: string } {
  const m = desc.match(/“([^”]+)”/);
  if (m && m.index !== undefined) {
    const before = desc.slice(0, m.index).trim();
    const after = desc.slice(m.index + m[0].length).trim().replace(/^[\s,.;:—-]+/, "");
    const rest = [before, after].filter(Boolean).join(" ").replace(/\s+/g, " ");
    return { quote: m[1], rest: rest || "" };
  }
  const m2 = desc.match(/"([^"]+)"/);
  if (m2 && m2.index !== undefined) {
    const before = desc.slice(0, m2.index).trim();
    const after = desc.slice(m2.index + m2[0].length).trim().replace(/^[\s,.;:—-]+/, "");
    const rest = [before, after].filter(Boolean).join(" ").replace(/\s+/g, " ");
    return { quote: m2[1], rest: rest || "" };
  }
  return { rest: desc };
}

export default function FeaturesPage() {
  const t = useTranslations("features");
  const pathnameRaw = usePathname() || "/";
  const m = pathnameRaw.match(/^\/([A-Za-z-]{2,5})(?:\/|$)/);
  const localePrefix = m?.[1] ? `/${m[1]}` : "";
  const locale = (m?.[1]?.toLowerCase() || "") as Locale;
  const prefersReduced = useReducedMotion();

  // Deteksi path tanpa prefix locale (untuk memastikan ini route features/ozellikler)
  const pathWithoutLocale =
    localePrefix && pathnameRaw.startsWith(localePrefix)
      ? pathnameRaw.slice(localePrefix.length) || "/"
      : pathnameRaw;

  const isFeaturesRoute = /^\/(?:features|ozellikler)(?:\/|$)/i.test(pathWithoutLocale);

  const withLocale = (href: string) => {
    if (/^https?:\/\/.*/.test(href)) return href;
    if (href.startsWith("#")) return href;
    return `${localePrefix}${href.startsWith("/") ? href : `/${href}`}`;
  };

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

  const contentStagger = useMemo((): { container: Variants; item: Variants } => {
    return {
      container: {
        hidden: { opacity: 0, y: prefersReduced ? 0 : 6 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.3,
            ease: EASE,
            staggerChildren: prefersReduced ? 0 : 0.055,
            delayChildren: 0.02,
          },
        },
      },
      item: {
        hidden: { opacity: 0, y: prefersReduced ? 0 : 6 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE } },
      },
    };
  }, [prefersReduced]);

  const BRAND_BG_12 = `${BRAND}1F`;

  // Sticky viewport multi-step
  const TOTAL_STEPS = items.length + 2;
  const { containerRef, step } = useStepScroll({
    totalSteps: TOTAL_STEPS,
    reduceMotion: !!prefersReduced,
  });

  const featureTitleRef = useRef<HTMLHeadingElement>(null);

  /** =========================================================
   *  HERO animation policy:
   *  - HANYA animasi saat halaman ini di-mount pertama kali.
   *  - Tidak pernah re-trigger saat scroll (hero tetap mounted, cuma di-opacity).
   *  - Tidak pakai sessionStorage agar tidak bikin “hilang” di dev/HMR.
   * ========================================================= */
  const shouldAnimateHeroRef = useRef<boolean>(isFeaturesRoute && !prefersReduced);
  const shouldAnimateHero = shouldAnimateHeroRef.current;

  // Bekukan tinggi headline saat mount untuk mencegah micro-shift
  const headlineWrapRef = useRef<HTMLDivElement>(null);
  const [headlineMinH, setHeadlineMinH] = useState<number | null>(null);
  useLayoutEffect(() => {
    if (headlineWrapRef.current && headlineMinH == null) {
      const h = headlineWrapRef.current.getBoundingClientRect().height;
      if (h > 0) setHeadlineMinH(h);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headlineMinH]);

  // Subheadline muncul setelah headline selesai
  const [headlineDone, setHeadlineDone] = useState(!shouldAnimateHero);
  // "Scroll ↓" baru tampil setelah subheadline selesai
  const [subtitleDone, setSubtitleDone] = useState(!shouldAnimateHero);

  const onHeadlineDone = useCallback(() => {
    // Delay kecil agar layout settle dulu
    setTimeout(() => setHeadlineDone(true), 60);
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6">
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `calc(var(--vvh, 100vh) * ${TOTAL_STEPS})` }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="w-full">
            {/* ===== HERO DIPISAH DARI AnimatePresence (tetap mounted) ===== */}
            <section
              className={
                step === 0
                  ? "relative text-center opacity-100"
                  : "text-center opacity-0 pointer-events-none absolute inset-0 -z-10"
              }
              aria-hidden={step !== 0}
            >
              {/* Headline */}
              <div
                ref={headlineWrapRef}
                style={headlineMinH ? { minHeight: headlineMinH } : undefined}
                className="relative pt-2.5"
              >
                {shouldAnimateHero ? (
                  <TextAnimate
                    animation="blurIn"
                    by="character"
                    once
                    as="h1"
                    className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight"
                    onDone={onHeadlineDone}
                    trigger="mount" // hanya saat mount
                  >
                    {t("title")}
                  </TextAnimate>
                ) : (
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
                    {t("title")}
                  </h1>
                )}
              </div>

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
                      trigger="mount" // hanya saat mount
                      onDone={() => setSubtitleDone(true)}
                    >
                      {t("subtitle")}
                    </TextAnimate>

                    {subtitleDone ? (
                      <div className="mt-6 sm:mt-7 inline-flex items-center gap-2 text-foreground/60 justify-center">
                        <span className="text-sm">Scroll</span>
                        <span className="animate-bounce" aria-hidden>↓</span>
                      </div>
                    ) : (
                      <div className="mt-6 sm:mt-7 inline-flex items-center gap-2 justify-center invisible">
                        <span className="text-sm">Scroll</span>
                        <span aria-hidden>↓</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg italic text-transparent mx-auto leading-snug">
                      {t("subtitle")}
                    </p>
                    <div className="mt-6 sm:mt-7 inline-flex items-center gap-2 justify-center invisible">
                      <span className="text-sm">Scroll</span>
                      <span aria-hidden>↓</span>
                    </div>
                  </>
                )
              ) : (
                <>
                  <p className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg italic text-foreground/70 mx-auto leading-snug">
                    {t("subtitle")}
                  </p>
                  <div className="mt-6 sm:mt-7 inline-flex items-center gap-2 text-foreground/60 justify-center">
                    <span className="text-sm">Scroll</span>
                    <span className="animate-bounce" aria-hidden>↓</span>
                  </div>
                </>
              )}
            </section>

            {/* ===== SECTION YANG DI-MOUNT/UNMOUNT SAAT SCROLL ===== */}
            <AnimatePresence mode="wait" initial={false}>
              {/* Step 1..6 */}
              {step >= 1 && step <= items.length && (
                <motion.section key="step-content" {...stageFade} className="w-full">
                  <div className="grid md:grid-cols-[minmax(19rem,32rem)_minmax(0,1fr)] gap-5 md:gap-6 items-center md:items-center">
                    {/* LEFT: text */}
                    <motion.div
                      variants={contentStagger.container}
                      initial="hidden"
                      animate="visible"
                      exit={{
                        opacity: 0,
                        y: prefersReduced ? 0 : -6,
                        transition: { duration: 0.2, ease: EASE },
                      }}
                      className="w-full max-w-3xl md:max-w-none text-center md:text-left self-center md:self-center"
                    >
                      <div className="grid grid-cols-[40px_minmax(0,1fr)] md:grid-cols-[44px_minmax(0,1fr)] gap-x-3.5 md:gap-x-4 items-start">
                        {/* Icon */}
                        <motion.div
                          variants={contentStagger.item}
                          className="relative h-9 w-9 md:h-11 md:w-11 rounded-xl text-lg md:text-xl flex items-center justify-center select-none mt-[2px]"
                          aria-hidden
                        >
                          {!prefersReduced && (
                            <motion.span
                              className="absolute inset-0 rounded-xl"
                              style={{ background: `${BRAND_BG_12}` }}
                              initial={{ opacity: 0.5, scale: 1 }}
                              animate={{ opacity: [0.5, 0], scale: [1, 1.18] }}
                              transition={{ duration: 1.5, ease: "easeOut", repeat: Infinity, repeatDelay: 0.5 }}
                            />
                          )}
                          <span className="-translate-y-[1px]" style={{ color: BRAND }}>
                            {items[step - 1].icon}
                          </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h3
                          variants={contentStagger.item}
                          className="col-start-2 text-xl md:text-[1.375rem] font-semibold leading-tight tracking-tight mb-0.5 outline-none focus:outline-none focus-visible:outline-none"
                          tabIndex={-1}
                          ref={featureTitleRef}
                          style={{ outline: "none" }}
                        >
                          {t(`cards.${items[step - 1].key}.title`)}
                        </motion.h3>

                        {/* Desc */}
                        {(() => {
                          const descRaw = String(t(`cards.${items[step - 1].key}.desc`));
                          const { quote, rest } = splitQuoted(descRaw);
                          return (
                            <motion.div
                              variants={contentStagger.item}
                              className="col-start-2 mt-0.5 text-foreground/70 space-y-1 leading-snug"
                              data-native-scroll="true"
                              style={{ maxHeight: 260, overflowY: "auto" }}
                            >
                              {quote && <p className="italic text-foreground/80 leading-snug">{quote}</p>}
                              <p>{quote ? rest : descRaw}</p>
                            </motion.div>
                          );
                        })()}
                      </div>
                    </motion.div>

                    {/* RIGHT: stage */}
                    <div className="hidden md:flex self-center justify-center w-full">
                      <FeatureStage
                        stepKey={items[step - 1].key}
                        prefersReduced={!!prefersReduced}
                        locale={locale}
                      />
                    </div>
                  </div>
                </motion.section>
              )}

              {/* CTA */}
              {step === items.length + 1 && (
                <motion.section key="step-cta" {...stageFade} className="text-center">
                  <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
                  <p className="mt-2 max-w-2xl mx-auto text-foreground/70 leading-snug">
                    {t("subtitle")}
                  </p>

                  <div className="mt-7 flex justify-center gap-3">
                    <a
                      href="#demo"
                      className="rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm hover:shadow transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(38,101,140,0.35)]"
                      style={{ backgroundColor: BRAND }}
                    >
                      {t("cta.primary")}
                    </a>
                    <a
                      href={withLocale("/contact")}
                      className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-foreground hover:bg-black/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(38,101,140,0.35)]"
                      style={{ borderColor: "rgba(0,0,0,0.1)" }}
                    >
                      {t("cta.secondary")}
                    </a>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureStage({
  stepKey,
  prefersReduced,
  locale,
}: {
  stepKey: keyof IntlMessages["features"]["cards"];
  prefersReduced: boolean;
  locale: Locale;
}) {
  if (stepKey === "instant") return <InstantChatStage prefersReduced={prefersReduced} locale={locale} />;
  if (stepKey === "multitenant") return <AnalyticsTableStage prefersReduced={prefersReduced} />;
  if (stepKey === "analytics") return <AnalyticsRealtimeStage prefersReduced={prefersReduced} />;
  if (stepKey === "handoff") return <HandoffStage prefersReduced={prefersReduced} locale={locale} />;

  const palette: Record<keyof IntlMessages["features"]["cards"], string> = {
    instant: "#FF9AA2",
    multitenant: "#B5EAD7",
    analytics: "#C7CEEA",
    handoff: "#FFDAC1",
    multilingual: "#E2F0CB",
    booking: "#F1F0FF",
  };
  const base = palette[stepKey] ?? "#EAEAEA";

  return (
    <motion.div
      key={stepKey}
      initial={{ opacity: 0, scale: 0.985, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="aspect-square w-[64vw] max-w-[420px] rounded-2xl"
      style={{ background: `${base}80` }}
      aria-label="Feature animation stage"
    />
  );
}
