export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-700 text-sm">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact Editorial Team</h1>
      <p className="text-slate-500 text-xs">Have questions, feedback, or press releases? Reach out to our technical desk.</p>

      <form className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name</label>
          <input type="text" required className="w-full p-2.5 border rounded-lg text-xs" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Email</label>
          <input type="email" required className="w-full p-2.5 border rounded-lg text-xs" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message / Tip</label>
          <textarea rows={4} required className="w-full p-2.5 border rounded-lg text-xs" />
        </div>
        <button type="submit" className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs shadow-sm">
          Send Message
        </button>
      </form>
    </div>
  );
}
