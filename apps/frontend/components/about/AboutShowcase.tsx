// apps/frontend/components/about/AboutShowcase.tsx
import React from "react";

export default function AboutShowcase() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-[1882px] px-6 py-16 flex justify-center">
        {/* Kartu gradient besar */}
        <div
          className="relative w-full h-[1032px] overflow-hidden rounded-[77px]
                     ring-1 ring-black/10 shadow-[0_16px_48px_-16px_rgba(2,36,66,0.25)]
                     bg-[linear-gradient(180deg,#C1EEFF_4%,rgba(219,248,239,0.5)_67%,rgba(237,246,255,0.5)_100%)]"
        >
          {/* Area kanan untuk dekorasi (future chat bubble) */}
          <div
            className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 items-center px-10 md:px-20"
            aria-hidden="true"
          >
            {/* Kolom kiri kosong */}
            <div />

            {/* Kolom kanan kanvas transparan */}
            <div className="relative min-h-[260px] rounded-2xl bg-white/25 ring-1 ring-white/50 shadow-inner">
              <span className="absolute bottom-4 left-6 text-[11px] text-black/50">
                Live chat powered by AberoAI
              </span>
            </div>
          </div>

          {/* Notch dekoratif kanan bawah */}
          <div
            className="pointer-events-none absolute -bottom-10 right-6 h-24 w-40 rounded-tl-[36px]
                       bg-white/70 ring-1 ring-black/10 shadow-[0_6px_18px_-10px_rgba(2,36,66,0.25)]"
            aria-hidden="true"
          />
          {/* Garis kecil */}
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
