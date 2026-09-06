import { db } from '@/lib/db';
import { getOrphanArticles } from '@/lib/seo/internal-links';
import { Link2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function InternalLinksPage() {
  const orphanArticles = await getOrphanArticles();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Link2 className="w-6 h-6 text-sky-600" /> Internal Links Engine & Orphan Detector
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Automated semantic keyword matching and orphan article detection to distribute PageRank across your publication.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" /> Orphan Content Analysis
          </h3>
          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-bold text-xs rounded-full">
            {orphanArticles.length} Orphan Articles
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {orphanArticles.map((art) => (
            <div key={art.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">{art.title}</span>
                <span className="text-slate-400 text-[11px] block">Slug: /{art.slug}</span>
              </div>
              <a
                href={`/admin/articles/${art.id}`}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded"
              >
                Add Internal Links
              </a>
            </div>
          ))}
          {orphanArticles.length === 0 && (
            <div className="py-4 text-slate-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> All articles have incoming internal link anchors!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
