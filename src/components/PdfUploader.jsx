import React, { useRef, useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';

function classNames(...c) { return c.filter(Boolean).join(' '); }

export default function PdfUploader({ onComplete }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const nameRef = useRef(null);

  async function handleFile(e) {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const trackerId = crypto.randomUUID();

      pdfDoc.setTitle(file.name.replace(/\.pdf$/i, '') + ' — tracked');
      pdfDoc.setSubject('Tracked PDF with ID ' + trackerId);
      pdfDoc.setProducer('Tracked PDF Prototype');
      const author = nameRef.current?.value?.trim();
      if (author) pdfDoc.setAuthor(author);
      pdfDoc.setKeywords(['tracked', 'analytics', 'id:' + trackerId]);

      const pages = pdfDoc.getPages();
      if (pages.length > 0) {
        const firstPage = pages[0];
        const { width } = firstPage.getSize();
        firstPage.drawText(`tracker:${trackerId}`,
          { x: width - 5, y: 2, size: 6, color: rgb(1, 1, 1), opacity: 0.01 }
        );
      }

      const modifiedBytes = await pdfDoc.save();
      const blob = new Blob([modifiedBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      const viewerPath = `/v/${trackerId}`;

      window.__trackedPdfCache = window.__trackedPdfCache || new Map();
      window.__trackedPdfCache.set(trackerId, { blob, name: file.name.replace(/\.pdf$/i, '') + ' (tracked).pdf' });

      const info = {
        id: trackerId,
        originalName: file.name,
        trackedName: file.name.replace(/\.pdf$/i, '') + ' (tracked).pdf',
        size: file.size,
        blobUrl,
        viewerUrl: viewerPath,
        createdAt: Date.now(),
      };

      onComplete?.(info);
    } catch (err) {
      console.error(err);
      setError('Failed to process PDF.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div>
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Author (optional)</label>
          <input ref={nameRef} type="text" placeholder="Your name or org" className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Upload PDF</label>
          <label className={classNames(
            'flex items-center justify-center w-full rounded-xl border-2 border-dashed px-6 py-10 cursor-pointer transition',
            processing ? 'opacity-60' : 'hover:bg-slate-50',
          )}>
            <div className="text-center">
              <div className="text-slate-600 font-medium">Drop PDF here or click to browse</div>
              <div className="text-xs text-slate-500 mt-1">We will generate a tracked copy</div>
            </div>
            <input type="file" accept="application/pdf" className="hidden" onChange={handleFile} disabled={processing} />
          </label>
        </div>
      </div>
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      {processing && (
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
          <svg className="animate-spin h-4 w-4 text-indigo-600" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" fill="none"/></svg>
          Processing PDF...
        </div>
      )}
    </div>
  );
}
