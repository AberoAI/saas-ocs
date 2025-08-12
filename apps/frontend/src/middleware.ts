import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ENABLED = process.env.VERIFICATION_MODE === "true";

// Route yang harus selalu boleh diakses saat mode verifikasi aktif
const SAFE_PREFIXES = [
  "/api",
  "/dashboard",
  "/auth",
  "/_next",
  "/static",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/privacy",
  "/terms",
  "/verify", // <- kita pakai /verify (bukan /__verify)
];

export function middleware(req: NextRequest) {
  if (!ENABLED) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Biarkan request non-GET (POST ke /api, dll) lewat saja
  if (req.method !== "GET") return NextResponse.next();

  // Kalau sudah di /verify atau di jalur aman, jangan diutak-atik
  if (SAFE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Hanya arahkan root "/" ke halaman verifikasi saat mode verifikasi aktif
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/verify";
    return NextResponse.rewrite(url);
  }

  // Selain root (mis. /login, /dashboard), biarkan jalan normal
  return NextResponse.next();
}

// Tetap evaluasi semua path (SAFE_PREFIXES sudah menjaga agar tidak loop)
export const config = {
  matcher: ["/:path*"],
};
