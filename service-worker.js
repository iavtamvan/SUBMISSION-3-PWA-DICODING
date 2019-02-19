importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
	console.log('Workbox berhasil dimuat');
} else {
	console.log('Workbox gagal dimuat');
}
workbox.skipWaiting();
workbox.clientsClaim();

workbox.precaching.precacheAndRoute([
	{ url: '/', revision: '1' },
	{ url: '/img/ball.png', revision: '1' },
	{ url: '/img/loading.gif', revision: '1' },
	{ url: '/index.html', revision: '1' },
	{ url: '/nav.html', revision: '1' },
	{ url: '/css/materialize.min.css', revision: '1' },
	{ url: '/js/materialize.min.js', revision: '1' },
	{ url: '/js/nav.js', revision: '1' },
	{ url: '/js/api.js', revision: '1' },
	{ url: '/js/idb.js', revision: '1' },
	{ url: '/js/dbCrud.js', revision: '1' },
	{ url: '/service-worker.js', revision: '1' },
	{ url: '/manifest.json', revision: '1' },
]);

const CACHE_NAME = "football-pwa-2-v1";
var urlsToCache = [
  "/",
  "/img/ball.png",
  "/img/loading.gif",
  "/index.html",
  "/nav.html",
  "/css/materialize.min.css",
  "/js/materialize.min.js",
  "/manifest.json",
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
	    icon: 'img/ball.png',
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