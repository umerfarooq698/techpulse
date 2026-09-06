import Link from 'next/link';
import { db } from '@/lib/db';
import { Search } from 'lucide-react';

export const revalidate = 0;

export default async function SearchResultsPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';

  const articles = query
    ? await db.article.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
            { primaryKeyword: { contains: query } },
          ],
        },
        include: { primaryCategory: true },
      })
    : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Search className="w-6 h-6 text-sky-600" /> Search Results for "{query}"
        </h1>
        <p className="text-sm text-slate-500 mt-1">Found {articles.length} articles matching your query.</p>
      </div>

      <div className="space-y-4">
        {articles.map((art) => (
          <div key={art.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:border-sky-300 transition-colors">
            <div className="text-[11px] text-sky-600 font-bold uppercase">{art.primaryCategory.name}</div>
            <Link href={`/article/${art.slug}`} className="font-bold text-slate-900 text-base hover:text-sky-600 block">
              {art.title}
            </Link>
            <p className="text-xs text-slate-600 line-clamp-2">{art.excerpt}</p>
          </div>
        ))}
        {articles.length === 0 && (
          <div className="p-12 text-center text-slate-400 bg-white rounded-xl border">
            No articles matching "{query}". Try searching for software, smartphones, or AI topics.
          </div>
        )}
      </div>
    </div>
  );
}
