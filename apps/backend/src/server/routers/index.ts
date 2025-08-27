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

// ────────────────────────────────────────────────────────────────────────────────
// Root app router: hanya namespace, tanpa prosedur langsung
// ────────────────────────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  chat: chatRouter,
  customer: customerRouter,
  provider: providerRouter,
  billing: billingRouter,
  admin: adminRouter,
  webhook: webhookRouter,
});

// ────────────────────────────────────────────────────────────────────────────────
// Ekspor tipe publik untuk konsumen (frontend / packages/shared)
// Menghindari impor langsung '@trpc/server' di FE dengan mengekspor helper types.
// ────────────────────────────────────────────────────────────────────────────────
export type AppRouter = typeof appRouter;

// Opsi: ekspor helper types agar FE bisa konsumsi tanpa mengimpor '@trpc/server'
export type { inferRouterInputs as _inferRouterInputs, inferRouterOutputs as _inferRouterOutputs } from "@trpc/server";

// Tipe util yang siap pakai di shared/frontend (tanpa mengimpor '@trpc/server' di FE):
// Contoh penggunaan di shared/frontend:
//   import type { RouterInputs, RouterOutputs } from "backend-path/router";
//   type SendMsgInput = RouterInputs["chat"]["sendMessage"];
//   type SendMsgOutput = RouterOutputs["chat"]["sendMessage"];
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
