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

// Easing stabil
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

  // Animasi ringan
  const rise: Variants = {
    hidden:  { opacity: 0, y: prefersReduced ? 0 : 16 },
    visible: (delay: number = 0) => ({
      opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE, delay },
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
  const TOTAL_STEPS = items.length + 2; // 8
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [step, _setStep] = useState(0);
  const stepRef = useRef(0);
  const setStep = (v: number) => { stepRef.current = v; _setStep(v); };

  // guard saat smooth-scroll
  const lockRef = useRef(false);

  // simpang posisi absolut kontainer
  const containerTopRef = useRef(0);
  const calcContainerTop = () => {
    const root = containerRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    containerTopRef.current = window.scrollY + rect.top;
  };
  useEffect(() => {
    calcContainerTop();
    window.addEventListener("resize", calcContainerTop, { passive: true });
    return () => window.removeEventListener("resize", calcContainerTop);
  }, []);

  const vh = () => window.innerHeight;
  const containerHeightVh = TOTAL_STEPS * 100;

  const inViewport = () => {
    const root = containerRef.current;
    if (!root) return false;
    const rect = root.getBoundingClientRect();
    const h = window.innerHeight;
    return rect.top < h * 0.85 && rect.bottom > h * 0.15;
  };

  // Snap ke step tertentu (selalu ±1 dari current)
  const scrollToStep = (next: number) => {
    const top = containerTopRef.current + next * vh();
    setStep(next);
    lockRef.current = true;
    window.scrollTo({ top, behavior: "smooth" });

    // Lepas lock setelah benar2 mendarat ±1px dari target
    const start = performance.now();
    const check = () => {
      const y = window.scrollY;
      if (Math.abs(y - top) <= 1 || performance.now() - start > 800) {
        lockRef.current = false;
      } else {
        requestAnimationFrame(check);
      }
    };
    requestAnimationFrame(check);
  };

  // ---------- Intercept gesture: ±1 langkah sesuai arah ----------
  useEffect(() => {
    if (prefersReduced) return;
    const root = containerRef.current;
    if (!root) return;

    const onWheel = (e: WheelEvent) => {
      if (!inViewport()) return;
      if (e.ctrlKey) return;
      e.preventDefault();
      if (lockRef.current) return;

      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(TOTAL_STEPS - 1, stepRef.current + dir));
      if (next !== stepRef.current) scrollToStep(next);
    };

    // Touch
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => { if (inViewport()) startY = e.touches[0].clientY; };
    const onTouchMove  = (e: TouchEvent) => {
      if (!inViewport() || lockRef.current) return;
      const delta = startY - e.touches[0].clientY;
      if (Math.abs(delta) < 28) return;
      e.preventDefault();
      const dir: 1 | -1 = delta > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(TOTAL_STEPS - 1, stepRef.current + dir));
      if (next !== stepRef.current) scrollToStep(next);
      startY = e.touches[0].clientY;
    };

    // Keyboard
    const onKey = (e: KeyboardEvent) => {
      if (!inViewport() || lockRef.current) return;
      let dir: 1 | -1 | 0 | null = null;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") dir = -1;
      else if (e.key === "Home") dir = 0;
      else if (e.key === "End") dir = 0;
      else return;
      e.preventDefault();

      let next = stepRef.current;
      if (e.key === "Home") next = 0;
      else if (e.key === "End") next = TOTAL_STEPS - 1;
      else next = Math.max(0, Math.min(TOTAL_STEPS - 1, stepRef.current + (dir as 1 | -1)));

      if (next !== stepRef.current) scrollToStep(next);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      root.removeEventListener("wheel", onWheel as EventListener);
      root.removeEventListener("touchstart", onTouchStart as EventListener);
      root.removeEventListener("touchmove", onTouchMove as EventListener);
      window.removeEventListener("keydown", onKey);
    };
  }, [TOTAL_STEPS, prefersReduced]);

  // ---------- Sync saat user DRAG scrollbar: threshold 60% + arah nyata ----------
  useEffect(() => {
    const HYST = 0.6; // 60% layar
    const lastYRef = useRef<number | null>(null);

    const onScroll = () => {
      if (!inViewport() || lockRef.current) return;

      const y = window.scrollY;
      if (lastYRef.current === null) {
        lastYRef.current = y;
        return;
      }
      const dy = y - lastYRef.current;
      lastYRef.current = y;
      if (dy === 0) return;

      const dir: 1 | -1 = dy > 0 ? 1 : -1; // arah NYATA user

      const stepTop = containerTopRef.current + stepRef.current * vh();
      const thresholdDown = stepTop + HYST * vh();
      const thresholdUp   = stepTop - HYST * vh();

      if (dir === 1) {
        // turun hanya jika melewati 60% ke bawah
        if (y >= thresholdDown) {
          const next = Math.min(TOTAL_STEPS - 1, stepRef.current + 1);
          if (next !== stepRef.current) setStep(next);
        }
      } else {
        // naik hanya jika melewati 60% ke atas
        if (y <= thresholdUp) {
          const next = Math.max(0, stepRef.current - 1);
          if (next !== stepRef.current) setStep(next);
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [TOTAL_STEPS]);

  // ===== Render =====
  return (
    <main className="mx-auto max-w-6xl px-6">
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
                <motion.section key="step-hero" {...stageFade} className="text-center">
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

              {/* Step 1..6: daftar kiri, konten kanan */}
              {step >= 1 && step <= items.length && (
                <motion.section key="step-points" {...stageFade} className="w-full">
                  <div className="grid gap-8 md:grid-cols-[20rem_minmax(0,1fr)]">
                    <nav className="hidden md:block sticky top-20 self-start" aria-label="Features">
                      <ol className="flex flex-col gap-3">
                        {items.map(({ key }, idx) => {
                          const active = idx === step - 1;
                          return (
                            <li key={String(key)}>
                              <button
                                type="button"
                                onClick={() => scrollToStep(idx + 1)}
                                aria-current={active ? "step" : undefined}
                                className={`w-full text-left rounded-lg px-3 py-2 transition ${
                                  active ? "bg-black text-white" : "text-foreground/70 hover:bg-black/5"
                                }`}
                              >
                                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs">
                                  {idx + 1}
                                </span>
                                {t(`cards.${key}.title`)}
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    </nav>

                    <div className="md:col-span-1 min-h-[60vh] flex items-center">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={items[step - 1].key}
                          initial={{ opacity: 0, y: prefersReduced ? 0 : 10 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } }}
                          exit={{ opacity: 0, y: prefersReduced ? 0 : -8, transition: { duration: 0.25, ease: EASE } }}
                          className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm w-full text-center md:text-left"
                        >
                          <div
                            className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                            aria-hidden
                            style={{ background: `${BRAND}14`, color: BRAND }}
                          >
                            {items[step - 1].icon}
                          </div>
                          <h3 className="text-xl font-semibold">
                            {t(`cards.${items[step - 1].key}.title`)}
                          </h3>
                          <p className="mt-2 text-foreground/70">
                            {t(`cards.${items[step - 1].key}.desc`)}
                          </p>

                          <div className="mt-6 flex justify-center md:hidden gap-2">
                            {items.map((_, i) => (
                              <span
                                key={i}
                                className={`h-1.5 w-6 rounded-full ${i === step - 1 ? "bg-black" : "bg-black/15"}`}
                              />
                            ))}
                          </div>

                          <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
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
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.section>
              )}

              {/* Step terakhir: CTA */}
              {step === items.length + 1 && (
                <motion.section key="step-cta" {...stageFade} className="text-center">
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
