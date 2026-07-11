const CACHE_NAME = "wordmaster-cache-v1";
const FILES_TO_CACHE = [
  "./index.html",
  "./manifest.json",
  "./background_music.mp3",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache each file individually so one missing file (e.g. icon not
      // added yet) doesn't stop the whole install from succeeding.
      return Promise.all(
        FILES_TO_CACHE.map((file) =>
          cache.add(file).catch(() => {})
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
