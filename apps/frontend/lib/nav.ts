// apps/frontend/lib/nav.ts
import type { AppPath } from "@/i18n/routing";

export interface NavItem {
  key: string;
  href: AppPath;
}

export const NAV_LINKS: NavItem[] = [
  { key: "foundation", href: "/foundation" },
  { key: "product", href: "/product" },
  { key: "solutions", href: "/solutions" },
  { key: "pricing", href: "/pricing" },
];
