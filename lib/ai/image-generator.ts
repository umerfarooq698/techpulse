import { getAIProvider } from './factory';

export interface GeneratedImageData {
  url: string;
  alt: string;
  caption: string;
  filename: string;
}

const TECH_PHOTO_COLLECTION: Record<string, string[]> = {
  ai: [
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  ],
  cybersecurity: [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
  ],
  software: [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
  ],
  smartphones: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=1200&auto=format&fit=crop&q=80',
  ],
  laptops: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop&q=80',
  ],
  apps: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=1200&auto=format&fit=crop&q=80',
  ],
  'how-to': [
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80',
  ],
  gadgets: [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
  ],
};

export async function generateArticleImages(
  keyword: string,
  categoryName: string,
  generateSupporting: boolean = true
): Promise<{ featuredImage: GeneratedImageData; supportingImages: GeneratedImageData[] }> {
  const catKey = categoryName.toLowerCase().replace(/[^a-z]+/g, '');
  const photos = TECH_PHOTO_COLLECTION[catKey] || TECH_PHOTO_COLLECTION['default'];

  // Hash keyword to deterministically select high-quality photography
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) {
    hash = keyword.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % photos.length;
  const featuredUrl = photos[index];

  const slugifiedKeyword = keyword
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const featuredImage: GeneratedImageData = {
    url: featuredUrl,
    alt: `Comprehensive guide to ${keyword} in ${categoryName}`,
    caption: `TechPulse editorial coverage of ${keyword}.`,
    filename: `${slugifiedKeyword}-featured.jpg`,
  };

  const supportingImages: GeneratedImageData[] = [];
  if (generateSupporting) {
    for (let i = 1; i <= 2; i++) {
      const suppUrl = photos[(index + i) % photos.length];
      supportingImages.push({
        url: suppUrl,
        alt: `${keyword} visual breakdown part ${i}`,
        caption: `Visual technical breakdown for ${keyword}.`,
        filename: `${slugifiedKeyword}-visual-${i}.jpg`,
      });
    }
  }

  return { featuredImage, supportingImages };
}
