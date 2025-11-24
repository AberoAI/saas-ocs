// apps/frontend/components/showcase/FloatingBackgroundBubbles.tsx

"use client";

import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  easeOut,
  type Transition,
} from "framer-motion";
import { useRef } from "react";

export default function LabFloatingBackgroundBubbles() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, {
    once: true,
    margin: "-10% 0px -10% 0px",
  });

  const shouldReduceMotion = useReducedMotion();

  const hiddenState = { opacity: 0, y: 16 };
  const visibleState = { opacity: 1, y: 0 };

  const makeBubbleMotion = (delay: number) => {
    if (shouldReduceMotion) {
      return {
        initial: undefined,
        animate: undefined,
        transition: undefined as Transition | undefined,
      };
    }

    return {
      initial: hiddenState,
      animate: isInView ? visibleState : hiddenState,
      transition: {
        duration: 0.28,
        delay,
        ease: easeOut,
      } as Transition,
    };
  };

  const bubble5 = makeBubbleMotion(0.4);
  const bubble6 = makeBubbleMotion(0.5);
  const bubble7 = makeBubbleMotion(0.6);
  const bubble8 = makeBubbleMotion(0.7);

  return (
    <div className="pointer-events-none relative h-full w-full select-none">
      <div
        ref={containerRef}
        className="
          absolute inset-0
          opacity-[0.45125] md:opacity-[0.406125] lg:opacity-[0.361] xl:opacity-[0.315875]
          blur-[1.05px] md:blur-[1.26px] lg:blur-[1.47px] xl:blur-[1.68px]
        "
      >
        {/* 1) Bubble — Arabic */}
        <motion.div
          className="absolute left-[-1%] top-[9%] flex items-start gap-2"
          initial={bubble5.initial}
          animate={bubble5.animate}
          transition={bubble5.transition}
        >
          <Image
            src="/avatars/5.png"
            alt="Customer avatar 5"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="relative rounded-2xl bg-white px-4 py-2 shadow-[0_26px_70px_rgba(15,23,42,0.16)]">
            <span className="block pr-[29px] text-[13px] text-slate-700">
              هل يمكنني حجز استشارة؟
            </span>
            <span className="absolute bottom-1 right-3 text-[10px] text-slate-400">
              14:06
            </span>
          </div>
        </motion.div>

        {/* 2) Bubble — German */}
        <motion.div
          className="absolute right-[5%] top-[32.5%] flex items-start gap-2"
          initial={bubble6.initial}
          animate={bubble6.animate}
          transition={bubble6.transition}
        >
          <Image
            src="/avatars/6.png"
            alt="Customer avatar 6"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="relative rounded-2xl bg-white px-4 py-2 shadow-[0_26px_70px_rgba(15,23,42,0.16)]">
            <span className="block pr-[29px] text-[13px] text-slate-700">
              Ich möchte mit einem Arzt sprechen
            </span>
            <span className="absolute bottom-1 right-3 text-[10px] text-slate-400">
              11:04
            </span>
          </div>
        </motion.div>

        {/* 3) Bubble — Turkish */}
        <motion.div
          className="absolute left-[-8%] top-[57.1%] flex items-start gap-2"
          initial={bubble7.initial}
          animate={bubble7.animate}
          transition={bubble7.transition}
        >
          <Image
            src="/avatars/7.png"
            alt="Customer avatar 7"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="relative rounded-2xl bg-white px-4 py-2 shadow-[0_26px_70px_rgba(15,23,42,0.16)]">
            <span className="block pr-[29px] text-[13px] text-slate-700">
              Saç ekimi ne kadar?
            </span>
            <span className="absolute bottom-1 right-3 text-[10px] text-slate-400">
              17:08
            </span>
          </div>
        </motion.div>

        {/* 4) Bubble — English (disabled) */}
        {false && (
          <motion.div
            className="absolute right-[13%] top-[82.8%] flex items-start gap-2"
            initial={bubble8.initial}
            animate={bubble8.animate}
            transition={bubble8.transition}
          >
            <Image
              src="/avatars/8.png"
              alt="Customer avatar 8"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="relative rounded-2xl bg-white px-4 py-2 shadow-[0_26px_70px_rgba(15,23,42,0.16)] max-w-[230px] md:max-w-[260px]">
              <span className="block pr-[29px] text-[13px] text-slate-700">
                Do you have a doctor available on Monday?
              </span>
              <span className="absolute bottom-1 right-3 text-[10px] text-slate-400">
                12:00
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
