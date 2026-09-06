'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Play, Pause, RefreshCw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BulkGeneratorPage() {
  const [keywordsText, setKeywordsText] = useState(`best AI tools for students
how to speed up Windows 11
best password managers
Android battery draining fast
iPhone storage full`);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const fetchJobs = () => {
    fetch('/api/ai/bulk')
      .then((r) => r.json())
      .then((data) => {
        if (data.jobs) setJobs(data.jobs);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchJobs();
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => {
        if (d.categories) setCategories(d.categories);
      });

    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywordsText }),
      });

      if (res.ok) {
        fetchJobs();
        alert('Keywords successfully queued for generation!');
      }
    } catch (e) {
      alert('Failed to submit bulk keywords');
    } finally {
      setLoading(false);
    }
  };

  const triggerQueueTick = async () => {
    await fetch('/api/queue/process', { method: 'POST' });
    fetchJobs();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-6 h-6 text-sky-600" /> Bulk Keyword Generator
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Paste multiple target keywords to create automated background content generation jobs.
          </p>
        </div>

        <button
          onClick={triggerQueueTick}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 self-start shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Process Queue Tick
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bulk Input Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Keywords List (One per line)
            </label>
            <textarea
              rows={8}
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder="Paste target keywords..."
              className="w-full p-3 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
            <span>Queue Generation Jobs</span>
          </button>
        </form>

        {/* Live Queue Jobs Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Active Generation Queue</h3>
            <span className="text-xs text-slate-500">{jobs.length} total jobs</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500">
                <tr>
                  <th className="p-3">Keyword</th>
                  <th className="p-3">Current Stage</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">{job.keyword}</td>
                    <td className="p-3 text-slate-600 font-medium">{job.currentStage}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          job.status === 'PUBLISHED' || job.status === 'READY'
                            ? 'bg-emerald-100 text-emerald-800'
                            : job.status === 'FAILED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-sky-600 h-full transition-all duration-300"
                            style={{ width: `${job.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-500">{job.progressPercent}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      No generation jobs in queue. Paste keywords on the left to start.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
