/*
 * STUB unregister (TASK-022). SW scoped cua game (TASK-016) da hop nhat vao
 * root SW site-wide /sw.js. File nay phai GIU LAI tai URL cu it nhat vai
 * thang: client cu da cai SW scoped se update-check dung URL nay; neu xoa
 * ngay (404) SW cu song dai va tiep tuc cache theo logic cu.
 * Nhiem vu: xoa cache mb-offline-* + tu go dang ky. Du kien xoa han file:
 * sau 2026-11 (xem Technical Debt Summary trong feature_inventory.md).
 */

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(
                keys
                    .filter((k) => k.startsWith('mb-offline-'))
                    .map((k) => caches.delete(k))
            );
            await self.registration.unregister();
            // KHONG reload tab (co the dang giua van choi); root SW /sw.js
            // da duoc Layout dang ky song song va tiep quan tu lan dieu
            // huong ke tiep.
        })()
    );
});
