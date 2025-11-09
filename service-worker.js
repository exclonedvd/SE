/* eslint-disable no-restricted-globals */
// Auto-generated on 2025-11-09T11:05:15.711825Z
const VERSION = 'v2.1.0';
const SHELL_CACHE = `studyhub-shell-${VERSION}`;
const DATA_CACHE  = `studyhub-data-${VERSION}`;
const IMG_CACHE   = `studyhub-img-${VERSION}`;

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js"
];

const DATA_FILES = [
  "./data/AM.json",
  "./data/DC.json",
  "./data/DIU.json",
  "./data/DP.json",
  "./data/SGA.json",
  "./data/SL.json",
  "./data/index.json"
];

const IMG_FILES = [
  "./img/hero-original.png",
  "./img/hero.webp",
  "./img/icon-192.png",
  "./img/icon-512.png",
  "./img/logo-antares.webp"
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const [shell, data, img] = await Promise.all([
      caches.open(SHELL_CACHE),
      caches.open(DATA_CACHE),
      caches.open(IMG_CACHE)
    ]);
    await shell.addAll(APP_SHELL);
    if (DATA_FILES.length) await data.addAll(DATA_FILES);
    if (IMG_FILES.length) await img.addAll(IMG_FILES);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => ![SHELL_CACHE, DATA_CACHE, IMG_CACHE].includes(k))
        .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  // Handle only same-origin
  if (location.origin !== url.origin) return;

  if (url.pathname.startsWith('/data/') || url.pathname.endsWith('.json')) {
    event.respondWith(cacheFirst(DATA_CACHE, request));
    return;
  }
  if (url.pathname.startsWith('/docs/') || url.pathname.endsWith('.pdf')) {
    event.respondWith(networkFirst(SHELL_CACHE, request));
    return;
  }
  if (url.pathname.startsWith('/img/') || /\.(png|webp|jpg|jpeg|gif|svg)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(IMG_CACHE, request));
    return;
  }
  event.respondWith(networkFirst(SHELL_CACHE, request));
});

async function cacheFirst(cacheName, request) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;
  const resp = await fetch(request);
  cache.put(request, resp.clone());
  return resp;
}

async function networkFirst(cacheName, request) {
  const cache = await caches.open(cacheName);
  try {
    const resp = await fetch(request);
    cache.put(request, resp.clone());
    return resp;
  } catch (err) {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}
