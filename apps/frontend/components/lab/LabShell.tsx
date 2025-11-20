// ABEROAI LAB NOTES
// 1) Menambahkan eksperimen baru ke LAB
//    - Tentukan kategori: svg / scroll / hero (atau buat folder baru, misalnya `timeline`).
//    - Buat component baru di:
//        components/lab/<kategori>/<NamaEksperimen>.tsx
//      Contoh:
//        components/lab/svg/SvgNewOrbitExperiment.tsx
//    - Buat halaman baru di app router (optional):
//        apps/frontend/app/(dev)/lab/svg/new-orbit/page.tsx
//      Isi dengan pola yang sama:
//        - Cek NODE_ENV → notFound() jika bukan development.
//        - Bungkus dengan <LabShell />.
//        - Render <SvgNewOrbitExperiment />.
//    - (Opsional) Tambahkan link ke NAV_ITEMS di LabShell.tsx jika ingin muncul di navbar LAB.
//
// 2) Memindahkan eksperimen dari LAB ke production
//    - Saat satu eksperimen sudah "lulus" dari LAB:
//        a) Copy file component dari `components/lab/...`
//           ke folder production, misalnya:
//             components/hero/HeroAberoVariant.tsx
//        b) Sesuaikan import di halaman utama, misalnya:
//             apps/frontend/app/[locale]/page.tsx
//           ganti hero lama menjadi <HeroAberoVariant />.
//        c) Jangan bawa hal-hal spesifik LAB ke production
//           (misalnya text note, border debug, dll).
//        d) Setelah dipakai di production dan stabil, kamu bisa:
//             - Tetap biarkan versi LAB sebagai referensi,
//             - atau hapus dari LAB agar playground tetap bersih.
//
// 3) Prinsip penting LAB:
//    - LAB TIDAK BOLEH mengubah logic utama, database, atau routing publik.
//    - Tidak ada dependency ke state global aplikasi (auth, tenant, dsb) kecuali memang sengaja diuji.
//    - Anggap LAB sebagai "Figma interaktif": tempat test motion & layout,
//      bukan tempat bikin business logic inti.


// apps/frontend/components/lab/LabShell.tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LabShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const NAV_ITEMS = [
  { href: "/lab", label: "Overview" },
  { href: "/lab/svg", label: "SVG" },
  { href: "/lab/scroll", label: "Scroll" },
  { href: "/lab/hero", label: "Hero" },
];

export default function LabShell({ title, subtitle, children }: LabShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-xs font-semibold text-white">
              LAB
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">AberoAI LAB</span>
              <span className="text-[11px] text-slate-500">
                Internal playground (development only)
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="text-xs font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
          >
            ← Kembali ke main site
          </Link>
        </div>

        <nav className="border-t border-slate-200">
          <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 py-2 text-xs">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/lab"
                  ? pathname === "/lab"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "rounded-md px-3 py-1.5 font-medium transition",
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-10 pt-6">
        <section>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-600">{subtitle}</p>
          )}
        </section>

        <section className="mt-4">{children}</section>
      </main>
    </div>
  );
}

