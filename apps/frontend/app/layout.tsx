// apps/frontend/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
// ⛔️ HAPUS: import Navbar from "@/components/Navbar";
// Fallback i18n provider untuk route spesial (/_not-found)
import { NextIntlClientProvider } from "next-intl";
import type { AbstractIntlMessages } from "next-intl";
import enMessages from "../messages/en.json";
import { defaultLocale } from "./i18n";

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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }]
  },
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fallbackMessages = enMessages as unknown as AbstractIntlMessages;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          "min-h-screen antialiased",
          "bg-[var(--background)] text-[var(--foreground)]",
        ].join(" ")}
      >
        {/* Fallback i18n provider agar komponen global tidak crash saat /_not-found */}
        <NextIntlClientProvider locale={defaultLocale} messages={fallbackMessages}>
          <Providers>
            {/* ⛔️ HAPUS: <Navbar /> di root */}
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
