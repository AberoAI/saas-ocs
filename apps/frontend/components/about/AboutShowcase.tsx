// apps/frontend/components/about/AboutShowcase.tsx
import * as React from "react";

type Props = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export default function AboutShowcase({
  className = "",
  children,
  ...rest
}: Props) {
  const gradId = React.useId();

  const sectionClassName = [
    "relative max-w-none",
    // Panel tinggi, terasa penting, tapi masih menyisakan ruang putih di luar
    "h-[clamp(520px,92vh,1100px)]",
    "w-[calc(100vw-16px)]",
    "ml-[calc(50%-50vw+8px)]",
    "mr-[calc(50%-50vw+8px)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section {...rest} className={sectionClassName}>
      <div
        className={[
          "relative h-full w-full overflow-hidden",
          "rounded-[28px]",
          "bg-[rgb(var(--surface-bg,255_255_255))]",
          "dark:bg-[rgb(var(--surface-bg-dark,17_24_39))]",
          // sedikit shadow untuk efek melayang premium
          "shadow-[0_24px_80px_rgba(15,23,42,0.14)]",
        ].join(" ")}
      >
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1882 1032"
          preserveAspectRatio="none"
          shapeRendering="geometricPrecision"
          aria-hidden="true"
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id={gradId}
              x1="937"
              y1="-16.7023"
              x2="937"
              y2="1032"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.04" stopColor="var(--about-grad-1, #C1EEFF)" />
              <stop
                offset="0.67"
                stopColor="var(--about-grad-2, #DBF8EF)"
                stopOpacity="var(--about-grad-2-op, 0.5)"
              />
              <stop
                offset="1"
                stopColor="var(--about-grad-3, #EDF6FF)"
                stopOpacity="var(--about-grad-3-op, 0.5)"
              />
            </linearGradient>
          </defs>

          {/* Concave bottom-right notch: signature panel AberoAI */}
          <path
            d="
              M0 45
              C0 20.1472 20.1472 0 45 0
              H1837
              C1861.85 0 1882 20.1472 1882 45

              V962
              Q1882 1032 1812 1032

              H45
              C20.1472 1032 0 1011.85 0 987

              V45
              Z
            "
            fill={`url(#${gradId})`}
          />
        </svg>

        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {children}
        </div>
      </div>
    </section>
  );
}
