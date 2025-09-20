// Pastikan anchor "/#..." ikut diprefix, dan external URL tidak disentuh
export function withLocale(prefix: string, href: string): string {
  if (!href.startsWith('/')) return href;      // external or hash-only
  if (href.startsWith('//')) return href;      // schema-less
  // Hindari double-prefix jika href sudah berprefix locale yang sama
  if (prefix && (href === prefix || href.startsWith(prefix + '/'))) return href;
  if (href.startsWith('/#')) return `${prefix}${href}`;
  return `${prefix}${href}`;
}
