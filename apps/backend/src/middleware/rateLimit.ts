import { NextRequest, NextResponse } from "next/server";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL!);

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 100, // Maks 100 request
  duration: 60, // Per 60 detik per tenant
  keyPrefix: "rate-limit",
});

export async function rateLimitMiddleware(req: NextRequest) {
  const tenantId = req.headers.get("x-tenant-id");
  if (!tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await rateLimiter.consume(tenantId);
    return NextResponse.next();
  } catch {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
}
