// apps/frontend/app/components/HeroChatMock.tsx
// MCUI proporsional: 1 user msg → typing bubble → 1 bot msg (+ TR) + badge.
// Fixed size (340–360 × 400–430), tidak scrollable, Tailwind/Next siap pakai.

export default function HeroChatMock() {
  return (
    <div className="relative">
      {/* background grid halus */}
      <div className="absolute inset-0 -z-10 rounded-[20px] bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[length:18px_18px]" />

      <div
        className="
          mx-auto
          w-[340px] sm:w-[360px]   /* lebar target */
          h-[400px] sm:h-[420px]   /* tinggi target */
          rounded-2xl ring-1 ring-black/10 bg-white/80 shadow-xl backdrop-blur
          supports-[backdrop-filter]:bg-white/70
          flex flex-col overflow-hidden   /* tidak scrollable */
        "
        aria-label="AberoAI Mock Chat UI"
      >
        {/* Header ringkas */}
        <div className="flex items-center justify-between border-b border-black/10 bg-gradient-to-b from-white to-black/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar />
            <div>
              <div className="text-sm font-semibold">Kirti Yadav</div>
              <div className="text-[11px] text-black/50">Last seen 3 hours ago</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-black/60">
            <IconCall />
            <IconVideo />
            <IconMore />
          </div>
        </div>

        {/* Chat body: konten sengaja sedikit agar muat tanpa scroll */}
        <div className="bg-white">
          {/* Date divider */}
          <div className="flex items-center gap-3 px-4 py-3 text-[11px] text-black/50">
            <div className="h-px flex-1 bg-black/10" />
            <span>Today 12:31 AM</span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <div className="space-y-3 px-4 pb-3">
            {/* 1) User bertanya */}
            <Msg side="user" color="#26658C">
              Hi, may I ask about your pricing?
            </Msg>

            {/* 2) Typing indicator (balon dengan 3 titik animasi) */}
            <TypingBubble />

            {/* 3) Bot jawab + terjemahan TR */}
            <Msg side="bot">
              Sure — our Starter plan is <strong>$19/month</strong>.{" "}
              <span className="text-black/60">TR:</span> Başlangıç paketi{" "}
              <strong>$19/ay</strong>’dan başlar. Would you like the full catalog or a quick demo?
            </Msg>

            {/* Badge kecepatan tepat di bawah bubble terakhir */}
            <div className="pl-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-black text-white px-3 py-1 text-[10px] shadow-sm">
                <span className="inline-flex items-center">
                  <span className="mx-[1px] inline-block size-1.5 rounded-full bg-white/90 animate-bounce" />
                  <span className="mx-[1px] inline-block size-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:120ms]" />
                  <span className="mx-[1px] inline-block size-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:240ms]" />
                </span>
                AI replied in &lt;1s
              </span>
            </div>
          </div>
        </div>

        {/* Input bar mock (non-interaktif) */}
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
              className="grid size-9 place-items-center rounded-full text-white shadow-sm hover:brightness-95 active:scale-95 transition"
              style={{ backgroundColor: "#26658C" }} /* brand */
            >
              <IconSend />
            </button>
          </div>
        </div>
      </div>

      {/* Caption kecil */}
      <p className="mt-2 text-center text-[10px] text-black/50">
        Works with WhatsApp Cloud API • Demo UI
      </p>
    </div>
  );
}

/* ========= Sub-komponen kecil ========= */

function Avatar() {
  return (
    <div className="grid size-9 place-items-center rounded-full bg-black/90 text-white text-[11px]">
      KY
    </div>
  );
}

function Msg({
  side,
  children,
  color = "#26658C", // default brand untuk user
}: {
  side: "user" | "bot";
  children: React.ReactNode;
  color?: string;
}) {
  const isUser = side === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[82%] px-4 py-2 text-[13px] shadow-sm",
          "rounded-full",
          isUser ? "text-white" : "text-black",
        ].join(" ")}
        style={{
          background: isUser ? color : "rgba(0,0,0,0.06)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* Typing indicator sebagai balon */
function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="inline-flex items-center gap-1 rounded-full bg-black/[0.06] px-3 py-2 text-[13px] text-black shadow-sm">
        <span className="inline-block size-1.5 rounded-full bg-black/50 animate-bounce" />
        <span className="inline-block size-1.5 rounded-full bg-black/50 animate-bounce [animation-delay:120ms]" />
        <span className="inline-block size-1.5 rounded-full bg-black/50 animate-bounce [animation-delay:240ms]" />
      </div>
    </div>
  );
}

/* Ikon minimal */
function IconMore() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
    </svg>
  );
}
function IconCall() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.89.3 1.76.57 2.6a2 2 0 0 1-.45 2.11L9.1 10.9a16 16 0 0 0 4 4l1.46-1.13a2 2 0 0 1 2.11-.45c.84.27 1.71.45 2.6.57A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconVideo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M23 7l-7 5 7 5V7z" fill="currentColor" />
      <rect x="1" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconPaperclip() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 12.5l-8.5 8.5a6 6 0 1 1-8.49-8.49L12 4.99a4 4 0 0 1 5.66 5.66L9.76 18.56a2 2 0 1 1-2.83-2.83L14 8.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconEmoji() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9" cy="10" r="1.25" fill="currentColor"/>
      <circle cx="15" cy="10" r="1.25" fill="currentColor"/>
      <path d="M8 14c1 .8 2.3 1.2 4 1.2S15 14.8 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function IconMic() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="3" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function IconSend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
