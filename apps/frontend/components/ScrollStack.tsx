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
 * Minimal typings untuk Lenis (opsional, tetap dipertahankan)
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

/** =========================================================
 * Item kartu: abu-abu pucat, border halus, shadow ringan.
 * ========================================================= */
export const ScrollStackItem: React.FC<
  PropsWithChildren<{ itemClassName?: string }>
> = ({ children, itemClassName = "" }) => (
  <div
    className={[
      "scroll-stack-card",
      // abu-abu pucat
      "relative w-full rounded-[22px] bg-gray-50 border border-gray-200",
      // halus & ringan
      "shadow-[0_18px_40px_-16px_rgba(0,0,0,0.12)]",
      itemClassName,
    ].join(" ")}
  >
    {children}
  </div>
);

/** =========================================================
 * Props publik (dipertahankan), beberapa tidak dipakai bila
 * tidak relevan dengan animasi yang baru.
 * ========================================================= */
export type ScrollStackProps = {
  className?: string;
  itemDistance?: number;        // jarak natural antar kartu (layout)
  itemScale?: number;           // pengurangan skala per kedalaman
  itemStackDistance?: number;   // offset visual saat ditumpuk
  stackPosition?: number | string;  // posisi pin (px atau %)
  scaleEndPosition?: number | string; // tidak dipakai di versi ini
  baseScale?: number;           // skala kartu aktif
  rotationAmount?: number;      // tidak dipakai (0)
  blurAmount?: number;          // tidak dipakai (0)
  useWindowScroll?: boolean;
  enableLenis?: boolean;
  endSpacer?: number | string;  // spacer pelepas pin di akhir
  align?: "top" | "center";     // posisi pin (pakai 'top' agar stabil)
  fadeAmount?: number;          // tidak dipakai (logika baru fixed)
  backgrounds?: string[];       // diabaikan (base putih)
  backgroundOverlayClassName?: string; // diabaikan
  onStackComplete?: VoidFn;
};

/** =========================================================
 * Inti stack:
 * - Base putih (tanpa background image).
 * - Menampilkan 1 layer aktif + 2 layer di belakang dengan fade.
 * - Layer lebih dari 2 di belakang -> menghilang.
 * - Saat scroll naik/turun terjadi transisi silang (cross-fade/slide)
 *   antara aktif dan kandidat berikut/previous.
 * ========================================================= */
const ScrollStack: React.FC<React.PropsWithChildren<ScrollStackProps>> = ({
  children,
  className = "",
  itemDistance = 110,
  itemScale = 0.04,
  itemStackDistance = 18,
  stackPosition = "18%",
  // scaleEndPosition ignored (pinning sederhana)
  baseScale = 1,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = true,
  enableLenis = true,
  endSpacer = "18vh",
  align = "top",
  // fadeAmount ignored (kita pakai nilai tetap)
  // backgrounds ignored (base putih)
  // backgroundOverlayClassName ignored
  onStackComplete,
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Lenis (opsional)
  const LenisCtorRef = useRef<LenisConstructor | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const cardsRef = useRef<HTMLElement[]>([]);
  const transformsRef = useRef<Map<number, string>>(new Map());
  const lastOpacityRef = useRef<Map<number, number>>(new Map());
  const tickingRef = useRef(false);
  const lastScrollTopRef = useRef(0);
  const doneRef = useRef(false);

  // prefers-reduced-motion
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
    return typeof v === "string" && v.includes("%")
      ? (parseFloat(v) / 100) * h
      : Number(v);
  }, []);

  const getScroll = useCallback(() => {
    if (useWindowScroll) {
      return { top: window.scrollY, h: window.innerHeight };
    }
    const el = scrollerRef.current!;
    return { top: el.scrollTop, h: el.clientHeight };
  }, [useWindowScroll]);

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
  const prog = (x: number, a: number, b: number) =>
    a === b ? 1 : clamp01((x - a) / (b - a));

  /** ---------------------------------------------------------
   * Mesin layout:
   *   - kartu dipin di anchorY
   *   - tentukan activeIdx dari scroll position
   *   - tampilkan: active, active-1, active-2
   *   - transisi silang antara active dan active+1
   * -------------------------------------------------------- */
  const update = useCallback(() => {
    if (!cardsRef.current.length) {
      tickingRef.current = false;
      return;
    }

    const { top, h } = getScroll();
    const dir =
      top > lastScrollTopRef.current ? 1 : top < lastScrollTopRef.current ? -1 : 0;
    lastScrollTopRef.current = top;

    const anchorY = (card: HTMLElement) => {
      if (align === "center") return (h - card.offsetHeight) / 2;
      return toPx(stackPosition, h);
    };

    // 1) Tentukan index aktif berdasarkan "start lines"
    let activeIdx = 0;
    const starts: number[] = [];
    cardsRef.current.forEach((card, i) => {
      const start = getOffset(card) - anchorY(card) - itemStackDistance * i;
      starts.push(start);
      if (top >= start) activeIdx = i;
    });
    activeIdx = Math.min(activeIdx, cardsRef.current.length - 1);

    // progress silang menuju kartu berikutnya
    const nextIdx = Math.min(activeIdx + 1, cardsRef.current.length - 1);
    const cross = prog(top, starts[activeIdx], starts[nextIdx] ?? starts[activeIdx]);

    // 2) apply transform per kartu
    cardsRef.current.forEach((card, i) => {
      // default: sembunyikan
      let scale = baseScale;
      let ty = 0;
      let opacity = 0;
      let z = 0;

      // kedalaman relatif thd activeIdx
      const depth = activeIdx - i; // 0 = aktif, 1 = satu di belakang, dst.
      const isIncoming = i === activeIdx + 1;

      if (i > activeIdx + 1) {
        // Belum saatnya tampil (di depan): sembunyikan di bawah sedikit
        scale = baseScale;
        ty = 40;
        opacity = 0;
        z = 500 + (cardsRef.current.length - i);
      } else if (depth === 0) {
        // kartu aktif → transisi ke belakang saat cross naik
        const backSlide = itemStackDistance * cross;
        const backScale = baseScale - itemScale * cross;
        scale = backScale;
        ty = backSlide;
        opacity = 1 - 0.08 * cross;
        z = 1000; // paling atas saat ini
      } else if (depth === 1) {
        // satu di belakang aktif
        // saat cross penuh, akan jadi depth=2
        const extra = itemStackDistance * cross;
        scale = baseScale - itemScale * (1 + cross);
        ty = itemStackDistance * (1 + cross);
        opacity = 0.7 - 0.15 * cross;
        z = 999 - 1;
      } else if (depth === 2) {
        // dua di belakang aktif (maks yang masih terlihat)
        scale = baseScale - itemScale * 2;
        ty = itemStackDistance * 2;
        opacity = 0.42;
        z = 999 - 2;
      } else if (depth > 2) {
        // lebih dari dua di belakang → hilang
        scale = baseScale - itemScale * 3;
        ty = itemStackDistance * 3;
        opacity = 0;
        z = 10;
      }

      if (isIncoming) {
        // kartu yang akan masuk (active+1) naik dari bawah & fade-in
        const inTy = itemStackDistance * (1 - cross);
        const inScale = baseScale - itemScale * (1 - cross);
        scale = inScale;
        ty = inTy;
        opacity = 0.25 + 0.75 * cross;
        z = 1001; // naik menutup aktif saat cross→1
      }

      const transform = `translate3d(0, ${ty}px, 0) scale(${scale})`;
      if (rotationAmount) card.style.rotate = `${rotationAmount}deg`; // default 0

      if (transformsRef.current.get(i) !== transform) {
        card.style.transform = transform;
        transformsRef.current.set(i, transform);
      }
      if (lastOpacityRef.current.get(i) !== opacity) {
        card.style.opacity = String(opacity);
        lastOpacityRef.current.set(i, opacity);
      }
      card.style.willChange = "transform, opacity";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
      card.style.zIndex = String(z);
      if (blurAmount) card.style.filter = depth >= 1 ? `blur(${Math.min(blurAmount * depth, 6)}px)` : "";
      // pinning: posisikan secara visual di anchor (menggunakan translateY di atas),
      // posisi dokumen tetap menggunakan flow (margin bottom).
    });

    // callback saat terakhir pinned
    if (activeIdx === cardsRef.current.length - 1 && !doneRef.current) {
      doneRef.current = true;
      onStackComplete?.();
    }
    if (activeIdx < cardsRef.current.length - 1 && doneRef.current) {
      doneRef.current = false;
    }

    tickingRef.current = false;
  }, [
    align,
    baseScale,
    blurAmount,
    getOffset,
    getScroll,
    itemScale,
    itemStackDistance,
    onStackComplete,
    rotationAmount,
    stackPosition,
    toPx,
  ]);

  const onScroll = useCallback(() => {
    if (lenisRef.current) {
      update();
      return;
    }
    if (!tickingRef.current) {
      tickingRef.current = true;
      requestAnimationFrame(update);
    }
  }, [update]);

  /** Lenis (opsional) — tetap dipertahankan agar smooth, tapi tidak wajib */
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!enableLenis || prefersReduced) return;
      try {
        const mod = await import("lenis");
        if (!mounted) return;
        const maybe = mod as { default?: unknown };
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

  useLayoutEffect(() => {
    const scope = hostRef.current!;
    const cards = Array.from(
      scope.querySelectorAll(":scope .scroll-stack-card")
    ) as HTMLElement[];
    cardsRef.current = cards;

    // siapkan margin antar kartu (flow dokumen)
    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      // reset awal
      card.style.opacity = "0";
      card.style.transform = "translate3d(0, 40px, 0) scale(1)";
      card.style.willChange = "transform, opacity";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
    });

    // event scroll/resize
    const el: Window | HTMLElement | null = useWindowScroll
      ? window
      : scrollerRef.current;
    const handler = () => onScroll();
    el?.addEventListener("scroll", handler as EventListener, {
      passive: true,
    } as AddEventListenerOptions);

    const onResize = () => onScroll();
    window.addEventListener("resize", onResize as EventListener, {
      passive: true,
    } as AddEventListenerOptions);

    // initial paint
    requestAnimationFrame(update);

    return () => {
      el?.removeEventListener("scroll", handler as EventListener);
      window.removeEventListener("resize", onResize as EventListener);
      cardsRef.current = [];
      transformsRef.current.clear();
      lastOpacityRef.current.clear();
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    baseScale,
    useWindowScroll,
    onScroll,
    update,
  ]);

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

  if (prefersReduced) {
    // fallback: tampilkan kartu biasa (tanpa animasi)
    return (
      <div ref={hostRef} className={["relative w-full", className].join(" ")}>
        <div className="relative w-full">{children}</div>
        <div
          className="scroll-stack-end"
          style={{
            height:
              typeof endSpacer === "number" ? `${endSpacer}px` : String(endSpacer),
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      className={["relative w-full bg-white", className].join(" ")}
      data-window-scroll={useWindowScroll ? "true" : "false"}
    >
      <div
        ref={useWindowScroll ? undefined : scrollerRef}
        className={[
          "relative w-full",
          useWindowScroll ? "overflow-visible" : "overflow-auto",
          "bg-white",
        ].join(" ")}
      >
        <div className="scroll-stack-inner relative w-full">
          {children}
          <div
            className="scroll-stack-end"
            style={{
              height:
                typeof endSpacer === "number" ? `${endSpacer}px` : String(endSpacer),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ScrollStack;
