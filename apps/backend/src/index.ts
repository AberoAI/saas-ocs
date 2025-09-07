// apps/backend/src/index.ts

// ====== Ekspor (tetap, tapi arahkan ke folder yang benar) ======
export { appRouter } from "./server/routers"; // ✅ perbaiki path
export type AppRouter = typeof import("./server/routers").appRouter; // ✅ perbaiki path
export { createContext } from "./trpc";
export type { RouterInputs, RouterOutputs } from "./server/routers"; // ✅ perbaiki path

// ====== Runtime server: HTTP + WS ======
import http from "http";
import { app } from "./http-app";
import { attachWs } from "./ws";

const port = Number(process.env.PORT ?? 3000);
const server = http.createServer(app);

attachWs(server);

server.listen(port, () => {
  console.log(`HTTP+WS listening on :${port}`);
});
