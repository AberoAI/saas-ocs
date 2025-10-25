// apps/frontend/components/about/AboutShowcase.tsx
import * as React from "react";

type Props = React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode };

export default function AboutShowcase({ className = "", children, ...rest }: Props) {
  const gradId = React.useId();

  return (
    <section
      {...rest}
      className={[
        "relative max-w-none",
        "h-[clamp(420px,85vh,920px)]", // tinggi fleksibel
        "w-[calc(100vw-16px)]",
        "ml-[calc(50%-50vw+8px)]",
        "mr-[calc(50%-50vw+8px)]",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "relative h-full w-full overflow-hidden rounded-[45px]",
          "bg-[rgb(var(--surface-bg,255_255_255))]",
          "dark:bg-[rgb(var(--surface-bg-dark,17_24_39))]",
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
            <linearGradient id={gradId} x1="937" y1="-16.7023" x2="937" y2="1032" gradientUnits="userSpaceOnUse">
              <stop offset="0.04" stopColor="var(--about-grad-1, #C1EEFF)" />
              <stop offset="0.67" stopColor="var(--about-grad-2, #DBF8EF)" stopOpacity="var(--about-grad-2-op, 0.5)" />
              <stop offset="1" stopColor="var(--about-grad-3, #EDF6FF)" stopOpacity="var(--about-grad-3-op, 0.5)" />
            </linearGradient>
          </defs>

          <path
            d="M0 45C0 20.1472 20.1472 0 45 0H1837C1861.85 0 1882 20.1472 1882 45V836.5C1882 861.353 1861.85 881.5 1837 881.5H1487C1462.15 881.5 1442 901.647 1442 926.5V987C1442 1011.85 1421.85 1032 1397 1032H923H45C20.1472 1032 0 1011.85 0 987V501.575V45Z"
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
