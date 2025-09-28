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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** =========================================================
 *  STABILITY FIRST EDITION — safest defaults
 *  - no intercept when prefers-reduced-motion
 *  - preventDefault only when really needed
 *  - viewport height uses VisualViewport
 *  ========================================================= */

/* =======================
 * Types (diletakkan di atas agar urutan rapi)
 * ======================= */
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

/* =======================
 * Constants
 * ======================= */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const BRAND = "#26658C";

/* =======================
 * Utils (stable)
 * ======================= */
const isEditable = (el: EventTarget | null): boolean => {
  const node = el as HTMLElement | null;
  if (!node) return false;
  const tag = node.tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  // contenteditable chain
  let cur: HTMLElement | null = node;
  while (cur) {
    if (cur.getAttribute?.("contenteditable") === "true") return true;
    cur = cur.parentElement;
  }
  return false;
};

// Visual viewport height (mobile-safe)
const getVVH = (): number => {
  // visualViewport lebih akurat saat URL bar mobile muncul/hilang
  return (window.visualViewport?.height ?? window.innerHeight) | 0;
};

// Apakah target/ancestor-nya bisa scroll native di sumbu Y?
const canScrollWithin = (target: EventTarget | null): boolean => {
  let cur = target as HTMLElement | null;
  while (cur) {
    if (cur.dataset?.nativeScroll === "true") return true;
    const style = window.getComputedStyle(cur);
    const oy = style.overflowY;
    const canScrollY =
      (oy === "auto" || oy === "scroll") && cur.scrollHeight > cur.clientHeight;
    if (canScrollY) return true;
    cur = cur.parentElement;
  }
  return false;
};

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

  // 6 poin fitur (urut sesuai prioritasmu)
  const items: { key: keyof IntlMessages["features"]["cards"]; icon: string }[] = [
    { key: "instant", icon: "⚡️" },
    { key: "multitenant", icon: "🏢" },
    { key: "analytics", icon: "📊" },
    { key: "handoff", icon: "🤝" },
    { key: "multilingual", icon: "🌐" },
    { key: "booking", icon: "📅" },
  ];

  const rise: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 16 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: EASE, delay },
    }),
  };

  const stageFade = useMemo(
    () => ({
      initial: { opacity: 0, y: prefersReduced ? 0 : 10 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.35, ease: EASE },
      },
      exit: {
        opacity: 0,
        y: prefersReduced ? 0 : -8,
        transition: { duration: 0.25, ease: EASE },
      },
    }),
    [prefersReduced]
  );

  /* =======================
   * Micro animations (ringan & respect reduced-motion)
   * ======================= */
  const contentStagger = useMemo(() => {
    return {
      container: {
        hidden: { opacity: 0, y: prefersReduced ? 0 : 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.35,
            ease: EASE,
            staggerChildren: prefersReduced ? 0 : 0.06,
            delayChildren: 0.02,
          },
        },
      } as Variants,
      item: {
        hidden: { opacity: 0, y: prefersReduced ? 0 : 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, ease: EASE },
        },
      } as Variants,
    };
  }, [prefersReduced]);

  // ~12% alpha untuk halo (#RRGGBB + '1F')
  const BRAND_BG_12 = `${BRAND}1F`;

  /* =======================
   * Sticky viewport multi-step
   * ======================= */
  const TOTAL_STEPS = items.length + 2; // hero + 6 items + cta = 8
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [step, _setStep] = useState(0);
  const stepRef = useRef(0);
  const setStep = useCallback((v: number) => {
    stepRef.current = v;
    _setStep(v);
  }, []);

  // locks & timing
  const lockRef = useRef(false);
  const lastDirRef = useRef<1 | -1 | 0>(0);
  const lastChangeAtRef = useRef(0);
  const COOLDOWN = 280; // ms

  // cached geometry
  const containerTopRef = useRef(0);
  const viewportHRef = useRef(0);

  const recalc = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    containerTopRef.current = window.scrollY + rect.top;
    viewportHRef.current = getVVH();
  }, []);

  // initial + resize/viewport changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    recalc();

    const ctrl = new AbortController();
    const { signal } = ctrl;

    window.addEventListener("resize", recalc, { passive: true, signal });

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", recalc, { signal });
      window.visualViewport.addEventListener("scroll", recalc, { signal });
    }

    window.addEventListener("orientationchange", recalc, {
      passive: true,
      signal,
    });

    return () => ctrl.abort();
  }, [recalc]);

  const inViewport = useCallback(() => {
    const root = containerRef.current;
    if (!root) return false;
    const rect = root.getBoundingClientRect();
    const h = getVVH();
    return rect.top < h * 0.85 && rect.bottom > h * 0.15;
  }, []);

  const vh = useCallback(() => viewportHRef.current || getVVH(), []);

  // Snap to step (±1 only)
  const scrollToStep = useCallback(
    (next: number, dir: 1 | -1) => {
      const top = containerTopRef.current + next * vh();
      setStep(next);
      lockRef.current = true;
      lastDirRef.current = dir;
      lastChangeAtRef.current = performance.now();

      // Smooth, then force-align
      window.scrollTo({ top, behavior: "smooth" });
      const alignTimer = window.setTimeout(() => {
        window.scrollTo({ top, behavior: "auto" });
        lockRef.current = false;
        lastChangeAtRef.current = performance.now();
      }, 420);

      // safety: cancel align if unmounted
      return () => clearTimeout(alignTimer);
    },
    [setStep, vh]
  );

  /* =======================
   * Interaction interceptors
   * ======================= */
  const interceptionEnabled = !prefersReduced;

  // Wheel / Touch / Keyboard
  useEffect(() => {
    if (!interceptionEnabled) return;
    const root = containerRef.current;
    if (!root) return;

    const ctrl = new AbortController();
    const { signal } = ctrl;

    const go = (dir: 1 | -1) => {
      const next = Math.max(0, Math.min(TOTAL_STEPS - 1, stepRef.current + dir));
      if (next !== stepRef.current) scrollToStep(next, dir);
    };

    const onWheel = (e: WheelEvent) => {
      if (!inViewport()) return;
      if (lockRef.current) return;
      if (e.ctrlKey || isEditable(e.target)) return; // pinch zoom / input
      if (canScrollWithin(e.target)) return; // nested scrollable

      e.preventDefault();
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      go(dir);
    };

    // Touch
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (!inViewport()) return;
      if (isEditable(e.target)) return;
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!inViewport() || lockRef.current) return;
      if (isEditable(e.target)) return;
      if (canScrollWithin(e.target)) return;

      const delta = startY - e.touches[0].clientY;
      if (Math.abs(delta) < 28) return;
      e.preventDefault();
      const dir: 1 | -1 = delta > 0 ? 1 : -1;
      go(dir);
      startY = e.touches[0].clientY;
    };

    // Keyboard (only when body focus, not inside inputs)
    const onKey = (e: KeyboardEvent) => {
      if (!inViewport() || lockRef.current) return;
      if (isEditable(e.target)) return;

      let dir: 1 | -1 | 0 | null = null;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ")
        dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") dir = -1;
      else if (e.key === "Home") dir = 0;
      else if (e.key === "End") dir = 0;
      else return;

      e.preventDefault();
      if (dir === 0) {
        const next = e.key === "Home" ? 0 : TOTAL_STEPS - 1;
        if (next !== stepRef.current)
          scrollToStep(next, (lastDirRef.current || 1) as 1 | -1);
        return;
      }
      go(dir as 1 | -1);
    };

    root.addEventListener("wheel", onWheel, { passive: false, signal });
    root.addEventListener("touchstart", onTouchStart, { passive: true, signal });
    root.addEventListener("touchmove", onTouchMove, { passive: false, signal });
    window.addEventListener("keydown", onKey, { signal });

    return () => ctrl.abort();
  }, [TOTAL_STEPS, interceptionEnabled, inViewport, scrollToStep]);

  // Sync while dragging scrollbar (no preventDefault here)
  useEffect(() => {
    if (!interceptionEnabled) return;

    const ctrl = new AbortController();
    const { signal } = ctrl;

    const onScroll = () => {
      if (!inViewport() || lockRef.current) return;

      const now = performance.now();
      if (now - lastChangeAtRef.current < COOLDOWN) return;

      const pos = window.scrollY - containerTopRef.current;
      const targetIdx = Math.round(pos / vh());
      const clamped = Math.max(0, Math.min(TOTAL_STEPS - 1, targetIdx));
      if (clamped === stepRef.current) return;

      const dir: 1 | -1 = clamped > stepRef.current ? 1 : -1;
      const next = Math.max(0, Math.min(TOTAL_STEPS - 1, stepRef.current + dir));
      lastDirRef.current = dir;
      lastChangeAtRef.current = now;
      setStep(next);
    };

    window.addEventListener("scroll", onScroll, { passive: true, signal });
    return () => ctrl.abort();
  }, [TOTAL_STEPS, interceptionEnabled, inViewport, setStep, vh]);

  /* =======================
   * Render
   * ======================= */
  const containerHeightVh = TOTAL_STEPS * 100;

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
                    <span className="animate-bounce" aria-hidden>
                      ↓
                    </span>
                  </div>
                </motion.section>
              )}

              {/* Step 1..6: KIRI = TEKS (posisi oranye), KANAN = STAGE ANIMASI */}
              {step >= 1 && step <= items.length && (
                <motion.section key="step-content" {...stageFade} className="w-full">
                  <div className="grid md:grid-cols-[minmax(22rem,40rem)_minmax(0,1fr)] gap-10 md:gap-14 items-center md:items-start">
                    {/* LEFT: text block (tanpa kotak & tanpa CTA) */}
                    <motion.div
                      variants={contentStagger.container}
                      initial="hidden"
                      animate="visible"
                      exit={{
                        opacity: 0,
                        y: prefersReduced ? 0 : -8,
                        transition: { duration: 0.25, ease: EASE },
                      }}
                      className="w-full max-w-3xl md:max-w-none text-center md:text-left"
                    >
                      {/* Ikon + halo pulse */}
                      <motion.div
                        variants={contentStagger.item}
                        className="relative mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                        aria-hidden
                      >
                        {!prefersReduced && (
                          <motion.span
                            className="absolute inset-0 rounded-xl"
                            style={{ background: BRAND_BG_12 }}
                            initial={{ opacity: 0.55, scale: 1 }}
                            animate={{ opacity: [0.55, 0], scale: [1, 1.22] }}
                            transition={{
                              duration: 1.6,
                              ease: "easeOut",
                              repeat: Infinity,
                              repeatDelay: 0.5,
                            }}
                          />
                        )}
                        <span style={{ color: BRAND }}>{items[step - 1].icon}</span>
                      </motion.div>

                      {/* Judul + underline sweep */}
                      <motion.h3
                        variants={contentStagger.item}
                        className="text-xl md:text-2xl font-semibold inline-block"
                      >
                        {t(`cards.${items[step - 1].key}.title`)}
                        {!prefersReduced && (
                          <motion.span
                            aria-hidden
                            className="block h-[3px] rounded-full mt-1"
                            style={{ backgroundColor: BRAND, transformOrigin: "0% 50%" }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.45, ease: EASE, delay: 0.05 }}
                          />
                        )}
                      </motion.h3>

                      {/* Deskripsi */}
                      <motion.p
                        variants={contentStagger.item}
                        className="mt-2 text-foreground/70"
                        data-native-scroll="true"
                        style={{ maxHeight: 320, overflowY: "auto" }}
                      >
                        {t(`cards.${items[step - 1].key}.desc`)}
                      </motion.p>
                    </motion.div>

                    {/* RIGHT: stage animasi per-point (placeholder, siap ganti Lottie/canvas) */}
                    <div className="hidden md:flex justify-center md:justify-start">
                      <FeatureStage
                        stepKey={items[step - 1].key}
                        prefersReduced={!!prefersReduced}
                      />
                    </div>
                  </div>
                </motion.section>
              )}

              {/* Step terakhir: CTA (global) */}
              {step === items.length + 1 && (
                <motion.section key="step-cta" {...stageFade} className="text-center">
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

/* =======================
 * Stage placeholder untuk animasi per-point
 * - Bersih & siap diganti Lottie/canvas nantinya
 * ======================= */
function FeatureStage({
  stepKey,
  prefersReduced,
}: {
  stepKey: keyof IntlMessages["features"]["cards"];
  prefersReduced: boolean;
}) {
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
      initial={{ opacity: 0, scale: 0.98, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="aspect-square w-[68vw] max-w-[420px] rounded-2xl"
      style={{ background: `${base}80` }} // 50% alpha
      aria-label="Feature animation stage"
    >
      {!prefersReduced && (
        <motion.div
          className="h-full w-full rounded-2xl"
          initial={{ clipPath: "inset(50% 50% 50% 50% round 24px)" }}
          animate={{ clipPath: "inset(12% 12% 12% 12% round 24px)" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="h-full w-full rounded-2xl"
            style={{
              background: `radial-gradient(60% 60% at 65% 35%, ${base} 0%, transparent 60%)`,
            }}
            animate={{ rotate: [0, 6, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
