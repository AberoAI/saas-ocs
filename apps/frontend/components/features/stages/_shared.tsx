"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { BRAND } from "../constants";

export function TypingDots() {
  return (
    <div className="flex items-center gap-1.5" aria-label="typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: BRAND }}
          initial={{ opacity: 0.35, y: 0 }}
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export function CountUp({
  to,
  duration = 0.75,
  delay = 0,
  disabled = false,
  suffix = "",
}: {
  to: number;
  duration?: number;
  delay?: number;
  disabled?: boolean;
  suffix?: string;
}) {
  const mv = useMotionValue(0);
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (disabled) { setVal(to); return; }
    const controls = animate(mv, to, { duration, delay, ease: "easeOut" });
    const unsub = mv.on("change", (v) => setVal(Math.round(v)));
    return () => { controls.stop(); unsub(); };
  }, [to, duration, delay, disabled, mv]);

  return <span className="tabular-nums text-foreground/80">{val}{suffix}</span>;
}

export function StatusPill({ status, activePulse = true }:{
  status:"Active"|"Standby"; activePulse?:boolean;
}) {
  const isActive = status === "Active";
  const brand = BRAND;
  return (
    <span className="relative inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium shadow-[inset_0_-1px_0_rgba(255,255,255,0.65)] transition-colors whitespace-nowrap"
      style={isActive
        ? { borderColor: "rgba(38,101,140,0.28)", background: "#F3F8FC", color: brand }
        : { borderColor: "rgba(0,0,0,0.18)", background: "white", color: "rgba(0,0,0,0.78)" }}>
      <span className="relative inline-block h-2 w-2 rounded-full overflow-visible" style={{ background: isActive ? brand : "#64748b" }} aria-hidden>
        {isActive && activePulse && (
          <motion.span className="absolute inset-0 rounded-full"
            initial={{ scale: 1, opacity: 0.35 }}
            animate={{ scale: [1, 1.28, 1], opacity: [0.35, 0, 0.35] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
            style={{ background: brand }}
          />
        )}
      </span>
      {status}
    </span>
  );
}

export function BranchIcon({ type }: { type: "hq" | "branch" }) {
  const color = type === "hq" ? BRAND : "#94a3b8";
  const ring = type === "hq" ? "0 0 0 6px rgba(38,101,140,0.12)" : "0 0 0 6px rgba(148,163,184,0.12)";
  return <span className="h-2.5 w-2.5 rounded-full" style={{ background: color, boxShadow: ring }} aria-hidden />;
}

export function SchultzBackdrop({ prefersReduced }: { prefersReduced: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[-5] overflow-hidden">
      <motion.div
        initial={{ x: -24, y: -16, scale: 1, opacity: 0.5 }}
        {...(!prefersReduced && { animate: { x: [-24, 18, -12, -24], y: [-16, -4, 10, -16], rotate: [0, 8, -6, 0] }, transition: { duration: 22, repeat: Infinity, ease: "easeInOut" as const } })}
        className="absolute -top-10 -left-12 h-56 w-56 md:h-72 md:w-72 rounded-full blur-3xl mix-blend-overlay"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(38,101,140,0.65) 0%, rgba(38,101,140,0) 72%)" }}
      />
      <motion.div
        initial={{ x: 8, y: -8, scale: 1, opacity: 0.42 }}
        {...(!prefersReduced && { animate: { x: [8, -22, 14, 8], y: [-8, 14, -6, -8], rotate: [0, -6, 4, 0] }, transition: { duration: 26, repeat: Infinity, ease: "easeInOut" as const } })}
        className="absolute -top-8 right-0 h-48 w-48 md:h-64 md:w-64 rounded-full blur-3xl mix-blend-soft-light"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(255,214,102,0.6) 0%, rgba(255,214,102,0) 72%)" }}
      />
      <motion.div
        initial={{ x: 24, y: 36, scale: 1, opacity: 0.36 }}
        {...(!prefersReduced && { animate: { x: [24, -6, 18, 24], y: [36, 18, 46, 36], rotate: [0, 5, -4, 0] }, transition: { duration: 24, repeat: Infinity, ease: "easeInOut" as const } })}
        className="absolute bottom-0 right-6 h-56 w-56 md:h-72 md:w-72 rounded-full blur-3xl mix-blend-multiply"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(119,135,255,0.5) 0%, rgba(119,135,255,0) 72%)" }}
      />
    </div>
  );
}

export function MetricCard({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border border-white/60 bg-white/70 px-3 py-2.5 md:px-4 md:py-3">
      <div className="text-[11px] md:text-[12px] text-foreground/70">{label}</div>
      <div className="mt-0.5 text-lg md:text-xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="text-[10px] md:text-[11px] text-foreground/60">{hint}</div>}
    </div>
  );
}
