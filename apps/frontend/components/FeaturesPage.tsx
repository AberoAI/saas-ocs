// apps/frontend/components/FeaturesPage.tsx
"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  motion,
  useReducedMotion,
  type Variants,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

// Easing stabil (top-level agar tidak berubah per render)
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

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

  // 6 poin fitur
  const items: { key: keyof IntlMessages["features"]["cards"]; icon: string }[] = [
    { key: "instant",      icon: "⚡️" },
    { key: "multitenant",  icon: "🏢" },
    { key: "analytics",    icon: "📊" },
    { key: "handoff",      icon: "🤝" },
    { key: "multilingual", icon: "🌐" },
    { key: "booking",      icon: "📅" },
  ];

  const BRAND = "#26658C";

  // ===== Variants sederhana, ringan (tanpa blur) =====
  const rise: Variants = {
    hidden:  { opacity: 0, y: prefersReduced ? 0 : 16 },
    visible: (delay: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: EASE, delay },
    }),
  };

  const stageFade = useMemo(
    () => ({
      initial: { opacity: 0, y: prefersReduced ? 0 : 10 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
      exit:    { opacity: 0, y: prefersReduced ? 0 : -8, transition: { duration: 0.25, ease: EASE } },
    }),
    [prefersReduced]
  );

  // ===== Satu viewport sticky, beberapa langkah konten =====
  // step 0 = Hero, step 1..6 = poin fitur, step 7 = CTA
  const TOTAL_STEPS = items.length + 2; // 6 + hero + cta = 8
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  useEffect(() => { stepRef.current = step; }, [step]);

  // Lock agar tidak rebutan saat smooth-scroll menuju target step
  const lockRef = useRef(false);

  const containerHeightVh = TOTAL_STEPS * 100;

  // Sinkronkan step saat user drag scrollbar / PgUp/Down / scroll biasa
  useEffect(() => {
    const onScroll = () => {
      if (lockRef.current) return;
      const root = containerRef.current;
      if (!root) return;

      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;

      // Interaksi hanya saat kontainer terlihat cukup
      const visible = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
      if (!visible) return;

      const containerTop = window.scrollY + rect.top;
      const pos = window.scrollY - containerTop;
      const idx = Math.round(
        Math.max(0, Math.min(TOTAL_STEPS - 1, pos / vh))
      );
      if (idx !== stepRef.current) setStep(idx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [TOTAL_STEPS, containerHeightVh]);

  // Intersep gesture di area kontainer: 1 gesture = ±1 step (stabil, tanpa loncat)
  useEffect(() => {
    if (prefersReduced) return;
    const root = containerRef.current;
    if (!root) return;

    let unlockTimer: number | null = null;

    const inViewport = () => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      return rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
    };

    const scrollToStep = (next: number) => {
      const rect = root.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top;
      const target = containerTop + next * window.innerHeight;

      lockRef.current = true;
      setStep(next);
      window.scrollTo({ top: target, behavior: "smooth" });

      if (unlockTimer) window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        lockRef.current = false;
      }, 420); // sedikit di atas durasi smooth-scroll native
    };

    const onWheel = (e: WheelEvent) => {
      if (!inViewport()) return;
      if (e.ctrlKey) return; // pinch-zoom dll
      e.preventDefault();
      if (lockRef.current) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(TOTAL_STEPS - 1, stepRef.current + dir));
      if (next !== stepRef.current) scrollToStep(next);
    };

    // Sentuh (mobile)
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (!inViewport()) return;
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!inViewport()) return;
      if (lockRef.current) return;

      const delta = startY - e.touches[0].clientY; // geser ke atas = positif
      if (Math.abs(delta) < 28) return; // threshold biar nggak sensitif
      e.preventDefault();

      const dir = delta > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(TOTAL_STEPS - 1, stepRef.current + dir));
      if (next !== stepRef.current) scrollToStep(next);
      startY = e.touches[0].clientY;
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      root.removeEventListener("wheel", onWheel as EventListener);
      root.removeEventListener("touchstart", onTouchStart as EventListener);
      root.removeEventListener("touchmove", onTouchMove as EventListener);
      if (unlockTimer) window.clearTimeout(unlockTimer);
    };
  }, [TOTAL_STEPS, prefersReduced]);

  // ===== Render =====
  return (
    <main className="mx-auto max-w-6xl px-6">
      {/* Satu kontainer tinggi n layar; viewport sticky menampilkan satu konten */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${containerHeightVh}vh` }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className="w-full">
            <AnimatePresence mode="wait">
              {/* Step 0: HERO */}
              {step === 0 && (
                <motion.section
                  key="step-hero"
                  {...stageFade}
                  className="text-center"
                >
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

                  <div className="mt-10 inline-flex items-center gap-2 text-foreground/60">
                    <span className="text-sm">Scroll</span>
                    <span className="animate-bounce" aria-hidden>↓</span>
                  </div>
                </motion.section>
              )}

              {/* Step 1..6: setiap scroll ganti ke poin berikutnya */}
              {step >= 1 && step <= items.length && (
                <motion.section
                  key={`step-point-${step}`}
                  {...stageFade}
                  className="text-center"
                >
                  <div
                    className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                    aria-hidden
                    style={{ background: `${BRAND}14`, color: BRAND }}
                  >
                    {items[step - 1].icon}
                  </div>
                  <h3 className="text-xl font-semibold">
                    {t(`cards.${items[step - 1].key}.title`)}
                  </h3>
                  <p className="mt-2 max-w-2xl mx-auto text-foreground/70">
                    {t(`cards.${items[step - 1].key}.desc`)}
                  </p>

                  {/* indikator kecil */}
                  <div className="mt-6 flex justify-center gap-2">
                    {items.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-6 rounded-full ${
                          i === step - 1 ? "bg-black" : "bg-black/15"
                        }`}
                      />
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Step terakhir: CTA */}
              {step === items.length + 1 && (
                <motion.section
                  key="step-cta"
                  {...stageFade}
                  className="text-center"
                >
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {t("title")}
                  </h2>
                  <p className="mt-3 max-w-2xl mx-auto text-foreground/70">
                    {t("subtitle")}
                  </p>

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
