// apps/frontend/components/lab/scroll/ScrollExperimentExample.tsx
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ScrollExperimentExample() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const translateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [40, 0, -40]
  );

  return (
    <div ref={ref} className="relative min-h-[140vh]">
      <div className="sticky top-24">
        <motion.div
          style={{ opacity, y: translateY }}
          className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white/90 px-6 py-6 shadow-sm backdrop-blur"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Scroll Story Block
          </p>
          <h2 className="mt-2 text-base font-semibold text-slate-900">
            From chaotic inbox to predictable operations
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Blok ini mensimulasikan satu &quot;frame&quot; storytelling AberoAI
            yang tetap terlihat saat user scroll. Kamu bisa mengganti konten
            dengan step booking, aftercare, atau retention story.
          </p>
          <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
            <li>• Fade-in pelan saat memasuki viewport.</li>
            <li>• Stabil di tengah, tanpa jitter saat scroll pelan.</li>
            <li>• Fade-out bersih saat keluar, cocok untuk chained clusters.</li>
          </ul>
          <p className="mt-3 text-[11px] text-slate-500">
            Gunakan sebagai baseline: duplikasi pola ini untuk membuat
            storytelling multi-step (#page-1 → #page-2 → #page-3).
          </p>
        </motion.div>
      </div>

      <div className="pointer-events-none mt-[80vh] text-center text-[11px] text-slate-400">
        <p>Terus scroll ke bawah / atas untuk melihat efek fade & translate.</p>
      </div>
    </div>
  );
}
