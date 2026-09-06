import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-center text-white font-sans">
      <div className="max-w-md space-y-4">
        <div className="text-6xl font-extrabold text-sky-500">404</div>
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="text-xs text-slate-400">
          The requested technology article or publication route could not be located.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg shadow-md transition-all"
        >
          Return to TechPulse Homepage
        </Link>
      </div>
    </div>
  );
}
