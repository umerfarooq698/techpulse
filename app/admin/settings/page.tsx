import { db } from '@/lib/db';
import { Settings, Layout, Megaphone, Save } from 'lucide-react';

export const revalidate = 0;

export default async function SiteSettingsPage() {
  const siteSetting = await db.siteSetting.findFirst();

  const homepageSections = siteSetting?.homepageSectionsJson
    ? JSON.parse(siteSetting.homepageSectionsJson)
    : [];

  const adPlacements = siteSetting?.adPlacementsJson
    ? JSON.parse(siteSetting.adPlacementsJson)
    : [];

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-sky-600" /> Site Settings & Layout Manager
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure publication branding, social accounts, homepage section ordering, and ad placement positions.
        </p>
      </div>

      {/* General Settings */}
      <form className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">General Publication Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Site Name</label>
            <input type="text" defaultValue={siteSetting?.siteName || 'TechPulse'} className="w-full p-2.5 border rounded-lg font-bold" />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
            <input type="email" defaultValue={siteSetting?.contactEmail || 'editor@techpulse.io'} className="w-full p-2.5 border rounded-lg font-medium" />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Site Description</label>
            <textarea rows={2} defaultValue={siteSetting?.siteDescription || ''} className="w-full p-2.5 border rounded-lg font-medium" />
          </div>
        </div>

        {/* Configurable Homepage Sections */}
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 pt-4 flex items-center gap-2">
          <Layout className="w-4 h-4 text-sky-600" /> Configurable Homepage Sections
        </h3>

        <div className="space-y-3">
          {homepageSections.map((sec: any) => (
            <div key={sec.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-400">#{sec.order}</span>
                <span className="font-bold text-slate-900">{sec.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-600">
                  <input type="checkbox" defaultChecked={sec.enabled} className="rounded text-sky-600" />
                  <span>Enabled</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Configurable Ad Placements */}
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 pt-4 flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-amber-600" /> Advertising Placements
        </h3>

        <div className="space-y-4">
          {adPlacements.map((ad: any) => (
            <div key={ad.position} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-900">Position: {ad.position}</span>
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                  <input type="checkbox" defaultChecked={ad.enabled} className="rounded text-sky-600" />
                  <span>Active</span>
                </label>
              </div>
              <textarea rows={2} defaultValue={ad.codeSnippet} className="w-full p-2 border rounded font-mono text-[11px]" />
            </div>
          ))}
        </div>

        <div className="pt-4 flex justify-end">
          <button type="button" className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5">
            <Save className="w-4 h-4" /> Save Site Settings
          </button>
        </div>
      </form>
    </div>
  );
}
