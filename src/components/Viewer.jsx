import React, { useEffect, useMemo, useState } from 'react';
import { incrementOpen, incrementDownload, getCounts } from '../lib/trackingStore.js';

export default function Viewer({ id }) {
  const [found, setFound] = useState(false);
  const [file, setFile] = useState(null);
  const [counts, setCounts] = useState(getCounts(id));

  const cached = useMemo(() => {
    return window.__trackedPdfCache?.get(id) || null;
  }, [id]);

  useEffect(() => {
    incrementOpen(id);
    setCounts(getCounts(id));
  }, [id]);

  useEffect(() => {
    if (cached) {
      setFound(true);
      setFile({ url: URL.createObjectURL(cached.blob), name: cached.name });
    }
  }, [cached]);

  function handleDownload() {
    incrementDownload(id);
    setCounts(getCounts(id));
    if (file?.url) {
      const a = document.createElement('a');
      a.href = file.url;
      a.download = file.name || 'document.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">TP</div>
            <div>
              <h1 className="text-lg font-semibold">Tracked PDF Viewer</h1>
              <p className="text-xs text-slate-500">ID: <span className="font-mono">{id}</span></p>
            </div>
          </div>
          <a href="/" className="text-sm text-indigo-600 hover:text-indigo-700">Create another</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-slate-600">Open count: <span className="font-semibold text-slate-900">{counts.opens}</span> · Downloads: <span className="font-semibold text-slate-900">{counts.downloads}</span></div>
            <button onClick={handleDownload} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              Download
            </button>
          </div>
          {!found && (
            <div className="mt-6 p-6 rounded-xl bg-slate-50 text-slate-600 text-sm">
              This viewer can count opens/downloads, but the tracked PDF file is only available if it was generated in this browser session. Ask the sender to provide the file, or open the link on the same device used to generate it.
            </div>
          )}
          {found && file?.url && (
            <div className="mt-4 h-[75vh] rounded-lg overflow-hidden border border-slate-200">
              <iframe title="PDF" src={file.url} className="w-full h-full" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
