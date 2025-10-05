"use client";

import Lenis from "@studio-freight/lenis";

let _lenis: Lenis | null = null;

export function getLenis(): Lenis {
  if (_lenis) return _lenis;
  _lenis = new Lenis({
    duration: 1.0,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    // smoothTouch: false,   // ❌ HAPUS: tidak ada di LenisOptions v1
    wheelMultiplier: 1.0,
    touchMultiplier: 1.0,
    // autoRaf: false,       // ❌ HAPUS: tidak ada di LenisOptions v1
  });
  return _lenis;
}

export function startLenisRaf(lenis: Lenis) {
  let rafId = 0;
  const raf = (time: number) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);
  return () => cancelAnimationFrame(rafId);
}
