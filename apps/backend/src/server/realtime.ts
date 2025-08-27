// apps/backend/src/server/realtime.ts
import { WebSocketServer } from "ws";
import type { WebSocket, RawData } from "ws";
import type { IncomingMessage } from "http";
import type { Socket } from "net";

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");

  ws.on("message", (message: RawData) => {
    const text = rawDataToString(message);
    console.log("Received:", text);
    // Bisa broadcast, dsb — untuk contoh, echo balik sebagai string
    ws.send(`Echo: ${text}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

export function handleUpgrade(
  request: IncomingMessage,
  socket: Socket,
  head: Buffer
) {
  wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
    wss.emit("connection", ws, request);
  });
}

// --- Utils ---
function rawDataToString(data: RawData): string {
  if (Buffer.isBuffer(data)) return data.toString("utf8");
  if (data instanceof ArrayBuffer) return Buffer.from(data).toString("utf8");
  if (Array.isArray(data)) return Buffer.concat(data).toString("utf8");
  return "";
}
