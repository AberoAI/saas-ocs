"use client";

import { useEffect } from "react";
import { getLenis, startLenisRaf } from "@/lib/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = { children: React.ReactNode };

export default function LenisProvider({ children }: Props) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = getLenis();
    const stop = startLenisRaf(lenis);

    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Sinkronkan GSAP dengan Lenis
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true });
        }
        return window.scrollY || window.pageYOffset;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    setTimeout(() => ScrollTrigger.refresh(), 0);

    return () => {
      window.removeEventListener("resize", onResize);
      stop();
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
