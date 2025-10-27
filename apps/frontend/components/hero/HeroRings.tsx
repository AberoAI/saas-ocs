"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";

/**
 * HeroRings (refined to match reference)
 * - Ring besar lebih tinggi & sedikit lebih ke dalam (tidak terlalu kanan)
 * - Skala diperkecil, opacity diringankan, gradient tetap sesuai brand
 * - Ring kecil didekatkan & disejajarkan
 * - Fade-out di bagian bawah agar menyatu ke white background
 * - Animasi subtle + hormati prefers-reduced-motion
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
      // Fade ke putih di bagian bawah agar ring menyatu (seperti mock)
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
      }}
    >
      {/* RING BESAR */}
      <motion.svg
        viewBox="0 0 576 560"
        role="presentation"
        /* Lebih tinggi, sedikit lebih ke dalam layar, dan lebih kecil */
        className="absolute right-[-2vw] top-[6vh] h-[54vh] w-auto min-h-[360px] min-w-[440px] xl:right-[-1vw] xl:top-[5vh] xl:h-[56vh]"
        style={{ willChange: "transform, opacity" }}
        initial={reduce ? { opacity: 0.28 } : { opacity: 0.28, scale: 0.985 }}
        animate={
          reduce
            ? { opacity: 0.28 }
            : {
                opacity: [0.24, 0.36, 0.28],
                scale: [0.985, 1.005, 0.985], // sangat halus
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
          strokeOpacity={0.28}   // lebih ringan dari sebelumnya
          strokeWidth={40}       // sedikit lebih tipis agar tidak berat
          fill="none"
        />
      </motion.svg>

      {/* RING KECIL (ACCENT) */}
      <motion.svg
        viewBox="0 0 576 560"
        role="presentation"
        /* Didekatkan & disejajarkan dengan ring besar */
        className="absolute right-[9vw] top-[8vh] h-[11vh] w-auto min-h-[84px] min-w-[84px] xl:right-[10vw] xl:top-[9vh]"
        style={{ willChange: "transform, opacity" }}
        initial={reduce ? { opacity: 0.34 } : { opacity: 0.34, scale: 0.99 }}
        animate={
          reduce
            ? { opacity: 0.34 }
            : {
                opacity: [0.30, 0.44, 0.34],
                scale: [0.99, 1.035, 0.99],
              }
        }
        transition={{ ...base, duration: 5.4, delay: 0.3 }}
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
          strokeOpacity={0.34}
          strokeWidth={18}
          fill="none"
        />
      </motion.svg>
    </div>
  );
}
