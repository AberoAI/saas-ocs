// apps/backend/src/ws/server.ts
import { WebSocketServer, WebSocket } from "ws";

const PORT = Number(process.env.WS_PORT ?? 4000);

// Jalankan WS server langsung (tanpa HTTP wrapper) — simple & cukup untuk kebutuhan sekarang
const wss = new WebSocketServer({ port: PORT });

// Helper broadcast supaya bisa dipakai dari tempat lain (misal API)
export function broadcast(data: unknown) {
  const msg = JSON.stringify(data);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) client.send(msg);
  }
}

wss.on("connection", (ws) => {
  console.log("[WS] client connected");

  ws.on("message", (raw) => {
    // contoh: echo / forward apa pun
    try {
      const msg = JSON.parse(raw.toString());
      console.log("[WS] recv:", msg);
      // contoh reply:
      // ws.send(JSON.stringify({ type: "ack", ts: Date.now() }));
    } catch {
      console.log("[WS] recv:", raw.toString());
    }
  });

  ws.on("close", () => console.log("[WS] client disconnected"));
});

// Heartbeat opsional (biar klien tau server hidup)
setInterval(() => {
  broadcast({ type: "heartbeat", ts: Date.now() });
}, 30_000);

console.log(`[WS] listening on ws://localhost:${PORT}`);
