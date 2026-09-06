import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | TechPulse Media',
  description: 'Terms of Service governing the use of TechPulse Media website, editorial content, benchmarks, intellectual property, and acceptable user conduct.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4 text-slate-700 text-sm leading-relaxed">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-lg border border-slate-800 space-y-4">
        <div className="inline-block px-3 py-1 bg-sky-500/20 text-sky-300 font-bold text-xs rounded-full uppercase tracking-wider border border-sky-500/30">
          Legal Agreement
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Terms and Conditions of Service
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Last updated: September 2026. Please read these terms carefully before accessing TechPulse Media.
        </p>
      </div>

      {/* Terms Content */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-6 bg-sky-600 rounded-full"></span> 1. Agreement & Acceptance
        </h2>
        <p>
          By accessing or using <strong>TechPulse Media</strong> (accessible at <code>https://techpulse-cms.vercel.app</code>), you agree to be bound by these Terms and Conditions and our <Link href="/privacy" className="text-sky-600 font-bold hover:underline">Privacy Policy</Link>. If you do not agree with any part of these terms, you must discontinue website access.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          2. Intellectual Property Rights
        </h2>
        <p>
          All editorial articles, performance benchmark matrices, software code snippets, custom graphics, logos, and layout designs published on TechPulse are the exclusive intellectual property of TechPulse Media Group and protected by international copyright laws.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li><strong>Permissible Use</strong>: You may share excerpt links, social media quotes, or reference technical benchmarks provided proper attribution and direct backlink to TechPulse are included.</li>
          <li><strong>Prohibited Actions</strong>: Automated scraping, full article syndication, unauthorized republishing, or commercial resale of TechPulse content is strictly prohibited.</li>
        </ul>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          3. DMCA & Copyright Takedown Procedure
        </h2>
        <p>
          TechPulse respects the intellectual property rights of third parties. If you believe your copyrighted material has been reproduced on our website without authorization, please submit a formal DMCA notice to <span className="text-sky-600 font-bold">legal@techpulse.io</span> containing:
        </p>
        <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-600">
          <li>A description of the copyrighted work claimed to have been infringed.</li>
          <li>The specific URL where the material is located on our website.</li>
          <li>Your contact information (name, address, telephone number, email).</li>
          <li>A statement of good faith belief regarding the unauthorized use.</li>
        </ol>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          4. Limitation of Liability
        </h2>
        <p>
          TechPulse Media and its editors shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from the use or execution of software tutorials, code snippets, hardware configurations, or terminal commands published on this site. Refer to our <Link href="/disclaimer" className="text-sky-600 font-bold hover:underline">Technical Disclaimer</Link> for full details.
        </p>
      </div>
    </div>
  );
}
