import { db } from '@/lib/db';
import { KeyRound, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function KeywordsDatabasePage() {
  const keywords = await db.keyword.findMany({
    orderBy: { dateAdded: 'desc' },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-sky-600" /> Keywords Database
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Track target keywords, search intent, generation status, and guard against cannibalization.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-xs text-amber-800">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <strong className="font-bold">Content Cannibalization Protection Active:</strong> TechPulse automatically flags keywords targeting closely related search intents before generating duplicate articles.
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500">
            <tr>
              <th className="p-4">Keyword</th>
              <th className="p-4">Search Intent</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {keywords.map((kw) => (
              <tr key={kw.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-900">{kw.keyword}</td>
                <td className="p-4 text-slate-600">{kw.searchIntent || 'Informational'}</td>
                <td className="p-4">{kw.category?.name || 'Technology'}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-extrabold text-[10px] rounded-full uppercase">
                    {kw.status}
                  </span>
                </td>
                <td className="p-4 text-right text-slate-400">{new Date(kw.dateAdded).toLocaleDateString()}</td>
              </tr>
            ))}
            {keywords.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No keywords recorded in database. Keywords added during AI generation will populate here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
