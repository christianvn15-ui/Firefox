// Name of the cache
const CACHE_NAME = "dstvprank-cache-v1";

// Files to cache
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-512.png",
  "/icon-192.png",
  "/aapie.png",
  "/dstvload.png"
];

// Install event - caching files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached files if available
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});