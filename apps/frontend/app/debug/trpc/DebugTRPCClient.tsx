// apps/frontend/app/debug/trpc/DebugTRPCClient.tsx
"use client";

import { useEffect, useState } from "react";

type Result = {
  url?: string;
  ok?: boolean;
  status?: number | null;
  bodyPreview?: string;
  error?: string;
  healthz?: string;
};

export default function DebugTRPCClient() {
  const [res, setRes] = useState<Result>({
    url: process.env.NEXT_PUBLIC_TRPC_URL,
  });

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_TRPC_URL || "/_trpc";

    // 1) Ping root tRPC (404/405 normal saat tanpa procedure)
    (async () => {
      try {
        const r = await fetch(url, { method: "GET" });
        const ct = r.headers.get("content-type") || "";
        const preview = ct.includes("application/json")
          ? JSON.stringify(await r.json())
          : await r.text();
        setRes((prev) => ({
          ...prev,
          url,
          ok: r.ok,
          status: r.status,
          bodyPreview: (preview || "").slice(0, 400),
        }));
      } catch (e: unknown) {
        setRes((prev) => ({
          ...prev,
          url,
          ok: false,
          status: null,
          bodyPreview: undefined,
          error: toErr(e),
        }));
      }
    })();

    // 2) Ping /_healthz via same-origin proxy
    (async () => {
      try {
        const hz = await fetch("/_healthz", { cache: "no-store" });
        const ct = hz.headers.get("content-type") || "";
        const body = ct.includes("application/json")
          ? JSON.stringify(await hz.json())
          : await hz.text();
        setRes((prev) => ({ ...prev, healthz: body || "(empty)" }));
      } catch (e: unknown) {
        setRes((prev) => ({ ...prev, healthz: toErr(e) }));
      }
    })();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Debug TRPC</h1>
      <pre
        style={{
          marginTop: 12,
          background: "#f6f7f9",
          padding: 12,
          borderRadius: 8,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {JSON.stringify(res, null, 2)}
      </pre>
      <p style={{ marginTop: 12 }}>
        Catatan: Status <b>404/405</b> di root <code>/_trpc</code> adalah normal
        saat memukul tanpa nama prosedur. Yang penting bukan CORS/Network error.
      </p>
    </main>
  );
}

function toErr(e: unknown): string {
  if (e instanceof Error) return `ERR: ${e.name}: ${e.message}`;
  try {
    return `ERR: ${JSON.stringify(e)}`;
  } catch {
    return `ERR: ${String(e)}`;
  }
}
