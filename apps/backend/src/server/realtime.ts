// apps/backend/src/server/realtime.ts
import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { Socket } from "net";

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");

  ws.on("message", (message: WebSocket.Data) => {
    console.log("Received:", message.toString());
    // Bisa broadcast, dsb
    ws.send(`Echo: ${message}`);
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
