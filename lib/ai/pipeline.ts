import { db } from '@/lib/db';
import { getAIProvider } from './factory';
import { generateArticleImages } from './image-generator';
import { suggestInternalLinks } from '../seo/internal-links';

export interface GenerationConfig {
  keyword: string;
  articleType?: string;
  targetCountry?: string;
  language?: string;
  tone?: string;
  minWords?: number;
  maxWords?: number;
  categoryId?: string;
  searchIntent?: string;
  audience?: string;
  generateFeaturedImage?: boolean;
  generateSupportingImages?: boolean;
  autoInternalLinking?: boolean;
  autoSEOMetadata?: boolean;
  publishingMode?: 'Draft' | 'Publish Immediately' | 'Schedule';
  jobId?: string;
}

export async function runContentPipeline(config: GenerationConfig) {
  const { keyword, jobId } = config;
  const updateJob = async (stage: string, progress: number, status = 'RUNNING') => {
    if (!jobId) return;
    try {
      await db.generationJob.update({
        where: { id: jobId },
        data: {
          currentStage: stage,
          progressPercent: progress,
          status: status as any,
        },
      });
    } catch (e) {
      console.warn('Failed to update job status:', e);
    }
  };

  try {
    const { provider } = await getAIProvider();

    // STAGE 1: Keyword Analysis
    await updateJob('Stage 1: Analyzing Keyword & Intent', 10);
    const stage1Prompt = `Analyze the target keyword: "${keyword}".
Determine search intent, primary topic, relevant subtopics, target audience, semantic terms, and FAQ questions.
Return JSON response format.`;
    const stage1Res = await provider.generateText(stage1Prompt);
    let analysisData: any = {};
    try {
      analysisData = JSON.parse(stage1Res.text.match(/\{[\s\S]*\}/)?.[0] || '{}');
    } catch (e) {
      analysisData = { searchIntent: config.searchIntent || 'Informational' };
    }

    // STAGE 2: Outline Generation
    await updateJob('Stage 2: Generating Structured Article Outline', 25);
    const stage2Prompt = `Create a detailed structured article outline for keyword "${keyword}".
Article Type: ${config.articleType || 'Informational'}
Target Audience: ${config.audience || 'Tech enthusiasts'}
Include H2 headings, H3 subsections, tables, code examples, and FAQ section.
Return JSON with sections array.`;
    const stage2Res = await provider.generateText(stage2Prompt);

    // STAGE 3: Article Draft Writer
    await updateJob('Stage 3: Generating Article Content Section by Section', 45);
    const stage3Prompt = `Write a comprehensive, professional technical article for keyword: "${keyword}".
Article Type: ${config.articleType || 'Informational'}
Tone: ${config.tone || 'Professional & Authoritative'}
Target Word Count: ${config.minWords || 1200} to ${config.maxWords || 2500} words.
Format: Clean Markdown with H2, H3, bold text, technical code blocks (if applicable), practical tables, and bullet points.

CRITICAL CONTENT QUALITY RULES:
1. NEVER use cliché AI filler phrases like:
   - "In today's digital world"
   - "In this comprehensive guide"
   - "Whether you're a beginner or expert"
   - "As technology continues to evolve"
2. Write directly with technical authority, practical steps, and short readable paragraphs.
3. Include an FAQ section with H3 headings at the end.`;

    const stage3Res = await provider.generateText(stage3Prompt);
    let rawContent = stage3Res.text;

    // STAGE 4: Content Refinement Pass & Anti-AI Filter
    await updateJob('Stage 4: Content Refinement & Anti-AI Filter Pass', 65);
    rawContent = cleanAntiAIPhrases(rawContent);

    // STAGE 5: SEO Metadata Generation
    await updateJob('Stage 5: Generating SEO Metadata & Schema Tags', 75);
    const stage5Prompt = `Generate SEO Title, Meta Description, URL Slug, and primary/secondary keywords for article about keyword: "${keyword}".
Return JSON format.`;
    const stage5Res = await provider.generateText(stage5Prompt);
    let seoData: any = {};
    try {
      seoData = JSON.parse(stage5Res.text.match(/\{[\s\S]*\}/)?.[0] || '{}');
    } catch (e) {
      seoData = {};
    }

    const title = seoData.seoTitle || `${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: Complete Guide & Setup`;
    const slug = seoData.slug || keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const metaDescription = seoData.metaDescription || `In-depth technical breakdown and setup steps for ${keyword}.`;

    // STAGE 6: Image Generation
    await updateJob('Stage 6: Generating Unique Images', 85);
    let category = await db.category.findFirst({ where: { id: config.categoryId } });
    if (!category) {
      category = await db.category.findFirst({ where: { enabled: true } });
    }
    const categoryName = category?.name || 'Technology';

    const images = await generateArticleImages(keyword, categoryName, config.generateSupportingImages !== false);

    // STAGE 7: Internal Link Engine
    await updateJob('Stage 7: Identifying Internal Links', 92);
    let internalLinksCount = 0;
    if (config.autoInternalLinking !== false) {
      try {
        const links = await suggestInternalLinks(keyword, rawContent);
        internalLinksCount = links.length;
      } catch (e) {
        // Safe fallback
      }
    }

    // STAGE 8: Save Article & Set Status
    await updateJob('Stage 8: Finalizing & Saving Article', 98);
    const publishingMode = config.publishingMode || 'Draft';
    let status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' = 'DRAFT';
    let publishDate: Date | null = null;
    let scheduledDate: Date | null = null;

    if (publishingMode === 'Publish Immediately') {
      status = 'PUBLISHED';
      publishDate = new Date();
    } else if (publishingMode === 'Schedule') {
      status = 'SCHEDULED';
      scheduledDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours later
    }

    // Get default author
    let author = await db.author.findFirst();
    if (!author) {
      author = await db.author.create({
        data: {
          name: 'TechPulse Editorial Team',
          slug: 'techpulse-editorial',
          bio: 'Senior technology reviewers, software engineers, and cybersecurity analysts.',
          expertise: 'Software Engineering, AI, Hardware Benchmarks, Cybersecurity',
        },
      });
    }

    // Save Article
    const article = await db.article.create({
      data: {
        title,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        subtitle: `Actionable insights, configuration tips, and benchmarks for ${keyword}.`,
        excerpt: metaDescription,
        content: rawContent,
        seoTitle: title,
        metaDescription,
        canonicalUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/article/${slug}`,
        ogTitle: title,
        ogDescription: metaDescription,
        ogImage: images.featuredImage.url,
        status,
        articleType: config.articleType || 'Informational',
        primaryCategoryId: category?.id || '',
        authorId: author.id,
        featuredImage: images.featuredImage.url,
        featuredImageAlt: images.featuredImage.alt,
        featuredImageCaption: images.featuredImage.caption,
        publishDate,
        scheduledDate,
        searchIntent: config.searchIntent || analysisData.searchIntent || 'Informational',
        primaryKeyword: keyword,
        readTimeMinutes: Math.max(3, Math.ceil(rawContent.split(/\s+/).length / 200)),
      },
    });

    // Update keyword record in database
    await db.keyword.upsert({
      where: { keyword },
      create: {
        keyword,
        primaryKeyword: keyword,
        categoryId: category?.id,
        country: config.targetCountry || 'US',
        language: config.language || 'en',
        searchIntent: config.searchIntent || 'Informational',
        status: status === 'PUBLISHED' ? 'PUBLISHED' : 'GENERATED',
        articleId: article.id,
        dateGenerated: new Date(),
        datePublished: publishDate,
      },
      update: {
        status: status === 'PUBLISHED' ? 'PUBLISHED' : 'GENERATED',
        articleId: article.id,
        dateGenerated: new Date(),
        datePublished: publishDate,
      },
    });

    // Write generation log
    await db.log.create({
      data: {
        action: 'ARTICLE_GENERATION',
        keyword,
        articleId: article.id,
        provider: provider.name,
        status: 'SUCCESS',
        message: `Successfully generated article "${title}" for keyword "${keyword}".`,
      },
    });

    if (jobId) {
      await db.generationJob.update({
        where: { id: jobId },
        data: {
          status: status === 'PUBLISHED' ? 'PUBLISHED' : status === 'SCHEDULED' ? 'SCHEDULED' : 'READY',
          currentStage: 'Completed',
          progressPercent: 100,
          articleId: article.id,
        },
      });
    }

    return { success: true, article, jobId };
  } catch (error: any) {
    console.error('Error running content pipeline:', error);
    if (jobId) {
      await db.generationJob.update({
        where: { id: jobId },
        data: {
          status: 'FAILED',
          errorMessage: error.message || 'Article generation failed',
        },
      });
    }
    await db.log.create({
      data: {
        action: 'ARTICLE_GENERATION_FAILED',
        keyword,
        status: 'ERROR',
        message: error.message || 'Generation pipeline error',
      },
    });
    throw error;
  }
}

function cleanAntiAIPhrases(text: string): string {
  const forbiddenRegex = [
    /in today's digital world,?\s*/gi,
    /in this comprehensive guide,?\s*/gi,
    /whether you're a beginner or (an )?expert,?\s*/gi,
    /as technology continues to evolve,?\s*/gi,
    /let's delve into/gi,
    /delve deep into/gi,
    /it is important to note that/gi,
    /in conclusion,?\s*/gi,
  ];

  let cleaned = text;
  for (const regex of forbiddenRegex) {
    cleaned = cleaned.replace(regex, '');
  }

  return cleaned;
}
