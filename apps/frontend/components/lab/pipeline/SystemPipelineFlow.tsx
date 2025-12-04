// apps/frontend/components/lab/pipeline/SystemPipelineFlow.tsx
"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const STEPS = [
  "Patient Messages",
  "AI Intake & Router",
  "Context Memory Layer",
  "Aftercare Engine",
  "Clinic Dashboard",
] as const;

// Intro: jarak muncul antar step (detik)
const INTRO_STEP_DELAY = 0.6;

// Loop: total waktu 1 cycle dari kiri → kanan (detik)
const LOOP_TOTAL_DURATION = 8;
const LOOP_STEP_INTERVAL_MS =
  (LOOP_TOTAL_DURATION * 1000) / STEPS.length;

export default function SystemPipelineFlow() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: "-20% 0px -20% 0px",
  });

  const prefersReducedMotion = useReducedMotion();

  // Berapa banyak step yang sudah muncul (intro)
  const [visibleCount, setVisibleCount] = useState(1);
  // Step yang sedang jadi fokus (setelah intro)
  const [activeIndex, setActiveIndex] = useState(0);
  const [isIntroDone, setIsIntroDone] = useState(false);

  // Intro sequence: step muncul satu per satu
  useEffect(() => {
    if (!isInView || prefersReducedMotion || isIntroDone) return;

    const intervalId = window.setInterval(() => {
      setVisibleCount((prev) => {
        const next = Math.min(prev + 1, STEPS.length);
        if (next === STEPS.length) {
          setIsIntroDone(true);
          window.clearInterval(intervalId);
        }
        return next;
      });
    }, INTRO_STEP_DELAY * 1000);

    return () => window.clearInterval(intervalId);
  }, [isInView, prefersReducedMotion, isIntroDone]);

  // Loop highlight setelah intro selesai
  useEffect(() => {
    if (!isIntroDone || prefersReducedMotion) return;

    const loopId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STEPS.length);
    }, LOOP_STEP_INTERVAL_MS);

    return () => window.clearInterval(loopId);
  }, [isIntroDone, prefersReducedMotion]);

  // Selama intro, fokus = step terakhir yang baru muncul
  const currentActiveIndex = isIntroDone
    ? activeIndex
    : Math.min(visibleCount - 1, STEPS.length - 1);

  // Progress line 0 → 100% berdasarkan step aktif
  const progress =
    STEPS.length > 1 ? currentActiveIndex / (STEPS.length - 1) : 0;
  const progressPercent = progress * 100;

  return (
    <section
      ref={containerRef}
      className="w-full bg-slate-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white/80 p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          Patient Communication Pipeline
        </p>

        <div className="relative mt-6 sm:mt-8">
          {/* Backbone line (static) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-4 sm:inset-x-8 top-1/2 h-px -translate-y-1/2 bg-slate-200"
          />

          {/* Progress line + arrow yang bergerak */}
          {!prefersReducedMotion && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-4 sm:inset-x-8 top-1/2 -translate-y-1/2"
            >
              {/* progress segment */}
              <motion.div
                className="h-[2px] bg-[#26658C]"
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercent}%` }}
                transition={{
                  duration: LOOP_STEP_INTERVAL_MS / 1000,
                  ease: "easeInOut",
                }}
              />

              {/* arrow head kecil di ujung progress */}
              <motion.div
                className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 rounded-[2px] bg-[#26658C]"
                initial={{ left: "0%" }}
                animate={{ left: `${progressPercent}%` }}
                transition={{
                  duration: LOOP_STEP_INTERVAL_MS / 1000,
                  ease: "easeInOut",
                }}
              />
            </div>
          )}

          {/* Cards: muncul satu per satu, fokus berpindah */}
          <div className="relative z-[1] flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-between">
            {STEPS.map((label, index) => {
              const isVisible = index < visibleCount;
              const isActive = index === currentActiveIndex;

              if (!isVisible && !prefersReducedMotion) {
                // Belum masuk intro: jangan render dulu
                return (
                  <div key={label} className="flex-1" aria-hidden />
                );
              }

              return (
                <motion.div
                  key={label}
                  initial={
                    prefersReducedMotion
                      ? undefined
                      : { opacity: 0, y: 24, scale: 0.98 }
                  }
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          opacity: isVisible ? 1 : 0,
                          y: isVisible ? 0 : 24,
                          scale: isActive ? 1.02 : 1,
                        }
                  }
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  className={[
                    "flex-1 rounded-2xl border px-4 py-3 text-center text-xs font-medium sm:text-sm",
                    "bg-white text-slate-700 shadow-sm backdrop-blur-sm",
                    "transition-all duration-300",
                    isActive
                      ? "border-[#26658C] shadow-md shadow-[#26658C]/14 ring-1 ring-[#26658C]/25 opacity-100"
                      : "border-slate-200 opacity-45",
                  ].join(" ")}
                >
                  <span className="block">{label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
