import React from 'react';

function copy(text) {
  navigator.clipboard?.writeText(text).catch(() => {});
}

export default function GeneratedPdfCard({ docInfo }) {
  if (!docInfo) return null;
  const fullViewerUrl = `${window.location.origin}${docInfo.viewerUrl}`;

  function download() {
    const a = document.createElement('a');
    a.href = docInfo.blobUrl;
    a.download = docInfo.trackedName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Your tracked PDF is ready</h3>
          <p className="text-sm text-slate-500 mt-1">Share the viewer link to count opens and downloads. A hidden ID was embedded into your PDF metadata.</p>
        </div>
        <button onClick={download} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Download tracked PDF
        </button>
      </div>

      <div className="mt-5 grid gap-4">
        <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
          <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">Viewer link</div>
          <div className="mt-2 flex items-center gap-3">
            <input readOnly value={fullViewerUrl} className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
            <button onClick={() => copy(fullViewerUrl)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-100">Copy</button>
            <a href={docInfo.viewerUrl} className="rounded-md bg-slate-900 text-white px-3 py-2 text-sm hover:bg-black" target="_blank" rel="noreferrer">Open</a>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="text-slate-500">Tracker ID</div>
            <div className="font-mono text-slate-900 text-xs break-all mt-1">{docInfo.id}</div>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="text-slate-500">Original</div>
            <div className="text-slate-900 truncate mt-1" title={docInfo.originalName}>{docInfo.originalName}</div>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="text-slate-500">Tracked file</div>
            <div className="text-slate-900 truncate mt-1" title={docInfo.trackedName}>{docInfo.trackedName}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
