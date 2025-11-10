"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import AboutShowcase from "@/components/about/AboutShowcase";

type PinnedClusterSectionProps = {
  sectionId?: string;
};

/**
 * PinnedClusterSection
 *
 * Cluster 3-step pinned:
 * - Wrapper internal: h-[320vh] = ruang scroll untuk 3 step.
 * - Sticky card: top-0 h-screen → tetap di viewport selama cluster.
 *
 * Catatan agar sticky berfungsi:
 * - Jangan ada ancestor dengan:
 *   - overflow-y: hidden/auto/scroll (selain window utama)
 *   - transform / translate / scale / rotate / perspective
 *   - contain: layout/paint
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

  // === Reduced motion: versi statis ===
  if (prefersReducedMotion) {
    return (
      <section
        id={sectionId}
        className="relative bg-white py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <AboutShowcase aria-label="AberoAI layers">
            <div className="flex flex-col gap-8 px-6 md:px-10 py-10">
              <StaticStep
                title="01 • Operational Layer"
                body="Your reliable base for structured, repeatable day-to-day operations."
              />
              <StaticStep
                title="02 • AI Workflow Layer"
                body="AI that follows your playbook: flows for leads, booking, care, and escalation."
              />
              <StaticStep
                title="03 • Retention Layer"
                body="Insights and follow-ups that keep patients and guests coming back."
              />
            </div>
          </AboutShowcase>
        </div>
      </section>
    );
  }

  // === Normal mode: pinned cluster ===
  return (
    <section
      id={sectionId}
      className="relative bg-white"
    >
      {/* Wrapper tinggi → ruang scroll cluster */}
      <div
        ref={containerRef}
        className="relative h-[320vh]"
      >
        {/* Elemen sticky */}
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto w-full max-w-6xl px-4 lg:px-6">
            <AboutShowcase
              aria-label="AberoAI layers"
              className="relative flex items-center justify-center"
            >
              <div className="relative w-full h-[320px] md:h-[420px] lg:h-[460px] overflow-hidden">
                {/* STEP 1 */}
                <motion.div
                  style={{ opacity: s1Opacity, y: s1Y }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <StepContent
                    title="01 • Operational Layer"
                    body="One stable, shared layer for handling every WhatsApp message with the same discipline as your in-clinic operations."
                  />
                </motion.div>

                {/* STEP 2 */}
                <motion.div
                  style={{ opacity: s2Opacity, y: s2Y }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <StepContent
                    title="02 • AI Workflow Layer"
                    body="AI agents that follow your SOPs end-to-end: triage, qualification, booking, reminders, and safe human handoff."
                  />
                </motion.div>

                {/* STEP 3 */}
                <motion.div
                  style={{ opacity: s3Opacity, y: s3Y }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <StepContent
                    title="03 • Retention Layer"
                    body="Structured data and loops for reactivation, after-care, and multi-location insight — so growth is controlled, not chaotic."
                  />
                </motion.div>
              </div>
            </AboutShowcase>
          </div>
        </div>
      </div>
    </section>
  );
}

type StepContentProps = {
  title: string;
  body: string;
};

function StepContent({ title, body }: StepContentProps) {
  return (
    <div className="max-w-3xl text-center">
      <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">
        {title}
      </h3>
      <p className="mt-3 text-sm md:text-base text-slate-700 leading-relaxed">
        {body}
      </p>
    </div>
  );
}

function StaticStep({ title, body }: StepContentProps) {
  return (
    <div className="max-w-3xl">
      <h3 className="text-lg md:text-xl font-semibold text-slate-900">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-700 leading-relaxed">
        {body}
      </p>
    </div>
  );
}
