import { neverland as $, render, html, useState, useCallback, useEffect } from 'neverland'
import produce from 'immer'
import classNames from 'classnames'

;(function () {
  var method
  var noop = function () {}
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
  ]
  var length = methods.length
  var console = (window.console = window.console || {})

  while (length--) {
    method = methods[length]

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop
    }
  }
}())

const components = Object.create(null)

window.component = function component (id, comp) {
  const stateless = comp.length > 1
  comp = comp.bind(context)
  comp = stateless ? comp : $(comp)
  return components[comp.id = id] = comp // eslint-disable-line
}

const context = {
  h: html,
  cn: classNames,
  ef: useEffect,
  im (state) {
    const [val, updateValue] = useState(state)
    const callback = useCallback(updater => {
      updateValue(produce(updater))
    }, [])
    this.cb = callback
    return [val, callback]
  },
  c (id, props = context.p) {
    if (!id) return
    return components[id](Object.freeze(props))
  }
}

let translation = Object.create(null)
const transReg = /\{\{([^{}]+)?\}\}/g
const tagReg = /<[a-zA-Z_][^>]*>/ // maybe contain tag

window.startApp = function startApp ({ target, component, i18n }) {
  const container = typeof target === 'string' ? document.querySelector(target) : target
  translation = i18n || {}
  render.call(context, container, component)
  window.__prerender__ && setTimeout(window.__prerender__.bind(null, container.outerHTML))
}

if (process.env.NODE_ENV !== 'production' && module.hot) {
  window.addEventListener('__ssb_hmr__', (evt) => {
    const { cid } = evt.detail
    try {
      document.querySelectorAll(`[data-comp-id="${cid}"]`).forEach(compDom => {
        render.call(context, compDom, components[cid](compDom.props))
      })
    } catch (err) {
      console.warn('hot-reload error: ', err)
      window.location.reload()
    }
  })
}

window.t = function t (key, param = {}) {
  if (!(key in translation)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`i18n: translation key "${key}" is missing.`)
    }
    return key
  }
  const result = translation[key].replace(transReg, (s, v) => {
    v = v.trim()
    if (!v) return ''
    if (!(v in param)) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`i18n: param ${v} is missed for translation ${key}, ${translation[key]}.`)
      }
      return ''
    }
    return param[v]
  })
  return tagReg.test(result) ? { html: result } : result
}
