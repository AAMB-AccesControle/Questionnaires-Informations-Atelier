const CACHE_NAME = 'animateur-atelier-v1';
const urlsToCache = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // On ajoute les fichiers un par un pour éviter l'échec global
      return Promise.all(
        urlsToCache.map(url => {
          return cache.add(url).catch(error => {
            console.warn('⚠️ Impossible de mettre en cache :', url, error);
          });
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
