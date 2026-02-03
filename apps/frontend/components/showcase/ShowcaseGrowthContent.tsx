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

  const headlineMotion = makeCinematicProps(0.21, 0.36);
  const subheadlineMotion = makeCinematicProps(0.45, 0.36);
  const bodyMotion = makeCinematicProps(0.63, 0.34);
  const microlineMotion = makeCinematicProps(0.84, 0.32);

  return (
    <div
      ref={containerRef}
      className="grid items-center gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
    >
      <div className="space-y-5">
        <motion.div {...headlineMotion}>
          <div className="space-y-1">
            {/* Brand label */}
            <p className="font-poppins text-[24px] font-semibold tracking-wide text-[#26658C]">
              AberoAI
            </p>

            {/* Main headline */}
            <h2 className="font-poppins font-medium text-[29px] tracking-tight text-slate-900 md:text-[33px]">
              {t("hero.showcase.headline")}
            </h2>
          </div>
        </motion.div>

        <motion.div {...subheadlineMotion}>
          <p className="font-poppins text-[18px] leading-relaxed text-slate-700 md:text-[20px] md:max-w-xl">
            {t("hero.showcase.sub")}
          </p>
        </motion.div>

        <motion.div {...bodyMotion}>
          <p className="font-poppins text-sm leading-relaxed text-slate-700 md:text-base md:max-w-2xl">
            {t("hero.showcase.body")}
          </p>
        </motion.div>

        <motion.div {...microlineMotion}>
          <p className="font-poppins text-[13px] leading-relaxed text-slate-400 md:max-w-md">
            {t("hero.showcase.microline")}
          </p>
        </motion.div>
      </div>

      {/* Kolom kanan dibiarkan kosong untuk menjaga komposisi & whitespace */}
      <div />
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
