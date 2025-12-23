// Name of the cache
const CACHE_NAME = "dstvprank-cache-v2";

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
  // Activate immediately after install
  self.skipWaiting();
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
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - serve cached files if available
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached response if found, else fetch from network
      return response || fetch(event.request).then(networkResponse => {
        // Cache new requests dynamically
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Optional: fallback offline page or image
        if (event.request.destination === "document") {
          return caches.match("/index.html");
        }
      });
    })
  );
});
