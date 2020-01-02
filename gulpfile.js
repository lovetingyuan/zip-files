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

exports.clean = function () {
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

function preloadandinline (doc, inlineSize) {
  const resolve = f => path.basename(path.join(distDir, f))
  doc.querySelectorAll('script[src]').forEach(dom => {
    const file = resolve(dom.src)
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
    const file = resolve(dom.href)
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

function injectserviceworker (doc, publicPath) {
  const swfilename = 'sw.js'
  if (doc) {
    const script = doc.createElement('script')
    script.innerHTML = `
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('./${swfilename}', { scope: '${publicPath || ''}' });
      });
    }
    `.replace(/\s{2,}/mg, ' ')
    doc.body.appendChild(script)
  }
  let swcode = fse.readFileSync(require.resolve('./src/js/sw.js'), 'utf8')
  const walkDir = (base, dirs = [], list = []) => {
    const dirpath = path.join(base, ...dirs)
    fse.readdirSync(dirpath).forEach(f => {
      if (f[0] === '.') return
      const file = path.join(dirpath, f)
      const isDirectory = fse.statSync(file).isDirectory()
      isDirectory ? walkDir(base, dirs.concat(f), list) : list.push(path.join(...dirs, f))
    })
    return list
  }
  swcode = swcode.replace('CACHE_LIST', JSON.stringify(['/zip-files/?source=pwa', ...walkDir(distDir)]))
    .replace('APP_NAME', JSON.stringify(pkg.name))
    .replace('APP_VERSION', JSON.stringify(pkg.version))
  fse.outputFileSync(path.join(distDir, swfilename), swcode)
}

function printbuiltinfo (doc) {
  const builtime = doc.createElement('script')
  /* eslint-disable */
  const builtimefunc = function () {
    var v = window.BUILTIME;
    var d = new Date(v[0]);
    var s = [d.getFullYear(), '/', d.getMonth() + 1, '/', d.getDate(), ' ', d.getHours(), ':', d.getMinutes()];
    console.log(
      '%c' + v[1] + '(' + v[2] + '): ' + s.join('') + ' ' + v[3],
      'background:#EE4D2D;color:#fff;padding:2px 10px;border-radius:2px;'
    );
  }
  /* eslint-enable */
  builtime.textContent = `(${builtimefunc.toString().replace(
    'window.BUILTIME', JSON.stringify([
      Date.now(),
      process.env.npm_package_name,
      process.env.npm_package_version,
      require('git-rev-sync').short(null, 10)
    ])
  ).replace(/\s{2,}/mg, ' ')})()`
  doc.body.appendChild(builtime)
}

exports.posthtml = function () {
  const indexfilepath = path.join(distDir, 'index.html')
  return src(indexfilepath)
    .pipe(through2.obj(function (file, _, cb) {
      if (!file.isBuffer()) throw file
      const dom = new JSDOM(file.contents.toString())
      preloadandinline(dom.window.document, pkg._config.inlineSize || 10000)
      injectserviceworker(dom.window.document, pkg._config.publicPath || '/')
      printbuiltinfo(dom.window.document)
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
    xhrUtilsPatch.validCORSHeaders = function validCORSHeaders (xhr, response) {
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

Object.keys(exports).forEach(name => {
  if (typeof exports[name] === 'function' && !exports[name].name && !exports[name].displayName) {
    exports[name].displayName = name
  }
})

exports.default = series(
  parallel(
    exports.clean,
    exports.copypublic
  ),
  exports.posthtml,
  exports.prerender
)
