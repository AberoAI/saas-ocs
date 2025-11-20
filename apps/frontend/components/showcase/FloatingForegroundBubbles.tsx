// apps/frontend/components/showcase/FloatingForegroundBubbles.tsx

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

export default function LabFloatingForegroundBubbles() {
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

  const bubble1 = makeBubbleMotion(0);
  const bubble2 = makeBubbleMotion(0.1);
  const bubble3 = makeBubbleMotion(0.2);
  const bubble4 = makeBubbleMotion(0.3);

  // Footer motion — mulai setelah semua bubble selesai
  const footerMotion = shouldReduceMotion
    ? {
        initial: undefined,
        animate: undefined,
        transition: undefined as Transition | undefined,
      }
    : {
        initial: { opacity: 0, y: 10 },
        animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
        transition: {
          duration: 0.32,
          delay: 0.66, // setelah bubble4 (0.3s) + sedikit napas
          ease: easeOut,
        } as Transition,
      };

  return (
    <div
      ref={containerRef}
      className="pointer-events-none relative h-full w-full select-none"
    >
      {/* 1) Bubble — “Is it too late…” */}
      <motion.div
        className="absolute left-[-4.5%] top-[4%] flex items-start gap-2"
        initial={bubble1.initial}
        animate={bubble1.animate}
        transition={bubble1.transition}
      >
        <Image
          src="/avatars/1.png"
          alt="Customer avatar 1"
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="relative rounded-2xl bg-white px-4 py-2 shadow-[0_18px_55px_rgba(15,23,42,0.22)]">
          <span className="block pr-[29px] text-[13px] text-slate-700">
            Is it too late to book for tomorrow?
          </span>
          <span className="absolute bottom-1 right-3 text-[10px] text-slate-400">
            21:25
          </span>
        </div>
      </motion.div>

      {/* 2) Bubble — “Bonjour…” */}
      <motion.div
        className="absolute right-[10%] top-[28%] flex items-start gap-2"
        initial={bubble2.initial}
        animate={bubble2.animate}
        transition={bubble2.transition}
      >
        <Image
          src="/avatars/2.png"
          alt="Customer avatar 2"
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="relative rounded-2xl bg-white px-4 py-2 shadow-[0_18px_55px_rgba(15,23,42,0.22)]">
          <span className="block pr-[29px] text-[13px] text-slate-700">
            Bonjour, j&apos;aimerais consulter
          </span>
          <span className="absolute bottom-1 right-3 text-[10px] text-slate-400">
            10:01
          </span>
        </div>
      </motion.div>

      {/* 3) Bubble — “Merhaba…” */}
      <motion.div
        className="absolute left-[-10%] top-[52%] flex items-start gap-2"
        initial={bubble3.initial}
        animate={bubble3.animate}
        transition={bubble3.transition}
      >
        <Image
          src="/avatars/3.png"
          alt="Customer avatar 3"
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="relative rounded-2xl bg-white px-4 py-2 shadow-[0_18px_55px_rgba(15,23,42,0.22)]">
          <span className="block pr-[29px] text-[13px] text-slate-700">
            Merhaba, danışmak istiyorum
          </span>
          <span className="absolute bottom-1 right-3 text-[10px] text-slate-400">
            19:54
          </span>
        </div>
      </motion.div>

      {/* 4) Bubble — Chinese */}
      <motion.div
        className="absolute left-[17.5%] top-[76%] flex items-start gap-2"
        initial={bubble4.initial}
        animate={bubble4.animate}
        transition={bubble4.transition}
      >
        <Image
          src="/avatars/4.png"
          alt="Customer avatar 4"
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="relative rounded-2xl bg-white px-4 py-2 shadow-[0_18px_55px_rgba(15,23,42,0.22)]">
          <span className="block pr-[29px] text-[13px] text-slate-700">
            明天还能预约吗？
          </span>
          <span className="absolute bottom-1 right-3 text-[10px] text-slate-400">
            16:33
          </span>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        className="absolute bottom-[-12%] left-[-10%] text-[11px] text-slate-400"
        initial={footerMotion.initial}
        animate={footerMotion.animate}
        transition={footerMotion.transition}
      >
        Live chat powered by AberoAI
      </motion.p>
    </div>
  );
}
