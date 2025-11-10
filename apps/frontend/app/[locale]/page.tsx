"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import HeroRings from "@/components/hero/HeroRings";
import ScrollHint from "@/components/hero/ScrollHint";
import PinnedClusterSection, {
  type PinnedStep,
} from "@/components/sections/PinnedClusterSection";

export default function LocaleHomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const isEn = locale === "en";
  const isTr = locale === "tr";
  const brandBlue = "#26658C";

  const prefersReducedMotion = useReducedMotion();

  const heroDuration = prefersReducedMotion ? 0 : 0.55;
  const subDuration = prefersReducedMotion ? 0 : 0.45;

  const heroDelay = 0;
  const subDelay = prefersReducedMotion ? 0 : heroDelay + heroDuration + 0.12;
  const scrollDelay = prefersReducedMotion ? 0 : subDelay + subDuration + 0.18;

  // Helper: paksa fallback jika next-intl mengembalikan key mentah
  const tt = (key: string, defaultMessage: string): string => {
    const value = t(key, { defaultMessage });
    if (!value || value === key) return defaultMessage;
    return value;
  };

  const renderHeadline = () => {
    if (isEn) {
      const line1 = t("hero.headlineLine1");
      const highlight = "Over 65%";
      const rest = line1.slice(highlight.length);
      return (
        <>
          <span style={{ color: brandBlue }}>{highlight}</span>
          {rest}
          <br />
          {t("hero.headlineLine2")}
        </>
      );
    }

    if (isTr) {
      const full = t("hero.headline");
      const target = "%65";
      const idx = full.indexOf(target);
      if (idx === -1) return <>{full}</>;
      const before = full.slice(0, idx);
      const after = full.slice(idx + target.length);
      return (
        <>
          {before}
          <span style={{ color: brandBlue }}>{target}</span>
          {after}
        </>
      );
    }

    return <>{t("hero.headline")}</>;
  };

  const aboutTitle = tt(
    "about.title",
    "Engineered for real operations. Built for trust."
  );

  const aboutSubtitle = tt(
    "about.subtitle",
    "AberoAI centralizes WhatsApp, AI, and your internal workflows into one reliable, scalable layer designed for clinics, hospitality, and high-touch services that cannot afford chaos."
  );

  const aboutPoints: string[] = [
    tt(
      "about.point1",
      "24/7 multilingual AI agents with safe human handoff — no leads lost at 2 AM."
    ),
    tt(
      "about.point2",
      "Booking, follow-up, and after-care flows structured for real operations, not just chatbot demos."
    ),
    tt(
      "about.point3",
      "Enterprise-grade architecture: secure, modular, and ready to scale across locations & teams."
    ),
  ];

  const pinnedSteps: [PinnedStep, PinnedStep, PinnedStep] = [
    {
      id: "ops-layer",
      label: "01 • OPERATIONAL LAYER",
      title: tt(
        "pinned.step1.title",
        "A single, reliable layer for real operations."
      ),
      body: tt(
        "pinned.step1.body",
        "AberoAI sits between WhatsApp, your teams, and your tools to standardize how leads, patients, and guests are handled — no more chaos in shared inboxes or personal numbers."
      ),
      bullets: aboutPoints,
    },
    {
      id: "ai-layer",
      label: "02 • AI WORKFLOWS",
      title: tt(
        "pinned.step2.title",
        "AI that follows your playbook, not random scripts."
      ),
      body: tt(
        "pinned.step2.body",
        "24/7 multilingual AI agents built around real clinic and hospitality workflows: qualification, booking, pre-op, post-op, follow-ups — always with safe human handoff."
      ),
      bullets: [
        tt(
          "pinned.step2.bullet1",
          "Structured lead qualification & booking flows."
        ),
        tt(
          "pinned.step2.bullet2",
          "Consistent answers trained on your policies."
        ),
        tt(
          "pinned.step2.bullet3",
          "Instant escalation to humans with full context."
        ),
        tt(
          "pinned.step2.bullet4",
          "Built on stable AI infrastructure, no fragile hacks."
        ),
      ],
    },
    {
      id: "retention-layer",
      label: "03 • RETENTION & SCALE",
      title: tt(
        "pinned.step3.title",
        "Retention, performance, and compliance — across locations."
      ),
      body: tt(
        "pinned.step3.body",
        "AberoAI turns WhatsApp conversations into structured data: who booked, who converted, who returned, and which flows perform — so you can scale with confidence."
      ),
      bullets: [
        tt(
          "pinned.step3.bullet1",
          "Multi-location & per-clinic visibility."
        ),
        tt(
          "pinned.step3.bullet2",
          "Conversion, response time, and follow-up insights in one place."
        ),
        tt(
          "pinned.step3.bullet3",
          "Audit-friendly history for regulated industries."
        ),
        tt(
          "pinned.step3.bullet4",
          "Foundation for future products on the same data layer."
        ),
      ],
    },
  ];

  const pinnedFooterNote = tt(
    "pinned.footerNote",
    "Scroll to see how AberoAI connects operations, AI workflows, and long-term retention in one structured system."
  );

  return (
    <main className="relative overflow-hidden bg-white">
      <HeroRings />

      {/* PAGE 0: Hero section */}
      <section className="relative z-10 mx-auto flex min-h-[75vh] md:min-h-[80vh] items-center max-w-6xl px-4 lg:px-6">
        <div className="max-w-3xl -mt-[7px]">
          {/* Headline */}
          <motion.h1
            initial={
              prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 18 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: heroDuration,
              delay: heroDelay,
              ease: "easeOut",
            }}
            className="text-4xl md:text-5xl font-semibold text-[#585858]"
          >
            {renderHeadline()}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={
              prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 14 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: subDuration,
              delay: subDelay,
              ease: "easeOut",
            }}
            className={
              isTr
                ? "mt-6 text-[16px] leading-relaxed text-black/70"
                : "mt-4 text-[16px] text-black/70"
            }
          >
            {t("home.subHeadline")}
          </motion.p>
        </div>

        <div className="hidden flex-1 lg:block" />

        {/* ScrollHint hanya milik hero (PAGE 0) */}
        <motion.div
          className="pointer-events-auto absolute inset-x-0 bottom-6 md:bottom-8 flex justify-center"
          initial={
            prefersReducedMotion
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 6 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.5,
            delay: scrollDelay,
            ease: "easeOut",
          }}
        >
          <ScrollHint targetId="page-1" />
        </motion.div>
      </section>

      {/* SPACER tipis antara Hero & pinned cluster */}
      <div aria-hidden="true" className="h-[6vh] bg-white" />

      {/* PAGE 1-3: Pinned Cluster (case AboutShowcase + 3 step) */}
      <PinnedClusterSection
        sectionId="page-1"
        kicker={tt(
          "pinned.kicker",
          "Engineered for real operations. Built for trust."
        )}
        title={aboutTitle}
        subtitle={aboutSubtitle}
        steps={pinnedSteps}
        footerNote={pinnedFooterNote}
      />

      {/* Setelah ini: lanjut sections lain dengan continuous scroll biasa */}
    </main>
  );
}
