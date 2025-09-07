// apps/frontend/src/app/providers.tsx
"use client";

import React, { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { getWsEnabledLinks } from "@/lib/trpcLinks";
import type { TRPCLink } from "@trpc/client";
import type { AppRouter } from "shared/router";

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
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    TRPC.createClient({
      links: getWsEnabledLinks() as Links,
    }),
  );

  return (
    <SessionProvider>
      <TRPC.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </TRPC.Provider>
    </SessionProvider>
  );
}
