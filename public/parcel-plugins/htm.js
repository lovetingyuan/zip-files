const { Asset } = require('parcel-bundler')
const { JSDOM } = require('jsdom')
const he = require('he')
const { compileStyle } = require('@vue/component-compiler-utils')
const crypto = require('crypto')
const hash = val => crypto.createHash('sha256').update(val).digest('hex').slice(0, 10)
const validate = require('validate-element-name')
const babel = require('@babel/core')
const t = babel.types

// const logger = require('@parcel/logger')

const mustache = require('mustache')
mustache.tags = ['{', '}']

const DATAID = 'data-id'

const requireAttrs = {
  img: ['src'],
  video: ['src', 'poster'],
  audio: ['src'],
  source: ['src']
}

const isBinding = val => val[0] === '{' && val[val.length - 1] === '}'
const globalVars = {
  props: true, state: true, _: true, arguments: true, t: true,
  require: true, module: true, __filename: true, __dirname: true, process: true
}

function exportDefaultDeclaration (path, taggedTemplateExpression, cid) {
  const dec = path.node.declaration
  if (!t.isObjectExpression(dec)) {
    throw new Error('Component must export plain object as default.')
  }
  const findProp = key => {
    return dec.properties.findIndex(prop => {
      if (t.isIdentifier(prop.key)) {
        return prop.key.name === key
      } else if (t.isStringLiteral(prop.key)) {
        return prop.key.value === key
      }
    })
  }
  const cindex = findProp('components')
  const components = {}
  if (cindex >= 0) {
    const comps = dec.properties[cindex].value
    if (!t.isObjectExpression(comps)) {
      throw new Error('"components" in default export must be a plain object.')
    }
    comps.properties.forEach(prop => {
      if (t.isStringLiteral(prop.value)) {
        let compName
        if (t.isIdentifier(prop.key)) {
          compName = prop.key.name
        } else if (t.isStringLiteral(prop.key)) {
          const { isValid } = validate(prop.key.value)
          if (isValid) {
            compName = prop.key.value.replace(/-./g, (str) => str.slice(1).toUpperCase())
          }
        }
        if (compName && t.isStringLiteral(prop.value)) {
          if (compName in components) {
            throw new Error('Duplicated component name: ' + compName)
          }
          components[compName] = prop.value.value.trim()
        }
      }
    })
    dec.properties.splice(cindex, 1)
  }
  Object.keys(components).forEach(key => {
    const body = path.parent.body
    body.push(
      t.importDeclaration(
        [
          t.importDefaultSpecifier(t.identifier(key))
        ],
        t.stringLiteral(components[key]),
      )
    )
  })
  const stateindex = findProp('state')
  if (stateindex >= 0) {
    const stateProp = dec.properties[stateindex]
    if (t.isObjectExpression(stateProp.value)) {
      dec.properties[stateindex] = t.objectMethod(
        'method', t.identifier('state'), [],
        t.blockStatement([
          t.returnStatement(stateProp.value)
        ])
      )
    }
  }

  dec.properties.push(t.objectMethod(
    'method',
    t.identifier('view'),
    [
      t.identifier('props'),
      t.identifier('_')
    ],
    t.blockStatement(
      [
        t.returnStatement(
          typeof taggedTemplateExpression === 'string' ?
            t.taggedTemplateExpression(
              t.memberExpression(t.identifier('this'), t.identifier('h')),
              t.templateLiteral([
                t.templateElement({ raw: taggedTemplateExpression }),
              ], [])
            ) : taggedTemplateExpression
        )
      ]
    )
  ))
  path.node.declaration = t.callExpression(
    t.identifier('component'),
    [
      t.stringLiteral(cid),
      dec
    ]
  )
}

module.exports = class HtmAsset extends Asset {
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
    const dom = new JSDOM(code.trim(), {
      includeNodeLocations: true
    })
    const body = dom.window.document.body
    const script = body.querySelectorAll('script')
    if (script.length > 1) {
      throw new Error(`Component only contains no more one script tag.`)
    }
    if (script.length) {
      this.htm.script.source = script[0].textContent.trim()
      body.removeChild(script[0])
    }
    if (!this.htm.script.source) {
      this.htm.script.source = `export default {}`
    }
    this.htm.styles = [...body.querySelectorAll('style')].map(style => {
      const ret = {
        css: style.textContent.trim(),
        scoped: style.hasAttribute('scoped')
      }
      body.removeChild(style)
      return ret
    })
    this.htm.dom = dom
  }
  async transform () {
    const scoped = this._transformStyle(this.htm.styles, this.htm.componentId)
    const { body } = this.htm.dom.window.document
    this._transformTemplate(body, scoped)
    let template = body.innerHTML.trim().replace(/(data-h-[0-9a-z]+)=""/g, '$1')
    template = he.decode(template)
    const { code, map } = this._transformScript(this.htm.script.source, template, this.htm.componentId)
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
    this.htm.dom.window.close()
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
    window.dispatchEvent(new CustomEvent('__ssss_hmr__',{detail:{cid:'${this.htm.componentId}'}}))
  })
  ${this.htm.styles.length ? `
  const reloadCSS = require('_css_loader')
  module.hot.dispose(reloadCSS)
  module.hot.accept(reloadCSS)` : ''}
}`
  }
  _transformScript (code, template, cid) {
    const self = this
    const result = babel.transformSync('this.h`' + template + '`', {
      ast: true, code: false, sourceMaps: false,
      plugins: [
        function() {
          let globals
          return {
            visitor: {
              Program(path) {
                const runtimeGlobals = path.scope.constructor.globals.reduce((a, b) => {
                  a[b] = true
                  return a
                }, {})
                globals = Object.assign({}, path.scope.globals, runtimeGlobals, self.htm.components, globalVars)
              },
              Identifier (path) {
                if (typeof globals[path.node.name] !== 'object') return
                if (path.scope.hasBinding(path.node.name)) return
                if (t.isVariableDeclarator(path.parent)) {
                  if (path.key !== 'init') return
                }
                if (t.isMemberExpression(path.parent)) {
                  if (path.key === 'property' && !path.parent.computed) return
                }
                if (t.isObjectProperty(path.parent)) {
                  if (path.key === 'key' && !path.parent.computed) return
                }
                path.replaceWith(t.memberExpression(t.identifier('_'), path.node))
              }
            }
          }
        }
      ]
    })

    return babel.transform(code, {
      plugins: [
        function ({assertVersion}) { /* babel, pluginOptions, baseDir */
          assertVersion(7)
          return {
            visitor: {
              ExportDefaultDeclaration(path) {
                const taggedTemplateExpression = result.ast.program.body[0].expression
                return exportDefaultDeclaration(path, taggedTemplateExpression, cid)
              },
            }
          }
        }
      ]
    })
  }
  _transformTemplate (node, scoped) {
    if (node.tagName === 'BODY') {
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
        if (attr.name === 'data-if' || attr.name === 'data-for' || attr.name === 'data-html') {
          if (!isBinding(value)) {
            throw new Error(`"${attr.name}" attribute value "${value}" should be binding value, ` + node.outerHTML)
          }
          let _value = value.slice(1, -1).trim()
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
              (isBinding(value) ? `(${value.slice(1, -1)||null})` : JSON.stringify(value))
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
        const location = this.htm.dom.nodeLocation(node)
        const id = hash(this.name + node.tagName + JSON.stringify(location))
        const compName = node.tagName.toLowerCase()
        const localCompName = compName.replace(/-./g, (str) => str.slice(1).toUpperCase())
        this.htm.components[localCompName] = true
        node.textContent = `\${this.c({${attrsList}},typeof ${localCompName}==='object'?${localCompName}.id:'${compName}')}`
        node.setAttribute(DATAID, `\${this.i('${id}',arguments[1])}`)
      } else {
        // note that nodeList is dynamic
        ;[...node.childNodes].forEach(child => this._transformTemplate(child, scoped))
      }
    } else if (node.nodeType === 3) {
      if (node.parentElement && node.parentElement.hasAttribute('data-html')) {
        node.textContent = `\${this.ih(${node.textContent})}`
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
      node.remove()
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
