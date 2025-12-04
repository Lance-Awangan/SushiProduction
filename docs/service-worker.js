// ---- version ----
const CACHE_VERSION = "v20"; // ← bump this when you deploy
const STATIC_CACHE = `sushi-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `sushi-runtime-${CACHE_VERSION}`;

const CORE_ASSETS = [
    "index.html",
    "manifest.json",
    "service-worker.js",
    "icons/icon-192.png",
    "icons/icon-512.png",
    "icons/apple-icon-180.png",
    "icons/maskable-icon-512.png"
];

// ---- install ----
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then(async (cache) => {
            await Promise.allSettled(
                CORE_ASSETS.map((url) => cache.add(url))
            );
        })
    );

    // new worker should activate immediately
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            // delete old caches
            const keys = await caches.keys();
            await Promise.all(
                keys
                    .filter(
                        (key) =>
                            key.startsWith("sushi-static-") ||
                            key.startsWith("sushi-runtime-")
                    )
                    .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
                    .map((key) => caches.delete(key))
            );

            // take control of already open pages
            await self.clients.claim();

            // 🔔 tell all open pages "new version, please reload"
            const clients = await self.clients.matchAll({ type: "window" });
            for (const client of clients) {
                client.postMessage({ type: "NEW_VERSION" });
            }
        })()
    );
});

// ---- fetch (offline + runtime cache) ----
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    const requestUrl = new URL(event.request.url);
    const isSameOrigin = requestUrl.origin === self.location.origin;

    // navigation requests → try network, fall back to cached index.html
    if (event.request.mode === "navigate") {
        event.respondWith(
            (async () => {
                try {
                    const networkResponse = await fetch(event.request);
                    return networkResponse;
                } catch (err) {
                    const cached = await caches.match("index.html");
                    if (cached) return cached;
                    throw err;
                }
            })()
        );
        return;
    }

    // non-navigation GET requests
    event.respondWith(
        (async () => {
            // 1. try cache
            const cached = await caches.match(event.request);
            if (cached) return cached;

            // 2. network + runtime cache
            try {
                const response = await fetch(event.request);

                // only cache good same-origin responses
                if (
                    isSameOrigin &&
                    response &&
                    response.status === 200 &&
                    response.type === "basic"
                ) {
                    const cache = await caches.open(RUNTIME_CACHE);
                    event.waitUntil(cache.put(event.request, response.clone()));
                }

                return response;
            } catch (err) {
                // if offline and no cache, just fail
                throw err;
            }
        })()
    );
});
