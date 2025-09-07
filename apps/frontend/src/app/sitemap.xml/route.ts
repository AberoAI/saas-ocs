export async function GET() {
  const urls = ["/", "/privacy", "/terms"];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map((u) => `<url><loc>${process.env.NEXT_PUBLIC_BIZ_DOMAIN || "http://localhost:3000"}${u}</loc></url>`).join("")}
  </urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
