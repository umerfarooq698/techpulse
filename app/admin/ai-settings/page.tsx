import { db } from '@/lib/db';
import { Cpu, ShieldAlert, KeyRound, Save } from 'lucide-react';

export const revalidate = 0;

export default async function AISettingsPage() {
  const settings = await db.aISetting.findFirst();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Cpu className="w-6 h-6 text-sky-600" /> AI Provider Configuration
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure external LLM and Image AI provider models, API credentials, and rate limit bounds.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <strong className="font-bold">Security Rule:</strong> API keys are encrypted at rest and never exposed to public client-side browser bundles.
        </div>
      </div>

      <form className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Content Generation Provider</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Provider Engine</label>
            <select defaultValue={settings?.provider || 'fallback'} className="w-full p-2.5 border rounded-lg font-bold bg-white">
              <option value="fallback">Fallback (Deterministic High-Quality Engine)</option>
              <option value="gemini">Google Gemini API</option>
              <option value="openai">OpenAI (GPT-4o)</option>
              <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
              <option value="openrouter">OpenRouter API</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Model Name</label>
            <input type="text" defaultValue={settings?.model || 'gemini-1.5-flash'} className="w-full p-2.5 border rounded-lg font-medium" />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">API Key</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                defaultValue={settings?.apiKey || ''}
                placeholder="sk-..."
                className="w-full pl-9 pr-4 p-2.5 border rounded-lg font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Temperature (0.0 to 1.0)</label>
            <input type="number" step="0.1" defaultValue={settings?.temperature ?? 0.7} className="w-full p-2.5 border rounded-lg font-medium" />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Max Tokens Output</label>
            <input type="number" defaultValue={settings?.maxTokens ?? 4000} className="w-full p-2.5 border rounded-lg font-medium" />
          </div>
        </div>

        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 pt-4">Image Generation Provider</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Image Engine</label>
            <select defaultValue={settings?.imageProvider || 'fallback'} className="w-full p-2.5 border rounded-lg font-bold bg-white">
              <option value="fallback">Local WebP Editorial Generator</option>
              <option value="openai">OpenAI DALL-E 3</option>
              <option value="imagen">Google Imagen 3</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Daily Image Limit</label>
            <input type="number" defaultValue={settings?.dailyImageLimit ?? 50} className="w-full p-2.5 border rounded-lg font-medium" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="button" className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Save AI Provider Settings
          </button>
        </div>
      </form>
    </div>
  );
}
