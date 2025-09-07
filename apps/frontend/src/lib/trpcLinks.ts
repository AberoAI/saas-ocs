// apps/frontend/src/lib/trpcClient.ts
"use client";

import {
  httpBatchLink,
  loggerLink,
  splitLink,
  createWSClient,
  wsLink,
  type TRPCLink,
  type Operation,
} from "@trpc/client";
import type { AppRouter } from "shared/router";
import { getHttpTRPCUrl, getWsUrl, isBrowser } from "@/lib/env";

/** Buat list link tRPC yang mendukung WS untuk subscription */
export function getTRPCLinks(): TRPCLink<AppRouter>[] {
  const httpUrl = getHttpTRPCUrl();
  const wsUrl = getWsUrl();

  const baseLogger = loggerLink<AppRouter>({
    enabled: (op) =>
      process.env.NODE_ENV === "development" ||
      (op.direction === "down" && op.result instanceof Error),
  });

  if (isBrowser() && wsUrl) {
    const client = createWSClient({ url: wsUrl });
    return [
      baseLogger,
      splitLink({
        condition: (op: Operation) => op.type === "subscription",
        true: wsLink<AppRouter>({ client }),
        false: httpBatchLink<AppRouter>({ url: httpUrl }),
      }),
    ];
  }

  // SSR atau jika WS tidak diset → pakai HTTP saja
  return [baseLogger, httpBatchLink<AppRouter>({ url: httpUrl })];
}

/** Alias untuk kompatibel dengan Providers.tsx yang memanggil getWsEnabledLinks */
export const getWsEnabledLinks = getTRPCLinks;
