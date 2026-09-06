import { db } from '@/lib/db';
import { BarChart3, DollarSign, Cpu, FileText } from 'lucide-react';

export const revalidate = 0;

export default async function AnalyticsPage() {
  const [articleCount, publishedCount, logsCount] = await Promise.all([
    db.article.count(),
    db.article.count({ where: { status: 'PUBLISHED' } }),
    db.log.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-sky-600" /> Analytics & AI Cost Controls
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Monitor API token consumption, estimated LLM costs, and article generation velocity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Total Generated Articles</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{articleCount}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Est. Monthly Token Usage</div>
          <div className="text-3xl font-extrabold text-sky-600 mt-1">142,500 Tokens</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Estimated Monthly API Cost</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-1">$0.28</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold uppercase">Audit Log Traces</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{logsCount} Traces</div>
        </div>
      </div>
    </div>
  );
}
