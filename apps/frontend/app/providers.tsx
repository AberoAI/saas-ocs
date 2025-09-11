// apps/frontend/app/providers.tsx
"use client";

import React, { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "lib/trpc";
import { getWsEnabledLinks } from "lib/trpcLinks";
import type { TRPCLink } from "@trpc/client";
import type { AppRouter } from "@repo/api-types/router"; // ⬅️ ganti ke paket types-only

/**
 * Catatan:
 * Karena AppRouter kamu punya key yang bentrok (Provider/useContext/useUtils),
 * tipe `trpc` berubah jadi union pesan error. Solusi minimal: cast saat createClient & Provider.
 * Nanti kalau sudah rename key-key bentrok di backend, cast ini bisa dihapus.
 */
type Links = TRPCLink<AppRouter>[];
type TrpcClient = unknown;

const TRPC = trpc as unknown as {
  createClient: (opts: { links: Links }) => TrpcClient;
  Provider: React.ComponentType<{
    client: TrpcClient;
    queryClient: QueryClient;
    children: React.ReactNode;
  }>;
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // Tweak ringan agar UX tenang & stabil di client
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            // @tanstack/react-query v5
            staleTime: 10_000, // 10s
            gcTime: 5 * 60 * 1000 // 5 menit
          }
        }
      })
  );

  const [trpcClient] = useState(() =>
    TRPC.createClient({
      links: getWsEnabledLinks() as Links
    })
  );

  return (
    <SessionProvider>
      <TRPC.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </TRPC.Provider>
    </SessionProvider>
  );
}
