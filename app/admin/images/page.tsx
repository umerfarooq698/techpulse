import { db } from '@/lib/db';
import { Image as ImageIcon } from 'lucide-react';

export const revalidate = 0;

export default async function MediaLibraryPage() {
  const articles = await db.article.findMany({
    where: { featuredImage: { not: null } },
    select: { id: true, title: true, featuredImage: true, featuredImageAlt: true, createdAt: true },
    take: 24,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-sky-600" /> Media Library & WebP Graphics
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Review generated 16:9 featured imagery, supporting technical illustrations, ALT tags, and WebP compression metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {articles.map((art) => (
          <div key={art.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="h-40 bg-slate-900 relative">
              <img src={art.featuredImage!} alt={art.featuredImageAlt || art.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div className="font-bold text-slate-900 text-xs line-clamp-2">{art.title}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{art.featuredImage}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
