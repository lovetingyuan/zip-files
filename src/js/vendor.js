import 'normalize.css/normalize.css'
import 'main.css/dist/main.css'

import '../../public/runtime'

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
