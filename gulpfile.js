const path = require('path')
const fse = require('fs-extra')

const { src, dest, series, parallel } = require('gulp')
const through2 = require('through2')
const { JSDOM, VirtualConsole, ResourceLoader } = require('jsdom')
const pkg = require('./package.json')
if (!pkg._config) {
  pkg._config = {}
}

const distDir = path.join(__dirname, pkg._config.dist || 'dist')

exports.clean = function() {
  return fse.remove(distDir)
}

exports.cleanuselessassets = function () {
  return fse.readdir(distDir).then(files => {
    const removedfiles = files
      .filter(f => /^icon-\S+?[0-9a-z]{8}\.png$/.test(f))
      .map(f => path.join(distDir, f))
    return Promise.all(removedfiles.map(f => fse.remove(f)))
  })
}

exports.copypublic = function () {
  return src(['public/**/*', '!public/index.html', '!public/parcel-plugins/**'])
    .pipe(dest(distDir))
}

function preloadAndInline (doc, inlineSize) {
  const resolve = f => path.join(distDir, f)
  const builtinfo = doc.getElementById('built-time')
  if (builtinfo) {
    builtinfo.innerHTML = builtinfo.innerHTML.replace(/window\.BUILTIME/, JSON.stringify([
      Date.now(),
      process.env.npm_package_name,
      process.env.npm_package_version,
      require('git-rev-sync').short(null, 10)
    ]))
  }
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
}

function injectServiceWorker (doc, publicPath) {
  const swfilename = 'sw.js'
  if (doc) {
    const script = doc.createElement('script')
    script.innerHTML = `
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('./${swfilename}?_t=' + Date.now(), { scope: '${publicPath || ''}' });
      });
    }
    `.replace(/\s{2,}/mg, ' ')
    script.id = 'service-worker'
    doc.body.appendChild(script)
  }
  let swcode = fse.readFileSync(require.resolve('./src/js/sw.js'), 'utf8')
  const walkDir = (base, dirs = [], list = []) => {
    const dirpath = path.join(base, ...dirs)
    fse.readdirSync(dirpath).forEach(f => {
      if (f[0] === '.') return
      let file = path.join(dirpath, f)
      let isDirectory = fse.statSync(file).isDirectory()
      isDirectory ? walkDir(base, dirs.concat(f), list) : list.push(path.join(...dirs, f))
    })
    return list
  }
  swcode = swcode.replace('CACHE_LIST', JSON.stringify(['/zip-files/?source=pwa', ...walkDir(distDir)]))
    .replace('APP_VERSION', JSON.stringify(pkg.version))
  fse.outputFileSync(path.join(distDir, swfilename), swcode)
}

exports.posthtml = function () {
  const indexfilepath = path.join(distDir, 'index.html')
  return src(indexfilepath)
    .pipe(through2.obj(function (file, _, cb) {
      if (!file.isBuffer()) throw file
      const dom = new JSDOM(file.contents.toString())
      preloadAndInline(dom.window.document, pkg._config.inlineSize || 10000)
      injectServiceWorker(dom.window.document, pkg._config.publicPath || '/')
      file.contents = Buffer.from(dom.serialize())
      cb(null, file)
    }))
    .pipe(dest(distDir))
}

exports.prerender = function (done) {
  if (!pkg._config.prerender) return done()
  const _ignoreReq = new RegExp('google-analytics')
  class CustomResourceLoader extends ResourceLoader {
    fetch (url, options) {
      if (_ignoreReq.test(url)) {
        return Promise.resolve(Buffer.from(''))
      }
      return super.fetch(url, options)
    }
  }

  // monkey patch to enable cors
  try {
    const xhrUtilsPatch = require('jsdom/lib/jsdom/living/xhr-utils')
    const originValidCORSHeaders = xhrUtilsPatch.validCORSHeaders
    xhrUtilsPatch.validCORSHeaders = function validCORSHeaders(xhr, response) {
      response.headers['access-control-allow-origin'] = '*'
      response.headers['access-control-allow-credentials'] = 'true'
      return originValidCORSHeaders.apply(this, arguments)
    }
  } catch (err) {}

  const express = require('express')
  const app = express()
  app.use(express.static(distDir))
  const port = process.env.PORT || 4200
  const appContentReg = /<!--\[if APP-START\]><!\[endif\]-->[\s\S]+?<!--\[if APP-END\]><!\[endif\]-->/m
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
          window.close()
          server.close()
          const indexfilepath = path.join(distDir, 'index.html')
          fse.writeFileSync(
            indexfilepath,
            fse.readFileSync(indexfilepath, 'utf8').replace(appContentReg, rendered)
          )
          done()
        }
      }
    }).catch(done)
  })
}

exports.default = series(
  parallel(
    exports.cleanuselessassets,
    exports.copypublic,
  ),
  exports.posthtml,
  exports.prerender,
)
