// ============================================================================
// CHRIS Service Worker — DON Queue PWA
// Handles push notifications, offline caching, and deep linking.
// ============================================================================

const CACHE_NAME = "chris-don-queue-v1";
const OFFLINE_URLS = ["/don/queue"];

// Install: cache the queue page shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first, fallback to cache
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// Push notification handler
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "CHRIS — Action Required";
  const options = {
    body: data.body || "New item in your DON queue.",
    icon: "/icons/192.png",
    badge: "/icons/192.png",
    tag: data.tag || "chris-don-queue",
    data: { url: "/don/queue" },
    vibrate: [200, 100, 200],
    requireInteraction: data.urgency === "immediate",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click: open or focus the queue
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/don/queue";

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes("/don/queue") && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
