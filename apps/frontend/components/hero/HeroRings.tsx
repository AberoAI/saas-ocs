"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";

/**
 * HeroRings
 * - Dua cincin (besar & kecil) di kanan hero.
 * - Animasi subtle "breathing": opacity & scale sangat kecil.
 * - GPU-friendly & accessible.
 */
export default function HeroRings() {
  const reduce = useReducedMotion();

  const transition: Transition = {
    duration: 6,
    repeat: Infinity,          // ← tanpa 'as const'
    repeatType: "mirror",      // ← literal string valid
    ease: "easeInOut",         // ← kompatibel dengan motion-dom typings
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Ring besar (kanan) */}
      <motion.div
        initial={reduce ? { opacity: 0.35 } : { opacity: 0.28, scale: 0.995 }}
        animate={
          reduce
            ? { opacity: 0.35 }
            : { opacity: [0.24, 0.36, 0.28], scale: [0.995, 1.01, 0.995] }
        }
        transition={transition}
        className="absolute right-[-6vw] top-[14vh] h-[68vh] w-[68vh] min-w-[420px] min-h-[420px]"
        style={{ willChange: "transform, opacity" }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full" role="presentation">
          <defs>
            <linearGradient id="abero-ring" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#84C5E8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#EDEFF3" stopOpacity="0.55" />
            </linearGradient>
            <filter id="abero-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" />
            </filter>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="43"
            fill="none"
            stroke="url(#abero-ring)"
            strokeWidth="6"
            filter="url(#abero-blur)"
          />
        </svg>
      </motion.div>

      {/* Ring kecil (kanan-atas) */}
      <motion.div
        initial={reduce ? { opacity: 0.4 } : { opacity: 0.36, scale: 1 }}
        animate={
          reduce
            ? { opacity: 0.4 }
            : { opacity: [0.32, 0.44, 0.36], scale: [1, 1.04, 1] }
        }
        transition={{ ...transition, duration: 5.2 }}
        className="absolute right-[10vw] top-[10vh] h-[12vh] w-[12vh] min-w-[96px] min-h-[96px]"
        style={{ willChange: "transform, opacity" }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full" role="presentation">
          <defs>
            <linearGradient id="abero-ring-sm" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#84C5E8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#EEF1F5" stopOpacity="0.5" />
            </linearGradient>
            <filter id="abero-blur-sm" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
            </filter>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#abero-ring-sm)"
            strokeWidth="8"
            filter="url(#abero-blur-sm)"
          />
        </svg>
      </motion.div>
    </div>
  );
}
