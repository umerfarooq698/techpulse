import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Editorial Standards & Ethics Policy | TechPulse',
  description: 'Our commitment to editorial independence, anti-hallucination verification standards, review ethics, and AI content disclosures.',
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4 text-slate-700 text-sm leading-relaxed">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-lg border border-slate-800 space-y-4">
        <div className="inline-block px-3 py-1 bg-sky-500/20 text-sky-300 font-bold text-xs rounded-full uppercase tracking-wider border border-sky-500/30">
          Editorial Guidelines & Standards
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Editorial Policy & Code of Ethics
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          How TechPulse creates, fact-checks, verifies, and maintains authoritative technology journalism and software engineering guides.
        </p>
      </div>

      {/* 1. Independence */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-6 bg-sky-600 rounded-full"></span> 1. Editorial Independence Guarantee
        </h2>
        <p>
          TechPulse maintains total editorial independence. Our technical reviews, software comparisons, benchmarks, and tutorials are written and published free from commercial or advertiser influence.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li><strong>No Paid Positive Reviews</strong>: We do not accept monetary compensation or gifts in exchange for favorable product reviews or boosted benchmark ratings.</li>
          <li><strong>Unbiased Evaluation</strong>: Advertisers and commercial sponsors have no access to draft articles or input into editorial conclusions prior to publication.</li>
          <li><strong>Product Procurement</strong>: Where hardware sample units are provided by manufacturers for evaluation, units are returned or disclosed transparently without contractual review conditions.</li>
        </ul>
      </div>

      {/* 2. AI Content & Verification */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          2. AI Tools Disclosure & Human Verification
        </h2>
        <p>
          In alignment with Google News and Google Publisher Guidelines on AI-assisted content creation, TechPulse maintains full transparency regarding technology tools:
        </p>
        <div className="p-5 bg-sky-50 border border-sky-200 rounded-xl space-y-2 text-xs text-sky-900">
          <div className="font-extrabold uppercase tracking-wider text-sky-950">AI & Human Hybrid Policy</div>
          <p>
            Generative AI tools assist our newsroom with preliminary outline structuring, keyword intent mapping, and initial draft formatting. However, <strong>100% of all published articles undergo rigorous human review, technical verification, and manual code testing by qualified technical editors</strong> before going live.
          </p>
        </div>
        <ul className="list-disc pl-5 space-y-2 text-slate-600 pt-2">
          <li><strong>Anti-Hallucination Audit</strong>: Numerical benchmarks, software version numbers, code syntax, and release dates are verified against authoritative documentation.</li>
          <li><strong>Code Execution Guarantee</strong>: Technical terminal commands and code blocks are tested in real environment runtimes to ensure zero execution errors.</li>
        </ul>
      </div>

      {/* 3. Sourcing & Citations */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          3. Sourcing, Fact-Checking & Citation Standards
        </h2>
        <p>
          Accuracy is the foundation of reader trust. TechPulse adheres to strict research standards:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li><strong>Primary Sources</strong>: We cite official developer documentation, peer-reviewed research, official GitHub repositories, and direct manufacturer spec sheets.</li>
          <li><strong>Plagiarism Prohibition</strong>: All text is original. Unattributed copying or scraping from external sources is strictly prohibited.</li>
          <li><strong>Fact-Checking Workflow</strong>: Technical claims are corroborated across multiple primary sources prior to publication.</li>
        </ul>
      </div>

      {/* 4. Affiliate Disclosure */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          4. Affiliate Links & Advertising Disclosure
        </h2>
        <p>
          To support our independent newsroom, TechPulse participates in select affiliate partner programs (e.g., Amazon Associates, software partner referral programs).
        </p>
        <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <strong>FTC Compliance Notice</strong>: When you click on an affiliate link on TechPulse and purchase a product or service, we may earn a small referral commission at zero additional cost to you. This does not impact our editorial ratings or product choices.
        </p>
      </div>

      {/* 5. Corrections */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          5. Handling Errors & Feedback
        </h2>
        <p>
          If a factual error or outdated code example is discovered, we correct it quickly and transparently. Learn more about our process on our <Link href="/corrections-policy" className="text-sky-600 font-bold hover:underline">Corrections Policy Page</Link> or report an issue via our <Link href="/contact" className="text-sky-600 font-bold hover:underline">Contact Form</Link>.
        </p>
      </div>
    </div>
  );
}
