// Haazir employee app: keeps a copy of the app on the phone so it opens without internet.
// The version below is filled in by build.js.
const CACHE = 'haazir-app-__VERSION__';
const SHELL = ['./', './index.html', './app.js?v=__VERSION__', '../config.js?v=__VERSION__', '../vendor/react.js?v=__VERSION__', './manifest.webmanifest', '../logo.png', '../icon-192.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('haazir-app-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first, so updates always arrive; the saved copy is used only when there is no internet.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Only the app's own files are kept; Haazir's server answers (/api/) must always be live.
  if (e.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.includes('/api/')) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: e.request.mode === 'navigate' }).then(r => r || caches.match('./index.html')))
  );
});
