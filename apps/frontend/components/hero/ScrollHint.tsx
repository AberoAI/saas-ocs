// apps/frontend/components/hero/ScrollHint.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function ScrollHint() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="mt-16 inline-flex items-center justify-center gap-2 text-sm text-black/60"
      initial={{ opacity: 0.7, y: 0 }}
      animate={
        reduceMotion
          ? { opacity: 0.8 }
          : { opacity: [0.5, 1, 0.5], y: [0, 6, 0] }
      }
      transition={{
        duration: 2.8,
        repeat: Infinity,
        ease: [0.45, 0, 0.55, 1], // smoother than default easeInOut
      }}
      aria-hidden="true"
    >
      <span>Scroll</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        className="opacity-80"
        aria-hidden="true"
      >
        <path
          d="M12 5v14M12 19l-5-5M12 19l5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
