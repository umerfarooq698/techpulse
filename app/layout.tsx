import './globals.css';
import React from 'react';

export const metadata = {
  title: 'TechPulse - Automated Tech Content Publishing & CMS',
  description: 'Independent technology publication, AI software reviews, and developer tutorials.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
