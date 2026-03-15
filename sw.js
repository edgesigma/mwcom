var CACHE_NAME = 'mwcom-media-v1';

// Media extensions worth caching
var MEDIA_EXT = /\.(mp4|mov|webm|png|jpg|jpeg|svg|webp)$/i;

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  // Clean up old cache versions
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (name) {
          return name.startsWith('mwcom-media-') && name !== CACHE_NAME;
        }).map(function (name) {
          return caches.delete(name);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  var url = new URL(event.request.url);

  // Only cache media files served from same origin or GCS
  if (!MEDIA_EXT.test(url.pathname)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (cached) {
        if (cached) return cached;

        return fetch(event.request).then(function (response) {
          // Only cache successful, same-origin or CORS-enabled responses
          if (response.ok && response.type !== 'opaque') {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(function () {
          // Cross-origin fetch failed — let the browser handle it natively
          return fetch(event.request, { mode: 'no-cors' });
        });
      });
    })
  );
});
