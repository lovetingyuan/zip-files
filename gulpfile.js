const path = require('path')
const fse = require('fs-extra')

const { src, dest, series } = require('gulp')
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
  const swfuncstr = fse.readFileSync(require.resolve('./src/js/sw.js'), 'utf8')
  const swresult = swfuncstr.replace('CACHE_LIST', JSON.stringify(['/', ...fse.readdirSync(distDir)]))
  fse.outputFileSync(path.join(distDir, swfilename), swresult)
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
  exports.copypublic,
  exports.posthtml,
  exports.prerender,
)
