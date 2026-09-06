import { runContentPipeline } from '../lib/ai/pipeline';
import { db } from '../lib/db';

async function main() {
  console.log('Generating full rich technical article for Samsung Galaxy S25 Ultra...');
  
  let category = await db.category.findFirst({ where: { slug: 'smartphones' } });
  if (!category) {
    category = await db.category.findFirst({ where: { enabled: true } });
  }

  const result = await runContentPipeline({
    keyword: 'Samsung Galaxy S25 Ultra',
    articleType: 'Product Review & Comparison',
    searchIntent: 'Commercial & Informational',
    audience: 'Smartphone buyers & power users',
    minWords: 1500,
    maxWords: 2500,
    categoryId: category?.id,
    publishingMode: 'Publish Immediately',
    generateFeaturedImage: true,
    generateSupportingImages: true,
  });

  console.log('Successfully generated article:', result.article.title);
  console.log('Article Slug:', result.article.slug);
  console.log('Featured Image URL:', result.article.featuredImage);
}

main()
  .catch((e) => {
    console.error('Error generating article:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
