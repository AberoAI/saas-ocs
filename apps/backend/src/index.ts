// apps/backend/src/index.ts

// Sumber tunggal router
import { appRouter } from "./server/root";

// (opsional) Import Redis helper agar PING tercetak saat start
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { redis } = require("./lib/redis");
  void redis;
} catch {}

// ✅ Type export untuk konsumen (shared/frontend)
export type AppRouter = typeof appRouter;

// ✅ Runtime export agar frontend route bisa pakai router & context
export { appRouter } from "./server/root";
export { createContext } from "./trpc/context";
