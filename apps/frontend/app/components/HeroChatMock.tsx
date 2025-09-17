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
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
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
        <div className="flex items-center justify-between border-b border-black/10 bg-gradient-to-b from-white to-black/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar />
            <div>
              <div className="text-sm font-semibold">Your Company</div>
              <div className="text-[11px] font-medium text-black">Active now</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-black/60">
            <IconCall />
            <IconVideo />
            <IconMore />
          </div>
        </div>

        {/* Body */}
        <div ref={chatRef} className="flex-1 overflow-y-auto bg-white">
          <div className="flex items-center gap-3 px-4 py-3 text-[11px] text-black/50">
            <div className="h-px flex-1 bg-black/10" />
            <span>Today 7:00 PM</span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <div className="space-y-3 px-4 pb-3">
            <Msg side="user" color="#26658C" time="07:00" status="read">
              Hi, can I ask about your products?
            </Msg>

            <Msg side="bot" time="07:00">
              Of course, Which product are you interested in?
            </Msg>

            <Msg side="user" color="#26658C" time="07:00" status="read">
              I’d like to know your prices.
            </Msg>

            {stage === "typing1" && <TypingBubble />}

            {(stage === "bot1" || stage === "typing2" || stage === "bot2") && (
              <Msg side="bot" time="07:00">
                Our plans start at <strong>$19/month</strong>.
              </Msg>
            )}

            {stage === "typing2" && <TypingBubble />}

            {stage === "bot2" && (
              <>
                <Msg side="bot" time="07:00">
                  Would you like me to send you the full catalog or book a demo?
                </Msg>
                <div className="pl-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-black text-white px-3 py-1 text-[10px] shadow-sm">
                    <span className="inline-flex items-center">
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
                placeholder="Type a message here..."
                className="flex-1 bg-transparent text-[13px] outline-none placeholder-black/40"
              />
              <IconEmoji />
              <IconMic />
            </div>
            <button
              aria-label="Send"
              className="grid h-9 w-9 place-items-center rounded-full text-white shadow-sm hover:brightness-95 active:scale-95 transition"
              style={{ backgroundColor: "#26658C" }}
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

function Avatar() {
  return (
    <div className="relative">
      <div className="grid h-9 w-9 place-items-center rounded-full bg-black/90 text-white text-[11px]">
        YC
      </div>
      <span className="absolute -bottom-0 -right-0 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#39FF14" }} />
    </div>
  );
}

function Msg({
  side,
  children,
  color = "#26658C",
  time,
  status,
}: {
  side: "user" | "bot";
  children: React.ReactNode;
  color?: string;
  time?: string;
  status?: "sent" | "delivered" | "read";
}) {
  const isUser = side === "user";

  // Warna meta: user → putih, bot → abu
  const metaTextClass = isUser ? "text-white" : "text-black/60";

  // Sisihkan ruang kanan untuk jam & centang agar tidak overlap
  // Meta font-size = 10px; ikon 1.2–1.3em ≈ 12–13px.
  const basePR = 12;                  // padding dasar (px-3)
  const extraForTime = time ? 26 : 0; // ruang untuk "07:00"
  const extraForTicks = isUser && status ? 18 : 0; // pas untuk ikon 1.2–1.3em
  const paddingRight = basePR + extraForTime + extraForTicks;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] px-3 py-2 text-[13px] shadow-sm rounded-2xl relative ${
          isUser ? "text-white" : "text-black"
        }`}
        style={{
          background: isUser ? color : "rgba(0,0,0,0.06)",
          paddingRight,
        }}
      >
        <span>{children}</span>

        {(time || (isUser && status)) && (
          <span className={`absolute bottom-1 right-2 flex items-center gap-1 text-[10px] ${metaTextClass}`}>
            {time && <span>{time}</span>}
            {isUser && status && (
              // warna ikon mengikuti warna teks meta (currentColor)
              <span className="inline-flex items-center">
                <IconDoubleCheck />
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
      <div className="inline-flex items-center gap-1 rounded-full bg-black/[0.06] px-3 py-2 text-[13px] text-black shadow-sm">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-black/50 animate-bounce" />
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-black/50 animate-bounce [animation-delay:120ms]" />
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-black/50 animate-bounce [animation-delay:240ms]" />
      </div>
    </div>
  );
}

/* Ikon minimal */
function IconMore() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>); }
function IconCall() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.89.3 1.76.57 2.6a2 2 0 0 1-.45 2.11L9.1 10.9a16 16 0 0 0 4 4l1.46-1.13a2 2 0 0 1 2.11-.45c.84.27 1.71.45 2.6.57A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="2" /></svg>); }
function IconVideo() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M23 7l-7 5 7 5V7z" fill="currentColor" /><rect x="1" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" /></svg>); }
function IconPaperclip() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.5l-8.5 8.5a6 6 0 1 1-8.49-8.49L12 4.99a4 4 0 0 1 5.66 5.66L9.76 18.56a2 2 0 1 1-2.83-2.83L14 8.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function IconEmoji() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="10" r="1.25" fill="currentColor"/><circle cx="15" cy="10" r="1.25" fill="currentColor"/><path d="M8 14c1 .8 2.3 1.2 4 1.2S15 14.8 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>); }
function IconMic() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>); }
function IconSend() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>); }

/** Double check WhatsApp-style: proporsional & bentuk mirip WA, warna ikut teks (currentColor) */
function IconDoubleCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.2em"
      height="1.2em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: "translateY(0.5px)" }} // align optik dengan angka jam
    >
      {/* centang kiri (lebih pendek) */}
      <polyline points="3 12 8 17 12 13" />
      {/* centang kanan (sedikit lebih ke kanan/atas) */}
      <polyline points="9 12 14 17 21 9" />
    </svg>
  );
}
