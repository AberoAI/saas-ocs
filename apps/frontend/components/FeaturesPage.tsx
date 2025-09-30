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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
      lockRef.current = true;
      lastDirRef.current = dir;
      lastChangeAtRef.current = performance.now();

      window.scrollTo({ top, behavior: "smooth" });
      const alignTimer = window.setTimeout(() => {
        window.scrollTo({ top, behavior: "auto" });
        lockRef.current = false;
        lastChangeAtRef.current = performance.now();
      }, 400);

      return () => clearTimeout(alignTimer);
    },
    [setStep, vh]
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
      if (next !== stepRef.current) scrollToStep(next, dir);
    };

    const onWheel = (e: WheelEvent) => {
      if (!inViewport()) return;
      if (lockRef.current) return;
      if (e.ctrlKey || isEditable(e.target)) return;
      if (isInteractive(e.target)) return;
      if (canScrollWithin(e.target)) return;

      e.preventDefault();
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      go(dir);
    };

    // Touch
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (!inViewport()) return;
      if (isEditable(e.target) || isInteractive(e.target)) return;
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!inViewport() || lockRef.current) return;
      if (isEditable(e.target) || isInteractive(e.target)) return;
      if (canScrollWithin(e.target)) return;

      const delta = startY - e.touches[0].clientY;
      if (Math.abs(delta) < 26) return;
      e.preventDefault();
      const dir: 1 | -1 = delta > 0 ? 1 : -1;
      go(dir);
      startY = e.touches[0].clientY;
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
  }, [TOTAL_STEPS, interceptionEnabled, inViewport, scrollToStep]);

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
      const targetIdx = Math.round((pos + vh() * 0.08) / vh()); // tolerance 8%
      const clamped = Math.max(0, Math.min(TOTAL_STEPS - 1, targetIdx));
      if (clamped === stepRef.current) return;

      const dir: 1 | -1 = clamped > stepRef.current ? 1 : -1;
      lastDirRef.current = dir;
      lastChangeAtRef.current = now;
      setStep(clamped); // go directly to target
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

                  {/* SUBTITLE — lebih dekat & miring */}
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
                  {/* tighter gap: gap-6 md:gap-8 */}
                  <div className="grid md:grid-cols-[minmax(22rem,40rem)_minmax(0,1fr)] gap-6 md:gap-8 items-center md:items-start">
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

                        {/* Quote + body (col 2) — tighter */}
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

                    {/* RIGHT: stage (selaras dengan judul) */}
                    <div className="hidden md:flex justify-center md:justify-start md:mt-[2px] w-full">
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

  // ⬇️ multitenant memakai tabel analitik glass
  if (stepKey === "multitenant") {
    return <AnalyticsTableStage prefersReduced={prefersReduced} />;
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
      className="aspect-square w-[64vw] max-w-[420px] rounded-2xl"
      style={{ background: `${base}80` }}
      aria-label="Feature animation stage"
    >
      {/* background lembut default */}
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
        className="self-end max-w-[90%] rounded-2xl px-4 py-2.5 bg-[#F2F8FC] border border-black/10 shadow-sm text-[0.98rem] leading-snug relative"
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
      <div className="self-start max-w-[92%]" aria-live={phase === "bot" ? "polite" : "off"}>
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
  duration = 0.75,        // 0.6–0.8s
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
  const brand = BRAND; // konsisten brand
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
      {/* pulsing dot — scale + opacity (lebih halus dari box-shadow) */}
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
 * NEW: AnalyticsTableStage — pengganti stage multitenant (count-up + highlight + ikon)
 * ======================= */
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
    visible:{ opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE } }, // 🔧 snappier (0.22 → 0.2)
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
      {/* soft ambient glow — glare ditipiskan */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          opacity: prefersReduced ? 0.45 : 0.85, // 🔧 lebih rendah 10–15%
          background:
            "radial-gradient(60% 60% at 20% 0%, rgba(219,234,254,0.65) 0%, transparent 60%)," +
            "radial-gradient(55% 45% at 100% 30%, rgba(253,230,138,0.45) 0%, transparent 60%)",
        }}
      />

      {/* header */}
      <div className="px-4 md:px-5 py-3.5 md:py-4 border-b border-white/60 bg-white/40 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="text-[14px] md:text-[15px] font-medium tracking-tight text-foreground/85">
            Access &amp; workload
          </div>
          <div className="text-[10px] md:text-[11px] text-foreground/70">Last 24h</div>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-hidden">
        <table className="w-full text-[13px] md:text-sm table-fixed">
          {/*  ✅ atur lebar kolom agar kelimanya muat di frame tanpa scroll */}
          <colgroup>
            <col className="w-[32%]" />  {/* Branch */}
            <col className="w-[14%]" />  {/* Agents */}
            <col className="w-[14%]" />  {/* Queues */}
            <col className="w-[14%]" />  {/* SLA */}
            <col className="w-[26%]" />  {/* Status (lebih longgar) */}
          </colgroup>

          <thead>
            <tr className="text-left text-foreground/80">
              <th className="px-4 md:px-5 py-2.5 md:py-3 font-medium">Branch</th>
              <th className="px-4 md:px-5 py-2.5 md:py-3 font-medium text-right">Agents</th>
              <th className="px-4 md:px-5 py-2.5 md:py-3 font-medium text-right">Queues</th>
              <th className="px-4 md:px-5 py-2.5 md:py-3 font-medium text-right">SLA</th>
              <th className="px-4 md:px-5 py-2.5 md:py-3 font-medium whitespace-nowrap">Status</th> {/* 🔧 anti-wrap */}
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
                  focus-visible:ring-2 focus-visible:ring-[rgba(38,101,140,0.25)]  /* 🔧 fokus jelas */
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

      {/* footer note — kontras/ukuran ditingkatkan */}
      <div className="px-4 md:px-5 py-2.5 md:py-3 border-t border-white/60 bg-white/40 text-[11px] md:text-[12px] text-foreground/75">
        Tip: angka di atas hanya contoh; sambungkan ke API kamu untuk data real-time.
      </div>
    </motion.div>
  );
}
