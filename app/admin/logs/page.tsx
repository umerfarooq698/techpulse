import { db } from '@/lib/db';
import { ScrollText } from 'lucide-react';

export const revalidate = 0;

export default async function LogsPage() {
  const logs = await db.log.findMany({
    orderBy: { timestamp: 'desc' },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <ScrollText className="w-6 h-6 text-sky-600" /> System & AI Generation Audit Logs
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Detailed activity logs, API execution times, and status reports with masked credentials.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600 font-mono">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500 font-sans">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Action</th>
              <th className="p-4">Keyword / Details</th>
              <th className="p-4">Provider</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="p-4 font-bold text-slate-900 font-sans">{log.action}</td>
                <td className="p-4 text-slate-700 max-w-xs truncate">{log.message}</td>
                <td className="p-4 text-slate-500">{log.provider || 'system'}</td>
                <td className="p-4 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 font-sans">
                  No system logs recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
