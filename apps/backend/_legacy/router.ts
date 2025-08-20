// apps/backend/src/server/router.ts
import { initTRPC } from "@trpc/server";
import { chatRouter } from "./routers/chat";

const t = initTRPC.create();

// Ekspos helper agar bisa dipakai router lain (jika dibutuhkan)
export const router = t.router;
export const procedure = t.procedure;

export const appRouter = router({
  chat: chatRouter,
  // router lain ...
});

export type AppRouter = typeof appRouter;
