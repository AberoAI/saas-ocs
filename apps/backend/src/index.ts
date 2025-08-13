// apps/backend/src/index.ts
// Jangan gunakan type-only re-export; impor & expose supaya tsc memproses.
import { appRouter } from "./server/routers"; // ⬅️ FIX: plural `routers`

// Import Redis helper agar PING tercetak saat start
import { redis } from "./lib/redis";
void redis; // menjaga agar tidak dianggap unused jika noUnusedLocals aktif

export type AppRouter = typeof appRouter;
