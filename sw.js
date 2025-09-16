// Offline-first service worker with navigation fallback
const CACHE = 'bvf-cache-v1'; // bump when assets change
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

// Fetch handler: prefer cache, then network; for navigation requests, serve index.html (SPA fallback)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Navigation requests -> return cached index.html for SPA-style fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(cached => cached || fetch('./index.html').catch(() => caches.match('./offline.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(resp => {
      if (req.method === 'GET') {
        caches.open(CACHE).then(cache => cache.put(req, resp.clone()));
      }
      return resp;
    }).catch(() => {
      // If request expects HTML, serve the offline fallback
      if (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) {
        return caches.match('./offline.html');
      }
      return cached;
    }))
  );
});
