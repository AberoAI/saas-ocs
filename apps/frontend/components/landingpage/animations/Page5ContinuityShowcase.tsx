// apps/frontend/components/landingpage/animations/Page5ContinuityShowcase.tsx
"use client";

import * as React from "react";
import { useLocale } from "next-intl";

type Locale = "en" | "tr";

type Bubble = {
  side: "customer" | "ai";
  text: string;
  time: string; // HH:mm
};

type Phase = {
  id: "phase1" | "phase2" | "phase3";
  title: { en: string; tr: string };
  startTime: string;
  bubbles: { en: Bubble[]; tr: Bubble[] };
};

const PHASES: Phase[] = [
  {
    id: "phase1",
    title: { en: "Today", tr: "Bugün" },
    startTime: "10:00",
    bubbles: {
      en: [
        {
          side: "customer",
          text: "Hi, I’d like to ask about the treatment process and availability.",
          time: "10:00",
        },
        {
          side: "ai",
          text:
            "Thanks for reaching out.\n\n" +
            "I can help with general information and guide you through the next steps.",
          time: "10:00",
        },
      ],
      tr: [
        {
          side: "customer",
          text: "Merhaba, tedavi süreci ve randevu uygunluğu hakkında bilgi almak istiyorum.",
          time: "10:00",
        },
        {
          side: "ai",
          text:
            "Bizimle iletişime geçtiğiniz için teşekkür ederiz.\n\n" +
            "Genel bilgileri paylaşabilir ve sonraki adımlar konusunda size rehberlik edebilirim.",
          time: "10:00",
        },
      ],
    },
  },
  {
    id: "phase2",
    title: { en: "1 week after treatment", tr: "Tedaviden 1 Hafta Sonra" },
    startTime: "14:00",
    bubbles: {
      en: [
        {
          side: "customer",
          text: "Hi, it’s been a week since my treatment.",
          time: "14:00",
        },
        {
          side: "customer",
          text: "I’m still feeling some discomfort and I’d like to talk directly with a consultant.",
          time: "14:00",
        },
        {
          side: "ai",
          text: "Hi Austin, thanks for reaching out.",
          time: "14:00",
        },
        {
          side: "ai",
          text: "I see you’re one week into your recovery, and ongoing discomfort at this stage is something we take seriously.",
          time: "14:00",
        },
        {
          side: "ai",
          text: "I’m connecting you with a care consultant now so you can get direct guidance.",
          time: "14:00",
        },
      ],
      tr: [
        {
          side: "customer",
          text: "Merhaba, tedavimin üzerinden bir hafta geçti.",
          time: "14:00",
        },
        {
          side: "customer",
          text: "Hâlâ bir miktar rahatsızlık hissediyorum ve doğrudan bir danışmanla görüşmek istiyorum.",
          time: "14:00",
        },
        {
          side: "ai",
          text: "Merhaba Austin, bizimle tekrar iletişime geçtiğiniz için teşekkür ederiz.",
          time: "14:00",
        },
        {
          side: "ai",
          text: "İyileşme sürecinizin ilk haftasında olduğunuzu görüyorum. Bu aşamada devam eden rahatsızlıklar dikkatle değerlendirilir.",
          time: "14:00",
        },
        {
          side: "ai",
          text: "Sizi şimdi bir bakım danışmanına yönlendiriyorum, böylece doğrudan destek alabilirsiniz.",
          time: "14:00",
        },
      ],
    },
  },
  {
    id: "phase3",
    title: { en: "1 month later", tr: "1 Ay Sonra" },
    startTime: "10:00",
    bubbles: {
      en: [
        {
          side: "ai",
          text:
            "Hi Austin, just checking in to see how you’ve been feeling since your treatment.\n\n" +
            "Is the discomfort you mentioned earlier still present?",
          time: "10:00",
        },
        {
          side: "customer",
          text: "It’s much better now, thank you.",
          time: "10:00",
        },
      ],
      tr: [
        {
          side: "ai",
          text:
            "Merhaba Austin, tedavinizden bu yana nasıl hissettiğinizi kontrol etmek istedik.\n\n" +
            "Daha önce bahsettiğiniz rahatsızlık hâlâ devam ediyor mu?",
          time: "10:00",
        },
        {
          side: "customer",
          text: "Şu anda çok daha iyi hissediyorum, teşekkür ederim.",
          time: "10:00",
        },
      ],
    },
  },
];

function clampLocale(locale: string): Locale {
  return locale === "tr" ? "tr" : "en";
}

function BaseBubble({
  alignClass,
  text,
  time,
  bg,
  fg,
  metaOpacity,
  showChecks,
}: {
  alignClass: "self-start" | "self-end";
  text: string;
  time: string;
  bg: string;
  fg: string;
  metaOpacity: number;
  showChecks: boolean;
}) {
  return (
    <div
      className={[
        "inline-grid",
        "grid-cols-[1fr_auto]",
        "gap-x-2",
        "max-w-[76%]",
        "rounded-[12px]",
        "px-4",
        "pt-2.5",
        "pb-2",
        "text-[14px]",
        "leading-[1.25]",
        "break-words",
        alignClass,
      ].join(" ")}
      style={{
        backgroundColor: bg,
        color: fg,
        overflowWrap: "anywhere",
      }}
    >
      {/* Text (left column) */}
      <div className="min-w-0 whitespace-pre-line">{text}</div>

      {/* Meta (right column), pinned bottom-right deterministically */}
      <div
        className="inline-flex items-center gap-1.5 whitespace-nowrap select-none justify-self-end self-end"
        aria-hidden="true"
      >
        <span
          className="text-[11px] leading-[1]"
          style={{
            opacity: metaOpacity,
            color: fg,
          }}
        >
          {time}
        </span>

        {showChecks ? (
          <img
            src="/icons/DoubleChecklist.svg"
            alt=""
            aria-hidden="true"
            className="h-[15px] w-[15px] shrink-0 block"
            style={{ opacity: 0.85 }}
          />
        ) : null}
      </div>
    </div>
  );
}

function CustomerBubble({ text, time }: { text: string; time: string }) {
  return (
    <BaseBubble
      alignClass="self-start"
      text={text}
      time={time}
      bg="#EBEBEB"
      fg="#2F2F2F"
      metaOpacity={0.65}
      showChecks={false}
    />
  );
}

function AIBubble({ text, time }: { text: string; time: string }) {
  return (
    <BaseBubble
      alignClass="self-end"
      text={text}
      time={time}
      bg="#26658C"
      fg="#FFFFFF"
      metaOpacity={0.78}
      showChecks={true}
    />
  );
}

function BubbleCard({
  side,
  text,
  time,
}: {
  side: "customer" | "ai";
  text: string;
  time: string;
}) {
  return side === "customer" ? (
    <CustomerBubble text={text} time={time} />
  ) : (
    <AIBubble text={text} time={time} />
  );
}

/**
 * FloorShadow (ambient “floor” oval)
 * - absolute; does not affect layout
 * - anchored to a FIXED-height viewport wrapper (deterministic across phases)
 * - lowered further: bottom -104px
 */
function FloorShadow() {
  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none",
        "absolute",
        "left-1/2",
        // LOWER further
        "bottom-[-104px]",
        "-translate-x-1/2",
        "z-0",
        "h-[52px]",
      ].join(" ")}
      style={{
        width: "min(760px, 78%)",
        background:
          "radial-gradient(ellipse at center, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 70%)",
      }}
    />
  );
}

export default function Page5ContinuityShowcase() {
  const localeRaw = useLocale();
  const locale = clampLocale(localeRaw);

  const [phaseIndex, setPhaseIndex] = React.useState(0);
  const [visibleCount, setVisibleCount] = React.useState(1);

  const phase = PHASES[phaseIndex];
  const bubbles = phase.bubbles[locale];
  const maxBubbles = bubbles.length;

  // Slower pacing (2x slower than current)
  const BUBBLE_REVEAL_MS = 1700; // was 850
  const PHASE_HOLD_MS = 2400; // was 1200

  React.useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;

    if (visibleCount < maxBubbles) {
      t = setTimeout(() => setVisibleCount((v) => v + 1), BUBBLE_REVEAL_MS);
      return () => {
        if (t) clearTimeout(t);
      };
    }

    t = setTimeout(() => {
      setPhaseIndex((p) => (p + 1) % PHASES.length);
      setVisibleCount(1);
    }, PHASE_HOLD_MS);

    return () => {
      if (t) clearTimeout(t);
    };
  }, [visibleCount, maxBubbles]);

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[640px] px-4">
        <div
          className={[
            "relative",
            "mx-auto",
            "w-full",
            "rounded-[18px]",
            "overflow-hidden",
            // Increase card height to avoid clipping after lowering shadow further
            "h-[520px]",
            "md:h-[540px]",
          ].join(" ")}
          style={{
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* title */}
          <div className="pt-8 pb-6 text-center">
            <div
              className="text-[15px] md:text-[16px] font-medium"
              style={{ color: "rgba(47,47,47,0.55)" }}
            >
              {phase.title[locale]}
            </div>
          </div>

          {/* chat area (FIXED height) */}
          <div className="px-5 md:px-7 pb-10">
            <div className="mx-auto w-full max-w-[540px]">
              {/* FIXED viewport wrapper becomes the positioning context */}
              <div className="relative h-[260px] md:h-[280px]">
                <FloorShadow />

                <div
                  className={[
                    "relative",
                    "z-10",
                    "flex",
                    "flex-col",
                    "gap-3",
                    "md:gap-4",
                    "h-full",
                  ].join(" ")}
                >
                  {bubbles.slice(0, visibleCount).map((b, idx) => {
                    const isCustomer = b.side === "customer";
                    return (
                      <div
                        key={`${phase.id}-${idx}`}
                        className={[
                          "animate-[fadeUp_240ms_ease-out]",
                          "flex",
                          isCustomer ? "justify-start" : "justify-end",
                        ].join(" ")}
                      >
                        <BubbleCard side={b.side} text={b.text} time={b.time} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
