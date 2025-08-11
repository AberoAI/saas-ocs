// apps/frontend/src/app/providers.tsx
'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
// import { ThemeProvider } from 'next-themes';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* Tambah provider lain di sini bila diperlukan */}
      {/* <ThemeProvider attribute="class"> */}
      {/* <QueryClientProvider client={queryClient}> */}
      {children}
      {/* </QueryClientProvider> */}
      {/* </ThemeProvider> */}
    </SessionProvider>
  );
}
