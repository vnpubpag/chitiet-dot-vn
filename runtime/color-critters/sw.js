/*
 * Service Worker — offline-first, khong CDN.
 * - Precache app shell toi thieu khi install.
 * - Moi GET cung origin: cache-first, dong thoi cap nhat cache ngam
 *   (stale-while-revalidate) de lan sau co ban moi.
 * - Asset con vat duoc cache lazy theo tung tranh khi be mo.
 * Tang CACHE_VERSION khi doi cau truc cache.
 */
const CACHE_VERSION = 'color-critters-v1';
const PRECACHE = ['./', './manifest.webmanifest', './icons/icon.svg', './animals/manifest.json'];

/**
 * Precache day du de offline hoat dong ngay sau lan mo dau tien:
 * - shell + bundle hash (parse tu index.html vi ten file co hash build)
 * - toan bo art.svg/metadata.json (SVG rat nhe, tong ~50KB)
 */
async function precacheAll() {
  const cache = await caches.open(CACHE_VERSION);
  await cache.addAll(PRECACHE);
  try {
    const shell = await cache.match('./');
    if (shell) {
      const html = await shell.clone().text();
      const assets = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/g)].map((m) => m[1]);
      if (assets.length > 0) await cache.addAll(assets);
    }
    const manifestRes = await cache.match('./animals/manifest.json');
    if (manifestRes) {
      const manifest = await manifestRes.clone().json();
      const urls = (manifest.animals ?? []).flatMap((a) => [
        `./animals/${a.id}/art.svg`,
        `./animals/${a.id}/metadata.json`,
      ]);
      if (urls.length > 0) await cache.addAll(urls);
    }
  } catch (e) {
    // precache mo rong that bai khong chan install; runtime cache se bu dap
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(precacheAll().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_VERSION).then(async (cache) => {
      // ignoreVary: server dev/preview co the tra "Vary: Origin" lam truot
      // cache.match giua request co/khong header Origin (script crossorigin).
      const cached = await cache.match(req, {
        ignoreSearch: req.mode === 'navigate',
        ignoreVary: true,
      });
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);

      if (cached) {
        // cap nhat ngam, tra ban cache ngay (nhanh + offline)
        return cached;
      }
      const res = await network;
      if (res) return res;
      // fallback offline: voi navigation tra ve shell
      if (req.mode === 'navigate') {
        const shell = await cache.match('./');
        if (shell) return shell;
      }
      return new Response('Đang ngoại tuyến', { status: 503, statusText: 'Offline' });
    }),
  );
});
