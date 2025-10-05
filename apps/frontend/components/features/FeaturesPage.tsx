// apps/frontend/components/features/FeaturesPage.tsx
"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import dynamic from "next/dynamic";
import {
  useMemo,
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
} from "react";
import { BRAND, EASE } from "./constants";
import type { IntlMessages, Locale } from "./types";
import { TextAnimate } from "../../registry/magicui/text-animate";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* (Opsional) Kalau alias @ bermasalah di proyekmu, ubah ke path relatif:
   import AnimatedBackgroundFeatures from "../bg/AnimatedBackgroundFeatures";
*/
import AnimatedBackgroundFeatures from "@/components/bg/AnimatedBackgroundFeatures";

/* ===== Stages (lazy) ===== */
const InstantChatStage = dynamic(() => import("./stages/InstantChatStage"));
const AnalyticsTableStage = dynamic(() => import("./stages/AnalyticsTableStage"));
const AnalyticsRealtimeStage = dynamic(() => import("./stages/AnalyticsRealtimeStage"));
const HandoffStage = dynamic(() => import("./stages/HandoffStage"));

/* =====================================================================================
   INLINE GSAP CANVAS SCENE (menghilangkan error module-not-found sepenuhnya)
   ===================================================================================== */

/** Pseudo-noise ringan tanpa dependensi (mendekati Simplex secara visual) */
function nMix(i: number, a: number, b: number) {
  return Math.sin(i * a) * 0.66 + Math.cos(i * b) * 0.34; // ~[-1..1]
}

type GsapScrollNoiseSceneProps = {
  count?: number;          // default 2600
  spreadX?: number;        // default 240
  baseSize?: number;       // default 6
  haloAlpha?: number;      // default 0.6
  hueStep?: number;        // default 0.3
  ease?: [number, number, number, number]; // default [0.16,1,0.3,1]
  scrollHeights?: number;  // default 3 (≈300vh)
};

function GsapScrollNoiseScene({
  count = 2600,
  spreadX = 240,
  baseSize = 6,
  haloAlpha = 0.6,
  hueStep = 0.3,
  ease = [0.16, 1, 0.3, 1],
  scrollHeights = 3,
}: GsapScrollNoiseSceneProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = wrap.clientWidth;
      const h = window.innerHeight * scrollHeights;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    type P = { x: number; y: number; r: number; hue: number; rot: number; sx: number; sy: number };
    const parts: P[] = new Array(count);
    for (let i = 0; i < count; i++) {
      const n1 = nMix(i, 0.003, 0.011);
      const n2 = nMix(i, 0.002, 0.007);
      const x = n2 * spreadX;
      const y = (i / count) * (window.innerHeight * scrollHeights);
      const rot = n2 * 270;
      const sx = 3 + n1 * 2;
      const sy = 3 + n2 * 2;
      const r = baseSize;
      const hue = (i * hueStep) % 360;
      parts[i] = { x, y, r, hue, rot, sx, sy };
    }

    let progress = 0; // 0..1 via ScrollTrigger

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const py = (progress * window.innerHeight) / 3;
      for (let i = 0; i < count; i++) {
        const p = parts[i];
        const local = Math.min(1, Math.max(0, progress * 1.15 + ((i % 97) / 97) * 0.04 - 0.02));
        if (local <= 0.001) continue;

        ctx.save();
        ctx.translate(canvas.width / DPR / 2 + p.x, p.y - py);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.scale(p.sx, p.sy);

        ctx.globalAlpha = local * 0.55;
        ctx.fillStyle = `hsl(${p.hue} 70% 70%)`;
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = local * haloAlpha;
        ctx.strokeStyle = `hsla(${p.hue}, 70%, 70%, ${haloAlpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        ctx.restore();
      }
    };

    let rafId = 0;
    const loop = () => {
      draw();
      rafId = requestAnimationFrame(loop);
    };
    loop();

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: () => `+=${window.innerHeight * (scrollHeights - 1)}`,
      scrub: true,
      onUpdate: (self) => {
        const t = self.progress;
        const eased = gsap.parseEase(`cubic-bezier(${ease[0]},${ease[1]},${ease[2]},${ease[3]})`)(t);
        progress = eased;
      },
    });

    return () => {
      st.kill();
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [baseSize, count, ease, haloAlpha, hueStep, scrollHeights, spreadX]);

  // Keyframes kecil untuk cue panah
  const cueKF = `
  @keyframes scrollCue { 0% { transform: translateY(0) } 100% { transform: translateY(10px) } }
  `;

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        height: `${scrollHeights * 100}vh`,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: cueKF }} />
      {/* Sticky "SCROLL" cue */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          letterSpacing: "0.2em",
          fontSize: 11,
          zIndex: 2,
          pointerEvents: "none",
          color: "#000",
        }}
      >
        <span>SCROLL</span>
        <svg
          viewBox="0 0 24 24"
          width={18}
          height={18}
          style={{ marginTop: 10, animation: "scrollCue 0.95s ease-in-out alternate infinite" }}
          aria-hidden
        >
          <line x1="12" y1="1" x2="12" y2="22.5" stroke="#000" strokeWidth="1" strokeLinecap="round" />
          <line x1="12.1" y1="22.4" x2="18.9" y2="15.6" stroke="#000" strokeWidth="1" strokeLinecap="round" />
          <line x1="11.9" y1="22.4" x2="5.1" y2="15.6" stroke="#000" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      {/* Gradient masks atas/bawah */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100%",
          height: 60,
          background: "linear-gradient(to bottom, #fff 10%, rgba(255,255,255,0))",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 60,
          background: "linear-gradient(to top, #fff 50%, rgba(255,255,255,0))",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}

/* ===================================================================================== */

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
  const localeCode = m?.[1] ?? "";
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

  const sectionContainer = useMemo(
    (): Variants => ({
      hidden: { opacity: 0, y: prefersReduced ? 0 : 12 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.38, ease: EASE },
      },
    }),
    [prefersReduced]
  );

  const contentStagger = useMemo(
    (): { container: Variants; item: Variants } => ({
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
    }),
    [prefersReduced]
  );

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

  const heroNudgeClass = "";
  const heroSectionMinH = locale === "tr" ? "min-h-screen" : "min-h-[68vh]";

  return (
    <div className="relative min-h-screen">
      {/* ===== GSAP Canvas Scene — full-bleed, ~300vh ===== */}
      <div className="relative w-full">
        <GsapScrollNoiseScene
          count={2600}
          spreadX={260}
          baseSize={6}
          scrollHeights={3}
          hueStep={0.08}
        />
      </div>

      {/* (opsional) background tambahan */}
      {/* <AnimatedBackgroundFeatures debug /> */}

      <main className="mx-auto max-w-6xl px-6">
        {/* ===== HERO ===== */}
        <section className={`${heroSectionMinH} flex flex-col items-center justify-center text-center ${heroNudgeClass}`}>
          <div
            ref={headlineWrapRef}
            style={headlineMinH ? { minHeight: headlineMinH } : undefined}
            className="relative"
          >
            {shouldAnimateHero ? (
              <TextAnimate
                animation="blurIn"
                by="character"
                once
                as="h1"
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight"
                onDone={onHeadlineDone}
                trigger="mount"
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
                  className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg not-italic text-foreground/70 mx-auto leading-snug"
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
                <p className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg not-italic text-transparent mx-auto leading-snug">
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
              <p className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg not-italic text-foreground/70 mx-auto leading-snug">
                {t("subtitle")}
              </p>
              <div className="mt-6 sm:mt-7 inline-flex items-center gap-2 text-foreground/60 justify-center">
                <span className="text-sm">Scroll</span>
                <span className="animate-bounce" aria-hidden>↓</span>
              </div>
            </>
          )}
        </section>

        {/* ===== FEATURES ===== */}
        <div className="space-y-20 md:space-y-24">
          {items.map((it) => (
            <motion.section
              key={it.key}
              variants={contentStagger.container}
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
                        {it.icon}
                      </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                      variants={contentStagger.item}
                      className="col-start-2 text-xl md:text-[1.375rem] font-semibold leading-tight tracking-tight mb-0.5"
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
                  <FeatureStage stepKey={it.key} prefersReduced={!!prefersReduced} locale={locale} />
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
