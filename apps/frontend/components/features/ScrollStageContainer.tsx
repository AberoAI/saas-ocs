"use client";

import { ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { useStepScroll } from "@/hooks/useStepScroll";

export default function ScrollStageContainer({
  totalSteps,
  children,
}: {
  totalSteps: number;
  children: (args: { step: number }) => ReactNode;
}) {
  const prefersReduced = useReducedMotion();
  const { containerRef, step } = useStepScroll({
    totalSteps,
    reduceMotion: !!prefersReduced,
  });

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `calc(var(--vvh, 100vh) * ${totalSteps})` }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="w-full">
          {children({ step })}
        </div>
      </div>
    </div>
  );
}
