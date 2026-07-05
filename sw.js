// Kill-switch service worker.
// The previous site registered a media-caching SW (mwcom-media-*). The reframed site does
// not use a service worker, so this replacement unregisters itself and purges all caches on
// activation. Returning visitors' browsers fetch this updated /sw.js on their next navigation,
// which retires the stale worker cleanly. New visitors never register a worker at all.
self.addEventListener('install', function () { self.skipWaiting(); });

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    try {
      var keys = await caches.keys();
      await Promise.all(keys.map(function (k) { return caches.delete(k); }));
      await self.registration.unregister();
      var clients = await self.clients.matchAll();
      clients.forEach(function (c) { if ('navigate' in c) { c.navigate(c.url); } });
    } catch (e) { /* best-effort teardown */ }
  })());
});
