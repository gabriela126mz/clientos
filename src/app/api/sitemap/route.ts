// src/app/api/sitemap/route.ts
export async function GET() {
  const baseUrl = 'https://emprenix.com';

  // Páginas estáticas principales
  const staticPages = [
    { url: '/', lastmod: new Date().toISOString().split('T')[0], priority: 1.0 },
    { url: '/precios', lastmod: new Date().toISOString().split('T')[0], priority: 0.9 },
    { url: '/blog', lastmod: new Date().toISOString().split('T')[0], priority: 0.8 },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Agregar páginas estáticas
  staticPages.forEach(page => {
    xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <priority>${page.priority}</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600'
    }
  });
}