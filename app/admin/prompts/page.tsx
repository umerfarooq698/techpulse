import { db } from '@/lib/db';
import { Terminal, Save } from 'lucide-react';

export const revalidate = 0;

export default async function PromptsPage() {
  const prompts = await db.promptTemplate.findMany({
    orderBy: { stage: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Terminal className="w-6 h-6 text-sky-600" /> Prompt Management System
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Customize AI prompt templates for all 8 generation stages directly from the admin dashboard without altering code.
        </p>
      </div>

      <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 space-y-1">
        <strong className="font-bold">Available Dynamic Placeholders:</strong>
        <div className="font-mono text-[11px] text-sky-700 flex flex-wrap gap-2 pt-1">
          <span className="px-1.5 py-0.5 bg-sky-100 rounded">{"{{keyword}}"}</span>
          <span className="px-1.5 py-0.5 bg-sky-100 rounded">{"{{country}}"}</span>
          <span className="px-1.5 py-0.5 bg-sky-100 rounded">{"{{language}}"}</span>
          <span className="px-1.5 py-0.5 bg-sky-100 rounded">{"{{category}}"}</span>
          <span className="px-1.5 py-0.5 bg-sky-100 rounded">{"{{article_type}}"}</span>
          <span className="px-1.5 py-0.5 bg-sky-100 rounded">{"{{word_count}}"}</span>
          <span className="px-1.5 py-0.5 bg-sky-100 rounded">{"{{search_intent}}"}</span>
          <span className="px-1.5 py-0.5 bg-sky-100 rounded">{"{{site_name}}"}</span>
        </div>
      </div>

      <div className="space-y-6">
        {prompts.map((prompt) => (
          <div key={prompt.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{prompt.name}</h3>
                <span className="text-[11px] text-slate-400 font-mono">Stage: {prompt.stage} • Key: {prompt.key}</span>
              </div>
              <button className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded text-xs flex items-center gap-1">
                <Save className="w-3.5 h-3.5" /> Save Template
              </button>
            </div>
            <textarea
              rows={4}
              defaultValue={prompt.template}
              className="w-full p-3 border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:ring-2 focus:ring-sky-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
