// apps/frontend/components/landingpage/animations/Page4OperationalFlowShowcase.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState, useId } from "react";

type Step = {
  key: string;
  label: string;
  iconGraySrc: string;
  iconBlueSrc: string;
};

type Props = {
  labels: {
    inquiry: string;
    context: string;
    care: string;
    aftercare: string;
    followup: string;
    continuity: string;
  };
};

const BRAND = "#26658C";
const BASE = "#A1A2BB";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

function Arrow({
  phase,
  fillDurationMs,
  drainDurationMs,
  arrowIndex,
  seqKey,
}: {
  phase: "fill" | "drain" | null;
  fillDurationMs: number;
  drainDurationMs: number;
  arrowIndex: number;
  seqKey: number;
}) {
  const reactId = useId();

  const clipId = `page4-arrow-clip-${arrowIndex}-${reactId}`.replace(/:/g, "");

  // Restart animations reliably when phase toggles.
  const rectKey =
    phase === "fill"
      ? `rect-fill-${arrowIndex}-${seqKey}`
      : phase === "drain"
        ? `rect-drain-${arrowIndex}-${seqKey}`
        : `rect-idle-${arrowIndex}`;

  const show = phase !== null;

  return (
    <div className="hidden md:flex items-center justify-center">
      <svg
        width="54"
        height="18"
        viewBox="0 0 56 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
        aria-hidden="true"
        focusable="false"
      >
        {/* Base arrow (always visible) */}
        <path d="M2 9H50" stroke={BASE} strokeWidth="2" strokeLinecap="round" />
        <path
          d="M50 4L54 9L50 14"
          stroke={BASE}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Blue overlay revealed/hidden via SAME clip (smooth both directions) */}
        {show ? (
          <>
            <g clipPath={`url(#${clipId})`}>
              {/* Soft glow */}
              <path
                d="M2 9H50"
                stroke={BRAND}
                strokeWidth="3.6"
                strokeLinecap="round"
                className="page4-liquid-glow"
              />
              <path
                d="M50 4L54 9L50 14"
                stroke={BRAND}
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="page4-liquid-glow"
              />

              {/* Core liquid */}
              <path
                d="M2 9H50"
                stroke={BRAND}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M50 4L54 9L50 14"
                stroke={BRAND}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            <defs>
              <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
                <rect
                  key={rectKey}
                  x={phase === "drain" ? 0 : 0}
                  y="0"
                  height="18"
                  width={phase === "drain" ? 56 : 0}
                  className={
                    phase === "fill"
                      ? "page4-liquid-clip page4-liquid-clip-fill"
                      : "page4-liquid-clip page4-liquid-clip-drain"
                  }
                  style={{
                    animationDuration: `${
                      phase === "fill" ? fillDurationMs : drainDurationMs
                    }ms`,
                  }}
                />
              </clipPath>
            </defs>
          </>
        ) : null}
      </svg>

      <style jsx>{`
        .page4-liquid-glow {
          opacity: 0.22;
        }

        .page4-liquid-clip {
          animation-timing-function: cubic-bezier(0.18, 0.85, 0.2, 1);
          animation-fill-mode: both;
          will-change: width, x;
        }

        /* Fill: reveal blue left -> right */
        .page4-liquid-clip-fill {
          animation-name: page4LiquidFill;
        }

        /* Drain: hide blue right -> left (start wiping from the arrow tip back to the tail)
           Achieved by shrinking width while shifting x from 0 -> 56 (keeps the "remaining" clip stuck to the right edge). */
        .page4-liquid-clip-drain {
          animation-name: page4LiquidDrain;
        }

        @keyframes page4LiquidFill {
          0% {
            width: 0px;
          }
          98% {
            width: 56px;
          }
          100% {
            width: 56px;
          }
        }

        @keyframes page4LiquidDrain {
          0% {
            x: 0px;
            width: 56px;
          }
          98% {
            x: 56px;
            width: 0px;
          }
          100% {
            x: 56px;
            width: 0px;
          }
        }
      `}</style>
    </div>
  );
}

export default function Page4OperationalFlowShowcase({ labels }: Props) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const steps: Step[] = useMemo(
    () => [
      {
        key: "inquiry",
        label: labels.inquiry,
        iconGraySrc: "/icons/page4/inquiry_gray.svg",
        iconBlueSrc: "/icons/page4/inquiry_blue.svg",
      },
      {
        key: "context",
        label: labels.context,
        iconGraySrc: "/icons/page4/context_gray.svg",
        iconBlueSrc: "/icons/page4/context_blue.svg",
      },
      {
        key: "care",
        label: labels.care,
        iconGraySrc: "/icons/page4/care_gray.svg",
        iconBlueSrc: "/icons/page4/care_blue.svg",
      },
      {
        key: "aftercare",
        label: labels.aftercare,
        iconGraySrc: "/icons/page4/aftercare_gray.svg",
        iconBlueSrc: "/icons/page4/aftercare_blue.svg",
      },
      {
        key: "followup",
        label: labels.followup,
        iconGraySrc: "/icons/page4/followup_gray.svg",
        iconBlueSrc: "/icons/page4/followup_blue.svg",
      },
      {
        key: "continuity",
        label: labels.continuity,
        iconGraySrc: "/icons/page4/continuity_gray.svg",
        iconBlueSrc: "/icons/page4/continuity_blue.svg",
      },
    ],
    [labels],
  );

  // Animation contract:
  // - Starts at Inquiry (0)
  // - For each transition:
  //    1) Arrow fills (default -> active)
  //    2) EXACTLY when fill reaches the end, next card becomes active
  //    3) Arrow drains back to default with the same liquid motion (active -> default)
  // - After Continuity, loops back to Inquiry
  const [activeIndex, setActiveIndex] = useState(0);

  // Arrow controller:
  const [arrowPhase, setArrowPhase] = useState<{
    index: number;
    phase: "fill" | "drain";
  } | null>(null);

  const CARD_HOLD_MS = 800;

  const ARROW_FILL_MS = 2000;
  const ARROW_DRAIN_MS = 1200;

  // card should switch when liquid visually reaches the end (~98%)
  const FILL_END_RATIO = 0.98;

  const timersRef = useRef<number[]>([]);
  const seqRef = useRef(0);
  const [seqKey, setSeqKey] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setActiveIndex(0);
      setArrowPhase(null);
      return;
    }

    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];

    let cancelled = false;

    const schedule = (fn: () => void, ms: number) => {
      const t = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timersRef.current.push(t);
    };

    const runCycleFrom = (startIndex: number) => {
      if (cancelled) return;

      schedule(() => {
        if (cancelled) return;

        if (startIndex >= steps.length - 1) {
          setArrowPhase(null);
          schedule(() => {
            setActiveIndex(0);
            runCycleFrom(0);
          }, CARD_HOLD_MS);
          return;
        }

        // 1) Arrow fills
        setArrowPhase({ index: startIndex, phase: "fill" });
        seqRef.current += 1;
        setSeqKey(seqRef.current);

        const fillEndMs = Math.max(
          0,
          Math.round(ARROW_FILL_MS * FILL_END_RATIO),
        );

        // 2) At fill end -> activate next card + begin drain immediately
        schedule(() => {
          setActiveIndex(startIndex + 1);

          setArrowPhase({ index: startIndex, phase: "drain" });
          seqRef.current += 1;
          setSeqKey(seqRef.current);
        }, fillEndMs);

        // after drain ends -> clear arrow overlay + continue
        schedule(() => {
          setArrowPhase(null);
          runCycleFrom(startIndex + 1);
        }, fillEndMs + ARROW_DRAIN_MS);
      }, CARD_HOLD_MS);
    };

    setActiveIndex(0);
    setArrowPhase(null);
    runCycleFrom(0);

    return () => {
      cancelled = true;
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
    };
  }, [prefersReducedMotion, steps.length]);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-5 md:flex-nowrap md:justify-between">
          {steps.map((s, idx) => {
            const isActive = idx === activeIndex;

            const borderColor = isActive ? BRAND : "rgba(0,0,0,0.10)";
            const borderWidth = isActive ? 1.5 : 1;
            const labelColor = isActive ? BRAND : "#7A7A7A";
            const iconSrc = isActive ? s.iconBlueSrc : s.iconGraySrc;

            const thisArrowPhase =
              arrowPhase && arrowPhase.index === idx ? arrowPhase.phase : null;

            return (
              <React.Fragment key={s.key}>
                <div
                  className={[
                    "rounded-xl bg-white",
                    "flex flex-col items-center justify-center",
                    "transition-transform transition-shadow duration-300",
                    "w-[92px] h-[92px] md:w-[104px] md:h-[104px]",
                    isActive
                      ? "shadow-lg scale-[1.06]"
                      : "shadow-none scale-100",
                  ].join(" ")}
                  style={{
                    transformOrigin: "center",
                    borderStyle: "solid",
                    borderColor,
                    borderWidth,
                  }}
                >
                  <img
                    src={iconSrc}
                    alt=""
                    className="h-7 w-7"
                    loading="lazy"
                    draggable={false}
                  />
                  <div
                    className="mt-2 text-[11px] font-medium text-center leading-snug px-2"
                    style={{ color: labelColor }}
                  >
                    {s.label}
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <Arrow
                    phase={thisArrowPhase}
                    fillDurationMs={ARROW_FILL_MS}
                    drainDurationMs={ARROW_DRAIN_MS}
                    arrowIndex={idx}
                    seqKey={seqKey}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
