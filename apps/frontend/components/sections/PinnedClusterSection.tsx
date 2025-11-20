// apps/frontend/components/sections/PinnedClusterSection.tsx

"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import AboutShowcase from "@/components/about/AboutShowcase";
import { ShowcaseGrowthInner } from "@/components/showcase/ShowcaseGrowthContent";

type PinnedClusterSectionProps = {
  sectionId?: string;
};

/**
 * PinnedClusterSection
 *
 * Framer Motion–based pinned storytelling cluster:
 * - Normal mode (prefersReducedMotion = false):
 *   - Pinned 3-step cluster di SEMUA breakpoint (mobile & desktop):
 *     01 • Operational Layer  → ShowcaseGrowthInner (operations & growth)
 *     02 • AI Workflow Layer  → AI agents following SOPs
 *     03 • Retention Layer    → Reactivation & multi-location insight
 *
 * - Aksesibilitas:
 *   - Kalau prefers-reduced-motion = true → FULLY static stacked layout
 *     (tanpa pinned, tanpa scroll-based animation).
 */
export default function PinnedClusterSection({
  sectionId = "page-1",
}: PinnedClusterSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  // === FULL STATIC MODE (aksesibilitas) ===
  if (prefersReducedMotion) {
    return (
      <section
        id={sectionId}
        className="relative bg-white py-16 md:py-20"
      >
        <StaticClusterBody />
      </section>
    );
  }

  // === NORMAL MODE (pinned aktif di semua breakpoint) ===
  return (
    <section id={sectionId} className="relative bg-white">
      <PinnedClusterDesktop />
    </section>
  );
}

/**
 * PinnedClusterDesktop
 *
 * Dipakai saat prefersReducedMotion = false di semua ukuran layar.
 * Menggunakan:
 * - containerRef dengan tinggi h-[320vh] sebagai area scroll
 * - div sticky top-0 h-screen sebagai kartu yang dipin
 * - Framer Motion useScroll + useTransform untuk transisi antar step.
 */
function PinnedClusterDesktop() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // STEP 1 (Operational Layer)
  const s1Opacity = useTransform(
    scrollYProgress,
    [0.0, 0.16, 0.30],
    [1, 1, 0]
  );
  const s1Y = useTransform(
    scrollYProgress,
    [0.0, 0.16, 0.30],
    ["0%", "0%", "-18%"]
  );

  // STEP 2 (AI Workflow Layer)
  const s2Opacity = useTransform(
    scrollYProgress,
    [0.24, 0.40, 0.64],
    [0, 1, 0]
  );
  const s2Y = useTransform(
    scrollYProgress,
    [0.24, 0.40, 0.64],
    ["18%", "0%", "-18%"]
  );

  // STEP 3 (Retention Layer)
  const s3Opacity = useTransform(
    scrollYProgress,
    [0.58, 0.74, 1.0],
    [0, 1, 1]
  );
  const s3Y = useTransform(
    scrollYProgress,
    [0.58, 0.74, 1.0],
    ["18%", "0%", "0%"]
  );

  return (
    <div
      ref={containerRef}
      className="relative h-[320vh]"
    >
      {/* Elemen sticky sepanjang cluster */}
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-6xl px-4 lg:px-6">
          <AboutShowcase
            aria-label="AberoAI layers"
            className="relative flex items-center justify-center"
          >
            <div className="relative h-[360px] w-full overflow-hidden sm:h-[400px] md:h-[420px] lg:h-[460px]">
              {/* STEP 1 — Operational Layer (ShowcaseGrowthInner) */}
              <motion.div
                style={{ opacity: s1Opacity, y: s1Y }}
                className="absolute inset-0 flex items-center justify-center px-4 md:px-10"
              >
                <div className="w-full">
                  <BadgeStep
                    index="01"
                    label="Operational Layer"
                    description="Structured base for high-volume, repeatable day-to-day operations."
                  />
                  <div className="mt-6">
                    <ShowcaseGrowthInner />
                  </div>
                </div>
              </motion.div>

              {/* STEP 2 — AI Workflow Layer */}
              <motion.div
                style={{ opacity: s2Opacity, y: s2Y }}
                className="absolute inset-0 flex items-center justify-center px-4 md:px-10"
              >
                <StepContent
                  title="02 • AI Workflow Layer"
                  body="AI agents that follow your SOPs end-to-end: triage, qualification, booking, reminders, after-care, and safe human handoff — across all your locations."
                />
              </motion.div>

              {/* STEP 3 — Retention Layer */}
              <motion.div
                style={{ opacity: s3Opacity, y: s3Y }}
                className="absolute inset-0 flex items-center justify-center px-4 md:px-10"
              >
                <StepContent
                  title="03 • Retention Layer"
                  body="Structured data and reactivation loops that keep patients and guests coming back — with multi-location insight instead of chaotic spreadsheets and screenshots."
                />
              </motion.div>
            </div>
          </AboutShowcase>
        </div>
      </div>
    </div>
  );
}

type StepContentProps = {
  title: string;
  body: string;
};

function StepContent({ title, body }: StepContentProps) {
  return (
    <div className="max-w-3xl text-center">
      <h3 className="text-2xl font-semibold text-slate-900 md:text-3xl">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
        {body}
      </p>
    </div>
  );
}

function StaticStep({ title, body }: StepContentProps) {
  return (
    <div className="max-w-3xl">
      <h3 className="text-lg font-semibold text-slate-900 md:text-xl">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        {body}
      </p>
    </div>
  );
}

/**
 * StaticClusterBody
 *
 * Dipakai untuk:
 * - prefers-reduced-motion (full static di semua breakpoint)
 *
 * Urutan:
 * 1) Operational Layer → ShowcaseGrowthInner
 * 2) AI Workflow Layer → text step
 * 3) Retention Layer   → text step
 */
function StaticClusterBody() {
  return (
    <div className="mx-auto max-w-6xl px-4 lg:px-6">
      <AboutShowcase aria-label="AberoAI layers">
        <div className="flex flex-col gap-10 px-6 py-10 md:px-10 md:py-12">
          {/* Step 1: Operational Layer (hero-style content) */}
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
              01 • Operational Layer
            </p>
            <p className="max-w-md text-sm leading-relaxed text-slate-600">
              Your reliable base for structured, repeatable day-to-day
              operations across clinics or locations — before AI workflows are
              layered on top.
            </p>
            <ShowcaseGrowthInner />
          </div>

          {/* Step 2: AI Workflow Layer */}
          <StaticStep
            title="02 • AI Workflow Layer"
            body="AI that follows your playbook end-to-end: triage, qualification, booking, reminders, after-care, and escalation to humans when it matters — not a generic FAQ bot."
          />

          {/* Step 3: Retention Layer */}
          <StaticStep
            title="03 • Retention Layer"
            body="Retention and reactivation loops built on real conversation data — so you can see where you’re losing patients or guests, and fix it with targeted follow-ups."
          />
        </div>
      </AboutShowcase>
    </div>
  );
}

type BadgeStepProps = {
  index: string;
  label: string;
  description: string;
};

function BadgeStep({ index, label, description }: BadgeStepProps) {
  return (
    <div className="flex flex-col gap-1 text-left">
      <div className="inline-flex items-center gap-3">
        <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
          {index}
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
          {label}
        </span>
      </div>
      <p className="max-w-md text-[12px] leading-relaxed text-slate-600">
        {description}
      </p>
    </div>
  );
}
