// packages/api-types/src/router.d.ts
// Types-only bridge untuk frontend. Tidak ada runtime import.

/**
 * Kenapa ini perlu:
 * Mengambil AppRouter dari "@repo/backend" entrypoint bisa resolve ke export/types yang salah,
 * sehingga tRPC React menganggap router "collision" dan mengubah tipe menjadi union string error.
 *
 * Solusi:
 * - Ambil AppRouter langsung dari source router backend yang benar
 * - Turunkan RouterInputs/RouterOutputs memakai helper type dari @trpc/server
 */

import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type AppRouter =
  import("../../../apps/backend/src/server/routers/index").AppRouter;

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
