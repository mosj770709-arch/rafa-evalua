// Rafa Evalúa 1.0.0 · c883bd2f
const CACHE = 'rafa-evalua-1.0.0-c883bd2f';
const FILES = ['./', './apple-touch-icon.png', './atkinson-400.woff2', './atkinson-700.woff2', './bricolage-600.woff2', './bricolage-700.woff2', './bricolage-800.woff2', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './index.html', './jspdf.plugin.autotable.min.js', './jspdf.umd.min.js', './manifest.webmanifest', './xlsx.full.min.js'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // Página: primero la red (para recibir actualizaciones), si no hay conexión la copia guardada.
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('./', copy)); return r; })
      .catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return r; })));
});
