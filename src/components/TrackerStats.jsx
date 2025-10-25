import React, { useEffect, useState } from 'react';
import { getCounts } from '../lib/trackingStore.js';

export default function TrackerStats({ docInfo }) {
  const [counts, setCounts] = useState({ opens: 0, downloads: 0 });

  useEffect(() => {
    if (!docInfo?.id) return;
    setCounts(getCounts(docInfo.id));
    const i = setInterval(() => setCounts(getCounts(docInfo.id)), 800);
    return () => clearInterval(i);
  }, [docInfo?.id]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Live tracking</h3>
      <p className="text-sm text-slate-500 mt-1">Numbers update when the viewer link is opened and the download button is used there.</p>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
          <div className="text-xs uppercase tracking-wide text-slate-500">Opens</div>
          <div className="text-3xl font-semibold mt-1">{counts.opens}</div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
          <div className="text-xs uppercase tracking-wide text-slate-500">Downloads</div>
          <div className="text-3xl font-semibold mt-1">{counts.downloads}</div>
        </div>
      </div>

      {!docInfo && (
        <div className="text-sm text-slate-500 mt-4">Upload a PDF to start tracking.</div>
      )}
    </div>
  );
}
