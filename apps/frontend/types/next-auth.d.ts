import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id: string;          // dipakai di UI: session.user.id
      tenantId?: string;   // multi-tenant awareness
      email?: string | null;
    };
  }

  interface User extends DefaultUser {
    tenantId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    // dukung dua-duanya supaya fleksibel dengan callback yang ada
    id?: string;          // beberapa setup pakai 'id'
    userId?: string;      // beberapa setup pakai 'userId'
    tenantId?: string;
    email?: string | null;
  }
}
