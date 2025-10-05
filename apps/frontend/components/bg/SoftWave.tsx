// apps/frontend/components/bg/SoftWave.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SoftWave({ className = "" }: { className?: string }) {
  const prefersReduced = useReducedMotion();

  // Nuansa selaras brand (#26658C) tapi sangat tipis agar lembut
  const wave1 = "rgba(38,101,140,0.08)";
  const wave2 = "rgba(38,101,140,0.05)";

  // Durasi lembut (tenang). Framer akan repeat infinite.
  const d1 = 6;
  const d2 = 8;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 w-full ${className}`}
      style={{ transform: "translateZ(0)" }}
    >
      {prefersReduced ? (
        // Fallback statik untuk accessibility (reduce motion)
        <svg className="w-full" viewBox="0 0 1440 170" preserveAspectRatio="none">
          <path
            fill={wave1}
            d="M0,120L48,116C96,112,192,104,288,94C384,84,480,72,576,62C672,52,768,44,864,48C960,52,1056,68,1152,80C1248,92,1344,100,1392,104L1440,108L1440,170L0,170Z"
          />
          <path
            fill={wave2}
            d="M0,136L60,130C120,124,240,112,360,98C480,84,600,68,720,64C840,60,960,68,1080,82C1200,96,1320,116,1380,126L1440,136L1440,170L0,170Z"
          />
        </svg>
      ) : (
        <>
          <motion.svg
            className="w-full"
            viewBox="0 0 1440 170"
            preserveAspectRatio="none"
            initial={{ y: 0 }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: d1, ease: "easeInOut", repeat: Infinity }}
          >
            <path
              fill={wave1}
              d="M0,120L48,116C96,112,192,104,288,94C384,84,480,72,576,62C672,52,768,44,864,48C960,52,1056,68,1152,80C1248,92,1344,100,1392,104L1440,108L1440,170L0,170Z"
            />
          </motion.svg>

          <motion.svg
            className="w-full absolute inset-x-0 bottom-0 blur-[1px]"
            viewBox="0 0 1440 170"
            preserveAspectRatio="none"
            initial={{ y: 0 }}
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: d2, ease: "easeInOut", repeat: Infinity, delay: 0.6 }}
          >
            <path
              fill={wave2}
              d="M0,136L60,130C120,124,240,112,360,98C480,84,600,68,720,64C840,60,960,68,1080,82C1200,96,1320,116,1380,126L1440,136L1440,170L0,170Z"
            />
          </motion.svg>
        </>
      )}
    </div>
  );
}
