import { db } from '@/lib/db';
import { Users, Shield } from 'lucide-react';

export const revalidate = 0;

export default async function AuthorsPage() {
  const authors = await db.author.findMany({
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-sky-600" /> Authors Manager
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage editorial author profiles assigned to published technical articles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((author) => (
          <div key={author.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-lg">
                {author.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{author.name}</h3>
                <div className="text-xs text-sky-600 font-medium">/{author.slug}</div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{author.bio}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Expertise: <span className="font-semibold text-slate-700">{author.expertise}</span></span>
              <span className="font-bold text-slate-900">{author._count.articles} Articles</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
