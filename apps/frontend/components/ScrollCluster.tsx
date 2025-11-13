"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import AboutShowcase from "@/components/about/AboutShowcase";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollCluster() {
  const clusterRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

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

        // State internal
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
        };

        // State awal: selalu mulai dari Step 0
        showStep(0);

        const totalSegments = Math.max(stepsCount - 1, 1);
        const endValue = `+=${totalSegments * 100}%`;

        const snapPoints =
          stepsCount > 1
            ? steps.map((_, i) => i / totalSegments)
            : [0];

        // ✅ FIX TYPESCRIPT:
        // Kalau stepsCount <= 1, kita set snapConfig = undefined
        // (bukan false) supaya tipe cocok dengan definisi GSAP.
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
        className="scroll-cluster-layer relative flex min-h-[100vh] items-start justify-center px-4 pt-24 pb-16 md:pt-32 md:pb-24 lg:px-6"
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

        {/* Page indicator: 01 / 03 */}
        <div className="pointer-events-none absolute bottom-6 right-6 text-[11px] tracking-[0.28em] uppercase text-slate-500/80 md:bottom-8 md:right-10">
          <span className="font-semibold">01</span>
          <span className="mx-1 text-slate-400/80">/</span>
          <span className="text-slate-400/80">03</span>
        </div>
      </div>

      {/* PAGE-2: Social Proof / Use Cases */}
      <div
        id="page-2"
        data-step="2"
        className="scroll-cluster-layer relative flex min-h-[100vh] items-start justify-center px-4 pt-24 pb-16 md:pt-32 md:pb-24 lg:px-6"
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

        {/* Page indicator: 02 / 03 */}
        <div className="pointer-events-none absolute bottom-6 right-6 text-[11px] tracking-[0.28em] uppercase text-slate-500/80 md:bottom-8 md:right-10">
          <span className="font-semibold">02</span>
          <span className="mx-1 text-slate-400/80">/</span>
          <span className="text-slate-400/80">03</span>
        </div>
      </div>

      {/* PAGE-3: CTA / Action */}
      <div
        id="page-3"
        data-step="3"
        className="scroll-cluster-layer relative flex min-h-[100vh] items-start justify-center px-4 pt-24 pb-16 md:pt-32 md:pb-24 lg:px-6"
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

        {/* Page indicator: 03 / 03 */}
        <div className="pointer-events-none absolute bottom-6 right-6 text-[11px] tracking-[0.28em] uppercase text-slate-500/80 md:bottom-8 md:right-10">
          <span className="font-semibold">03</span>
          <span className="mx-1 text-slate-400/80">/</span>
          <span className="text-slate-400/80">03</span>
        </div>
      </div>
    </section>
  );
}
