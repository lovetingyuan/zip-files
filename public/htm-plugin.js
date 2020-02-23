const { Asset } = require('parcel-bundler')

try {
  const xhrUtilsPatch = require('jsdom/lib/jsdom/living/xhr/xhr-utils')
  const originValidCORSHeaders = xhrUtilsPatch.validCORSHeaders
  xhrUtilsPatch.validCORSHeaders = function validCORSHeaders (xhr, response) {
    response.headers['access-control-allow-origin'] = '*'
    response.headers['access-control-allow-credentials'] = 'true'
    return originValidCORSHeaders.apply(this, arguments)
  }
} catch (err) {}

const { JSDOM, VirtualConsole, ResourceLoader } = require('jsdom')
const fse = require('fs-extra')
const filepath = require('path')
const findCacheDir = require('find-cache-dir')
const express = require('express')
const he = require('he')
const { compileStyle } = require('@vue/component-compiler-utils')
const crypto = require('crypto')
const validate = require('validate-element-name')
const babel = require('@babel/core')
const mustache = require('mustache')
const logger = require('@parcel/logger')

const hash = val => crypto.createHash('sha256').update(val).digest('hex').slice(0, 10)
const t = babel.types
const cacheDir = findCacheDir({ name: 'parcel-plugin-htm', create: true })
mustache.tags = ['{', '}']

const requireAttrs = {
  img: ['src'],
  video: ['src', 'poster'],
  audio: ['src'],
  source: ['src']
}

const isBinding = val => val[0] === '{' && val[val.length - 1] === '}'
const isDirective = val => /^data-(if|else|for|html|value)$/.test(val)

const reservedVars = ['$', '_', 't']
const STATE_NAME = 'state'

class HtmAsset extends Asset {
  constructor (name, options) {
    super(name, options)
    this.type = 'js'
    this.htm = {
      dom: null,
      styles: [],
      components: {},
      script: {
        source: '',
        result: '',
        map: null
      },
      componentId: hash(this.name)
    }
  }

  async parse (code) {
    this.htm.sourceCode = code
    this.htm.codeOffset = code.slice(0, code.indexOf('<script>')).split(/\r?\n/g).length
    const body = JSDOM.fragment(code.trim())
    const script = body.querySelectorAll('script')
    if (script.length > 1) {
      throw new Error('Component only contains no more one script tag.')
    }
    if (script.length) {
      this.htm.script.source = script[0].textContent.trim()
      body.removeChild(script[0])
    }
    if (!this.htm.script.source) {
      this.htm.script.source = 'export default {}'
    }
    this.htm.styles = [...body.querySelectorAll('style')].map(style => {
      const ret = {
        css: style.textContent.trim(),
        scoped: style.hasAttribute('scoped')
      }
      body.removeChild(style)
      return ret
    })
    this.htm.dom = body
  }

  async transform () {
    const scoped = this._transformStyle(this.htm.styles, this.htm.componentId)
    const body = this.htm.dom
    this._transformTemplate(body, scoped)
    let template = [...body.childNodes].map(node => {
      if (node.nodeType === 1) {
        return node.outerHTML
      }
      if (node.nodeType === 3) {
        return node.textContent
      }
      return ''
    }).join('')
    template = he.decode(template)
    const { code, map } = await this._transformScript(this.htm.script.source, template, this.htm.componentId)
    this.htm.script.result = code
    this.htm.script.map = map
  }

  async generate () {
    const parts = []
    if (this.htm.styles.length) {
      parts.push({
        type: 'css',
        value: this.htm.styles.map(v => v.css).join('\n')
      })
    }
    let { result, map } = this.htm.script
    if (this.options.hmr) {
      result = result + '\n' + this._genHMR()
    }
    parts.push({ // must place js code in the end.
      type: 'js',
      value: result,
      map: this.options.sourceMaps ? map : undefined
    })
    if (process.env.SHOW_CODE) {
      console.log()
      console.log(this.name)
      console.log(result)
      console.log()
    }
    return parts
  }

  _genHMR () {
    return `
/* hot reload */
if (module.hot) {
  module.hot.accept(() => {
    window.dispatchEvent(new CustomEvent('__ssb_hmr__',{detail:{cid:'${this.htm.componentId}'}}))
  })
  ${this.htm.styles.length ? `
  const reloadCSS = require('_css_loader')
  module.hot.dispose(reloadCSS)
  module.hot.accept(reloadCSS)` : ''}
}`
  }

  _transformTagTemplate (template, stateVars) {
    const hasState = stateVars && Object.keys(stateVars).length > 0
    // if (!hasState) {
    //   return t.taggedTemplateExpression(
    //     t.memberExpression(t.identifier('this'), t.identifier('h')),
    //     t.templateLiteral([
    //       t.templateElement({ raw: template })
    //     ], [])
    //   )
    // }
    let scopeGlobals = null
    const filename = this.name
    const visitor = {
      Program (path) {
        scopeGlobals = path.scope.globals
        fse.writeFileSync(filepath.join(cacheDir, hash(filename) + '.json'), JSON.stringify({
          file: filename,
          bindings: Object.keys(scopeGlobals)
        }))
      },
      Identifier (path) { // auto bind state and scope variables in template
        if (!hasState) return
        const name = path.node.name
        if (
          !(name in scopeGlobals) ||
          path.scope.hasBinding(name)
        ) return
        if (t.isVariableDeclarator(path.parent)) {
          if (path.key !== 'init') return
        }
        if (t.isMemberExpression(path.parent)) {
          if (path.key === 'property' && !path.parent.computed) return
        }
        if (t.isObjectProperty(path.parent)) {
          if (path.key === 'key' && !path.parent.computed) return
        }
        if (!(name in stateVars)) return
        path.replaceWith(t.memberExpression(t.identifier(stateVars[name]), path.node))
      }
    }
    const result = babel.transformSync('this.h`' + template + '`', {
      ast: true,
      code: false,
      sourceMaps: false,
      configFile: false,
      babelrc: false,
      plugins: [() => ({ visitor })]
    })
    return result.ast.program.body[0].expression
  }

  _transformScript (code, template, cid) {
    const offset = this.htm.codeOffset
    const stateVars = {}
    let templateNode = null
    let hookName
    const getTemplateLiteral = this._transformTagTemplate.bind(this, template)
    const findEDD = (path, depth) => {
      let p = path
      try {
        for (let i = 0; i < depth; (i++, p = p.parentPath));
      } catch (err) {
        return false
      }
      return p && t.isExportDefaultDeclaration(p.node)
    }
    let scopeName
    const visitor = {
      Program: {
        enter (path) {
          const hasDefaultExport = path.node.body.some(node => t.isExportDefaultDeclaration(node))
          if (!hasDefaultExport) {
            path.pushContainer('body', t.exportDefaultDeclaration(
              t.functionDeclaration(null, [], t.blockStatement([]))
            ))
          }
        }
      },
      ExportDefaultDeclaration (path) {
        if (!t.isFunctionDeclaration(path.node.declaration)) return
        const { id, params, body } = path.node.declaration
        path.node.declaration = t.callExpression(
          t.identifier('component'),
          [
            t.stringLiteral(cid),
            t.functionExpression(id, params, body)
          ]
        )
      },
      ReturnStatement (path) {
        if (findEDD(path, 4) && path.node.argument !== templateNode) {
          path.remove()
        }
      },
      FunctionExpression: {
        exit (path) { // wait stateVars to be filled.
          if (!findEDD(path, 2)) return
          templateNode = getTemplateLiteral(stateVars)
          path.get('body').pushContainer('body', t.returnStatement(templateNode))
          if (scopeName) {
            path.get('body').unshiftContainer('body', t.variableDeclaration('const', [
              t.variableDeclarator(t.identifier(scopeName), t.objectExpression([]))
            ]))
          }
        }
      },
      VariableDeclaration (path) {
        if (!findEDD(path, 4)) return
        if (path.node.kind !== 'const') return
        const declarator = path.node.declarations[0]
        if (!t.isVariableDeclarator(declarator)) return
        if (!t.isIdentifier(declarator.id) || declarator.id.name !== STATE_NAME) return
        if (hookName) return
        hookName = path.scope.generateUid('$')
        if (!t.isObjectExpression(declarator.init)) {
          throw new Error('const state variable declarator must be object literal.')
        }
        declarator.init.properties.forEach(prop => {
          if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
            if (reservedVars.includes(prop.key.name)) {
              throw new Error(`"${prop.key.name}" is a reserved variable name, can not be used in state.`)
            }
            stateVars[prop.key.name] = STATE_NAME
          }
        })
        declarator.id = t.arrayPattern(
          [
            t.identifier(STATE_NAME),
            t.identifier(hookName)
          ]
        )
        declarator.init = t.callExpression(
          t.memberExpression(t.thisExpression(), t.identifier('im')),
          [declarator.init]
        )
      },
      AssignmentExpression (path) {
        if (path.node.operator !== '=') return
        if (!findEDD(path, 5)) return
        if (
          t.isMemberExpression(path.node.left) &&
          t.isThisExpression(path.node.left.object) &&
          !path.node.left.computed &&
          t.isIdentifier(path.node.left.property)
        ) {
          if (path.node.left.property.name === 'onload') {
            path.replaceWith(t.callExpression(
              t.memberExpression(t.thisExpression(), t.identifier('ef')),
              [path.node.right]
            ))
          }
        }
      },
      LabeledStatement (path) {
        if (path.node.label.name !== '$') {
          const line = path.node.loc.start.line + offset
          throw new Error(`Unexpected labeled statement: "${path.node.label.name}" at line ${line}.`)
        }
        if (!hookName) {
          throw new Error('state must be initialized before using "$" label statement.')
        }
        path.replaceWith(t.callExpression(t.identifier(hookName), [
          t.arrowFunctionExpression(
            [t.identifier(STATE_NAME)],
            t.isExpressionStatement(path.node.body) ? t.blockStatement([path.node.body]) : path.node.body
          )
        ]))
      }
    }
    return babel.transformAsync(code, {
      sourceMaps: this.options.sourceMaps,
      sourceFileName: this.relativeName, // cry...
      configFile: false,
      babelrc: false,
      plugins: [({ assertVersion }) => { /* babel, pluginOptions, baseDir */
        assertVersion(7)
        return { visitor }
      }]
    })
  }

  _transformTemplate (node, scoped) {
    if (node.nodeType === 11) { // fragment
      ;[...node.childNodes].forEach(child => this._transformTemplate(child, scoped))
    } else if (node.nodeType === 1) {
      const { isValid: isComponent } = validate(node.tagName.toLowerCase())
      if (!isComponent && scoped) {
        node.setAttribute('data-h-' + this.htm.componentId, '')
      }
      const attrs = [...node.attributes]
      let ifDirective
      let forDirective
      const tag = node.tagName.toLowerCase()
      const attrsList = []
      attrs.forEach(attr => {
        const value = attr.value.trim()
        if (isDirective(attr.name)) {
          const _value = isBinding(value) ? value.slice(1, -1).trim() : value
          if (!_value) {
            throw new Error(`${attr.name} can not be empty value, ` + node.outerHTML)
          }
          if (attr.name === 'data-if') {
            ifDirective = _value
            let elseNode = node.nextSibling
            if (elseNode && elseNode.nodeType === 3 && !elseNode.textContent.trim()) { // ignore blank text node
              elseNode = elseNode.nextSibling
            }
            if (elseNode && elseNode.nodeType === 1 && elseNode.hasAttribute('data-else')) {
              const elseValue = elseNode.getAttribute('data-else').trim()
              if (elseValue) {
                throw new Error('data-else must be empty at ' + node.outerHTML)
              }
              elseNode.removeAttribute('data-else')
              elseNode.setAttribute('data-if', `{!(${ifDirective})}`)
            }
          } else if (attr.name === 'data-for') {
            forDirective = _value.split(',').map(v => v.trim())
            if (forDirective.length < 2) {
              throw new Error(`"data-for" must offer two patameters at least but got "${value}", ` + node.outerHTML)
            }
          } else if (attr.name === 'data-else') {
            throw new Error('Missing data-if matched for data-else at ' + node.outerHTML)
          } else if (attr.name === 'data-value') {
            if (tag === 'input') {
              node.setAttribute('value', `\${${_value}}`)
              node.setAttribute('oninput', `\${e=>{this.cb((state)=>{${_value}=e.target.value})}}`)
            }
          } else {
            node.textContent = _value
          }
          if (attr.name !== 'data-html') {
            node.removeAttribute(attr.name)
          }
        } else {
          if (isComponent) {
            attrsList.push(
              attr.name.replace(/-([a-zA-Z0-9])/g, (_, str) => str.toUpperCase()) + ':' +
              (isBinding(value) ? `(${value.slice(1, -1) || null})` : JSON.stringify(value))
            )
            if (!attr.name.startsWith('data-')) {
              node.removeAttribute(attr.name)
            }
          } else {
            if (requireAttrs[tag] && requireAttrs[tag].includes(attr.name)) {
              if (value[0] === '~') {
                attr.value = `\${require('${value.slice(1)}')}`
              } else if (isBinding(value)) {
                attr.value = '$' + value
              }
            } else if (isBinding(value)) {
              if (attr.name === 'class') {
                attr.value = `\${this.cn(${value.slice(1, -1)})}`
              } else {
                attr.value = '$' + value
              }
            }
          }
        }
      })
      if (ifDirective && forDirective) {
        const [list, val, index] = forDirective
        const params = typeof index === 'undefined' ? `(${val})` : `(${val},${index})`
        node.insertAdjacentText('beforebegin', `\${(${list}).filter(${params}=>(${ifDirective})).map(function${params}{return this.h\``)
        node.insertAdjacentText('afterend', '`}, this)}')
      } else if (ifDirective) {
        node.insertAdjacentText('beforebegin', `\${(${ifDirective})?this.h\``)
        node.insertAdjacentText('afterend', '`:this.h` `}')
      } else if (forDirective) {
        const [list, val, index] = forDirective
        const params = typeof index === 'undefined' ? `(${val})` : `(${val},${index})`
        node.insertAdjacentText('beforebegin', `\${${list}.map(function${params}{return this.h\``)
        node.insertAdjacentText('afterend', '`}, this)}')
      }
      if (isComponent) {
        // const location = this.htm.dom.nodeLocation(node)
        // const id = hash(this.name + node.tagName + JSON.stringify(location))
        const compName = node.tagName.toLowerCase()
        const localCompName = compName.replace(/-./g, (str) => str.slice(1).toUpperCase())
        node.textContent = `\${this.c(typeof ${localCompName}==='function'?${localCompName}.id:null)}`
        node.setAttribute('props', `\${this.p={${attrsList}}}`)
        if (this.options.hmr) {
          node.setAttribute('data-comp-id', `\${typeof ${localCompName}==='function'?${localCompName}.id:''}`)
        }
      } else {
        // note that nodeList is dynamic
        ;[...node.childNodes].forEach(child => this._transformTemplate(child, scoped))
      }
    } else if (node.nodeType === 3) {
      if (node.parentElement && node.parentElement.hasAttribute('data-html')) {
        node.textContent = `\${{html:${node.textContent}}}`
        node.parentElement.removeAttribute('data-html')
      } else {
        const production = process.env.NODE_ENV === 'production'
        if (production) {
          const text = node.textContent
          if (!text) {
            node.textContent = ' '
          } else {
            node.textContent = mustache.parse(text).map(([type, value]) => {
              return type === 'text' ? value.replace(/\s{2,}/g, ' ') : `\${${value.trim()}}`
            }).join('')
          }
        } else {
          node.textContent = mustache.parse(node.textContent)
            .map(([type, value]) => type === 'text' ? value : `\${${value}}`).join('')
        }
      }
    } else if (node.nodeType === 8) { // comment
      if (process.env.NODE_ENV === 'production') {
        node.remove()
      }
    }
  }

  _transformStyle (styles, scopeId) {
    let scoped = false
    styles.map(style => {
      if (style.scoped) {
        scoped = true
        const { code, errors } = compileStyle({
          source: style.css,
          filename: this.name,
          id: `data-h-${scopeId}`,
          scoped: true,
          trim: true
        })
        if (errors && errors.length) {
          throw new Error(`Component "${this.name}" style transform failed, ${errors}.`)
        }
        style.css = code
      }
      return style
    })
    return scoped
  }
}

const pkg = require('../package.json')
if (!pkg.config) {
  pkg.config = {}
}

function printbuiltinfo (doc) {
  const script = doc.createElement('script')
  /* eslint-disable */
  const builtimefunc = function () {
    var v = BUILTIME;
    var d = new Date(v[0]);
    var s = [d.getFullYear(), '/', d.getMonth() + 1, '/', d.getDate(), ' ', d.getHours(), ':', d.getMinutes()];
    var t = document.querySelector('meta[name="theme-color"]');
    console.log(
      '%c' + v[1] + '(' + v[2] + '): ' + s.join('') + ' ' + v[3],
      'background:'+ (t ? t.content : 'lightseagreen') + ';color:#fff;padding:2px 10px;border-radius:2px;'
    );
  }
  /* eslint-enable */
  script.textContent = `setTimeout(${builtimefunc.toString().replace(
    'BUILTIME', JSON.stringify([
      Date.now(),
      process.env.npm_package_name,
      process.env.npm_package_version,
      require('git-rev-sync').short(null, 10)
    ])
  ).replace(/\s{2,}/mg, ' ')})`
  doc.body.appendChild(script)
}

function injectserviceworker (doc, distDir, rootDir) {
  const swfilename = 'sw.js'
  const publicPath = pkg.config.publicPath || '/'
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
  let swcode = fse.readFileSync(require.resolve('../src/js/sw.js'), 'utf8')
  const walkDir = (base, dirs = [], list = []) => {
    const dirpath = filepath.join(base, ...dirs)
    fse.readdirSync(dirpath).forEach(f => {
      if (f[0] === '.') return
      const file = filepath.join(dirpath, f)
      const isDirectory = fse.statSync(file).isDirectory()
      isDirectory ? walkDir(base, dirs.concat(f), list) : list.push(filepath.join(...dirs, f))
    })
    return list
  }
  const cacheFileList = Array.from(new Set([
    publicPath + '?source=pwa',
    ...walkDir(rootDir),
    ...walkDir(distDir)
  ].filter(f => {
    if (/(runtime|htm-plugin)\.js$/.test(f)) return false
    if (/^icon-.+\.png$/.test(f)) return false
    if (f.endsWith('.map')) return false
    return true
  })))
  swcode = swcode.replace('CACHE_LIST', JSON.stringify(cacheFileList))
    .replace('APP_NAME', JSON.stringify(pkg.name))
    .replace('APP_VERSION', JSON.stringify(pkg.version))
  fse.outputFileSync(filepath.join(distDir, swfilename), swcode)
}

function preloadandinline (doc, distDir) {
  const inlineSize = pkg.config.inlineSize || 10000
  const resolve = f => filepath.join(distDir, f)
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

function copycleandist (rootDir, outDir) {
  const ignoreCopy = [
    'htm-plugin.js', 'runtime.js', 'index.html'
  ]
  fse.copySync(rootDir, outDir, {
    filter: src => !(ignoreCopy.some(f => src.endsWith(f)))
  })
  fse.readdirSync(outDir).forEach(file => {
    if (/^icon-.+\.png$/.test(file)) {
      fse.removeSync(filepath.join(outDir, file))
    }
  })
}

function prerender (outDir) {
  const _ignoreReq = new RegExp('google-analytics')
  class CustomResourceLoader extends ResourceLoader {
    fetch (url, options) {
      if (_ignoreReq.test(url)) {
        return Promise.resolve(Buffer.from(''))
      }
      return super.fetch(url, options)
    }
  }
  const app = express()
  app.use(express.static(outDir))
  const port = process.env.PORT || 4200
  const server = app.listen(port, (err) => {
    if (err) {
      throw new Error('prerender error: ' + err.message)
    }
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
          const appContentReg = /<!--\[if APP-START\]><!\[endif\]-->[\s\S]+?<!--\[if APP-END\]><!\[endif\]-->/m
          const indexfilepath = filepath.join(outDir, 'index.html')
          fse.writeFileSync(
            indexfilepath,
            fse.readFileSync(indexfilepath, 'utf8').replace(appContentReg, rendered)
          )
          try {
            window.close() // if there are remaining async tasks, window close may throw error.
          } catch (err) {} finally {
            server.close()
          }
        }
      }
    }).catch(err => {
      throw new Error('prerender error, ' + err.message)
    })
  })
}

function lint () {
  const noUnusedVarsRule = require('eslint/lib/rules/no-unused-vars')
  const { create } = noUnusedVarsRule
  noUnusedVarsRule.create = function (context) {
    const filename = context.getFilename()
    let templateBinding
    try {
      templateBinding = require(filepath.join(cacheDir, hash(filename) + '.json'))
    } catch (err) {}
    function report (info) {
      if (isHtm && templateBinding && info.node.type === 'Identifier') {
        if (templateBinding.bindings.some(v => info.node.name === v)) return
      }
      return context.report.call(this, info)
    }
    const isHtm = filename.endsWith('.htm')
    const ctx = Object.keys(context).reduce((ctx, key) => {
      if (key === 'report') {
        Object.defineProperty(ctx, key, Object.assign(Object.getOwnPropertyDescriptor(context, key), {
          value: report
        }))
      } else {
        Object.defineProperty(ctx, key, Object.getOwnPropertyDescriptor(context, key))
      }
      return ctx
    }, Object.create(Object.getPrototypeOf(context)))
    return create.call(this, ctx)
  }

  process.argv = [null, null, '--plugins', 'html', '--fix', './src/**/*.{js,htm}']
  require('standardx/bin/cmd')
}

function postPlugin (bundler) {
  bundler.on('bundled', (bundle) => {
    const { rootDir, outDir, production } = bundler.options
    if (bundle.type === 'html' && bundle.entryAsset.basename === 'index.html') {
      const data = fse.readFileSync(bundle.name, 'utf8')
      const dom = new JSDOM(data)
      printbuiltinfo(dom.window.document)
      if (production) {
        injectserviceworker(dom.window.document, outDir, rootDir)
        preloadandinline(dom.window.document, outDir)
        copycleandist(rootDir, outDir)
        fse.writeFileSync(bundle.name, dom.serialize())
        logger.log('start to prerender...')
        prerender(outDir)
        logger.log('standardx lint...')
        lint()
      }
    }
  })
}

module.exports = function (bundler) {
  if (typeof bundler === 'object') {
    bundler.addAssetType('htm', __filename)
    postPlugin(bundler)
  } else {
    return new HtmAsset(...arguments)
  }
}
