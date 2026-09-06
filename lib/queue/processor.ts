import { db } from '@/lib/db';
import { runContentPipeline } from '../ai/pipeline';

export async function processGenerationQueue() {
  const pendingJobs = await db.generationJob.findMany({
    where: {
      status: 'PENDING',
    },
    take: 3, // Concurrency limit
    orderBy: { createdAt: 'asc' },
  });

  if (pendingJobs.length === 0) {
    return { processed: 0, message: 'No pending jobs in queue' };
  }

  const results = [];
  for (const job of pendingJobs) {
    try {
      await db.generationJob.update({
        where: { id: job.id },
        data: { status: 'RESEARCHING', currentStage: 'Processing' },
      });

      const res = await runContentPipeline({
        keyword: job.keyword,
        categoryId: job.categoryId || undefined,
        articleType: job.articleType,
        targetCountry: job.targetCountry,
        language: job.language,
        tone: job.tone,
        minWords: job.minWords,
        maxWords: job.maxWords,
        publishingMode: job.publishMode as any,
        jobId: job.id,
      });

      results.push({ jobId: job.id, success: true });
    } catch (e: any) {
      console.error(`Queue job ${job.id} failed:`, e);
      results.push({ jobId: job.id, success: false, error: e.message });
    }
  }

  return { processed: results.length, results };
}

export async function processScheduledPublishing() {
  const now = new Date();
  const scheduledArticles = await db.article.findMany({
    where: {
      status: 'SCHEDULED',
      scheduledDate: {
        lte: now,
      },
    },
  });

  for (const article of scheduledArticles) {
    await db.article.update({
      where: { id: article.id },
      data: {
        status: 'PUBLISHED',
        publishDate: now,
      },
    });

    await db.log.create({
      data: {
        action: 'AUTO_PUBLISH',
        articleId: article.id,
        status: 'SUCCESS',
        message: `Automatically published scheduled article "${article.title}"`,
      },
    });
  }

  return { publishedCount: scheduledArticles.length };
}
