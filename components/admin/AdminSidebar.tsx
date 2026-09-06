'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Layers,
  KeyRound,
  FolderTree,
  Image as ImageIcon,
  Calendar,
  Clock,
  ListOrdered,
  Users,
  Search,
  Link2,
  Terminal,
  Cpu,
  Settings,
  BarChart3,
  ScrollText,
  LogOut,
} from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Articles', href: '/admin/articles', icon: FileText },
  { name: 'AI Generator', href: '/admin/ai-generator', icon: Sparkles },
  { name: 'Bulk Generator', href: '/admin/bulk-generator', icon: Layers },
  { name: 'Keywords', href: '/admin/keywords', icon: KeyRound },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Images', href: '/admin/images', icon: ImageIcon },
  { name: 'Scheduled Posts', href: '/admin/scheduled', icon: Calendar },
  { name: 'Auto Publishing', href: '/admin/auto-publishing', icon: Clock },
  { name: 'Content Queue', href: '/admin/queue', icon: ListOrdered },
  { name: 'Authors', href: '/admin/authors', icon: Users },
  { name: 'SEO', href: '/admin/seo', icon: Search },
  { name: 'Internal Links', href: '/admin/internal-links', icon: Link2 },
  { name: 'Prompts', href: '/admin/prompts', icon: Terminal },
  { name: 'AI Settings', href: '/admin/ai-settings', icon: Cpu },
  { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Logs', href: '/admin/logs', icon: ScrollText },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg text-white tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
            TP
          </div>
          <span>TechPulse <span className="text-xs text-sky-400 font-medium px-1.5 py-0.5 bg-sky-950/80 rounded border border-sky-800/50">CMS</span></span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sky-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-200">
            A
          </div>
          <div className="truncate max-w-[120px]">
            <div className="font-semibold text-slate-200 truncate">Administrator</div>
            <div className="text-[10px] text-slate-400">admin@techpulse.io</div>
          </div>
        </div>
        <Link
          href="/admin/login"
          className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
}
