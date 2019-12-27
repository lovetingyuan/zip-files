import { neverland as $, render, html, useState, useCallback, useEffect } from 'neverland'
import produce from 'immer'
import classNames from 'classnames'

function useImmer (state) {
  const [val, updateValue] = useState(state)
  return [val, useCallback(updater => {
    updateValue(produce(updater))
  }, [])]
}

const components = {}
window.component = function component (id, comp) {
  const stateless = comp.length > 1
  comp = comp.bind(context)
  comp = stateless ? comp : $(comp)
  return components[comp.id = id] = comp // eslint-disable-line
}

const context = {
  h: html,
  cn: classNames,
  im: useImmer,
  ef: useEffect,
  c (id, props = context.p) {
    if (!id) return
    return components[id](Object.freeze(props))
  }
}

let translation = {}
const transReg = /\{\{([^{}]+)?\}\}/g
const tagReg = /<[a-zA-Z_][^>]*>/ // maybe contain tag

window.startApp = function startApp ({ target, component, i18n }) {
  const container = typeof target === 'string' ? document.querySelector(target) : target
  translation = i18n || {}
  render.call(context, container, component)
  window.__prerender__ && setTimeout(window.__prerender__.bind(null, container.outerHTML))
  if (module.hot) {
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
}

window.t = function t (key, param = {}) {
  if (!(key in translation)) {
    console.warn(`i18n: translation key "${key}" is missing.`)
    return key
  }
  const result = translation[key].replace(transReg, (s, v) => {
    v = v.trim()
    if (!v) return ''
    if (!(v in param)) {
      console.warn(`i18n: param ${v} is missed for translation ${key}, ${translation[key]}.`)
      return ''
    }
    return param[v]
  })
  return tagReg.test(result) ? { html: result } : result
}
