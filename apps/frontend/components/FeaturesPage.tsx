// apps/frontend/components/FeaturesPage.tsx
"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import {
  motion,
  useReducedMotion,
  type Variants,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

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

  // ===== HERO =====
  const rise: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 18 },
    visible: (delay: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE, delay },
    }),
  };

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = prefersReduced ? 0 : useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.25, 0]);

  // ===== FEATURES STEPPER (STABIL) =====
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const [point, setPoint] = useState(0);
  const pointRef = useRef(0);
  useEffect(() => {
    pointRef.current = point;
  }, [point]);

  // Tinggi area stepper = N layar
  const stepperHeightVh = items.length * 100;

  // Sinkronkan highlight saat user drag scrollbar / PageUpDown / touch
  useEffect(() => {
    const onScroll = () => {
      const root = stepperRef.current;
      if (!root) return;

      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;

      // hanya saat viewport bersinggungan signifikan dengan area stepper
      const visible = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
      if (!visible) return;

      const startY = window.scrollY + rect.top;
      const pos = window.scrollY - startY; // jarak dari awal area
      const idx = Math.round(Math.max(0, Math.min(items.length - 1, pos / vh)));
      if (idx !== pointRef.current) setPoint(idx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length, stepperHeightVh]);

  // Intersepsi wheel HANYA di area stepper: 1 gerakan ⇒ ±1 poin (tanpa loncat)
  useEffect(() => {
    if (prefersReduced) return; // biarkan natural untuk accessibility

    const root = stepperRef.current;
    if (!root) return;

    let animating = false;
    let unlockTimer: number | null = null;

    const scrollToIndex = (next: number) => {
      const rect = root.getBoundingClientRect();
      const startTop = window.scrollY + rect.top;
      const target = startTop + next * window.innerHeight;

      animating = true;
      setPoint(next);
      window.scrollTo({ top: target, behavior: "smooth" });

      if (unlockTimer) window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        animating = false;
      }, 500);
    };

    const onWheel = (e: WheelEvent) => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
      if (!visible) return; // di luar area → jangan intersep

      // Intersep agar tidak “nyeret” ke section lain
      e.preventDefault();
      if (animating) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(items.length - 1, pointRef.current + dir));
      if (next !== pointRef.current) scrollToIndex(next);
    };

    // Sentuh (mobile)
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
      if (!visible) return;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
      if (!visible) return;

      const delta = touchStartY - e.touches[0].clientY;
      if (Math.abs(delta) < 24 || animating) return; // ambang kecil
      e.preventDefault();

      const dir = delta > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(items.length - 1, pointRef.current + dir));
      if (next !== pointRef.current) scrollToIndex(next);
      touchStartY = e.touches[0].clientY;
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
  }, [items.length, prefersReduced]);

  const stageFade = useMemo(
    () => ({
      initial: { opacity: 0, y: prefersReduced ? 0 : 10 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
      exit: { opacity: 0, y: prefersReduced ? 0 : -8, transition: { duration: 0.25, ease: EASE } },
    }),
    [prefersReduced, EASE]
  );

  return (
    <main className="mx-auto max-w-6xl px-6">
      {/* ===== HERO (section biasa) ===== */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center text-center"
      >
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

        <a
          href="#features-stepper"
          className="mt-10 inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition"
          aria-label="Scroll to features"
        >
          <span className="text-sm">Scroll</span>
          <span className="animate-bounce" aria-hidden>↓</span>
        </a>
      </section>

      {/* ===== FEATURES STEPPER (kontainer tinggi N layar, konten sticky) ===== */}
      <div
        id="features-stepper"
        ref={stepperRef}
        className="relative"
        style={{ height: `${stepperHeightVh}vh` }}
      >
        <div className="sticky top-0 h-screen grid gap-8 md:grid-cols-3 items-start">
          {/* daftar poin (kiri) */}
          <ol className="hidden md:flex md:flex-col md:gap-4 pt-16">
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

          {/* konten aktif (kanan, 2 kolom) */}
          <div className="md:col-span-2 flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={items[point].key}
                {...stageFade}
                className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm w-full"
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

                <div className="mt-8 flex flex-wrap gap-3">
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
      </div>

      {/* ===== CTA (section biasa) ===== */}
      <section className="py-20 text-center">
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
      </section>
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
