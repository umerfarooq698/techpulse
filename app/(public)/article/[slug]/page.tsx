import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { generateStructuredData } from '@/lib/seo/schema-generator';
import { Clock, Calendar, Share2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await db.article.findUnique({
    where: { slug: params.slug },
    include: { primaryCategory: true },
  });

  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.seoTitle || article.title} | TechPulse`,
    description: article.metaDescription || article.excerpt,
    openGraph: {
      title: article.ogTitle || article.title,
      description: article.ogDescription || article.excerpt,
      images: article.ogImage ? [{ url: article.ogImage }] : [],
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await db.article.findUnique({
    where: { slug: params.slug },
    include: { primaryCategory: true, author: true },
  });

  if (!article || article.status !== 'PUBLISHED') {
    notFound();
  }

  // Fetch related content by category
  const relatedArticles = await db.article.findMany({
    where: {
      primaryCategoryId: article.primaryCategoryId,
      id: { not: article.id },
      status: 'PUBLISHED',
    },
    take: 3,
  });

  // Extract H2 headings for Table of Contents
  const h2Matches = Array.from(article.content.matchAll(/##\s+(.+)/g)).map((m) => m[1]);

  const jsonLdSchema = generateStructuredData({
    title: article.title,
    description: article.metaDescription || article.excerpt || '',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/article/${article.slug}`,
    imageUrl: article.featuredImage || undefined,
    authorName: article.author?.name || 'TechPulse Editorial',
    categoryName: article.primaryCategory.name,
  });

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* Inject Structured JSON-LD Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdSchema }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span>/</span>
        <Link href={`/category/${article.primaryCategory.slug}`} className="hover:text-slate-900 text-sky-600">
          {article.primaryCategory.name}
        </Link>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-xs">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="px-3 py-1 bg-sky-100 text-sky-800 font-bold rounded-full uppercase tracking-wider">
            {article.primaryCategory.name}
          </span>
          <span className="text-slate-400 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" /> {article.readTimeMinutes} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            {article.subtitle}
          </p>
        )}

        {/* Author & Meta Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-b border-slate-200 py-3 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-sm">
              {article.author?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div className="font-bold text-slate-900">{article.author?.name || 'TechPulse Editorial'}</div>
              <div className="text-[11px] text-slate-400">Published: {new Date(article.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:text-sky-600 bg-slate-100 rounded-full transition-colors" title="Share Article">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {article.featuredImage && (
        <figure className="space-y-2">
          <div className="h-96 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
            <img src={article.featuredImage} alt={article.featuredImageAlt || article.title} className="w-full h-full object-cover" />
          </div>
          {article.featuredImageCaption && (
            <figcaption className="text-xs text-center text-slate-500 italic">
              {article.featuredImageCaption}
            </figcaption>
          )}
        </figure>
      )}

      {/* Table of Contents */}
      {h2Matches.length > 0 && (
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
          <div className="font-extrabold text-slate-900 uppercase tracking-wider">Table of Contents</div>
          <ul className="space-y-1 text-slate-700 font-medium">
            {h2Matches.map((h2, idx) => (
              <li key={idx}>
                <span className="text-sky-600 font-bold mr-1.5">•</span> {h2}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Rendered Article Content */}
      <div className="prose prose-slate max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-sky-600 prose-code:font-mono prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-img:rounded-xl">
        <div dangerouslySetInnerHTML={{ __html: formatMarkdownToHTML(article.content) }} />
      </div>

      {/* Author Bio Card */}
      {article.author && (
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xl shrink-0">
            {article.author.name.charAt(0)}
          </div>
          <div className="space-y-1 text-xs">
            <h4 className="font-extrabold text-slate-900 text-sm">{article.author.name}</h4>
            <p className="text-slate-600 leading-relaxed">{article.author.bio}</p>
            <div className="pt-2 text-sky-600 font-semibold">{article.author.expertise}</div>
          </div>
        </div>
      )}

      {/* Related Content */}
      {relatedArticles.length > 0 && (
        <section className="pt-8 border-t border-slate-200 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <div key={rel.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <Link href={`/article/${rel.slug}`} className="font-bold text-slate-900 text-sm hover:text-sky-600 line-clamp-2 block">
                  {rel.title}
                </Link>
                <p className="text-xs text-slate-500 line-clamp-2">{rel.excerpt}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

// Full Markdown parser for clean editorial presentation
function formatMarkdownToHTML(markdown: string): string {
  const lines = markdown.split('\n');
  const html: string[] = [];
  let inTable = false;
  let tableHeaderDone = false;
  let inUl = false;
  let inOl = false;
  let inCode = false;

  for (let line of lines) {
    const trimmed = line.trim();

    // Code blocks
    if (trimmed.startsWith('```')) {
      if (inCode) {
        html.push('</code></pre>');
        inCode = false;
      } else {
        html.push('<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto my-4"><code>');
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      html.push(line + '\n');
      continue;
    }

    // Close lists if non-list line
    if (inUl && !trimmed.startsWith('* ') && !trimmed.startsWith('- ')) {
      html.push('</ul>');
      inUl = false;
    }
    if (inOl && !/^\d+\.\s/.test(trimmed)) {
      html.push('</ol>');
      inOl = false;
    }

    // Tables
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.split('|').slice(1, -1).map((c) => c.trim());
      if (!inTable) {
        html.push('<div class="overflow-x-auto my-6"><table class="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden text-sm">');
        html.push('<thead class="bg-slate-100 font-bold text-slate-900"><tr>');
        cells.forEach((c) => html.push('<th class="px-4 py-2.5 text-left border-b border-slate-200">' + formatInline(c) + '</th>'));
        html.push('</tr></thead><tbody class="divide-y divide-slate-100 bg-white">');
        inTable = true;
        tableHeaderDone = false;
        continue;
      } else if (!tableHeaderDone && cells.every((c) => /^:?-+:?$/.test(c))) {
        tableHeaderDone = true;
        continue;
      } else {
        html.push('<tr>');
        cells.forEach((c) => html.push('<td class="px-4 py-2.5 text-slate-700">' + formatInline(c) + '</td>'));
        html.push('</tr>');
        continue;
      }
    } else if (inTable) {
      html.push('</tbody></table></div>');
      inTable = false;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      html.push('<h3 class="text-xl font-extrabold text-slate-900 mt-8 mb-3">' + formatInline(trimmed.slice(4)) + '</h3>');
      continue;
    }
    if (trimmed.startsWith('## ')) {
      html.push('<h2 class="text-2xl font-extrabold text-slate-900 mt-10 mb-4 border-b border-slate-200 pb-2">' + formatInline(trimmed.slice(3)) + '</h2>');
      continue;
    }
    if (trimmed.startsWith('# ')) {
      html.push('<h1 class="text-3xl font-extrabold text-slate-900 mt-6 mb-4">' + formatInline(trimmed.slice(2)) + '</h1>');
      continue;
    }

    // Unordered lists
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      if (!inUl) {
        html.push('<ul class="space-y-1.5 my-4 pl-5 list-disc text-slate-700">');
        inUl = true;
      }
      html.push('<li>' + formatInline(trimmed.slice(2)) + '</li>');
      continue;
    }

    // Ordered lists
    if (/^\d+\.\s/.test(trimmed)) {
      const content = trimmed.replace(/^\d+\.\s/, '');
      if (!inOl) {
        html.push('<ol class="space-y-1.5 my-4 pl-5 list-decimal text-slate-700">');
        inOl = true;
      }
      html.push('<li>' + formatInline(content) + '</li>');
      continue;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***') {
      html.push('<hr class="my-8 border-slate-200" />');
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      html.push('<blockquote class="border-l-4 border-sky-500 bg-sky-50 p-4 rounded-r-xl my-4 text-slate-700 italic">' + formatInline(trimmed.slice(2)) + '</blockquote>');
      continue;
    }

    // Paragraph
    if (trimmed.length > 0) {
      html.push('<p class="my-4 text-slate-700 leading-relaxed font-normal">' + formatInline(trimmed) + '</p>');
    }
  }

  if (inTable) html.push('</tbody></table></div>');
  if (inUl) html.push('</ul>');
  if (inOl) html.push('</ol>');
  if (inCode) html.push('</code></pre>');

  return html.join('\n');
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>');
}
