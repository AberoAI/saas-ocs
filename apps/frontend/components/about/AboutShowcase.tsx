// apps/frontend/components/about/AboutShowcase.tsx
import React from "react";

export default function AboutShowcase() {
  /**
   * Unit viewBox = 0..100 (lebar) x 0..50 (tinggi).
   * Baseline kartu = y = 42. Tonjolan turun sampai 42 + bumpR.
   */
  const corner = 3;     // radius sudut kartu (≈ 30px visual)
  const bumpR = 6;      // radius tonjolan (semakin besar => tonjolan makin besar)
  const rightGap = 8;   // jarak pusat tonjolan dari sisi kanan (dalam % lebar)

  // Titik bantu (dalam koordinat viewBox)
  const top     = 0;
  const baseY   = 42;
  const height  = 50; // tinggi viewBox agar tonjolan yang turun terlihat (overflow visible)
  const cx      = 100 - rightGap;     // pusat X tonjolan, di-anker ke kanan
  const leftX   = cx - bumpR;         // titik kiri tonjolan di baseline
  const rightX  = cx + bumpR;         // titik kanan tonjolan di baseline
  const bottomY = baseY + bumpR;      // titik paling bawah tonjolan

  // Path kartunya: clockwise, masuk tonjolan (dua arc), lanjut ke sudut kanan bawah
  const d = [
    // start dari sudut kiri-atas
    `M ${corner} ${top}`,
    `H ${100 - corner}`,
    `Q 100 ${top} 100 ${corner}`,         // sudut kanan-atas
    `V ${baseY - corner}`,
    `Q 100 ${baseY} ${100 - corner} ${baseY}`, // sudut kanan-bawah
    // garis bawah ke kiri sampai titik kanan tonjolan
    `H ${rightX}`,
    // arc 1: dari baseline kanan tonjolan → titik bawah (turun searah jarum jam)
    `A ${bumpR} ${bumpR} 0 0 1 ${cx} ${bottomY}`,
    // arc 2: dari titik bawah → baseline kiri tonjolan (naik searah jarum jam)
    `A ${bumpR} ${bumpR} 0 0 1 ${leftX} ${baseY}`,
    // lanjut garis bawah ke kiri hingga sudut kiri-bawah
    `H ${corner}`,
    `Q 0 ${baseY} 0 ${baseY - corner}`,    // sudut kiri-bawah
    `V ${corner}`,
    `Q 0 ${top} ${corner} ${top}`,         // sudut kiri-atas (close)
    `Z`,
  ].join(" ");

  return (
    <section id="about" className="bg-white">
      <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">
        <svg
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="block w-full h-[320px] md:h-[360px] lg:h-[380px] overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="abero-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C1EEFF" />
              <stop offset="62%" stopColor="#E8F8F5" />
              <stop offset="100%" stopColor="#F2FBFB" />
            </linearGradient>
          </defs>

          {/* Satu path: rounded-rect + tonjolan (dua arc) */}
          <path d={d} fill="url(#abero-gradient)" />
        </svg>

        {/* Caption opsional – hapus kalau tak perlu */}
        <span className="pointer-events-none absolute left-5 bottom-4 text-[11px] text-black/55">
          Live chat powered by AberoAI
        </span>
      </div>
    </section>
  );
}
