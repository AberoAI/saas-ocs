// apps/frontend/components/bg/AnimatedBackgroundFeatures.tsx
"use client";

export default function AnimatedBackgroundFeatures() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden ag-gradient"
    >
      {/* Blob 1 */}
      <div
        className="ag-blob-anim absolute top-[-12%] left-[18%] w-[520px] h-[520px]
                   rounded-full blur-[140px] bg-[#26658C]/10"
        style={{ animation: "ag-blob 22s ease-in-out infinite" }}
      />
      {/* Blob 2 */}
      <div
        className="ag-blob-anim absolute bottom-[-14%] right-[14%] w-[440px] h-[440px]
                   rounded-full blur-[140px] bg-[#5FA3C0]/10"
        style={{ animation: "ag-blob 20s ease-in-out 2s infinite" }}
      />
      {/* Blob 3 (opsional, sangat ringan) */}
      <div
        className="ag-blob-anim absolute top-[40%] left-[60%] w-[320px] h-[320px]
                   rounded-full blur-[130px] bg-[#26658C]/8"
        style={{ animation: "ag-blob 24s ease-in-out 4s infinite" }}
      />
    </div>
  );
}
