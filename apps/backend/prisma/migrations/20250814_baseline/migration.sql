-- apps/backend/prisma/migrations/20250814_baseline/migration.sql
-- NOTE: Simpan file ini sebagai UTF-8 TANPA BOM.

-- CreateTable: Tenant
CREATE TABLE "public"."Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable: User
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Message
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contactId" TEXT,
    "fromNumber" TEXT,
    "status" TEXT,
    "toNumber" TEXT,
    "waMessageId" TEXT,
    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Contact
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "waPhone" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
CREATE UNIQUE INDEX "Message_waMessageId_key" ON "public"."Message"("waMessageId");
CREATE UNIQUE INDEX "Contact_waPhone_key" ON "public"."Contact"("waPhone");

-- FKs
ALTER TABLE "public"."User"
  ADD CONSTRAINT "User_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."Message"
  ADD CONSTRAINT "Message_contactId_fkey"
  FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public"."Message"
  ADD CONSTRAINT "Message_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."Contact"
  ADD CONSTRAINT "Contact_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
