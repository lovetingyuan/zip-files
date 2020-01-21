import 'normalize.css/normalize.css'
import 'main.css/dist/main.css'

import '../../public/runtime'

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

function Delay () {
  this.promise = new Promise((resolve, reject) => {
    this.resolve = resolve
    this.reject = reject
  })
}

window.loadScript = function loadScript (src) {
  const script = document.createElement('script')
  script.src = src
  script.setAttribute('crossorigin', 'anonymous')
  const { promise, resolve, reject } = new Delay()
  script.onload = resolve
  script.onerror = reject
  document.head.appendChild(script)
  return promise
}
