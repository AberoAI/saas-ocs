// apps/backend/src/server/routers/index.ts

/**
 * ROOT ROUTER HANYA NAMESPACE.
 * ⚠️ Dilarang menaruh prosedur langsung di root untuk menghindari tabrakan
 *    dengan helper React tRPC (Provider/useContext/useUtils/createClient).
 *
 * Catatan:
 * - Setiap domain/fitur harus berada di router terpisah (system, chat, dll).
 * - File ini hanya menggabungkan (compose) seluruh namespace router.
 */

import { router } from "../../trpc/trpc";

import { systemRouter } from "./system";
import { chatRouter } from "./chat";
import { customerRouter } from "./customer";
import { providerRouter } from "./provider";
import { billingRouter } from "./billing";
import { adminRouter } from "./admin";
import { webhookRouter } from "./webhook";
import { eventsRouter } from "./events";

// Buat dulu router internal (hindari export const inferred yang memicu TS2742)
const appRouterInternal = router({
  system: systemRouter,
  chat: chatRouter,
  customer: customerRouter,
  provider: providerRouter,
  billing: billingRouter,
  admin: adminRouter,
  webhook: webhookRouter,
  events: eventsRouter,
});

// Export type publik (aman)
export type AppRouter = typeof appRouterInternal;

// Export value runtime dengan annotation type (menghindari TS2742)
export const appRouter: AppRouter = appRouterInternal;

// ────────────────────────────────────────────────────────────────────────────────
// Ekspor helper types
// ────────────────────────────────────────────────────────────────────────────────
export type {
  inferRouterInputs as _inferRouterInputs,
  inferRouterOutputs as _inferRouterOutputs,
} from "@trpc/server";

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
