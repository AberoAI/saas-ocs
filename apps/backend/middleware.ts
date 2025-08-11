// File: apps/backend/middleware.ts
import { middleware as authMiddleware } from "./src/middleware/auth";

export const middleware = authMiddleware;

export const config = {
  // Proteksi semua route API dengan middleware ini
  matcher: ["/api/:path*"],
};
