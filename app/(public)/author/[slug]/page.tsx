import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';

export const revalidate = 0;

export default async function AuthorPage({ params }: { params: { slug: string } }) {
  const author = await db.author.findUnique({
    where: { slug: params.slug },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        include: { primaryCategory: true },
      },
    },
  });

  if (!author) notFound();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-5">
        <div className="w-16 h-16 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center text-2xl shrink-0">
          {author.name.charAt(0)}
        </div>
        <div className="space-y-2 text-xs">
          <h1 className="text-2xl font-extrabold text-slate-900">{author.name}</h1>
          <p className="text-slate-600 leading-relaxed">{author.bio}</p>
          <div className="text-sky-600 font-semibold pt-1">Expertise: {author.expertise}</div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Articles Authored by {author.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {author.articles.map((art) => (
            <div key={art.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-[11px] font-bold text-sky-600 uppercase">{art.primaryCategory.name}</span>
              <Link href={`/article/${art.slug}`} className="font-bold text-slate-900 text-sm hover:text-sky-600 line-clamp-2 block">
                {art.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
