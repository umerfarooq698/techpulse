'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2, CheckCircle2, ArrowRight, Eye } from 'lucide-react';

export default function AIGeneratorPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  const [form, setForm] = useState({
    keyword: 'best AI tools for students',
    articleType: 'Informational',
    targetCountry: 'US',
    language: 'en',
    tone: 'Professional & Authoritative',
    minWords: 1200,
    maxWords: 2500,
    categoryId: '',
    searchIntent: 'Informational',
    audience: 'Students, researchers, tech users',
    generateFeaturedImage: true,
    generateSupportingImages: true,
    autoInternalLinking: true,
    autoSEOMetadata: true,
    publishingMode: 'Publish Immediately',
  });

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setForm((f) => ({ ...f, categoryId: data.categories[0].id }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.keyword.trim()) return;

    setLoading(true);
    setError('');
    setSuccessData(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Article generation failed');
      }

      setSuccessData(data);
    } catch (err: any) {
      setError(err.message || 'Generation error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-sky-600" /> AI Article Generator
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Execute the 8-stage automated content generation pipeline for target keywords.
        </p>
      </div>

      {successData && (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-emerald-900">Article Successfully Generated & Published Live!</h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                Article is now published live on the homepage and category sections.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/article/${successData.slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> View Public Page
            </a>
            <button
              onClick={() => router.push(`/admin/articles/${successData.articleId}`)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              Edit in CMS <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Target Keyword Main Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Target Keyword <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="keyword"
            value={form.keyword}
            onChange={handleChange}
            placeholder="e.g. best AI tools for students"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-medium"
            required
          />
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Article Type</label>
            <select
              name="articleType"
              value={form.articleType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium bg-white"
            >
              <option value="Informational">Informational</option>
              <option value="How-To">How-To</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Comparison">Comparison</option>
              <option value="Review">Review</option>
              <option value="News">News</option>
              <option value="Listicle">Listicle</option>
              <option value="Troubleshooting">Troubleshooting</option>
              <option value="Explainer">Explainer</option>
              <option value="Buying Guide">Buying Guide</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium bg-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Publishing Mode</label>
            <select
              name="publishingMode"
              value={form.publishingMode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-900 border-emerald-300"
            >
              <option value="Publish Immediately">Publish Immediately</option>
              <option value="Draft">Draft</option>
              <option value="Schedule">Schedule</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Tone</label>
            <input
              type="text"
              name="tone"
              value={form.tone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Min Word Count</label>
            <input
              type="number"
              name="minWords"
              value={form.minWords}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Max Word Count</label>
            <input
              type="number"
              name="maxWords"
              value={form.maxWords}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Target Country</label>
            <input
              type="text"
              name="targetCountry"
              value={form.targetCountry}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Search Intent</label>
            <input
              type="text"
              name="searchIntent"
              value={form.searchIntent}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Target Audience</label>
            <input
              type="text"
              name="audience"
              value={form.audience}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium"
            />
          </div>
        </div>

        {/* Checkbox Options */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              name="generateFeaturedImage"
              checked={form.generateFeaturedImage}
              onChange={handleChange}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span>Generate Featured Image</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              name="generateSupportingImages"
              checked={form.generateSupportingImages}
              onChange={handleChange}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span>Generate Supporting Visuals</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              name="autoInternalLinking"
              checked={form.autoInternalLinking}
              onChange={handleChange}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span>Auto Internal Links</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
            <input
              type="checkbox"
              name="autoSEOMetadata"
              checked={form.autoSEOMetadata}
              onChange={handleChange}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span>Auto SEO & JSON-LD</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Executing 8-Stage Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate & Publish Article</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
