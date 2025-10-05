// apps/frontend/components/bg/AnimatedBackgroundFeatures.tsx
"use client";

type AnimatedBackgroundFeaturesProps = {
  /** Aktifkan untuk mempercepat animasi (memudahkan pengecekan visual). Default: false */
  debug?: boolean;
  /** Tambahan className jika diperlukan (opsional) */
  className?: string;
};

export default function AnimatedBackgroundFeatures({
  debug = false,
  className = "",
}: AnimatedBackgroundFeaturesProps) {
  // Durasi normal: sangat halus; Durasi debug: dipercepat agar gerak terlihat jelas.
  const d1 = debug ? "8s" : "22s"; // blob 1
  const d2 = debug ? "8s" : "20s"; // blob 2
  const d3 = debug ? "8s" : "24s"; // blob 3

  const delay2 = debug ? "1s" : "2s";
  const delay3 = debug ? "2s" : "4s";

  return (
    <div
      aria-hidden
      // ag-gradient: gradient drift (didefinisikan di globals.css)
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ag-gradient ${className}`}
      // Saat debug, paksa animasi gradient lebih cepat agar jelas terlihat.
      style={debug ? { animation: "ag-gradient 6s linear infinite" } : undefined}
    >
      {/* Blob 1 */}
      <div
        className="ag-blob-anim absolute top-[-12%] left-[18%] w-[520px] h-[520px] rounded-full blur-[140px] bg-[#26658C]/10"
        style={{ animation: `ag-blob ${d1} ease-in-out 0s infinite` }}
      />

      {/* Blob 2 */}
      <div
        className="ag-blob-anim absolute bottom-[-14%] right-[14%] w-[440px] h-[440px] rounded-full blur-[140px] bg-[#5FA3C0]/10"
        style={{ animation: `ag-blob ${d2} ease-in-out ${delay2} infinite` }}
      />

      {/* Blob 3 (opsional, sangat ringan) */}
      <div
        className="ag-blob-anim absolute top-[40%] left-[60%] w-[320px] h-[320px] rounded-full blur-[130px] bg-[#26658C]/8"
        style={{ animation: `ag-blob ${d3} ease-in-out ${delay3} infinite` }}
      />
    </div>
  );
}
