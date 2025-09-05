// apps/frontend/src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// Opsional: arahkan validasi ke backend jika ada
const BACKEND_URL = process.env.BACKEND_URL;

// Fallback demo (tanpa backend): set di Vercel bila mau coba cepat
const DEMO_EMAIL = process.env.FRONTEND_DEMO_EMAIL ?? "";
const DEMO_PASSWORD = process.env.FRONTEND_DEMO_PASSWORD ?? "";

export const runtime = "nodejs";

// Tambah tenantId agar ikut terbawa (opsional)
type BasicUser = { id: string; name?: string | null; email?: string | null; tenantId?: string | null };
type WithUser<T> = T & { user?: BasicUser };

const handler = NextAuth({
  // penting → gunakan secret dari ENV
  secret: process.env.NEXTAUTH_SECRET,

  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const email = credentials?.email ?? "";
        const password = credentials?.password ?? "";

        // Jika ada BACKEND_URL, validasi ke backend
        if (BACKEND_URL) {
          try {
            const r = await fetch(`${BACKEND_URL}/auth/login`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ email, password }),
            });

            if (!r.ok) return null;

            // Harapkan backend minimal { id, name, email, tenantId? }
            const raw = (await r.json()) as Partial<BasicUser> | null;
            if (!raw?.id) return null;

            const user: User = {
              id: String(raw.id),
              name: raw.name ?? null,
              email: raw.email ?? null,
            };

            (user as unknown as BasicUser).tenantId = raw.tenantId ?? null;
            return user;
          } catch {
            return null;
          }
        }

        // Fallback lokal sederhana (tanpa DB)
        if (DEMO_EMAIL && DEMO_PASSWORD && email === DEMO_EMAIL && password === DEMO_PASSWORD) {
          const user: User = { id: "demo-user", name: "Demo User", email: DEMO_EMAIL };
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as Partial<BasicUser>;
        const tok = token as WithUser<JWT>;
        tok.user = {
          id: String(u.id ?? ""),
          name: u.name ?? null,
          email: u.email ?? null,
          tenantId: u.tenantId ?? null,
        };
        return tok;
      }
      return token;
    },
    async session({ session, token }) {
      const tok = token as WithUser<JWT>;
      if (tok.user) {
        const s = session as Session & {
          user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            tenantId?: string | null;
          };
        };

        s.user = {
          id: tok.user.id,
          name: tok.user.name ?? null,
          email: tok.user.email ?? null,
          image: s.user?.image ?? null,
          ...(tok.user.tenantId ? { tenantId: tok.user.tenantId } : {}),
        };

        return s;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
