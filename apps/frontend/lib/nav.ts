// apps/frontend/lib/nav.ts
export const NAV_LINKS = [
  { key: "about",   href: "/about" },
  // Ganti "solutions" (top-level) -> "product" sebagai parent dummy.
  // Dropdown Features & Solutions dirender oleh Navbar.tsx saat key === "product".
  { key: "product", href: "/product" }, 
  { key: "pricing", href: "/pricing" },
  { key: "contact", href: "/contact" },
];
