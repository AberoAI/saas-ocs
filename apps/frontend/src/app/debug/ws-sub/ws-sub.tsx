// apps/frontend/src/app/debug/ws-sub/ws-sub.tsx
"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

// Bentuk minimal untuk menghindari `any`
interface EventsHooks {
  onTick: {
    useSubscription: (
      input: undefined,
      opts: {
        onData: (ts: number) => void;
        onError?: (err: unknown) => void;
      },
    ) => void;
  };
}

const t = trpc as unknown as { events: EventsHooks };

export default function WsSub() {
  const [last, setLast] = useState<number | null>(null);

  // ✅ Panggil hook SELALU (tanpa kondisi)
  t.events.onTick.useSubscription(undefined, {
    onData: (ts: number) => setLast(ts),
    onError: (err: unknown) => {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : JSON.stringify(err);
      // eslint-disable-next-line no-console
      console.error("ws error:", msg);
    },
  });

  useEffect(() => {
    if (last) {
      // eslint-disable-next-line no-console
      console.log("tick:", new Date(last).toISOString());
    }
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
