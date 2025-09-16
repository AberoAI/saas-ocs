// apps/frontend/app/components/HeroChatMock.tsx
// Mock Chat UI gaya "pill" (header avatar + last seen, date divider, bubble ungu di kanan)

export default function HeroChatMock() {
  return (
    <div className="relative">
      {/* background grid halus (dipertahankan) */}
      <div className="absolute inset-0 -z-10 rounded-[20px] bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[length:18px_18px]" />

      <div
        className="
          mx-auto
          w-[340px] sm:w-[360px]          /* lebar target */
          h-[400px] sm:h-[420px]          /* tinggi target */
          overflow-hidden rounded-2xl
          ring-1 ring-black/10 bg-white/80 shadow-xl backdrop-blur
          supports-[backdrop-filter]:bg-white/70
          flex flex-col                   /* body chat = flex-1 */
        "
      >
        {/* Header: avatar + last seen */}
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

        {/* Chat area (gaya pill) */}
        <div className="flex-1 overflow-y-auto bg-white">
          {/* Date divider */}
          <div className="flex items-center gap-3 px-4 py-3 text-[11px] text-black/50">
            <div className="h-px flex-1 bg-black/10" />
            <span>Today 12:31 AM</span>
            <div className="h-px flex-1 bg-black/10" />
          </div>

          <div className="space-y-4 px-4 pb-5">
            {/* 1) ungu */}
            <Msg side="user" color="#7C3AED">
              Hi, can I ask about your products?
            </Msg>

            {/* 2) abu */}
            <Msg side="bot">
              Of course, Which product are you interested in?
            </Msg>

            {/* 3) ungu */}
            <Msg side="user" color="#7C3AED">
              I’d like to know your prices.
            </Msg>

            {/* 4) abu */}
            <Msg side="bot">Our plans start at $19/month.</Msg>

            {/* 5) abu */}
            <Msg side="bot">
              Would you like me to send you the full catalog or book a demo?
            </Msg>
          </div>
        </div>

        {/* Quick replies (dipertahankan dari kerangka awal) */}
        <div className="flex flex-wrap gap-2 border-t border-black/10 bg-white/70 px-4 py-3">
          <button className="rounded-full border border-black/10 px-3 py-1 text-xs hover:bg-black/5">Pricing?</button>
          <button className="rounded-full border border-black/10 px-3 py-1 text-xs hover:bg-black/5">Book appointment</button>
          <button className="rounded-full border border-black/10 px-3 py-1 text-xs hover:bg-black/5">TR / EN</button>
        </div>
      </div>

      {/* Caption bawah (dipertahankan) */}
      <p className="mt-2 text-center text-[10px] text-black/50">
        Works with WhatsApp Cloud API • Demo UI
      </p>
    </div>
  );
}

/* ========= Sub-komponen kecil (internal) ========= */

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
  color = "#7C3AED", // default ungu untuk user
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
          "max-w-[78%] px-4 py-2 text-sm shadow-sm",
          "rounded-full", // gaya pill
          isUser ? "text-white" : "text-black",
        ].join(" ")}
        style={{
          background: isUser ? color : "rgba(0,0,0,0.06)", // user ungu, bot abu
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* Ikon kecil (outline/simple) */
function IconMore() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
    </svg>
  );
}
function IconCall() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.89.3 1.76.57 2.6a2 2 0 0 1-.45 2.11L9.1 10.9a16 16 0 0 0 4 4l1.46-1.13a2 2 0 0 1 2.11-.45c.84.27 1.71.45 2.6.57A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconVideo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M23 7l-7 5 7 5V7z" fill="currentColor" />
      <rect x="1" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
