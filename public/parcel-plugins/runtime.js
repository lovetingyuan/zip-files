import { html, render } from 'lighterhtml'
import { reaction, observable, action } from 'mobx'
import classNames from 'classnames'

const transReg = /\{\{([^{}]+)?\}\}/g
const tagReg = /<[a-zA-Z_][^>]*>/ // maybe contain tag

const components = Object.create(null)

class IH {
  constructor (str) {
    this.html = str
  }

  toString () { return this.html }
}

let _id = ''
let $id = ''
const DATAID = 'data-id'

class Runtime {
  cn (...args) {
    return classNames(...args)
  }

  i (val, index) {
    const forIndex = (typeof index === 'number' ? '-' + index : '')
    if ($id) {
      const $$id = $id.slice(0, $id.lastIndexOf('-')) // handle for data-for
      if ($$id.endsWith(val)) {
        _id = $$id + forIndex
      } else {
        _id = $id + '_' + val + forIndex
      }
    } else {
      _id = val + forIndex
    }
    return _id
  }

  c (originalProps, cid) {
    if (this._string) {
      return JSON.stringify(originalProps) + Object.keys(originalProps)
    }
    const vmid = _id
    const props = {}
    const self = this

    Object.freeze(originalProps)
    Object.keys(originalProps).forEach(key => {
      Object.defineProperty(props, key, {
        get () {
          return self.vms[vmid].originalProps[key]
        },
        enumerable: true
      })
    })
    this.vms[vmid] = this.vms[vmid] || {}
    this.vms[vmid].cid = cid
    this.vms[vmid].props = props
    this.vms[vmid].originalProps = originalProps

    const { view, state, data } = components[cid]
    if (!state) {
      $id = vmid
      return view.call(this, props, null, data)
    } else if (!this._init) {
      // delay to render, because dom is not accessible right now.
      Promise.resolve(vmid).then(id => this.update(id))
    }
  }

  h (strs, ...vals) {
    if (!this._string) {
      return html(strs, ...vals)
    }
    return strs.map((v, i) => v + (i < vals.length ? vals[i] : '')).join('')
  }

  ih (innerhtml) {
    return new IH(innerhtml)
  }
}

class Context extends Runtime {
  constructor () {
    super()
    this.vms = Object.create(null)
  }

  getState (vmid) {
    const { props, cid } = this.vms[vmid]
    const { state: createState } = components[cid]
    const data = createState(props)
    Object.keys(data).forEach(key => {
      const property = Object.getOwnPropertyDescriptor(data, key)
      if (typeof property.get !== 'function' && typeof data[key] === 'function') {
        const method = data[key]
        if (key[0] !== '$') {
          data[key] = action((...args) => method.call(state, ...args))
        }
      }
    })
    const state = observable(data)
    return state
  }

  reactive (vmid, data) {
    const { unreaction, cid } = this.vms[vmid]
    const { view, data: staticData } = components[cid]

    unreaction && unreaction()
    this.vms[vmid].data = data || this.getState(vmid)

    this.vms[vmid].unreaction = reaction(() => {
      this._string = true
      $id = vmid
      const { props, data: state } = this.vms[vmid]
      const a = view.call(this, props, state, staticData)
      this._string = false
      return a
    }, () => {
      this.update(vmid)
    }, {
      delay: 10
    })

    return this.vms[vmid].data
  }

  update (vmid) {
    const dom = document.querySelector(`[${DATAID}="${vmid}"]`)
    if (!dom) {
      if (this.vms[vmid]) {
        const { unreaction } = this.vms[vmid]
        unreaction && unreaction()
        delete this.vms[vmid]
      }
      return
    }
    const oldChildren = {}
    dom.querySelectorAll('[' + DATAID + ']').forEach(d => {
      oldChildren[d.dataset.id] = true
    })
    render.call(this, dom, () => {
      let { props, data, cid } = this.vms[vmid]
      const { view, state, data: staticData } = components[cid]
      if (!data && state) {
        data = this.reactive(vmid)
      }
      $id = vmid
      return view.call(this, props, data, staticData)
    })

    dom.querySelectorAll('[' + DATAID + ']').forEach(child => {
      const { id } = child.dataset
      if (oldChildren[id]) { // updated
        oldChildren[id] = false
      } else {
        // new add component
      }
    })
    // clear removed components
    Object.keys(oldChildren).forEach(id => {
      if (oldChildren[id]) { // removed
        const { unreaction } = this.vms[id]
        unreaction && unreaction()
        delete this.vms[id]
      }
    })
  }

  render (node) {
    const vmid = node.dataset.id
    const { props, cid, root } = this.vms[vmid]
    const { state, view, data: staticData } = components[cid]
    if (state) {
      const data = this.reactive(vmid)
      render.call(this, node, () => {
        $id = vmid
        return view.call(this, props, data, staticData)
      })
    } else if (root) {
      render.call(this, node, () => view.call(this, props, null, staticData))
    }
    node.querySelectorAll('[' + DATAID + ']').forEach(d => this.render(d))
  }

  i18n (trans) {
    this._translation = trans || {}
    window.t = (key, param = {}) => {
      if (!(key in this._translation)) {
        console.warn(`i18n: translation key missing, "${key}" is not found.`)
        return key
      }
      const result = this._translation[key].replace(transReg, (s, v) => {
        v = v.trim()
        if (!v) return ''
        if (!(v in param)) {
          console.warn(`i18n: param ${v} is missed for translation ${key}, ${this._translation[key]}.`)
          return ''
        }
        return param[v]
      })
      return tagReg.test(result) ? new IH(result) : result
    }
  }

  hotUpdate (cid) {
    const { state } = components[cid]
    state && Object.keys(this.vms).forEach(id => {
      if (!this.vms[id]) return
      if (this.vms[id].cid !== cid) return
      const { data, props } = this.vms[id]
      const newState = state(props)
      Object.keys(newState).forEach(key => {
        const property = Object.getOwnPropertyDescriptor(newState, key)
        if (typeof property.get !== 'function') {
          if (typeof newState[key] === 'function') {
            const method = newState[key]
            if (key[0] !== '$') {
              newState[key] = action((...args) => method.call(newData, ...args))
            }
          } else if (data) {
            newState[key] = data[key]
          }
        }
      })
      const newData = observable(newState)
      this.reactive(id, newData)
      this.update(id)
    })
    Object.keys(this.vms).forEach(id => {
      if (!document.querySelector(`[data-id="${id}"]`)) {
        const { unreaction } = this.vms[id]
        unreaction && unreaction()
        delete this.vms[id]
      }
    })
  }

  mount (container, rootComponent) {
    if (typeof container === 'string') {
      container = document.querySelector(container)
    }
    const componentIds = Object.keys(components)
    let rootId = 'app-root'
    for (const id of componentIds) {
      if (components[id] === rootComponent) {
        rootId = id
        break
      }
    }
    this.i(container.dataset.id = rootId)
    this.vms[_id] = {
      props: null,
      cid: rootId,
      root: true
    }
    this._init = true
    this.render(container)
    this._init = false
    return container
  }
}

window.component = function component (id, comp) {
  Object.defineProperty(comp, 'id', { value: id })
  components[id] = Object.freeze(comp)
  return components[id]
}

window.startApp = function startApp ({ component, target, i18n }) {
  const context = new Context()
  if (i18n) {
    context.i18n(i18n)
  }
  const container = context.mount(target, component.default || component)
  window.__prerender__ && setTimeout(() => {
    window.__prerender__(container.outerHTML)
  })
  if (process.env.NODE_ENV === 'development') {
    window.context = context
    if (module.hot) {
      window.addEventListener('__ssss_hmr__', (evt) => {
        try {
          context.hotUpdate(evt.detail.cid)
        } catch (err) {
          console.warn('hot-reload error: ', err)
          window.location.reload()
        }
      })
    }
    if (process.env.CHECK_ASSERT) {
      setInterval(() => {
        console.assert(Object.keys(context.vms).length === document.querySelectorAll('[' + DATAID + ']').length)
      }, 10)
    }
    return context
  }
}
