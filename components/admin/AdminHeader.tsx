'use client';

import Link from 'next/link';
import { ExternalLink, Sparkles, PlusCircle } from 'lucide-react';

export function AdminHeader() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-slate-700">Dashboard Control Panel</h1>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/admin/ai-generator"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-xs font-semibold shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New AI Article</span>
        </Link>

        <Link
          href="/admin/bulk-generator"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-xs font-semibold shadow-sm transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Bulk Queue</span>
        </Link>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors border border-slate-200"
        >
          <span>View Site</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </Link>
      </div>
    </header>
  );
}
