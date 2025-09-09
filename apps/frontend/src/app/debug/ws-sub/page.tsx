// apps/frontend/src/app/debug/ws-sub/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { getWsTRPCUrl } from "@/lib/env";

type Conn = "idle" | "connecting" | "open" | "error" | "closed";

// Bentuk minimal untuk menghindari `any`
interface EventsHooks {
  onTick: {
    useSubscription: (
      input: undefined,
      opts: {
        onStarted?: () => void;
        onData: (ts: number) => void;
        onError?: (err: unknown) => void;
      },
    ) => void;
  };
}

const t = trpc as unknown as { events: EventsHooks };

export default function Page() {
  // ---- tRPC subscription ----
  const [last, setLast] = useState<number | null>(null);
  const [status, setStatus] = useState<Conn>("connecting");
  const [errMsg, setErrMsg] = useState("");

  t.events.onTick.useSubscription(undefined, {
    onStarted: () => setStatus("open"),
    onData: (ts: number) => setLast(ts),
    onError: (err: unknown) => {
      setStatus("error");
      setErrMsg(toErr(err));
      // eslint-disable-next-line no-console
      console.error("tRPC WS subscription error:", err);
    },
  });

  useEffect(() => {
    if (last) {
      // eslint-disable-next-line no-console
      console.log("tick:", new Date(last).toISOString());
    }
  }, [last]);

  // ---- Diag: native WebSocket ----
  const [wsProtoStatus, setWsProtoStatus] = useState<Conn>("idle");
  const [wsNoProtoStatus, setWsNoProtoStatus] = useState<Conn>("idle");
  const [wsProtoNote, setWsProtoNote] = useState("");
  const [wsNoProtoNote, setWsNoProtoNote] = useState("");
  const ws1Ref = useRef<WebSocket | null>(null);
  const ws2Ref = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url = getWsTRPCUrl();
    // tampilkan segera error jika URL tidak bisa dibentuk
    if (!url) {
      setWsProtoStatus("error");
      setWsNoProtoStatus("error");
      const note = "WS URL tidak dapat ditentukan (SSR atau env kosong)";
      setWsProtoNote(note);
      setWsNoProtoNote(note);
      return;
    }

    // 1) Dengan subprotocol "trpc"
    setWsProtoStatus("connecting");
    try {
      const ws1 = new WebSocket(url, "trpc");
      ws1Ref.current = ws1;
      ws1.onopen = () => {
        setWsProtoStatus("open");
        setWsProtoNote("open ✓ (trpc)");
      };
      ws1.onerror = (e: Event) => {
        setWsProtoStatus("error");
        setWsProtoNote(`onerror: ${eventErr(e)}`);
      };
      ws1.onclose = (e: CloseEvent) => {
        setWsProtoStatus("closed");
        setWsProtoNote(`close code=${e.code} reason="${e.reason}" clean=${e.wasClean}`);
      };
    } catch (e) {
      setWsProtoStatus("error");
      setWsProtoNote(`constructor error: ${toErr(e)}`);
    }

    // 2) Tanpa subprotocol
    setWsNoProtoStatus("connecting");
    try {
      const ws2 = new WebSocket(url);
      ws2Ref.current = ws2;
      ws2.onopen = () => {
        setWsNoProtoStatus("open");
        setWsNoProtoNote("open ✓ (no subprotocol)");
      };
      ws2.onerror = (e: Event) => {
        setWsNoProtoStatus("error");
        setWsNoProtoNote(`onerror: ${eventErr(e)}`);
      };
      ws2.onclose = (e: CloseEvent) => {
        setWsNoProtoStatus("closed");
        setWsNoProtoNote(`close code=${e.code} reason="${e.reason}" clean=${e.wasClean}`);
      };
    } catch (e) {
      setWsNoProtoStatus("error");
      setWsNoProtoNote(`constructor error: ${toErr(e)}`);
    }

    return () => {
      ws1Ref.current?.close();
      ws2Ref.current?.close();
    };
  }, []);

  const wsUrl = getWsTRPCUrl() ?? "(SSR null)";

  return (
    <div className="p-6 space-y-3">
      <div>WS subscription <code>events.onTick</code> aktif.</div>
      <div><b>Status:</b> {status}</div>
      <div><b>WS URL:</b> {wsUrl}</div>
      <div className="text-sm text-gray-600"><b>Last:</b> {last ? new Date(last).toLocaleString() : "—"}</div>
      {status === "error" && <pre className="mt-2 text-red-600 whitespace-pre-wrap">{errMsg}</pre>}

      <hr className="my-4" />

      <div>
        <b>Diag A (WS + subprotocol &apos;trpc&apos;):</b> {wsProtoStatus}
        <div className="text-sm text-gray-600">{wsProtoNote || "—"}</div>
      </div>
      <div>
        <b>Diag B (WS tanpa subprotocol):</b> {wsNoProtoStatus}
        <div className="text-sm text-gray-600">{wsNoProtoNote || "—"}</div>
      </div>
    </div>
  );
}

function toErr(e: unknown): string {
  if (e instanceof Error) return e.message || e.name;
  try {
    const obj = e as { message?: string; reason?: string };
    return obj?.message || obj?.reason || JSON.stringify(e);
  } catch {
    return String(e);
  }
}

function eventErr(e: Event): string {
  const maybeMsg = (e as unknown as { message?: string }).message;
  return `${maybeMsg ?? e.type} (ua: ${navigator.userAgent})`;
}
