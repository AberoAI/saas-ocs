// apps/frontend/components/about/AboutShowcase.tsx
import React from "react";

export default function AboutShowcase() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Layer berwarna (kartu gradient ringan) */}
        <div className="relative overflow-hidden rounded-3xl ring-1 ring-black/10 shadow-[0_16px_48px_-16px_rgba(2,36,66,0.25)]">
          {/* Gradient sesuai Figma */}
          <div className="bg-[linear-gradient(180deg,#C1EEFF_4%,rgba(219,248,239,0.5)_67%,rgba(237,246,255,0.5)_100%)]">
            <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2 md:p-10">
              {/* Kiri kosong */}
              <div aria-hidden="true" className="min-h-[120px]" />

              {/* Kanan kanvas transparan */}
              <div
                className="relative min-h-[220px] md:min-h-[260px] rounded-2xl bg-white/30 ring-1 ring-white/50 shadow-inner pointer-events-none"
                aria-hidden="true"
              >
                <span className="absolute bottom-3 left-4 text-[11px] text-black/50">
                  Live chat powered by AberoAI
                </span>
              </div>
            </div>
          </div>

          {/* Notch dekoratif kanan bawah */}
          <div
            className="pointer-events-none absolute -bottom-10 right-6 h-24 w-40 rounded-tl-[36px]
                       bg-white/70 ring-1 ring-black/10 shadow-[0_6px_18px_-10px_rgba(2,36,66,0.25)]"
            aria-hidden="true"
          />
          {/* Garis tipis */}
          <svg
            className="pointer-events-none absolute bottom-6 right-10 h-4 w-24 opacity-60"
            viewBox="0 0 96 16"
            fill="none"
            aria-hidden="true"
          >
            <rect x="0" y="7" width="48" height="2" rx="1" fill="#97B9C7" />
            <rect x="52" y="7" width="16" height="2" rx="1" fill="#C9DCE5" />
            <rect x="72" y="7" width="8" height="2" rx="1" fill="#E0ECF2" />
          </svg>
        </div>
      </div>
    </section>
  );
}
