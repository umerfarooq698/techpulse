import Link from 'next/link';
import { db } from '@/lib/db';
import { Sparkles, Clock, ArrowRight, TrendingUp, Shield, Cpu, Flame } from 'lucide-react';

export const revalidate = 0;

export default async function PublicHomepage() {
  const articles = await db.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    include: { primaryCategory: true, author: true },
    take: 12,
  });

  const featured = articles[0];
  const secondaryFeatured = articles.slice(1, 4);
  const latestStories = articles.slice(4);

  const categories = await db.category.findMany({
    where: { enabled: true },
    take: 6,
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        take: 3,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return (
    <div className="space-y-12">
      {/* Hero Featured Section */}
      {featured && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group">
            <Link href={`/article/${featured.slug}`} className="relative h-80 sm:h-96 w-full bg-slate-900 overflow-hidden block">
              <img
                src={featured.featuredImage || '/uploads/placeholder.webp'}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-sky-600 text-white font-bold text-xs rounded-full uppercase tracking-wider shadow-md">
                  {featured.primaryCategory.name}
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span>By {featured.author?.name || 'Editorial Team'}</span>
                  <span>•</span>
                  <span>{new Date(featured.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{featured.readTimeMinutes} min read</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white group-hover:text-sky-300 transition-colors">
                  {featured.title}
                </h1>
              </div>
            </Link>
            <div className="p-6 text-slate-600 text-sm leading-relaxed flex-1 flex flex-col justify-between">
              <p>{featured.excerpt}</p>
              <div className="pt-4 flex items-center justify-between border-t border-slate-100 text-xs mt-4">
                <span className="font-bold text-slate-900">Featured Technical Breakdown</span>
                <Link href={`/article/${featured.slug}`} className="text-sky-600 font-bold hover:text-sky-700 flex items-center gap-1">
                  Read Full Article <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Secondary Hero Sidebar */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base pb-2 border-b border-slate-200">
              <Flame className="w-5 h-5 text-amber-500" /> Trending Technology Stories
            </div>

            <div className="space-y-4 flex-1">
              {secondaryFeatured.map((art) => (
                <div key={art.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:border-sky-300 transition-all">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-bold text-sky-600">{art.primaryCategory.name}</span>
                    <span>•</span>
                    <span>{art.readTimeMinutes} min read</span>
                  </div>
                  <Link href={`/article/${art.slug}`} className="font-bold text-slate-900 text-sm hover:text-sky-600 line-clamp-2 block">
                    {art.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Editorial Grids */}
      <section className="space-y-10 pt-4">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2 h-6 bg-sky-600 rounded-full" />
                {cat.name}
              </h2>
              <Link href={`/category/${cat.slug}`} className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
                Explore Category <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cat.articles.map((art) => (
                <div key={art.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group">
                  <Link href={`/article/${art.slug}`} className="h-44 bg-slate-900 relative block overflow-hidden">
                    <img src={art.featuredImage || '/uploads/placeholder.webp'} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium mb-1">{new Date(art.createdAt).toLocaleDateString()}</div>
                      <Link href={`/article/${art.slug}`} className="font-bold text-slate-900 text-sm hover:text-sky-600 line-clamp-2 block">
                        {art.title}
                      </Link>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{art.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
