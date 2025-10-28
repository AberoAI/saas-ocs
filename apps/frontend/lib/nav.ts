// apps/frontend/lib/nav.ts
import type { AppPath } from "@/i18n/routing";

export interface NavItem {
  key: string;
  href: AppPath;
}

export const NAV_LINKS: NavItem[] = [
  { key: "about", href: "/about" },
  { key: "product", href: "/product" }, // parent dropdown
  { key: "pricing", href: "/pricing" },
  { key: "contact", href: "/contact" },
];
