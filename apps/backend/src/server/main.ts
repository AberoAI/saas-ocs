// apps/backend/src/server/main.ts

import "./bootstrap.js";

import { createHTTPServer } from "@trpc/server/adapters/standalone";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { appRouter } from "./routers";
import { createContext as makeContext } from "../trpc/context";

import { WebSocketServer } from "ws";
import type { WebSocket, RawData } from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";

const PORT = Number(process.env.PORT ?? 4000);
const HOST = "0.0.0.0";
const WS_PATH = process.env.TRPC_WS_PATH ?? "/trpc";

function toRecord(headers: unknown): Record<string, string> {
  const obj = (headers ?? {}) as Record<string, string | string[] | undefined>;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      Array.isArray(v) ? v.join(",") : (v ?? ""),
    ]),
  ) as Record<string, string>;
}

const allowedOrigins = new Set(
  (process.env.ALLOW_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);

function corsHeaders() {
  const origin =
    allowedOrigins.size > 0 ? Array.from(allowedOrigins).join(", ") : "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  };
}

// ── tRPC HTTP server (Node http.Server)
const httpServer = createHTTPServer({
  router: appRouter,
  createContext: ({ req }: CreateHTTPContextOptions) =>
    makeContext({ headers: toRecord(req.headers) }),
  responseMeta() {
    return { headers: corsHeaders() };
  },
});

// route tambahan healthz & preflight di Node server
httpServer.on("request", (req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, {
      "Content-Type": "application/json",
      ...corsHeaders(),
    });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  if (req.method === "OPTIONS") {
    res.writeHead(204, { ...corsHeaders(), "Content-Length": "0" });
    res.end();
  }
});

// 👉 WebSocket server di path /trpc (subprotocol bebas; tRPC akan negosiasi sendiri)
const wss = new WebSocketServer({
  server: httpServer, // ✅ langsung pakai Node server
  path: WS_PATH,
  perMessageDeflate: false,
});

/** helper deteksi socket tRPC */
function isTrpcSocket(ws: WebSocket) {
  const proto = (ws as any).protocol as string | undefined;
  return typeof proto === "string" && proto.toLowerCase().includes("trpc");
}

/** Context untuk koneksi WS tRPC */
function createWSSContext(opts: { req: import("http").IncomingMessage }) {
  return makeContext({ headers: toRecord(opts.req.headers) });
}

// ✅ aktifkan handler tRPC-WS (TANPA opsi `path`; path sudah di WSS)
const wsHandler = applyWSSHandler({
  wss,
  router: appRouter as unknown as import("@trpc/server").AnyRouter,
  createContext: createWSSContext,
});

/** logging upgrade (diagnosa) */
httpServer.on("upgrade", (req) => {
  console.log(
    "[upgrade]",
    req.url,
    "offer proto:",
    req.headers["sec-websocket-protocol"] ?? "-",
  );
});

type AliveWS = WebSocket & { isAlive?: boolean };
wss.on("connection", (ws: AliveWS, req) => {
  const acceptedProto = (ws as any).protocol ?? "-";
  const origin = (req.headers["origin"] as string | undefined) ?? "";
  console.log(
    "[ws] connection",
    req.url,
    "proto:",
    acceptedProto,
    "origin:",
    origin || "-",
  );

  if (allowedOrigins.size && origin && !allowedOrigins.has(origin)) {
    console.warn("[ws] close (origin not allowed):", origin);
    ws.close(1008, "origin not allowed");
    return;
  }

  ws.isAlive = true;
  ws.on("pong", () => (ws.isAlive = true));

  ws.on("close", (code, reason) => {
    const text =
      reason && reason.byteLength
        ? (() => {
            try {
              return new TextDecoder().decode(reason);
            } catch {
              return "(binary)";
            }
          })()
        : "";
    console.log(
      `[ws] close code=${code} reason="${text}" proto=${acceptedProto}`,
    );
  });

  ws.on("error", (err) => console.error("[ws] error:", err));

  // WS mentah hanya untuk non-tRPC
  if (!isTrpcSocket(ws)) {
    ws.send(JSON.stringify({ type: "hello", ts: Date.now() }));
    ws.on("message", (raw: RawData) => {
      try {
        const msg = JSON.parse(String(raw));
        if (msg?.type === "ping")
          ws.send(JSON.stringify({ type: "pong", ts: Date.now() }));
      } catch {}
    });
  }
});

// keep-alive
const ka = setInterval(
  () => {
    wss.clients.forEach((client) => {
      const c = client as AliveWS;
      if (c.isAlive === false) {
        try {
          (c as any).terminate();
        } catch {}
        return;
      }
      c.isAlive = false;
      try {
        (c as any).ping();
      } catch {}
    });
  },
  Number(process.env.WS_HEARTBEAT_MS ?? 30_000),
);
wss.on("close", () => clearInterval(ka));

function broadcastJSON(payload: unknown) {
  const data = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (isTrpcSocket(client)) continue;
    if ((client as any).readyState === 1) (client as any).send(data);
  }
}

export function notifyNewMessage(message: { id: string; text: string }) {
  broadcastJSON({ type: "new_message", message, ts: Date.now() });
}

// wrapper listen OK untuk HTTP; WSS ikut share port yang sama
httpServer.listen(PORT, HOST, () => {
  console.log(`🚀 tRPC HTTP listening on http://${HOST}:${PORT}`);
  console.log(`🔌 WebSocket listening on ws://${HOST}:${PORT}${WS_PATH}`);
});

function shutdown(signal: string) {
  console.log(`[shutdown] received ${signal}, closing...`);
  try {
    wsHandler.broadcastReconnectNotification();
  } catch {}
  wss.close(() => console.log("[shutdown] ws closed"));
  httpServer.close(() => {
    console.log("[shutdown] http closed");
    process.exit(0);
  });
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
