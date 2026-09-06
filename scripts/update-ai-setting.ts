import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.aISetting.findFirst();
  const apiKey = process.env.GEMINI_API_KEY || '';
  
  if (existing) {
    const updated = await prisma.aISetting.update({
      where: { id: existing.id },
      data: {
        provider: 'gemini',
        apiKey: apiKey,
        model: 'gemini-3-flash-preview',
        temperature: 0.7,
        maxTokens: 4000,
      },
    });
    console.log('Updated AISetting:', updated);
  } else {
    const created = await prisma.aISetting.create({
      data: {
        provider: 'gemini',
        apiKey: apiKey,
        model: 'gemini-3-flash-preview',
        temperature: 0.7,
        maxTokens: 4000,
      },
    });
    console.log('Created AISetting:', created);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
