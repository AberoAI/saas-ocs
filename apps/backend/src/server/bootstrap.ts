// apps/backend/src/server/bootstrap.ts
import { redis } from "../lib/redis";

/**
 * Inisialisasi side-effect opsional:
 * - Hanya mencoba konek Redis jika REDIS_URL diset.
 * - Tidak mengganggu startup bila Redis tidak tersedia.
 */
(async () => {
  try {
    const hasRedisUrl = !!process.env.REDIS_URL;
    if (!hasRedisUrl) {
      console.log(
        "[bootstrap] REDIS_URL tidak diset; lewati inisialisasi Redis.",
      );
      return;
    }

    if (!redis.isOpen) await redis.connect();
    const pong = await redis.ping();
    console.log("[bootstrap] Redis PING:", pong);
  } catch (err) {
    console.error("[bootstrap] Redis connection failed:", err);
    // Jangan throw; biarkan server tetap hidup tanpa Redis
  }
})();
