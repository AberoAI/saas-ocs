// apps/backend/src/seed-user.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

/**
 * Konfigurasi seed lewat ENV (fallback ke default kalau tidak di-set)
 * Contoh set sementara di PowerShell:
 *  $env:SEED_EMAIL="admin@example.com"
 *  $env:SEED_PASSWORD="admin123"        # boleh plain atau hash $2b$...
 *  $env:SEED_TENANT_NAME="Default Tenant"
 *
 * NOTE: Schema Tenant kamu TIDAK punya 'slug', jadi kita pakai 'name' saja.
 */
const EMAIL = process.env.SEED_EMAIL ?? "admin@example.com";
const RAW_PASSWORD = process.env.SEED_PASSWORD ?? "admin123";
const TENANT_NAME =
  process.env.SEED_TENANT_NAME ??
  process.env.SEED_TENANT_SLUG /* fallback kalau terlanjur di-set */ ??
  "Default Tenant";

// deteksi apakah SEED_PASSWORD sudah berupa hash bcrypt
function isBcryptHash(v: string) {
  return v.startsWith("$2a$") || v.startsWith("$2b$") || v.startsWith("$2y$");
}

async function main() {
  console.log("➡ Seeding user...");
  console.log({ EMAIL, TENANT_NAME });

  // 1) Pastikan tenant ada (by name)
  let tenant = await prisma.tenant.findFirst({
    where: { name: TENANT_NAME },
  });

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: { name: TENANT_NAME },
    });
    console.log("✓ Tenant dibuat:", tenant.id);
  } else {
    console.log("✓ Tenant ditemukan:", tenant.id);
  }

  // 2) Siapkan hash password (kalau sudah hash, pakai langsung)
  const passwordHash = isBcryptHash(RAW_PASSWORD)
    ? RAW_PASSWORD
    : await bcrypt.hash(RAW_PASSWORD, 10);

  // 3) Upsert user by email
  const user = await prisma.user.upsert({
    where: { email: EMAIL },
    update: {
      password: passwordHash,
      tenantId: tenant.id,
    },
    create: {
      email: EMAIL,
      password: passwordHash,
      tenantId: tenant.id,
    },
  });

  console.log("✓ User siap dipakai:");
  console.log({
    id: user.id,
    email: user.email,
    tenantId: user.tenantId,
  });

  console.log("✅ Seeding done.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
