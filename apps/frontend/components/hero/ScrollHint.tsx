// apps/frontend/components/hero/ScrollHint.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400"] }); // Inter Regular

export default function ScrollHint({
  targetId,
  className = "",
}: {
  targetId?: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  const onClick = () => {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 text-[12px] leading-[1.1] text-black/60 ${className} ${inter.className}`}
      initial={{ opacity: 0.7, y: 0 }}
      animate={
        reduceMotion
          ? { opacity: 0.85 }
          : { opacity: [0.5, 1, 0.5], y: [0, 6, 0] }
      }
      transition={{ duration: 2.8, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
      aria-label={targetId ? "Scroll to next section" : "Scroll"}
      data-test="scroll-hint"
    >
      <span>Scroll</span>
      <span className="opacity-80" aria-hidden>↓</span>
    </motion.button>
  );
}
