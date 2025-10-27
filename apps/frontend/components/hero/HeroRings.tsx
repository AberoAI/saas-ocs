"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";

/**
 * HeroRings — final
 * - Mengikuti SVG referensi (path + circle, gradient biru → gelap → transparan)
 * - Opacity diperkuat agar tidak terlalu pudar
 * - Posisi kanan-atas, responsif, dengan fade-out bawah
 * - Animasi subtle & menghormati prefers-reduced-motion
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
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)",
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)",
      }}
    >
      <motion.svg
        viewBox="0 0 576 560"
        role="presentation"
        className="absolute right-[-2vw] top-[6vh] h-[56vh] w-auto min-h-[360px] min-w-[480px] xl:right-[-1vw] xl:top-[5vh] xl:h-[58vh]"
        style={{ willChange: "transform, opacity" }}
        initial={reduce ? { opacity: 0.45 } : { opacity: 0.45, scale: 0.985 }}
        animate={
          reduce
            ? { opacity: 0.45 }
            : {
                opacity: [0.42, 0.52, 0.45],
                scale: [0.985, 1.005, 0.985],
              }
        }
        transition={base}
      >
        <defs>
          <linearGradient
            id="abero-ring-lg-grad"
            x1="238.5"
            y1="18"
            x2="238.5"
            y2="560"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#64A4ED" stopOpacity="0.9" />
            <stop offset="0.466346" stopColor="#37477C" stopOpacity="0.5" />
            <stop offset="0.725962" stopColor="#2E3C69" stopOpacity="0.2" />
            <stop offset="0.923077" stopColor="#1F2846" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient
            id="abero-ring-sm-grad"
            x1="513"
            y1="0"
            x2="513"
            y2="126"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#64A4ED" stopOpacity="0.9" />
            <stop offset="0.466346" stopColor="#37477C" stopOpacity="0.5" />
            <stop offset="0.807692" stopColor="#2E3C69" stopOpacity="0.2" />
            <stop offset="1" stopColor="#1F2846" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Ring besar (path persis referensi) */}
        <path
          d="M238.5 40.5C355.179 40.5 454.5 148.97 454.5 289C454.5 429.03 355.179 537.5 238.5 537.5C121.821 537.5 22.5 429.03 22.5 289C22.5 148.97 121.821 40.5 238.5 40.5Z"
          stroke="url(#abero-ring-lg-grad)"
          strokeOpacity={0.6}
          strokeWidth={45}
          fill="none"
        />

        {/* Ring kecil (accent) */}
        <motion.circle
          cx="513"
          cy="63"
          r="53"
          stroke="url(#abero-ring-sm-grad)"
          strokeOpacity={0.55}
          strokeWidth={20}
          fill="none"
          style={{ transformOrigin: "513px 63px", willChange: "transform, opacity" }}
          initial={reduce ? { opacity: 0.5 } : { opacity: 0.5, scale: 0.99 }}
          animate={
            reduce
              ? { opacity: 0.5 }
              : {
                  opacity: [0.45, 0.6, 0.5],
                  scale: [0.99, 1.035, 0.99],
                }
          }
          transition={{ ...base, duration: 5.4, delay: 0.3 }}
        />
      </motion.svg>
    </div>
  );
}
