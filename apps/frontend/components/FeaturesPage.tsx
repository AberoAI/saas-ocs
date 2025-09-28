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

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const BRAND = "#26658C";

// Utils (stable)
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

// Can this target (or its ancestors) scroll natively on Y?
const canScrollWithin = (target: EventTarget | null): boolean => {
  const el = target as HTMLElement | null;
  let cur: HTMLElement | null = el;
  while (cur) {
    if (cur?.dataset?.nativeScroll === "true") return true;
    const style = window.getComputedStyle(cur);
    const oy = style.overflowY;
    const canScrollY =
      (oy === "auto" || oy === "scroll") && cur.scrollHeight > cur.clientHeight;
    if (canScrollY) return true;
    cur = cur.parentElement;
  }
  return false;
};

// Visual viewport height (mobile-safe)
const getVVH = () => {
  // visualViewport is more accurate on mobile URL bar show/hide
  return (window.visualViewport?.height ?? window.innerHeight) | 0;
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

  // 6 poin fitur (urutkan sesuai prioritasmu)
  const items: { key: keyof IntlMessages["features"]["cards"]; icon: string }[] = [
    { key: "instant",      icon: "⚡️" },
    { key: "multitenant",  icon: "🏢" },
    { key: "analytics",    icon: "📊" },
    { key: "handoff",      icon: "🤝" },
    { key: "multilingual", icon: "🌐" },
    { key: "booking",      icon: "📅" },
  ];

  const rise: Variants = {
    hidden:  { opacity: 0, y: prefersReduced ? 0 : 16 },
    visible: (delay = 0) => ({
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

  // ===== Sticky viewport multi-step =====
  const TOTAL_STEPS = items.length + 2; // hero + 6 items + cta = 8
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [step, _setStep] = useState(0);
  const stepRef = useRef(0);
  const setStep = useCallback((v: number) => { stepRef.current = v; _setStep(v); }, []);

  // locks & timing
  const lockRef = useRef(false);
  const lastDirRef = useRef<1 | -1 | 0>(0);
  const lastChangeAtRef = useRef(0);
  const COOLDOWN = 280; // ms (sedikit lebih konservatif)

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

    // window resize
    window.addEventListener("resize", recalc, { passive: true, signal });

    // visualViewport resize/scroll (mobile chrome/safari)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", recalc, { signal });
      window.visualViewport.addEventListener("scroll", recalc, { signal });
    }

    // orientation change (iOS)
    window.addEventListener("orientationchange", recalc, { passive: true, signal });

    return () => ctrl.abort();
  }, [recalc]);

  const inViewport = useCallback(() => {
    const root = containerRef.current;
    if (!root) return false;
    const rect = root.getBoundingClientRect();
    const h = getVVH();
    return rect.top < h * 0.85 && rect.bottom > h * 0.15;
  }, []);

  const vh = useCallback(() => (viewportHRef.current || getVVH()), []);

  // Snap to step (±1 only)
  const scrollToStep = useCallback((next: number, dir: 1 | -1) => {
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
  }, [setStep, vh]);

  /** ===========================
   *  INTERACTION INTERCEPTORS
   *  =========================== */

  // Early exit: honor reduced motion → no interception at all (paling stabil)
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
      // allow pinch zoom & editable fields
      if (e.ctrlKey || isEditable(e.target)) return;
      // if user is scrolling a nested scrollable area, don't hijack
      if (canScrollWithin(e.target)) return;

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
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") dir = -1;
      else if (e.key === "Home") dir = 0;
      else if (e.key === "End") dir = 0;
      else return;

      e.preventDefault();
      if (dir === 0) {
        const next = e.key === "Home" ? 0 : TOTAL_STEPS - 1;
        if (next !== stepRef.current) scrollToStep(next, (lastDirRef.current || 1) as 1 | -1);
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

  // ===== Render =====
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
                    <span className="animate-bounce" aria-hidden>↓</span>
                  </div>
                </motion.section>
              )}

              {/* Step 1..6: HANYA daftar poin (panel kanan dihapus) */}
              {step >= 1 && step <= items.length && (
                <motion.section key="step-points" {...stageFade} className="w-full">
                  <nav className="block sticky top-20 mx-auto max-w-xl" aria-label="Features">
                    <ol className="flex flex-col gap-3">
                      {items.map(({ key }, idx) => {
                        const active = idx === step - 1;
                        return (
                          <li key={String(key)}>
                            <button
                              type="button"
                              onClick={() =>
                                scrollToStep(idx + 1, idx + 1 > stepRef.current ? 1 : -1)
                              }
                              aria-current={active ? "step" : undefined}
                              className={`w-full text-left rounded-lg px-4 py-3 transition ${
                                active
                                  ? "bg-black text-white"
                                  : "text-foreground/80 hover:bg-black/5"
                              }`}
                            >
                              <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs">
                                {idx + 1}
                              </span>
                              {t(`cards.${key}.title`)}
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </nav>
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
