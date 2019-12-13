
  const filesToCache = ["/","favicon.84292e5e.ico","icon.585561b6.png","index.html","main.7db3ea6c.js","main.7de733e5.css","site.webmanifest","vendor.36cb5d1f.css","vendor.cebd775b.js"];
  
  const staticCacheName = "1.0.3";
  
  self.addEventListener('install', event => {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
      caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll(filesToCache);
      })
    );
  });

  self.addEventListener('fetch', event => {
    // console.log('Fetch event for ', event.request.url);
    event.respondWith(
      caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          if (event.request.url.split('?')[0].endsWith('/')) {
            // if it is index.html, we update it every time.
            fetch(event.request).then(response => {
              return caches.open(staticCacheName).then(cache => {
                cache.put(event.request.url, response.clone());
                return response;
              });
            }).catch(() => response)
          }
          return response;
        }
        console.log('Network request for ', event.request.url);
        return fetch(event.request).then(response => {
          // TODO 5 - Respond with custom 404 page
          return caches.open(staticCacheName).then(cache => {
            if (response.status === 200) { // only cache 200 response
              cache.put(event.request.url, response.clone());
            }
            return response;
          });
        });
  
      }).catch(error => {
  
        // TODO 6 - Respond with custom offline page
  
      })
    );
  });
  self.addEventListener('activate', event => {
     // console.log('Activating new service worker...');

    const cacheWhitelist = [staticCacheName];

    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
