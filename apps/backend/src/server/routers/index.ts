// apps/backend/src/server/routers/index.ts
import { router, procedure } from "../trpc";
import { chatRouter } from "./chat";

// Router root (aggregator) — pastikan sub-router 'chat' terdaftar di sini
export const appRouter = router({
  // Health check sederhana
  healthcheck: procedure.query(() => "ok"),

  // Fitur chat
  chat: chatRouter,
});

// Ekspor tipe untuk konsumen (shared/frontend)
export type AppRouter = typeof appRouter;
