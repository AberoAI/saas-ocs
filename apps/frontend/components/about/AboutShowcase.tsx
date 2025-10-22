// apps/frontend/components/about/AboutShowcase.tsx
import React from "react";

export default function AboutShowcase() {
  return (
    <section id="about" className="bg-white">
      <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Card with concave semi-circle notch near bottom-right */}
        <svg
          viewBox="0 0 1000 420"
          preserveAspectRatio="none"
          className="block w-full h-[320px] md:h-[360px] lg:h-[380px]"
          aria-hidden="true"
        >
          <defs>
            {/* Soft vertical gradient */}
            <linearGradient id="abero-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C1EEFF" />
              <stop offset="62%" stopColor="#E8F8F5" />
              <stop offset="100%" stopColor="#F2FBFB" />
            </linearGradient>

            {/* Cut a semi-circle from the bottom edge (concave “bite”) */}
            {/*
              Tweak these three numbers if you want to move/resize the bite:
              - cx: horizontal position from the left (larger = further right)
              - r : radius of the bite
              Currently:  cx=720, r=56 fits typical 7xl container well
            */}
            <mask id="bubble-with-bite">
              {/* Visible area (rounded rect) */}
              <rect x="0" y="0" width="1000" height="420" rx="30" ry="30" fill="#fff" />
              {/* Black area is removed from the rect: a HALF circle on the bottom edge */}
              <circle cx="720" cy="420" r="56" fill="#000" />
            </mask>
          </defs>

          {/* Final card: gradient + mask (concave bite) */}
          <rect
            x="0"
            y="0"
            width="1000"
            height="420"
            rx="30"
            ry="30"
            fill="url(#abero-gradient)"
            mask="url(#bubble-with-bite)"
          />
        </svg>

        {/* Optional tiny caption; keep or remove as you like */}
        <span className="pointer-events-none absolute left-5 bottom-4 text-[11px] text-black/55">
          Live chat powered by AberoAI
        </span>
      </div>
    </section>
  );
}
