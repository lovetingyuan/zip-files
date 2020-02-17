const path = require('path')
const fse = require('fs-extra')

const { src, dest, series, parallel } = require('gulp')
const through2 = require('through2')
const { JSDOM, VirtualConsole, ResourceLoader } = require('jsdom')
const pkg = require('./package.json')
if (!pkg.config) {
  pkg.config = {}
}

const distDir = path.join(__dirname, pkg.config.dist || 'dist')

exports.clean = function () {
  return fse.readdir(distDir).then(files => {
    const removedfiles = files
      .filter(f => /^icon-\S+?[0-9a-z]{8}\.png$/.test(f))
      .map(f => path.join(distDir, f))
    return Promise.all(removedfiles.map(f => fse.remove(f)))
  })
}

exports.copypublic = function () {
  return src(['public/**/*', '!public/index.html', '!public/htm-plugin.js', '!public/runtime.js'])
    .pipe(dest(distDir))
}

exports.posthtml = function () {
  const indexfilepath = path.join(distDir, 'index.html')
  return src(indexfilepath)
    .pipe(through2.obj(function (file, _, cb) {
      if (!file.isBuffer()) throw file
      const dom = new JSDOM(file.contents.toString())
      file.contents = Buffer.from(dom.serialize())
      cb(null, file)
    }))
    .pipe(dest(distDir))
}

exports.prerender = function (done) {
  if (!pkg.config.prerender) return done()
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
    const xhrUtilsPatch = require('jsdom/lib/jsdom/living/xhr/xhr-utils')
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
  const server = app.listen(port, (err) => {
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
        window.__prerender__ = function (rendered) {
          const indexfilepath = path.join(distDir, 'index.html')
          const appContentReg = /<!--\[if APP-START\]><!\[endif\]-->[\s\S]+?<!--\[if APP-END\]><!\[endif\]-->/m
          fse.writeFileSync(
            indexfilepath,
            fse.readFileSync(indexfilepath, 'utf8').replace(appContentReg, rendered)
          )
          try {
            window.close() // if there are remaining async tasks, window close may throw error.
          } catch (err) {} finally {
            server.close(done)
          }
        }
      }
    }).catch(done)
  })
}

exports.lint = function (done) {
  const { linter } = require('standard-engine')
  const _lintFiles = linter.prototype.lintFiles
  const { getTemplateBindingsFromCache } = require('./public/htm-plugin')
  linter.prototype.lintFiles = function lintFiles (files, opts, cb) {
    return _lintFiles.call(this, files, opts, function (err, result) {
      let totalIgnoreErrCount = 0
      if (err) return done(err)
      result.results.forEach(ret => {
        let ignoreErrCount = 0
        const templateBinding = getTemplateBindingsFromCache(ret.filePath)
        if (!templateBinding) return true
        ret.messages = ret.messages.filter(msg => {
          if (msg.ruleId === 'no-unused-vars' && msg.nodeType === 'Identifier') {
            const code = msg.source.substr(msg.column - 1)
            if (templateBinding.bindings.some(variable => code.startsWith(variable))) {
              if (msg.severity === 2) {
                ignoreErrCount++
              }
              return false
            }
          }
          return true
        })
        ret.errorCount -= ignoreErrCount
        totalIgnoreErrCount += ignoreErrCount
      })
      result.errorCount = result.errorCount - totalIgnoreErrCount
      setTimeout(() => {
        done(result.errorCount > 0 ? 'standard lint failed.' : null)
      })
      return cb(err, result)
    })
  }
  process.argv = [null, null, './src/**/*.{js,htm}', '--plugins', 'html', '--fix']
  require('standardx/bin/cmd')
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
  exports.prerender
)
