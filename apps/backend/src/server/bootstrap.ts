// apps/backend/src/server/bootstrap.ts
import { redis } from "../lib/redis";

(async () => {
  try {
    if (!redis.isOpen) await redis.connect();
    const pong = await redis.ping();
    console.log("[bootstrap] Redis PING:", pong);
  } catch (err) {
    console.error("[bootstrap] Redis connection failed:", err);
  }
})();
