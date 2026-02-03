// apps/frontend/lib/trpc.ts
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { TRPCLink } from "@trpc/client";
import type { AppRouter } from "@repo/api-types";

/**
 * NOTE (unblock typing):
 * Saat ini TypeScript masih mendeteksi collision di AppRouter (Provider/useContext/useUtils/createClient),
 * sehingga `createTRPCReact<AppRouter>()` menghasilkan tipe union string error dan mematahkan:
 * - trpc.useUtils()
 * - trpc.createClient()
 * - trpc.Provider
 *
 * Runtime tidak bermasalah; ini murni masalah type-level. Jadi kita buat "typed facade" minimal
 * (cast) agar build Vercel tidak gagal. Setelah AppRouter types sudah bersih, hapus facade ini
 * dan balikkan ke `createTRPCReact<AppRouter>()` tanpa cast.
 */

// Base (runtime)
const trpcBase = createTRPCReact<any>();

// Facade minimal untuk kebutuhan app ini
type Links = TRPCLink<AppRouter>[];
type TrpcClient = unknown;

export const trpc = trpcBase as unknown as {
  createClient: (opts: { links: Links }) => TrpcClient;
  Provider: React.ComponentType<{
    client: TrpcClient;
    queryClient: unknown;
    children: React.ReactNode;
  }>;
  useUtils: () => unknown;
} & typeof trpcBase;

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
    ] as unknown as Links,
  });
