// Service Worker: speichert App-Dateien und Rezeptfotos, damit die App offline startet.
const VERSION = 'wochenplan-v4';
const IMG_CACHE = 'wochenplan-bilder';
const MAX_IMAGES = 400;   // ältere Fotos fliegen raus, damit der Speicher nicht vollläuft
const FILES = [
  './', './index.html', './style.css', './manifest.webmanifest', './icon.svg',
  './js/icons.js', './js/storage.js', './js/classify.js', './js/recipes-builtin.js', './js/mealdb.js', './js/translate.js',
  './js/recipes.js', './js/images.js', './js/planner.js', './js/shopping.js', './js/app.js',
];
const IMAGE_HOSTS = ['upload.wikimedia.org', 'www.themealdb.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== IMG_CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Fotos: erst Cache (ändern sich nie), sonst laden und merken
  if (IMAGE_HOSTS.includes(url.hostname) && (url.hostname !== 'www.themealdb.com' || url.pathname.startsWith('/images/'))) {
    e.respondWith(cachedImage(e.request));
    return;
  }

  // Eigene Dateien: erst Netz (damit Updates sofort ankommen), offline der Cache.
  // Alles andere (z. B. die TheMealDB-Datenabfrage) geht direkt ins Netz.
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});

async function cachedImage(request) {
  const cache = await caches.open(IMG_CACHE);
  const hit = await cache.match(request.url);
  if (hit) return hit;
  // mode 'cors': beide Bildserver erlauben das, und nur so kennt der Browser die echte Dateigröße
  const res = await fetch(request.url, { mode: 'cors' });
  if (res.ok) {
    await cache.put(request.url, res.clone());
    trim(cache);
  }
  return res;
}

async function trim(cache) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_IMAGES; i++) await cache.delete(keys[i]);
}
