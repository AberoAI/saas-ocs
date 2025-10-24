import React from "react";

const PATH_D = `M0 77C0 34.4741 34.4741 0 77 0H1805C1847.53 0 1882 34.4741 1882 77V820.5C1882 863.026 1847.53 897.5 1805 897.5H1598.25C1561.11 897.5 1531 927.609 1531 964.75C1531 1001.89 1500.89 1032 1463.75 1032H923H77C34.4741 1032 0 997.526 0 955V501.575V77Z`;

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
            rounded-[20px] md:rounded-[24px] lg:rounded-[26px]  /* radius lebih kecil dan modern */
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
