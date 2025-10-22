// apps/frontend/components/about/AboutShowcase.tsx
import React from "react";

export default function AboutShowcase() {
  return (
    <section id="about" className="bg-white">
      <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* KARTU GRADIENT — flat, single layer, no stroke/shadow */}
        <div
          className="
            relative overflow-hidden rounded-[30px]
            bg-[linear-gradient(180deg,#C1EEFF_4%,#E8F8F5_62%,#F2FBFB_100%)]
            min-h-[320px] md:min-h-[360px]
            p-6 md:p-10 lg:p-14
          "
        >
          {/* Label kecil kiri-bawah (boleh dibiarkan; tidak memengaruhi bentuk) */}
          <span className="absolute bottom-4 left-5 text-[11px] text-black/55 select-none">
            Live chat powered by AberoAI
          </span>

          {/*
            NOTCH concave: lingkaran putih 'menggigit' area kartu.
            - Ditaruh DI ATAS kartu, karena parent overflow-hidden -> terlihat sebagai potongan.
            - Posisi kira-kira 64% dari lebar (silakan fine-tune persen bila perlu).
          */}
          <div
            className="
              absolute bottom-[-28px]
              left-[64%] md:left-[66%]
              h-[140px] w-[140px] md:h-[160px] md:w-[160px]
              rounded-full bg-white
            "
            aria-hidden="true"
          />
        </div>

        {/*
          GARIS STATUS dipindah ke LUAR kartu (background halaman),
          sejajar di kanan notch.
        */}
        <div
          className="
            pointer-events-none absolute
            bottom-8 md:bottom-9
            right-16 md:right-20
            flex items-center gap-4 opacity-80
          "
          aria-hidden="true"
        >
          <span className="inline-block h-[6px] w-[120px] rounded-full bg-[#7DBBFF]" />
          <span className="inline-block h-[6px] w-[44px]  rounded-full bg-[#C9DCE5]" />
          <span className="inline-block h-[6px] w-[44px]  rounded-full bg-[#E0ECF2]" />
        </div>
      </div>
    </section>
  );
}
