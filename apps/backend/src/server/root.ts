import { router } from "../trpc/trpc";
import { chatRouter } from "./routers/chat";

export const appRouter = router({
  chat: chatRouter, // <- key aman untuk klien: trpc.chat....
});
export type AppRouter = typeof appRouter;
