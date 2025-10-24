const CACHE_NAME = 'podcast-player-v1.0.0';
const DYNAMIC_CACHE = 'podcast-player-dynamic-v1.0.0';

// الملفات التي سيتم تخزينها مؤقتاً
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/App.vue',
  '/src/style.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/manifest.json',
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch((error) => {
        console.error('[Service Worker] Cache installation failed:', error);
      })
  );
  self.skipWaiting(); // تفعيل Service Worker الجديد فوراً
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE)
            .map((name) => {
              console.log('[Service Worker] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
  );
  return self.clients.claim(); // السيطرة على جميع الصفحات المفتوحة
});

// استراتيجية التخزين المؤقت
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تخطي طلبات Chrome Extension
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // تخطي طلبات YouTube API (لتجنب مشاكل CORS)
  if (url.hostname.includes('youtube.com') || url.hostname.includes('ytimg.com')) {
    return;
  }

  // استراتيجية: Cache First مع Fallback إلى Network
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // إذا وُجد في الكاش، أعده وحدّث الكاش في الخلفية
          event.waitUntil(updateCache(request));
          return cachedResponse;
        }

        // إذا لم يُوجد في الكاش، احضره من الشبكة
        return fetch(request)
          .then((networkResponse) => {
            // احفظ نسخة في الكاش الديناميكي
            if (request.method === 'GET' && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed:', error);
            // يمكن إرجاع صفحة offline هنا
            return new Response('أنت غير متصل بالإنترنت', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain; charset=UTF-8',
              }),
            });
          });
      })
  );
});

// تحديث الكاش في الخلفية
function updateCache(request) {
  return caches.open(CACHE_NAME)
    .then((cache) => {
      return fetch(request)
        .then((response) => {
          if (response.status === 200) {
            return cache.put(request, response);
          }
        })
        .catch(() => {
          // فشل التحديث، لا مشكلة
        });
    });
}

// استقبال الرسائل من التطبيق
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // إرسال رد
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// إشعارات Push (للمستقبل)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'إشعار جديد!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'podcast-notification',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification('Podcast Player', options)
  );
});

// عند النقر على الإشعار
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // إذا كان التطبيق مفتوحاً، ركز عليه
        for (const client of clientList) {
          if (client.url.includes(self.registration.scope) && 'focus' in client) {
            return client.focus();
          }
        }
        // إذا لم يكن مفتوحاً، افتح نافذة جديدة
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

console.log('[Service Worker] Loaded successfully!');
