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

    // STAGE 2: Outline Generation (Tailored specifically for keyword)
    await updateJob('Stage 2: Generating Structured Article Outline', 25);
    const stage2Prompt = `Generate a unique, highly custom, product/topic-tailored article outline for the keyword: "${keyword}".
Do NOT use generic repetitive heading titles (like "Overview & Technical Context", "Key Features & Complete Specifications").
Instead, create 5 to 7 specific, engaging, topic-focused H2 headings and H3 subheadings tailored exclusively to "${keyword}".

Examples of keyword-tailored headings:
- For "Samsung Galaxy S25": "Galaxy S25 Design Telemetry & Armor Framing", "Snapdragon 8 Elite Benchmark Scores", "Camera Array & ProVisual Engine", "One UI 7 Setup & Battery Tweaks", "Galaxy S25 FAQs"
- For "Docker Tutorial": "Understanding Containers vs Virtual Machines", "Installing Docker Engine & Desktop", "Writing Efficient Dockerfiles", "Container Networking & Volume Mounting", "Docker Troubleshooting & FAQs"

Return JSON format:
{
  "title": "Unique Catchy Title for ${keyword}",
  "sections": [
    { "heading": "Specific H2 Heading Title", "subheadings": ["H3 Subheading 1", "H3 Subheading 2"] }
  ]
}`;
    const stage2Res = await provider.generateText(stage2Prompt);
    let outlineData: any = {};
    try {
      outlineData = JSON.parse(stage2Res.text.match(/\{[\s\S]*\}/)?.[0] || '{}');
    } catch (e) {
      outlineData = {};
    }

    let customOutlineFormatted = '';
    if (outlineData?.sections && Array.isArray(outlineData.sections)) {
      customOutlineFormatted = outlineData.sections.map((sec: any) => {
        let text = `## ${sec.heading}\n`;
        if (sec.subheadings && Array.isArray(sec.subheadings)) {
          text += sec.subheadings.map((sub: string) => `### ${sub}`).join('\n') + '\n';
        }
        return text;
      }).join('\n');
    }

    // STAGE 3: Article Draft Writer using Custom Dynamic Outline
    await updateJob('Stage 3: Generating Article Content Section by Section', 45);
    const stage3Prompt = `Write a comprehensive, top-tier, highly engaging, 1500+ word article specifically for the keyword: "${keyword}".

${customOutlineFormatted ? `STRICTLY FOLLOW THIS UNIQUE CUSTOM OUTLINE GENERATED FOR "${keyword}":\n${customOutlineFormatted}` : `Generate 5 to 7 unique, highly specific H2 headings and H3 subheadings for "${keyword}". DO NOT use generic template headings.`}

CRITICAL RULES FOR DYNAMIC UNIQUE CONTENT & PATTERN:
1. Every section title (H2 and H3) MUST be customized and unique to "${keyword}". NEVER reuse generic identical heading names across different articles.
2. Structure: Include intro narrative, a detailed Markdown comparison table (| Spec / Metric | Value |), step-by-step practical setup instructions, troubleshooting, and a dedicated H2 "Frequently Asked Questions" section with 3 to 4 H3 question headings specifically about "${keyword}".
3. Pattern & Tone: Adapt tone specifically to "${keyword}". If it's a hardware/product keyword, focus on hands-on review, specs, and battery/performance telemetry. If it's software/coding, focus on code blocks, commands, and workflow steps.
4. NEVER use generic AI intro filler phrases like "In today's digital world" or "In this comprehensive guide". Write directly with authority and short, readable paragraphs.`;

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
