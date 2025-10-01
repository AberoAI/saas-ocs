// apps/frontend/components/ScrollStack.tsx
"use client";

import React, {
  useLayoutEffect,
  useRef,
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

/** =========================
 * Minimal typings untuk Lenis
 * ========================= */
type LenisEvent = "scroll";
type LenisHandler = (e?: unknown) => void;

interface Lenis {
  on(event: LenisEvent, handler: LenisHandler): void;
  off?(event: LenisEvent, handler: LenisHandler): void;
  raf(time: number): void;
  destroy(): void;
}

type LenisConstructor = new (options?: Record<string, unknown>) => Lenis;

type VoidFn = () => void;

export const ScrollStackItem: React.FC<
  PropsWithChildren<{ itemClassName?: string }>
> = ({ children, itemClassName = "" }) => (
  <div
    className={[
      "scroll-stack-card",
      "relative w-full rounded-[22px] bg-white/90 border border-white/60",
      "backdrop-blur-md shadow-[0_20px_60px_-18px_rgba(0,0,0,0.18)]",
      itemClassName,
    ].join(" ")}
  >
    {children}
  </div>
);

export type ScrollStackProps = {
  className?: string;

  /** Spasi antar kartu (px) */
  itemDistance?: number;
  /** Skala berkurang per kedalaman (0.03 = 3%) */
  itemScale?: number;
  /** Jarak tumpukan (px) saat pinned */
  itemStackDistance?: number;

  /** Posisi stack relatif viewport; px atau % (untuk align="top") */
  stackPosition?: number | string;
  /** Posisi akhir transisi scale; px atau % (untuk align="top") */
  scaleEndPosition?: number | string;

  /** Skala dasar kartu paling depan */
  baseScale?: number;

  /** Rotasi per kedalaman (derajat) */
  rotationAmount?: number;
  /** Blur per kedalaman (px) */
  blurAmount?: number;

  /** Pakai scroll window (true) atau wrapper internal (false) */
  useWindowScroll?: boolean;

  /** Aktifkan smooth scrolling via Lenis jika tersedia */
  enableLenis?: boolean;

  /** Tinggi spacer pelepas pin di akhir (px atau %, default "20vh") */
  endSpacer?: number | string;

  /** Penyelarasan pin saat in-view */
  align?: "top" | "center";

  /** Memudarkan kartu di belakang kartu aktif per tingkat (0..1). 0 = nonaktif */
  fadeAmount?: number;

  /** Dipanggil saat kartu terakhir sedang “pinned/in-view” */
  onStackComplete?: VoidFn;
};

export const ScrollStack: React.FC<PropsWithChildren<ScrollStackProps>> = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "18%",
  scaleEndPosition = "8%",
  baseScale = 0.86,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = true,
  enableLenis = true,
  endSpacer = "20vh",
  align = "top",
  fadeAmount = 0,
  onStackComplete,
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);      // host of this instance
  const scrollerRef = useRef<HTMLDivElement | null>(null);  // internal scroller when useWindowScroll=false
  const rafRef = useRef<number | null>(null);

  // Lenis ctor & instance
  const LenisCtorRef = useRef<LenisConstructor | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTRef = useRef<Map<number, { y: number; s: number; r: number; b: number; o: number }>>(new Map());
  const doneRef = useRef(false);
  const busyRef = useRef(false);
  const tickingRef = useRef(false); // coalesce native scroll → 1× per frame

  // Compute prefers-reduced-motion safely on client
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setPrefersReduced(!!mq.matches);
    set();
    try {
      mq.addEventListener("change", set);
      return () => mq.removeEventListener("change", set);
    } catch {
      mq.addListener?.(set);
      return () => mq.removeListener?.(set);
    }
  }, []);

  const toPx = useCallback((v: number | string, h: number) => {
    return typeof v === "string" && v.includes("%") ? (parseFloat(v) / 100) * h : Number(v);
  }, []);

  const getScroll = useCallback(() => {
    if (useWindowScroll) {
      return { top: window.scrollY, h: window.innerHeight };
    }
    const el = scrollerRef.current!;
    return { top: el.scrollTop, h: el.clientHeight };
  }, [useWindowScroll]);

  // Offset akurat untuk window & wrapper (relatif ke dokumen/wrapper + mempertimbangkan scroll)
  const getOffset = useCallback(
    (el: HTMLElement) => {
      if (useWindowScroll) {
        const rect = el.getBoundingClientRect();
        return rect.top + window.scrollY;
      }
      const wrapper = scrollerRef.current!;
      const rect = el.getBoundingClientRect();
      const wrect = wrapper.getBoundingClientRect();
      return rect.top - wrect.top + wrapper.scrollTop;
    },
    [useWindowScroll]
  );

  const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const prog = useCallback(
    (x: number, a: number, b: number) => (a === b ? 1 : clamp01((x - a) / (b - a))),
    []
  );

  /** Anchor Y (posisi target top kartu saat pin) */
  const anchorYFor = useCallback(
    (h: number, card: HTMLElement) => {
      if (align === "center") {
        return (h - card.offsetHeight) / 2;
      }
      // align === "top"
      return toPx(stackPosition, h);
    },
    [align, stackPosition, toPx]
  );

  /** Anchor untuk scale end */
  const scaleAnchorYFor = useCallback(
    (h: number, card: HTMLElement) => {
      if (align === "center") {
        return (h - card.offsetHeight) / 2;
      }
      return toPx(scaleEndPosition, h);
    },
    [align, scaleEndPosition, toPx]
  );

  const update = useCallback(() => {
    if (!cardsRef.current.length || busyRef.current) {
      tickingRef.current = false;
      return;
    }
    busyRef.current = true;

    const { top, h } = getScroll();

    // Scope ke instance ini
    const rootEl = hostRef.current!;
    const endEl = rootEl.querySelector(".scroll-stack-end") as HTMLElement | null;

    const fallbackEndEl = cardsRef.current[cardsRef.current.length - 1];
    const endTop = endEl
      ? (useWindowScroll ? endEl.getBoundingClientRect().top + window.scrollY : getOffset(endEl))
      : fallbackEndEl
      ? getOffset(fallbackEndEl) + fallbackEndEl.offsetHeight
      : 0;

    // Hitung topIdx sekali per frame (pakai anchor sesuai mode)
    let topIdx = 0;
    if (blurAmount || fadeAmount > 0) {
      for (let j = 0; j < cardsRef.current.length; j++) {
        const cardJ = cardsRef.current[j]!;
        const aj = anchorYFor(h, cardJ);
        const jt = getOffset(cardJ);
        const js = jt - aj - itemStackDistance * j;
        if (top >= js) topIdx = j;
        else break;
      }
    }

    cardsRef.current.forEach((card, i) => {
      const anchorY = anchorYFor(h, card);
      const scaleAnchorY = scaleAnchorYFor(h, card);

      const cardTop = getOffset(card);
      const start = cardTop - anchorY - itemStackDistance * i;
      const end = cardTop - scaleAnchorY;
      const pinStart = start;

      // Saat align="center", rilis saat spacer melewati tengah viewport
      const pinEnd = Math.max(endTop - h / 2, pinStart + 1);

      const p = prog(top, start, end);
      const sTarget = baseScale + i * itemScale;
      const s = 1 - p * (1 - sTarget);
      const r = rotationAmount ? i * rotationAmount * p : 0;

      let b = 0;
      if (blurAmount && i < topIdx) b = Math.max(0, (topIdx - i) * blurAmount);

      // Fade kartu di belakang kartu aktif untuk kurangi "ghost layers"
      let o = 1;
      if (fadeAmount > 0 && i < topIdx) {
        const depth = topIdx - i;
        o = Math.max(0, 1 - depth * fadeAmount);
      }

      let y = 0;
      const pinned = top >= pinStart && top <= pinEnd;
      if (pinned) y = top - cardTop + anchorY + itemStackDistance * i;
      else if (top > pinEnd) y = pinEnd - cardTop + anchorY + itemStackDistance * i;

      const tr = {
        y: Math.round(y * 100) / 100,
        s: Math.round(s * 1000) / 1000,
        r: Math.round(r * 100) / 100,
        b: Math.round(b * 100) / 100,
        o: Math.round(o * 1000) / 1000,
      };

      const last = lastTRef.current.get(i);
      const changed =
        !last ||
        Math.abs(last.y - tr.y) > 0.1 ||
        Math.abs(last.s - tr.s) > 0.001 ||
        Math.abs(last.r - tr.r) > 0.1 ||
        Math.abs(last.b - tr.b) > 0.1 ||
        Math.abs(last.o - tr.o) > 0.001;

      if (changed) {
        card.style.transform = `translate3d(0, ${tr.y}px, 0) scale(${tr.s}) rotate(${tr.r}deg)`;
        card.style.filter = tr.b > 0 ? `blur(${tr.b}px)` : "";
        card.style.opacity = `${tr.o}`;
        card.style.willChange = "transform, filter, opacity";
        card.style.transformOrigin = "top center";
        card.style.backfaceVisibility = "hidden";
        lastTRef.current.set(i, tr);
      }

      // z-index: kartu lebih depan berada di atas
      // (nilai besar untuk depan, tidak mengganggu layout lain)
      card.style.zIndex = String(1000 + (cardsRef.current.length - i));

      // callback kartu terakhir
      if (i === cardsRef.current.length - 1) {
        const inView = top >= pinStart && top <= pinEnd;
        if (inView && !doneRef.current) {
          doneRef.current = true;
          onStackComplete?.();
        } else if (!inView && doneRef.current) {
          doneRef.current = false;
        }
      }
    });

    busyRef.current = false;
    tickingRef.current = false;
  }, [
    baseScale,
    blurAmount,
    fadeAmount,
    getOffset,
    getScroll,
    itemScale,
    itemStackDistance,
    onStackComplete,
    rotationAmount,
    scaleEndPosition,
    stackPosition,
    toPx,
    prog,
    align,
    anchorYFor,
    scaleAnchorYFor,
    useWindowScroll,
  ]);

  const onScroll = useCallback(() => {
    if (lenisRef.current) {
      update();
      return;
    }
    if (!tickingRef.current) {
      tickingRef.current = true;
      requestAnimationFrame(() => update());
    }
  }, [update]);

  /** =========================
   * Init Lenis via dynamic import
   * ========================= */
  const initLenis = useCallback(() => {
    if (!enableLenis || prefersReduced) return;
    if (!LenisCtorRef.current) return;
    if (lenisRef.current) return;

    const Ctor = LenisCtorRef.current;

    if (useWindowScroll) {
      const lenis = new Ctor({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });
      lenis.on("scroll", onScroll);
      const raf = (time: number) => {
        lenis.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      };
      rafRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;
      return;
    }

    const wrapper = scrollerRef.current;
    if (!wrapper) return;

    const lenis = new Ctor({
      wrapper,
      content: wrapper.querySelector(".scroll-stack-inner") ?? undefined,
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      normalizeWheel: true,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.075,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      touchInertia: 0.6,
    });
    lenis.on("scroll", onScroll);
    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);
    lenisRef.current = lenis;
  }, [enableLenis, prefersReduced, onScroll, useWindowScroll]);

  // dynamic import lenis sekali (client only)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!enableLenis || prefersReduced) return;
      try {
        const mod = await import("lenis");
        if (!mounted) return;

        type LenisModule = { default: unknown } | Record<string, unknown>;
        const maybe = mod as LenisModule;

        const ctor =
          maybe && "default" in maybe && typeof maybe.default === "function"
            ? (maybe.default as LenisConstructor)
            : undefined;

        if (ctor) {
          LenisCtorRef.current = ctor;
          initLenis();
        }
      } catch {
        // fallback ke native scroll
      }
    })();
    return () => {
      mounted = false;
    };
  }, [enableLenis, prefersReduced, initLenis]);

  // Kumpulkan kartu dalam scope instance ini
  useLayoutEffect(() => {
    const scope = hostRef.current!;
    const cards = Array.from(scope.querySelectorAll(":scope .scroll-stack-card")) as HTMLElement[];
    cardsRef.current = cards;

    // Gaya dasar kartu
    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = "transform, filter, opacity";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
      card.style.transform = "translateZ(0)";
      // z-index awal (akan diupdate di update())
      card.style.zIndex = String(1000 + (cards.length - i));
    });

    // Tanpa Lenis → listener native (coalesced)
    if (!lenisRef.current) {
      const el: Window | HTMLElement | null = useWindowScroll ? window : scrollerRef.current;
      const handler = () => onScroll();
      el?.addEventListener("scroll", handler as EventListener, { passive: true } as AddEventListenerOptions);
      update();

      const onResize = () => onScroll();
      window.addEventListener("resize", onResize as EventListener, { passive: true } as AddEventListenerOptions);

      return () => {
        el?.removeEventListener("scroll", handler as EventListener);
        window.removeEventListener("resize", onResize as EventListener);
        cardsRef.current = [];
        lastTRef.current.clear();
        doneRef.current = false;
        tickingRef.current = false;
      };
    }

    // Dengan Lenis
    update();

    return () => {
      cardsRef.current = [];
      lastTRef.current.clear();
      doneRef.current = false;
      tickingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    update,
    onScroll,
  ]);

  // Cleanup Lenis/RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (lenisRef.current) {
        try {
          lenisRef.current.off?.("scroll", onScroll);
        } catch {}
        try {
          lenisRef.current.destroy();
        } catch {}
      }
      lenisRef.current = null;
    };
  }, [onScroll]);

  // Reduced motion → render biasa (tanpa transform)
  if (prefersReduced) {
    return (
      <div ref={hostRef} className={["relative w-full", className].join(" ")}>
        <div className="relative w-full">
          {children}
          <div
            className="scroll-stack-end"
            style={{ height: typeof endSpacer === "number" ? `${endSpacer}px` : String(endSpacer) }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      className={["relative w-full", className].join(" ")}
      data-window-scroll={useWindowScroll ? "true" : "false"}
    >
      <div
        ref={useWindowScroll ? undefined : scrollerRef}
        className={["relative w-full", useWindowScroll ? "overflow-visible" : "overflow-auto"].join(" ")}
      >
        <div className="scroll-stack-inner relative w-full">
          {children}
          {/* spacer agar pin terakhir release mulus — configurable */}
          <div
            className="scroll-stack-end"
            style={{ height: typeof endSpacer === "number" ? `${endSpacer}px` : String(endSpacer) }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScrollStack;
