import Link from 'next/link';
import { db } from '@/lib/db';
import { FileText, Plus, Search, Eye, Edit3, Trash2 } from 'lucide-react';

export const revalidate = 0;

export default async function ArticlesListPage({ searchParams }: { searchParams: { q?: string; status?: string } }) {
  const query = searchParams.q || '';
  const statusFilter = searchParams.status || '';

  const where: any = {};
  if (query) {
    where.OR = [
      { title: { contains: query } },
      { content: { contains: query } },
      { primaryKeyword: { contains: query } },
    ];
  }
  if (statusFilter) {
    where.status = statusFilter;
  }

  const articles = await db.article.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { primaryCategory: true, author: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Articles Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage, edit, publish, and schedule your technology publication articles.</p>
        </div>
        <Link
          href="/admin/ai-generator"
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-all inline-flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" /> Generate New Article
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <form className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search titles, keywords..."
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 font-medium"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['', 'PUBLISHED', 'DRAFT', 'SCHEDULED', 'ARCHIVED'].map((st) => (
            <Link
              key={st}
              href={`/admin/articles?status=${st}${query ? `&q=${query}` : ''}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st || 'All Statuses'}
            </Link>
          ))}
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="p-4">Title & Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 max-w-md">
                    <Link href={`/admin/articles/${art.id}`} className="font-bold text-slate-900 hover:text-sky-600 text-sm line-clamp-1">
                      {art.title}
                    </Link>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      KW: <span className="font-medium text-slate-600">{art.primaryKeyword || 'N/A'}</span> • {art.readTimeMinutes} min read
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 border border-slate-200">
                      {art.primaryCategory.name}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{art.author?.name || 'Editorial'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      art.status === 'PUBLISHED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : art.status === 'SCHEDULED'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {art.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{new Date(art.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/article/${art.slug}`}
                      target="_blank"
                      className="p-1.5 text-slate-400 hover:text-slate-600 inline-block"
                      title="View Public Page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/articles/${art.id}`}
                      className="p-1.5 text-sky-600 hover:text-sky-800 inline-block font-semibold"
                      title="Edit Article"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No articles found matching parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
