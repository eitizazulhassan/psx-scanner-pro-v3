const CACHE = 'psx-v101-shell-1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('psx-v101-shell-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
 if (event.request.mode === 'navigate') event.respondWith(fetch(event.request).catch(() => caches.open(CACHE).then(c => c.match('./index.html'))));
 else if (SHELL.slice(1).some(path => new URL(path,self.registration.scope).href === url.href)) event.respondWith(fetch(event.request).catch(() => caches.open(CACHE).then(c => c.match(event.request))));
});
