import { runContentPipeline } from '../lib/ai/pipeline';
import { db } from '../lib/db';

async function test() {
  const keywords = [
    { kw: 'Best Laptops for Coding 2026', cat: 'laptops' },
    { kw: 'NVIDIA RTX 5090 Benchmark', cat: 'gadgets' },
    { kw: 'How to Install Docker on Linux', cat: 'cloud-computing' },
  ];

  for (const item of keywords) {
    console.log(`Generating article for: "${item.kw}"...`);
    let category = await db.category.findFirst({ where: { slug: item.cat } });
    if (!category) {
      category = await db.category.findFirst({ where: { enabled: true } });
    }

    const res = await runContentPipeline({
      keyword: item.kw,
      articleType: 'Guide',
      searchIntent: 'Informational',
      publishingMode: 'Publish Immediately',
      categoryId: category?.id,
      generateFeaturedImage: true,
    });

    console.log(`  -> Title: ${res.article.title}`);
    console.log(`  -> Image: ${res.article.featuredImage}`);
    console.log(`  -> Slug: ${res.article.slug}\n`);
  }
}

test()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
