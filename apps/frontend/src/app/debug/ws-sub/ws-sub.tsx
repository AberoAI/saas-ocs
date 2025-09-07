// apps/frontend/src/app/debug/ws-sub.tsx
"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

/**
 * Sama seperti Provider, kita cast minimal untuk melewati bentrok tipe sementara.
 * Runtime tetap pakai router kamu (harusnya `events.onTick` sudah ada di backend).
 */
const t = trpc as any;

export default function WsSub() {
  const [last, setLast] = useState<number | null>(null);

  // ✅ Panggil hook SELALU (tanpa kondisi)
  t.events.onTick.useSubscription(undefined, {
    onData: (ts: number) => setLast(ts), // pastikan ts: number agar tidak implicit any
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : JSON.stringify(err);
      console.error("ws error:", msg);
    },
  });

  useEffect(() => {
    if (last) console.log("tick:", new Date(last).toISOString());
  }, [last]);

  return (
    <div className="p-4 space-y-2">
      <div>
        WS subscription <code>events.onTick</code> aktif.
      </div>
      <div className="text-sm text-gray-600">
        Last: {last ? new Date(last).toLocaleString() : "—"}
      </div>
    </div>
  );
}
