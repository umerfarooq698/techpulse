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
    const stage3Prompt = `Write a comprehensive, top-tier, highly engaging article for the keyword: "${keyword}".

TARGET PRODUCT & DOMAIN CONTEXT:
- If "${keyword}" refers to consumer audio or hardware (e.g. Airbuds, Earbuds, Headphones, AirPods, Smartphones, Laptops, GPUs, Gadgets), write an authoritative, in-depth review & buyer setup guide covering sound quality, Active Noise Cancellation (ANC), technical specifications, real-world battery benchmarks, pairing/configuration steps, troubleshooting, and FAQs.
- If "${keyword}" refers to software, coding, cloud, or cybersecurity, write a comprehensive step-by-step technical guide with code snippets, architecture breakdown, setup commands, performance metrics, and FAQs.

REQUIRED STRUCTURE (MUST USE CLEAR MARKDOWN HEADINGS & TABLES):
## Overview & Technical Context
Write a compelling intro explaining what ${keyword} is, its key positioning, and target audience.

## Key Features & Complete Specifications
Include a structured Markdown table comparing key specs and performance telemetry:
| Feature / Specification | Details & Benchmark Metrics |
| :--- | :--- |

## Real-World Performance & Testing Metrics
Detail hands-on performance, benchmarks, battery endurance, or execution efficiency.

## Step-by-Step Practical Setup & Configuration Guide
### Step 1: Initial Unboxing & Bluetooth Pairing / Setup
### Step 2: Settings Optimization & Feature Customization

## Troubleshooting Common Issues
### Issue 1: Common Problem & Detailed Resolution

## Frequently Asked Questions (FAQs)
### What are the main features of ${keyword}?
Provide a direct, detailed answer.
### How does ${keyword} compare to previous generations?
Provide a direct, detailed answer.
### How to troubleshoot setup or connectivity issues?
Provide a direct, detailed answer.

CRITICAL CONTENT QUALITY RULES:
1. Every paragraph and section MUST be 100% specifically relevant to "${keyword}".
2. Use Markdown tables, bold highlights, bullet lists, and clear H2 and H3 headings.
3. NEVER use generic AI intro filler phrases like "In today's digital world" or "In this comprehensive guide".`;

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
