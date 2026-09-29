const CACHE_NAME = 'atelier-aamb-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('✅ Service Worker: Cache ouvert');
      return Promise.all(
        urlsToCache.map(url => {
          return cache.add(url).catch(error => {
            console.warn('️ Impossible de mettre en cache :', url, error);
          });
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Ignorer les requêtes vers Google Apps Script et autres APIs externes
  if (event.request.url.includes('script.google.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(error => {
        console.warn('⚠️ Fetch échoué pour :', event.request.url, error);
        // Retourner une réponse vide plutôt que de rejeter la promesse
        return new Response('', { status: 404 });
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('️ Suppression ancien cache :', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
