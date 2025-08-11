// apps/backend/src/middleware/auth.ts
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";

interface MyJWTPayload extends JwtPayload {
  tenantId: string;
}

// 1️⃣ Setup Redis client
const redisClient = new Redis(process.env.REDIS_URL!);

// 2️⃣ Setup Rate Limiter
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 100, // Maks 100 request
  duration: 60, // per 60 detik per tenant
  keyPrefix: "rate-limit",
});

interface RateLimitError {
  msBeforeNext: number;
}

function isRateLimitError(error: unknown): error is RateLimitError {
  return (
    typeof error === "object" &&
    error !== null &&
    "msBeforeNext" in error &&
    typeof (error as Record<string, unknown>).msBeforeNext === "number"
  );
}

export async function middleware(req: NextRequest) {
  // 1️⃣ Ambil token dari header
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2️⃣ Verifikasi token JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as MyJWTPayload;

    // 3️⃣ Pastikan token punya tenantId
    if (!payload.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 4️⃣ Konsumsi rate limiter berdasarkan tenantId
    await rateLimiter.consume(payload.tenantId);

    // 5️⃣ Lolos semua validasi → lanjutkan request
    const response = NextResponse.next();
    response.headers.set("x-tenant-id", payload.tenantId);
    return response;
  } catch (err: unknown) {
    // 6️⃣ Jika terkena rate limit
    if (isRateLimitError(err)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    // 7️⃣ Jika token invalid atau error lain
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
