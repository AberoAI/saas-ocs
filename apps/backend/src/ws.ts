// apps/backend/src/ws.ts
import type { Server } from "http";
import { WebSocketServer } from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "./server/routers"; // ✅ perbaiki path
import { createWSSContext } from "./trpc/context";

export function attachWs(server: Server) {
  const wss = new WebSocketServer({ server });
  const handler = applyWSSHandler({
    wss,
    router: appRouter,
    createContext: createWSSContext,
  });

  const shut = () => {
    try {
      handler.broadcastReconnectNotification();
    } catch {
      // noop
    }
    wss.close();
  };
  process.on("SIGTERM", shut);
  process.on("SIGINT", shut);
}
