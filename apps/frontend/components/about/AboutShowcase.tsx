// apps/frontend/components/about/AboutShowcase.tsx
import React from "react";

export default function AboutShowcase() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Kartu gradient tunggal (tanpa panel dalam) */}
        <div
          className="
            relative overflow-hidden rounded-[30px]
            ring-1 ring-black/5
            shadow-[0_8px_28px_-10px_rgba(2,36,66,0.12)]
            bg-[linear-gradient(180deg,#C1EEFF_4%,#E8F8F5_62%,#F2FBFB_100%)]
            min-h-[320px] md:min-h-[360px]
            p-6 md:p-10 lg:p-14
          "
        >
          {/* Label kecil kiri bawah */}
          <span className="absolute bottom-4 left-5 text-[11px] text-black/55 select-none">
            Live chat powered by AberoAI
          </span>

          {/* Notch dekoratif kanan bawah */}
          <div
            className="
              pointer-events-none absolute -bottom-10 right-6 h-24 w-40
              rounded-tl-[36px] bg-white/75 ring-1 ring-black/10
              shadow-[0_6px_18px_-10px_rgba(2,36,66,0.18)]
            "
            aria-hidden="true"
          />

          {/* Garis kecil dekoratif */}
          <svg
            className="pointer-events-none absolute bottom-6 right-10 h-4 w-24 opacity-60"
            viewBox="0 0 96 16"
            fill="none"
            aria-hidden="true"
          >
            <rect x="0"  y="7" width="48" height="2" rx="1" fill="#7DBBFF" />
            <rect x="52" y="7" width="16" height="2" rx="1" fill="#C9DCE5" />
            <rect x="72" y="7" width="8"  height="2" rx="1" fill="#E0ECF2" />
          </svg>
        </div>
      </div>
    </section>
  );
}
