/* EthioExam service worker — offline app shell cache.
   Bump CACHE when EthioExam.html or assets change to force a refresh on devices. */
const CACHE = 'ethioexam-v8';
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

  // Never intercept the AI API calls — straight to the network.
  if (url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('groq.com')) return;
  if (req.method !== 'GET') return;

  // HTML navigations → NETWORK-FIRST so app updates land as soon as the device is online,
  // falling back to the cached shell when offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((resp) => {
        if (resp && resp.ok && url.origin === self.location.origin) {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return resp;
      }).catch(() =>
        caches.match(req).then((r) => r || caches.match('./EthioExam.html').then((x) => x || caches.match('./index.html')))
      )
    );
    return;
  }

  // Static assets (icons, manifest) → CACHE-FIRST.
  e.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((resp) => {
      if (resp && resp.ok && url.origin === self.location.origin) {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      }
      return resp;
    }).catch(() => undefined))
  );
});
