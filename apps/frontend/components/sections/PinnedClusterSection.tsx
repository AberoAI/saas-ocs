"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import AboutShowcase from "@/components/about/AboutShowcase";
import { useRef } from "react";

export default function PinnedClusterSection({ sectionId = "page-1" }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Step positions
  const step1Opacity = useTransform(scrollYProgress, [0.0, 0.25, 0.33], [1, 1, 0]);
  const step2Opacity = useTransform(scrollYProgress, [0.33, 0.45, 0.66], [0, 1, 0]);
  const step3Opacity = useTransform(scrollYProgress, [0.66, 0.85, 1], [0, 1, 1]);

  const step1Y = useTransform(scrollYProgress, [0, 0.25, 0.33], ["0%", "0%", "-15%"]);
  const step2Y = useTransform(scrollYProgress, [0.33, 0.45, 0.66], ["15%", "0%", "-15%"]);
  const step3Y = useTransform(scrollYProgress, [0.66, 0.85, 1], ["15%", "0%", "0%"]);

  if (prefersReducedMotion) {
    return (
      <section id={sectionId} className="relative bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-6">
          <AboutShowcase>
            <div className="py-20" />
          </AboutShowcase>
        </div>
      </section>
    );
  }

  return (
    <section id={sectionId} ref={containerRef} className="relative bg-white h-[320vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <div className="mx-auto w-full max-w-6xl px-4 lg:px-6">
          <AboutShowcase className="relative h-[480px] md:h-[560px] flex items-center justify-center overflow-hidden">
            {/* Step 1 */}
            <motion.div
              style={{ opacity: step1Opacity, y: step1Y }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">
                01 • Operational Layer
              </h3>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              style={{ opacity: step2Opacity, y: step2Y }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">
                02 • AI Workflow Layer
              </h3>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              style={{ opacity: step3Opacity, y: step3Y }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
            >
              <h3 className="text-2xl md:text-3xl font-semibold text-slate-900">
                03 • Retention Layer
              </h3>
            </motion.div>
          </AboutShowcase>
        </div>
      </div>
    </section>
  );
}
