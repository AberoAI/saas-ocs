// apps/frontend/components/sections/PinnedClusterSection.tsx

"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
} from "framer-motion";
import AboutShowcase from "@/components/about/AboutShowcase";
import { ShowcaseGrowthInner } from "@/components/showcase/ShowcaseGrowthContent";

type PinnedClusterSectionProps = {
  sectionId?: string;
};

/**
 * PinnedClusterSection
 *
 * Framer Motion–based 3-step pinned storytelling cluster.
 *
 * Narasi:
 *  1) Value Promise (ShowcaseGrowthInner)
 *  2) STEP 02 • USE CASES
 *  3) STEP 03 • ACTION
 *
 * Perilaku:
 *  - prefersReducedMotion = true:
 *      → full static, stacked (no pinned), dengan narasi yang sama.
 *  - prefersReducedMotion = false:
 *      → Mobile (base): stacked static (md:hidden)
 *      → Desktop (md+): pinned 3-step (hidden md:block)
 *
 * Catatan agar sticky berfungsi:
 *  - Jangan ada ancestor dengan:
 *    - overflow-y: hidden/auto/scroll (selain window utama)
 *    - transform / translate / scale / rotate / perspective
 *    - contain: layout/paint
 */
export default function PinnedClusterSection({
  sectionId = "page-1",
}: PinnedClusterSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // gunakan seluruh tinggi cluster sebagai timeline
    offset: ["start start", "end end"],
  });

  // STEP 1
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

  // STEP 2
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

  // STEP 3
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

  // === Snap-feel: current step indicator (01 / 02 / 03) ===
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Range dibikin align dengan segment animasi:
    // 0.00–0.30 → step 1
    // 0.30–0.64 → step 2
    // 0.64–1.00 → step 3
    let step: 1 | 2 | 3;
    if (v < 0.30) {
      step = 1;
    } else if (v < 0.64) {
      step = 2;
    } else {
      step = 3;
    }
    setCurrentStep(step);
  });

  // === Reduced motion: full static ===
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

  // === Normal mode: mobile = stacked, desktop = pinned ===
  return (
    <section
      id={sectionId}
      className="relative bg-white"
    >
      {/* MOBILE: stacked static, no pinned */}
      <div className="md:hidden py-16">
        <StaticClusterBody />
      </div>

      {/* DESKTOP: pinned storytelling cluster */}
      <div
        ref={containerRef}
        className="relative hidden h-[320vh] md:block"
      >
        {/* Elemen sticky */}
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto w-full max-w-6xl px-4 lg:px-6">
            <AboutShowcase
              aria-label="AberoAI story"
              className="relative flex items-center justify-center"
            >
              <div className="relative w-full h-[320px] md:h-[420px] lg:h-[460px] overflow-hidden">
                {/* STEP 1 — Value Promise (ShowcaseGrowthInner) */}
                <motion.div
                  style={{ opacity: s1Opacity, y: s1Y }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <ShowcaseGrowthInner />
                </motion.div>

                {/* STEP 2 — Use Cases */}
                <motion.div
                  style={{ opacity: s2Opacity, y: s2Y }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <StepContent
                    eyebrow="STEP 02 • USE CASES"
                    title="AI that actually follows your playbook — from lead to after-care."
                    body="From qualification and booking to reminders and safe human handoff, AberoAI runs end-to-end flows that match how your team already works — not a generic chatbot script."
                  />
                </motion.div>

                {/* STEP 3 — Action / Rollout */}
                <motion.div
                  style={{ opacity: s3Opacity, y: s3Y }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <StepContent
                    eyebrow="STEP 03 • ACTION"
                    title="Start with one WhatsApp number — then scale safely across locations."
                    body="We help you pilot with one unit or brand, validate the flows, and then roll out to other branches without losing control over quality, data, or patient experience."
                  />
                </motion.div>
              </div>

              {/* Indicator kecil 01 / 03 di pojok kanan bawah (desktop pinned only) */}
              <div className="pointer-events-none absolute bottom-6 right-6 text-[11px] tracking-[0.28em] uppercase text-slate-500/80 md:bottom-8 md:right-10">
                <span className="font-semibold">
                  {String(currentStep).padStart(2, "0")}
                </span>
                <span className="mx-1 text-slate-400/80">/</span>
                <span className="text-slate-400/80">03</span>
              </div>
            </AboutShowcase>
          </div>
        </div>
      </div>
    </section>
  );
}

type StepContentProps = {
  eyebrow?: string;
  title: string;
  body: string;
};

function StepContent({ eyebrow, title, body }: StepContentProps) {
  return (
    <div className="max-w-3xl text-center">
      {eyebrow && (
        <p className="mb-3 text-xs md:text-sm uppercase tracking-[0.2em] text-slate-500">
          {eyebrow}
        </p>
      )}
      <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">
        {title}
      </h3>
      <p className="mt-4 text-sm md:text-base text-slate-700 leading-relaxed">
        {body}
      </p>
    </div>
  );
}

/**
 * StaticClusterBody
 *
 * Dipakai untuk:
 *  - prefersReducedMotion = true (full static)
 *  - Mobile (md:hidden) di normal mode
 *
 * Narasi:
 *  1) Value Promise (ShowcaseGrowthInner)
 *  2) Use Cases
 *  3) Action / Rollout
 */
function StaticClusterBody() {
  return (
    <div className="mx-auto max-w-6xl px-4 lg:px-6">
      <AboutShowcase aria-label="AberoAI story">
        <div className="flex flex-col gap-12 px-6 md:px-10 py-10">
          {/* STEP 1 • Value Promise (reuse ShowcaseGrowthInner) */}
          <div className="py-4">
            <ShowcaseGrowthInner />
          </div>

          {/* STEP 2 • Use Cases */}
          <StaticStep
            eyebrow="STEP 02 • USE CASES"
            title="AI that actually follows your playbook — from lead to after-care."
            body="From qualification and booking to reminders and safe human handoff, AberoAI runs end-to-end flows that match how your team already works — not a generic chatbot script."
          />

          {/* STEP 3 • Action / Rollout */}
          <StaticStep
            eyebrow="STEP 03 • ACTION"
            title="Start with one WhatsApp number — then scale safely across locations."
            body="We help you pilot with one unit or brand, validate the flows, and then roll out to other branches without losing control over quality, data, or patient experience."
          />
        </div>
      </AboutShowcase>
    </div>
  );
}

function StaticStep({ eyebrow, title, body }: StepContentProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="mb-2 text-xs md:text-sm uppercase tracking-[0.2em] text-slate-500">
          {eyebrow}
        </p>
      )}
      <h3 className="text-lg md:text-xl font-semibold text-slate-900">
        {title}
      </h3>
      <p className="mt-3 text-sm text-slate-700 leading-relaxed">
        {body}
      </p>
    </div>
  );
}
