import React from "react";

/** Rounded-rect 45px, inset 2px agar tidak ke-clip di tepi viewBox */
function makeMaskDataURI() {
  const inset = 2; // naikkan jika di device tertentu masih “terkikis”
  const vbW = 1882, vbH = 1032;
  const rx = 45;
  const w = vbW - inset * 2;
  const h = vbH - inset * 2;

  // rapikan menjadi satu baris untuk menghindari parsing aneh pada beberapa engine
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${vbW} ${vbH}' preserveAspectRatio='none' shape-rendering='geometricPrecision'><rect x='${inset}' y='${inset}' width='${w}' height='${h}' rx='${rx}' ry='${rx}' fill='white'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

type Props = {
  className?: string;
  showLabel?: boolean; // kept for API compatibility
  label?: string;      // kept for API compatibility
};

export default function AboutShowcase({
  className = "",
  showLabel: _showLabel = true, // unused
  label: _label = "Live chat powered by", // unused
}: Props) {
  const maskURI = makeMaskDataURI();

  return (
    <section
      id="about"
      className={`
        bg-white overflow-x-clip w-full !max-w-none !mx-0
        [--gutter:12px] sm:[--gutter:16px] md:[--gutter:20px] lg:[--gutter:24px]
        ${className}
      `}
    >
      {/* Full-bleed aman scrollbar */}
      <div className="relative mx-[calc(50%-50vw)] w-[100vw] px-[var(--gutter)] py-10 md:py-14 col-span-full self-stretch !max-w-none !mx-0">
        <div
          className="
            relative block w-full
            h-[clamp(490px,72vh,970px)]
            overflow-hidden
            !max-w-none !mx-0
            bg-[linear-gradient(180deg,#C1EEFF_4.3%,#DBF8EF80_67%,#EDF6FF80_100%)]
            dark:bg-[linear-gradient(180deg,#9ED8F0_4%,#CFEDE680_67%,#DDE9F780_100%)]
            rounded-[45px]  /* fallback jika mask gagal dibaca */
          "
          style={{
            // Shorthand lebih kompatibel di Chromium/WebKit
            WebkitMask: `${maskURI} no-repeat 0 0 / 100% 100%`,
            mask: `${maskURI} no-repeat 0 0 / 100% 100%`,
          }}
        />
      </div>
    </section>
  );
}
