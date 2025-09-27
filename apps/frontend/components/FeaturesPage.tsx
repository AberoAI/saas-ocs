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
} from "framer-motion";
import { useMemo, useRef, useState, useEffect } from "react";

export default function FeaturesPage() {
  const t = useTranslations("features");
  const pathnameRaw = usePathname() || "/";
  const m = pathnameRaw.match(/^\/([A-Za-z-]{2,5})(?:\/|$)/);
  const localePrefix = m?.[1] ? `/${m[1]}` : "";
  const prefersReduced = useReducedMotion();

  const withLocale = (href: string) => {
    if (/^https?:\/\//.test(href)) return href; // eksternal/absolute
    if (href.startsWith("#")) return href;      // anchor lokal
    return `${localePrefix}${href.startsWith("/") ? href : `/${href}`}`;
  };

  const items: { key: keyof IntlMessages["features"]["cards"]; icon: string }[] = [
    { key: "instant",      icon: "⚡️" },
    { key: "multitenant",  icon: "🏢" },
    { key: "analytics",    icon: "📊" },
    { key: "handoff",      icon: "🤝" },
    { key: "multilingual", icon: "🌐" },
    { key: "booking",      icon: "📅" },
  ];

  // BRAND color dipakai halus untuk badge/icon background (tidak mengubah sistem warna lain)
  const BRAND = "#26658C";

  // Easing cubic-bezier (v12 butuh array, bukan string)
  const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

  // Variants animasi “muncul & naik”
  const rise: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 18 },
    visible: (delay: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE, delay },
    }),
  };

  // ---------- Sticky viewport + staged content ----------
  // 3 stage: 0=Hero, 1=Grid Fitur, 2=CTA
  const STAGES = 3;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], // 0..1 sepanjang container
  });

  const [stage, setStage] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // tanpa inner scroller, biar pas dengan snap body kita pakai pembulatan
    const idx = Math.max(0, Math.min(STAGES - 1, Math.round(v * (STAGES - 1))));
    if (idx !== stage) setStage(idx);
  });

  // cross-fade tiap stage
  const stageFade = useMemo(
    () => ({
      initial: { opacity: 0, y: prefersReduced ? 0 : 14, filter: "blur(2px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: EASE } },
      exit:    { opacity: 0, y: prefersReduced ? 0 : -12, filter: "blur(2px)", transition: { duration: 0.35, ease: EASE } },
    }),
    [prefersReduced]
  );

  // transisi halus saat beranjak dari hero ke stage berikutnya
  const yOnScroll = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroY = prefersReduced ? 0 : yOnScroll;
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.25, 0]);

  // ===== Enable scroll-snap di html/body hanya di halaman ini =====
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.scrollSnapType;
    const prevBody = body.style.scrollSnapType;
    html.style.scrollSnapType = "y mandatory";
    body.style.scrollSnapType = "y mandatory";
    return () => {
      html.style.scrollSnapType = prevHtml;
      body.style.scrollSnapType = prevBody;
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6">
      {/* Container tinggi = STAGES * 100vh agar ada ruang scroll */}
      <div ref={containerRef} className="relative" style={{ height: `${STAGES * 100}vh` }}>
        {/* Viewport sticky yang selalu 1 layar → terasa satu halaman */}
        <div className="sticky top-0 h-screen flex items-center">
          <div className="w-full">
            <AnimatePresence mode="wait">
              {/* Stage 0: HERO */}
              {stage === 0 && (
                <motion.section key="stage-hero" {...stageFade} className="text-center">
                  <motion.div style={{ y: heroY, opacity: heroOpacity }}>
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

              {/* Stage 1: GRID FITUR */}
              {stage === 1 && (
                <motion.section key="stage-grid" {...stageFade}>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {items.map(({ key, icon }) => (
                      <div
                        key={String(key)}
                        className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div
                          className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
                          aria-hidden
                          style={{ background: `${BRAND}14`, color: BRAND }}
                        >
                          {icon}
                        </div>

                        <h3 className="text-base font-medium">{t(`cards.${key}.title`)}</h3>
                        <p className="mt-1 text-sm text-foreground/70">{t(`cards.${key}.desc`)}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Stage 2: CTA */}
              {stage === 2 && (
                <motion.section key="stage-cta" {...stageFade} className="text-center">
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

        {/* Sentinel snap points di flow dokumen (1 layar per stage) */}
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
