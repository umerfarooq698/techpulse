import { db } from '@/lib/db';
import { FolderTree, Plus } from 'lucide-react';

export const revalidate = 0;

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-sky-600" /> Categories Manager
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure primary tech publishing categories, homepage ordering, and category SEO metadata.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-base">{cat.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                Order: #{cat.order}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">{cat.description || 'No description set.'}</p>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Slug: <code className="text-sky-600 font-mono">/category/{cat.slug}</code></span>
              <span className="font-semibold text-slate-700">{cat._count.articles} Articles</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
