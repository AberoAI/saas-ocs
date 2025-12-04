// apps/frontend/components/ScrollCluster.tsx

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import AboutShowcase from "@/components/about/AboutShowcase";
import { ShowcaseGrowthInner } from "@/components/showcase/ShowcaseGrowthContent";

// Scroll behavior constants for maintainability
// Total scroll length per step (in % of viewport height) while pinned
const SCROLL_CLUSTER_SEGMENT_PERCENT = 70;
// How much of the first segment is "locked" to STEP 0 before transitioning
const FIRST_STEP_LOCK_RATIO = 0.7;

gsap.registerPlugin(ScrollTrigger);

export default function ScrollCluster() {
  const clusterRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const cluster = clusterRef.current;
    if (!cluster) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(min-width: 768px)", () => {
        const steps = Array.from(
          cluster.querySelectorAll<HTMLElement>("[data-step]")
        );
        /**
         * IMPORTANT:
         * - Step index is based on DOM order in `steps` (0, 1, 2, ...)
         * - The `data-step="1|2|3"` attributes are only used as semantic markers
         *   and for styling/debugging in the DOM, not for the logic.
         */

        const stepsCount = steps.length;
        if (stepsCount === 0) return;

        let currentStep = -1;

        const clamp = (value: number, min: number, max: number) =>
          Math.min(Math.max(value, min), max);

        const showStep = (index: number) => {
          const safeIndex = clamp(index, 0, stepsCount - 1);
          if (safeIndex === currentStep) return;
          currentStep = safeIndex;

          steps.forEach((el, i) => {
            gsap.set(el, { autoAlpha: i === safeIndex ? 1 : 0 });
          });
        };

        // Mulai dari STEP 0 (page-3)
        showStep(0);

        // Edge case: hanya 1 step → tetap pin, tapi tanpa kalkulasi segment.
        if (stepsCount === 1) {
          ScrollTrigger.create({
            trigger: cluster,
            start: "top top",
            end: `+=${SCROLL_CLUSTER_SEGMENT_PERCENT}%`,
            pin: true,
            anticipatePin: 1,
            onUpdate: () => {
              showStep(0);
            },
          });
          return;
        }

        // Scroll distance dibuat lebih ringkas & tetap proporsional
        const endValue = `+=${stepsCount * SCROLL_CLUSTER_SEGMENT_PERCENT}%`;

        // FIRST STEP LOCK:
        // Rasio berapa jauh user harus scroll di segment pertama
        // sebelum bisa berpindah dari STEP 0 ke STEP berikutnya.
        ScrollTrigger.create({
          trigger: cluster,
          start: "top top",
          end: endValue,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            /**
             * PENTING:
             * Di sini stepWidth menggunakan (stepsCount - 1),
             * karena yang dibagi ke segmen progres adalah STEP 1..N.
             * Ini membuat transisi dari STEP 0 ke STEP 1 lebih halus,
             * tidak terasa seperti "dipaksa lompat" terlalu cepat.
             */
            const stepWidth = 1 / (stepsCount - 1);
            const lockBoundary = stepWidth * FIRST_STEP_LOCK_RATIO;

            // Selama masih di area awal, paksa selalu STEP 0 (page-3)
            if (self.progress < lockBoundary) {
              showStep(0);
              return;
            }

            // Setelah melewati lockBoundary, distribusikan progres
            // secara rata ke STEP 1..(stepsCount - 1)
            const remainingProgress = 1 - lockBoundary;

            // Hindari pembagian nol (harusnya tidak terjadi karena stepsCount >= 2)
            if (remainingProgress <= 0) {
              showStep(stepsCount - 1);
              return;
            }

            const normalized =
              (self.progress - lockBoundary) / remainingProgress;

            // Clamp ke [0, 1]
            const effectiveProgress = Math.min(Math.max(normalized, 0), 1);

            const raw = effectiveProgress * (stepsCount - 1);
            const stepIndex = Math.min(stepsCount - 1, 1 + Math.floor(raw));

            showStep(stepIndex);
          },
        });
      });
    }, clusterRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section ref={clusterRef} className="scroll-cluster relative bg-white">
      {/* PAGE-3 */}
      <div
        id="page-3"
        data-step="1"
        className="scroll-cluster-layer relative flex min-h-[100vh] items-start justify-center px-4 pt-10 pb-8 md:pt-16 md:pb-14 lg:px-6"
      >
        <div className="mx-auto w-full max-w-6xl">
          <AboutShowcase aria-label="AberoAI • Value Promise">
            <div className="py-10 md:py-14 px-4 md:px-8">
              <ShowcaseGrowthInner />
            </div>
          </AboutShowcase>
        </div>

        <div className="pointer-events-none absolute bottom-6 right-6 text-[11px] tracking-[0.28em] uppercase text-slate-500/80 md:bottom-8 md:right-10">
          <span className="font-semibold">03</span>
          <span className="mx-1 text-slate-400/80">/</span>
          <span className="text-slate-400/80">05</span>
        </div>
      </div>

      {/* PAGE-4 */}
      <div
        id="page-4"
        data-step="2"
        className="scroll-cluster-layer relative flex min-h-[100vh] items-start justify-center px-4 pt-10 pb-8 md:pt-16 md:pb-14 lg:px-6"
      >
        <div className="mx-auto w-full max-w-6xl">
          <AboutShowcase aria-label="AberoAI • Use Cases">
            <div className="mx-auto max-w-3xl py-12 text-center md:py-16">
              <p className="mb-3 text-sm uppercase tracking-[0.2em] text-slate-500">
                STEP 02 • USE CASES
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                AI that actually follows your playbook — from lead to
                after-care.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-700 md:text-base">
                From qualification and booking to reminders and safe human
                handoff, AberoAI runs end-to-end flows that match how your team
                already works — not a generic chatbot script.
              </p>
            </div>
          </AboutShowcase>
        </div>

        <div className="pointer-events-none absolute bottom-6 right-6 text-[11px] tracking-[0.28em] uppercase text-slate-500/80 md:bottom-8 md:right-10">
          <span className="font-semibold">04</span>
          <span className="mx-1 text-slate-400/80">/</span>
          <span className="text-slate-400/80">05</span>
        </div>
      </div>

      {/* PAGE-5 */}
      <div
        id="page-5"
        data-step="3"
        className="scroll-cluster-layer relative flex min-h-[100vh] items-start justify-center px-4 pt-10 pb-8 md:pt-16 md:pb-14 lg:px-6"
      >
        <div className="mx-auto w-full max-w-6xl">
          <AboutShowcase aria-label="AberoAI • Call to Action">
            <div className="mx-auto max-w-3xl py-12 text-center md:py-16">
              <p className="mb-3 text-sm uppercase tracking-[0.2em] text-slate-500">
                STEP 03 • ACTION
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                Start with one WhatsApp number — then scale safely across
                locations.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-700 md:text-base">
                We help you pilot with one unit or brand, validate the flows,
                and then roll out to other branches without losing control over
                quality, data, or patient experience.
              </p>
            </div>
          </AboutShowcase>
        </div>

        <div className="pointer-events-none absolute bottom-6 right-6 text-[11px] tracking-[0.28em] uppercase text-slate-500/80 md:bottom-8 md:right-10">
          <span className="font-semibold">05</span>
          <span className="mx-1 text-slate-400/80">/</span>
          <span className="text-slate-400/80">05</span>
        </div>
      </div>
    </section>
  );
}
