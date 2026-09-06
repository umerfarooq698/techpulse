import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Corrections & Accountability Policy | TechPulse',
  description: 'Our transparent protocol for handling factual corrections, updating technical tutorials, and logging editor revisions.',
};

export default function CorrectionsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4 text-slate-700 text-sm leading-relaxed">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-lg border border-slate-800 space-y-4">
        <div className="inline-block px-3 py-1 bg-sky-500/20 text-sky-300 font-bold text-xs rounded-full uppercase tracking-wider border border-sky-500/30">
          Accountability Standards
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Corrections & Updates Policy
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          TechPulse is committed to accuracy. When errors occur, we correct them swiftly, transparently, and noticeably.
        </p>
      </div>

      {/* Overview */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-6 bg-sky-600 rounded-full"></span> Our Commitment to Accuracy
        </h2>
        <p>
          Software APIs change, hardware specifications get updated, and technical nuances require precise representation. When a factual error, broken code snippet, or misleading statement is identified in any TechPulse article, we take immediate corrective action.
        </p>
      </div>

      {/* Types of Updates */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Types of Corrections & Editor Notes
        </h2>

        <div className="space-y-4 text-slate-600">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-extrabold text-slate-900 text-sm text-sky-600">1. Substantive Factual Corrections</div>
            <p className="text-xs">
              If an article contains an incorrect technical specification, benchmark score, or product capability statement, the text is revised immediately. A visible <strong>"Correction Note"</strong> is appended to the top or bottom of the article specifying what was changed and when.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-extrabold text-slate-900 text-sm text-sky-600">2. Code & Security Updates</div>
            <p className="text-xs">
              If a code tutorial, terminal command, or configuration rule becomes deprecated due to a software version release, the code is updated and an <strong>"Editor Update Log"</strong> displays the revised software version tag.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-extrabold text-slate-900 text-sm text-sky-600">3. Minor Clarifications & Typos</div>
            <p className="text-xs">
              Spelling mistakes, grammatical fixes, or minor formatting adjustments that do not alter technical meaning are corrected directly without requiring a formal editor log note.
            </p>
          </div>
        </div>
      </div>

      {/* Reporting Errors */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          How to Submit a Correction Request
        </h2>
        <p>
          We welcome reader feedback and technical peer review. If you spot a factual error or broken code snippet:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-slate-600">
          <li>Visit our <Link href="/contact" className="text-sky-600 font-bold hover:underline">Contact Page</Link>.</li>
          <li>Select <strong>"Editorial Correction / Code Bug"</strong> as the subject.</li>
          <li>Include the article URL and a brief description of the technical error or primary source reference.</li>
        </ol>
        <p className="text-xs text-slate-500 pt-2">
          Our technical review team audits all submitted correction requests within <strong>24 business hours</strong>.
        </p>
      </div>
    </div>
  );
}
