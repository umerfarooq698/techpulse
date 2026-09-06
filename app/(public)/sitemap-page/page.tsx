import Link from 'next/link';
import { db } from '@/lib/db';

export const revalidate = 0;

export default async function HTMLSitemapPage() {
  const [categories, articles] = await Promise.all([
    db.category.findMany({ where: { enabled: true }, orderBy: { order: 'asc' } }),
    db.article.findMany({ where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-700 text-xs">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Publication Sitemap</h1>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b pb-2">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {categories.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="text-sky-600 font-semibold hover:underline">
              {c.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-base font-bold text-slate-900 border-b pb-2">Published Articles</h2>
        <ul className="space-y-2">
          {articles.map((art) => (
            <li key={art.id}>
              <Link href={`/article/${art.slug}`} className="text-slate-800 font-medium hover:text-sky-600">
                {art.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
