// apps/frontend/src/app/debug/trpc/page.tsx
"use client";

import { useEffect, useState } from "react";

type Result = {
  url?: string;
  ok?: boolean;
  status?: number;
  bodyPreview?: string;
  error?: string;
  healthz?: string;
};

// ✅ aktifkan hanya jika perlu (di Vercel: NEXT_PUBLIC_ENABLE_DEBUG=true)
const IS_DEBUG = process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true";

// ✅ gunakan same-origin (melewati Next rewrites → anti CORS)
const TRPC_URL = "/_trpc";
const HEALTHZ_URL = "/_healthz";

export default function DebugTRPC() {
  const [res, setRes] = useState<Result>({ url: TRPC_URL });

  useEffect(() => {
    if (!IS_DEBUG) return;

    // 1) Probe root tRPC (GET ke root wajar 405; yang penting bukan CORS/Network error)
    fetch(TRPC_URL, { method: "GET", cache: "no-store" })
      .then(async (r) => {
        const text = await r.text().catch(() => "");
        setRes((prev) => ({
          ...prev,
          url: TRPC_URL,
          ok: r.ok,
          status: r.status,
          bodyPreview: text.slice(0, 200),
        }));
      })
      .catch((e) =>
        setRes((prev) => ({ ...prev, url: TRPC_URL, error: toErr(e) })),
      );

    // 2) Probe /healthz (harus 200 + { ok: true } kalau backend hidup)
    fetch(HEALTHZ_URL, { cache: "no-store" })
      .then((r) => r.text())
      .then((t) => setRes((prev) => ({ ...prev, healthz: t })))
      .catch((e) =>
        setRes((prev) => ({ ...prev, healthz: "ERR: " + toErr(e) })),
      );
  }, []);

  if (!IS_DEBUG) {
    return (
      <main style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
        <h1 style={{ fontSize: 20, fontWeight: 600 }}>Debug TRPC</h1>
        <p style={{ marginTop: 8, color: "#6b7280" }}>
          Debug dimatikan. Set{" "}
          <code>NEXT_PUBLIC_ENABLE_DEBUG=true</code> untuk mengaktifkan di
          environment non-production.
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Debug TRPC</h1>
      <pre
        style={{
          marginTop: 12,
          background: "#f6f7f9",
          padding: 12,
          borderRadius: 8,
          overflow: "auto",
        }}
      >
        {JSON.stringify(res, null, 2)}
      </pre>
      <p style={{ marginTop: 12 }}>
        Catatan: Status <b>405</b> di sini <i>normal</i> untuk root tRPC. Yang
        penting bukan CORS/Network error.
      </p>
    </main>
  );
}

function toErr(e: unknown) {
  if (e instanceof Error) return e.message || e.name;
  try {
    const any = e as { message?: string; reason?: string };
    return any?.message || any?.reason || JSON.stringify(e);
  } catch {
    return String(e);
  }
}
