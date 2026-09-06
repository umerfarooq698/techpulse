import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { FolderTree } from 'lucide-react';

export const revalidate = 0;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        include: { author: true },
      },
    },
  });

  if (!category) notFound();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="p-8 bg-gradient-to-r from-slate-900 to-sky-900 rounded-2xl text-white space-y-2 shadow-md">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">Category</span>
        <h1 className="text-3xl font-extrabold">{category.name}</h1>
        {category.description && <p className="text-xs text-slate-300 max-w-xl">{category.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {category.articles.map((art) => (
          <div key={art.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group">
            <Link href={`/article/${art.slug}`} className="h-44 bg-slate-900 relative block overflow-hidden">
              <img src={art.featuredImage || '/uploads/placeholder.webp'} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </Link>
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[11px] text-slate-400 mb-1">{new Date(art.createdAt).toLocaleDateString()}</div>
                <Link href={`/article/${art.slug}`} className="font-bold text-slate-900 text-sm hover:text-sky-600 line-clamp-2 block">
                  {art.title}
                </Link>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{art.excerpt}</p>
            </div>
          </div>
        ))}
        {category.articles.length === 0 && (
          <div className="col-span-3 p-12 text-center text-slate-400 bg-white rounded-xl border">
            No published articles found in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
