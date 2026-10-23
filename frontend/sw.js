/**
 * AccessibleVerse — Service Worker (Offline Learning & Asset Caching)
 * Ensures lessons, games, 3D universe scripts, and accessibility settings remain operational offline.
 */

const CACHE_NAME = 'accessibleverse-v2';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './lessons.html',
  './science.html',
  './coding.html',
  './cybersecurity.html',
  './life-skills.html',
  './stories.html',
  './teacher.html',
  './portfolio.html',
  './games.html',
  './videos.html',
  './dashboard.html',
  './profile.html',
  './login.html',
  './register.html',
  './css/style.css',
  './css/accessibility.css',
  './css/responsive.css',
  './js/config.js',
  './js/api.js',
  './js/language.js',
  './js/accessibility.js',
  './js/app.js',
  './js/lessons.js',
  './js/videos.js',
  './js/dashboard.js',
  './js/world3d.js',
  './js/pwa.js',
  './js/global-nav.js',
  './js/ai-assistant.js',
  './js/companion.js',
  './js/speech-practice.js',
  './js/science.js',
  './js/coding.js',
  './js/cybersecurity.js',
  './js/life-skills.js',
  './js/stories.js',
  './js/teacher.js',
  './js/portfolio.js',
  './manifest.json',
  './assets/images/icon-192.svg',
  './assets/images/icon-512.svg'
];

// Install: Cache critical static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static resources...');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Some precache items skipped:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate for static assets, Network-First for API calls
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests and browser extensions
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // API Requests: Network-first with local cached JSON fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          // Return structured offline JSON response
          return new Response(
            JSON.stringify({
              status: 'offline',
              isOffline: true,
              notice: 'Operating in offline mode. Local progress will sync upon reconnection.'
            }),
            { headers: { 'Content-Type': 'application/json' }, status: 200 }
          );
        });
      })
    );
    return;
  }

  // Static Assets & Pages: Cache-First, then network update
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Fetch fresh copy in background to update cache
        fetch(request).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkRes));
          }
        }).catch(() => {});
        return cached;
      }

      // Not in cache: fetch from network and cache
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Fallback to index if navigational request fails
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
