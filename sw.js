/* eslint-disable */

const filesToCache = ["/zip-files/?source=pwa","404.html","LICENSE.txt","favicon.84292e5e.ico","favicon.ico","humans.txt","icon.585561b6.png","icons/icon-128x128.png","icons/icon-144x144.png","icons/icon-152x152.png","icons/icon-192x192.png","icons/icon-384x384.png","icons/icon-512x512.png","icons/icon-72x72.png","icons/icon-96x96.png","icons/icon.png","index.html","main.1183e780.css","main.b17d4583.js","robots.txt","site.webmanifest","vendor.36cb5d1f.css","vendor.746d9cb7.js"]

const staticCacheName = 'zip-files_' + "1.0.4"

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets')
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll(filesToCache)
      })
  )
})

const isHashedFile = file => /\S\.[a-z0-9]{8}\.\S/.test(file)

self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Found ', event.request.url, ' in cache')
          const requestpath = event.request.url.split('?')[0]
          if (!isHashedFile(requestpath)) {
            // if file is not long-term cached, we update it everytime.
            console.log('Update request ' + event.request.url + ' in cache')
            fetch(event.request).then(response => {
              return caches.open(staticCacheName).then(cache => {
                cache.put(event.request, response.clone())
                return response
              })
            }).catch(() => response)
          }
          return response
        }
        console.log('Network request for ', event.request.url)
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
