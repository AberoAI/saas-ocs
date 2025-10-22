// apps/frontend/components/about/AboutShowcase.tsx
import React from "react";

export default function AboutShowcase() {
  return (
    <section id="about" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Kartu gradient tunggal (flat, tanpa stroke & shadow) */}
        <div
          className="
            relative overflow-hidden rounded-[30px]
            bg-[linear-gradient(180deg,#C1EEFF_4%,#E8F8F5_62%,#F2FBFB_100%)]
            min-h-[320px] md:min-h-[360px]
            p-6 md:p-10 lg:p-14
          "
        >
          {/* Label kecil kiri bawah */}
          <span className="absolute bottom-4 left-5 text-[11px] text-black/55 select-none">
            Live chat powered by AberoAI
          </span>

          {/*
            =============================
            NOTCH & PLATFORM (kanan-bawah)
            =============================
            - Platform: bar putih yang nempel di sisi kanan bawah
            - Notch: lingkaran putih yang “menggigit” ke area gradient
          */}
          {/* Platform putih (menempel sisi kanan) */}
          <div
            className="
              absolute bottom-0 right-0
              h-[88px] md:h-[96px] w-[42%]
              bg-white/90
              rounded-tl-[44px]
            "
            aria-hidden="true"
          />

          {/* Notch bundar (concave) — posisinya sedikit ke kiri dari platform */}
          <div
            className="
              absolute bottom-0
              left-[56%] md:left-[58%]
              h-[120px] w-[120px] md:h-[132px] md:w-[132px]
              -translate-x-1/2
              bg-white/90 rounded-full
            "
            aria-hidden="true"
          />

          {/* Garis status di atas platform */}
          <div
            className="
              pointer-events-none absolute
              bottom-8 md:bottom-9
              left-[62%] md:left-[64%]
              flex items-center gap-4 opacity-75
            "
            aria-hidden="true"
          >
            <span className="inline-block h-[6px] w-[120px] rounded-full bg-[#7DBBFF]" />
            <span className="inline-block h-[6px] w-[44px] rounded-full bg-[#C9DCE5]" />
            <span className="inline-block h-[6px] w-[44px] rounded-full bg-[#E0ECF2]" />
          </div>
        </div>
      </div>
    </section>
  );
}
