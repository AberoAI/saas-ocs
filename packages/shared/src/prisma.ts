// packages/shared/src/prisma.ts

import { PrismaClient } from "@prisma/client";

declare global {
  // Agar tidak membuat ulang PrismaClient saat di dev mode
  // (karena Next.js / monorepo bisa reload berkali-kali)
  var prisma: PrismaClient | undefined;
}

// Gunakan globalThis untuk menghindari duplikasi instance
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

// Hanya buat instance baru jika belum ada
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // opsional: log semua query ke console saat dev
  });

// Simpan ke global agar tidak dibuat ulang (hanya saat development)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
