/*
 * Service Worker site-wide cho chitiet.vn (TASK-022).
 * Scope: / (toan site). File nay la SOURCE o web/public/; sau khi build,
 * scripts/generate-sw.ts se stamp 2 placeholder vao dist/sw.js:
 *   - __SW_VERSION__  : phien ban build (hash noi dung)
 *   - __PRECACHE__    : danh sach app shell (trang /offline/ + asset cua no)
 * Gia tri mac dinh ben duoi an toan khi chua stamp (dev/preview tay).
 *
 * Chien luoc theo loai request (chi same-origin GET, con lai pass-through):
 *   - Navigation (HTML)      : network-first (timeout 4s) -> cache -> /offline/
 *   - /_astro/*              : cache-first (ten file co hash, bat bien) + trim
 *   - /pagefind/*            : stale-while-revalidate (sinh moi moi lan build)
 *   - /fonts/ /images/ icon  : cache-first
 *   - /libs/ /models/        : cache-first co kiem tra quota (asset 5-40MB,
 *                              KHONG precache; chi cache khi user da dung)
 *   - /data/ /animations/    : stale-while-revalidate
 *   - /runtime/*             : KHONG can thiep (game iframe co SW rieng trong
 *                              scope /runtime/<slug>/, tranh cache 2 tang)
 *
 * Update: skipWaiting + claim (an toan vi HTML network-first va asset hash cu
 * van con tren host sau deploy). Kill-switch: xem doc/overview/
 * runtime_architecture.md muc PWA.
 */

const VERSION = '22555df1b4e6';
const CACHE_NAME = 'ct-pwa-' + VERSION;
const PRECACHE = ["/offline/","/manifest.webmanifest","/logo.png","/favicon.ico","/favicon.svg","/images/pwa/icon-192.png","/images/pwa/icon-512.png","/images/pwa/icon-maskable-512.png","/images/pwa/apple-touch-icon.png","/_astro/RivePlayerWidget.CCnsejXS.css","/_astro/themes.LbTWlCNs.css","/_astro/RivePlayerWidget.astro_astro_type_script_index_0_lang.BpFoMc76.js"];
const OFFLINE_URL = '/offline/';
const NAV_TIMEOUT_MS = 4000;
const ASTRO_CACHE_LIMIT = 80;
// Quota du phong: chi cache asset lon khi con trong > 2x kich thuoc + 50MB
const QUOTA_HEADROOM_BYTES = 50 * 1024 * 1024;

self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            if (PRECACHE.length > 0) {
                const cache = await caches.open(CACHE_NAME);
                await cache.addAll(PRECACHE);
            }
            await self.skipWaiting();
        })()
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(
                keys
                    .filter((k) => k.startsWith('ct-pwa-') && k !== CACHE_NAME)
                    .map((k) => caches.delete(k))
            );
            await self.clients.claim();
        })()
    );
});

function fetchWithTimeout(request, ms) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('sw-nav-timeout'));
        }, ms);
        fetch(request).then(
            (response) => {
                clearTimeout(timer);
                resolve(response);
            },
            (err) => {
                clearTimeout(timer);
                reject(err);
            }
        );
    });
}

/* Key cache theo pathname (bo query nhu ?utm_source=pwa) de 1 trang 1 entry */
function cacheKey(url) {
    return url.origin + url.pathname;
}

async function handleNavigation(request, url) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetchWithTimeout(request, NAV_TIMEOUT_MS);
        if (response && response.ok) {
            cache.put(cacheKey(url), response.clone());
        }
        return response;
    } catch (_err) {
        const cached = await cache.match(cacheKey(url));
        if (cached) return cached;
        const offline = await cache.match(OFFLINE_URL);
        if (offline) return offline;
        return fetch(request);
    }
}

async function handleCacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response && response.ok) {
        cache.put(request, response.clone());
    }
    return response;
}

/* Cache-first cho /_astro/ kem trim: giu toi da ASTRO_CACHE_LIMIT entry */
async function handleAstro(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response && response.ok) {
        await cache.put(request, response.clone());
        trimAstroCache(cache).catch(() => undefined);
    }
    return response;
}

async function trimAstroCache(cache) {
    const keys = await cache.keys();
    const astroKeys = keys.filter((req) =>
        new URL(req.url).pathname.startsWith('/_astro/')
    );
    if (astroKeys.length <= ASTRO_CACHE_LIMIT) return;
    // keys() theo thu tu insert -> xoa cac entry cu nhat
    const excess = astroKeys.slice(0, astroKeys.length - ASTRO_CACHE_LIMIT);
    await Promise.all(excess.map((req) => cache.delete(req)));
}

async function handleStaleWhileRevalidate(request) {
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
}

/* Cache-first cho asset lon (/libs/, /models/): chi put khi quota con du */
async function handleBigAsset(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response && response.ok && !request.headers.has('range')) {
        try {
            const size =
                Number(response.headers.get('content-length')) || 0;
            let hasRoom = true;
            if (self.navigator && navigator.storage && navigator.storage.estimate) {
                const est = await navigator.storage.estimate();
                if (est && est.quota) {
                    const free = est.quota - (est.usage || 0);
                    hasRoom = free > size * 2 + QUOTA_HEADROOM_BYTES;
                }
            }
            if (hasRoom) {
                await cache.put(request, response.clone());
            }
        } catch (_err) {
            // Loi quota/put khong duoc lam hong response tra ve
        }
    }
    return response;
}

function routeRequest(request, url) {
    const path = url.pathname;
    // Game iframe co SW rieng trong scope cua no - khong cache 2 tang
    if (path.startsWith('/runtime/')) return null;
    if (request.mode === 'navigate') {
        return handleNavigation(request, url);
    }
    if (path.startsWith('/_astro/')) return handleAstro(request);
    if (path.startsWith('/pagefind/')) {
        return handleStaleWhileRevalidate(request);
    }
    if (path.startsWith('/libs/') || path.startsWith('/models/')) {
        return handleBigAsset(request);
    }
    if (path.startsWith('/data/') || path.startsWith('/animations/')) {
        return handleStaleWhileRevalidate(request);
    }
    if (
        path.startsWith('/fonts/') ||
        path.startsWith('/images/') ||
        path === '/logo.png' ||
        path === '/favicon.ico' ||
        path === '/favicon.svg' ||
        path === '/manifest.webmanifest'
    ) {
        return handleCacheFirst(request);
    }
    return null; // con lai: de browser tu xu ly (network)
}

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    let handled;
    try {
        handled = routeRequest(request, url);
    } catch (_err) {
        handled = null; // SW loi logic thi nhuong lai cho network
    }
    if (handled) {
        event.respondWith(handled.catch(() => fetch(request)));
    }
});
