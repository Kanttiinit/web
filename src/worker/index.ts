import {version} from '../utils/consts'

const worker = (self as any) as ServiceWorkerGlobalScope

const CACHE_NAME = `cache-${version}`
const urlsToCache = [
  '/',
  '/app.js',
  '/fi.png',
  '/en.png',
  '/logo_48.png',
  '/locating.svg',
  '/fonts/Interface-Regular.woff2',
  '/fonts/Interface-Medium.woff2',
  '/fonts/Interface-Bold.woff2'
]

let cache: Cache
const getCache = async () => cache || (cache = await caches.open(CACHE_NAME))

const resolve = async (request: Request) => {
  const cache = await getCache()
  if (request.url.match(/^https:\/\/kitchen\.kanttiinit\.fi/)) {
    try {
      const response = await fetch(request)
      cache.put(request, response.clone())
      return response
    } catch (e) {}
    return caches.match(request)
  } else if (request.url.match(/amazonaws.+\.(png|jpg)$/)) {
    cache.add(request)
  }
  return (await caches.match(request)) || fetch(request)
}

const install = async () => {
  const cache = await getCache()
  await cache.addAll(urlsToCache)
}

worker.addEventListener('install', (event: ExtendableEvent) => {
  worker.skipWaiting()
  event.waitUntil(install())
})

worker.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(resolve(event.request))
})
