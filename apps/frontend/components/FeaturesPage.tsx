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

// Visual viewport height (mobile-safe)
const getVVH = (): number =>
  (window.visualViewport?.height ?? window.innerHeight) | 0;

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
  const locale = (m?.[1]?.toLowerCase() || "") as "en" | "tr" | "";
  const prefersReduced = useReducedMotion();

  const withLocale = (href: string) => {
    if (/^https?:\/\/.*/.test(href)) return href;
    if (href.startsWith("#")) return href;
    return `${localePrefix}${href.startsWith("/") ? href : `/${href}`}`;
  };

  // 6 poin fitur
  const items: { key: keyof IntlMessages["features"]["cards"]; icon: string }[] =
    [
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
  const contentStagger = useMemo(() => {
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
      } as Variants,
      item: {
        hidden: { opacity: 0, y: prefersReduced ? 0 : 6 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE } },
      } as Variants,
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
    viewportHRef.current = getVVH();
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
      if (Math.abs(delta) < 26) return;
      e.preventDefault();
      const dir: 1 | -1 = delta > 0 ? 1 : -1;
      go(dir);
      startY = e.touches[0].clientY;
    };

    // Keyboard
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
                    <div className="hidden md:flex justify-center md:justify-start md:mt-[2px]">
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
 * Stage per-point
 * ======================= */
function FeatureStage({
  stepKey,
  prefersReduced,
  locale,
}: {
  stepKey: keyof IntlMessages["features"]["cards"];
  prefersReduced: boolean;
  locale: "en" | "tr" | "";
}) {
  if (stepKey === "instant") {
    return <InstantChatStage prefersReduced={prefersReduced} locale={locale} />;
  }

  // ✅ gunakan stage advance untuk multitenant
  if (stepKey === "multitenant") {
    return <MultiTenantStageAdvanced prefersReduced={prefersReduced} />;
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

/* =======================
 * InstantChatStage — chat sequence + typing
 * ======================= */
function InstantChatStage({
  prefersReduced,
  locale,
}: {
  prefersReduced: boolean;
  locale: "en" | "tr" | "";
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
      <div className="self-start max-w-[92%]">
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
              animate={{ opacity: 1, y: 0, transition: { duration: 0.26, ease: EASE } }}
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
 * Advanced Stage (simplified isometric style): Hub (donut+bars) -> 3 child cards
 * ======================= */
function MultiTenantStageAdvanced({ prefersReduced }: { prefersReduced: boolean }) {
  const ACCENT = "#EC4899"; // magenta accent; ganti ke BRAND jika mau full biru
  const GREY = "rgba(0,0,0,0.16)";

  return (
    <motion.div
      key="hub-branches-simplified"
      initial={{ opacity: 0, scale: 0.985, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: EASE }}
      className="aspect-square w-[64vw] max-w-[520px] rounded-2xl border border-black/10 bg-white/80 overflow-hidden"
      aria-label="Hub with donut and bars connected to three child cards"
    >
      {/* soft background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, #f5faff 0%, transparent 60%), radial-gradient(120% 80% at 100% 30%, #fef6fb 0%, transparent 50%)",
        }}
        aria-hidden
      />

      {/* --- TOP PLATFORM (donut + bars) --- */}
      <motion.div
        className="absolute left-1/2 top-[14%] -translate-x-1/2"
        initial={{ y: 8, opacity: 0 }}
        animate={{
          y: prefersReduced ? 0 : [0, -2, 0],
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          ease: EASE,
          ...(prefersReduced ? {} : { delay: 0.05, repeat: Infinity, repeatDelay: 2.2 }),
        }}
      >
        {/* platform */}
        <div className="relative w-[220px] h-[128px]">
          <div className="absolute inset-0 rounded-[20px] bg-white border border-black/10 shadow-sm" />
          {/* subtle bottom shadow */}
          <div
            className="absolute left-1/2 -bottom-2 h-6 w-[70%] -translate-x-1/2 rounded-full blur-xl"
            style={{ background: "rgba(0,0,0,0.06)" }}
            aria-hidden
          />
          {/* donut */}
          <div className="absolute left-4 top-4 w-[116px] h-[116px]">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(#CBD5E1 0deg, #CBD5E1 210deg, #E5E7EB 210deg, #E5E7EB 360deg)",
              }}
            />
            {/* accent wedge */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 290deg, transparent 0deg, transparent 330deg, #EC4899 330deg, #EC4899 360deg)",
                mixBlendMode: "multiply",
              }}
            />
            <div className="absolute inset-[22%] rounded-full bg-white" />
          </div>
          {/* bars */}
          <div className="absolute right-4 top-6 flex items-end gap-2">
            {[36, 56, 76].map((h, i) => (
              <motion.span
                key={i}
                className="w-4 rounded-sm"
                style={{ height: h, background: i === 2 ? BRAND : "#CBD5E1" }}
                initial={{ scaleY: 0.95, opacity: 0.95 }}
                animate={prefersReduced ? {} : { scaleY: [0.95, 1, 0.95] }}
                transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* --- CONNECTORS (dotted) --- */}
      <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {/* left */}
        <path
          d="M 50 38 C 38 50, 28 66, 20 78"
          fill="none"
          stroke={GREY}
          strokeWidth="0.8"
          strokeDasharray="3 4"
        />
        {/* middle */}
        <path
          d="M 50 38 C 50 52, 50 70, 50 82"
          fill="none"
          stroke={GREY}
          strokeWidth="0.8"
          strokeDasharray="3 4"
        />
        {/* right */}
        <path
          d="M 50 38 C 62 50, 72 66, 80 78"
          fill="none"
          stroke={GREY}
          strokeWidth="0.8"
          strokeDasharray="3 4"
        />
      </svg>

      {/* --- THREE CHILD CARDS --- */}
      <div className="absolute left-0 right-0 bottom-4 px-4 grid grid-cols-3 gap-3">
        {["Branch A", "Branch B", "Branch C"].map((label, i) => (
          <motion.div
            key={i}
            className="relative w-full aspect-[4/3] rounded-2xl border border-black/10 bg-white overflow-hidden"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.28, ease: EASE, delay: 0.05 * i }}
            style={{ boxShadow: i === 1 ? "0 10px 24px rgba(0,0,0,0.08)" : "0 6px 16px rgba(0,0,0,0.04)" }}
          >
            {/* header micro-UI */}
            <div className="absolute left-2 right-2 top-2 flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md border border-black/10 bg-white/70">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ background: i === 1 ? "#EC4899" : BRAND }}
                />
                <span>{label}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
                <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
                <span className="h-1.5 w-1.5 rounded-full bg-black/20" />
              </div>
            </div>

            {/* content mini-layout: donut mini + image block + tiles */}
            <div className="absolute inset-x-2 bottom-2 top-9 grid grid-cols-3 gap-1.5">
              {/* mini donut */}
              <div className="rounded-md border border-black/10 bg-white relative">
                <div
                  className="absolute inset-0 m-auto w-10 h-10 rounded-full"
                  style={{
                    background:
                      "conic-gradient(#CBD5E1 0deg, #CBD5E1 240deg, #E5E7EB 240deg)",
                  }}
                />
                <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-white" />
              </div>
              {/* image-ish block */}
              <div className="rounded-md border border-black/10 bg-gradient-to-b from-[#E6EEF8] to-white relative overflow-hidden" />
              {/* tiles */}
              <div className="grid grid-rows-2 gap-1.5">
                <div className="rounded-md border border-black/10 bg-white" />
                <div className="rounded-md border border-black/10 bg-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
