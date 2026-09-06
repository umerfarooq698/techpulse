import { db } from '@/lib/db';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function ScheduledPostsPage() {
  const scheduledArticles = await db.article.findMany({
    where: { status: 'SCHEDULED' },
    orderBy: { scheduledDate: 'asc' },
    include: { primaryCategory: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-sky-600" /> Scheduled Posts
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Articles queued for automatic server-side publishing at configured time windows.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500">
            <tr>
              <th className="p-4">Article Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Scheduled Release Time</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {scheduledArticles.map((art) => (
              <tr key={art.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-900">{art.title}</td>
                <td className="p-4 font-semibold text-slate-700">{art.primaryCategory.name}</td>
                <td className="p-4 text-amber-600 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {art.scheduledDate ? new Date(art.scheduledDate).toLocaleString() : 'Pending Queue'}
                </td>
                <td className="p-4 text-right">
                  <a href={`/admin/articles/${art.id}`} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs">
                    Edit Schedule
                  </a>
                </td>
              </tr>
            ))}
            {scheduledArticles.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">
                  No posts currently scheduled. Select "Schedule" mode when generating articles to populate calendar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
