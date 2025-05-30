const CACHE_NAME = 'offline-video-player-cache-v5';
const OFFLINE_URL = '/offline-video-player/offline.html';

// Files to cache
const CORE_ASSETS = [
  '/offline-video-player',
  '/offline-video-player/index.html',
  '/offline-video-player/script.js',
  '/offline-video-player/offline.html',
  '/manifests/manifest.json',
  '/assets/css/offline-video-player/styles.css'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  
  // Skip waiting to activate the new service worker immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
      .catch(error => {
        console.error('Failed to cache core assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Try to fetch from network first
        const networkResponse = await fetch(event.request);
        
        // If we got a valid response, cache it and return it
        if (networkResponse && networkResponse.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        console.log('Network request failed, serving from cache:', error);
        
        // If fetch fails, try to get it from the cache
        const cachedResponse = await caches.match(event.request);
        
        // If found in cache, return it
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If it's a navigation request and we're offline, return the offline page
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
        
        // Otherwise, return a generic offline response
        return new Response('You are offline', {
          status: 408,
          statusText: 'Offline',
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })()
  );
});
