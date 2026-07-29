/*
 * Service Worker scoped cho game Thanh pho Thinh Vuong (TASK-016).
 * Scope: /fun/monopoly-board/ (chi kiem soat page game, khong dung
 * cham phan con lai cua site).
 *
 * Chien luoc: stale-while-revalidate cho request same-origin GET.
 * - Lan dau vao trang: moi asset (html, js chunk, css, svg) duoc cache.
 * - Cac lan sau: tra cache ngay (chay duoc offline), dong thoi tai ban
 *   moi o nen de lan sau cap nhat.
 * Khi doi ten CACHE_NAME, cache cu bi xoa o activate.
 */

const CACHE_NAME = 'mb-offline-v1';

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(
                keys
                    .filter((k) => k.startsWith('mb-offline-') && k !== CACHE_NAME)
                    .map((k) => caches.delete(k))
            );
            await self.clients.claim();
        })()
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const cached = await cache.match(request);
            const network = fetch(request)
                .then((response) => {
                    if (response && response.ok) {
                        cache.put(request, response.clone());
                    }
                    return response;
                })
                .catch(() => cached);
            return cached || network;
        })()
    );
});
