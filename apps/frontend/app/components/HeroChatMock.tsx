// apps/frontend/app/components/HeroChatMock.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroChatMock() {
  const [stage, setStage] = useState<"idle" | "typing1" | "bot1" | "typing2" | "bot2">("idle");
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setStage("typing1"), 250);
    const t2 = setTimeout(() => setStage("bot1"), 1100);
    const t3 = setTimeout(() => setStage("typing2"), 1500);
    const t4 = setTimeout(() => setStage("bot2"), 2350);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }, [stage]);

  return (
    <div className="relative">
      {/* background grid halus */}
      <div className="absolute inset-0 -z-10 rounded-[20px] bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[length:18px_18px]" />

      <div
        aria-label="AberoAI Mock Chat UI"
        className="mx-auto w-[340px] h-[360px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[400px] lg:w-[460px] lg:h-[420px] rounded-2xl ring-1 ring-black/10 bg-white/80 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/70 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/10 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar />
            <div>
              <div className="text-sm font-semibold">Your Company</div>
              <div className="text-[11px] font-medium text-black">Active now</div>
            </div>
          </div>
          {/* Hanya titik-tiga; call & video call dihilangkan */}
          <div className="flex items-center gap-2 text-black/60">
            <IconMore />
          </div>
        </div>

        {/* Body */}
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto bg-white"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          <div className="flex items-center gap-3 px-4 py-3 text-[11px] text-black/50">
            <div className="h-px flex-1 bg-black/10" />
            <span>Today 21:13</span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <div className="space-y-3 px-4 pb-3">
            <Msg side="user" time="21:13" status="read">
              Hi, can I ask about your products?
            </Msg>

            <Msg side="bot" time="21:13">
              Of course, Which product are you interested in?
            </Msg>

            <Msg side="user" time="21:13" status="read">
              I’d like to know your prices.
            </Msg>

            {stage === "typing1" && <TypingBubble />}

            {(stage === "bot1" || stage === "typing2" || stage === "bot2") && (
              <Msg side="bot" time="21:13">
                Our plans start at <strong>$19/month</strong>.
              </Msg>
            )}

            {stage === "typing2" && <TypingBubble />}

            {stage === "bot2" && (
              <>
                <Msg side="bot" time="21:13">
                  Would you like me to send you the full catalog or book a demo?
                </Msg>
                <div className="pl-2">
                  <span
                    className="inline-flex items-center gap-2 rounded-full bg-black text-white px-3 py-1 text-[10px] shadow-sm"
                    aria-label="AI response time under one second"
                  >
                    <span className="inline-flex items-center" aria-hidden="true">
                      <span className="mx-[1px] inline-block h-1.5 w-1.5 rounded-full bg-white/90 animate-bounce" />
                      <span className="mx-[1px] inline-block h-1.5 w-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:120ms]" />
                      <span className="mx-[1px] inline-block h-1.5 w-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:240ms]" />
                    </span>
                    AI replied in &lt;1s
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="mt-auto border-t border-black/10 bg-white/70 px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 rounded-full bg-white px-3 py-2 ring-1 ring-black/10">
              <IconPaperclip />
              <input
                readOnly
                aria-readonly="true"
                placeholder="Type a message here..."
                className="flex-1 bg-transparent text-[13px] outline-none placeholder-black/40"
              />
              <IconEmoji />
              <IconMic />
            </div>
            <button
              aria-label="Send"
              className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm hover:brightness-95 active:scale-95 transition"
              style={{ backgroundColor: "var(--brand, #26658C)" }}
            >
              <IconSend />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-2 text-center text-[10px] text-black/50">
        Works with WhatsApp Cloud API • Demo UI
      </p>
    </div>
  );
}

/* ========= Sub-komponen kecil ========= */

/* Avatar bersih: TANPA ring, TANPA halo.
   Trik: radial CSS mask "mencukur" ~0.6px tepi agar anti-aliasing tidak bleed. */
function Avatar() {
  const [err, setErr] = useState(false);

  return (
    <div className="relative">
      <div
        className={`grid h-9 w-9 place-items-center rounded-full overflow-hidden [isolation:isolate] ${
          err ? "bg-black/90 text-white" : ""
        }`}
        aria-label="Profile"
        style={{
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, #000 calc(100% - 0.6px), transparent 100%)",
          maskImage:
            "radial-gradient(circle at 50% 50%, #000 calc(100% - 0.6px), transparent 100%)",
        }}
      >
        {!err ? (
          <img
            src="/icons/company-avatar.svg?v=10"
            width={36}
            height={36}
            alt="Your Company avatar"
            className="block h-full w-full object-cover object-center select-none pointer-events-none will-change-transform"
            loading="eager"
            decoding="sync"
            draggable={false}
            onError={() => setErr(true)}
            style={{ transform: "translateZ(0)" }}
          />
        ) : (
          <span className="text-[11px] leading-none">YC</span>
        )}
      </div>
      <span
        className="absolute -bottom-0 -right-0 h-2.5 w-2.5 rounded-full border-2 border-white"
        style={{ backgroundColor: "var(--ok, #39FF14)" }}
        aria-label="Online"
      />
    </div>
  );
}

function Msg({
  side,
  children,
  color = "var(--brand, #26658C)",
  time,
  status,
  className,
}: {
  side: "user" | "bot";
  children: React.ReactNode;
  color?: string;
  time?: string;
  status?: "sent" | "delivered" | "read";
  className?: string;
}) {
  const isUser = side === "user";
  const metaTextClass = isUser ? "text-white" : "text-black/60";

  const basePR = 12;
  const extraForTime = time ? 26 : 0;
  const extraForTicks = isUser && status ? 18 : 0;
  const paddingRight = basePR + extraForTime + extraForTicks;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] px-3 py-2 text-[13px] shadow-sm rounded-2xl relative ${
          isUser ? "text-white" : "text-black"
        } ${className ?? ""}`}
        style={{ background: isUser ? color : "rgba(0,0,0,0.06)", paddingRight }}
      >
        <span>{children}</span>

        {(time || (isUser && status)) && (
          <span
            className={`absolute bottom-1 right-2 flex items-center gap-1 text-[10px] leading-none ${metaTextClass}`}
          >
            {time && <span>{time}</span>}
            {isUser && status && (
              <span className="inline-flex items-center align-middle leading-none" aria-label={status}>
                <InlineDoubleCheck className="w-[14px] h-[14px]" />
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

/* Typing indicator sebagai balon */
function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div
        className="inline-flex items-center gap-1 rounded-full bg-black/[0.06] px-3 py-2 text-[13px] text-black shadow-sm"
        role="status"
        aria-live="polite"
        aria-label="Assistant is typing"
      >
        <span className="sr-only">Assistant is typing…</span>
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-black/50 animate-bounce" aria-hidden="true" />
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-black/50 animate-bounce [animation-delay:120ms]"
          aria-hidden="true"
        />
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-black/50 animate-bounce [animation-delay:240ms]"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

/* Ikon minimal (ditandai dekoratif) */
function IconMore() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}
function IconCall() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12 .89 .3 1.76 .57 2.6a2 2 0 0 1-.45 2.11L9.1 10.9a16 16 0 0 0 4 4l1.46-1.13a2 2 0 0 1 2.11-.45c.84 .27 1.71 .45 2.6 .57A2 2 0 0 1 22 16.92Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function IconVideo() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M23 7l-7 5 7 5V7z" fill="currentColor" />
      <rect x="1" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconPaperclip() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12.5l-8.5 8.5a6 6 0 1 1-8.49-8.49L12 4.99a4 4 0 0 1 5.66 5.66L9.76 18.56a2 2 0 1 1-2.83-2.83L14 8.66"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconEmoji() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1.25" fill="currentColor" />
      <circle cx="15" cy="10" r="1.25" fill="currentColor" />
      <path d="M8 14c1 .8 2.3 1.2 4 1.2S15 14.8 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconMic() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="3" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ====== Paper plane putih via file SVG (ujung tajam, warna terkunci) ====== */
function IconSend() {
  return (
    <img
      src="/icons/paper-plane-white.svg"
      width={32}
      height={32}
      alt=""
      aria-hidden="true"
      decoding="async"
      draggable={false}
      style={{ display: "block" }}
    />
  );
}

/* ========= Double Check pakai file statis (warna & bentuk terkunci) ========= */
function InlineDoubleCheck({ className = "" }: { className?: string }) {
  return (
    <img
      src="/icons/DoubleChecklist.svg"
      width={14}
      height={14}
      className={className}
      alt=""
      aria-hidden="true"
      decoding="async"
      style={{ display: "block" }}
    />
  );
}
