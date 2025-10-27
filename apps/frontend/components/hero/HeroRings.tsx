"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";

/**
 * HeroRings — rebuilt from scratch using the provided SVG reference
 * - Persis mengikuti path & gradient dari SVG referensi
 * - Satu <svg> berisi ring besar (path) + ring kecil (circle)
 * - Animasi halus (scale + opacity) + ring kecil punya denyut ringan
 * - Posisi responsif di kanan-atas hero
 * - Fade-out di bagian bawah agar menyatu dengan background putih
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
      // Fade ke putih di bawah agar ring menyatu (seperti mock)
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
      }}
    >
      <motion.svg
        viewBox="0 0 576 560"
        role="presentation"
        className="
          absolute right-[-2vw] top-[6vh]
          h-[56vh] w-auto
          min-h-[360px] min-w-[480px]
          xl:right-[-1vw] xl:top-[5vh] xl:h-[58vh]
        "
        style={{ willChange: "transform, opacity" }}
        initial={
          reduce ? { opacity: 0.3 } : { opacity: 0.28, scale: 0.985 }
        }
        animate={
          reduce
            ? { opacity: 0.3 }
            : {
                opacity: [0.25, 0.36, 0.28], // lebih ringan agar tidak dominan
                scale: [0.985, 1.005, 0.985], // subtle breathing
              }
        }
        transition={base}
      >
        <defs>
          {/* Gradient persis dari SVG referensi (id disesuaikan agar unik di dokumen) */}
          <linearGradient
            id="abero-ring-lg-grad"
            x1="238.5"
            y1="18"
            x2="238.5"
            y2="560"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#64A4ED" stopOpacity="0.85" />
            <stop offset="0.466346" stopColor="#37477C" stopOpacity="0.39" />
            <stop offset="0.725962" stopColor="#2E3C69" stopOpacity="0.10" />
            <stop offset="0.923077" stopColor="#1F2846" stopOpacity="0.00" />
          </linearGradient>
          <linearGradient
            id="abero-ring-sm-grad"
            x1="513"
            y1="0"
            x2="513"
            y2="126"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#64A4ED" stopOpacity="0.85" />
            <stop offset="0.466346" stopColor="#37477C" stopOpacity="0.39" />
            <stop offset="0.807692" stopColor="#2E3C69" stopOpacity="0.10" />
            <stop offset="1" stopColor="#1F2846" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* RING BESAR — path persis dari referensi */}
        <path
          d="M238.5 40.5C355.179 40.5 454.5 148.97 454.5 289C454.5 429.03 355.179 537.5 238.5 537.5C121.821 537.5 22.5 429.03 22.5 289C22.5 148.97 121.821 40.5 238.5 40.5Z"
          stroke="url(#abero-ring-lg-grad)"
          strokeOpacity={0.4}
          strokeWidth={45}
          fill="none"
        />

        {/* RING KECIL — circle persis dari referensi, dengan animasi denyut ringan */}
        <motion.circle
          cx="513"
          cy="63"
          r="53"
          stroke="url(#abero-ring-sm-grad)"
          strokeOpacity={0.4}
          strokeWidth={20}
          fill="none"
          style={{ transformOrigin: "513px 63px", willChange: "transform, opacity" }}
          initial={reduce ? { opacity: 0.4 } : { opacity: 0.36, scale: 0.99 }}
          animate={
            reduce
              ? { opacity: 0.4 }
              : {
                  opacity: [0.32, 0.48, 0.36],
                  scale: [0.99, 1.035, 0.99],
                }
          }
          transition={{ ...base, duration: 5.4, delay: 0.3 }}
        />
      </motion.svg>
    </div>
  );
}
