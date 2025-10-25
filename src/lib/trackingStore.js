const KEY = 'tracked-pdf-counts';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

export function getCounts(id) {
  const db = load();
  return db[id] || { opens: 0, downloads: 0 };
}

export function incrementOpen(id) {
  const db = load();
  db[id] = db[id] || { opens: 0, downloads: 0 };
  db[id].opens += 1;
  save(db);
}

export function incrementDownload(id) {
  const db = load();
  db[id] = db[id] || { opens: 0, downloads: 0 };
  db[id].downloads += 1;
  save(db);
}
