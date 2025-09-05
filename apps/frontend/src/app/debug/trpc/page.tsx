"use client";
import { useEffect, useState } from "react";

type Resp = {
  url: string | undefined;
  ok?: boolean;
  status?: number;
  bodyPreview?: string;
  error?: string;
};

export default function DebugTRPC() {
  const [res, setRes] = useState<Resp>({ url: process.env.NEXT_PUBLIC_TRPC_URL });

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_TRPC_URL;
    if (!url) {
      setRes(r => ({ ...r, error: "NEXT_PUBLIC_TRPC_URL is empty" }));
      return;
    }
    // GET ke /trpc → wajar jika 405; yang penting tidak CORS/network error
    fetch(url, { method: "GET" })
      .then(async (r) => {
        const text = await r.text();
        setRes({
          url,
          ok: r.ok,
          status: r.status,
          bodyPreview: text.slice(0, 200),
        });
      })
      .catch((e) => {
        setRes({ url, error: String(e) });
      });
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Debug TRPC</h1>
      <pre>{JSON.stringify(res, null, 2)}</pre>
      <p style={{ marginTop: 12 }}>
        Catatan: Status <b>405</b> di sini <i>normal</i> untuk root tRPC. Yang penting bukan CORS/Network error.
      </p>
    </main>
  );
}
