import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const categories = await db.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { articles: true } } },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  try {
    const { name, slug, description, order, metaTitle, metaDesc } = await req.json();

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const category = await db.category.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        order: order ? parseInt(order) : 0,
        metaTitle,
        metaDesc,
        enabled: true,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
