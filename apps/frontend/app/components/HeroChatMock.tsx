// apps/frontend/app/components/HeroChatMock.tsx

export default function HeroChatMock() {
  return (
    <div className="relative">
      {/* background grid halus */}
      <div className="absolute inset-0 -z-10 rounded-[20px] bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[length:18px_18px]" />

      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl ring-1 ring-black/10 bg-white/80 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/70">
        {/* Titlebar */}
        <div className="flex items-center gap-2 border-b border-black/10 bg-gradient-to-b from-white to-black/5 px-4 py-2">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs text-black/60">AberoAI Bot</span>
          <span className="ml-auto rounded-full border border-black/10 px-2 py-0.5 text-[10px] text-black/60">
            Demo
          </span>
        </div>

        {/* Chat area */}
        <div className="space-y-3 bg-gradient-to-b from-white to-slate-50 p-4">
          {/* bot bubble */}
          <div className="flex items-start gap-2">
            <div className="grid size-6 place-items-center rounded-full bg-black/90 text-[10px] font-medium text-white">AI</div>
            <div>
              <div className="rounded-2xl rounded-tl-md bg-black/5 px-3 py-2 text-sm shadow-sm">
                Halo! Ada yang bisa kami bantu?
              </div>
              <span className="mt-1 block text-[10px] text-black/50">09:12</span>
            </div>
          </div>

          {/* user bubble (aksen brand) */}
          <div className="flex items-start justify-end gap-2">
            <div>
              <div
                className="ml-auto rounded-2xl rounded-tr-md px-3 py-2 text-sm text-white shadow-sm"
                style={{ backgroundColor: "#26658C" }}
              >
                Jadwal buka klinik hari ini?
              </div>
              <span className="mt-1 block text-right text-[10px] text-black/50">09:12</span>
            </div>
            <div className="grid size-6 place-items-center rounded-full border border-black/10 bg-white text-[10px]">You</div>
          </div>

          {/* bot reply + typing indicator pill */}
          <div className="flex items-start gap-2">
            <div className="grid size-6 place-items-center rounded-full bg-black/90 text-[10px] font-medium text-white">AI</div>
            <div>
              <div className="rounded-2xl rounded-tl-md bg-black/5 px-3 py-2 text-sm shadow-sm">
                Klinik buka 09.00–21.00 WIB. Ingin buat janji?
              </div>

              <div
                className="mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] text-white shadow-sm"
                style={{ backgroundColor: "#0b0b0b" }}
              >
                <span className="inline-flex items-center">
                  <span className="size-1.5 animate-pulse rounded-full bg-white/80" />
                  <span className="mx-1 size-1.5 animate-pulse rounded-full bg-white/80 [animation-delay:120ms]" />
                  <span className="size-1.5 animate-pulse rounded-full bg-white/80 [animation-delay:240ms]" />
                </span>
                <span className="ml-2">
                  AI replied in <span className="font-medium">&lt;1s</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick replies */}
        <div className="flex flex-wrap gap-2 border-t border-black/10 bg-white/70 px-4 py-3">
          <button className="rounded-full border border-black/10 px-3 py-1 text-xs hover:bg-black/5">Pricing?</button>
          <button className="rounded-full border border-black/10 px-3 py-1 text-xs hover:bg-black/5">Book appointment</button>
          <button className="rounded-full border border-black/10 px-3 py-1 text-xs hover:bg-black/5">TR / EN</button>
        </div>
      </div>

      <p className="mt-2 text-center text-[10px] text-black/50">
        Works with WhatsApp Cloud API • Demo UI
      </p>
    </div>
  );
}
