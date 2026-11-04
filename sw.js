// Network first so a new deploy shows up right away; the cache only serves when offline.
const CACHE = "nenscheissmussich-v3";
const PRECACHE = [
  "./",
  "index.html",
  "letters.js",
  "manifest.webmanifest",
  "graphics/unicorn/unicorn-float.svg",
  "graphics/lettering/lettering.svg",
  "graphics/lettering/lettering-stacked.svg",
  "graphics/icon/icon.svg",
  "graphics/icon/icon-192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    // revalidate with the server, so the HTTP cache never mixes an old file into a new deploy
    fetch(request, { cache: "no-cache" })
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request)),
  );
});
