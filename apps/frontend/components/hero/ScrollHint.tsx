// apps/frontend/components/hero/ScrollHint.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

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
      className={`inline-flex items-center justify-center gap-2 text-sm text-black/60 focus:outline-none focus:ring-2 focus:ring-black/20 rounded-md ${className}`}
      initial={{ opacity: 0.7, y: 0 }}
      animate={reduceMotion ? { opacity: 0.85 } : { opacity: [0.5, 1, 0.5], y: [0, 6, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
      aria-label={targetId ? "Scroll to next section" : "Scroll"}
    >
      <span>Scroll</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-80" aria-hidden="true">
        <path
          d="M12 5v14M12 19l-5-5M12 19l5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}
