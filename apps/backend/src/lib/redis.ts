// apps/backend/src/lib/redis.ts
import { createClient, type RedisClientType } from "redis";

// ➜ Tambahkan anotasi tipe eksplisit agar tidak memicu TS2742/7056
export const redis: RedisClientType = createClient({
  url: process.env.REDIS_URL,
});

redis.on("error", (err: unknown) => {
  console.error("Redis Client Error", err);
});

// Panggil sebelum pemakaian untuk memastikan koneksi terbuka
export async function ensureRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}
