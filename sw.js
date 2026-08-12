const CACHE_NAME = 'app-cache-v1';
// OJO: si tu PWA no vive en la raíz del dominio (ej: usuario.github.io/mi-repo/),
// estas rutas absolutas van a dar 404. Usá rutas relativas al scope del SW:
const APP_SHELL = ['./', './index.html', './styles.css', './script.js', './manifest.json', './dolarIco.svg'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            // En vez de addAll (todo o nada), cacheamos uno por uno
            // para poder ver exactamente cuál falla.
            const results = await Promise.allSettled(
                APP_SHELL.map((url) =>
                    fetch(url).then((res) => {
                        if (!res.ok) throw new Error(`${url} respondió ${res.status}`);
                        return cache.put(url, res);
                    })
                )
            );
            results.forEach((r, i) => {
                if (r.status === 'rejected') {
                    console.error('[SW] No se pudo cachear', APP_SHELL[i], r.reason);
                }
            });
        })
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
                .catch(
                    () =>
                        caches.match(request).then((cached) => cached) ||
                        caches.match('./index.html')
                )
        );
        return;
    }

    // Otros recursos estáticos (CSS, JS, imágenes): caché primero, actualiza en segundo plano
    event.respondWith(
        caches.match(request).then((cached) => {
            const fetchPromise = fetch(request)
                .then((res) => {
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, res.clone()));
                    return res;
                })
                .catch(() => cached);
            return cached || fetchPromise;
        })
    );
});