export interface ArticleSchemaData {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  authorName?: string;
  authorUrl?: string;
  datePublished?: string;
  dateModified?: string;
  categoryName?: string;
  isNews?: boolean;
  articleType?: string;
  faqList?: { question: string; answer: string }[];
}

export function generateStructuredData(data: ArticleSchemaData) {
  const schemas: any[] = [];

  // 1. WebSite & Organization
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'TechPulse';

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
  });

  // 2. Article / TechArticle / NewsArticle
  let schemaType = 'TechArticle';
  if (data.isNews) schemaType = 'NewsArticle';
  if (data.articleType === 'How-To' || data.articleType === 'Tutorial') schemaType = 'HowTo';

  const mainArticleSchema: any = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: data.title,
    description: data.description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
    image: data.imageUrl ? [data.imageUrl] : [],
    datePublished: data.datePublished || new Date().toISOString(),
    dateModified: data.dateModified || data.datePublished || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: data.authorName || 'TechPulse Editorial',
      url: data.authorUrl || `${siteUrl}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    articleSection: data.categoryName || 'Technology',
  };

  schemas.push(mainArticleSchema);

  // 3. FAQPage Schema
  if (data.faqList && data.faqList.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faqList.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  // 4. BreadcrumbList Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: data.categoryName || 'Articles',
        item: `${siteUrl}/category/${(data.categoryName || 'tech').toLowerCase()}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.title,
        item: data.url,
      },
    ],
  });

  return JSON.stringify(schemas);
}
