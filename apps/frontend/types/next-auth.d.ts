// apps/frontend/src/types/next-auth.d.ts
import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    /**
     * Saat belum login, NextAuth akan mengembalikan `user: null`.
     * Saat sudah login, user minimal memiliki `id` dan opsional `tenantId`.
     */
    user: (DefaultSession["user"] & {
      id: string;
      tenantId?: string | null;
    }) | null;
  }

  interface User extends DefaultUser {
    id: string;
    tenantId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /**
     * Kita menyimpan payload user ke dalam token seperti yang dilakukan di callbacks.jwt
     * (lihat route handler kamu).
     */
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      tenantId?: string | null;
    };
  }
}
