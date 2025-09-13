import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EMAIL = process.env.SEED_EMAIL ?? "admin@example.com";
const RAW_PASSWORD = process.env.SEED_PASSWORD ?? "admin123";
const TENANT_NAME =
  process.env.SEED_TENANT_NAME ??
  process.env.SEED_TENANT_SLUG ??
  "Default Tenant";

function isBcryptHash(v: string) {
  return v.startsWith("$2a$") || v.startsWith("$2b$") || v.startsWith("$2y$");
}

async function main() {
  console.log("➡ Seeding user...");
  console.log({ EMAIL, TENANT_NAME });

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

  const passwordHash = isBcryptHash(RAW_PASSWORD)
    ? RAW_PASSWORD
    : await bcrypt.hash(RAW_PASSWORD, 10);

  const user = await prisma.user.upsert({
    where: { email: EMAIL },
    update: { password: passwordHash, tenantId: tenant.id },
    create: { email: EMAIL, password: passwordHash, tenantId: tenant.id },
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
