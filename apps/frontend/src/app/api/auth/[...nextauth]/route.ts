// apps/frontend/src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Opsional: arahkan validasi ke backend jika ada
const BACKEND_URL = process.env.BACKEND_URL;

// Fallback demo (tanpa backend): set di Vercel bila mau coba cepat
// FRONTEND_DEMO_EMAIL, FRONTEND_DEMO_PASSWORD
const DEMO_EMAIL = process.env.FRONTEND_DEMO_EMAIL ?? "";
const DEMO_PASSWORD = process.env.FRONTEND_DEMO_PASSWORD ?? "";

export const runtime = "nodejs";

const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email ?? "";
        const password = credentials?.password ?? "";

        // Jika ada BACKEND_URL, validasi ke backend
        if (BACKEND_URL) {
          const r = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          if (!r.ok) return null;
          // Backend sebaiknya balikan minimal: { id, name, email }
          const user = await r.json();
          return user ?? null;
        }

        // Fallback lokal sederhana (tanpa DB)
        if (DEMO_EMAIL && DEMO_PASSWORD && email === DEMO_EMAIL && password === DEMO_PASSWORD) {
          return { id: "demo-user", name: "Demo User", email: DEMO_EMAIL };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // lampirkan user ke token saat login
      if (user) {
        token.user = {
          id: (user as any).id,
          name: (user as any).name,
          email: (user as any).email,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // kirim user ke session
      (session as any).user = token.user;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
