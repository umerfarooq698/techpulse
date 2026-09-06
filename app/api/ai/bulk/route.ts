import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { processGenerationQueue } from '@/lib/queue/processor';

export async function POST(req: NextRequest) {
  try {
    const { keywordsText, categoryId, articleType, targetCountry, language, tone, publishMode } = await req.json();

    if (!keywordsText || typeof keywordsText !== 'string') {
      return NextResponse.json({ error: 'Keywords list is required' }, { status: 400 });
    }

    const keywords = keywordsText
      .split('\n')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (keywords.length === 0) {
      return NextResponse.json({ error: 'At least one valid keyword is required' }, { status: 400 });
    }

    const createdJobs = [];
    for (const kw of keywords) {
      const job = await db.generationJob.create({
        data: {
          keyword: kw,
          categoryId: categoryId || null,
          articleType: articleType || 'Informational',
          targetCountry: targetCountry || 'US',
          language: language || 'en',
          tone: tone || 'Professional & Authoritative',
          publishMode: publishMode || 'Draft',
          status: 'PENDING',
          currentStage: 'Queued',
          progressPercent: 0,
        },
      });
      createdJobs.push(job);
    }

    // Trigger queue processing asynchronously
    processGenerationQueue().catch((err) => console.error('Bulk queue worker error:', err));

    return NextResponse.json({ success: true, count: createdJobs.length, jobs: createdJobs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Bulk generator failed' }, { status: 500 });
  }
}

export async function GET() {
  const jobs = await db.generationJob.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json({ jobs });
}
