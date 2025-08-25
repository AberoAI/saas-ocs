// apps/backend/src/server/main.ts

// 1) Jalankan side-effects startup (Redis PING, dsb.)
import "./bootstrap";

// 2) Start tRPC HTTP server
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./routers";
import { createContext as makeContext } from "../trpc/context";

// 3) WebSocket sederhana untuk realtime (dipakai FE: ws://localhost:4000)
import { WebSocketServer } from "ws";

const PORT = Number(process.env.PORT ?? 4000);

// Normalisasi header Node -> Record<string, string>
function toRecord(headers: unknown): Record<string, string> {
  const obj = (headers ?? {}) as Record<string, string | string[] | undefined>;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : v ?? ""]),
  ) as Record<string, string>;
}

// tRPC HTTP server
const httpServer = createHTTPServer({
  router: appRouter,

  // ✅ gunakan context yang benar (prisma, tenantId, userId, ...)
  createContext: ({ req }) => makeContext({ headers: toRecord(req.headers) }),

  // Header CORS dasar agar FE (localhost:3000) bisa akses saat dev
  responseMeta() {
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      },
    };
  },
});

// Preflight OPTIONS (untuk fetch dari FE)
httpServer.on("request", (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Content-Length": "0",
    });
    res.end();
  }
});

// WebSocket server share port yang sama
const wss = new WebSocketServer({ server: httpServer });

// Broadcast helper
function broadcastJSON(payload: unknown) {
  const data = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === 1 /* OPEN */) client.send(data);
  }
}

// Event koneksi WS
wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "hello", ts: Date.now() }));

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(String(raw));
      if (msg?.type === "ping") {
        ws.send(JSON.stringify({ type: "pong", ts: Date.now() }));
      }
    } catch {
      /* ignore non-JSON */
    }
  });
});

// Expose util untuk dipanggil dari router lain (mis. chat.sendMessage)
export function notifyNewMessage(message: { id: string; text: string }) {
  broadcastJSON({ type: "new_message", message, ts: Date.now() });
}

// Listen
httpServer.listen(PORT, () => {
  console.log(`🚀 tRPC HTTP listening on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket listening on ws://localhost:${PORT}`);
});

// Graceful shutdown
function shutdown(signal: string) {
  console.log(`[shutdown] received ${signal}, closing...`);
  wss.close(() => console.log("[shutdown] ws closed"));
  httpServer.close(() => {
    console.log("[shutdown] http closed");
    process.exit(0);
  });
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
