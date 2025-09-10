// apps/frontend/app/login/LoginClient.tsx
"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

type Props = {
  nextPath: string;
  nextAuthError: string | null;
};

export default function LoginClient({ nextPath, nextAuthError }: Props) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const mappedNextAuthError = useMemo(
    () => (nextAuthError ? mapNextAuthError(nextAuthError) : null),
    [nextAuthError],
  );

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErr(null);
      setSubmitting(true);

      const emailTrim = email.trim();
      const passTrim = password.trim();
      if (!emailTrim || !passTrim) {
        setErr("Email dan password wajib diisi.");
        setSubmitting(false);
        return;
      }

      try {
        const res = await signIn("credentials", {
          email: emailTrim,
          password: passTrim,
          redirect: false,
          callbackUrl: nextPath,
        });

        if (res?.ok) {
          router.replace(nextPath);
        } else {
          setErr(res?.error || "Login gagal. Periksa email/password.");
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        setErr(`Terjadi kesalahan: ${message}`);
      } finally {
        setSubmitting(false);
      }
    },
    [email, password, nextPath, router],
  );

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6">
      <h1 className="mb-6 text-center text-3xl font-semibold">Login</h1>

      {mappedNextAuthError ? (
        <p className="mb-3 text-sm text-red-600" role="alert">
          {mappedNextAuthError}
        </p>
      ) : null}

      {err ? (
        <p className="mb-3 text-sm text-red-600" role="alert">
          {err}
        </p>
      ) : null}

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
            aria-label="Email"
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
            aria-label="Password"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          aria-busy={submitting}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-neutral-600">
        <Link href="/forgot-password" className="underline">
          Forgot password?
        </Link>
      </div>

      <footer className="mt-10 text-center text-sm text-neutral-500">
        <Link href="/" className="underline">
          ← Back to Home
        </Link>
      </footer>
    </main>
  );
}

// ——— helpers ———
function mapNextAuthError(code: string): string {
  switch (code) {
    case "CredentialsSignin":
      return "Login gagal. Email atau password salah.";
    case "AccessDenied":
      return "Akses ditolak.";
    case "Configuration":
      return "Konfigurasi auth tidak valid. Hubungi admin.";
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
      return "Terjadi masalah pada proses OAuth.";
    case "EmailSignin":
      return "Gagal mengirim link login email.";
    case "Verification":
      return "Link verifikasi tidak valid atau sudah kedaluwarsa.";
    default:
      return "Terjadi kesalahan pada proses login.";
  }
}
