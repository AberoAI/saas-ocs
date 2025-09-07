// apps/frontend/src/lib/env.ts

/** true bila berjalan di browser (aman untuk SSR) */
export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** paksa host localhost -> 127.0.0.1 (hindari isu IPv6/Windows) */
function toIPv4IfLocal(u: string): string {
  return u.replace(/\/\/localhost(?=[:/]|$)/gi, "//127.0.0.1");
}

/** buang trailing slash tunggal */
function stripTrailingSlash(u: string): string {
  return u.replace(/\/$/, "");
}

export function getTrpcPath(): string {
  return "/trpc";
}

/** Ambil URL HTTP tRPC untuk query/mutation */
export function getHttpTRPCUrl(): string {
  const http =
    process.env.NEXT_PUBLIC_TRPC_HTTP_URL ??
    process.env.NEXT_PUBLIC_TRPC_URL ??
    "/_trpc";

  const trimmed = http.trim();
  if (!trimmed) throw new Error("TRPC HTTP URL tidak ditemukan di env");

  if (/^https?:\/\//i.test(trimmed)) {
    return stripTrailingSlash(toIPv4IfLocal(trimmed));
  }
  return stripTrailingSlash(trimmed);
}

/** Ambil BASE URL WS (tanpa path) */
function getWsBaseUrl(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_TRPC_WS_URL ??
    process.env.NEXT_PUBLIC_TRPC_WS ??
    "";

  const val = raw.trim();
  if (val) {
    if (/^wss?:\/\//i.test(val)) {
      return stripTrailingSlash(toIPv4IfLocal(val));
    }
    if (isBrowser()) {
      const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
      const abs = new URL(val, `${proto}//${window.location.host}`).toString();
      return stripTrailingSlash(toIPv4IfLocal(abs));
    }
    return null;
  }

  // derive dari HTTP
  const http = getHttpTRPCUrl();
  if (/^https?:\/\//i.test(http)) {
    try {
      const u = new URL(http);
      const proto = u.protocol === "https:" ? "wss:" : "ws:";
      return stripTrailingSlash(toIPv4IfLocal(`${proto}//${u.host}`));
    } catch {}
  }
  if (isBrowser()) {
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    return stripTrailingSlash(
      toIPv4IfLocal(`${proto}//${window.location.host}`),
    );
  }
  return null;
}

/** URL WS lengkap (base + /trpc), memastikan tidak double path */
export function getWsTRPCUrl(): string | null {
  const base = getWsBaseUrl();
  if (!base) return null;

  // jika base sudah mengandung path (mis. ws://host/sesuatu), biarkan
  try {
    const u = new URL(base);
    if (u.pathname && u.pathname !== "/") return u.toString();
  } catch {
    /* abaikan */
  }
  return `${base}${getTrpcPath()}`;
}

/** Back-compat untuk pemanggil lama */
export const getWsUrl = getWsTRPCUrl;
