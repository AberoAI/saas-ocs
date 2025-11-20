// apps/frontend/components/lab/svg/SvgExperimentExample.tsx
"use client";

import { motion } from "framer-motion";

export default function SvgExperimentExample() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-8 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        SVG Stroke & Orbit Demo
      </p>
      <p className="mt-1 text-xs text-slate-600 text-center max-w-md">
        Contoh sederhana untuk efek &quot;AI orbit&quot; yang bisa kamu adaptasi
        ke hero AberoAI (icon di tengah, orbit di sekitar).
      </p>

      <div className="mt-6 flex items-center justify-center">
        <svg
          viewBox="0 0 160 160"
          className="h-40 w-40"
          aria-label="SVG orbit experiment"
        >
          {/* Outer orbit circle (stroke-draw) */}
          <motion.circle
            cx="80"
            cy="80"
            r="55"
            fill="none"
            stroke="#0f172a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="360"
            initial={{ strokeDashoffset: 360 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />

          {/* Inner static circle for center node */}
          <circle cx="80" cy="80" r="22" fill="#0f172a" opacity={0.08} />

          {/* Center node */}
          <motion.circle
            cx="80"
            cy="80"
            r="10"
            fill="#0f172a"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />

          {/* Small orbiting dot */}
          <motion.circle
            cx="135"
            cy="80"
            r="4"
            fill="#0f172a"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 80 80"
              to="360 80 80"
              dur="6s"
              repeatCount="indefinite"
            />
          </motion.circle>
        </svg>
      </div>

      <p className="mt-4 text-[11px] text-slate-500 text-center max-w-xs">
        Catatan: gunakan ini sebagai sandbox untuk menguji variasi stroke,
        radius, kecepatan orbit, dan jumlah node sebelum dibawa ke hero utama.
      </p>
    </div>
  );
}
