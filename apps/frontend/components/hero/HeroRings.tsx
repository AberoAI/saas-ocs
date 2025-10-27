"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";

/**
 * HeroRings (AberoAI) — refined
 * - Posisi ring besar lebih tinggi & sedikit ke kiri
 * - Skala & opacity lebih ringan (tidak mendominasi)
 * - Ring kecil didekatkan ke ring besar
 * - Animasi subtle, GPU-friendly, respects prefers-reduced-motion
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
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* RING BESAR */}
      <motion.svg
        viewBox="0 0 576 560"
        role="presentation"
        // naikkan (top 8vh), geser kiri (right -4vw), perkecil skala visual (60vh)
        className="absolute right-[-4vw] top-[8vh] h-[60vh] w-auto min-h-[400px] min-w-[480px]"
        style={{ willChange: "transform, opacity" }}
        initial={reduce ? { opacity: 0.32 } : { opacity: 0.30, scale: 0.98 }}
        animate={
          reduce
            ? { opacity: 0.32 }
            : {
                // lebih ringan dari sebelumnya
                opacity: [0.25, 0.38, 0.30],
                scale: [0.98, 1.01, 0.98],
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
          strokeOpacity={0.3}   // ↓ dari 0.4 agar tidak terlalu berat
          strokeWidth={45}
          fill="none"
        />
      </motion.svg>

      {/* RING KECIL (ACCENT) */}
      <motion.svg
        viewBox="0 0 576 560"
        role="presentation"
        // didekatkan & sedikit lebih rendah agar "nyambung" dengan ring besar
        className="absolute right-[5vw] top-[9vh] h-[14vh] w-auto min-h-[96px] min-w-[96px]"
        style={{ willChange: "transform, opacity" }}
        initial={reduce ? { opacity: 0.34 } : { opacity: 0.34, scale: 0.98 }}
        animate={
          reduce
            ? { opacity: 0.34 }
            : {
                opacity: [0.30, 0.46, 0.34],
                scale: [0.98, 1.04, 0.98],
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
          strokeOpacity={0.35}   // sedikit lebih ringan
          strokeWidth={20}
          fill="none"
        />
      </motion.svg>
    </div>
  );
}
