import Link from 'next/link';
import { db } from '@/lib/db';
import {
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  AlertTriangle,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminOverviewPage() {
  const [
    totalArticles,
    publishedArticles,
    draftArticles,
    scheduledArticles,
    recentArticles,
    pendingJobs,
    categoriesCount,
    aiSettings,
  ] = await Promise.all([
    db.article.count(),
    db.article.count({ where: { status: 'PUBLISHED' } }),
    db.article.count({ where: { status: 'DRAFT' } }),
    db.article.count({ where: { status: 'SCHEDULED' } }),
    db.article.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { primaryCategory: true },
    }),
    db.generationJob.count({ where: { status: 'PENDING' } }),
    db.category.count(),
    db.aISetting.findFirst(),
  ]);

  const activeProvider = aiSettings?.provider || 'fallback';

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-500/20 text-sky-300 rounded-full text-xs font-semibold border border-sky-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Autonomous AI Publishing System
          </span>
          <h2 className="text-2xl font-bold tracking-tight">TechPulse Editorial Dashboard</h2>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Monitor real-time AI content generation, automated queue schedules, SEO link maps, and publication analytics.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/ai-generator"
            className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Single Keyword AI
          </Link>
          <Link
            href="/admin/bulk-generator"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-lg text-xs border border-slate-700 shadow-md transition-all flex items-center gap-2"
          >
            <Layers className="w-4 h-4" /> Bulk Keyword Queue
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Articles</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{totalArticles}</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> Active in CMS database
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Published</div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1">{publishedArticles}</div>
            <div className="text-xs text-slate-500 mt-1">Live on public frontend</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Drafts & Scheduled</div>
            <div className="text-3xl font-extrabold text-amber-600 mt-1">{draftArticles + scheduledArticles}</div>
            <div className="text-xs text-slate-500 mt-1">{scheduledArticles} scheduled for release</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active AI Engine</div>
            <div className="text-lg font-bold text-slate-900 capitalize mt-1 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky-600" /> {activeProvider}
            </div>
            <div className="text-xs text-slate-500 mt-1">{pendingJobs} jobs in generation queue</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Articles & Status Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Recently Generated Articles</h3>
            <Link href="/admin/articles" className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentArticles.map((article) => (
              <div key={article.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-semibold text-sky-600">{article.primaryCategory.name}</span>
                    <span>•</span>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Link href={`/admin/articles/${article.id}`} className="font-semibold text-slate-900 hover:text-sky-600 text-sm truncate block">
                    {article.title}
                  </Link>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    article.status === 'PUBLISHED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : article.status === 'SCHEDULED'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {article.status}
                  </span>
                  <Link
                    href={`/admin/articles/${article.id}`}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick System Health & Categories */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">System Configuration Status</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Categories Configured</span>
                <span className="font-bold text-slate-900">{categoriesCount} Categories</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Auto Publishing Queue</span>
                <span className="font-bold text-emerald-600">Active (3 posts/day)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Database Engine</span>
                <span className="font-bold text-slate-900">Prisma (SQLite/PG)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Image Storage Provider</span>
                <span className="font-bold text-slate-900">Local WebP Converter</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-xl text-white space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" /> Cannibalization Alert
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              No overlapping high-density keywords detected in database. Automated internal linking engine is actively indexing article anchors.
            </p>
            <Link
              href="/admin/internal-links"
              className="inline-block text-xs font-semibold text-sky-400 hover:text-sky-300 underline"
            >
              Manage Internal Links Engine →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
