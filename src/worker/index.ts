(async () => {
  const global = (self as any) as ServiceWorkerGlobalScope

  const CACHE_NAME = 'cache-v2'
  const urlsToCache = [
    '/',
    '/app.js'
  ]
  const cache = await caches.open(CACHE_NAME)
  
  const resolve = async (request: Request) => {
    if (request.url.match(/^https:\/\/kitchen\.kanttiinit\.fi/)) {
      try {
        const response = await fetch(request)
        cache.put(request, response.clone())
        return response
      } catch (e) {}
      return caches.match(request)
    } else if (request.url.match(/\.(png|jpg)$/)) {
      cache.add(request)
    }
    return (await caches.match(request)) || fetch(request)
  }
  
  global.addEventListener('install', (event: ExtendableEvent) => {
    global.skipWaiting()
    event.waitUntil(cache.addAll(urlsToCache));
  })
  
  global.addEventListener('fetch', (event: FetchEvent) => {
    event.respondWith(resolve(event.request))
  })
})()
