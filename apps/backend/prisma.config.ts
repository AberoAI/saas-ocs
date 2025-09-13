// apps/backend/prisma.config.ts
// Memastikan .env (DATABASE_URL, dsb.) dimuat saat CLI Prisma berjalan
import "dotenv/config";

// Import resmi untuk Prisma Config (v6+)
import { defineConfig } from "prisma/config";

export default defineConfig({
  // Lokasi schema prisma kamu (tetap mengikuti struktur proyekmu)
  schema: "prisma/schema.prisma",

  // (Opsional, hanya kalau suatu saat kamu pindah folder)
  // migrations: { path: "prisma/migrations" },

  // (Opsional) contoh menandai tabel eksternal agar diabaikan Prisma Migrate
  // tables: { externallyManaged: ["_some_view_or_external_table"] },

  // (Sengaja tidak menambahkan konfigurasi seed di sini,
  // karena kamu sudah punya script `pnpm -F @repo/backend exec prisma db seed`.
  // Ini menjaga perubahan minimal dan stabil.)
});
