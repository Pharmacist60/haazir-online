// Haazir admin: shows notifications on this device, even when Haazir is closed (Web Push).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { title: 'Haazir', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Haazir', {
    body: d.body || '', icon: '../icon-192.png', badge: '../icon-192.png', tag: 'haazir-' + Date.now(), data: { url: self.registration.scope },
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if (c.url.startsWith(e.notification.data.url) && 'focus' in c) return c.focus();
    return self.clients.openWindow(e.notification.data.url);
  }));
});
