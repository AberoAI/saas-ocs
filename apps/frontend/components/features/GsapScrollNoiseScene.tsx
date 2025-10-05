"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ===== Utility: deterministic pseudo-noise (fast, no deps) =====
function nMix(i: number, a: number, b: number) {
  return Math.sin(i * a) * 0.66 + Math.cos(i * b) * 0.34; // ~[-1, 1]
}

export type GsapScrollNoiseSceneProps = {
  count?: number;        // default 2600
  spreadX?: number;      // default 240
  baseSize?: number;     // default 6
  haloAlpha?: number;    // default 0.6
  hueStep?: number;      // default 0.3
  ease?: [number, number, number, number]; // default [0.16, 1, 0.3, 1]
  scrollHeights?: number; // default 3  => ~300vh
};

export default function GsapScrollNoiseScene({
  count = 2600,
  spreadX = 240,
  baseSize = 6,
  haloAlpha = 0.6,
  hueStep = 0.3,
  ease = [0.16, 1, 0.3, 1],
  scrollHeights = 3,
}: GsapScrollNoiseSceneProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = wrap.clientWidth;
      const h = window.innerHeight * scrollHeights; // tall scroll area
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Particles
    type P = { x: number; y: number; r: number; hue: number; rot: number; sx: number; sy: number };
    const parts: P[] = new Array(count);
    for (let i = 0; i < count; i++) {
      const n1 = nMix(i, 0.003, 0.011);
      const n2 = nMix(i, 0.002, 0.007);
      const x = n2 * spreadX;
      const y = (i / count) * (window.innerHeight * scrollHeights);
      const rot = n2 * 270;
      const sx = 3 + n1 * 2;
      const sy = 3 + n2 * 2;
      const r = baseSize;
      const hue = (i * hueStep) % 360;
      parts[i] = { x, y, r, hue, rot, sx, sy };
    }

    let progress = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const py = (progress * window.innerHeight) / 3; // parallax
      for (let i = 0; i < count; i++) {
        const p = parts[i];
        const local = Math.min(1, Math.max(0, progress * 1.15 + ((i % 97) / 97) * 0.04 - 0.02));
        if (local <= 0.001) continue;

        ctx.save();
        ctx.translate(canvas.width / DPR / 2 + p.x, p.y - py);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.scale(p.sx, p.sy);

        ctx.globalAlpha = local * 0.55;
        ctx.fillStyle = `hsl(${p.hue} 70% 70%)`;
        ctx.beginPath();
        ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = local * haloAlpha;
        ctx.strokeStyle = `hsla(${p.hue}, 70%, 70%, ${haloAlpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();

        ctx.restore();
      }
    };

    let rafId = 0;
    const loop = () => {
      draw();
      rafId = requestAnimationFrame(loop);
    };
    loop();

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: () => `+=${window.innerHeight * (scrollHeights - 1)}`,
      scrub: true,
      scroller: document.documentElement, // ✅ sinkron Lenis
      onUpdate: (self) => {
        const t = self.progress;
        const eased = gsap.parseEase(`cubic-bezier(${ease[0]},${ease[1]},${ease[2]},${ease[3]})`)(t);
        progress = eased;
      },
    });

    return () => {
      st.kill();
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [baseSize, count, ease, haloAlpha, hueStep, scrollHeights, spreadX]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        height: `${scrollHeights * 100}vh`,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* Sticky scroll cue */}
      <div
        ref={cueRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          letterSpacing: "0.2em",
          fontSize: 11,
          zIndex: 2,
          pointerEvents: "none",
          color: "#000",
        }}
      >
        <span>SCROLL</span>
        <svg
          viewBox="0 0 24 24"
          width={18}
          height={18}
          style={{ marginTop: 10, animation: "scrollCue 0.95s ease-in-out alternate infinite" }}
          aria-hidden
        >
          <line x1="12" y1="1" x2="12" y2="22.5" stroke="#000" strokeWidth="1" strokeLinecap="round" />
          <line x1="12.1" y1="22.4" x2="18.9" y2="15.6" stroke="#000" strokeWidth="1" strokeLinecap="round" />
          <line x1="11.9" y1="22.4" x2="5.1" y2="15.6" stroke="#000" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      {/* Gradient masks */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100%",
          height: 60,
          background: "linear-gradient(to bottom, #fff 10%, rgba(255,255,255,0))",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100%",
          height: 60,
          background: "linear-gradient(to top, #fff 50%, rgba(255,255,255,0))",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}
