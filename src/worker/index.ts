import { version } from '../utils/consts';

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
  const cache = await getCache(); // tslint:disable-line
  if (shouldCacheUrl(request.url)) {
    try {
      const response = await fetch(request);
      cache.put(request, response.clone());
      return response;
    } catch (e) {} // tslint:disable-line
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

worker.addEventListener('install', (event: any) => {
  event.waitUntil(install());
});

worker.addEventListener('activate', (event: any) => {
  event.waitUntil(removeOldCaches());
});

worker.addEventListener('fetch', (event: any) => {
  event.respondWith(resolve(event.request));
});
