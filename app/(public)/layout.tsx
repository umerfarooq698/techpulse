import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Search, Sparkles, Shield, Cpu, Smartphone, Code, Laptop, Terminal } from 'lucide-react';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const categories = await db.category.findMany({
    where: { enabled: true },
    orderBy: { order: 'asc' },
  });

  const siteSetting = await db.siteSetting.findFirst();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-400 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-200">TechPulse Publication</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline">Independent Technical Reviews & Engineering Guides</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-white transition-colors">Admin Dashboard</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-md">
              TP
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                TechPulse<span className="text-sky-600">.</span>
              </div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Technology Editorial</div>
            </div>
          </Link>

          {/* Search Form */}
          <form action="/search" className="relative flex-1 max-w-md hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              name="q"
              placeholder="Search software, smartphones, AI tools, cybersecurity..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-xs focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all font-medium"
            />
          </form>
        </div>

        {/* Category Navigation Ribbon */}
        <div className="border-t border-slate-100 bg-white overflow-x-auto">
          <nav className="max-w-7xl mx-auto px-4 flex items-center gap-6 text-xs font-bold text-slate-600 py-3 whitespace-nowrap">
            <Link href="/" className="text-sky-600 hover:text-sky-700">Home</Link>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/category/${cat.slug}`} className="hover:text-slate-900 transition-colors">
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {children}
      </main>

      {/* Editorial Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-lg">
              <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-xs">TP</div>
              <span>TechPulse</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              {siteSetting?.siteDescription || 'Independent technology news, software reviews, and cybersecurity tutorials.'}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 uppercase text-[11px] tracking-wider mb-3">Categories</h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link href={`/category/${c.slug}`} className="hover:text-white transition-colors">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 uppercase text-[11px] tracking-wider mb-3">Editorial Standards</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/editorial-policy" className="hover:text-white transition-colors">Editorial Policy</Link></li>
              <li><Link href="/corrections-policy" className="hover:text-white transition-colors">Corrections Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 uppercase text-[11px] tracking-wider mb-3">Legal & Sitemap</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms and Conditions</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              <li><Link href="/sitemap-page" className="hover:text-white transition-colors">Sitemap</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>{siteSetting?.footerText || '© 2026 TechPulse Media. All rights reserved.'}</div>
          <div className="flex items-center gap-4">
            <span>Powered by TechPulse AI Publishing System</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
