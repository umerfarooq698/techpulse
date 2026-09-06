import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Technical & Affiliate Disclaimer | TechPulse Media',
  description: 'Full Technical Disclaimer regarding software tutorials, terminal commands, FTC affiliate disclosures, and external website links.',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4 text-slate-700 text-sm leading-relaxed">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-lg border border-slate-800 space-y-4">
        <div className="inline-block px-3 py-1 bg-sky-500/20 text-sky-300 font-bold text-xs rounded-full uppercase tracking-wider border border-sky-500/30">
          Important Disclosures
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Technical & Affiliate Disclaimer
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Please review our technical execution warranty limits, FTC affiliate disclosures, and external linking policies.
        </p>
      </div>

      {/* 1. Code & Technical Disclaimer */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-6 bg-sky-600 rounded-full"></span> 1. Software & Code Execution Disclaimer
        </h2>
        <p>
          The software tutorials, code snippets, Linux terminal commands, registry tweaks, and cybersecurity hardening steps published on <strong>TechPulse Media</strong> are provided strictly for <strong>educational and informational purposes</strong>.
        </p>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-950">
          <div className="font-extrabold uppercase tracking-wider text-amber-900">Staging Environment Rule</div>
          <p>
            Always test server configurations, terminal scripts, and registry modifications in an isolated staging environment or sandbox before applying changes to live production infrastructure. TechPulse assumes no responsibility for data loss, server downtime, or hardware misconfigurations resulting from reader execution.
          </p>
        </div>
      </div>

      {/* 2. FTC Affiliate Disclosure */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          2. FTC Affiliate Referral Disclosure
        </h2>
        <p>
          In accordance with the Federal Trade Commission (FTC) guidelines for digital publications:
        </p>
        <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <strong>Affiliate Partner Notice</strong>: TechPulse contains affiliate referral links to hardware retailers (such as Amazon Associates) and enterprise software platforms. If you click on these links and complete a purchase, TechPulse may receive a small referral commission at <strong>zero additional cost to you</strong>. This referral revenue supports our newsroom and lab testing operations without influencing product scoring.
        </p>
      </div>

      {/* 3. External Links */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          3. External Links & Third-Party Sites
        </h2>
        <p>
          TechPulse articles frequently contain outbound hyperlinks to external documentation, vendor websites, and developer repositories. We do not control or guarantee the accuracy, security posture, or privacy practices of external third-party domains.
        </p>
      </div>

      {/* 4. Professional Warranty */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          4. No Professional Advice Warranty
        </h2>
        <p>
          Content on TechPulse does not constitute formal legal, financial, or certified security compliance advice. For specialized corporate deployments, consult qualified enterprise solutions architects.
        </p>
      </div>
    </div>
  );
}
