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

  // ---------- Sticky viewport + staged content ----------
  const STAGES = 3; // 0: hero, 1: points, 2: cta
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map progress -> stage (tanpa snap, pakai floor biar tidak dobel-triger di batas)
  const [stage, setStage] = useState(0);
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const idx = Math.max(0, Math.min(STAGES - 1, Math.floor(v * STAGES + 1e-6)));
      setStage(idx);
    });
  }, [scrollYProgress]);

  // ---- sub-stage untuk "points" di stage grid ----
  // Gating berbasis wheel/touch agar 1 gulir = 1 langkah, tidak bisa loncat jauh
  const [point, setPoint] = useState(0);
  const pointRef = useRef(0);
  useEffect(() => {
    pointRef.current = point;
  }, [point]);

  // aktif hanya ketika berada di stage 1
  useEffect(() => {
    if (stage !== 1) return;

    let accum = 0;
    const maxIndex = items.length - 1;

    const step = (dir: 1 | -1) => {
      const next = Math.max(0, Math.min(maxIndex, pointRef.current + dir));
      if (next !== pointRef.current) setPoint(next);
    };

    const onWheel = (e: WheelEvent) => {
      // trackpad bisa sangat sensitif — akumulasi dulu
      accum += e.deltaY;
      const TH = 120; // ambang (±120 ~ 1 "notch" mouse; trackpad juga oke)
      if (accum > TH) {
        step(1);
        accum = 0;
      } else if (accum < -TH) {
        step(-1);
        accum = 0;
      }
    };

    // dukung sentuh (mobile)
    let lastY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      accum += lastY - y; // geser ke atas → positif
      lastY = y;
      const TH = 60; // ambang untuk sentuh
      if (accum > TH) {
        step(1);
        accum = 0;
      } else if (accum < -TH) {
        step(-1);
        accum = 0;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [stage, items.length]);

  // transisi halus saat beranjak dari hero ke stage berikutnya
  const yOnScroll = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroY = prefersReduced ? 0 : yOnScroll;
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.25, 0]);

  // Ringankan animasi (tanpa blur supaya tidak berat)
  const stageFade = useMemo(
    () => ({
      initial: { opacity: 0, y: prefersReduced ? 0 : 10 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
      exit: { opacity: 0, y: prefersReduced ? 0 : -8, transition: { duration: 0.3, ease: EASE } },
    }),
    [prefersReduced, EASE]
  );

  return (
    <main className="mx-auto max-w-6xl px-6">
      {/* Tinggi kontainer = 3 layar (tanpa snap) */}
      <div ref={containerRef} className="relative" style={{ height: `${STAGES * 100}vh` }}>
        {/* Viewport sticky yang selalu 1 layar */}
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
