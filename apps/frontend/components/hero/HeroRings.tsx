"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";

/**
 * HeroRings (AberoAI)
 * - Menggunakan SVG ring sesuai spesifikasi (gradien #64A4ED → #37477C → transparan).
 * - Dua elemen: ring besar (path oval) & ring kecil (circle).
 * - Animasi halus (opacity+scale) dan menghormati prefers-reduced-motion.
 * - Posisi absolute di kanan hero, responsif.
 */
export default function HeroRings() {
  const reduce = useReducedMotion();

  const base: Transition = {
    duration: 7,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Ring besar */}
      <motion.svg
        viewBox="0 0 576 560"
        role="presentation"
        className="absolute right-[-7vw] top-[12vh] h-[68vh] w-auto min-h-[420px] min-w-[520px]"
        style={{ willChange: "transform, opacity" }}
        initial={reduce ? { opacity: 0.4 } : { opacity: 0.34, scale: 0.995 }}
        animate={
          reduce
            ? { opacity: 0.4 }
            : {
                opacity: [0.30, 0.42, 0.34],
                scale: [0.995, 1.012, 0.995],
              }
        }
        transition={base}
      >
        <defs>
          <linearGradient
            id="abero-ring-lg"
            x1="238.5"
            y1="18"
            x2="238.5"
            y2="560"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#64A4ED" stopOpacity="0.85" />
            <stop offset="0.466346" stopColor="#37477C" stopOpacity="0.39" />
            <stop offset="0.725962" stopColor="#2E3C69" stopOpacity="0.10" />
            <stop offset="0.923077" stopColor="#1F2846" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        <path
          d="M238.5 40.5C355.179 40.5 454.5 148.97 454.5 289C454.5 429.03 355.179 537.5 238.5 537.5C121.821 537.5 22.5 429.03 22.5 289C22.5 148.97 121.821 40.5 238.5 40.5Z"
          stroke="url(#abero-ring-lg)"
          strokeOpacity="0.4"
          strokeWidth="45"
          fill="none"
        />
      </motion.svg>

      {/* Ring kecil (accent) */}
      <motion.svg
        viewBox="0 0 576 560"
        role="presentation"
        className="absolute right-[6vw] top-[6vh] h-[16vh] w-auto min-h-[96px] min-w-[96px]"
        style={{ willChange: "transform, opacity" }}
        initial={reduce ? { opacity: 0.4 } : { opacity: 0.36, scale: 1 }}
        animate={
          reduce
            ? { opacity: 0.4 }
            : {
                opacity: [0.32, 0.48, 0.36],
                scale: [1, 1.05, 1],
              }
        }
        transition={{ ...base, duration: 5.5, delay: 0.4 }}
      >
        <defs>
          <linearGradient
            id="abero-ring-sm"
            x1="513"
            y1="0"
            x2="513"
            y2="126"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#64A4ED" stopOpacity="0.85" />
            <stop offset="0.466346" stopColor="#37477C" stopOpacity="0.39" />
            <stop offset="0.807692" stopColor="#2E3C69" stopOpacity="0.10" />
            <stop offset="1" stopColor="#1F2846" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        <circle
          cx="513"
          cy="63"
          r="53"
          stroke="url(#abero-ring-sm)"
          strokeOpacity="0.4"
          strokeWidth="20"
          fill="none"
        />
      </motion.svg>
    </div>
  );
}
