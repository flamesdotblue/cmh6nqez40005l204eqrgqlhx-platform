import React, { useEffect, useMemo, useState } from 'react';
import PdfUploader from './components/PdfUploader.jsx';
import GeneratedPdfCard from './components/GeneratedPdfCard.jsx';
import TrackerStats from './components/TrackerStats.jsx';
import Viewer from './components/Viewer.jsx';

function App() {
  const [mode, setMode] = useState('home');
  const [docInfo, setDocInfo] = useState(null);

  const route = useMemo(() => {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    if (parts[0] === 'v' && parts[1]) return { name: 'viewer', id: parts[1] };
    return { name: 'home' };
  }, []);

  useEffect(() => {
    if (route.name === 'viewer') setMode('viewer');
  }, [route]);

  if (mode === 'viewer') {
    return <Viewer id={route.id} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">TP</div>
            <div>
              <h1 className="text-lg font-semibold">Tracked PDF</h1>
              <p className="text-xs text-slate-500">Prototype: embed ID + share tracked link</p>
            </div>
          </div>
          <a href="/" className="text-sm text-indigo-600 hover:text-indigo-700">Home</a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <section className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-1">Upload a PDF to create a tracked copy</h2>
              <p className="text-sm text-slate-500 mb-6">This demo embeds a hidden tracking ID into the PDF and gives you a shareable viewer link that counts opens and downloads through this app.</p>
              <PdfUploader onComplete={setDocInfo} />
            </div>

            {docInfo && (
              <div className="mt-6">
                <GeneratedPdfCard docInfo={docInfo} />
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <TrackerStats docInfo={docInfo} />
            <div className="mt-6 text-xs text-slate-500">
              <p className="mb-2 font-semibold">Notes</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Open/download counts are tracked when the PDF is accessed via the generated viewer link.</li>
                <li>Embedding a reliable “invisible pixel” that fires on open in all PDF viewers typically requires a backend and is not universally supported across viewers.</li>
                <li>For production, route sharing through a hosted viewer URL and record events server-side.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">Built as an interactive prototype</footer>
    </div>
  );
}

export default App;
