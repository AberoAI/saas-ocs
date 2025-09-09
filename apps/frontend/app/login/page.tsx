// apps/frontend/app/login/page.tsx
"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const metadata = {
  title: "Login – AberoAI",
};

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const nextPath = sp.get("next") || "/dashboard"; // fallback tujuan

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErr(null);
      setSubmitting(true);
      try {
        // 👉 Ganti URL di bawah sesuai backend kamu.
        // Best practice: endpoint akan set HttpOnly cookie (AUTH_COOKIE_NAME) bila sukses.
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });

        if (!res.ok) {
          const data = await safeJson(res);
          throw new Error(data?.error || "Login failed");
        }

        // Sukses: arahkan ke nextPath
        router.replace(nextPath);
      } catch (e: any) {
        setErr(e?.message || "Unexpected error");
      } finally {
        setSubmitting(false);
      }
    },
    [email, password, router, nextPath]
  );

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6">
      <h1 className="mb-6 text-center text-3xl font-semibold">Login</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring"
            placeholder="you@company.com"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring"
            placeholder="••••••••"
          />
        </label>

        {err ? (
          <p className="text-sm text-red-600" role="alert">
            {err}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-neutral-600">
        <a href="/forgot-password" className="underline">
          Forgot password?
        </a>
      </div>

      <footer className="mt-10 text-center text-sm text-neutral-500">
        <a href="/" className="underline">
          ← Back to Home
        </a>
      </footer>
    </main>
  );
}

// Utility kecil agar parsing JSON aman
async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}
