import { version } from '../utils/consts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const worker = self as any;

const CACHE_NAME = `cache-${version}`;

let cache: Cache;
const getCache = async () => cache || (cache = await caches.open(CACHE_NAME));

const shouldCacheUrl = (url: string): boolean => {
  if (url.match('/admin/')) {
    return false;
  }
  if (url.match(/^https:\/\/kitchen\.kanttiinit\.fi/)) {
    return true;
  }
  if (
    url.match(/.+\.amazonaws\.com|localhost/) &&
    url.match(/\.(js|png|svg|woff2)$/)
  ) {
    return true;
  }
};

const resolve = async (request: Request) => {
  if (shouldCacheUrl(request.url)) {
    try {
      const response = await fetch(request);
      cache.put(request, response.clone());
      return response;
    // eslint-disable-next-line no-empty
    } catch (e) {}
    return caches.match(request);
  }
  return (await caches.match(request)) || fetch(request);
};

const install = async () => {
  await (await getCache()).addAll(['/']);
  return worker.skipWaiting();
};

const removeOldCaches = async () => {
  const cacheKeys = await caches.keys();
  await Promise.all(
    cacheKeys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
worker.addEventListener('install', (event: any) => {
  event.waitUntil(install());
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
worker.addEventListener('activate', (event: any) => {
  event.waitUntil(removeOldCaches());
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
worker.addEventListener('fetch', (event: any) => {
  event.respondWith(resolve(event.request));
});
