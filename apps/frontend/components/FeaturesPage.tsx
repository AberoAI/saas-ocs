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
 * Advanced Stage: Hub -> Branch cards (replaces older map+pins)
 * ======================= */
function MultiTenantStageAdvanced({ prefersReduced }: { prefersReduced: boolean }) {
  // Data tenant + angka contoh (sinkron dengan panel)
  const tenants = [
    { key: "HQ", icon: "🏢", color: "#F0F7FF", agents: 24, queues: 8, sla: "99%" },
    { key: "Branch A", icon: "🏬", color: "#F2FBF7", agents: 12, queues: 3, sla: "98%" },
    { key: "Branch B", icon: "🏪", color: "#FFF7ED", agents: 7, queues: 2, sla: "97%" },
  ] as const;

  const [idx, setIdx] = useState<number>(0);

  // Auto-cycle fokus antar branch (mati saat reduced motion)
  useEffect(() => {
    if (prefersReduced) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % tenants.length), 2400);
    return () => window.clearInterval(id);
  }, [prefersReduced]);

  const dashedAnim = !prefersReduced ? { strokeDashoffset: [40, 0] } : undefined;

  return (
    <motion.div
      key="hub-branches"
      initial={{ opacity: 0, scale: 0.985, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
      /* >>> perubahan penting: patuh ke kolom, bukan vw */
      className="aspect-square w-full max-w-[520px] rounded-2xl border border-black/10 bg-white/70 overflow-hidden"
      aria-label="Multi-tenant hub and branches animation"
    >
      {/* HEADER chips */}
      <div className="p-3 md:p-4 flex gap-2">
        {tenants.map((t, i) => {
          const active = i === idx;
          return (
            <motion.button
              key={t.key}
              onClick={() => setIdx(i)}
              className="px-2.5 py-1.5 rounded-xl text-sm flex items-center gap-1.5 border transition"
              style={{
                borderColor: active ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.08)",
                background: active ? `${t.color}` : "white",
              }}
              whileTap={{ scale: prefersReduced ? 1 : 0.98 }}
              transition={{ duration: 0.12 }}
              aria-pressed={active}
            >
              <span aria-hidden>{t.icon}</span>
              <span className="font-medium">{t.key}</span>
            </motion.button>
          );
        })}
      </div>

      {/* STAGE */}
      <div className="relative h-[72%] mx-3 mb-3 rounded-2xl overflow-hidden border border-black/10 bg-white">
        {/* background halus */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, #eef6ff 0%, transparent 60%), radial-gradient(120% 80% at 100% 30%, #ecfdf5 0%, transparent 50%)",
          }}
          animate={!prefersReduced ? { rotate: [0, 1.5, -1.2, 0] } : undefined}
          transition={!prefersReduced ? { duration: 18, repeat: Infinity, ease: "easeInOut" } : undefined}
          aria-hidden
        />

        {/* HUB di atas (donut + bars) */}
        <div className="absolute left-1/2 top-[8%] -translate-x-1/2">
          <motion.div
            className="relative w-[160px] h-[104px] rounded-2xl border border-black/10 bg-white shadow-sm"
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            {/* mini chart (bars) */}
            <div className="absolute right-3 top-3 flex gap-2 items-end">
              {[22, 32, 46].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-3 rounded-sm"
                  style={{ background: i === 2 ? BRAND : "#CBD5E1", height: h }}
                  initial={{ scaleY: 0.6, opacity: 0.7 }}
                  animate={!prefersReduced ? { scaleY: [0.9, 1, 0.9] } : undefined}
                  transition={!prefersReduced ? { duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut" } : undefined}
                />
              ))}
            </div>

            {/* donut */}
            <div className="absolute left-4 top-4 w-[84px] h-[84px] rounded-full bg-[conic-gradient(#93C5FD_0deg,#93C5FD_120deg,#E5E7EB_120deg,#E5E7EB_360deg)]" />
            <div className="absolute left-[34px] top-[34px] w-[36px] h-[36px] rounded-full bg-white" />
            {!prefersReduced && (
              <motion.div
                className="absolute left-4 top-4 w-[84px] h-[84px] rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, #2563EB 300deg, #2563EB 330deg, transparent 330deg)",
                  mixBlendMode: "multiply",
                }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              />
            )}
            <div className="absolute left-2 bottom-2 text-xs font-medium text-foreground/70">HQ Dashboard</div>
          </motion.div>

          {!prefersReduced && (
            <motion.div
              className="absolute left-1/2 top-[104px] -translate-x-1/2 -translate-y-1/2 w-[180px] h-[60px] rounded-full blur-2xl"
              style={{ background: "#93C5FD55" }}
              animate={{ opacity: [0.2, 0.35, 0.2], scale: [0.96, 1.04, 0.96] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
          )}
        </div>

        {/* KONEKTOR: hub -> 3 cabang */}
        <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <motion.path
            d="M 50 26 C 40 36, 28 48, 20 60"
            fill="none"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.8"
            strokeDasharray="4 4"
            initial={{ strokeDashoffset: 40 }}
            animate={dashedAnim}
            transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
          />
          <motion.path
            d="M 50 26 C 50 36, 50 52, 50 68"
            fill="none"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.8"
            strokeDasharray="4 4"
            initial={{ strokeDashoffset: 40 }}
            animate={dashedAnim}
            transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}
          />
          <motion.path
            d="M 50 26 C 60 36, 72 48, 80 60"
            fill="none"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.8"
            strokeDasharray="4 4"
            initial={{ strokeDashoffset: 40 }}
            animate={dashedAnim}
            transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
          />
        </svg>

        {/* GRID 3 CABANG */}
        <div className="absolute left-0 right-0 bottom-3 px-3 grid grid-cols-3 gap-3">
          {tenants.map((t, i) => {
            const active = i === idx;
            const tilt = prefersReduced ? {} : { rotateX: 6, rotateY: i === 0 ? -6 : i === 2 ? 6 : 0 };
            return (
              <motion.button
                key={t.key}
                onClick={() => setIdx(i)}
                className="relative w-full aspect-[4/3] rounded-2xl border border-black/10 bg-white text-left overflow-hidden"
                style={{ boxShadow: active ? "0 8px 20px rgba(0,0,0,0.08)" : "0 4px 12px rgba(0,0,0,0.04)" }}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1, ...tilt }}
                whileHover={prefersReduced ? undefined : { y: -2 }}
                transition={{ duration: 0.28, ease: EASE }}
                aria-pressed={active}
              >
                {/* header slot */}
                <div className="absolute left-2 top-2 right-2 flex items-center justify-between">
                  <div
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border border-black/10"
                    style={{ background: t.color }}
                  >
                    <span aria-hidden>{t.icon}</span>
                    {t.key}
                  </div>
                  <div className="inline-flex items-center gap-1 text-[10px] text-foreground/70">
                    <span className="px-1.5 py-[2px] rounded border border-black/10 bg-white/70">Admin</span>
                    <span className="px-1.5 py-[2px] rounded border border-black/10 bg-white/70">Manager</span>
                    <span className="px-1.5 py-[2px] rounded border border-black/10 bg-white/70">Staff</span>
                  </div>
                </div>

                {/* isi card – mini chart + tiles */}
                <div className="absolute inset-x-2 bottom-2 top-9 grid grid-cols-3 gap-1.5">
                  <div className="rounded-md border border-black/10 bg-white relative">
                    <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[conic-gradient(#60A5FA_0deg,#60A5FA_220deg,#E5E7EB_220deg)]" />
                    <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-white" />
                  </div>
                  <div className="rounded-md border border-black/10 bg-gradient-to-b from-[#E0F2FE] to-white relative overflow-hidden">
                    {!prefersReduced && (
                      <motion.div
                        className="absolute left-0 right-0 bottom-0 h-1/2"
                        style={{ background: "linear-gradient(180deg, rgba(37,99,235,0.25) 0%, rgba(37,99,235,0) 100%)" }}
                        animate={{ y: [8, -4, 8] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                  </div>
                  <div className="grid grid-rows-2 gap-1.5">
                    <div className="rounded-md border border-black/10 bg-white" />
                    <div className="rounded-md border border-black/10 bg-white" />
                  </div>
                </div>

                {/* badge Active/Standby */}
                <motion.span
                  className="absolute left-2 bottom-2 text-[11px] px-2 py-1 rounded-md border border-black/10 bg-white/80"
                  initial={{ scale: 0.96, opacity: 0.8 }}
                  animate={{ scale: active ? 1 : 0.98, opacity: 1 }}
                  transition={{ duration: 0.18, ease: EASE }}
                >
                  {active ? "Active" : "Standby"}
                </motion.span>
              </motion.button>
            );
          })}
        </div>

        {/* PANEL METRIK sinkron dengan fokus */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`panel-${tenants[idx].key}`}
            className="absolute right-3 bottom-[36%] md:bottom-3 left-3 md:left-auto md:w-[48%] rounded-xl border border-black/10 bg-white/90 backdrop-blur p-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.26, ease: EASE }}
            aria-live="polite"
          >
            <div className="text-[11px] text-foreground/60 mb-2">Access &amp; workload</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { k: "Agents", v: tenants[idx].agents },
                { k: "Queues", v: tenants[idx].queues },
                { k: "SLA", v: tenants[idx].sla },
              ].map((m, i) => (
                <motion.div
                  key={m.k}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.04 + i * 0.05 }}
                  className="rounded-lg border border-black/10 bg-white px-2.5 py-2"
                >
                  <div className="text-[11px] text-foreground/60">{m.k}</div>
                  <div className="text-base font-semibold">{m.v}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
