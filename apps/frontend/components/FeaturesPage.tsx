// apps/frontend/components/FeaturesPage.tsx
"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  motion,
  useReducedMotion,
  type Variants,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValueEvent,
  useSpring, // ⟵ tambah
} from "framer-motion";
import { useMemo, useRef, useState, useEffect } from "react";

export default function FeaturesPage() {
  const t = useTranslations("features");
  const pathnameRaw = usePathname() || "/";
  const m = pathnameRaw.match(/^\/([A-Za-z-]{2,5})(?:\/|$)/);
  const localePrefix = m?.[1] ? `/${m[1]}` : "";
  const prefersReduced = useReducedMotion();

  const withLocale = (href: string) => {
    if (/^https?:\/\//.test(href)) return href;
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

  const BRAND = "#26658C";
  const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

  // hero rise
  const rise: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 18 },
    visible: (delay: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE, delay },
    }),
  };

  // (tetap untuk reuse bila perlu)
  const cardRise: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20, scale: prefersReduced ? 1 : 0.98 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: EASE, delay: 0.05 + i * 0.07 },
    }),
  };

  // aktifkan scroll-snap di <html> selama halaman ini aktif
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollSnapType;
    html.style.scrollSnapType = "y proximity";
    return () => {
      html.style.scrollSnapType = prev;
    };
  }, []);

  // ---------- Sticky viewport + staged content ----------
  const STAGES = 3;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [stage, setStage] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.max(0, Math.min(STAGES - 1, Math.round(v * (STAGES - 1))));
    if (idx !== stage) setStage(idx);
  });

  // ---- sub-stage untuk "points" di stage grid ----
  const STAGE1_START = 1 / STAGES;
  const STAGE1_END = 2 / STAGES;
  const stage1Progress = useTransform(
    scrollYProgress,
    [STAGE1_START, STAGE1_END],
    [0, 1],
    { clamp: true }
  );

  // smoothing + anti-loncat
  const smoothP = useSpring(stage1Progress, {
    stiffness: 140,
    damping: 24,
    mass: 0.7,
  });

  const [point, setPoint] = useState(0);
  const pointRef = useRef(0);
  useEffect(() => {
    pointRef.current = point;
  }, [point]);

  const lastSwitchRef = useRef(0);

  useMotionValueEvent(smoothP, "change", (p) => {
    const steps = items.length - 1;
    const current = pointRef.current;
    const pos = p * steps; // posisi kontinyu 0..steps

    // throttle agar tidak spam pindah
    const now = performance.now();
    const MIN_INTERVAL = 140; // ms
    if (now - lastSwitchRef.current < MIN_INTERVAL) return;

    // hysteresis (butuh lewat ~55% untuk pindah)
    const HYST = 0.55;
    let target = current;
    if (pos > current + HYST) target = current + 1;
    else if (pos < current - HYST) target = current - 1;

    // kalau input terlalu cepat, batasi max 1 langkah
    const rawTarget = Math.round(pos);
    if (Math.abs(rawTarget - current) > 1) {
      target = current + Math.sign(rawTarget - current);
    }

    target = Math.max(0, Math.min(steps, target));
    if (target !== current) {
      setPoint(target);
      pointRef.current = target;
      lastSwitchRef.current = now;
    }
  });

  // ringankan animasi (hapus blur yang berat)
  const stageFade = useMemo(
    () => ({
      initial: { opacity: 0, y: prefersReduced ? 0 : 10 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
      exit: { opacity: 0, y: prefersReduced ? 0 : -8, transition: { duration: 0.3, ease: EASE } },
    }),
    [prefersReduced]
  );

  const yOnScroll = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroY = prefersReduced ? 0 : yOnScroll;
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.25, 0]);

  return (
    <main className="mx-auto max-w-6xl px-6">
      <div
        ref={containerRef}
        className="relative snap-start"
        style={{ height: `${STAGES * 100}vh` }}
      >
        <div className="sticky top-0 h-screen flex items-center">
          <div className="w-full">
            <AnimatePresence mode="wait">
              {/* ===== Stage 0: HERO ===== */}
              {stage === 0 && (
                <motion.section key="stage-hero" {...stageFade} className="text-center will-change-[transform,opacity]">
                  <motion.div style={{ y: heroY, opacity: heroOpacity }} className="will-change-[transform,opacity]">
                    <motion.span
                      className="inline-block rounded-full px-3 py-1 text-xs text-foreground/70"
                      style={{ background: `${BRAND}14` }}
                      variants={rise}
                      initial="hidden"
                      animate="visible"
                      custom={0.05}
                    >
                      {t("badge")}
                    </motion.span>

                    <motion.h1
                      className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight"
                      variants={rise}
                      initial="hidden"
                      animate="visible"
                      custom={0.12}
                    >
                      {t("title")}
                    </motion.h1>

                    <motion.p
                      className="mt-3 max-w-2xl text-base sm:text-lg text-foreground/70 mx-auto"
                      variants={rise}
                      initial="hidden"
                      animate="visible"
                      custom={0.2}
                    >
                      {t("subtitle")}
                    </motion.p>
                  </motion.div>

                  <div className="mt-10 inline-flex items-center gap-2 text-foreground/60">
                    <span className="text-sm">Scroll</span>
                    <span className="animate-bounce" aria-hidden>↓</span>
                  </div>
                </motion.section>
              )}

              {/* ===== Stage 1: FEATURES STEP-BY-STEP ===== */}
              {stage === 1 && (
                <motion.section key="stage-grid" {...stageFade} className="will-change-[transform,opacity]">
                  <div className="grid gap-8 md:grid-cols-3 items-start">
                    {/* daftar poin (kiri) */}
                    <ol className="hidden md:flex md:flex-col md:gap-4">
                      {items.map(({ key }, idx) => (
                        <li key={String(key)} className="flex items-start gap-3">
                          <span
                            className={[
                              "mt-1 h-7 w-7 shrink-0 rounded-full border flex items-center justify-center text-xs font-medium",
                              idx === point
                                ? "bg-black text-white border-black"
                                : "text-foreground/50 border-black/15",
                            ].join(" ")}
                          >
                            {idx + 1}
                          </span>
                          <span
                            className={[
                              "leading-6",
                              idx === point ? "text-foreground font-medium" : "text-foreground/60",
                            ].join(" ")}
                          >
                            {t(`cards.${items[idx].key}.title`)}
                          </span>
                        </li>
                      ))}
                    </ol>

                    {/* konten poin aktif (kanan, 2 kolom) */}
                    <div className="md:col-span-2">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={items[point].key}
                          initial={{ opacity: 0, y: prefersReduced ? 0 : 10 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } }}
                          exit={{ opacity: 0, y: prefersReduced ? 0 : -8, transition: { duration: 0.25, ease: EASE } }}
                          className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm will-change-[transform,opacity]"
                        >
                          <div
                            className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
                            aria-hidden
                            style={{ background: `${BRAND}14`, color: BRAND }}
                          >
                            {items[point].icon}
                          </div>
                          <h3 className="text-lg font-medium">{t(`cards.${items[point].key}.title`)}</h3>
                          <p className="mt-2 text-foreground/70">{t(`cards.${items[point].key}.desc`)}</p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.section>
              )}

              {/* ===== Stage 2: CTA ===== */}
              {stage === 2 && (
                <motion.section key="stage-cta" {...stageFade} className="text-center will-change-[transform,opacity]">
                  <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
                  <p className="mt-3 max-w-2xl mx-auto text-foreground/70">{t("subtitle")}</p>

                  <div className="mt-8 flex justify-center gap-3">
                    <a
                      href="#demo"
                      className="rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm hover:shadow transition"
                      style={{ backgroundColor: BRAND }}
                    >
                      {t("cta.primary")}
                    </a>
                    <a
                      href={withLocale("/contact")}
                      className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-foreground hover:bg-black/5 transition"
                    >
                      {t("cta.secondary")}
                    </a>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sentinel snap points: 1 layar per stage */}
        {Array.from({ length: STAGES }).map((_, i) => (
          <div key={i} className="h-screen snap-start" aria-hidden />
        ))}
      </div>
    </main>
  );
}

type IntlMessages = {
  features: {
    badge: string;
    title: string;
    subtitle: string;
    cards: {
      instant: { title: string; desc: string };
      multitenant: { title: string; desc: string };
      analytics: { title: string; desc: string };
      handoff: { title: string; desc: string };
      multilingual: { title: string; desc: string };
      booking: { title: string; desc: string };
    };
    cta: { primary: string; secondary: string };
  };
};
