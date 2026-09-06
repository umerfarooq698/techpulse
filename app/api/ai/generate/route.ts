import { NextRequest, NextResponse } from 'next/server';
import { runContentPipeline } from '@/lib/ai/pipeline';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keyword } = body;

    if (!keyword || typeof keyword !== 'string' || !keyword.trim()) {
      return NextResponse.json({ error: 'Target keyword is required' }, { status: 400 });
    }

    // Create job entry in database
    const job = await db.generationJob.create({
      data: {
        keyword: keyword.trim(),
        categoryId: body.categoryId || null,
        articleType: body.articleType || 'Informational',
        targetCountry: body.targetCountry || 'US',
        language: body.language || 'en',
        tone: body.tone || 'Professional & Authoritative',
        minWords: body.minWords ? parseInt(body.minWords) : 1200,
        maxWords: body.maxWords ? parseInt(body.maxWords) : 2500,
        publishMode: body.publishingMode || 'Draft',
        status: 'PENDING',
        currentStage: 'Queued',
        progressPercent: 5,
      },
    });

    // Execute generation pipeline
    const result = await runContentPipeline({
      keyword: keyword.trim(),
      articleType: body.articleType,
      targetCountry: body.targetCountry,
      language: body.language,
      tone: body.tone,
      minWords: body.minWords ? parseInt(body.minWords) : 1200,
      maxWords: body.maxWords ? parseInt(body.maxWords) : 2500,
      categoryId: body.categoryId,
      searchIntent: body.searchIntent,
      audience: body.audience,
      generateFeaturedImage: body.generateFeaturedImage !== false,
      generateSupportingImages: body.generateSupportingImages !== false,
      autoInternalLinking: body.autoInternalLinking !== false,
      autoSEOMetadata: body.autoSEOMetadata !== false,
      publishingMode: body.publishingMode || 'Draft',
      jobId: job.id,
    });

    return NextResponse.json({ success: true, articleId: result.article.id, slug: result.article.slug, jobId: job.id });
  } catch (e: any) {
    console.error('AI Generation API error:', e);
    return NextResponse.json({ error: e.message || 'Article generation failed' }, { status: 500 });
  }
}
