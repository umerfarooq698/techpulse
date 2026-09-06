import { db } from '@/lib/db';

export interface LinkSuggestion {
  sourceArticleId: string;
  sourceTitle: string;
  targetArticleId: string;
  targetTitle: string;
  anchorText: string;
  targetSlug: string;
}

export async function suggestInternalLinks(keyword: string, content: string): Promise<LinkSuggestion[]> {
  const existingArticles = await db.article.findMany({
    where: {
      status: 'PUBLISHED',
    },
    select: {
      id: true,
      title: true,
      slug: true,
      primaryKeyword: true,
    },
    take: 20,
  });

  const suggestions: LinkSuggestion[] = [];

  for (const article of existingArticles) {
    if (!article.primaryKeyword) continue;
    const kw = article.primaryKeyword.toLowerCase();
    if (content.toLowerCase().includes(kw) && article.title) {
      suggestions.push({
        sourceArticleId: 'new',
        sourceTitle: keyword,
        targetArticleId: article.id,
        targetTitle: article.title,
        anchorText: article.primaryKeyword,
        targetSlug: article.slug,
      });
    }
  }

  return suggestions.slice(0, 3);
}

export async function getOrphanArticles() {
  const articles = await db.article.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      targetLinks: { select: { id: true } },
    },
  });

  return articles.filter((art) => art.targetLinks.length === 0);
}
