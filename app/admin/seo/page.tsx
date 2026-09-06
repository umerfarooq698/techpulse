import { Search, Globe, FileCode, CheckCircle2 } from 'lucide-react';

export default function SEOPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Search className="w-6 h-6 text-sky-600" /> SEO Management & Schema Markup
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Automated XML sitemap, robots.txt configuration, and JSON-LD structured data engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Globe className="w-5 h-5 text-sky-600" /> Dynamic XML Sitemap
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Automatically includes all active categories, published technology articles, and policy pages with accurate modification timestamps.
          </p>
          <a
            href="/sitemap.xml"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold"
          >
            <span>View /sitemap.xml</span> →
          </a>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <FileCode className="w-5 h-5 text-sky-600" /> Dynamic robots.txt
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Configured to allow search crawler indexing while safeguarding internal admin endpoints (/admin/*).
          </p>
          <a
            href="/robots.txt"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold"
          >
            <span>View /robots.txt</span> →
          </a>
        </div>
      </div>
    </div>
  );
}
