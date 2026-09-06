import fs from 'fs';
import path from 'path';
import { getAIProvider } from './factory';

export interface GeneratedImageData {
  url: string;
  alt: string;
  caption: string;
  filename: string;
}

export async function generateArticleImages(
  keyword: string,
  categoryName: string,
  generateSupporting: boolean = true
): Promise<{ featuredImage: GeneratedImageData; supportingImages: GeneratedImageData[] }> {
  const { provider } = await getAIProvider();

  const slugifiedKeyword = keyword
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // 1. Featured Image Generation
  const featuredPrompt = `Editorial tech cover visual for ${keyword} in ${categoryName} category. Clean minimalist tech aesthetic, 16:9 ratio, no text.`;
  const featuredResult = await provider.generateImage(featuredPrompt, { aspectRatio: '16:9' });

  const featuredFilename = `${slugifiedKeyword}-featured.webp`;
  const localFeaturedPath = path.join(uploadsDir, featuredFilename);

  // Generate SVG/Canvas graphic placeholder for WebP image if remote file is local upload
  if (!fs.existsSync(localFeaturedPath)) {
    const svgGraphic = createTechSVGGraphic(keyword, categoryName, 'Featured');
    fs.writeFileSync(localFeaturedPath, svgGraphic);
  }

  const featuredImage: GeneratedImageData = {
    url: `/uploads/${featuredFilename}`,
    alt: `Comprehensive guide to ${keyword} in ${categoryName}`,
    caption: `TechPulse editorial coverage of ${keyword}.`,
    filename: featuredFilename,
  };

  // 2. Supporting Images Generation
  const supportingImages: GeneratedImageData[] = [];
  if (generateSupporting) {
    for (let i = 1; i <= 2; i++) {
      const suppPrompt = `Technical diagram or visual aspect ${i} of ${keyword}. Vector aesthetic.`;
      const suppFilename = `${slugifiedKeyword}-visual-${i}.webp`;
      const localSuppPath = path.join(uploadsDir, suppFilename);

      if (!fs.existsSync(localSuppPath)) {
        const svgGraphic = createTechSVGGraphic(keyword, categoryName, `Technical Section ${i}`);
        fs.writeFileSync(localSuppPath, svgGraphic);
      }

      supportingImages.push({
        url: `/uploads/${suppFilename}`,
        alt: `${keyword} visual breakdown part ${i}`,
        caption: `Visual architecture diagram for ${keyword}.`,
        filename: suppFilename,
      });
    }
  }

  return { featuredImage, supportingImages };
}

function createTechSVGGraphic(title: string, category: string, subtitle: string): string {
  const safeTitle = title.replace(/[<>&"]/g, '');
  const safeCat = category.replace(/[<>&"]/g, '');
  const safeSub = subtitle.replace(/[<>&"]/g, '');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="50%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0284c7"/>
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#818cf8"/>
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>

    <!-- Glowing Tech Circles -->
    <circle cx="950" cy="150" r="220" fill="rgba(56, 189, 248, 0.1)" filter="blur(40px)" />
    <circle cx="200" cy="500" r="250" fill="rgba(129, 140, 248, 0.08)" filter="blur(50px)" />

    <!-- Editorial Card Backdrop -->
    <rect x="80" y="80" width="1040" height="515" rx="16" fill="rgba(15, 23, 42, 0.65)" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>

    <!-- Category Pill -->
    <rect x="130" y="140" width="160" height="38" rx="19" fill="url(#accent)"/>
    <text x="210" y="164" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" text-anchor="middle" letter-spacing="1.5">${safeCat.toUpperCase()}</text>

    <!-- Main Title -->
    <text x="130" y="240" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="800">${safeTitle.slice(0, 42)}</text>
    ${safeTitle.length > 42 ? `<text x="130" y="295" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="800">${safeTitle.slice(42, 85)}</text>` : ''}

    <!-- Subtitle / Badge -->
    <text x="130" y="380" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="500">${safeSub} • TechPulse Editorial Verification</text>

    <!-- Tech Grid Lines Illustration -->
    <path d="M 130 440 L 1070 440" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
    
    <g transform="translate(130, 470)">
      <rect x="0" y="0" width="260" height="60" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
      <text x="20" y="36" fill="#38bdf8" font-family="monospace" font-size="16">✓ Verified Tech</text>

      <rect x="280" y="0" width="260" height="60" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
      <text x="300" y="36" fill="#818cf8" font-family="monospace" font-size="16">⚙ Optimized Config</text>

      <rect x="560" y="0" width="260" height="60" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
      <text x="580" y="36" fill="#34d399" font-family="monospace" font-size="16">🛡 Security Checked</text>
    </g>

    <!-- Brand Watermark -->
    <text x="1070" y="164" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" text-anchor="end">TECHPULSE MEDIA</text>
  </svg>`;
}
