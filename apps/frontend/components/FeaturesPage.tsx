// apps/frontend/components/FeaturesPage.tsx
"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  motion,
  useReducedMotion,
  type Variants,
  AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/** =========================================================
 *  STABILITY FIRST EDITION — safest defaults (tightened spacing)
 * ========================================================= */

/* =======================
 * Types
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

type Locale = string; // long-term friendly

/* =======================
 * Constants
 * ======================= */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const BRAND = "#26658C";
const TICK_GREY = "rgba(0,0,0,0.55)";
const READ_BLUE = "#2563EB";

/* =======================
 * Utils (stable)
 * ======================= */
const isEditable = (el: EventTarget | null): boolean => {
  const node = el as HTMLElement | null;
  if (!node) return false;
  const tag = node.tagName?.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  let cur: HTMLElement | null = node;
  while (cur) {
    if (cur.getAttribute?.("contenteditable") === "true") return true;
    cur = cur.parentElement;
  }
  return false;
};

const isInteractive = (el: EventTarget | null): boolean => {
  const node = el as HTMLElement | null;
  if (!node) return false;
  const tag = node.tagName?.toLowerCase();
  if (["a", "button", "summary", "details"].includes(tag)) return true;
  if (node.getAttribute?.("role") === "button") return true;
  return isEditable(node);
};

// Visual viewport height (mobile-safe)
const getVVH = (): number => (window.visualViewport?.height ?? window.innerHeight);

// Apakah target/ancestor-nya bisa scroll native di sumbu Y?
const canScrollWithin = (target: EventTarget | null): boolean => {
  let cur = target as HTMLElement | null;
  let depth = 0;
  while (cur && depth++ < 12) {
    if (cur.dataset?.nativeScroll === "true") return true;
    if (cur.getAttribute?.("role") === "dialog") return true;
    const style = window.getComputedStyle(cur);
    const oy = style.overflowY;
    const canScrollY =
      (oy === "auto" || oy === "scroll") && cur.scrollHeight > cur.clientHeight;
    if (canScrollY) return true;
    cur = cur.parentElement;
  }
  return false;
};

/* cubic-bezier helper (y only; cukup untuk easing terhadap waktu) */
const cubicBezierY = (p0y: number, p1y: number) => (t: number) => {
  const u = 1 - t;
  return 3 * u * u * t * p0y + 3 * u * t * t * p1y + t * t * t;
};
/* ease fn sesuai EASE di atas */
const easeFn = cubicBezierY(EASE[1], EASE[3]);

/* Normalisasi delta wheel ke pixel */
const normalizeWheelDelta = (e: WheelEvent, vhPx: number) => {
  if (e.deltaMode === 1) return e.deltaY * 16; // line → px approx
  if (e.deltaMode === 2) return e.deltaY * vhPx; // page → 1vh
  return e.deltaY; // already px
};

/* =======================
 * Quote splitter */
function splitQuoted(desc: string): { quote?: string; rest: string } {
  const m = desc.match(/“([^”]+)”/); // smart quotes
  if (m && m.index !== undefined) {
    const before = desc.slice(0, m.index).trim();
    const after = desc
      .slice(m.index + m[0].length)
      .trim()
      .replace(/^[\s,.;:—-]+/, "");
    const rest = [before, after].filter(Boolean).join(" ").replace(/\s+/g, " ");
    return { quote: m[1], rest: rest || "" };
  }
  const m2 = desc.match(/"([^"]+)"/); // straight quotes
  if (m2 && m2.index !== undefined) {
    const before = desc.slice(0, m2.index).trim();
    const after = desc
      .slice(m2.index + m2[0].length)
      .trim()
      .replace(/^[\s,.;:—-]+/, "");
    const rest = [before, after].filter(Boolean).join(" ").replace(/\s+/g, " ");
    return { quote: m2[1], rest: rest || "" };
  }
  return { rest: desc };
}

export default function FeaturesPage() {
  const t = useTranslations("features");
  const pathnameRaw = usePathname() || "/";
  // fix: removed stray token
  const m = pathnameRaw.match(/^\/([A-Za-z-]{2,5})(?:\/|$)/);
  const localePrefix = m?.[1] ? `/${m[1]}` : "";
  const locale = (m?.[1]?.toLowerCase() || "") as Locale;
  const prefersReduced = useReducedMotion();

  const withLocale = (href: string) => {
    if (/^https?:\/\/.*/.test(href)) return href;
    if (href.startsWith("#")) return href;
    return `${localePrefix}${href.startsWith("/") ? href : `/${href}`}`;
  };

  // 6 poin fitur
  const items: { key: keyof IntlMessages["features"]["cards"]; icon: string }[] = [
    { key: "instant", icon: "⚡️" },
    { key: "multitenant", icon: "🏢" },
    { key: "analytics", icon: "📊" },
    { key: "handoff", icon: "🤝" },
    { key: "multilingual", icon: "🌐" },
    { key: "booking", icon: "📅" },
  ];

  const rise: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 14 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.38, ease: EASE, delay },
    }),
  };

  const stageFade = useMemo(
    () => ({
      initial: { opacity: 0, y: prefersReduced ? 0 : 8 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
      exit: { opacity: 0, y: prefersReduced ? 0 : -6, transition: { duration: 0.22, ease: EASE } },
    }),
    [prefersReduced]
  );

  /* =======================
   * Micro animations
   * ======================= */
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

  /* =======================
   * Sticky viewport multi-step
   * ======================= */
  const TOTAL_STEPS = items.length + 2; // hero + 6 items + cta
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [step, _setStep] = useState(0);
  const stepRef = useRef(0);
  const setStep = useCallback((v: number) => {
    stepRef.current = v;
    _setStep(v);
  }, []);

  const lockRef = useRef(false);
  const lastDirRef = useRef<1 | -1 | 0>(0);
  const lastChangeAtRef = useRef(0);
  const COOLDOWN = 260;

  const containerTopRef = useRef(0);
  const viewportHRef = useRef(0);

  // wheel accumulation (untuk gesture halus)
  const wheelAccRef = useRef(0);

  // animasi scroll kustom
  const animRef = useRef<number | null>(null);
  const cancelAnim = useCallback(() => {
    if (animRef.current != null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  }, []);

  const animateTo = useCallback(
    (to: number, duration = 420) => {
      cancelAnim();
      const start = window.scrollY;
      const dist = to - start;
      if (Math.abs(dist) < 1) {
        window.scrollTo({ top: to, behavior: "auto" });
        return;
      }
      lockRef.current = true;
      const t0 = performance.now();

      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = prefersReduced ? p : easeFn(p);
        const y = start + dist * eased;
        window.scrollTo({ top: y, behavior: "auto" });

        if (p < 1 && lockRef.current) {
          animRef.current = requestAnimationFrame(tick);
        } else {
          animRef.current = null;
          window.scrollTo({ top: to, behavior: "auto" }); // align
          lockRef.current = false;
          lastChangeAtRef.current = performance.now();
        }
      };

      animRef.current = requestAnimationFrame(tick);
    },
    [cancelAnim, prefersReduced]
  );

  const recalc = useCallback(() => {
    const root = containerRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    containerTopRef.current = window.scrollY + rect.top;
    const h = getVVH();
    viewportHRef.current = h;
    // Set CSS var for consistent height calc
    root.style.setProperty("--vvh", `${h}px`);
  }, []);

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

  const vh = useCallback(() => viewportHRef.current || getVVH(), []);

  const scrollToStep = useCallback(
    (next: number, dir: 1 | -1) => {
      const top = containerTopRef.current + next * vh();
      setStep(next);
      lastDirRef.current = dir;
      lastChangeAtRef.current = performance.now();
      animateTo(top, prefersReduced ? 0 : 420);
    },
    [setStep, vh, animateTo, prefersReduced]
  );

  const interceptionEnabled = !prefersReduced;

  useEffect(() => {
    if (!interceptionEnabled) return;
    const root = containerRef.current;
    if (!root) return;

    const ctrl = new AbortController();
    const { signal } = ctrl;

    const go = (dir: 1 | -1) => {
      const next = Math.max(0, Math.min(TOTAL_STEPS - 1, stepRef.current + dir));
      if (next !== stepRef.current) {
        wheelAccRef.current = 0;
        scrollToStep(next, dir);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!inViewport()) return;
      if (lockRef.current) return;
      if (e.ctrlKey || isEditable(e.target) || isInteractive(e.target)) return;
      if (canScrollWithin(e.target)) return;

      e.preventDefault();

      const delta = normalizeWheelDelta(e, vh());
      if (Math.sign(delta) !== Math.sign(wheelAccRef.current)) {
        wheelAccRef.current = 0;
      }
      wheelAccRef.current += delta;

      const threshold = Math.max(40, Math.min(140, vh() * 0.08));
      if (Math.abs(wheelAccRef.current) >= threshold) {
        const dir: 1 | -1 = wheelAccRef.current > 0 ? 1 : -1;
        go(dir);
      }
    };

    // Touch
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (!inViewport()) return;
      if (isEditable(e.target) || isInteractive(e.target)) return;
      startY = e.touches[0].clientY;
      cancelAnim();
      lockRef.current = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!inViewport() || lockRef.current) return;
      if (isEditable(e.target) || isInteractive(e.target)) return;
      if (canScrollWithin(e.target)) return;

      const delta = startY - e.touches[0].clientY;
      const thresh = Math.max(26, vh() * 0.03);
      if (Math.abs(delta) < thresh) return;
      e.preventDefault();
      const dir: 1 | -1 = delta > 0 ? 1 : -1;
      startY = e.touches[0].clientY;
      go(dir);
    };

    // Keyboard
    const onKey = (e: KeyboardEvent) => {
      if (!inViewport() || lockRef.current) return;
      if (isEditable(e.target) || isInteractive(e.target)) return;

      let dir: 1 | -1 | 0 | null = null;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") dir = 1;
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
  }, [TOTAL_STEPS, interceptionEnabled, inViewport, scrollToStep, cancelAnim, vh]);

  // Sync while dragging scrollbar
  useEffect(() => {
    if (!interceptionEnabled) return;
    const ctrl = new AbortController();
    const { signal } = ctrl;

    const onScroll = () => {
      if (!inViewport() || lockRef.current) return;

      const now = performance.now();
      if (now - lastChangeAtRef.current < COOLDOWN) return;

      const pos = window.scrollY - containerTopRef.current;
      const targetIdx = Math.round((pos + vh() * 0.08) / vh());
      const clamped = Math.max(0, Math.min(TOTAL_STEPS - 1, targetIdx));
      if (clamped === stepRef.current) return;

      const dir: 1 | -1 = clamped > stepRef.current ? 1 : -1;
      lastDirRef.current = dir;
      lastChangeAtRef.current = now;
      setStep(clamped);
    };

    window.addEventListener("scroll", onScroll, { passive: true, signal });
    return () => ctrl.abort();
  }, [TOTAL_STEPS, interceptionEnabled, inViewport, setStep, vh]);

  /* =======================
   * Render
   * ======================= */
  return (
    <main className="mx-auto max-w-6xl px-6">
      <div
        ref={containerRef}
        className="relative"
        style={{ height: `calc(var(--vvh) * ${TOTAL_STEPS})` }}
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
                    className="mt-2.5 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight"
                    variants={rise}
                    initial="hidden"
                    animate="visible"
                    custom={0.12}
                  >
                    {t("title")}
                  </motion.h1>

                  {/* SUBTITLE */}
                  <motion.p
                    className="-mt-1 sm:-mt-0.5 max-w-2xl text-base sm:text-lg italic text-foreground/70 mx-auto leading-snug"
                    variants={rise}
                    initial="hidden"
                    animate="visible"
                    custom={0.18}
                  >
                    {t("subtitle")}
                  </motion.p>

                  <div className="mt-7 inline-flex items-center gap-2 text-foreground/60">
                    <span className="text-sm">Scroll</span>
                    <span className="animate-bounce" aria-hidden>↓</span>
                  </div>
                </motion.section>
              )}

              {/* Step 1..6: content + stage */}
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
                      className="w-full max-w-3xl md:max-w-none text-center md:text-left"
                    >
                      {/* ====== GRID: ikon | judul/quote/desc ====== */}
                      <div className="grid grid-cols-[40px_minmax(0,1fr)] md:grid-cols-[44px_minmax(0,1fr)] gap-x-3.5 md:gap-x-4 items-start">
                        {/* Icon (col 1) */}
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

                        {/* Title (col 2) */}
                        <motion.h3
                          variants={contentStagger.item}
                          className="col-start-2 text-xl md:text-[1.375rem] font-semibold leading-tight tracking-tight mb-0.5"
                        >
                          {t(`cards.${items[step - 1].key}.title`)}
                        </motion.h3>

                        {/* Quote + body (col 2) */}
                        {(() => {
                          const descRaw = t(`cards.${items[step - 1].key}.desc`) as unknown as string;
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
                      {/* ====== /GRID ====== */}
                    </motion.div>

                    {/* RIGHT: stage */}
                    <div className="hidden md:flex justify-center md:justify-center md:mt-[2px] w-full">
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
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {t("title")}
                  </h2>
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

/* =======================
 * Stage per-point
 * ======================= */
function FeatureStage({
  stepKey,
  prefersReduced,
  locale,
}: {
  stepKey: keyof IntlMessages["features"]["cards"];
  prefersReduced: boolean;
  locale: Locale;
}) {
  if (stepKey === "instant") {
    return <InstantChatStage prefersReduced={prefersReduced} locale={locale} />;
  }

  if (stepKey === "multitenant") {
    return <AnalyticsTableStage prefersReduced={prefersReduced} />;
  }

  if (stepKey === "analytics") {
    return <AnalyticsRealtimeStage prefersReduced={prefersReduced} />;
  }

  if (stepKey === "handoff") {
    return <HandoffStage prefersReduced={prefersReduced} locale={locale} />;
  }

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
      className="aspect-square w-[64vw] max-w-[420px] rounded-2xl mx-auto"
      style={{ background: `${base}80` }}
      aria-label="Feature animation stage"
    >
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
          animate={prefersReduced ? undefined : { rotate: [0, 6, -4, 0] }}
          transition={prefersReduced ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
}

/* =======================
 * InstantChatStage — chat sequence + typing
 * ======================= */
function InstantChatStage({
  prefersReduced,
  locale,
}: {
  prefersReduced: boolean;
  locale: Locale;
}) {
  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.985, y: 6 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
  };

  const baseDelay = prefersReduced ? 0 : 0.06;
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 6 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: EASE, delay: baseDelay + i * 0.32 },
    }),
  };

  const copy =
    locale === "tr"
      ? {
          user: "Merhaba! Yarın için bir randevu alabilir miyim?",
          bot:
            "Tabii ki! 7/24 çevrimiçiyiz. Randevunuzu sabah mı yoksa öğleden sonra mı tercih edersiniz?",
        }
      : {
          user: "Hi! Can I book a consultation for tomorrow?",
          bot:
            "Of course! We’re online 24/7. Would you prefer morning or afternoon for your appointment?",
        };

  const [phase, setPhase] = useState<"idle" | "typing" | "bot">(
    prefersReduced ? "bot" : "idle"
  );

  useEffect(() => {
    if (prefersReduced) return;
    const t1 = window.setTimeout(() => setPhase("typing"), 380);
    const t2 = window.setTimeout(() => setPhase("bot"), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [prefersReduced, locale]);

  const isRead = phase !== "idle";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-[64vw] max-w-[460px] aspect-[4/3] flex flex-col justify-center gap-2.5 select-none"
      aria-label="Lightning-fast auto-reply demo"
    >
      {/* CUSTOMER bubble — kanan */}
      <motion.div
        custom={0}
        variants={itemVariants}
        className="self-end max-w-[90%] rounded-2xl px-4 py-2.5 bg-[#F2F8FC] border border-black/10 shadow-sm text-[0.98rem] leading-snug relative ml-12 md:ml-24"
      >
        <div className="pr-12">{copy.user}</div>
        <time
          className="absolute bottom-1 right-3 text-[11px] text-foreground/60 whitespace-nowrap"
          aria-hidden
        >
          21:13{" "}
          <motion.span
            initial={{ color: TICK_GREY }}
            animate={{ color: isRead ? READ_BLUE : TICK_GREY }}
            transition={{ duration: 0.24, ease: EASE }}
            className="ml-0.5"
          >
            ✓
          </motion.span>
          <motion.span
            initial={{ color: TICK_GREY }}
            animate={{ color: isRead ? READ_BLUE : TICK_GREY }}
            transition={{ duration: 0.24, ease: EASE, delay: 0.03 }}
          >
            ✓
          </motion.span>
        </time>
      </motion.div>

      {/* BOT area: typing indicator -> bot reply */}
      <div className="self-start max-w-[92%] mr-12 md:mr-24" aria-live={phase === "bot" ? "polite" : "off"}>
        <AnimatePresence initial={false} mode="wait">
          {phase === "typing" && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE } }}
              exit={{ opacity: 0, y: -5, transition: { duration: 0.16, ease: EASE } }}
              className="inline-flex items-center"
              aria-label="typing"
            >
              <TypingDots />
            </motion.div>
          )}

          {phase === "bot" && (
            <motion.div
              key="bot"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, ease: EASE }}
              exit={{ opacity: 0, y: -5, transition: { duration: 0.18, ease: EASE } }}
              className="relative rounded-2xl px-4 py-2.5 bg-white border border-black/10 shadow-sm text-[0.98rem] leading-snug"
            >
              <div className="pr-10">{copy.bot}</div>
              <time
                className="absolute bottom-1 right-3 text-[11px] text-foreground/60 whitespace-nowrap"
                aria-hidden
              >
                21:13
              </time>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// typing indicator (3 dots only)
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5" aria-label="typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: BRAND }}
          initial={{ opacity: 0.35, y: 0 }}
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

/* =======================
 * NEW: small utilities for multitenant stage
 * ======================= */
function CountUp({
  to,
  duration = 0.75,
  delay = 0,
  disabled = false,
  suffix = "",
}: {
  to: number;
  duration?: number;
  delay?: number;
  disabled?: boolean;
  suffix?: string;
}) {
  const mv = useMotionValue(0);
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (disabled) {
      setVal(to);
      return;
    }
    const controls = animate(mv, to, {
      duration,
      delay,
      ease: "easeOut",
    });
    const unsub = mv.on("change", (v) => setVal(Math.round(v)));
    return () => {
      controls.stop();
      unsub();
    };
  }, [to, duration, delay, disabled, mv]);

  return <span className="tabular-nums text-foreground/80">{val}{suffix}</span>;
}

function StatusPill({
  status,
  activePulse = true,
}: {
  status: "Active" | "Standby";
  activePulse?: boolean;
}) {
  const isActive = status === "Active";
  const brand = BRAND;
  return (
    <span
      className="
        relative inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium
        shadow-[inset_0_-1px_0_rgba(255,255,255,0.65)]
        transition-colors whitespace-nowrap
      "
      style={
        isActive
          ? { borderColor: "rgba(38,101,140,0.28)", background: "#F3F8FC", color: brand }
          : { borderColor: "rgba(0,0,0,0.18)", background: "white", color: "rgba(0,0,0,0.78)" }
      }
    >
      <span
        className="relative inline-block h-2 w-2 rounded-full overflow-visible"
        style={{ background: isActive ? brand : "#64748b" }}
        aria-hidden
      >
        {isActive && activePulse && (
          <motion.span
            className="absolute inset-0 rounded-full"
            initial={{ scale: 1, opacity: 0.35 }}
            animate={{ scale: [1, 1.28, 1], opacity: [0.35, 0, 0.35] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
            style={{ background: brand }}
          />
        )}
      </span>
      {status}
    </span>
  );
}

function BranchIcon({ type }: { type: "hq" | "branch" }) {
  const color = type === "hq" ? BRAND : "#94a3b8";
  const ring =
    type === "hq" ? "0 0 0 6px rgba(38,101,140,0.12)" : "0 0 0 6px rgba(148,163,184,0.12)";
  return (
    <span
      className="h-2.5 w-2.5 rounded-full"
      style={{ background: color, boxShadow: ring }}
      aria-hidden
    />
  );
}

/* =======================
 * SchultzBackdrop — generative soft blobs */
function SchultzBackdrop({ prefersReduced }: { prefersReduced: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[-5] overflow-hidden">
      <motion.div
        initial={{ x: -24, y: -16, scale: 1, opacity: 0.5 }}
        {...(prefersReduced
          ? {}
          : {
              animate: { x: [-24, 18, -12, -24], y: [-16, -4, 10, -16], rotate: [0, 8, -6, 0] },
              transition: { duration: 22, repeat: Infinity, ease: "easeInOut" as const },
            })}
        className="absolute -top-10 -left-12 h-56 w-56 md:h-72 md:w-72 rounded-full blur-3xl mix-blend-overlay"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(38,101,140,0.65) 0%, rgba(38,101,140,0) 72%)",
        }}
      />
      <motion.div
        initial={{ x: 8, y: -8, scale: 1, opacity: 0.42 }}
        {...(prefersReduced
          ? {}
          : {
              animate: { x: [8, -22, 14, 8], y: [-8, 14, -6, -8], rotate: [0, -6, 4, 0] },
              transition: { duration: 26, repeat: Infinity, ease: "easeInOut" as const },
            })}
        className="absolute -top-8 right-0 h-48 w-48 md:h-64 md:w-64 rounded-full blur-3xl mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(255,214,102,0.6) 0%, rgba(255,214,102,0) 72%)",
        }}
      />
      <motion.div
        initial={{ x: 24, y: 36, scale: 1, opacity: 0.36 }}
        {...(prefersReduced
          ? {}
          : {
              animate: { x: [24, -6, 18, 24], y: [36, 18, 46, 36], rotate: [0, 5, -4, 0] },
              transition: { duration: 24, repeat: Infinity, ease: "easeInOut" as const },
            })}
        className="absolute bottom-0 right-6 h-56 w-56 md:h-72 md:w-72 rounded-full blur-3xl mix-blend-multiply"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(119,135,255,0.5) 0%, rgba(119,135,255,0) 72%)",
        }}
      />
    </div>
  );
}

/* =======================
 * AnalyticsTableStage — pengganti stage multitenant */
function AnalyticsTableStage({ prefersReduced }: { prefersReduced: boolean }) {
  const rows = [
    { name: "HQ",       agents: 24, queues: 8, sla: 99, status: "Active" as const,  type: "hq" as const },
    { name: "Branch A", agents: 12, queues: 3, sla: 98, status: "Standby" as const, type: "branch" as const },
    { name: "Branch B", agents: 7,  queues: 2, sla: 97, status: "Standby" as const, type: "branch" as const },
  ];

  const container: Variants = {
    hidden:  { opacity: 0, scale: 0.985, y: 6 },
    visible: {
      opacity: 1, scale: 1, y: 0,
      transition: { duration: 0.3, ease: EASE, staggerChildren: prefersReduced ? 0 : 0.06 }
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible:{ opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE } },
  };

  return (
    <motion.div
      key="analytics-table-ss"
      variants={container}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -6 }}
      aria-label="Analytics table"
      className="
        relative w-full max-w-full md:max-w-[640px] overflow-hidden
        rounded-[22px] border border-white/60 bg-white/55
        md:backdrop-blur-xl backdrop-blur
        supports-[not(backdrop-filter:blur(0))]:bg-white/90
        shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]
      "
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          opacity: prefersReduced ? 0.40 : 0.58,
          background:
            "radial-gradient(60% 60% at 20% 0%, rgba(219,234,254,0.65) 0%, transparent 60%)," +
            "radial-gradient(55% 45% at 100% 30%, rgba(253,230,138,0.45) 0%, transparent 60%)",
        }}
      />
      <SchultzBackdrop prefersReduced={prefersReduced} />

      <div className="px-4 md:px-5 py-3.5 md:py-4 border-b border-white/60 bg-white/40 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="text-[14px] md:text-[15px] font-medium tracking-tight text-foreground/85">
            Access &amp; workload
          </div>
          <div className="text-[10px] md:text-[11px] text-foreground/70">Last 24h</div>
        </div>
      </div>

      <div className="overflow-x-hidden">
        <table className="w-full text-[13px] md:text-sm table-fixed">
          <colgroup>
            <col className="w-[32%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
            <col className="w-[26%]" />
          </colgroup>

          <thead>
            <tr className="text-left text-foreground/80">
              <th className="px-4 md:px-5 py-2.5 md:py-3 font-medium">Branch</th>
              <th className="px-4 md:px-5 py-2.5 md:py-3 font-medium text-right">Agents</th>
              <th className="px-4 md:px-5 py-2.5 md:py-3 font-medium text-right">Queues</th>
              <th className="px-4 md:px-5 py-2.5 md:py-3 font-medium text-right">SLA</th>
              <th className="px-4 md:px-5 py-2.5 md:py-3 font-medium whitespace-nowrap">Status</th>
            </tr>
          </thead>

          <tbody className="bg-white/50">
            {rows.map((r, i) => (
              <motion.tr
                key={r.name}
                variants={item}
                tabIndex={0}
                className="
                  group border-t border-black/5 outline-none
                  hover:bg-white/70 focus-visible:bg-white/80
                  focus-visible:ring-2 focus-visible:ring-[rgba(38,101,140,0.25)]
                  hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]
                  transition-colors
                "
              >
                <td className="px-4 md:px-5 py-2.5 md:py-3">
                  <div className="inline-flex items-center gap-2.5 whitespace-nowrap">
                    <BranchIcon type={r.type} />
                    <span className="font-medium tracking-tight truncate">{r.name}</span>
                  </div>
                </td>

                <td className="px-4 md:px-5 py-2.5 md:py-3 text-right whitespace-nowrap">
                  <CountUp to={r.agents} disabled={prefersReduced} />
                </td>
                <td className="px-4 md:px-5 py-2.5 md:py-3 text-right whitespace-nowrap">
                  <CountUp to={r.queues} delay={0.07 + i * 0.06} disabled={prefersReduced} />
                </td>
                <td className="px-4 md:px-5 py-2.5 md:py-3 text-right whitespace-nowrap">
                  <CountUp to={r.sla} suffix="%" delay={0.14 + i * 0.06} disabled={prefersReduced} />
                </td>

                <td className="px-4 md:px-5 py-2.5 md:py-3">
                  <StatusPill status={r.status} activePulse={!prefersReduced && i === 0} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 md:px-5 py-2.5 md:py-3 border-t border-white/60 bg-white/40 text-[11px] md:text-[12px] text-foreground/75">
        Tip: angka di atas hanya contoh; sambungkan ke API kamu untuk data real-time.
      </div>
    </motion.div>
  );
}

/* =======================
 * AnalyticsRealtimeStage — chart + counters + gradient shift
 * ======================= */
function AnalyticsRealtimeStage({ prefersReduced }: { prefersReduced: boolean }) {
  const barsA = [28, 42, 35, 55, 62, 48, 30, 40, 58, 66, 52, 38];
  const barsB = [34, 36, 48, 60, 54, 50, 36, 46, 62, 72, 56, 44];

  const container: Variants = {
    hidden: { opacity: 0, scale: 0.985, y: 6 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
  };

  return (
    <motion.div
      key="analytics-realtime"
      variants={container}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -6 }}
      className="
        relative w-full max-w-[640px] overflow-hidden rounded-[22px]
        border border-white/60 bg-white/55 md:backdrop-blur-xl backdrop-blur
        supports-[not(backdrop-filter:blur(0))]:bg-white/90
        shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]
      "
      aria-label="Realtime Analytics"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          opacity: prefersReduced ? 0.40 : 0.58,
          background:
            "radial-gradient(60% 60% at 15% 10%, rgba(219,234,254,0.6) 0%, transparent 60%)," +
            "radial-gradient(55% 45% at 100% 20%, rgba(253,230,138,0.45) 0%, transparent 60%)",
        }}
      />
      <SchultzBackdrop prefersReduced={prefersReduced} />

      <div className="px-4 md:px-5 py-3.5 md:py-4 border-b border-white/60 bg-white/40 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="text-[14px] md:text-[15px] font-medium tracking-tight text-foreground/85">
            Realtime Analytics
          </div>
          <div className="text-[10px] md:text-[11px] text-foreground/70">Live</div>
        </div>
      </div>

      <div className="px-4 md:px-5 py-3 md:py-4 grid grid-cols-3 gap-3 md:gap-4">
        <MetricCard
          label="Conversations"
          value={<CountUp to={1280} disabled={prefersReduced} />}
          hint="last 24h"
        />
        <MetricCard
          label="Avg. Response"
          value={<CountUp to={42} disabled={prefersReduced} suffix="s" />}
          hint="< 60s target"
        />
        <MetricCard
          label="CSAT"
          value={<CountUp to={95} disabled={prefersReduced} suffix="%" />}
          hint="survey"
        />
      </div>

      <div className="px-2 md:px-4 pb-4 md:pb-5">
        <div className="relative h-[180px] rounded-xl bg-white/65 border border-white/60 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1="0"
                x2="100%"
                y1={`${25 * (i + 1)}%`}
                y2={`${25 * (i + 1)}%`}
                stroke="rgba(0,0,0,0.06)"
                strokeDasharray="4 4"
              />
            ))}
          </svg>

          <div className="absolute inset-0 flex items-end px-3 md:px-4 gap-[6px] md:gap-[8px]">
            {(prefersReduced ? barsA : barsB).map((h, i) => (
              <motion.div
                key={i}
                className="w-full max-w-[28px] rounded-md border border-black/5 bg-[rgba(38,101,140,0.12)]"
                initial={{ height: `${Math.max(8, h - 12)}%` }}
                animate={
                  prefersReduced
                    ? { height: `${h}%` }
                    : { height: [`${h - 10}%`, `${h + 8}%`, `${h}%`] }
                }
                transition={
                  prefersReduced
                    ? { duration: 0.35 }
                    : { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }
                }
              />
            ))}
          </div>

          {!prefersReduced && (
            <motion.div
              className="absolute inset-y-0 w-1/3"
              style={{
                background:
                  "linear-gradient(90deg, rgba(38,101,140,0) 0%, rgba(38,101,140,0.10) 50%, rgba(38,101,140,0) 100%)",
                filter: "blur(8px)",
              }}
              initial={{ x: "-40%" }}
              animate={{ x: ["-40%", "120%"] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>
      </div>

      <div className="px-4 md:px-5 py-2.5 md:py-3 border-t border-white/60 bg-white/40 text-[11px] md:text-[12px] text-foreground/75">
        Live sample. Sambungkan ke data kamu (WS/SSE/Polling) untuk update realtime.
      </div>
    </motion.div>
  );
}

function MetricCard({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border border-white/60 bg-white/70 px-3 py-2.5 md:px-4 md:py-3">
      <div className="text-[11px] md:text-[12px] text-foreground/70">{label}</div>
      <div className="mt-0.5 text-lg md:text-xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="text-[10px] md:text-[11px] text-foreground/60">{hint}</div>}
    </div>
  );
}

/* =======================
 * NEW: HandoffStage — simulated chat timeline (AI → human)
 * NOTE: ditambah "lane offset" agar tidak lurus: user → kanan (ml), agent/human → kiri (mr)
 * ======================= */
function HandoffStage({ prefersReduced, locale }: { prefersReduced: boolean; locale: Locale }) {
  type Sender = "user" | "ai" | "human" | "system";

  const script =
    locale === "tr"
      ? ([
          { sender: "user",  text: "Tedaviden sonra dikişlerim kanamaya başladı, ne yapmalıyım?" },
          { sender: "ai",    text: "Bu durum özel dikkat gerektiriyor. Sizi sağlık ekibimize bağlıyorum." },
          { sender: "human", text: "Merhaba, benim adım Ayşe. Hemşireyim, görüşmeyi devralıyorum ve size yardımcı olacağım." },
        ] as Array<{ sender: Sender; text: string }>)
      : ([
          { sender: "user",  text: "My stitches started bleeding after the treatment, what should I do?" },
          { sender: "ai",    text: "This needs special attention. I’ll connect you with our medical staff." },
          { sender: "human", text: "Hello, my name is Ella. I’m a nurse, and I’ll take over the conversation to assist you further." },
        ] as Array<{ sender: Sender; text: string }>);

  const [idx, setIdx] = useState(prefersReduced ? script.length : 1);
  const [typing, setTyping] = useState(!prefersReduced);

  useEffect(() => {
    if (prefersReduced) return;
    if (idx < script.length) {
      const next = script[idx];
      const isAgent = next.sender === "ai" || next.sender === "human";
      const preDelay = isAgent ? 450 : 280;

      const t1 = window.setTimeout(() => setTyping(isAgent), preDelay);
      const t2 = window.setTimeout(() => {
        setIdx((n) => n + 1);
        setTyping(false);
      }, preDelay + (isAgent ? 950 : 160));

      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [idx, prefersReduced, script]);

  // helper: kelas offset supaya tidak "lurus"
  const laneOffset = (sender: Sender) =>
    sender === "user" ? "ml-12 md:ml-24" : "mr-12 md:mr-24";

  return (
    <motion.div
      key="handoff-simulated-chat"
      initial={{ opacity: 0, scale: 0.985, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="relative w-full max-w-[560px] aspect-[4/3] flex mx-auto"
      aria-label="Chat simulation with AI → human handoff"
    >
      <div className="flex-1 flex flex-col p-3.5 md:p-5">
        {/* messages — user kanan, agent/bot kiri; dengan offset lanes */}
        <div className="flex-1">
          <div className="flex flex-col gap-3 md:gap-3.5">
            <AnimatePresence initial={false}>
              {script.slice(0, idx).map((m, i) => (
                <motion.div
                  key={`${i}-${m.sender}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className={`${m.sender === "user" ? "self-end" : "self-start"} ${laneOffset(m.sender)}`}
                >
                  <ChatBubble sender={m.sender}>{m.text}</ChatBubble>
                </motion.div>
              ))}

              {typing && !prefersReduced && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className={`self-start inline-flex items-center rounded-2xl px-3 py-2 bg-white border border-black/10 shadow-sm ${laneOffset("ai")}`}
                >
                  <TypingDots />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="pt-2 text-[10px] md:text-[11px] text-foreground/60 text-right">
          Seamless AI → Human handoff (simulated)
        </div>
      </div>
    </motion.div>
  );
}

/* small chat bubble
   NOTE: ditambah sedikit pengaturan max-width agar proporsi isu "lurus" makin hilang */
function ChatBubble({
  sender,
  children,
}: {
  sender: "user" | "ai" | "human" | "system";
  children: ReactNode;
}) {
  if (sender === "system") {
    return (
      <div className="mx-auto text-[11px] md:text-[12px] text-foreground/60 px-2 py-1">
        {children}
      </div>
    );
  }

  const isUser = sender === "user";
  const bg = isUser ? "#F2F8FC" : "#FFFFFF";
  const elevation = isUser ? "shadow-md" : "shadow-sm";
  const widthClass = isUser ? "max-w-[86%] md:max-w-[78%]" : "max-w-[90%] md:max-w-[82%]";

  return (
    <div
      className={`${widthClass} rounded-2xl px-4 py-2.5 border border-black/10 ${elevation}`}
      style={{ background: bg }}
    >
      <div className="text-[0.98rem] leading-snug">
        {children}
      </div>
    </div>
  );
}
