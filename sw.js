/* EthioExam service worker — offline app shell cache.
   Bump CACHE when EthioExam.html or assets change to force an update. */
const CACHE = 'ethioexam-v1';
const ASSETS = [
  './',
  './index.html',
  './EthioExam.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting()) // don't block install if one asset 404s
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  let url;
  try { url = new URL(req.url); } catch (_) { return; }

  // Never intercept the AI API calls — let them go straight to the network.
  if (url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('groq.com')) return;
  // Only handle GET; leave POST/etc. to the network.
  if (req.method !== 'GET') return;

  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((resp) => {
        // Cache successful same-origin GET responses for future offline use.
        if (resp && resp.ok && url.origin === self.location.origin) {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return resp;
      }).catch(() =>
        // Offline fallback: serve the app shell for navigations.
        caches.match('./EthioExam.html').then((r) => r || caches.match('./index.html'))
      );
    })
  );
});
