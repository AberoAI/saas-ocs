// apps/backend/src/server/main.ts

// 1) Jalankan side-effects startup (Redis PING, dsb.)
import "./bootstrap.js"; // penting: .js agar cocok dengan output kompilasi

// 2) Start tRPC HTTP server
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./routers";
import { createContext as makeContext } from "../trpc/context";

// 3) WebSocket sederhana untuk realtime
import { WebSocketServer } from "ws";
import type { WebSocket, RawData } from "ws";

const PORT = Number(process.env.PORT ?? 4000);
const HOST = "0.0.0.0";

// Normalisasi header Node -> Record<string, string>
function toRecord(headers: unknown): Record<string, string> {
  const obj = (headers ?? {}) as Record<string, string | string[] | undefined>;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : v ?? ""]),
  ) as Record<string, string>;
}

// Ambil origin yang diizinkan dari env (Render/Vercel)
// Format: "https://aberoai.com,https://*.vercel.app"
const allowedOrigins = new Set(
  (process.env.ALLOW_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);

// Utility set header CORS sesuai env (default: *)
function corsHeaders() {
  const origin =
    allowedOrigins.size > 0 ? Array.from(allowedOrigins).join(", ") : "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  };
}

// tRPC HTTP server
const httpServer = createHTTPServer({
  router: appRouter,
  createContext: ({ req }) => makeContext({ headers: toRecord(req.headers) }),
  responseMeta() {
    return { headers: corsHeaders() };
  },
});

// Preflight OPTIONS + healthcheck
httpServer.on("request", (req, res) => {
  // Healthcheck untuk Render
  if (req.url === "/healthz") {
    res.writeHead(200, { "Content-Type": "application/json", ...corsHeaders() });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // Preflight untuk semua route (terutama /trpc)
  if (req.method === "OPTIONS") {
    res.writeHead(204, { ...corsHeaders(), "Content-Length": "0" });
    res.end();
  }
});

// WebSocket server share port yang sama (opsional path bisa ditambah)
const wss = new WebSocketServer({
  server: httpServer,
  // path: "/ws", // <- aktifkan jika ingin path khusus
});

// Broadcast helper
function broadcastJSON(payload: unknown) {
  const data = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === 1 /* OPEN */) client.send(data);
  }
}

// Event koneksi WS
wss.on("connection", (ws: WebSocket) => {
  ws.send(JSON.stringify({ type: "hello", ts: Date.now() }));

  ws.on("message", (raw: RawData) => {
    try {
      const msg = JSON.parse(String(raw));
      if (msg?.type === "ping") {
        ws.send(JSON.stringify({ type: "pong", ts: Date.now() }));
      }
    } catch {
      /* abaikan non-JSON */
    }
  });
});

// Expose util untuk dipanggil dari router lain (mis. chat.sendMessage)
export function notifyNewMessage(message: { id: string; text: string }) {
  broadcastJSON({ type: "new_message", message, ts: Date.now() });
}

// Listen pada HOST 0.0.0.0 (wajib untuk Render)
httpServer.listen(PORT, HOST, () => {
  console.log(`🚀 tRPC HTTP listening on http://${HOST}:${PORT}`);
  console.log(`🔌 WebSocket listening on ws://${HOST}:${PORT}`);
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
