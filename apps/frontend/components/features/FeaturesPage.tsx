// apps/frontend/components/features/FeaturesPage.tsx
"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useMemo, useRef, useLayoutEffect, useState, useCallback } from "react";
import { BRAND, EASE } from "./constants";
import type { IntlMessages, Locale } from "./types";
import { TextAnimate } from "../../registry/magicui/text-animate";

// 🔹 Background baru khusus HERO
import FeatureHeroBG from "@/components/bg/FeatureHeroBG";

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
  const localeCode = m?.[1] ?? ""; // ✅ perbaikan: hilangkan kata "the"
  const localePrefix = localeCode ? `/${localeCode}` : "";
  const locale = (localeCode.toLowerCase() || "") as Locale;

  const prefersReduced = useReducedMotion();

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

  const sectionContainer = useMemo((): Variants => ({
    hidden: { opacity: 0, y: prefersReduced ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.38, ease: EASE }
    }
  }), [prefersReduced]);

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

  const featureTitleRef = useRef<HTMLHeadingElement>(null);

  const shouldAnimateHeroRef = useRef<boolean>(isFeaturesRoute && !prefersReduced);
  const shouldAnimateHero = shouldAnimateHeroRef.current;

  const headlineWrapRef = useRef<HTMLDivElement>(null);
  const [headlineMinH, setHeadlineMinH] = useState<number | null>(null);
  useLayoutEffect(() => {
    if (headlineWrapRef.current && headlineMinH == null) {
      const h = headlineWrapRef.current.getBoundingClientRect().height;
      if (h > 0) setHeadlineMinH(h);
    }
  }, [headlineMinH]);

  const [headlineDone, setHeadlineDone] = useState(!shouldAnimateHero);
  const [subtitleDone, setSubtitleDone] = useState(!shouldAnimateHero);
  const onHeadlineDone = useCallback(() => {
    setTimeout(() => setHeadlineDone(true), 60);
  }, []);

  // === PUSATKAN HERO SECARA SEMPURNA ===
  const heroNudgeClass = "";
  const NAV_H = 72; // tinggi navbar (px)

  return (
    <div className="relative min-h-screen bg-white">
      <main className="mx-auto max-w-6xl px-6">
        {/* ===== HERO (hanya section ini yang punya background biru) ===== */}
        <section
          className="relative grid place-items-center text-center"
          style={{ minHeight: `calc(100dvh - ${NAV_H}px)` }}
        >
          {/* BG khusus hero */}
          <FeatureHeroBG />

          {/* Konten hero */}
          <div className="w-full flex flex-col items-center">
            {/* Headline */}
            <div
              ref={headlineWrapRef}
              style={headlineMinH ? { minHeight: headlineMinH } : undefined}
              className="relative w-full"
            >
              {shouldAnimateHero ? (
                <TextAnimate
                  animation="blurIn"
                  by="character"
                  once
                  as="h1"
                  className="text-center mx-auto max-w-6xl text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight"
                  onDone={onHeadlineDone}
                  trigger="mount"
                >
                  {t("title")}
                </TextAnimate>
              ) : (
                <h1 className="text-center mx-auto max-w-6xl text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
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
                    className="mt-4 sm:mt-5 max-w-2xl text-center mx-auto text-base sm:text-lg not-italic text-foreground/70 leading-snug"
                    trigger="mount"
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
                  <p className="mt-4 sm:mt-5 max-w-2xl text-center mx-auto text-base sm:text-lg not-italic text-transparent leading-snug">
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
                <p className="mt-4 sm:mt-5 max-w-2xl text-center mx-auto text-base sm:text-lg not-italic text-foreground/70 leading-snug">
                  {t("subtitle")}
                </p>
                <div className="mt-6 sm:mt-7 inline-flex items-center gap-2 text-foreground/60 justify-center">
                  <span className="text-sm">Scroll</span>
                  <span className="animate-bounce" aria-hidden>↓</span>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ===== FEATURES (putih) ===== */}
        <div className="space-y-20 md:space-y-24">
          {items.map((it) => (
            <motion.section
              key={it.key}
              variants={sectionContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              className="w-full"
            >
              <div className="grid md:grid-cols-[minmax(19rem,32rem)_minmax(0,1fr)] gap-5 md:gap-6 items-center md:items-center">
                {/* LEFT: text */}
                <motion.div
                  variants={contentStagger.container}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4 }}
                  className="w-full max-w-3xl md:max-w-none text-center md:text-left self-center md:self-center"
                >
                  <div className="grid grid-cols-[40px_minmax(0,1fr)] md:grid-cols-[44px_minmax(0,1fr)] gap-x-3.5 md:gap-x-4 items-start">
                    {/* Icon */}
                    <motion.div
                      variants={contentStagger.item}
                      className="relative h-9 w-9 md:h-11 md:w-11 rounded-xl text-lg md:text-xl flex items-center justify-center select-none mt-[2px]"
                      aria-hidden
                    >
                      <span className="-translate-y-[1px]" style={{ color: BRAND }}>
                        {it.icon}
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
                      {t(`cards.${it.key}.title`)}
                    </motion.h3>

                    {/* Desc */}
                    {(() => {
                      const descRaw = String(t(`cards.${it.key}.desc`));
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
                    stepKey={it.key}
                    prefersReduced={!!prefersReduced}
                    locale={locale}
                  />
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* ===== CTA ===== */}
        <motion.section
          initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.38, ease: EASE } }}
          viewport={{ once: true, amount: 0.35 }}
          className="text-center py-20 md:py-24"
        >
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
      </main>
    </div>
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
      whileInView={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: EASE } }}
      viewport={{ once: true, amount: 0.3 }}
      exit={{ opacity: 0, y: -6 }}
      className="aspect-square w-[64vw] max-w-[420px] rounded-2xl"
      style={{ background: `${base}80` }}
      aria-label="Feature animation stage"
    />
  );
}
