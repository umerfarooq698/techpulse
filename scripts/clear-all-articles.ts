import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up all articles, keywords, jobs, links, and logs...');
  
  await prisma.internalLink.deleteMany({});
  await prisma.generationJob.deleteMany({});
  await prisma.scheduledPost.deleteMany({});
  await prisma.keyword.deleteMany({});
  await prisma.log.deleteMany({});
  const deletedArticles = await prisma.article.deleteMany({});

  console.log(`Successfully removed ${deletedArticles.count} articles. Database is now completely clean!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
