import { db } from '@/lib/db';
import { ListOrdered, Play, CheckCircle2, Clock } from 'lucide-react';

export const revalidate = 0;

export default async function ContentQueuePage() {
  const jobs = await db.generationJob.findMany({
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <ListOrdered className="w-6 h-6 text-sky-600" /> Content Queue Manager
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Monitor upcoming, generating, completed, and failed generation tasks.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500">
            <tr>
              <th className="p-4">Keyword</th>
              <th className="p-4">Article Type</th>
              <th className="p-4">Current Stage</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-900">{j.keyword}</td>
                <td className="p-4 text-slate-600 font-medium">{j.articleType}</td>
                <td className="p-4 text-slate-600">{j.currentStage}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                    j.status === 'PUBLISHED' || j.status === 'READY'
                      ? 'bg-emerald-100 text-emerald-800'
                      : j.status === 'FAILED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-sky-100 text-sky-800'
                  }`}>
                    {j.status}
                  </span>
                </td>
                <td className="p-4 text-right text-slate-400">{new Date(j.createdAt).toLocaleTimeString()}</td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No queue jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
