// apps/frontend/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar"; // ⬅️ ADDED

// Font configuration (CSS vars dipakai di globals.css)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AberoAI",
  description: "AI-powered Online Customer Service Automation",
  // ✅ Tambahan sesuai instruksi: wiring icon & manifest
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" }, // utama (modern)
      { url: "/favicon.ico", sizes: "any" }        // fallback universal
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }]
    // Jika nanti kamu menambahkan maskable PNG:
    // other: [
    //   { rel: "icon", url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    //   { rel: "icon", url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    //   { rel: "mask-icon", url: "/icon-192-maskable.png" },
    //   { rel: "mask-icon", url: "/icon-512-maskable.png" }
    // ]
  },
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          "min-h-screen antialiased",
          // gunakan CSS vars dari globals.css (scalable untuk theming)
          "bg-[var(--background)] text-[var(--foreground)]",
        ].join(" ")}
      >
        {/* Global providers (NextAuth, tRPC, Theme, dsb) */}
        <Providers>
          <Navbar />        {/* ⬅️ ADDED: navbar global */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
