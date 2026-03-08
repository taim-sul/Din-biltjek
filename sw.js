var CACHE = 'din-biltjek-v1';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Only cache same-origin requests
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      caches.match(e.request).then(function(cached) {
        return cached || fetch(e.request).then(function(resp) {
          if (resp && resp.status === 200 && resp.type === 'basic') {
            var clone = resp.clone();
            caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
          }
          return resp;
        });
      })
    );
  }
});
