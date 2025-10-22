// apps/frontend/components/about/AboutShowcase.tsx
import React from "react";

export default function AboutShowcase() {
  return (
    <section id="about" className="bg-white">
      <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Bubble card clean (tanpa notch & tanpa garis) */}
        <svg
          viewBox="0 0 1000 420"
          preserveAspectRatio="none"
          className="block w-full h-[320px] md:h-[360px] lg:h-[380px]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="abero-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C1EEFF" />
              <stop offset="62%" stopColor="#E8F8F5" />
              <stop offset="100%" stopColor="#F2FBFB" />
            </linearGradient>
          </defs>

          {/* Hanya kotak rounded dengan gradient */}
          <rect
            x="0"
            y="0"
            width="1000"
            height="420"
            rx="30"
            ry="30"
            fill="url(#abero-gradient)"
          />
        </svg>

        {/* Label kecil kiri-bawah */}
        <span className="pointer-events-none absolute left-5 bottom-4 text-[11px] text-black/55">
          Live chat powered by AberoAI
        </span>
      </div>
    </section>
  );
}
