// apps/frontend/components/showcase/ShowcaseGrowthContent.tsx

"use client";

import {
  motion,
  useReducedMotion,
  useInView,
  type Transition,
} from "framer-motion";
import { useRef } from "react";
import FloatingForegroundBubbles from "./FloatingForegroundBubbles";
import FloatingBackgroundBubbles from "./FloatingBackgroundBubbles";

export function ShowcaseGrowthInner() {
  const shouldReduceMotion = useReducedMotion();

  // ⬇️ Container untuk memicu animasi hanya saat page-1 benar-benar masuk viewport
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, {
    once: true,
    // Sedikit lebih ketat: elemen harus lebih "masuk" ke viewport
    // sebelum dianggap in-view → animasi mulai sedikit lebih telat.
    margin: "-18% 0px -18% 0px",
  });

  const makeCinematicProps = (delay: number, duration: number) => {
    // Aksesibilitas: kalau user prefer reduced motion → matikan animasi
    if (shouldReduceMotion) {
      return {
        initial: undefined,
        animate: undefined,
        transition: undefined as Transition | undefined,
      };
    }

    // Sebelum container masuk viewport:
    // elemen tetap dalam posisi "hidden" tapi tanpa animasi transisi
    if (!isInView) {
      return {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 0, y: 18 },
        transition: {
          duration: 0,
          delay: 0,
        } as Transition,
      };
    }

    // Setelah pertama kali in-view → animasi cinematic dijalankan sekali
    return {
      initial: { opacity: 0, y: 18 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration,
        delay,
        ease: "easeOut",
      } as Transition,
    };
  };

  // Dimundurkan sedikit lagi: semua delay +0.06s dari versi sebelumnya
  // → memberi ekstra waktu supaya user benar-benar "landing" di page-1
  const headlineMotion = makeCinematicProps(0.14, 0.36); // muncul dulu, tapi lebih santai
  const subheadlineMotion = makeCinematicProps(0.30, 0.36); // napas kedua
  const ctaMotion = makeCinematicProps(0.42, 0.34); // CTA muncul setelah user sempat baca
  const trustMotion = makeCinematicProps(0.56, 0.32); // subtle di belakang CTA

  return (
    <div
      ref={containerRef}
      className="grid items-center gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
    >
      {/* KIRI: TEKS */}
      <div className="space-y-4">
        <div className="space-y-2">
          {/* HEADLINE — Poppins Medium */}
          <motion.div {...headlineMotion}>
            <h2 className="font-poppins font-medium text-xl tracking-tight text-slate-900 md:text-2xl">
              AberoAI turns every customer chat into measurable growth with AI.
            </h2>
          </motion.div>

          {/* SUBHEADLINE — Poppins Regular */}
          <motion.div {...subheadlineMotion}>
            <p className="font-poppins text-sm leading-relaxed text-slate-600 md:max-w-md">
              Manage thousands of conversations effortlessly and never lose
              another customer again — across all your clinics or locations.
            </p>
          </motion.div>
        </div>

        {/* CTA + TRUST COPY */}
        <div className="flex flex-col items-start gap-2">
          <motion.div {...ctaMotion}>
            <button
              type="button"
              className="
                inline-flex items-center justify-center
                rounded-full
                bg-[#829EC0]
                px-5 py-2
                text-xs font-medium text-white
                shadow-sm
                transition
                hover:bg-[#6f87a7]
                active:translate-y-[1px]
              "
            >
              See demo
            </button>
          </motion.div>

          <motion.div {...trustMotion}>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span>• No sign-up</span>
              <span>• No credit card</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* KANAN: LAYER KEDUA (BACKGROUND) + LAYER PERTAMA (FOREGROUND) */}
      <div className="relative h-64">
        <div className="absolute inset-0">
          <FloatingBackgroundBubbles />
        </div>

        <div className="absolute inset-0">
          <FloatingForegroundBubbles />
        </div>
      </div>
    </div>
  );
}

export default function ShowcaseGrowthContent() {
  return (
    <section>
      <ShowcaseGrowthInner />
    </section>
  );
}
