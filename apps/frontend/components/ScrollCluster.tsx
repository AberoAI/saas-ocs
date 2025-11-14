"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import AboutShowcase from "@/components/about/AboutShowcase";

gsap.registerPlugin(ScrollTrigger);

type StepProgressProps = {
  currentStep: number; // 0-based
  totalSteps: number;
};

function StepProgressIndicator({ currentStep, totalSteps }: StepProgressProps) {
  if (totalSteps <= 1) return null;

  const segments = Array.from({ length: totalSteps }, (_, i) => i);

  return (
    <div className="flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase text-slate-500/80">
      {/* Segmented line */}
      <div className="flex items-center gap-1">
        {segments.map((i) => {
          const isActive = i === currentStep;
          return (
            <span
              key={i}
              className={[
                "rounded-full bg-slate-300/70 transition-all duration-200 ease-out",
                isActive
                  ? "h-[2px] w-8 md:w-10 bg-[#26658C]"
                  : "h-[1px] w-4 md:w-5 opacity-60",
              ].join(" ")}
            />
          );
        })}
      </div>

      {/* Numeric indicator 01 / 03 */}
      <div className="flex items-center">
        <span className="font-semibold">
          {String(currentStep + 1).padStart(2, "0")}
        </span>
        <span className="mx-1 text-slate-400/80">/</span>
        <span className="text-slate-400/80">
          {String(totalSteps).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export default function ScrollCluster() {
  const clusterRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // State UI untuk indicator (tidak mengubah logic GSAP, hanya mirroring)
  const [activeStep, setActiveStep] = useState(0); // 0-based
  const [totalSteps, setTotalSteps] = useState(3);

  useEffect(() => {
    if (prefersReducedMotion) {
      // Fallback: jika user minta reduced motion, jangan pakai pin / animasi.
      return;
    }

    const cluster = clusterRef.current;
    if (!cluster) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      // Desktop only (min-width: 768px)
      mm.add("(min-width: 768px)", () => {
        // Ambil semua step berdasarkan atribut deklaratif
        const steps = Array.from(
          cluster.querySelectorAll<HTMLElement>("[data-step]")
        );

        const stepsCount = steps.length;
        if (stepsCount === 0) return;

        // Update totalSteps untuk indicator (scalable jika step ditambah)
        setTotalSteps(stepsCount);

        // State internal GSAP
        let currentStep = -1;

        const clamp = (value: number, min: number, max: number) =>
          Math.min(Math.max(value, min), max);

        const showStep = (index: number) => {
          const safeIndex = clamp(index, 0, stepsCount - 1);
          if (safeIndex === currentStep) return;
          currentStep = safeIndex;

          steps.forEach((el, i) => {
            gsap.set(el, {
              autoAlpha: i === safeIndex ? 1 : 0,
            });
          });

          // Mirror ke React state untuk UI indicator (tidak mengubah behavior GSAP)
          setActiveStep(safeIndex);
        };

        // State awal: selalu mulai dari Step 0
        showStep(0);

        const totalSegments = Math.max(stepsCount - 1, 1);
        const endValue = `+=${totalSegments * 100}%`;

        const snapPoints =
          stepsCount > 1
            ? steps.map((_, i) => i / totalSegments)
            : [0];

        const snapConfig =
          stepsCount > 1
            ? {
                snapTo: snapPoints,
                duration: 0.3,
                ease: "power1.out",
              }
            : undefined;

        ScrollTrigger.create({
          trigger: cluster,
          start: "top top",
          end: endValue,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const raw = self.progress * totalSegments;
            const stepIndex = Math.round(raw);
            showStep(stepIndex);
          },
          snap: snapConfig,
        });
      });
    }, clusterRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={clusterRef}
      className="scroll-cluster relative bg-white"
    >
      {/* PAGE-1: Value Promise / Hook */}
      <div
        id="page-1"
        data-step="1"
        className="scroll-cluster-layer relative flex min-h-[100vh] items-start justify-center px-4 pt-10 pb-8 md:pt-16 md:pb-14 lg:px-6"
      >
        <div className="mx-auto w-full max-w-6xl">
          <AboutShowcase aria-label="AberoAI • Value Promise">
            <div className="mx-auto max-w-3xl py-12 text-center md:py-16">
              <p className="mb-3 text-sm uppercase tracking-[0.2em] text-slate-500">
                STEP 01 • VALUE PROMISE
              </p>
              <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
                Turn chaotic WhatsApp chats into one disciplined operations
                layer.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-700 md:text-base">
                AberoAI centralizes all conversations across your clinics or
                locations, so every patient or guest is handled with the same
                predictable standard — even during peak hours.
              </p>
            </div>
          </AboutShowcase>
        </div>

        {/* Step indicator: LINE + 01 / 03 */}
        <div className="pointer-events-none absolute bottom-6 right-6 md:bottom-8 md:right-10">
          <StepProgressIndicator
            currentStep={activeStep}
            totalSteps={totalSteps}
          />
        </div>
      </div>

      {/* PAGE-2: Social Proof / Use Cases */}
      <div
        id="page-2"
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

        {/* Step indicator: LINE + 02 / 03 */}
        <div className="pointer-events-none absolute bottom-6 right-6 md:bottom-8 md:right-10">
          <StepProgressIndicator
            currentStep={activeStep}
            totalSteps={totalSteps}
          />
        </div>
      </div>

      {/* PAGE-3: CTA / Action */}
      <div
        id="page-3"
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

        {/* Step indicator: LINE + 03 / 03 */}
        <div className="pointer-events-none absolute bottom-6 right-6 md:bottom-8 md:right-10">
          <StepProgressIndicator
            currentStep={activeStep}
            totalSteps={totalSteps}
          />
        </div>
      </div>
    </section>
  );
}
