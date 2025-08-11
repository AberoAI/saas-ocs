import { initTRPC } from "@trpc/server";
import { chatRouter } from "./routers/chat";

const t = initTRPC.create();
export const router = t.router;

export const appRouter = router({
  chat: chatRouter,
  // router lain ...
});

export type AppRouter = typeof appRouter;
