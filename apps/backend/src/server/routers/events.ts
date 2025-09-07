// apps/backend/src/server/routers/events.ts
import { observable } from "@trpc/server/observable";
import { createTRPCRouter, publicProcedure } from "../../trpc/trpc";

// Buat router lokal bertipe lengkap (jangan langsung export untuk hindari TS2742)
const _eventsRouter = createTRPCRouter({
  /** Demo: broadcast timestamp tiap 1 detik */
  onTick: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const t = setInterval(() => emit.next(Date.now()), 1000);
      return () => clearInterval(t);
    });
  }),
} as const);

// Ekspor bentuk bertipe untuk dipakai internal (menjaga tipe lengkap)
export const eventsRouterTyped = _eventsRouter;
export type EventsRouter = typeof eventsRouterTyped;

// Ekspor nilai runtime untuk publik (tanpa cast AnyRouter agar tetap type-safe)
export const eventsRouter = _eventsRouter;
