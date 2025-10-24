import React from "react";

// Semua sudut 45px (tanpa notch kanan bawah)
const PATH_D = `
  M45 0H1837
  C1862.6 0 1882 19.4 1882 45V987
  C1882 1012.6 1862.6 1032 1837 1032H45
  C19.4 1032 0 1012.6 0 987V45
  C0 19.4 19.4 0 45 0Z
`;

// Tambah shape-rendering agar anti-aliasing kurva lebih halus
function makeMaskDataURI(path: string) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1882 1032' preserveAspectRatio='none' shape-rendering='geometricPrecision'>` +
    `<path d='${path}' fill='white'/></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

type Props = {
  className?: string;
  showLabel?: boolean;
  label?: string;
};

export default function AboutShowcase({
  className = "",
  showLabel: _showLabel = true, // kept but unused
  label: _label = "Live chat powered by", // kept but unused
}: Props) {
  const maskURI = makeMaskDataURI(PATH_D);

  return (
    <section
      id="about"
      className={`
        bg-white overflow-x-clip w-full !max-w-none !mx-0
        [--gutter:12px] sm:[--gutter:16px] md:[--gutter:20px] lg:[--gutter:24px]
        ${className}
      `}
    >
      <div className="relative mx-[calc(50%-50vw)] w-[100vw] px-[var(--gutter)] py-10 md:py-14 col-span-full self-stretch !max-w-none !mx-0">
        <div
          className="
            relative block w-full
            h-[clamp(490px,72vh,970px)]
            overflow-hidden
            !max-w-none !mx-0
            bg-[linear-gradient(180deg,#C1EEFF_4.3%,#DBF8EF80_67%,#EDF6FF80_100%)]
            dark:bg-[linear-gradient(180deg,#9ED8F0_4%,#CFEDE680_67%,#DDE9F780_100%)]
          "
          style={{
            WebkitMaskImage: maskURI,
            maskImage: maskURI,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "100% 100%",
            maskSize: "100% 100%",
          }}
        />
      </div>
    </section>
  );
}
