// apps/backend/src/server/routers/index.ts
import { router, procedure } from "../trpc";
import { chatRouter } from "./chat";

export const appRouter = router({
  // ✅ Endpoint untuk pengecekan server
  healthcheck: procedure.query(() => {
    return "ok";
  }),

  // ✅ Endpoint untuk fitur chat
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
