// apps/frontend/components/bg/FeatureHeroBG.tsx
"use client";

/**
 * Background khusus HERO Features:
 * - Radial gradients biru di sudut kiri-atas & kanan-atas
 * - Fade to white di bagian bawah agar transisi ke konten putih mulus
 * - Garis-garis tipis (very subtle) agar terasa "techy"
 * Tidak membutuhkan CSS tambahan di globals.
 */
export default function FeatureHeroBG() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Lapisan gradasi utama */}
      <div
        className="absolute inset-0"
        style={{
          background:
            `
            radial-gradient(60% 60% at 8% 0%, rgba(38,101,140,0.40) 0%, rgba(38,101,140,0.12) 35%, rgba(38,101,140,0) 60%),
            radial-gradient(55% 55% at 92% 0%, rgba(95,163,192,0.38) 0%, rgba(95,163,192,0.12) 35%, rgba(95,163,192,0) 60%),
            linear-gradient(180deg, rgba(255,255,255,0) 55%, rgba(255,255,255,0.66) 72%, #ffffff 86%)
            `,
          // sedikit brighten agar lebih “glow”
          filter: "saturate(1.05)",
        }}
      />

      {/* Garis-garis sangat tipis (subtle tech grid) */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          background:
            `
            repeating-linear-gradient(
              to right,
              rgba(255,255,255,0.6) 0px,
              rgba(255,255,255,0.6) 1px,
              transparent 1px,
              transparent 80px
            ),
            repeating-linear-gradient(
              to bottom,
              rgba(255,255,255,0.6) 0px,
              rgba(255,255,255,0.6) 1px,
              transparent 1px,
              transparent 80px
            )
            `,
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.12) 60%, rgba(0,0,0,0))",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.12) 60%, rgba(0,0,0,0))",
        }}
      />

      {/* Soft vignette supaya fokus ke tengah */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 40%, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.3) 100%)",
        }}
      />
    </div>
  );
}
