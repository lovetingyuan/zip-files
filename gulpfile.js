const path = require('path')
const fse = require('fs-extra')

const { src, dest, series, parallel } = require('gulp')
const through2 = require('through2')
const { JSDOM, VirtualConsole, ResourceLoader } = require('jsdom')
const pkg = require('./package.json')
if (!pkg._config) {
  pkg._config = {}
}

exports.copypublic = function () {
  return src(['public/**/*', '!public/index.html', '!public/parcel-plugins/**'])
    .pipe(dest('dist/'))
}

exports.posthtml = function (done) {
  const { inlineSize } = pkg._config
  if (!inlineSize) return done()

  return src('dist/index.html')
    .pipe(through2.obj(function (file, _, cb) {
      const resolve = f => path.join(__dirname, 'dist', f)
      if (file.isBuffer()) {
        const dom = new JSDOM(file.contents.toString())
        const doc = dom.window.document
        const meta = doc.createElement('meta')
        meta.setAttribute('name', 'builtime')
        meta.setAttribute('content', [
          Date.now(),
          process.env.npm_package_name,
          process.env.npm_package_version,
          require('git-rev-sync').short(null, 10)
        ] + '')
        doc.head.appendChild(meta)
        doc.querySelectorAll('script[src]').forEach(dom => {
          const file = resolve(path.basename(dom.src))
          if (!fse.existsSync(file)) return
          if (fse.lstatSync(file).size <= inlineSize) {
            dom.removeAttribute('src')
            dom.innerHTML = fse.readFileSync(file, 'utf8')
          } else {
            const preload = doc.createElement('link')
            preload.href = dom.src
            preload.rel = 'preload'
            preload.setAttribute('as', 'script')
            doc.head.appendChild(preload)
          }
        })
        doc.querySelectorAll('link[rel=stylesheet][href]').forEach(dom => {
          const file = resolve(path.basename(dom.href))
          if (!fse.existsSync(file)) return
          if (fse.lstatSync(file).size <= inlineSize) {
            const style = doc.createElement('style')
            style.innerHTML = fse.readFileSync(file, 'utf8')
            dom.replaceWith(style)
          } else {
            dom.rel = 'preload'
            dom.setAttribute('as', 'style')
            dom.setAttribute('onload', "this.rel='stylesheet'")
          }
        })
        file.contents = Buffer.from(dom.serialize())
      }
      cb(null, file)
    }))
    .pipe(dest('dist'))
}

exports.prerender = function (done) {
  if (!pkg._config.prerender) return done()
  const {
    ignoreRequests
  } = pkg._config.prerender
  const _ignoreReq = new RegExp(ignoreRequests)
  class CustomResourceLoader extends ResourceLoader {
    fetch (url, options) {
      if (ignoreRequests && _ignoreReq.test(url)) {
        return Promise.resolve(Buffer.from(''))
      }
      return super.fetch(url, options)
    }
  }
  const dist = path.join(__dirname, 'dist')

  const express = require('express')
  const app = express()
  app.use(express.static(dist))
  const port = process.env.PORT || 4200
  const server = app.listen(process.env.PORT || 4200, (err) => {
    if (err) return done(err)
    const url = 'http://localhost:' + port
    const virtualConsole = new VirtualConsole()
    virtualConsole.sendTo(console)
    JSDOM.fromURL(url, {
      runScripts: 'dangerously',
      pretendToBeVisual: true,
      // virtualConsole,
      resources: new CustomResourceLoader(),
      beforeParse (window) {
        window.Attr.prototype.cloneNode = window.Attr.prototype.cloneNode || function cloneNode () {
          const attr = window.document.createAttribute(this.name)
          attr.value = this.value
          return attr
        }
        window.__prerender__ = function (rendered) {
          setTimeout(() => {
            window.close()
            const indexHtml = fse.readFileSync(path.join(dist, 'index.html'), 'utf8')
            server.close(() => {
              fse.writeFileSync(
                path.join(dist, 'index.html'),
                indexHtml.replace(/<div id=("root"|root)><\/div>/m, rendered)
                  .replace(/<\/body><\/html>$/, function () {
                    const swfunc = sw.toString()
                    const swfuncstr = swfunc.substring(swfunc.indexOf('{') + 1, swfunc.lastIndexOf('}'))
                    const swresult = swfuncstr.replace('CACHE_LIST', JSON.stringify(
                      ['/', ...fse.readdirSync(dist)]
                    ))
                    const swfilename = 'sw.js'
                    fse.outputFileSync(path.join(dist, swfilename), swresult)
                    return `<script>
                    if ('serviceWorker' in navigator) {
                      window.addEventListener('load', function() {
                        navigator.serviceWorker.register('./${swfilename}?_t=' + Date.now(), { scope: '/${pkg._config.publicPath || ''}' });
                      });
                    }</script></body></html>`.replace(/\s{2,}/g, ' ')
                  })
              )
              done()
            })
          })
        }
      }
    }).catch(done)
  })
}

function sw () {
  const filesToCache = CACHE_LIST;
  
  const staticCacheName = 'zip-files';
  
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
}

exports.default = series(
  exports.prerender,
  parallel(exports.copypublic, exports.posthtml)
)
