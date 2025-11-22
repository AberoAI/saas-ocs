// apps/frontend/components/showcase/ShowcaseGrowthContent.tsx

"use client";

import {
  motion,
  useReducedMotion,
  useInView,
  type Transition,
} from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import FloatingForegroundBubbles from "./FloatingForegroundBubbles";
import FloatingBackgroundBubbles from "./FloatingBackgroundBubbles";

export function ShowcaseGrowthInner() {
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: "-18% 0px -18% 0px",
  });

  const makeCinematicProps = (delay: number, duration: number) => {
    if (shouldReduceMotion) {
      return {
        initial: undefined,
        animate: undefined,
        transition: undefined as Transition | undefined,
      };
    }

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

  // ✅ DELAY 1.5x dari versi sebelumnya
  const headlineMotion = makeCinematicProps(0.21, 0.36);
  const subheadlineMotion = makeCinematicProps(0.45, 0.36);
  const ctaMotion = makeCinematicProps(0.63, 0.34);
  const trustMotion = makeCinematicProps(0.84, 0.32);

  return (
    <div
      ref={containerRef}
      className="grid items-center gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <motion.div {...headlineMotion}>
            <h2 className="font-poppins font-medium text-xl tracking-tight text-slate-900 md:text-2xl">
              {t("hero.showcase.headline")}
            </h2>
          </motion.div>

          <motion.div {...subheadlineMotion}>
            <p className="font-poppins text-sm leading-relaxed text-slate-600 md:max-w-md">
              {t("hero.showcase.sub")}
            </p>
          </motion.div>
        </div>

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
              {t("cta.secondary")}
            </button>
          </motion.div>

          <motion.div {...trustMotion}>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span>• {t("misc.cancelAnytime")}</span>
              <span>• {t("misc.noCreditCard")}</span>
            </div>
          </motion.div>
        </div>
      </div>

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
