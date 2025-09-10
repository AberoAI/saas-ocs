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
// Pastikan route ini selalu dynamic (tidak di-cache oleh layer apa pun)
export const dynamic = "force-dynamic";

// Tambah tenantId agar ikut terbawa (opsional)
type BasicUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  tenantId?: string | null;
};
type WithUser<T> = T & { user?: BasicUser };

const handler = NextAuth({
  // W A J I B untuk v4
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

        if (BACKEND_URL) {
          try {
            const r = await fetch(`${BACKEND_URL}/auth/login`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ email, password }),
            });
            if (!r.ok) return null;

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

        if (
          DEMO_EMAIL &&
          DEMO_PASSWORD &&
          email === DEMO_EMAIL &&
          password === DEMO_PASSWORD
        ) {
          return { id: "demo-user", name: "Demo User", email: DEMO_EMAIL };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as Partial<BasicUser>;
        (token as WithUser<JWT>).user = {
          id: String(u.id ?? ""),
          name: u.name ?? null,
          email: u.email ?? null,
          tenantId: u.tenantId ?? null,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // pastikan selalu return bentuk valid dengan 'user' (null bila belum login)
      const tok = token as WithUser<JWT>;

      const s = session as Session & {
        user: {
          id: string;
          name?: string | null;
          email?: string | null;
          image?: string | null;
          tenantId?: string | null;
        } | null;
      };

      if (tok.user) {
        s.user = {
          id: tok.user.id,
          name: tok.user.name ?? null,
          email: tok.user.email ?? null,
          image: s.user?.image ?? null,
          ...(tok.user.tenantId ? { tenantId: tok.user.tenantId } : {}),
        };
      } else {
        s.user = null;
      }

      // 's.expires' sudah diset oleh NextAuth — jangan dibuang
      return s;
    },
  },
});

export { handler as GET, handler as POST };
