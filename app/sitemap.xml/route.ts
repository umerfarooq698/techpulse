import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const [categories, articles] = await Promise.all([
    db.category.findMany({ where: { enabled: true } }),
    db.article.findMany({ where: { status: 'PUBLISHED' } }),
  ]);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  for (const cat of categories) {
    xml += `
  <url>
    <loc>${siteUrl}/category/${cat.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  for (const art of articles) {
    xml += `
  <url>
    <loc>${siteUrl}/article/${art.slug}</loc>
    <lastmod>${new Date(art.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  xml += `
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
