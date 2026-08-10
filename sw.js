const CACHE_NAME = 'app-cache-v1';
const APP_SHELL = ['/', '/index.html', '/styles.css', '/app.js'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    // La página (navegación): red primero, caché como respaldo
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                })
                .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
        );
        return;
    }

    // Otros recursos estáticos (CSS, JS, imágenes): caché primero, actualiza en segundo plano
    event.respondWith(
        caches.match(request).then((cached) => {
            const fetchPromise = fetch(request).then((res) => {
                caches.open(CACHE_NAME).then((cache) => cache.put(request, res.clone()));
                return res;
            });
            return cached || fetchPromise;
        })
    );
});