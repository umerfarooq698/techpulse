import { NextResponse } from 'next/server';
import { processGenerationQueue, processScheduledPublishing } from '@/lib/queue/processor';

export async function POST() {
  try {
    const queueResult = await processGenerationQueue();
    const scheduleResult = await processScheduledPublishing();

    return NextResponse.json({
      success: true,
      queueResult,
      scheduleResult,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Queue execution failed' }, { status: 500 });
  }
}
