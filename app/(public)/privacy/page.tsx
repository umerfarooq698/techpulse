import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | TechPulse Media',
  description: 'Comprehensive Privacy Policy detailing data collection, Google AdSense cookies, analytics logging, GDPR user rights, and security standards.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4 text-slate-700 text-sm leading-relaxed">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-lg border border-slate-800 space-y-4">
        <div className="inline-block px-3 py-1 bg-sky-500/20 text-sky-300 font-bold text-xs rounded-full uppercase tracking-wider border border-sky-500/30">
          Data Protection & Privacy
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Effective Date: September 2026. How TechPulse Media collects, uses, protects, and discloses personal information when you visit our publication.
        </p>
      </div>

      {/* Overview */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-6 bg-sky-600 rounded-full"></span> 1. Introduction & Scope
        </h2>
        <p>
          TechPulse Media ("we", "our", or "us") operates the website located at <code>https://techpulse-cms.vercel.app</code>. We respect your right to privacy and are committed to protecting personal data in compliance with the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA/CPRA), and Google Publisher Privacy Requirements.
        </p>
      </div>

      {/* Information We Collect */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          2. Information We Collect
        </h2>
        <p>We collect information directly from you when provided voluntarily, as well as automatically via web telemetry:</p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li><strong>Voluntary Submissions</strong>: Name, email address, and message content when submitting inquiries through our <Link href="/contact" className="text-sky-600 font-bold hover:underline">Contact Form</Link>.</li>
          <li><strong>Automated Telemetry Logs</strong>: Standard server logs capturing IP addresses, browser user-agent strings, referring URLs, operating system types, timestamp logs, and page views.</li>
          <li><strong>Cookies & Tracking Identifiers</strong>: Small text files stored on your browser to enhance site navigation, analyze performance trends, and manage advertising preferences.</li>
        </ul>
      </div>

      {/* Google AdSense & Advertising Cookies */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          3. Google AdSense & Third-Party Advertising Cookies
        </h2>
        <p>
          TechPulse may serve advertisements managed by Google AdSense and third-party ad networks. Please review how advertising cookies are utilized:
        </p>
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-950">
          <div className="font-extrabold uppercase tracking-wider text-amber-900">Google AdSense Privacy Notice</div>
          <ul className="list-disc pl-4 space-y-1">
            <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to TechPulse or other websites.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="underline font-bold">Google Ad Settings</a> or <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="underline font-bold">AboutAds.info</a>.</li>
          </ul>
        </div>
      </div>

      {/* Google Analytics */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          4. Web Analytics (Google Analytics)
        </h2>
        <p>
          We utilize Google Analytics to understand website traffic patterns, audience demographics, and popular content. Google Analytics collects anonymized IP data and page navigation events. To opt out of Google Analytics measurement across websites, install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-sky-600 font-bold hover:underline">Google Analytics Opt-out Browser Add-on</a>.
        </p>
      </div>

      {/* GDPR & CCPA Rights */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          5. Your Privacy Rights (GDPR & CCPA)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-extrabold text-slate-900 text-sm text-sky-600">GDPR Rights (EU Users)</div>
            <p>You have the right to request access to your personal data, request rectification or erasure of personal records, object to data processing, and request data portability.</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-extrabold text-slate-900 text-sm text-sky-600">CCPA Rights (California)</div>
            <p>You have the right to know what personal information is collected, request deletion of collected personal data, and opt out of the sale or sharing of personal information.</p>
          </div>
        </div>
      </div>

      {/* Children Privacy & Contact */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          6. Children's Privacy (COPPA Compliance)
        </h2>
        <p>
          TechPulse does not knowingly collect or solicit personal information from children under the age of 13. If you believe a child has provided us with personal data, please contact us immediately for deletion.
        </p>
        <h3 className="text-base font-bold text-slate-900 pt-4">Data Protection Contact</h3>
        <p>
          For privacy inquiries or to exercise your data rights, contact our Data Protection Officer at: <span className="text-sky-600 font-bold">privacy@techpulse.io</span>.
        </p>
      </div>
    </div>
  );
}
