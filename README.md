# TechPulse CMS - Automated Tech Publishing & AI Content Engine

TechPulse is a complete, production-ready editorial tech content publishing CMS and AI generation platform built with Next.js 14 (App Router), Prisma, Tailwind CSS, and multi-provider AI abstraction.

## Features Overview

### 1. Technology Editorial Frontend
- **Homepage**: Hero featured article, trending tech sidebar, category editorial grids.
- **Category Pages**: `/category/[slug]` with dynamic article filtering.
- **Article Pages**: `/article/[slug]` with breadcrumbs, table of contents, author bio, share buttons, FAQ accordion, JSON-LD Schema markup, and related content.
- **Dynamic SEO & Search**: Live search (`/search`), `/sitemap.xml`, `/robots.txt`, and HTML sitemap (`/sitemap-page`).
- **Policy Pages**: About Us, Contact, Privacy, Terms, Disclaimer, Editorial Policy, Corrections Policy.

### 2. Admin Dashboard (18 Control Modules)
1. **Overview**: Dashboard metrics, system configuration status, recent articles.
2. **Articles**: Rich list, status filters, and interactive article editor with **Section-Level AI Actions** (Rewrite, Shorten, Expand, Make More Technical, Make Easier to Understand, Fix Grammar, Generate Table, etc.).
3. **AI Article Generator**: Keyword-to-article generator executing an 8-stage automated content pipeline.
4. **Bulk Generator**: Multi-line keyword batch generator with live queue progress and status updates.
5. **Keywords Database**: Search intent tracker, cannibalization warnings, generation status.
6. **Categories Manager**: Category CRUD, ordering, enabled state, custom image, SEO title & meta description.
7. **Images Library**: WebP media graphics library with ALT tags and captions.
8. **Scheduled Posts**: Automated server-side release queue.
9. **Auto Publishing**: Rules for daily publishing frequency, intervals, and allowed hours.
10. **Content Queue**: Queue state manager for pending, generating, and failed jobs.
11. **Authors Manager**: Profiles management for technical reviewers and writers.
12. **SEO Settings**: Structured data, robots, XML sitemap rules.
13. **Internal Links Engine**: Contextual anchor suggestions and orphan article detector.
14. **Prompts Management**: Editable prompt templates with dynamic placeholders (`{{keyword}}`, `{{category}}`, etc.).
15. **AI Settings**: Provider abstraction for Google Gemini, OpenAI, Anthropic, OpenRouter, and Fallback engine.
16. **Site Settings**: Publication branding, social links, homepage section reordering, and ad placements.
17. **Analytics**: Article metrics, token usage, and cost estimates.
18. **Logs**: Audit log traces with masked credentials.

---

## 8-Stage AI Generation Pipeline

1. **Stage 1: Keyword & Intent Analysis**: Evaluates search intent, target audience, semantic terms, and FAQs.
2. **Stage 2: Structured Outline Generation**: Creates H2, H3 sections, tables, and code snippets.
3. **Stage 3: Section-by-Section Draft Writing**: Writes technical content with high authority.
4. **Stage 4: Content Refinement & Anti-AI Filter**: Strips cliché AI filler phrases (*"In today's digital world"*, *"In this comprehensive guide"*).
5. **Stage 5: SEO Metadata & Schema**: Generates title, meta description, slug, and JSON-LD structured data.
6. **Stage 6: Unique Visual Graphics**: Generates 16:9 featured imagery and WebP supporting visuals.
7. **Stage 7: Internal Link Engine**: Identifies relevant internal link anchors across existing published content.
8. **Stage 8: Persistence & Publishing**: Saves to database as Draft, Published, or Scheduled.

---

## Quick Start Guide

### 1. Installation
```bash
cd /Users/umerfarooq/.gemini/antigravity/scratch/techpulse-cms
npm install
```

### 2. Database Migration & Seeding
```bash
npx prisma db push
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev
```

Visit the frontend at `http://localhost:3000` and the Admin Panel at `http://localhost:3000/admin`.

**Default Admin Credentials:**
- Email: `admin@techpulse.io`
- Password: `admin123`
