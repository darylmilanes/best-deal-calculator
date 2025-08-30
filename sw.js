// Simple offline-first cache
const CACHE = 'bvf-cache-v7'; // bump this when you change files
const ASSETS = [
  '/best-value-finder/',
  '/best-value-finder/index.html',
  '/best-value-finder/styles.css',
  '/best-value-finder/app.js',
  '/best-value-finder/manifest.webmanifest',
  '/best-value-finder/icon-192.png',
  '/best-value-finder/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});
