import { db } from '@/lib/db';
import { Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function AutoPublishingPage() {
  const siteSetting = await db.siteSetting.findFirst();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-sky-600" /> Automatic Publishing System
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure server-side queue scheduling rules, daily frequency bounds, allowed hours, and timezones.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Enable Server-Side Auto Publishing</h3>
            <p className="text-xs text-slate-500">Scheduled posts will automatically publish within designated release windows.</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Posts Per Day</label>
            <input type="number" defaultValue={siteSetting?.autoPublishPostsPerDay || 3} className="w-full p-2.5 border rounded-lg font-medium" />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Minimum Interval (Minutes)</label>
            <input type="number" defaultValue={siteSetting?.autoPublishMinInterval || 120} className="w-full p-2.5 border rounded-lg font-medium" />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Allowed Start Hour (24h)</label>
            <input type="number" defaultValue={siteSetting?.autoPublishStartHour || 9} className="w-full p-2.5 border rounded-lg font-medium" />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Allowed End Hour (24h)</label>
            <input type="number" defaultValue={siteSetting?.autoPublishEndHour || 21} className="w-full p-2.5 border rounded-lg font-medium" />
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg text-xs text-slate-600 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
          <span>Jobs execute asynchronously using Next.js server route tickers without relying on active browser sessions.</span>
        </div>
      </div>
    </div>
  );
}
