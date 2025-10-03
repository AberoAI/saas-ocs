"use client";

import { motion, type Variants } from "framer-motion";
import { EASE } from "../constants";
import { MetricCard } from "./_shared";

export type AnalyticsRealtimeStageProps = { prefersReduced: boolean };

export default function AnalyticsRealtimeStage({ prefersReduced }: { prefersReduced: boolean }) {
  const barsA = [28, 42, 35, 55, 62, 48, 30, 40, 58, 66, 52, 38];
  const barsB = [34, 36, 48, 60, 54, 50, 36, 46, 62, 72, 56, 44];

  const container: Variants = {
    hidden: { opacity: 0, scale: 0.985, y: 6 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
  };

  return (
    <motion.div
      key="analytics-realtime"
      variants={container}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -6 }}
      className="relative w-full max-w-[640px] overflow-hidden rounded-[22px]
                 border border-white/60 bg-white/55 md:backdrop-blur-xl backdrop-blur
                 supports-[not(backdrop-filter:blur(0))]:bg-white/90
                 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]"
      aria-label="Realtime Analytics"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          opacity: prefersReduced ? 0.40 : 0.58,
          background:
            "radial-gradient(60% 60% at 15% 10%, rgba(219,234,254,0.6) 0%, transparent 60%)," +
            "radial-gradient(55% 45% at 100% 20%, rgba(253,230,138,0.45) 0%, transparent 60%)",
        }}
      />

      <div className="px-4 md:px-5 py-3.5 md:py-4 border-b border-white/60 bg-white/40 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="text-[14px] md:text-[15px] font-medium tracking-tight text-foreground/85">Realtime Analytics</div>
          <div className="text-[10px] md:text-[11px] text-foreground/70">Live</div>
        </div>
      </div>

      <div className="px-4 md:px-5 py-3 md:py-4 grid grid-cols-3 gap-3 md:gap-4">
        <MetricCard label="Conversations" value="1,280" hint="last 24h" />
        <MetricCard label="Avg. Response" value="42s" hint="< 60s target" />
        <MetricCard label="CSAT" value="95%" hint="survey" />
      </div>

      <div className="px-2 md:px-4 pb-4 md:pb-5">
        <div className="relative h-[180px] rounded-xl bg-white/65 border border-white/60 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" aria-hidden shapeRendering="crispEdges">
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1="0" x2="100%" y1={`${25 * (i + 1)}%`} y2={`${25 * (i + 1)}%`} stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
            ))}
          </svg>

          <div className="absolute inset-0 flex items-end px-3 md:px-4 gap-[6px] md:gap-[8px]">
            {(prefersReduced ? barsA : barsB).map((h, i) => (
              <motion.div
                key={i}
                className="w-full max-w-[28px] rounded-md border border-black/5 bg-[rgba(38,101,140,0.12)]"
                initial={{ height: `${Math.max(8, h - 12)}%` }}
                animate={prefersReduced ? { height: `${h}%` } : { height: [`${h - 10}%`, `${h + 8}%`, `${h}%`] }}
                transition={prefersReduced ? { duration: 0.35 } : { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}
              />
            ))}
          </div>

          {!prefersReduced && (
            <motion.div
              className="absolute inset-y-0 w-1/3"
              style={{
                background: "linear-gradient(90deg, rgba(38,101,140,0) 0%, rgba(38,101,140,0.10) 50%, rgba(38,101,140,0) 100%)",
                filter: "blur(8px)",
              }}
              initial={{ x: "-40%" }}
              animate={{ x: ["-40%", "120%"] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>
      </div>

      <div className="px-4 md:px-5 py-2.5 md:py-3 border-t border-white/60 bg-white/40 text-[11px] md:text-[12px] text-foreground/75">
        Live sample. Sambungkan ke data (WS/SSE/Polling) untuk update realtime.
      </div>
    </motion.div>
  );
}
