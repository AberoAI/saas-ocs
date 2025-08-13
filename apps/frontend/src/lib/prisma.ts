import { PrismaClient } from "@prisma/client";

// Gunakan deklarasi global untuk menghindari re-init di dev (Hot Reload)
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export function getPrisma(): PrismaClient {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query"], // setting dari code kamu
    });
  }
  return global.prisma;
}

// Instance siap pakai (opsional)
export const prisma = getPrisma();
