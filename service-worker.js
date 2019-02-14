const CACHE_NAME = "football-pwa-2-v1";
var urlsToCache = [
  "/",
  "/img/dicoding.png",
  "/img/loading.gif",
  "/index.html",
  "/nav.html",
  "/css/materialize.min.css",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/js/api.js",
  "/js/idb.js"
];

self.addEventListener("install", function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function(cache) {
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener("fetch", function(event) {
  event.respondWith(async function () {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) return cachedResponse;
    const networkResponse = await fetch(event.request);
    event.waitUntil(
      cache.put(event.request, networkResponse.clone())
    );
    return networkResponse;
  }());
});

self.addEventListener("activate", function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.map(function(cacheName) {
					if (cacheName != CACHE_NAME) {
						console.log("ServiceWorker: cache " + cacheName + " dihapus");
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

self.addEventListener('push', function(event) {
	var body;
  	if (event.data) {
	    body = event.data.text();
  	} else {
    	body = 'Push message';
  	}
  	var options = {
	    body: body,
	    icon: 'img/dicoding.png',
	    vibrate: [100, 50, 100],
	    data: {
      		dateOfArrival: Date.now(),
      		primaryKey: 1
    	}
  	};
  	event.waitUntil(
	    self.registration.showNotification('Push Notification', options)
  	);
});