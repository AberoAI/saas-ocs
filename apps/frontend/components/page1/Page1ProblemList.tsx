// apps/frontend/components/page1/Page1ProblemList.tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

function splitFirstWord(text: string) {
  const [first, ...rest] = text.split(" ");
  return {
    first,
    rest: rest.join(" "),
  };
}

// Helper untuk memaksa "first" tertentu jika prefix-nya cocok,
// tapi tetap memakai sisa text asli dari translation.
function splitWithPreferredFirst(text: string, preferredFirst: string) {
  const prefix = preferredFirst + " ";
  if (text.startsWith(prefix)) {
    return {
      first: preferredFirst,
      rest: text.slice(prefix.length),
    };
  }

  // Fallback aman kalau copy berubah
  return splitFirstWord(text);
}

// Helper untuk memecah text sesuai kebutuhan warna EN/TR
function splitByLocale(text: string, index: number, locale: string) {
  // Versi English
  if (locale === "en") {
    if (index === 0) {
      // "Patients wait too long for replies"
      return splitWithPreferredFirst(text, "Patients");
    }
    if (index === 1) {
      // "Conversation data gets scattered"
      return splitWithPreferredFirst(text, "Conversation");
    }
    if (index === 2) {
      // "Follow-up after treatment becomes weak"
      return splitWithPreferredFirst(text, "Follow-up");
    }
    if (index === 3) {
      // "Time zone differences slow coordination"
      return splitWithPreferredFirst(text, "Time zone");
    }
  }

  // Versi Turkish
  if (locale === "tr") {
    if (index === 0) {
      // "Hastalar yanıt almak için çok uzun süre bekliyor"
      return splitWithPreferredFirst(text, "Hastalar");
    }
    if (index === 1) {
      // "Konuşma verileri farklı yerlere dağılıyor"
      return splitWithPreferredFirst(text, "Konuşma");
    }
    if (index === 2) {
      // "Tedavi sonrası takip zayıflıyor"
      return splitWithPreferredFirst(text, "Tedavi sonrası");
    }
    if (index === 3) {
      // "Zaman farkları koordinasyonu yavaşlatıyor"
      return splitWithPreferredFirst(text, "Zaman farkları");
    }
  }

  // Fallback aman kalau locale lain / urutan/copy berubah
  return splitFirstWord(text);
}

// Map jarak dari bubble aktif ke opacity
// 0 → 100, 1 → 80, 2 → 60, >=3 → 40
function getOpacityClass(distance: number) {
  if (distance === 0) return "opacity-100";
  if (distance === 1) return "opacity-80";
  if (distance === 2) return "opacity-60";
  return "opacity-40";
}

/**
 * Drop shadow rule spesifik untuk 4 bubble:
 *
 * Index: 0,1,2,3  (bubble 1–4)
 *
 * Saat 0 aktif:
 *  - 1: y15 blur40
 *  - 2: y15 blur20
 *  - 3: y8 blur5 (opacity sangat rendah)
 *
 * Saat 1 aktif:
 *  - 0: y15 blur40
 *  - 2: y15 blur40
 *  - 3: y15 blur20
 *
 * Saat 2 aktif:
 *  - 0: y15 blur20
 *  - 1: y15 blur40
 *  - 3: y15 blur40
 *
 * Saat 3 aktif:
 *  - 0: y8 blur5 (opacity sangat rendah)
 *  - 1: y15 blur20
 *  - 2: y15 blur40
 *
 * Bubble aktif tetap memakai shadow highlight tersendiri.
 * Jika jumlah bubble bukan 4, fallback ke:
 *  - hanya bubble aktif yang punya shadow.
 */
function getShadowClass(
  activeIndex: number,
  index: number,
  total: number
): string {
  // Bubble aktif: highlight utama
  if (index === activeIndex) {
    return "shadow-[0_24px_60px_rgba(15,23,42,0.16)]";
  }

  // Fallback kalau bukan 4 item → hanya active yang punya shadow
  if (total !== 4) {
    return "shadow-none";
  }

  // 4 bubble: mapping sesuai aturan
  if (activeIndex === 0) {
    // bubble 1 aktif
    if (index === 1) return "shadow-[0_15px_40px_rgba(15,23,42,0.11)]"; // 2nd
    if (index === 2) return "shadow-[0_15px_20px_rgba(15,23,42,0.07)]"; // 3rd
    if (index === 3) return "shadow-[0_8px_5px_rgba(15,23,42,0.015)]"; // 4th → blur5, opacity sangat rendah
  }

  if (activeIndex === 1) {
    // bubble 2 aktif
    if (index === 0) return "shadow-[0_15px_40px_rgba(15,23,42,0.11)]"; // 1st
    if (index === 2) return "shadow-[0_15px_40px_rgba(15,23,42,0.11)]"; // 3rd
    if (index === 3) return "shadow-[0_15px_20px_rgba(15,23,42,0.07)]"; // 4th
  }

  if (activeIndex === 2) {
    // bubble 3 aktif
    if (index === 0) return "shadow-[0_15px_20px_rgba(15,23,42,0.07)]"; // 1st
    if (index === 1) return "shadow-[0_15px_40px_rgba(15,23,42,0.11)]"; // 2nd
    if (index === 3) return "shadow-[0_15px_40px_rgba(15,23,42,0.11)]"; // 4th
  }

  if (activeIndex === 3) {
    // bubble 4 aktif
    if (index === 0) return "shadow-[0_8px_5px_rgba(15,23,42,0.015)]"; // 1st → blur5, opacity sangat rendah
    if (index === 1) return "shadow-[0_15px_20px_rgba(15,23,42,0.07)]"; // 2nd
    if (index === 2) return "shadow-[0_15px_40px_rgba(15,23,42,0.11)]"; // 3rd
  }

  // Default aman
  return "shadow-none";
}

// Scale tetap halus—fisik utama datang dari padding & text size
function getScaleClass(distance: number) {
  if (distance === 0) return "scale-100";
  if (distance === 1) return "scale-[0.97]";
  if (distance === 2) return "scale-[0.95]";
  return "scale-[0.93]";
}

export default function Page1ProblemList() {
  const t = useTranslations("page1");
  const locale = useLocale();
  const problems = t.raw("body") as string[];

  const [activeIndex, setActiveIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || problems.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % problems.length);
    }, 2800); // ~2.8 detik per bubble, ritme tenang

    return () => clearInterval(interval);
  }, [hasMounted, problems.length, isPaused]);

  // Selama SSR & render pertama di client, pakai index 0 (statik)
  const effectiveActiveIndex = hasMounted ? activeIndex : 0;

  // --- SCROLL INDICATOR CALC ---
  // Kita ingin thumb terlihat lebih panjang & stabil,
  // tapi tetap bergerak dari atas ke bawah tanpa keluar rail.
  const hasProblems = problems.length > 0;

  // Tinggi thumb dalam % dari rail:
  // - Untuk ≤4 item → sekitar 28% (lebih ramping dari sebelumnya)
  // - Untuk lebih banyak item → minimal 24%, atau 100/length (mana yang lebih besar)
  const thumbHeightPercent = hasProblems
    ? problems.length <= 4
      ? 28
      : Math.max(24, 100 / problems.length)
    : 0;

  // Jarak perpindahan antar posisi supaya bottom tidak pernah lewat 100%
  const thumbStep =
    hasProblems && problems.length > 1
      ? (100 - thumbHeightPercent) / (problems.length - 1)
      : 0;

  const thumbTopPercent = hasProblems ? thumbStep * effectiveActiveIndex : 0;

  return (
    <div className="flex items-center gap-4">
      {/* Stack kartu */}
      <div className="flex flex-col gap-2">
        {problems.map((problem, index) => {
          const { first, rest } = splitByLocale(problem, index, locale);
          const distance = Math.abs(index - effectiveActiveIndex);

          const isActive = distance === 0;
          const opacityClass = getOpacityClass(distance);
          const shadowClass = getShadowClass(
            effectiveActiveIndex,
            index,
            problems.length
          );
          const scaleClass = getScaleClass(distance);

          const baseClasses =
            "flex items-center rounded-full px-6 py-3.5 text-base backdrop-blur-sm border transition-all duration-300 transform origin-center";

          // Hanya atur background & border di sini, warna text diatur per-span
          const activeClasses = "bg-white/95 border-slate-100";
          const inactiveClasses = "bg-white/40 border-transparent";

          return (
            <div
              key={`${index}-${first}`}
              className={[
                baseClasses,
                isActive ? activeClasses : inactiveClasses,
                opacityClass,
                shadowClass,
                scaleClass,
              ].join(" ")}
              onMouseEnter={() => {
                setIsPaused(true);
                setActiveIndex(index);
              }}
              onMouseLeave={() => {
                setIsPaused(false);
              }}
            >
              <span className="truncate">
                <span
                  className={
                    (isActive ? "mr-1 font-semibold" : "mr-1 font-medium") +
                    " text-[#3A3A3A]"
                  }
                >
                  {first}
                </span>
                <span className="text-[#757575]">{rest}</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Scroll indicator */}
      <div
        className="relative w-[3px] rounded-full bg-slate-200/80 overflow-hidden"
        style={{ height: "215px" }}
      >
        <div
          className="absolute left-0 w-[3px] rounded-full bg-slate-400/80 transition-all duration-300"
          style={{
            top: `${thumbTopPercent}%`,
            height: `${thumbHeightPercent}%`,
          }}
        />
      </div>
    </div>
  );
}
