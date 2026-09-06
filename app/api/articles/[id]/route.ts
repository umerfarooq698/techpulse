import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const article = await db.article.findUnique({
      where: { id: params.id },
      include: { primaryCategory: true, author: true },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    const updated = await db.article.update({
      where: { id: params.id },
      data: {
        title: body.title,
        slug: body.slug,
        subtitle: body.subtitle,
        excerpt: body.excerpt,
        content: body.content,
        seoTitle: body.seoTitle,
        metaDescription: body.metaDescription,
        canonicalUrl: body.canonicalUrl,
        status: body.status,
        articleType: body.articleType,
        primaryCategoryId: body.primaryCategoryId,
        featuredImage: body.featuredImage,
        featuredImageAlt: body.featuredImageAlt,
        featuredImageCaption: body.featuredImageCaption,
        primaryKeyword: body.primaryKeyword,
      },
    });

    return NextResponse.json({ success: true, article: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.article.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
