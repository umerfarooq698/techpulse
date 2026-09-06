import { getAIProvider } from './factory';

export interface GeneratedImageData {
  url: string;
  alt: string;
  caption: string;
  filename: string;
}

const TOPIC_PHOTO_COLLECTION: Record<string, string[]> = {
  samsung: [
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80',
  ],
  iphone: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530319067432-f2a729c03db5?w=1200&auto=format&fit=crop&q=80',
  ],
  smartphones: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200&auto=format&fit=crop&q=80',
  ],
  laptops: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&auto=format&fit=crop&q=80',
  ],
  gpu: [
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
  ],
  coding: [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
  ],
  cloud: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
  ],
  ai: [
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=1200&auto=format&fit=crop&q=80',
  ],
  cybersecurity: [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&auto=format&fit=crop&q=80',
  ],
  gadgets: [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507646298591-2822349787a9?w=1200&auto=format&fit=crop&q=80',
  ],
  defaultPool: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
  ],
};

export async function generateArticleImages(
  keyword: string,
  categoryName: string,
  generateSupporting: boolean = true
): Promise<{ featuredImage: GeneratedImageData; supportingImages: GeneratedImageData[] }> {
  const kwLower = keyword.toLowerCase();
  const catKey = categoryName.toLowerCase().replace(/[^a-z]+/g, '');

  let photoBucket = TOPIC_PHOTO_COLLECTION['defaultPool'];

  if (kwLower.includes('samsung') || kwLower.includes('galaxy')) {
    photoBucket = TOPIC_PHOTO_COLLECTION['samsung'];
  } else if (kwLower.includes('iphone') || kwLower.includes('apple') || kwLower.includes('ios')) {
    photoBucket = TOPIC_PHOTO_COLLECTION['iphone'];
  } else if (kwLower.includes('phone') || kwLower.includes('mobile') || kwLower.includes('pixel') || kwLower.includes('ultra') || kwLower.includes('smartphone')) {
    photoBucket = TOPIC_PHOTO_COLLECTION['smartphones'];
  } else if (kwLower.includes('laptop') || kwLower.includes('macbook') || kwLower.includes('notebook') || kwLower.includes('ultrabook')) {
    photoBucket = TOPIC_PHOTO_COLLECTION['laptops'];
  } else if (kwLower.includes('gpu') || kwLower.includes('nvidia') || kwLower.includes('rtx') || kwLower.includes('amd') || kwLower.includes('graphics')) {
    photoBucket = TOPIC_PHOTO_COLLECTION['gpu'];
  } else if (kwLower.includes('code') || kwLower.includes('python') || kwLower.includes('react') || kwLower.includes('developer') || kwLower.includes('script') || kwLower.includes('software')) {
    photoBucket = TOPIC_PHOTO_COLLECTION['coding'];
  } else if (kwLower.includes('cloud') || kwLower.includes('server') || kwLower.includes('linux') || kwLower.includes('docker') || kwLower.includes('devops')) {
    photoBucket = TOPIC_PHOTO_COLLECTION['cloud'];
  } else if (kwLower.includes('ai') || kwLower.includes('gpt') || kwLower.includes('gemini') || kwLower.includes('claude') || kwLower.includes('llm') || kwLower.includes('bot')) {
    photoBucket = TOPIC_PHOTO_COLLECTION['ai'];
  } else if (kwLower.includes('security') || kwLower.includes('cyber') || kwLower.includes('firewall') || kwLower.includes('hack') || kwLower.includes('vpn')) {
    photoBucket = TOPIC_PHOTO_COLLECTION['cybersecurity'];
  } else if (TOPIC_PHOTO_COLLECTION[catKey]) {
    photoBucket = TOPIC_PHOTO_COLLECTION[catKey];
  }

  // Hash keyword to deterministically select unique high-quality photography per keyword
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) {
    hash = keyword.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % photoBucket.length;
  const featuredUrl = photoBucket[index];

  const slugifiedKeyword = keyword
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const featuredImage: GeneratedImageData = {
    url: featuredUrl,
    alt: `Technical review and visual coverage of ${keyword}`,
    caption: `TechPulse editorial coverage of ${keyword}.`,
    filename: `${slugifiedKeyword}-featured.jpg`,
  };

  const supportingImages: GeneratedImageData[] = [];
  if (generateSupporting) {
    for (let i = 1; i <= 2; i++) {
      const suppUrl = photoBucket[(index + i) % photoBucket.length];
      supportingImages.push({
        url: suppUrl,
        alt: `${keyword} technical breakdown visual ${i}`,
        caption: `Visual technical breakdown for ${keyword}.`,
        filename: `${slugifiedKeyword}-visual-${i}.jpg`,
      });
    }
  }

  return { featuredImage, supportingImages };
}


