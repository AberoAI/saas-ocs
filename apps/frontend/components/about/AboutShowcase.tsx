// apps/frontend/components/about/AboutShowcase.tsx
import React from "react";

export default function AboutShowcase() {
  // ---- TUNABLES (mudah disetel) ----
  // Lebar viewBox = 100, tinggi = 42 → rasio mirip sebelumnya (1000:420).
  const corner = 3;          // radius sudut kartu (≈ 30px)
  const notchR = 6;          // radius notch (semakin besar → gigitan makin besar)
  const rightOffset = 8;     // jarak notch dari sisi kanan (dalam unit viewBox; 1 unit ≈ 1% lebar)
  const cx = 100 - rightOffset; // anchor ke kanan
  const cy = 42;                // tepat di garis bawah kartu → setengah lingkaran ke atas

  return (
    <section id="about" className="bg-white">
      <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Kartu gradient dengan concave notch yang TER-ANKER di kanan-bawah */}
        <svg
          viewBox="0 0 100 42"
          preserveAspectRatio="xMidYMid meet"
          className="block w-full h-[320px] md:h-[360px] lg:h-[380px]"
          aria-hidden="true"
        >
          <defs>
            {/* Gradient lembut */}
            <linearGradient id="abero-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C1EEFF" />
              <stop offset="62%" stopColor="#E8F8F5" />
              <stop offset="100%" stopColor="#F2FBFB" />
            </linearGradient>

            {/* Mask: rect rounded (putih) MINUS lingkaran (hitam) → potong setengah lingkaran di bawah-kanan */}
            <mask id="bubble-mask">
              <rect x="0" y="0" width="100" height="42" rx={corner} ry={corner} fill="#fff" />
              <circle cx={cx} cy={cy} r={notchR} fill="#000" />
            </mask>
          </defs>

          {/* Bentuk akhir */}
          <rect
            x="0"
            y="0"
            width="100"
            height="42"
            rx={corner}
            ry={corner}
            fill="url(#abero-gradient)"
            mask="url(#bubble-mask)"
          />
        </svg>

        {/* Caption opsional; aman dihapus jika tidak perlu */}
        <span className="pointer-events-none absolute left-5 bottom-4 text-[11px] text-black/55">
          Live chat powered by AberoAI
        </span>
      </div>
    </section>
  );
}
