const path = require('path')
const fse = require('fs-extra')
const chalk = require('chalk')

const { src, dest, series, parallel } = require('gulp')
const through2 = require('through2')
const { JSDOM, VirtualConsole, ResourceLoader } = require('jsdom')
const pkg = require('./package.json')
if (!pkg._config) {
  pkg._config = {}
}

exports.i18n = function (done) {
  if (!pkg._config.i18n) return done()
  const {
    langCodeMap,
    resourceId
  } = pkg._config.i18n
  if (!process.env.cid) {
    try {
      let env = path.join(__dirname, '.env.production.local')
      if (!fse.existsSync(env)) {
        env = path.join(__dirname, '.env.local')
      }
      require('dotenv').config({ path: env })
    } catch (e) {}
  }
  let requests = []
  const resolve = (code = 'index') => path.join(__dirname, `public/locales/${code}.json`)
  if (resourceId) {
    const got = require('got')
    const url = (lang) => `https://transify.seagroup.com/resources/${resourceId}/${lang === 'en' ? '' : lang + '/'}json/download`
    requests = Object.keys(langCodeMap).map(async country => {
      const _url = url(langCodeMap[country])
      const { body } = await got.get(_url, {
        json: true,
        timeout: 10000
      })
      await fse.outputJson(resolve(langCodeMap[country]), body)
    })
  }
  Promise.all(requests).then(() => {
    const langCode = langCodeMap[process.env.cid]
    if (!langCode) {
      console.warn(
        chalk.yellow(
          '  i18n will use English as default language because missing ' +
          (process.env.cid ? `translation of "${process.env.cid}".` : '"process.env.cid".')
        )
      )
    }
    return fse.outputJson(resolve(), require(resolve(langCode || 'en')))
  }).then(() => done()).catch(done)
}

exports.copypublic = function () {
  return src(['public/**', '!public/index.html', '!public/parcel-plugins/**'])
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
              )
              done()
            })
          })
        }
      }
    }).catch(done)
  })
}

exports.default = series(
  exports.prerender,
  parallel(exports.copypublic, exports.posthtml)
)
