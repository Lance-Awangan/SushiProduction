const CACHE_VERSION = "v3";
const CACHE_NAME = `sushi-app-${CACHE_VERSION}`;
const RUNTIME_CACHE = `sushi-runtime-${CACHE_VERSION}`;
const ASSETS = [
    "index.html",
    "manifest.json",
    "service-worker.js"
];

// ----- Helpers -----
function safeLog(level, msg, extra) {
    try {
        const out = { ts: Date.now(), level, msg: String(msg), extra: extra ?? null };
        // console output (source-map-safe)
        if (console && console[level]) console[level](out);
        else if (console && console.log) console.log(out);
        // best-effort telemetry (non-blocking)
        try {
            // use keepalive if available; swallow errors
            fetch("/sw-telemetry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(out),
                keepalive: true
            }).catch(() => { /* ignore */ });
        } catch (_) { /* ignore */ }
    } catch (_) { /* must never throw */ }
}

async function limitCacheSize(cacheName, maxItems) {
    try {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        if (keys.length <= maxItems) return;
        // delete oldest entries
        const deleteCount = keys.length - maxItems;
        for (let i = 0; i < deleteCount; i++) {
            await cache.delete(keys[i]);
        }
    } catch (err) {
        safeLog("warn", "limitCacheSize failed", { cacheName, err: String(err) });
    }
}

// ----- Install -----
self.addEventListener("install", (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        const results = await Promise.allSettled(
            ASSETS.map(async (asset) => {
                try {
                    const res = await fetch(asset, { cache: "reload" });
                    if (!res || !res.ok) throw new Error(`${asset} -> ${res ? res.status : "no response"}`);
                    // only cache same-origin/basic responses (safe)
                    const assetUrl = new URL(asset, location);
                    if (assetUrl.origin === location.origin && (res.type === "basic" || res.type === "")) {
                        await cache.put(asset, res.clone());
                    }
                } catch (err) {
                    safeLog("warn", "install: failed to cache asset", { asset, err: String(err) });
                }
            })
        );
        // ensure new SW activates immediately
        await self.skipWaiting();
    })());
});

// ----- Activate -----
self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
        try {
            const keys = await caches.keys();
            await Promise.all(
                keys
                    .filter(k => k.startsWith("sushi-app-") && k !== CACHE_NAME)
                    .map(k => caches.delete(k))
            );
            // claim clients immediately
            await self.clients.claim();
        } catch (err) {
            safeLog("error", "activate cleanup failed", { err: String(err) });
        }
    })());
});

// ----- Fetch (offline-first with runtime caching + trimming) -----
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith((async () => {
        // Try cache first (includes both precache and runtime caches)
        const cached = await caches.match(event.request);
        if (cached) return cached;

        // Try network and cache eligible responses in runtime cache
        try {
            const response = await fetch(event.request);
            if (response && response.status === 200 && response.type === 'basic') {
                // same-origin basic response — cache for offline
                const cache = await caches.open(RUNTIME_CACHE);
                // schedule caching (non-blocking)
                event.waitUntil((async () => {
                    try {
                        await cache.put(event.request, response.clone());
                        // keep runtime cache to a reasonable size
                        await limitCacheSize(RUNTIME_CACHE, 50);
                    } catch (err) {
                        safeLog("warn", "runtime cache put failed", { url: event.request.url, err: String(err) });
                    }
                })());
            }
            return response;
        } catch (err) {
            safeLog("info", "network fetch failed, attempting navigation fallback", { url: event.request.url, err: String(err) });
            // If navigation, return cached index.html fallback
            if (event.request.mode === "navigate") {
                const fallback = await caches.match("index.html");
                if (fallback) return fallback;
            }
            return new Response(null, { status: 503, statusText: "Service Unavailable (offline)" });
        }
    })());
});
