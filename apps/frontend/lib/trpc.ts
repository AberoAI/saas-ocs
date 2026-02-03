// saas-ocs/apps/frontend/src/lib/trpc.ts
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/api-types";

// Instance React hooks untuk tRPC dengan tipe AppRouter
export const trpc = createTRPCReact<AppRouter>();

// Normalisasi URL tRPC (hapus trailing slash ganda)
const getTrpcUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_TRPC_URL ?? "http://localhost:4000/trpc";
  return url.replace(/\/+$/, "");
};

// Factory client tRPC untuk dipakai di Provider
export const createTRPCClient = () =>
  trpc.createClient({
    links: [
      httpBatchLink({
        url: getTrpcUrl(),
        headers() {
          // Inject header multi-tenant (contoh)
          return { "x-tenant-id": "demo-tenant-id" };
        },
      }),
    ],
  });
