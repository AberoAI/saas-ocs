// apps/frontend/components/sections/PinnedClusterSection.tsx
"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

export type PinnedStep = {
  id: string;
  label: string;
  title: string;
  body: string;
  bullets?: string[];
};

type PinnedClusterSectionProps = {
  sectionId?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  steps: [PinnedStep, PinnedStep, PinnedStep]; // fix: enforce exactly 3 steps
  footerNote?: string;
};

/**
 * PinnedClusterSection
 *
 * - Outer: tinggi multipel viewport → ruang scroll.
 * - Inner: sticky full viewport → layout terasa tetap, konten berubah.
 * - 3 step (operations, AI, retention) cross-fade + slide.
 * - Respek prefers-reduced-motion → fallback statis tanpa pinned agresif.
 */
export default function PinnedClusterSection({
  sectionId = "page-1",
  kicker,
  title,
  subtitle,
  steps,
  footerNote,
}: PinnedClusterSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Hooks HARUS selalu dipanggil, tidak boleh hanya di cabang tertentu.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Mapping progress → opacity + posisi (dipakai di mode non-reduced)
  const s1Opacity = useTransform(scrollYProgress, [0.0, 0.18, 0.34], [1, 1, 0]);
  const s1Y = useTransform(scrollYProgress, [0.0, 0.18, 0.34], [0, 0, -22]);

  const s2Opacity = useTransform(scrollYProgress, [0.18, 0.38, 0.66], [0, 1, 0]);
  const s2Y = useTransform(scrollYProgress, [0.18, 0.38, 0.66], [22, 0, -22]);

  const s3Opacity = useTransform(scrollYProgress, [0.5, 0.76, 1.0], [0, 1, 1]);
  const s3Y = useTransform(scrollYProgress, [0.5, 0.76, 1.0], [22, 0, 0]);

  const [step1, step2, step3] = steps;

  // ==== Reduced Motion: versi statis, tanpa pinned animasi ====
  if (prefersReducedMotion) {
    return (
      <section
        id={sectionId}
        className="relative bg-white py-16 md:py-20"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 lg:px-6">
          <HeaderBlock kicker={kicker} title={title} subtitle={subtitle} />

          <div className="grid gap-6">
            <StaticStepBlock step={step1} />
            <StaticStepBlock step={step2} />
            <StaticStepBlock step={step3} />
          </div>

          {footerNote && (
            <p className="mt-4 text-[10px] md:text-xs text-slate-500">
              {footerNote}
            </p>
          )}
        </div>
      </section>
    );
  }

  // ==== Normal Mode: pinned + scroll-driven transition ====
  return (
    <section
      id={sectionId}
      ref={containerRef}
      className="relative bg-white h-[320vh]"
    >
      {/* Sticky viewport container (navbar offset sudah di-handle di layout dengan pt-[72px]) */}
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 lg:px-6">
          <HeaderBlock kicker={kicker} title={title} subtitle={subtitle} />

          {/* Layered steps */}
          <div className="relative mt-6 min-h-[300px] md:min-h-[340px] lg:min-h-[360px]">
            {/* STEP 1 */}
            <motion.div
              style={{ opacity: s1Opacity, y: s1Y }}
              className="absolute inset-0"
            >
              <StepCard step={step1} />
            </motion.div>

            {/* STEP 2 */}
            <motion.div
              style={{ opacity: s2Opacity, y: s2Y }}
              className="absolute inset-0"
            >
              <StepCard step={step2} />
            </motion.div>

            {/* STEP 3 */}
            <motion.div
              style={{ opacity: s3Opacity, y: s3Y }}
              className="absolute inset-0"
            >
              <StepCard step={step3} />
            </motion.div>
          </div>

          {footerNote && (
            <div className="mt-6 text-[10px] md:text-xs text-slate-500">
              {footerNote}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

type HeaderBlockProps = {
  kicker?: string;
  title: string;
  subtitle?: string;
};

function HeaderBlock({ kicker, title, subtitle }: HeaderBlockProps) {
  return (
    <div className="max-w-4xl space-y-2">
      {kicker && (
        <p className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.18em] text-[#26658C]">
          {kicker}
        </p>
      )}
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs md:text-sm text-slate-700">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function StepCard({ step }: { step: PinnedStep }) {
  return (
    <div
      className={[
        "grid h-full w-full items-start gap-4 md:gap-6",
        "md:grid-cols-[0.22fr,1fr]",
        "rounded-3xl bg-white/92 backdrop-blur-sm",
        "shadow-sm ring-1 ring-slate-200/85",
        "px-4 py-4 md:px-6 md:py-6",
      ].join(" ")}
    >
      <div className="flex flex-col gap-1">
        <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.20em] text-slate-500">
          {step.label}
        </span>
        <div className="h-[2px] w-8 bg-[#26658C]" />
      </div>

      <div>
        <h3 className="text-sm md:text-lg font-semibold text-slate-900">
          {step.title}
        </h3>
        <p className="mt-2 text-[11px] md:text-[13px] leading-relaxed text-slate-700">
          {step.body}
        </p>

        {step.bullets && step.bullets.length > 0 && (
          <ul className="mt-3 grid gap-2 text-[10px] md:text-[12px] text-slate-800/90 md:grid-cols-2">
            {step.bullets.map((item, idx) => (
              <li
                key={idx}
                className="rounded-2xl bg-white/96 px-3 py-2 ring-1 ring-slate-200"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StaticStepBlock({ step }: { step: PinnedStep }) {
  return (
    <div className="rounded-3xl bg-white/96 px-4 py-4 md:px-6 md:py-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center gap-3">
        <span className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.20em] text-slate-500">
          {step.label}
        </span>
        <div className="h-[1px] w-8 bg-[#26658C]" />
      </div>
      <h3 className="mt-2 text-sm md:text-lg font-semibold text-slate-900">
        {step.title}
      </h3>
      <p className="mt-2 text-[11px] md:text-[13px] text-slate-700">
        {step.body}
      </p>
      {step.bullets && step.bullets.length > 0 && (
        <ul className="mt-3 grid gap-2 text-[10px] md:text-[12px] text-slate-800/90 md:grid-cols-2">
          {step.bullets.map((item, idx) => (
            <li
              key={idx}
              className="rounded-2xl bg-white/96 px-3 py-2 ring-1 ring-slate-200"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
