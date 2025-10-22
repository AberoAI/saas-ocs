// apps/frontend/components/about/AboutShowcase.tsx
import React from "react";

export default function AboutShowcase() {
  return (
    <section id="about" className="bg-white">
      <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* ===== Bubble card dengan concave notch (SVG mask) ===== */}
        <div className="relative">
          <svg
            viewBox="0 0 1000 420"
            preserveAspectRatio="none"
            className="block w-full h-[320px] md:h-[360px] lg:h-[380px]"
            aria-hidden="true"
          >
            {/* Gradient persis layer biru lembut */}
            <defs>
              <linearGradient id="abero-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C1EEFF" />
                <stop offset="62%" stopColor="#E8F8F5" />
                <stop offset="100%" stopColor="#F2FBFB" />
              </linearGradient>

              {/* Mask: rect putih penuh MINUS circle hitam (dipotong) */}
              <mask id="bubble-cut">
                {/* Rect putih (area terlihat) */}
                <rect x="0" y="0" width="1000" height="420" rx="30" ry="30" fill="#fff" />
                {/* Lingkaran hitam = area TERPOTONG (concave notch) 
                   cx: posisi notch horizontal (dalam persen lebar)
                   cy: di bawah garis bawah supaya hanya bagian atas lingkaran yang “menggigit”
                   r : besar notch */}
                <circle id="notch" cx="740" cy="480" r="95" fill="#000" />
              </mask>
            </defs>

            {/* Rect diisi gradient + dipotong mask */}
            <rect
              x="0"
              y="0"
              width="1000"
              height="420"
              rx="30"
              ry="30"
              fill="url(#abero-gradient)"
              mask="url(#bubble-cut)"
            />
          </svg>

          {/* Label kecil kiri-bawah (di atas SVG, tapi di dalam card area) */}
          <span className="pointer-events-none absolute left-5 bottom-4 text-[11px] text-black/55">
            Live chat powered by AberoAI
          </span>
        </div>

        {/* Garis status — di LUAR kartu (halaman putih), kanan-bawah setelah notch */}
        <div
          className="
            pointer-events-none absolute
            right-6 md:right-10
            bottom-8 md:bottom-9
            flex items-center gap-4 opacity-85
          "
        >
          <span className="inline-block h-[6px] w-[160px] rounded-full bg-[#7DBBFF]" />
          <span className="inline-block h-[6px] w-[56px]  rounded-full bg-[#C9DCE5]" />
          <span className="inline-block h-[6px] w-[56px]  rounded-full bg-[#E0ECF2]" />
        </div>
      </div>
    </section>
  );
}
