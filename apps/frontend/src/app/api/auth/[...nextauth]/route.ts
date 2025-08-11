// apps/frontend/src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions, type Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import type { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { tenant: true },
        });
        if (!user) return null;

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;

        // Nilai ini akan masuk ke callback JWT sebagai 'user'
        return {
          id: user.id,
          email: user.email,
          tenantId: user.tenantId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      // 'user' hanya ada saat login pertama kali
      if (user) {
        // Field custom ini sudah dideklarasikan di apps/frontend/src/types/next-auth.d.ts
        token.userId = (user as { id?: string }).id;
        token.tenantId = (user as { tenantId?: string }).tenantId;
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (session.user) {
        // Mapping token -> session (menggunakan augmentation yang sudah kamu buat)
        (session.user as any).id = (token as any).userId ?? (token as any).id;
        (session.user as any).tenantId = (token as any).tenantId;
        // (opsional) juga teruskan email
        if (!(session.user as any).email && (token as any).email) {
          (session.user as any).email = (token as any).email as string;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
