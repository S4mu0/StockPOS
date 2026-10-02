// Service worker base: cachea el shell. La cola offline de ventas llega en la siguiente fase.
const C = 'stockpos-v1';
self.addEventListener('install', (e) => e.waitUntil(caches.open(C).then((c) => c.addAll(['/']))));
self.addEventListener('fetch', (e) => { if (e.request.method === 'GET' && !e.request.url.includes('/api/'))
  e.respondWith(fetch(e.request).then((r) => { const x = r.clone(); caches.open(C).then((c) => c.put(e.request, x)); return r; }).catch(() => caches.match(e.request))); });
