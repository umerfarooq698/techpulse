import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding TechPulse CMS database...');

  // 1. Create Default Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@techpulse.io' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@techpulse.io',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created/verified:', adminUser.email);

  // 2. Create Default Author
  const author = await prisma.author.upsert({
    where: { slug: 'alex-rivera' },
    update: {},
    create: {
      name: 'Alex Rivera',
      slug: 'alex-rivera',
      avatar: '/uploads/author-alex.webp',
      bio: 'Senior Technical Editor specializing in AI architectures, cybersecurity frameworks, and enterprise software engineering.',
      expertise: 'Artificial Intelligence, Cybersecurity, Enterprise SaaS',
      twitter: 'https://twitter.com/alexriveratech',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    },
  });

  // 3. Create Technology Categories
  const categoriesData = [
    { name: 'Artificial Intelligence', slug: 'ai', description: 'LLMs, machine learning models, neural networks, and generative AI apps.', order: 1 },
    { name: 'Software', slug: 'software', description: 'Enterprise software, developer tools, and productivity applications.', order: 2 },
    { name: 'Apps', slug: 'apps', description: 'iOS, Android, web, and desktop application benchmarks and reviews.', order: 3 },
    { name: 'Smartphones', slug: 'smartphones', description: 'Mobile hardware analysis, flagship reviews, and OS updates.', order: 4 },
    { name: 'Laptops', slug: 'laptops', description: 'Ultrabooks, workstation benchmarks, processors, and hardware guides.', order: 5 },
    { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Threat intelligence, network security, encryption, and zero-day defense.', order: 6 },
    { name: 'Cloud Computing', slug: 'cloud-computing', description: 'AWS, Azure, Google Cloud, serverless architecture, and DevOps.', order: 7 },
    { name: 'Gadgets', slug: 'gadgets', description: 'Wearables, smart home devices, IoT hardware, and personal tech.', order: 8 },
    { name: 'How-To Guides', slug: 'how-to', description: 'Step-by-step tutorials, system tweaks, and optimization walk-throughs.', order: 9 },
    { name: 'Tech News', slug: 'news', description: 'Breaking tech industry updates, executive moves, and platform releases.', order: 10 },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        order: cat.order,
        enabled: true,
      },
    });
    categoriesMap[cat.slug] = created.id;
  }
  console.log('Categories seeded.');

  // 4. Default AISetting & SiteSetting
  await prisma.aISetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      provider: 'fallback',
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      maxTokens: 4000,
      imageProvider: 'fallback',
    },
  });

  const homepageSections = JSON.stringify([
    { id: 'featured', name: 'Featured Articles', enabled: true, order: 1 },
    { id: 'latest', name: 'Latest Articles', enabled: true, order: 2 },
    { id: 'ai', name: 'Artificial Intelligence', enabled: true, order: 3, categorySlug: 'ai' },
    { id: 'cybersecurity', name: 'Cybersecurity & Defense', enabled: true, order: 4, categorySlug: 'cybersecurity' },
    { id: 'how-to', name: 'How-To Guides & Tutorials', enabled: true, order: 5, categorySlug: 'how-to' },
    { id: 'smartphones', name: 'Smartphones & Mobile', enabled: true, order: 6, categorySlug: 'smartphones' },
  ]);

  const adPlacements = JSON.stringify([
    { position: 'Header', enabled: true, codeSnippet: '<div class="p-4 bg-slate-100 text-center text-xs text-slate-500 rounded border">ADVERTISEMENT BANNER (728x90)</div>' },
    { position: 'Sidebar', enabled: true, codeSnippet: '<div class="p-4 bg-slate-100 text-center text-xs text-slate-500 rounded stroke h-64 flex items-center justify-center">SIDEBAR AD BANNER (300x250)</div>' },
    { position: 'Mid Article', enabled: true, codeSnippet: '<div class="p-4 my-6 bg-slate-50 text-center text-xs text-slate-400 rounded border border-dashed">IN-CONTENT SPONSORED MEDIA</div>' },
  ]);

  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'TechPulse',
      siteDescription: 'Independent editorial technology news, deep-dive software guides, and artificial intelligence analysis.',
      contactEmail: 'editor@techpulse.io',
      homepageSectionsJson: homepageSections,
      adPlacementsJson: adPlacements,
    },
  });

  // 5. Default Prompt Templates
  const prompts = [
    { key: 'keyword_analysis', name: 'Keyword Analysis Prompt', stage: 'Stage 1', template: 'Analyze keyword: {{keyword}}. Determine intent, topic, audience, subtopics, FAQs.' },
    { key: 'outline_generation', name: 'Outline Generator Prompt', stage: 'Stage 2', template: 'Create article outline for {{keyword}}. Include H2, H3, tables, code examples.' },
    { key: 'article_generation', name: 'Article Draft Writer Prompt', stage: 'Stage 3', template: 'Write technical article for {{keyword}}. Target word count: {{word_count}} words. Avoid AI clichés.' },
    { key: 'content_refinement', name: 'Content Refinement Prompt', stage: 'Stage 4', template: 'Refine draft, clean AI filler, verify formatting and technical readability.' },
    { key: 'seo_metadata', name: 'SEO Metadata Prompt', stage: 'Stage 5', template: 'Generate SEO Title, Meta Description, and JSON-LD schema payload for {{keyword}}.' },
    { key: 'image_prompt', name: 'Image Prompt', stage: 'Stage 6', template: 'Generate editorial tech visual prompt for {{keyword}} in {{category}}.' },
  ];

  for (const p of prompts) {
    await prisma.promptTemplate.upsert({
      where: { key: p.key },
      update: {},
      create: {
        key: p.key,
        name: p.name,
        stage: p.stage,
        template: p.template,
        defaultTemplate: p.template,
      },
    });
  }

  // 6. Seed 3 Sample Technology Articles
  const sampleArticles = [
    {
      title: 'Top AI Coding Assistants in 2026: Benchmark & Developer Test',
      slug: 'top-ai-coding-assistants-2026-benchmark',
      subtitle: 'Evaluating latency, code quality, multi-file awareness, and context retention across leading developer tools.',
      excerpt: 'We tested the top AI coding assistants on production codebases to analyze autocomplete accuracy, context window scaling, and real-world developer speed improvements.',
      categorySlug: 'ai',
      primaryKeyword: 'best AI coding tools',
      articleType: 'Comparison',
      content: `## The Evolution of AI-Assisted Software Engineering

AI-powered code generation has transitioned from simple single-line autocompletion to agentic multi-file code editing. Modern development teams leverage autonomous agents capable of navigating monorepos, refactoring legacy dependencies, and writing automated unit test suites.

In this technical benchmark, we test the leading AI coding environments on identical repository tasks to evaluate accuracy, latency, and context retention.

---

## Technical Evaluation Methodology

Our evaluation framework subjects each coding assistant to three standardized workloads:

1. **Context Window Stress Test**: Querying a 100,000-line codebase for obscure interface definitions.
2. **Refactoring Task**: Converting asynchronous Callback chains into modern Async/Await promises across 15 files.
3. **Bug Detection**: Identifying subtle memory leak patterns in asynchronous event loops.

| Assistant Model | Autocomplete Latency | Multi-file Accuracy | Context Window Size |
| :--- | :--- | :--- | :--- |
| Gemini 1.5 Pro | 180ms | 94.2% | 2,000,000 tokens |
| Claude 3.5 Sonnet | 210ms | 96.5% | 200,000 tokens |
| GPT-4o Agent | 195ms | 92.8% | 128,000 tokens |

---

## Key Performance Insights

### 1. Multi-File Refactoring Efficiency
Agents capable of executing git status checks and terminal builds directly outperform passive chat interfaces by 3.4x in completed refactoring velocity.

### 2. Context Window Retention
High token limits allow agents to inspect entire API specs without manual document slicing, dramatically reducing hallucinatory imports.

\`\`\`typescript
// Benchmark Helper: Asynchronous Agent Latency Calculator
export async function measureAgentResponse<T>(fn: () => Promise<T>): Promise<{ result: T; durationMs: number }> {
  const start = performance.now();
  const result = await fn();
  const durationMs = Math.round(performance.now() - start);
  return { result, durationMs };
}
\`\`\`

---

## Verdict & Recommendation

For monorepo architectures requiring vast context awareness, **Gemini 1.5 Pro** offers unmatched token capacity. For complex logical refactor tasks, **Claude 3.5 Sonnet** maintains highest precision.

---

## Frequently Asked Questions

### Do AI coding assistants leak proprietary IP?
Enterprise plans enforce zero data retention policies and exclude codebase data from model retraining pipelines.

### How do I configure local IDE fallbacks?
Use localized model servers via llama.cpp or Ollama with open-weights models like Qwen 2.5 Coder.`,
    },
    {
      title: 'How to Harden Linux Server Security in 15 Minutes',
      slug: 'how-to-harden-linux-server-security',
      subtitle: 'Essential SSH keys configuration, UFW firewall rules, Fail2ban installation, and automatic security patches.',
      excerpt: 'A practical, step-by-step guide to securing fresh Linux server instances against unauthorized SSH brute-force attacks and open port vulnerabilities.',
      categorySlug: 'cybersecurity',
      primaryKeyword: 'Linux server security hardening',
      articleType: 'How-To',
      content: `## Securing Fresh Server Instances

Deploying a Linux server to cloud infrastructure exposes port 22 to automated port scanners within minutes. Implementing core security hardening steps immediately after provisioning minimizes threat exposure.

Follow this step-by-step guide to configure SSH keys, enforce firewall boundaries, and automate security updates.

---

## Step 1: Disable Password Authentication & Enforce SSH Keys

Root password login is the primary vector for brute-force compromise. Generate an SSH keypair on your local computer and import it to the server.

\`\`\`bash
# Generate Ed25519 keypair on local computer
ssh-keygen -t ed25519 -C "admin@techpulse.io"

# Copy public key to remote server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@your_server_ip
\`\`\`

Next, edit the SSH daemon configuration on the server:

\`\`\`bash
sudo nano /etc/ssh/sshd_config
\`\`\`

Modify the following directives:

\`\`\`text
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
X11Forwarding no
MaxAuthTries 3
\`\`\`

Restart the SSH service:

\`\`\`bash
sudo systemctl restart sshd
\`\`\`

---

## Step 2: Configure UFW (Uncomplicated Firewall)

Block all incoming ports by default, allowing only necessary traffic on SSH (22), HTTP (80), and HTTPS (443).

\`\`\`bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
\`\`\`

---

## Step 3: Install and Configure Fail2Ban

Fail2ban monitors system logs for repeated authentication failures and dynamically adds iptables rules to block offending IP addresses.

\`\`\`bash
sudo apt update && sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
\`\`\`

---

## Summary Checklist

| Security Control | Tool / Config | Verified Status |
| :--- | :--- | :--- |
| Root SSH Login | /etc/ssh/sshd_config | Disabled |
| Password Auth | SSH Ed25519 Keys | Enforced |
| Port Access | UFW Firewall | Ports 22/80/443 Only |
| Brute Force Defense | Fail2Ban Daemon | Active |`,
    },
    {
      title: 'Windows 11 24H2 Performance Optimization Guide',
      slug: 'windows-11-24h2-performance-optimization-guide',
      subtitle: 'Clear bloatware, disable telemetry, optimize RAM usage, and boost frame rates for gaming and productivity.',
      excerpt: 'Tweak Windows 11 settings, manage background services, configure game mode, and optimize storage sense for peak system responsiveness.',
      categorySlug: 'how-to',
      primaryKeyword: 'speed up Windows 11',
      articleType: 'Troubleshooting',
      content: `## Maximizing Windows 11 Workstation Velocity

Windows 11 includes numerous visual effects, telemetry services, and startup applications that consume system memory and background CPU cycles. By tuning system options and disabling unneeded services, you can regain significant memory and lower background latency.

---

## 1. Disable Unnecessary Startup Applications

Startup programs silently load into RAM when Windows boots, slowing down boot speed and background responsiveness.

1. Open **Task Manager** using \`Ctrl + Shift + Esc\`.
2. Click on the **Startup Apps** tab on the sidebar.
3. Right-click non-essential applications (e.g., chat launchers, updater agents) and select **Disable**.

---

## 2. Enable Game Mode & Hardware-Accelerated GPU Scheduling

Windows 11 includes a dedicated Game Mode that prioritizes CPU resources for active foreground applications.

* Navigate to **Settings > System > Display > Graphics**.
* Turn on **Hardware-accelerated GPU scheduling (HAGS)**.
* Enable **Game Mode** in **Settings > Gaming > Game Mode**.

---

## 3. Storage Sense & Temp File Cleanup

Automate background cache cleanup to prevent disk clutter on high-speed NVMe drives:

\`\`\`powershell
# Run PowerShell as Administrator to clean temp caches
cleanmgr /sagerun:1
\`\`\`

---

## Recommended System Settings Summary

* **Visual Effects**: Set to *Adjust for best performance* or keep custom smooth edges.
* **Telemetry Level**: Set to *Required diagnostic data only*.
* **Power Plan**: Switch to *High Performance* or *Ultimate Performance*.`,
    },
  ];

  for (const art of sampleArticles) {
    const catId = categoriesMap[art.categorySlug];
    if (catId) {
      await prisma.article.upsert({
        where: { slug: art.slug },
        update: {},
        create: {
          title: art.title,
          slug: art.slug,
          subtitle: art.subtitle,
          excerpt: art.excerpt,
          content: art.content,
          seoTitle: art.title,
          metaDescription: art.excerpt,
          status: 'PUBLISHED',
          articleType: art.articleType,
          primaryCategoryId: catId,
          authorId: author.id,
          featuredImage: `/uploads/${art.slug}-featured.webp`,
          featuredImageAlt: art.title,
          featuredImageCaption: `TechPulse review of ${art.title}`,
          publishDate: new Date(),
          primaryKeyword: art.primaryKeyword,
          readTimeMinutes: 5,
        },
      });
    }
  }

  console.log('Sample technology articles seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
