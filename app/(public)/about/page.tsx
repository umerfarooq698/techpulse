import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | TechPulse Media',
  description: 'Learn about TechPulse Media, our independent technology editorial standards, hands-on hardware testing lab, and senior technical review team.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4 text-slate-700 text-sm leading-relaxed">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-lg border border-slate-800 space-y-4">
        <div className="inline-block px-3 py-1 bg-sky-500/20 text-sky-300 font-bold text-xs rounded-full uppercase tracking-wider border border-sky-500/30">
          Independent Editorial Publication
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          About TechPulse Media
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Delivering rigorous hardware benchmarks, deep-dive software engineering breakdowns, artificial intelligence analysis, and practical security tutorials.
        </p>
      </div>

      {/* Main Mission */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-6 bg-sky-600 rounded-full"></span> Our Core Editorial Mission
        </h2>
        <p>
          Founded with a commitment to technical objectivity and engineering accuracy, <strong>TechPulse</strong> is an independent digital technology publication. We bridge the gap between complex software architecture and actionable developer guides, empowering software engineers, IT administrators, cybersecurity professionals, and technology enthusiasts worldwide.
        </p>
        <p>
          In an era flooded with automated hype and superficial product summaries, TechPulse provides ground-truth evaluation based on hands-on stress testing, open-source code analysis, real-world synthetic benchmarks, and rigorous editorial oversight.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="font-extrabold text-slate-900 text-base text-sky-600">100% Independent</div>
            <div className="text-xs text-slate-600">Zero sponsored placement bias. Products are evaluated solely on technical merit.</div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="font-extrabold text-slate-900 text-base text-sky-600">Lab Tested</div>
            <div className="text-xs text-slate-600">Standardized telemetry benchmarks for displays, silicon chips, battery drain, and thermal throttling.</div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <div className="font-extrabold text-slate-900 text-base text-sky-600">Expert Reviewed</div>
            <div className="text-xs text-slate-600">Every tutorial and code block is verified by senior technical editors before publication.</div>
          </div>
        </div>
      </div>

      {/* Testing Methodology */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Testing Methodology & Technical Standards
        </h2>
        <p>
          Our evaluation framework follows strict E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) standards established by major web quality guidelines:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li><strong>Software & Code Testing</strong>: Code tutorials are compiled, deployed, and audited across Linux, macOS, and Windows runtime environments to ensure error-free execution.</li>
          <li><strong>Hardware & Mobile Benchmarking</strong>: Devices undergo standardized synthetic loads (Geekbench, Cinebench, 3DMark) alongside real-world thermal monitoring and battery discharge logging.</li>
          <li><strong>Artificial Intelligence & LLMs</strong>: AI models are benchmarked for inference latency, token efficiency, hallucination frequency, and structured output adherence.</li>
          <li><strong>Cybersecurity Audits</strong>: Vulnerability breakdowns and firewall hardening guides cite authoritative CVE databases, NIST guidelines, and official security advisories.</li>
        </ul>
      </div>

      {/* Editorial Leadership */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Editorial Leadership & Review Board
        </h2>
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xl shrink-0">
            AR
          </div>
          <div className="space-y-1.5">
            <div className="font-extrabold text-slate-900 text-base">Alex Rivera</div>
            <div className="text-xs font-semibold text-sky-600">Senior Technical Editor & System Architect</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Specializes in enterprise SaaS architectures, Linux security hardening, mobile silicon performance, and generative AI systems. Alex leads the testing desk and oversees technical accuracy across all publications.
            </p>
          </div>
        </div>
      </div>

      {/* Transparency & Ownership */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Publishing Transparency & Ownership
        </h2>
        <p>
          TechPulse is published by TechPulse Media Group. We operate with clear boundaries between editorial content and any affiliate or advertising relationships. For questions regarding our policies, please review our <Link href="/editorial-policy" className="text-sky-600 font-bold hover:underline">Editorial Policy</Link>, <Link href="/privacy" className="text-sky-600 font-bold hover:underline">Privacy Policy</Link>, or contact our desk directly via our <Link href="/contact" className="text-sky-600 font-bold hover:underline">Contact Page</Link>.
        </p>
      </div>
    </div>
  );
}
