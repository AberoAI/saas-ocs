// apps/backend/src/index.ts
// Jangan gunakan type-only re-export; impor & expose supaya tsc memproses.
import { appRouter } from "./server/routers"; // ⬅️ FIX: plural `routers`

export type AppRouter = typeof appRouter;
