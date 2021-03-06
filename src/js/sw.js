const filesToCache = CACHE_LIST // eslint-disable-line

const staticCacheName = APP_NAME + '@' + APP_VERSION // eslint-disable-line

self.addEventListener('install', event => {
  // console.log('Attempting to install service worker and cache static assets')
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll(filesToCache)
      })
  )
})

const isHashedFile = file => /\S\.[a-z0-9]{8}\.\S/.test(file)

self.addEventListener('fetch', event => {
  // console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // console.log('Found ', event.request.url, ' in cache')
          const requestpath = event.request.url.split('?')[0]
          if (!isHashedFile(requestpath) && navigator.onLine) {
            // if file is not long-term cached, we update it everytime(online).
            // console.log('Update request ' + event.request.url + ' in cache')
            fetch(event.request).then(response => {
              return caches.open(staticCacheName).then(cache => {
                cache.put(event.request, response.clone())
                return response
              })
            }).catch(() => response)
          }
          return response
        }
        // console.log('Network request for ', event.request.url, self, typeof navigator && navigator)
        return fetch(event.request).then(response => {
        // TODO 5 - Respond with custom 404 page
          return caches.open(staticCacheName).then(cache => {
            if (response.status === 200) { // only cache 200 response, notice cors setting.
              cache.put(event.request, response.clone())
            }
            return response
          })
        })
      }).catch(error => {
        console.warn('Fetch event error: ' + error)
        // TODO 6 - Respond with custom offline page
      })
  )
})
self.addEventListener('activate', event => {
  // console.log('Activating new service worker...');

  const cacheWhitelist = [staticCacheName]

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})
