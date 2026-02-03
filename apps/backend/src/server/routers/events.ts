// apps/backend/src/server/routers/events.ts
import { observable } from "@trpc/server/observable";
import { createTRPCRouter, publicProcedure } from "../../trpc/trpc";

/**
 * Catatan TS2742:
 * Jangan export router value dengan inferred type langsung (const) karena TS
 * bisa mencoba “menamai” tipe internal tRPC yang tidak portable.
 *
 * Solusi: export sebagai type saja untuk kebutuhan tipe,
 * dan untuk runtime export lewat konstanta yang “dibekukan” oleh annotation sederhana.
 */

// Router value (internal)
const eventsRouterInternal = createTRPCRouter({
  /** Demo: broadcast timestamp tiap 1 detik */
  onTick: publicProcedure.subscription(() => {
    return observable<number>((emit) => {
      const t = setInterval(() => emit.next(Date.now()), 1000);
      return () => clearInterval(t);
    });
  }),
});

// Type publik (aman)
export type EventsRouter = typeof eventsRouterInternal;

// Runtime export (tetap sama router-nya, tapi tidak memaksa TS menamai inferred export)
export const eventsRouter: EventsRouter = eventsRouterInternal;
