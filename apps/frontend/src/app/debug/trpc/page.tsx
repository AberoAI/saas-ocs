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

export default function DebugTRPC() {
  const [res, setRes] = useState<Result>({ url: process.env.NEXT_PUBLIC_TRPC_URL });

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_TRPC_URL;
    if (!url) {
      setRes({ error: "NEXT_PUBLIC_TRPC_URL is empty" });
      return;
    }

    // 1) Ping root tRPC (boleh 405; yang penting bukan CORS/Network error)
    fetch(url, { method: "GET" })
      .then(async (r) => {
        const text = await r.text();
        setRes((prev) => ({
          ...prev,
          url,
          ok: r.ok,
          status: r.status,
          bodyPreview: text.slice(0, 200),
        }));
      })
      .catch((e) => setRes((prev) => ({ ...prev, url, error: String(e) })));

    // 2) Ping /healthz untuk bukti konektivitas umum
    fetch("https://saas-ocs-backend.onrender.com/healthz", { cache: "no-store" })
      .then((r) => r.text())
      .then((t) => setRes((prev) => ({ ...prev, healthz: t })))
      .catch((e) => setRes((prev) => ({ ...prev, healthz: "ERR: " + e })));
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ fontSize: 20, fontWeight: 600 }}>Debug TRPC</h1>
      <pre style={{ marginTop: 12, background: "#f6f7f9", padding: 12, borderRadius: 8 }}>
        {JSON.stringify(res, null, 2)}
      </pre>
      <p style={{ marginTop: 12 }}>
        Catatan: Status <b>405</b> di sini <i>normal</i> untuk root tRPC. Yang penting bukan CORS/Network error.
      </p>
    </main>
  );
}
