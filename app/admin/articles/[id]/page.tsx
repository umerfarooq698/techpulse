'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sparkles, Save, Eye, Loader2, ArrowLeft, Wand2 } from 'lucide-react';

export default function ArticleEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [aiActionLoading, setAiActionLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [article, setArticle] = useState({
    title: '',
    slug: '',
    subtitle: '',
    excerpt: '',
    content: '',
    seoTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    status: 'DRAFT',
    articleType: 'Informational',
    primaryCategoryId: '',
    featuredImage: '',
    featuredImageAlt: '',
    featuredImageCaption: '',
    primaryKeyword: '',
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/articles/${id}`).then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json()),
    ])
      .then(([artData, catData]) => {
        if (artData.article) {
          setArticle(artData.article);
        }
        if (catData.categories) {
          setCategories(catData.categories);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleTextSelection = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const selected = target.value.substring(target.selectionStart, target.selectionEnd);
    if (selected.trim().length > 5) {
      setSelectedText(selected);
    }
  };

  const handleAISectionAction = async (action: string) => {
    if (!selectedText) return;
    setAiActionLoading(true);

    try {
      const res = await fetch('/api/ai/section-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          text: selectedText,
          articleTitle: article.title,
        }),
      });

      const data = await res.json();
      if (data.success && data.text) {
        setArticle((prev) => ({
          ...prev,
          content: prev.content.replace(selectedText, data.text),
        }));
      }
    } catch (err) {
      alert('AI Section action failed');
    } finally {
      setAiActionLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      });

      if (res.ok) {
        setSaveMessage('Article updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (e) {
      alert('Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading article editor...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Editor Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/articles')}
            className="p-2 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 truncate max-w-lg">{article.title || 'Edit Article'}</h2>
            <div className="text-xs text-slate-400">ID: {id}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saveMessage && <span className="text-xs text-emerald-600 font-semibold">{saveMessage}</span>}
          <a
            href={`/article/${article.slug}`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </a>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Article
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Article Title</label>
              <input
                type="text"
                value={article.title}
                onChange={(e) => setArticle({ ...article, title: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 text-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Subtitle / Excerpt</label>
              <textarea
                rows={2}
                value={article.excerpt || ''}
                onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            {/* Section AI Toolbar */}
            <div className="p-3 bg-slate-900 rounded-lg text-white space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" /> Section-Level AI Editor
                </span>
                {selectedText && <span className="text-[10px] text-slate-400 truncate max-w-xs">Selected: "{selectedText.slice(0, 30)}..."</span>}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Rewrite',
                  'Shorten',
                  'Expand',
                  'Make More Technical',
                  'Make Easier to Understand',
                  'Improve Clarity',
                  'Fix Grammar',
                  'Generate Example',
                  'Generate Table',
                ].map((act) => (
                  <button
                    key={act}
                    type="button"
                    disabled={!selectedText || aiActionLoading}
                    onClick={() => handleAISectionAction(act)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-sky-600 disabled:opacity-30 rounded text-[11px] font-semibold transition-colors"
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            {/* Article Content Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Article Body (Markdown)</label>
              <textarea
                rows={22}
                value={article.content}
                onSelect={handleTextSelection}
                onChange={(e) => setArticle({ ...article, content: e.target.value })}
                className="w-full p-4 border border-slate-300 rounded-lg font-mono text-xs leading-relaxed text-slate-800 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings Column */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Publishing Status</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select
                value={article.status}
                onChange={(e) => setArticle({ ...article, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold bg-white text-slate-800"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
              <select
                value={article.primaryCategoryId}
                onChange={(e) => setArticle({ ...article, primaryCategoryId: e.target.value })}
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
              <label className="block text-xs font-semibold text-slate-600 mb-1">URL Slug</label>
              <input
                type="text"
                value={article.slug}
                onChange={(e) => setArticle({ ...article, slug: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Primary Keyword</label>
              <input
                type="text"
                value={article.primaryKeyword || ''}
                onChange={(e) => setArticle({ ...article, primaryKeyword: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">SEO Optimization</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">SEO Title</label>
              <input
                type="text"
                value={article.seoTitle || ''}
                onChange={(e) => setArticle({ ...article, seoTitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Meta Description</label>
              <textarea
                rows={3}
                value={article.metaDescription || ''}
                onChange={(e) => setArticle({ ...article, metaDescription: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Featured Image</h3>
            {article.featuredImage && (
              <img src={article.featuredImage} alt="Featured" className="w-full h-32 object-cover rounded-lg border" />
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Image URL</label>
              <input
                type="text"
                value={article.featuredImage || ''}
                onChange={(e) => setArticle({ ...article, featuredImage: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
