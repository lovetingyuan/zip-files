// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../node_modules/normalize.css/normalize.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../node_modules/main.css/dist/main.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../node_modules/@ungap/weakmap/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var self = void 0 ||
/* istanbul ignore next */
{};

try {
  self.WeakMap = WeakMap;
} catch (WeakMap) {
  // this could be better but 90% of the time
  // it's everything developers need as fallback
  self.WeakMap = function (id, Object) {
    'use strict';

    var dP = Object.defineProperty;
    var hOP = Object.hasOwnProperty;
    var proto = WeakMap.prototype;

    proto.delete = function (key) {
      return this.has(key) && delete key[this._];
    };

    proto.get = function (key) {
      return this.has(key) ? key[this._] : void 0;
    };

    proto.has = function (key) {
      return hOP.call(key, this._);
    };

    proto.set = function (key, value) {
      dP(key, this._, {
        configurable: true,
        value: value
      });
      return this;
    };

    return WeakMap;

    function WeakMap(iterable) {
      dP(this, '_', {
        value: '_@ungap/weakmap' + id++
      });
      if (iterable) iterable.forEach(add, this);
    }

    function add(pair) {
      this.set(pair[0], pair[1]);
    }
  }(Math.random(), Object);
}

var _default = self.WeakMap;
exports.default = _default;
},{}],"../node_modules/@ungap/template-literal/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _weakmap = _interopRequireDefault(require("@ungap/weakmap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isNoOp = typeof document !== 'object';

var templateLiteral = function (tl) {
  var RAW = 'raw';

  var isBroken = function (UA) {
    return /(Firefox|Safari)\/(\d+)/.test(UA) && !/(Chrom[eium]+|Android)\/(\d+)/.test(UA);
  };

  var broken = isBroken((document.defaultView.navigator || {}).userAgent);
  var FTS = !(RAW in tl) || tl.propertyIsEnumerable(RAW) || !Object.isFrozen(tl[RAW]);

  if (broken || FTS) {
    var forever = {};

    var foreverCache = function (tl) {
      for (var key = '.', i = 0; i < tl.length; i++) key += tl[i].length + '.' + tl[i];

      return forever[key] || (forever[key] = tl);
    }; // Fallback TypeScript shenanigans


    if (FTS) templateLiteral = foreverCache; // try fast path for other browsers:
    // store the template as WeakMap key
    // and forever cache it only when it's not there.
    // this way performance is still optimal,
    // penalized only when there are GC issues
    else {
        var wm = new _weakmap.default();

        var set = function (tl, unique) {
          wm.set(tl, unique);
          return unique;
        };

        templateLiteral = function (tl) {
          return wm.get(tl) || set(tl, foreverCache(tl));
        };
      }
  } else {
    isNoOp = true;
  }

  return TL(tl);
};

var _default = TL;
exports.default = _default;

function TL(tl) {
  return isNoOp ? tl : templateLiteral(tl);
}
},{"@ungap/weakmap":"../node_modules/@ungap/weakmap/esm/index.js"}],"../node_modules/@ungap/template-tag-arguments/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _templateLiteral = _interopRequireDefault(require("@ungap/template-literal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(template) {
  var length = arguments.length;
  var args = [(0, _templateLiteral.default)(template)];
  var i = 1;

  while (i < length) args.push(arguments[i++]);

  return args;
}

;
},{"@ungap/template-literal":"../node_modules/@ungap/template-literal/esm/index.js"}],"../node_modules/@ungap/custom-event/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var self = void 0 ||
/* istanbul ignore next */
{};
self.CustomEvent = typeof CustomEvent === 'function' ? CustomEvent : function (__p__) {
  CustomEvent[__p__] = new CustomEvent('').constructor[__p__];
  return CustomEvent;

  function CustomEvent(type, init) {
    if (!init) init = {};
    var e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, !!init.bubbles, !!init.cancelable, init.detail);
    return e;
  }
}('prototype');
var _default = self.CustomEvent;
exports.default = _default;
},{}],"../node_modules/@ungap/weakset/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var self = void 0 ||
/* istanbul ignore next */
{};

try {
  self.WeakSet = WeakSet;
} catch (WeakSet) {
  // requires a global WeakMap (IE11+)
  (function (WeakMap) {
    var all = new WeakMap();
    var proto = WeakSet.prototype;

    proto.add = function (value) {
      return all.get(this).set(value, 1), this;
    };

    proto.delete = function (value) {
      return all.get(this).delete(value);
    };

    proto.has = function (value) {
      return all.get(this).has(value);
    };

    self.WeakSet = WeakSet;

    function WeakSet(iterable) {
      'use strict';

      all.set(this, new WeakMap());
      if (iterable) iterable.forEach(this.add, this);
    }
  })(WeakMap);
}

var _default = self.WeakSet;
exports.default = _default;
},{}],"../node_modules/disconnected/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi */
function disconnected(poly) {
  'use strict';

  var Event = poly.Event;
  var WeakSet = poly.WeakSet;
  var notObserving = true;
  var observer = null;
  return function observe(node) {
    if (notObserving) {
      notObserving = !notObserving;
      observer = new WeakSet();
      startObserving(node.ownerDocument);
    }

    observer.add(node);
    return node;
  };

  function startObserving(document) {
    var connected = new WeakSet();
    var disconnected = new WeakSet();

    try {
      new MutationObserver(changes).observe(document, {
        subtree: true,
        childList: true
      });
    } catch (o_O) {
      var timer = 0;
      var records = [];

      var reschedule = function (record) {
        records.push(record);
        clearTimeout(timer);
        timer = setTimeout(function () {
          changes(records.splice(timer = 0, records.length));
        }, 0);
      };

      document.addEventListener('DOMNodeRemoved', function (event) {
        reschedule({
          addedNodes: [],
          removedNodes: [event.target]
        });
      }, true);
      document.addEventListener('DOMNodeInserted', function (event) {
        reschedule({
          addedNodes: [event.target],
          removedNodes: []
        });
      }, true);
    }

    function changes(records) {
      for (var record, length = records.length, i = 0; i < length; i++) {
        record = records[i];
        dispatchAll(record.removedNodes, 'disconnected', disconnected, connected);
        dispatchAll(record.addedNodes, 'connected', connected, disconnected);
      }
    }

    function dispatchAll(nodes, type, wsin, wsout) {
      for (var node, event = new Event(type), length = nodes.length, i = 0; i < length; (node = nodes[i++]).nodeType === 1 && dispatchTarget(node, event, type, wsin, wsout));
    }

    function dispatchTarget(node, event, type, wsin, wsout) {
      if (observer.has(node) && !wsin.has(node)) {
        wsout.delete(node);
        wsin.add(node);
        node.dispatchEvent(event);
        /*
        // The event is not bubbling (perf reason: should it?),
        // hence there's no way to know if
        // stop/Immediate/Propagation() was called.
        // Should DOM Level 0 work at all?
        // I say it's a YAGNI case for the time being,
        // and easy to implement in user-land.
        if (!event.cancelBubble) {
          var fn = node['on' + type];
          if (fn)
            fn.call(node, event);
        }
        */
      }

      for (var // apparently is node.children || IE11 ... ^_^;;
      // https://github.com/WebReflection/disconnected/issues/1
      children = node.children || [], length = children.length, i = 0; i < length; dispatchTarget(children[i++], event, type, wsin, wsout));
    }
  }
}

var _default = disconnected;
exports.default = _default;
},{}],"../node_modules/reraf/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reraf;
var compat = typeof cancelAnimationFrame === 'function';
var cAF = compat ? cancelAnimationFrame : clearTimeout;
var rAF = compat ? requestAnimationFrame : setTimeout;

function reraf(limit) {
  var force, timer, callback, self, args;
  reset();
  return function reschedule(_callback, _self, _args) {
    callback = _callback;
    self = _self;
    args = _args;
    if (!timer) timer = rAF(invoke);
    if (--force < 0) stop(true);
    return stop;
  };

  function invoke() {
    reset();
    callback.apply(self, args || []);
  }

  function reset() {
    force = limit || Infinity;
    timer = compat ? 0 : null;
  }

  function stop(flush) {
    var didStop = !!timer;

    if (didStop) {
      cAF(timer);
      if (flush) invoke();
    }

    return didStop;
  }
}

;
},{}],"../node_modules/augmentor/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useRef = exports.useCallback = exports.useMemo = exports.useLayoutEffect = exports.useEffect = exports.hasEffect = exports.dropEffect = exports.useContext = exports.createContext = exports.useReducer = exports.useState = exports.contextual = exports.augmentor = void 0;

var _reraf = _interopRequireDefault(require("reraf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*! (c) Andrea Giammarchi - ISC */
let state = null; // main exports

const augmentor = fn => {
  const stack = [];
  return function hook() {
    const prev = state;
    const after = [];
    state = {
      hook,
      args: arguments,
      stack,
      i: 0,
      length: stack.length,
      after
    };

    try {
      return fn.apply(null, arguments);
    } finally {
      state = prev;

      for (let i = 0, {
        length
      } = after; i < length; i++) after[i]();
    }
  };
};

exports.augmentor = augmentor;

const contextual = fn => {
  let context = null;
  const augmented = augmentor(function () {
    return fn.apply(context, arguments);
  });
  return function () {
    return augmented.apply(context = this, arguments);
  };
}; // useState


exports.contextual = contextual;
const updates = new WeakMap();

const setRaf = hook => {
  const update = (0, _reraf.default)();
  updates.set(hook, update);
  return update;
};

const hookdate = (hook, ctx, args) => {
  hook.apply(ctx, args);
};

const defaults = {
  async: false,
  always: false
};

const useState = (value, options) => {
  const i = state.i++;
  const {
    hook,
    args,
    stack,
    length
  } = state;
  const {
    async: asy,
    always
  } = options || defaults;
  if (i === length) state.length = stack.push({
    $: typeof value === 'function' ? value() : value,
    _: asy ? updates.get(hook) || setRaf(hook) : hookdate
  });
  const ref = stack[i];
  return [ref.$, value => {
    const $value = typeof value === 'function' ? value(ref.$) : value;

    if (always || ref.$ !== $value) {
      ref.$ = $value;

      ref._(hook, null, args);
    }
  }];
}; // useReducer


exports.useState = useState;

const useReducer = (reducer, value, init, options) => {
  const fn = typeof init === 'function'; // avoid `cons [state, update] = ...` Babel destructuring bloat

  const pair = useState(fn ? init(value) : value, fn ? options : init);
  return [pair[0], value => {
    pair[1](reducer(pair[0], value));
  }];
}; // useContext


exports.useReducer = useReducer;
const hooks = new WeakMap();

const invoke = ({
  hook,
  args
}) => {
  hook.apply(null, args);
};

const createContext = value => {
  const context = {
    value,
    provide
  };
  hooks.set(context, []);
  return context;
};

exports.createContext = createContext;

const useContext = context => {
  const {
    hook,
    args
  } = state;
  const stack = hooks.get(context);
  const info = {
    hook,
    args
  };
  if (!stack.some(update, info)) stack.push(info);
  return context.value;
};

exports.useContext = useContext;

function provide(value) {
  if (this.value !== value) {
    this.value = value;
    hooks.get(this).forEach(invoke);
  }
}

function update({
  hook
}) {
  return hook === this.hook;
} // dropEffect, hasEffect, useEffect, useLayoutEffect


const effects = new WeakMap();

const stop = () => {};

const setFX = hook => {
  const stack = [];
  effects.set(hook, stack);
  return stack;
};

const createEffect = asy => (effect, guards) => {
  const i = state.i++;
  const {
    hook,
    after,
    stack,
    length
  } = state;

  if (i < length) {
    const info = stack[i];
    const {
      update,
      values,
      stop
    } = info;

    if (!guards || guards.some(different, values)) {
      info.values = guards;
      if (asy) stop(asy);
      const {
        clean
      } = info;

      if (clean) {
        info.clean = null;
        clean();
      }

      const invoke = () => {
        info.clean = effect();
      };

      if (asy) update(invoke);else after.push(invoke);
    }
  } else {
    const update = asy ? (0, _reraf.default)() : stop;
    const info = {
      clean: null,
      update,
      values: guards,
      stop
    };
    state.length = stack.push(info);
    (effects.get(hook) || setFX(hook)).push(info);

    const invoke = () => {
      info.clean = effect();
    };

    if (asy) info.stop = update(invoke);else after.push(invoke);
  }
};

const dropEffect = hook => {
  (effects.get(hook) || []).forEach(info => {
    const {
      clean,
      stop
    } = info;
    stop();

    if (clean) {
      info.clean = null;
      clean();
    }
  });
};

exports.dropEffect = dropEffect;
const hasEffect = effects.has.bind(effects);
exports.hasEffect = hasEffect;
const useEffect = createEffect(true);
exports.useEffect = useEffect;
const useLayoutEffect = createEffect(false); // useMemo, useCallback

exports.useLayoutEffect = useLayoutEffect;

const useMemo = (memo, guards) => {
  const i = state.i++;
  const {
    stack,
    length
  } = state;
  if (i === length) state.length = stack.push({
    $: memo(),
    _: guards
  });else if (!guards || guards.some(different, stack[i]._)) stack[i] = {
    $: memo(),
    _: guards
  };
  return stack[i].$;
};

exports.useMemo = useMemo;

const useCallback = (fn, guards) => useMemo(() => fn, guards); // useRef


exports.useCallback = useCallback;

const useRef = value => {
  const i = state.i++;
  const {
    stack,
    length
  } = state;
  if (i === length) state.length = stack.push({
    current: value
  });
  return stack[i];
};

exports.useRef = useRef;

function different(value, i) {
  return value !== this[i];
}
},{"reraf":"../node_modules/reraf/esm/index.js"}],"../node_modules/dom-augmentor/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "contextual", {
  enumerable: true,
  get: function () {
    return _augmentor.contextual;
  }
});
Object.defineProperty(exports, "useState", {
  enumerable: true,
  get: function () {
    return _augmentor.useState;
  }
});
Object.defineProperty(exports, "useEffect", {
  enumerable: true,
  get: function () {
    return _augmentor.useEffect;
  }
});
Object.defineProperty(exports, "useLayoutEffect", {
  enumerable: true,
  get: function () {
    return _augmentor.useLayoutEffect;
  }
});
Object.defineProperty(exports, "useContext", {
  enumerable: true,
  get: function () {
    return _augmentor.useContext;
  }
});
Object.defineProperty(exports, "createContext", {
  enumerable: true,
  get: function () {
    return _augmentor.createContext;
  }
});
Object.defineProperty(exports, "useReducer", {
  enumerable: true,
  get: function () {
    return _augmentor.useReducer;
  }
});
Object.defineProperty(exports, "useCallback", {
  enumerable: true,
  get: function () {
    return _augmentor.useCallback;
  }
});
Object.defineProperty(exports, "useMemo", {
  enumerable: true,
  get: function () {
    return _augmentor.useMemo;
  }
});
Object.defineProperty(exports, "useRef", {
  enumerable: true,
  get: function () {
    return _augmentor.useRef;
  }
});
exports.augmentor = void 0;

var _customEvent = _interopRequireDefault(require("@ungap/custom-event"));

var _weakset = _interopRequireDefault(require("@ungap/weakset"));

var _disconnected = _interopRequireDefault(require("disconnected"));

var _augmentor = require("augmentor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*! (c) Andrea Giammarchi - ISC */
const find = node => {
  const {
    childNodes
  } = node;
  const {
    length
  } = childNodes;
  let i = 0;

  while (i < length) {
    const child = childNodes[i++];
    if (child.nodeType === 1) return child;
  }

  throw 'unobservable';
};

const observe = (0, _disconnected.default)({
  Event: _customEvent.default,
  WeakSet: _weakset.default
});

const observer = (element, handler) => {
  const {
    nodeType
  } = element;

  if (nodeType) {
    const node = nodeType === 1 ? element : find(element);
    observe(node);
    node.addEventListener('disconnected', handler, false);
  } else {
    const value = element.valueOf(); // give a chance to facades to return a reasonable value

    if (value !== element) observer(value, handler);
  }
};

const augmentor = fn => {
  let handler = null;
  const hook = (0, _augmentor.augmentor)(fn);
  return function () {
    const node = hook.apply(this, arguments);
    if ((0, _augmentor.hasEffect)(hook)) observer(node, handler || (handler = _augmentor.dropEffect.bind(null, hook)));
    return node;
  };
};

exports.augmentor = augmentor;
},{"@ungap/custom-event":"../node_modules/@ungap/custom-event/esm/index.js","@ungap/weakset":"../node_modules/@ungap/weakset/esm/index.js","disconnected":"../node_modules/disconnected/esm/index.js","augmentor":"../node_modules/augmentor/esm/index.js"}],"../node_modules/domconstants/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VOID_ELEMENTS = exports.SHOULD_USE_TEXT_CONTENT = exports.TEXT_NODE = exports.ELEMENT_NODE = exports.DOCUMENT_FRAGMENT_NODE = exports.COMMENT_NODE = exports.UID_IE = exports.UIDC = exports.UID = void 0;

/*! (c) Andrea Giammarchi - ISC */
// Custom
var UID = '-' + Math.random().toFixed(6) + '%'; //                           Edge issue!

exports.UID = UID;
var UID_IE = false;
exports.UID_IE = UID_IE;

try {
  if (!function (template, content, tabindex) {
    return content in template && (template.innerHTML = '<p ' + tabindex + '="' + UID + '"></p>', template[content].childNodes[0].getAttribute(tabindex) == UID);
  }(document.createElement('template'), 'content', 'tabindex')) {
    exports.UID = UID = '_dt: ' + UID.slice(1, -1) + ';';
    exports.UID_IE = UID_IE = true;
  }
} catch (meh) {}

var UIDC = '<!--' + UID + '-->'; // DOM

exports.UIDC = UIDC;
var COMMENT_NODE = 8;
exports.COMMENT_NODE = COMMENT_NODE;
var DOCUMENT_FRAGMENT_NODE = 11;
exports.DOCUMENT_FRAGMENT_NODE = DOCUMENT_FRAGMENT_NODE;
var ELEMENT_NODE = 1;
exports.ELEMENT_NODE = ELEMENT_NODE;
var TEXT_NODE = 3;
exports.TEXT_NODE = TEXT_NODE;
var SHOULD_USE_TEXT_CONTENT = /^(?:style|textarea)$/i;
exports.SHOULD_USE_TEXT_CONTENT = SHOULD_USE_TEXT_CONTENT;
var VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;
exports.VOID_ELEMENTS = VOID_ELEMENTS;
},{}],"../node_modules/domsanitizer/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _domconstants = require("domconstants");

/*! (c) Andrea Giammarchi - ISC */
function _default(template) {
  return template.join(_domconstants.UIDC).replace(selfClosing, fullClosing).replace(attrSeeker, attrReplacer);
}

var spaces = ' \\f\\n\\r\\t';
var almostEverything = '[^' + spaces + '\\/>"\'=]+';
var attrName = '[' + spaces + ']+' + almostEverything;
var tagName = '<([A-Za-z]+[A-Za-z0-9:._-]*)((?:';
var attrPartials = '(?:\\s*=\\s*(?:\'[^\']*?\'|"[^"]*?"|<[^>]*?>|' + almostEverything.replace('\\/', '') + '))?)';
var attrSeeker = new RegExp(tagName + attrName + attrPartials + '+)([' + spaces + ']*/?>)', 'g');
var selfClosing = new RegExp(tagName + attrName + attrPartials + '*)([' + spaces + ']*/>)', 'g');
var findAttributes = new RegExp('(' + attrName + '\\s*=\\s*)([\'"]?)' + _domconstants.UIDC + '\\2', 'gi');

function attrReplacer($0, $1, $2, $3) {
  return '<' + $1 + $2.replace(findAttributes, replaceAttributes) + $3;
}

function replaceAttributes($0, $1, $2) {
  return $1 + ($2 || '"') + _domconstants.UID + ($2 || '"');
}

function fullClosing($0, $1, $2) {
  return _domconstants.VOID_ELEMENTS.test($1) ? $0 : '<' + $1 + $2 + '></' + $1 + '>';
}
},{"domconstants":"../node_modules/domconstants/esm/index.js"}],"../node_modules/@ungap/create-content/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var createContent = function (document) {
  'use strict';

  var FRAGMENT = 'fragment';
  var TEMPLATE = 'template';
  var HAS_CONTENT = 'content' in create(TEMPLATE);
  var createHTML = HAS_CONTENT ? function (html) {
    var template = create(TEMPLATE);
    template.innerHTML = html;
    return template.content;
  } : function (html) {
    var content = create(FRAGMENT);
    var template = create(TEMPLATE);
    var childNodes = null;

    if (/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(html)) {
      var selector = RegExp.$1;
      template.innerHTML = '<table>' + html + '</table>';
      childNodes = template.querySelectorAll(selector);
    } else {
      template.innerHTML = html;
      childNodes = template.childNodes;
    }

    append(content, childNodes);
    return content;
  };
  return function createContent(markup, type) {
    return (type === 'svg' ? createSVG : createHTML)(markup);
  };

  function append(root, childNodes) {
    var length = childNodes.length;

    while (length--) root.appendChild(childNodes[0]);
  }

  function create(element) {
    return element === FRAGMENT ? document.createDocumentFragment() : document.createElementNS('http://www.w3.org/1999/xhtml', element);
  } // it could use createElementNS when hasNode is there
  // but this fallback is equally fast and easier to maintain
  // it is also battle tested already in all IE


  function createSVG(svg) {
    var content = create(FRAGMENT);
    var template = create('div');
    template.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + svg + '</svg>';
    append(content, template.firstChild.childNodes);
    return content;
  }
}(document);

var _default = createContent;
exports.default = _default;
},{}],"../node_modules/domdiff/esm/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.smartDiff = exports.remove = exports.next = exports.isReversed = exports.indexOf = exports.identity = exports.eqeq = exports.append = void 0;
const {
  indexOf: iOF
} = [];

const append = (get, parent, children, start, end, before) => {
  const isSelect = 'selectedIndex' in parent;
  let noSelection = isSelect;

  while (start < end) {
    const child = get(children[start], 1);
    parent.insertBefore(child, before);

    if (isSelect && noSelection && child.selected) {
      noSelection = !noSelection;
      let {
        selectedIndex
      } = parent;
      parent.selectedIndex = selectedIndex < 0 ? start : iOF.call(parent.querySelectorAll('option'), child);
    }

    start++;
  }
};

exports.append = append;

const eqeq = (a, b) => a == b;

exports.eqeq = eqeq;

const identity = O => O;

exports.identity = identity;

const indexOf = (moreNodes, moreStart, moreEnd, lessNodes, lessStart, lessEnd, compare) => {
  const length = lessEnd - lessStart;
  /* istanbul ignore if */

  if (length < 1) return -1;

  while (moreEnd - moreStart >= length) {
    let m = moreStart;
    let l = lessStart;

    while (m < moreEnd && l < lessEnd && compare(moreNodes[m], lessNodes[l])) {
      m++;
      l++;
    }

    if (l === lessEnd) return moreStart;
    moreStart = m + 1;
  }

  return -1;
};

exports.indexOf = indexOf;

const isReversed = (futureNodes, futureEnd, currentNodes, currentStart, currentEnd, compare) => {
  while (currentStart < currentEnd && compare(currentNodes[currentStart], futureNodes[futureEnd - 1])) {
    currentStart++;
    futureEnd--;
  }

  ;
  return futureEnd === 0;
};

exports.isReversed = isReversed;

const next = (get, list, i, length, before) => i < length ? get(list[i], 0) : 0 < i ? get(list[i - 1], -0).nextSibling : before;

exports.next = next;

const remove = (get, children, start, end) => {
  while (start < end) drop(get(children[start++], -1));
}; // - - - - - - - - - - - - - - - - - - -
// diff related constants and utilities
// - - - - - - - - - - - - - - - - - - -


exports.remove = remove;
const DELETION = -1;
const INSERTION = 1;
const SKIP = 0;
const SKIP_OND = 50;

const HS = (futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges) => {
  let k = 0;
  /* istanbul ignore next */

  let minLen = futureChanges < currentChanges ? futureChanges : currentChanges;
  const link = Array(minLen++);
  const tresh = Array(minLen);
  tresh[0] = -1;

  for (let i = 1; i < minLen; i++) tresh[i] = currentEnd;

  const nodes = currentNodes.slice(currentStart, currentEnd);

  for (let i = futureStart; i < futureEnd; i++) {
    const index = nodes.indexOf(futureNodes[i]);

    if (-1 < index) {
      const idxInOld = index + currentStart;
      k = findK(tresh, minLen, idxInOld);
      /* istanbul ignore else */

      if (-1 < k) {
        tresh[k] = idxInOld;
        link[k] = {
          newi: i,
          oldi: idxInOld,
          prev: link[k - 1]
        };
      }
    }
  }

  k = --minLen;
  --currentEnd;

  while (tresh[k] > currentEnd) --k;

  minLen = currentChanges + futureChanges - k;
  const diff = Array(minLen);
  let ptr = link[k];
  --futureEnd;

  while (ptr) {
    const {
      newi,
      oldi
    } = ptr;

    while (futureEnd > newi) {
      diff[--minLen] = INSERTION;
      --futureEnd;
    }

    while (currentEnd > oldi) {
      diff[--minLen] = DELETION;
      --currentEnd;
    }

    diff[--minLen] = SKIP;
    --futureEnd;
    --currentEnd;
    ptr = ptr.prev;
  }

  while (futureEnd >= futureStart) {
    diff[--minLen] = INSERTION;
    --futureEnd;
  }

  while (currentEnd >= currentStart) {
    diff[--minLen] = DELETION;
    --currentEnd;
  }

  return diff;
}; // this is pretty much the same petit-dom code without the delete map part
// https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L556-L561


const OND = (futureNodes, futureStart, rows, currentNodes, currentStart, cols, compare) => {
  const length = rows + cols;
  const v = [];
  let d, k, r, c, pv, cv, pd;

  outer: for (d = 0; d <= length; d++) {
    /* istanbul ignore if */
    if (d > SKIP_OND) return null;
    pd = d - 1;
    /* istanbul ignore next */

    pv = d ? v[d - 1] : [0, 0];
    cv = v[d] = [];

    for (k = -d; k <= d; k += 2) {
      if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
        c = pv[pd + k + 1];
      } else {
        c = pv[pd + k - 1] + 1;
      }

      r = c - k;

      while (c < cols && r < rows && compare(currentNodes[currentStart + c], futureNodes[futureStart + r])) {
        c++;
        r++;
      }

      if (c === cols && r === rows) {
        break outer;
      }

      cv[d + k] = c;
    }
  }

  const diff = Array(d / 2 + length / 2);
  let diffIdx = diff.length - 1;

  for (d = v.length - 1; d >= 0; d--) {
    while (c > 0 && r > 0 && compare(currentNodes[currentStart + c - 1], futureNodes[futureStart + r - 1])) {
      // diagonal edge = equality
      diff[diffIdx--] = SKIP;
      c--;
      r--;
    }

    if (!d) break;
    pd = d - 1;
    /* istanbul ignore next */

    pv = d ? v[d - 1] : [0, 0];
    k = c - r;

    if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
      // vertical edge = insertion
      r--;
      diff[diffIdx--] = INSERTION;
    } else {
      // horizontal edge = deletion
      c--;
      diff[diffIdx--] = DELETION;
    }
  }

  return diff;
};

const applyDiff = (diff, get, parentNode, futureNodes, futureStart, currentNodes, currentStart, currentLength, before) => {
  const live = [];
  const length = diff.length;
  let currentIndex = currentStart;
  let i = 0;

  while (i < length) {
    switch (diff[i++]) {
      case SKIP:
        futureStart++;
        currentIndex++;
        break;

      case INSERTION:
        // TODO: bulk appends for sequential nodes
        live.push(futureNodes[futureStart]);
        append(get, parentNode, futureNodes, futureStart++, futureStart, currentIndex < currentLength ? get(currentNodes[currentIndex], 0) : before);
        break;

      case DELETION:
        currentIndex++;
        break;
    }
  }

  i = 0;

  while (i < length) {
    switch (diff[i++]) {
      case SKIP:
        currentStart++;
        break;

      case DELETION:
        // TODO: bulk removes for sequential nodes
        if (-1 < live.indexOf(currentNodes[currentStart])) currentStart++;else remove(get, currentNodes, currentStart++, currentStart);
        break;
    }
  }
};

const findK = (ktr, length, j) => {
  let lo = 1;
  let hi = length;

  while (lo < hi) {
    const mid = (lo + hi) / 2 >>> 0;
    if (j < ktr[mid]) hi = mid;else lo = mid + 1;
  }

  return lo;
};

const smartDiff = (get, parentNode, futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges, currentLength, compare, before) => {
  applyDiff(OND(futureNodes, futureStart, futureChanges, currentNodes, currentStart, currentChanges, compare) || HS(futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges), get, parentNode, futureNodes, futureStart, currentNodes, currentStart, currentLength, before);
};

exports.smartDiff = smartDiff;

const drop = node => (node.remove || dropChild).call(node);

function dropChild() {
  const {
    parentNode
  } = this;
  /* istanbul ignore else */

  if (parentNode) parentNode.removeChild(this);
}
},{}],"../node_modules/domdiff/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils.js");

/*! (c) 2018 Andrea Giammarchi (ISC) */
const domdiff = (parentNode, // where changes happen
currentNodes, // Array of current items/nodes
futureNodes, // Array of future items/nodes
options // optional object with one of the following properties
//  before: domNode
//  compare(generic, generic) => true if same generic
//  node(generic) => Node
) => {
  if (!options) options = {};
  const compare = options.compare || _utils.eqeq;
  const get = options.node || _utils.identity;
  const before = options.before == null ? null : get(options.before, 0);
  const currentLength = currentNodes.length;
  let currentEnd = currentLength;
  let currentStart = 0;
  let futureEnd = futureNodes.length;
  let futureStart = 0; // common prefix

  while (currentStart < currentEnd && futureStart < futureEnd && compare(currentNodes[currentStart], futureNodes[futureStart])) {
    currentStart++;
    futureStart++;
  } // common suffix


  while (currentStart < currentEnd && futureStart < futureEnd && compare(currentNodes[currentEnd - 1], futureNodes[futureEnd - 1])) {
    currentEnd--;
    futureEnd--;
  }

  const currentSame = currentStart === currentEnd;
  const futureSame = futureStart === futureEnd; // same list

  if (currentSame && futureSame) return futureNodes; // only stuff to add

  if (currentSame && futureStart < futureEnd) {
    (0, _utils.append)(get, parentNode, futureNodes, futureStart, futureEnd, (0, _utils.next)(get, currentNodes, currentStart, currentLength, before));
    return futureNodes;
  } // only stuff to remove


  if (futureSame && currentStart < currentEnd) {
    (0, _utils.remove)(get, currentNodes, currentStart, currentEnd);
    return futureNodes;
  }

  const currentChanges = currentEnd - currentStart;
  const futureChanges = futureEnd - futureStart;
  let i = -1; // 2 simple indels: the shortest sequence is a subsequence of the longest

  if (currentChanges < futureChanges) {
    i = (0, _utils.indexOf)(futureNodes, futureStart, futureEnd, currentNodes, currentStart, currentEnd, compare); // inner diff

    if (-1 < i) {
      (0, _utils.append)(get, parentNode, futureNodes, futureStart, i, get(currentNodes[currentStart], 0));
      (0, _utils.append)(get, parentNode, futureNodes, i + currentChanges, futureEnd, (0, _utils.next)(get, currentNodes, currentEnd, currentLength, before));
      return futureNodes;
    }
  }
  /* istanbul ignore else */
  else if (futureChanges < currentChanges) {
      i = (0, _utils.indexOf)(currentNodes, currentStart, currentEnd, futureNodes, futureStart, futureEnd, compare); // outer diff

      if (-1 < i) {
        (0, _utils.remove)(get, currentNodes, currentStart, i);
        (0, _utils.remove)(get, currentNodes, i + futureChanges, currentEnd);
        return futureNodes;
      }
    } // common case with one replacement for many nodes
  // or many nodes replaced for a single one

  /* istanbul ignore else */


  if (currentChanges < 2 || futureChanges < 2) {
    (0, _utils.append)(get, parentNode, futureNodes, futureStart, futureEnd, get(currentNodes[currentStart], 0));
    (0, _utils.remove)(get, currentNodes, currentStart, currentEnd);
    return futureNodes;
  } // the half match diff part has been skipped in petit-dom
  // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L391-L397
  // accordingly, I think it's safe to skip in here too
  // if one day it'll come out like the speediest thing ever to do
  // then I might add it in here too
  // Extra: before going too fancy, what about reversed lists ?
  //        This should bail out pretty quickly if that's not the case.


  if (currentChanges === futureChanges && (0, _utils.isReversed)(futureNodes, futureEnd, currentNodes, currentStart, currentEnd, compare)) {
    (0, _utils.append)(get, parentNode, futureNodes, futureStart, futureEnd, (0, _utils.next)(get, currentNodes, currentEnd, currentLength, before));
    return futureNodes;
  } // last resort through a smart diff


  (0, _utils.smartDiff)(get, parentNode, futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges, currentLength, compare, before);
  return futureNodes;
};

var _default = domdiff;
exports.default = _default;
},{"./utils.js":"../node_modules/domdiff/esm/utils.js"}],"../node_modules/@ungap/import-node/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var importNode = function (document, appendChild, cloneNode, createTextNode, importNode) {
  var native = importNode in document; // IE 11 has problems with cloning templates:
  // it "forgets" empty childNodes. This feature-detects that.

  var fragment = document.createDocumentFragment();
  fragment[appendChild](document[createTextNode]('g'));
  fragment[appendChild](document[createTextNode](''));
  var content = native ? document[importNode](fragment, true) : fragment[cloneNode](true);
  return content.childNodes.length < 2 ? function importNode(node, deep) {
    var clone = node[cloneNode]();

    for (var childNodes = node.childNodes || [], length = childNodes.length, i = 0; deep && i < length; i++) {
      clone[appendChild](importNode(childNodes[i], deep));
    }

    return clone;
  } : native ? document[importNode] : function (node, deep) {
    return node[cloneNode](!!deep);
  };
}(document, 'appendChild', 'cloneNode', 'createTextNode', 'importNode');

var _default = importNode;
exports.default = _default;
},{}],"../node_modules/@ungap/trim/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var trim = ''.trim || function () {
  return String(this).replace(/^\s+|\s+/g, '');
};

var _default = trim;
exports.default = _default;
},{}],"../node_modules/domtagger/esm/walker.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;
exports.parse = parse;

var _trim = _interopRequireDefault(require("@ungap/trim"));

var _domconstants = require("domconstants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
var normalizeAttributes = _domconstants.UID_IE ? function (attributes, parts) {
  var html = parts.join(' ');
  return parts.slice.call(attributes, 0).sort(function (left, right) {
    return html.indexOf(left.name) <= html.indexOf(right.name) ? -1 : 1;
  });
} : function (attributes, parts) {
  return parts.slice.call(attributes, 0);
};

function find(node, path) {
  var length = path.length;
  var i = 0;

  while (i < length) node = node.childNodes[path[i++]];

  return node;
}

function parse(node, holes, parts, path) {
  var childNodes = node.childNodes;
  var length = childNodes.length;
  var i = 0;

  while (i < length) {
    var child = childNodes[i];

    switch (child.nodeType) {
      case _domconstants.ELEMENT_NODE:
        var childPath = path.concat(i);
        parseAttributes(child, holes, parts, childPath);
        parse(child, holes, parts, childPath);
        break;

      case _domconstants.COMMENT_NODE:
        var textContent = child.textContent;

        if (textContent === _domconstants.UID) {
          parts.shift();
          holes.push( // basicHTML or other non standard engines
          // might end up having comments in nodes
          // where they shouldn't, hence this check.
          _domconstants.SHOULD_USE_TEXT_CONTENT.test(node.nodeName) ? Text(node, path) : Any(child, path.concat(i)));
        } else {
          switch (textContent.slice(0, 2)) {
            case '/*':
              if (textContent.slice(-2) !== '*/') break;

            case '\uD83D\uDC7B':
              // ghost
              node.removeChild(child);
              i--;
              length--;
          }
        }

        break;

      case _domconstants.TEXT_NODE:
        // the following ignore is actually covered by browsers
        // only basicHTML ends up on previous COMMENT_NODE case
        // instead of TEXT_NODE because it knows nothing about
        // special style or textarea behavior

        /* istanbul ignore if */
        if (_domconstants.SHOULD_USE_TEXT_CONTENT.test(node.nodeName) && _trim.default.call(child.textContent) === _domconstants.UIDC) {
          parts.shift();
          holes.push(Text(node, path));
        }

        break;
    }

    i++;
  }
}

function parseAttributes(node, holes, parts, path) {
  var attributes = node.attributes;
  var cache = [];
  var remove = [];
  var array = normalizeAttributes(attributes, parts);
  var length = array.length;
  var i = 0;

  while (i < length) {
    var attribute = array[i++];
    var direct = attribute.value === _domconstants.UID;
    var sparse;

    if (direct || 1 < (sparse = attribute.value.split(_domconstants.UIDC)).length) {
      var name = attribute.name; // the following ignore is covered by IE
      // and the IE9 double viewBox test

      /* istanbul ignore else */

      if (cache.indexOf(name) < 0) {
        cache.push(name);
        var realName = parts.shift().replace(direct ? /^(?:|[\S\s]*?\s)(\S+?)\s*=\s*('|")?$/ : new RegExp('^(?:|[\\S\\s]*?\\s)(' + name + ')\\s*=\\s*(\'|")[\\S\\s]*', 'i'), '$1');
        var value = attributes[realName] || // the following ignore is covered by browsers
        // while basicHTML is already case-sensitive

        /* istanbul ignore next */
        attributes[realName.toLowerCase()];
        if (direct) holes.push(Attr(value, path, realName, null));else {
          var skip = sparse.length - 2;

          while (skip--) parts.shift();

          holes.push(Attr(value, path, realName, sparse));
        }
      }

      remove.push(attribute);
    }
  }

  length = remove.length;
  i = 0;
  /* istanbul ignore next */

  var cleanValue = 0 < length && _domconstants.UID_IE && !('ownerSVGElement' in node);

  while (i < length) {
    // Edge HTML bug #16878726
    var attr = remove[i++]; // IE/Edge bug lighterhtml#63 - clean the value or it'll persist

    /* istanbul ignore next */

    if (cleanValue) attr.value = ''; // IE/Edge bug lighterhtml#64 - don't use removeAttributeNode

    node.removeAttribute(attr.name);
  } // This is a very specific Firefox/Safari issue
  // but since it should be a not so common pattern,
  // it's probably worth patching regardless.
  // Basically, scripts created through strings are death.
  // You need to create fresh new scripts instead.
  // TODO: is there any other node that needs such nonsense?


  var nodeName = node.nodeName;

  if (/^script$/i.test(nodeName)) {
    // this used to be like that
    // var script = createElement(node, nodeName);
    // then Edge arrived and decided that scripts created
    // through template documents aren't worth executing
    // so it became this ... hopefully it won't hurt in the wild
    var script = document.createElement(nodeName);
    length = attributes.length;
    i = 0;

    while (i < length) script.setAttributeNode(attributes[i++].cloneNode(true));

    script.textContent = node.textContent;
    node.parentNode.replaceChild(script, node);
  }
}

function Any(node, path) {
  return {
    type: 'any',
    node: node,
    path: path
  };
}

function Attr(node, path, name, sparse) {
  return {
    type: 'attr',
    node: node,
    path: path,
    name: name,
    sparse: sparse
  };
}

function Text(node, path) {
  return {
    type: 'text',
    node: node,
    path: path
  };
}
},{"@ungap/trim":"../node_modules/@ungap/trim/esm/index.js","domconstants":"../node_modules/domconstants/esm/index.js"}],"../node_modules/domtagger/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _weakmap = _interopRequireDefault(require("@ungap/weakmap"));

var _createContent = _interopRequireDefault(require("@ungap/create-content"));

var _importNode = _interopRequireDefault(require("@ungap/import-node"));

var _trim = _interopRequireDefault(require("@ungap/trim"));

var _domsanitizer = _interopRequireDefault(require("domsanitizer"));

var _walker = require("./walker.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// globals
// utils
// local
// the domtagger 🎉
var _default = domtagger;
exports.default = _default;
var parsed = new _weakmap.default();

function createInfo(options, template) {
  var markup = (options.convert || _domsanitizer.default)(template);

  var transform = options.transform;
  if (transform) markup = transform(markup);
  var content = (0, _createContent.default)(markup, options.type);
  cleanContent(content);
  var holes = [];
  (0, _walker.parse)(content, holes, template.slice(0), []);
  var info = {
    content: content,
    updates: function (content) {
      var updates = [];
      var len = holes.length;
      var i = 0;
      var off = 0;

      while (i < len) {
        var info = holes[i++];
        var node = (0, _walker.find)(content, info.path);

        switch (info.type) {
          case 'any':
            updates.push({
              fn: options.any(node, []),
              sparse: false
            });
            break;

          case 'attr':
            var sparse = info.sparse;
            var fn = options.attribute(node, info.name, info.node);
            if (sparse === null) updates.push({
              fn: fn,
              sparse: false
            });else {
              off += sparse.length - 2;
              updates.push({
                fn: fn,
                sparse: true,
                values: sparse
              });
            }
            break;

          case 'text':
            updates.push({
              fn: options.text(node),
              sparse: false
            });
            node.textContent = '';
            break;
        }
      }

      len += off;
      return function () {
        var length = arguments.length;

        if (len !== length - 1) {
          throw new Error(length - 1 + ' values instead of ' + len + '\n' + template.join('${value}'));
        }

        var i = 1;
        var off = 1;

        while (i < length) {
          var update = updates[i - off];

          if (update.sparse) {
            var values = update.values;
            var value = values[0];
            var j = 1;
            var l = values.length;
            off += l - 2;

            while (j < l) value += arguments[i++] + values[j++];

            update.fn(value);
          } else update.fn(arguments[i++]);
        }

        return content;
      };
    }
  };
  parsed.set(template, info);
  return info;
}

function createDetails(options, template) {
  var info = parsed.get(template) || createInfo(options, template);
  return info.updates(_importNode.default.call(document, info.content, true));
}

var empty = [];

function domtagger(options) {
  var previous = empty;
  var updates = cleanContent;
  return function (template) {
    if (previous !== template) updates = createDetails(options, previous = template);
    return updates.apply(null, arguments);
  };
}

function cleanContent(fragment) {
  var childNodes = fragment.childNodes;
  var i = childNodes.length;

  while (i--) {
    var child = childNodes[i];

    if (child.nodeType !== 1 && _trim.default.call(child.textContent).length === 0) {
      fragment.removeChild(child);
    }
  }
}
},{"@ungap/weakmap":"../node_modules/@ungap/weakmap/esm/index.js","@ungap/create-content":"../node_modules/@ungap/create-content/esm/index.js","@ungap/import-node":"../node_modules/@ungap/import-node/esm/index.js","@ungap/trim":"../node_modules/@ungap/trim/esm/index.js","domsanitizer":"../node_modules/domsanitizer/esm/index.js","./walker.js":"../node_modules/domtagger/esm/walker.js"}],"../node_modules/hyperhtml-style/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var hyperStyle = function () {
  'use strict'; // from https://github.com/developit/preact/blob/33fc697ac11762a1cb6e71e9847670d047af7ce5/src/varants.js

  var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
  var hyphen = /([^A-Z])([A-Z]+)/g;
  return function hyperStyle(node, original) {
    return 'ownerSVGElement' in node ? svg(node, original) : update(node.style, false);
  };

  function ized($0, $1, $2) {
    return $1 + '-' + $2.toLowerCase();
  }

  function svg(node, original) {
    var style;
    if (original) style = original.cloneNode(true);else {
      node.setAttribute('style', '--hyper:style;');
      style = node.getAttributeNode('style');
    }
    style.value = '';
    node.setAttributeNode(style);
    return update(style, true);
  }

  function toStyle(object) {
    var key,
        css = [];

    for (key in object) css.push(key.replace(hyphen, ized), ':', object[key], ';');

    return css.join('');
  }

  function update(style, isSVG) {
    var oldType, oldValue;
    return function (newValue) {
      var info, key, styleValue, value;

      switch (typeof newValue) {
        case 'object':
          if (newValue) {
            if (oldType === 'object') {
              if (!isSVG) {
                if (oldValue !== newValue) {
                  for (key in oldValue) {
                    if (!(key in newValue)) {
                      style[key] = '';
                    }
                  }
                }
              }
            } else {
              if (isSVG) style.value = '';else style.cssText = '';
            }

            info = isSVG ? {} : style;

            for (key in newValue) {
              value = newValue[key];
              styleValue = typeof value === 'number' && !IS_NON_DIMENSIONAL.test(key) ? value + 'px' : value;
              if (!isSVG && /^--/.test(key)) info.setProperty(key, styleValue);else info[key] = styleValue;
            }

            oldType = 'object';
            if (isSVG) style.value = toStyle(oldValue = info);else oldValue = newValue;
            break;
          }

        default:
          if (oldValue != newValue) {
            oldType = 'string';
            oldValue = newValue;
            if (isSVG) style.value = newValue || '';else style.cssText = newValue || '';
          }

          break;
      }
    };
  }
}();

var _default = hyperStyle;
exports.default = _default;
},{}],"../node_modules/hyperhtml-wire/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*! (c) Andrea Giammarchi - ISC */
var Wire = function (slice, proto) {
  proto = Wire.prototype;
  proto.ELEMENT_NODE = 1;
  proto.nodeType = 111;

  proto.remove = function (keepFirst) {
    var childNodes = this.childNodes;
    var first = this.firstChild;
    var last = this.lastChild;
    this._ = null;

    if (keepFirst && childNodes.length === 2) {
      last.parentNode.removeChild(last);
    } else {
      var range = this.ownerDocument.createRange();
      range.setStartBefore(keepFirst ? childNodes[1] : first);
      range.setEndAfter(last);
      range.deleteContents();
    }

    return first;
  };

  proto.valueOf = function (forceAppend) {
    var fragment = this._;
    var noFragment = fragment == null;
    if (noFragment) fragment = this._ = this.ownerDocument.createDocumentFragment();

    if (noFragment || forceAppend) {
      for (var n = this.childNodes, i = 0, l = n.length; i < l; i++) fragment.appendChild(n[i]);
    }

    return fragment;
  };

  return Wire;

  function Wire(childNodes) {
    var nodes = this.childNodes = slice.call(childNodes, 0);
    this.firstChild = nodes[0];
    this.lastChild = nodes[nodes.length - 1];
    this.ownerDocument = nodes[0].ownerDocument;
    this._ = null;
  }
}([].slice);

var _default = Wire;
exports.default = _default;
},{}],"../node_modules/lighterhtml/esm/shared.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Wire", {
  enumerable: true,
  get: function () {
    return _hyperhtmlWire.default;
  }
});
exports.wireType = exports.keys = exports.isArray = exports.freeze = exports.create = void 0;

var _hyperhtmlWire = _interopRequireDefault(require("hyperhtml-wire"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  isArray
} = Array;
exports.isArray = isArray;
const {
  create,
  freeze,
  keys
} = Object;
exports.keys = keys;
exports.freeze = freeze;
exports.create = create;
const wireType = _hyperhtmlWire.default.prototype.nodeType;
exports.wireType = wireType;
},{"hyperhtml-wire":"../node_modules/hyperhtml-wire/esm/index.js"}],"../node_modules/lighterhtml/esm/tagger.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tagger = Tagger;

var _createContent = _interopRequireDefault(require("@ungap/create-content"));

var _domdiff = _interopRequireDefault(require("domdiff"));

var _domtagger = _interopRequireDefault(require("domtagger"));

var _hyperhtmlStyle = _interopRequireDefault(require("hyperhtml-style"));

var _shared = require("./shared.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// returns nodes from wires and components
const asNode = (item, i) => item.nodeType === _shared.wireType ? 1 / i < 0 ? i ? item.remove(true) : item.lastChild : i ? item.valueOf(true) : item.firstChild : item; // returns true if domdiff can handle the value


const canDiff = value => 'ELEMENT_NODE' in value; // generic attributes helpers


const hyperAttribute = (node, original) => {
  let oldValue;
  let owner = false;
  const attribute = original.cloneNode(true);
  return newValue => {
    if (oldValue !== newValue) {
      oldValue = newValue;

      if (attribute.value !== newValue) {
        if (newValue == null) {
          if (owner) {
            owner = false;
            node.removeAttributeNode(attribute);
          }

          attribute.value = newValue;
        } else {
          attribute.value = newValue;

          if (!owner) {
            owner = true;
            node.setAttributeNode(attribute);
          }
        }
      }
    }
  };
}; // events attributes helpers


const hyperEvent = (node, name) => {
  let oldValue;
  let type = name.slice(2);
  if (name.toLowerCase() in node) type = type.toLowerCase();
  return newValue => {
    if (oldValue !== newValue) {
      if (oldValue) node.removeEventListener(type, oldValue, false);
      oldValue = newValue;
      if (newValue) node.addEventListener(type, newValue, false);
    }
  };
}; // special attributes helpers


const hyperProperty = (node, name) => {
  let oldValue;
  return newValue => {
    if (oldValue !== newValue) {
      oldValue = newValue;

      if (node[name] !== newValue) {
        if (newValue == null) {
          // cleanup before dropping the attribute to fix IE/Edge gotcha
          node[name] = '';
          node.removeAttribute(name);
        } else node[name] = newValue;
      }
    }
  };
}; // special hooks helpers


const hyperRef = node => {
  return ref => {
    ref.current = node;
  };
};

const hyperSetter = (node, name, svg) => svg ? value => {
  try {
    node[name] = value;
  } catch (nope) {
    node.setAttribute(name, value);
  }
} : value => {
  node[name] = value;
}; // list of attributes that should not be directly assigned


const readOnly = /^(?:form|list)$/i; // reused every slice time

const slice = [].slice; // simplifies text node creation

const text = (node, text) => node.ownerDocument.createTextNode(text);

function Tagger(type) {
  this.type = type;
  return (0, _domtagger.default)(this);
}

;
Tagger.prototype = {
  // there are four kind of attributes, and related behavior:
  //  * events, with a name starting with `on`, to add/remove event listeners
  //  * special, with a name present in their inherited prototype, accessed directly
  //  * regular, accessed through get/setAttribute standard DOM methods
  //  * style, the only regular attribute that also accepts an object as value
  //    so that you can style=${{width: 120}}. In this case, the behavior has been
  //    fully inspired by Preact library and its simplicity.
  attribute(node, name, original) {
    const isSVG = this.type === 'svg';

    switch (name) {
      case 'class':
        if (isSVG) return hyperAttribute(node, original);
        name = 'className';

      case 'data':
      case 'props':
        return hyperProperty(node, name);

      case 'style':
        return (0, _hyperhtmlStyle.default)(node, original, isSVG);

      case 'ref':
        return hyperRef(node);

      default:
        if (name.slice(0, 1) === '.') return hyperSetter(node, name.slice(1), isSVG);
        if (name.slice(0, 2) === 'on') return hyperEvent(node, name);
        if (name in node && !(isSVG || readOnly.test(name))) return hyperProperty(node, name);
        return hyperAttribute(node, original);
    }
  },

  // in a hyper(node)`<div>${content}</div>` case
  // everything could happen:
  //  * it's a JS primitive, stored as text
  //  * it's null or undefined, the node should be cleaned
  //  * it's a promise, update the content once resolved
  //  * it's an explicit intent, perform the desired operation
  //  * it's an Array, resolve all values if Promises and/or
  //    update the node with the resulting list of content
  any(node, childNodes) {
    const diffOptions = {
      node: asNode,
      before: node
    };
    const {
      type
    } = this;
    let fastPath = false;
    let oldValue;

    const anyContent = value => {
      switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
          if (fastPath) {
            if (oldValue !== value) {
              oldValue = value;
              childNodes[0].textContent = value;
            }
          } else {
            fastPath = true;
            oldValue = value;
            childNodes = (0, _domdiff.default)(node.parentNode, childNodes, [text(node, value)], diffOptions);
          }

          break;

        case 'function':
          anyContent(value(node));
          break;

        case 'object':
        case 'undefined':
          if (value == null) {
            fastPath = false;
            childNodes = (0, _domdiff.default)(node.parentNode, childNodes, [], diffOptions);
            break;
          }

        default:
          fastPath = false;
          oldValue = value;

          if ((0, _shared.isArray)(value)) {
            if (value.length === 0) {
              if (childNodes.length) {
                childNodes = (0, _domdiff.default)(node.parentNode, childNodes, [], diffOptions);
              }
            } else {
              switch (typeof value[0]) {
                case 'string':
                case 'number':
                case 'boolean':
                  anyContent(String(value));
                  break;

                case 'function':
                  anyContent(value.map(invoke, node));
                  break;

                case 'object':
                  if ((0, _shared.isArray)(value[0])) {
                    value = value.concat.apply([], value);
                  }

                default:
                  childNodes = (0, _domdiff.default)(node.parentNode, childNodes, value, diffOptions);
                  break;
              }
            }
          } else if (canDiff(value)) {
            childNodes = (0, _domdiff.default)(node.parentNode, childNodes, value.nodeType === 11 ? slice.call(value.childNodes) : [value], diffOptions);
          } else if ('text' in value) {
            anyContent(String(value.text));
          } else if ('any' in value) {
            anyContent(value.any);
          } else if ('html' in value) {
            childNodes = (0, _domdiff.default)(node.parentNode, childNodes, slice.call((0, _createContent.default)([].concat(value.html).join(''), type).childNodes), diffOptions);
          } else if ('length' in value) {
            anyContent(slice.call(value));
          }

          break;
      }
    };

    return anyContent;
  },

  // style or textareas don't accept HTML as content
  // it's pointless to transform or analyze anything
  // different from text there but it's worth checking
  // for possible defined intents.
  text(node) {
    let oldValue;

    const textContent = value => {
      if (oldValue !== value) {
        oldValue = value;
        const type = typeof value;

        if (type === 'object' && value) {
          if ('text' in value) {
            textContent(String(value.text));
          } else if ('any' in value) {
            textContent(value.any);
          } else if ('html' in value) {
            textContent([].concat(value.html).join(''));
          } else if ('length' in value) {
            textContent(slice.call(value).join(''));
          }
        } else if (type === 'function') {
          textContent(value(node));
        } else {
          node.textContent = value == null ? '' : value;
        }
      }
    };

    return textContent;
  }

};

function invoke(callback) {
  return callback(this);
}
},{"@ungap/create-content":"../node_modules/@ungap/create-content/esm/index.js","domdiff":"../node_modules/domdiff/esm/index.js","domtagger":"../node_modules/domtagger/esm/index.js","hyperhtml-style":"../node_modules/hyperhtml-style/esm/index.js","./shared.js":"../node_modules/lighterhtml/esm/shared.js"}],"../node_modules/lighterhtml/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Hole = Hole;
exports.svg = exports.html = exports.render = exports.custom = void 0;

var _weakmap = _interopRequireDefault(require("@ungap/weakmap"));

var _templateTagArguments = _interopRequireDefault(require("@ungap/template-tag-arguments"));

var _domsanitizer = _interopRequireDefault(require("domsanitizer"));

var _tagger = require("./tagger.js");

var _shared = require("./shared.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tProto = _tagger.Tagger.prototype;
const cache = new _weakmap.default();

const createRender = Tagger => ({
  html: outer('html', Tagger),
  svg: outer('svg', Tagger),

  render(where, what) {
    const hole = typeof what === 'function' ? what() : what;
    const info = cache.get(where) || setCache(where);
    const wire = hole instanceof Hole ? retrieve(Tagger, info, hole) : hole;

    if (wire !== info.wire) {
      info.wire = wire;
      where.textContent = '';
      where.appendChild(wire.valueOf(true));
    }

    return where;
  }

});

const newInfo = () => ({
  sub: [],
  stack: [],
  wire: null
});

const outer = (type, Tagger) => {
  const cache = new _weakmap.default();

  const fixed = info => function () {
    return retrieve(Tagger, info, hole.apply(null, arguments));
  };

  const set = ref => {
    const memo = (0, _shared.create)(null);
    cache.set(ref, memo);
    return memo;
  };

  hole.for = (ref, id) => {
    const memo = cache.get(ref) || set(ref);
    return memo[id] || (memo[id] = fixed(newInfo()));
  };

  hole.node = function () {
    return retrieve(Tagger, newInfo(), hole.apply(null, arguments)).valueOf(true);
  };

  return hole;

  function hole() {
    return new Hole(type, _templateTagArguments.default.apply(null, arguments));
  }
};

const retrieve = (Tagger, info, hole) => {
  const {
    sub,
    stack
  } = info;
  const counter = {
    a: 0,
    aLength: sub.length,
    i: 0,
    iLength: stack.length
  };
  const wire = unroll(Tagger, info, hole, counter);
  const {
    a,
    i,
    aLength,
    iLength
  } = counter;
  if (a < aLength) sub.splice(a);
  if (i < iLength) stack.splice(i);
  return wire;
};

const setCache = where => {
  const info = newInfo();
  cache.set(where, info);
  return info;
};

const unroll = (Tagger, info, hole, counter) => {
  const {
    stack
  } = info;
  const {
    i,
    iLength
  } = counter;
  const {
    type,
    args
  } = hole;
  const unknown = i === iLength;
  if (unknown) counter.iLength = stack.push({
    type,
    id: args[0],
    tag: null,
    wire: null
  });
  counter.i++;
  unrollArray(Tagger, info, args, counter);
  const entry = stack[i];

  if (unknown || entry.id !== args[0] || entry.type !== type) {
    entry.type = type;
    entry.id = args[0];
    entry.tag = new Tagger(type);
    entry.wire = wiredContent(entry.tag.apply(null, args));
  } else entry.tag.apply(null, args);

  return entry.wire;
};

const unrollArray = (Tagger, info, args, counter) => {
  for (let i = 1, {
    length
  } = args; i < length; i++) {
    const hole = args[i];

    if (typeof hole === 'object' && hole) {
      if (hole instanceof Hole) args[i] = unroll(Tagger, info, hole, counter);else if ((0, _shared.isArray)(hole)) {
        for (let i = 0, {
          length
        } = hole; i < length; i++) {
          const inner = hole[i];

          if (typeof inner === 'object' && inner && inner instanceof Hole) {
            const {
              sub
            } = info;
            const {
              a,
              aLength
            } = counter;
            if (a === aLength) counter.aLength = sub.push(newInfo());
            counter.a++;
            hole[i] = retrieve(Tagger, sub[a], inner);
          }
        }
      }
    }
  }
};

const wiredContent = node => {
  const childNodes = node.childNodes;
  const {
    length
  } = childNodes;
  return length === 1 ? childNodes[0] : length ? new _shared.Wire(childNodes) : node;
};

(0, _shared.freeze)(Hole);

function Hole(type, args) {
  this.type = type;
  this.args = args;
}

;

const custom = overrides => {
  const prototype = (0, _shared.create)(tProto);
  (0, _shared.keys)(overrides).forEach(key => {
    prototype[key] = overrides[key](prototype[key] || (key === 'convert' ? _domsanitizer.default : String));
  });
  CustomTagger.prototype = prototype;
  return createRender(CustomTagger);

  function CustomTagger() {
    return _tagger.Tagger.apply(this, arguments);
  }
};

exports.custom = custom;
const {
  render,
  html,
  svg
} = createRender(_tagger.Tagger);
exports.svg = svg;
exports.html = html;
exports.render = render;
},{"@ungap/weakmap":"../node_modules/@ungap/weakmap/esm/index.js","@ungap/template-tag-arguments":"../node_modules/@ungap/template-tag-arguments/esm/index.js","domsanitizer":"../node_modules/domsanitizer/esm/index.js","./tagger.js":"../node_modules/lighterhtml/esm/tagger.js","./shared.js":"../node_modules/lighterhtml/esm/shared.js"}],"../node_modules/neverland/esm/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = html;
exports.svg = svg;
Object.defineProperty(exports, "contextual", {
  enumerable: true,
  get: function () {
    return _domAugmentor.contextual;
  }
});
Object.defineProperty(exports, "useState", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useState;
  }
});
Object.defineProperty(exports, "useEffect", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useEffect;
  }
});
Object.defineProperty(exports, "useContext", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useContext;
  }
});
Object.defineProperty(exports, "createContext", {
  enumerable: true,
  get: function () {
    return _domAugmentor.createContext;
  }
});
Object.defineProperty(exports, "useRef", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useRef;
  }
});
Object.defineProperty(exports, "useReducer", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useReducer;
  }
});
Object.defineProperty(exports, "useCallback", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useCallback;
  }
});
Object.defineProperty(exports, "useMemo", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useMemo;
  }
});
Object.defineProperty(exports, "useLayoutEffect", {
  enumerable: true,
  get: function () {
    return _domAugmentor.useLayoutEffect;
  }
});
exports.render = exports.neverland = void 0;

var _weakmap = _interopRequireDefault(require("@ungap/weakmap"));

var _templateTagArguments = _interopRequireDefault(require("@ungap/template-tag-arguments"));

var _domAugmentor = require("dom-augmentor");

var _lighterhtml = require("lighterhtml");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

/**
 * @typedef {<K>(template: TemplateStringsArray, ...values: any[]) => K} ITagFunction
 */

/**
 * An interface describing hooks counter
 * @typedef ICounter
 * @prop {number} a
 * @prop {number} aLength
 * @prop {number} i
 * @prop {number} iLength
 */

/**
 * An interface describing hooks info
 * @typedef IInfo
 * @prop {IInfo[]} [sub]
 * @prop {IEntry[]} stack
 */

/**
 * @typedef IEntry
 * @prop {any} hook
 * @prop {*} fn
 */

/**
 * @typedef {<T>(wm: WeakMap<object, T>, key: any, value: T) => T} CacheFn
 */
const {
  create
} = Object;
const {
  isArray
} = Array;
/**
 * @template Args
 * @param {(...args: Args[]) => unknown} fn
 * @returns {(...args: Args[]) => Hook}
 */

const neverland = fn => (...args) => new Hook(fn, args);
/**
 * @typedef {{
 *  (...args: any[]): Hole;
 *  for: (entry: IEntry, id?: string) => (...args: any[]) => any
 * }} IRenderer
 */

/**
 * @type {IRenderer}
 */


exports.neverland = neverland;

function html() {
  return new _lighterhtml.Hole('html', _templateTagArguments.default.apply(null, arguments));
}

;
html.for = createFor(_lighterhtml.html);
/**
 * @type {IRenderer}
 */

function svg() {
  return new _lighterhtml.Hole('svg', _templateTagArguments.default.apply(null, arguments));
}

;
svg.for = createFor(_lighterhtml.svg);
/**
 * @type {WeakMap<object, IInfo>}
 */

const hooks = new _weakmap.default();
const holes = new _weakmap.default();
/**
 * @type {CacheFn}
 */

const cache = (wm, key, value) => {
  wm.set(key, value);
  return value;
};
/**
 * @param {Node} where
 * @param {any} what
 */


const render = (where, what) => {
  const hook = typeof what === 'function' ? what() : what;

  if (hook instanceof Hook) {
    const info = hooks.get(where) || cache(hooks, where, {
      stack: []
    }); // no sub?

    return (0, _lighterhtml.render)(where, retrieve(info, hook));
  } else {
    const info = holes.get(where) || cache(holes, where, newInfo());
    const counter = createCounter(info);
    unrollArray(info, hook.args, counter);
    cleanUp(info, counter);
    return (0, _lighterhtml.render)(where, hook);
  }
};

exports.render = render;

/**
 * todo: describe cleanup
 * @param {IInfo} param0
 * @param {ICounter} param1
 */
const cleanUp = ({
  sub,
  stack
}, {
  a,
  i,
  aLength,
  iLength
}) => {
  if (a < aLength) sub.splice(a);
  if (i < iLength) stack.splice(i);
};
/**
 * todo: describe create counter
 * @param {IInfo} param0
 * @returns {ICounter}
 */


const createCounter = ({
  sub,
  stack
}) => ({
  a: 0,
  aLength: sub.length,
  i: 0,
  iLength: stack.length
});
/**
 * @param {IInfo} info
 * @param {IEntry} entry
 */


const createHook = (info, entry) => (0, _domAugmentor.augmentor)(function () {
  const hole = entry.fn.apply(null, arguments);

  if (hole instanceof _lighterhtml.Hole) {
    const counter = createCounter(info);
    unrollArray(info, hole.args, counter);
    cleanUp(info, counter);
    return view(entry, hole);
  }

  return hole;
});
/**
 * @returns {IInfo}
 */


const newInfo = () => ({
  sub: [],
  stack: []
});
/**
 * @param {IInfo} info
 * @param {Hook} hook
 */


const retrieve = (info, hook) => unroll(info, hook, {
  i: 0,
  iLength: info.stack.length
});
/**
 * @param {IInfo} param0
 * @param {Hook} param1
 * @param {Pick<ICounter, 'i' | 'iLength'>} counter why partial ICounter?
 */


const unroll = ({
  stack
}, {
  fn,
  args
}, counter) => {
  const i = counter.i++;
  const unknown = i === counter.iLength;
  if (unknown) counter.iLength = stack.push({
    fn,
    hook: null
  });
  const entry = stack[i];

  if (unknown || entry.fn !== fn) {
    entry.fn = fn;
    entry.hook = createHook(newInfo(), entry);
  }

  return entry.hook.apply(null, args);
};
/**
 * @param {IInfo} info
 * @param {any} args
 * @param {ICounter} counter
 */


const unrollArray = (info, args, counter) => {
  for (let i = 1, {
    length
  } = args; i < length; i++) {
    const hook = args[i];

    if (typeof hook === 'object' && hook) {
      if (hook instanceof Hook) args[i] = unroll(info, hook, counter);else if (hook instanceof _lighterhtml.Hole) unrollArray(info, hook.args, counter);else if (isArray(hook)) {
        for (let i = 0, {
          length
        } = hook; i < length; i++) {
          const inner = hook[i];

          if (typeof inner === 'object' && inner) {
            if (inner instanceof Hook) {
              const {
                sub
              } = info;
              const a = counter.a++;
              if (a === counter.aLength) counter.aLength = sub.push(newInfo());
              hook[i] = retrieve(sub[a], inner);
            } else if (inner instanceof _lighterhtml.Hole) unrollArray(info, inner.args, counter);
          }
        }
      }
    }
  }
};
/**
 * @param {IEntry} entry
 * @param {Hole} param1
 */


const view = (entry, {
  type,
  args
}) => (type === 'svg' ? _lighterhtml.svg : _lighterhtml.html).for(entry, type).apply(null, args);
/**
 * @class
 * @param {Function} fn
 * @param {any[]} args
 */


function Hook(fn, args) {
  this.fn = fn;
  this.args = args;
}
/**
 * @param {import('lighterhtml').Tag<HTMLElement | SVGElement>} lighter 
 */


function createFor(lighter) {
  /**
   * @type {WeakMap<IEntry, Record<string, IInfo>>}
   */
  const cache = new _weakmap.default();
  /**
   * @returns {Record<string, IInfo>}
   */

  const setCache = entry => {
    const store = create(null);
    cache.set(entry, store);
    return store;
  };

  return (
    /**
     * @param {IEntry} entry
     * @param {string} [id]
     */
    (entry, id) => {
      const store = cache.get(entry) || setCache(entry);
      const info = store[id] || (store[id] = newInfo());
      return (
        /**
         * @param {any[]} args
         */
        (...args) => {
          const counter = createCounter(info);
          unrollArray(info, args, counter);
          cleanUp(info, counter);
          return lighter.for(entry, id).apply(null, args);
        }
      );
    }
  );
}
},{"@ungap/weakmap":"../node_modules/@ungap/weakmap/esm/index.js","@ungap/template-tag-arguments":"../node_modules/@ungap/template-tag-arguments/esm/index.js","dom-augmentor":"../node_modules/dom-augmentor/esm/index.js","lighterhtml":"../node_modules/lighterhtml/esm/index.js"}],"../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../node_modules/immer/dist/immer.module.js":[function(require,module,exports) {
var process = require("process");
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDraft = isDraft;
exports.isDraftable = isDraftable;
exports.original = original;
exports.setUseProxies = exports.setAutoFreeze = exports.produceWithPatches = exports.produce = exports.nothing = exports.immerable = exports.finishDraft = exports.createDraft = exports.applyPatches = exports.Immer = exports.default = void 0;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
}

var _a;
/**
 * The sentinel value returned by producers to replace the draft with undefined.
 */


var NOTHING = typeof Symbol !== "undefined" ? Symbol("immer-nothing") : (_a = {}, _a["immer-nothing"] = true, _a);
/**
 * To let Immer treat your class instances as plain immutable objects
 * (albeit with a custom prototype), you must define either an instance property
 * or a static property on each of your custom classes.
 *
 * Otherwise, your class instance will never be drafted, which means it won't be
 * safe to mutate in a produce callback.
 */

exports.nothing = NOTHING;
var DRAFTABLE = typeof Symbol !== "undefined" && Symbol["for"] ? Symbol["for"]("immer-draftable") : "__$immer_draftable";
exports.immerable = DRAFTABLE;
var DRAFT_STATE = typeof Symbol !== "undefined" && Symbol["for"] ? Symbol["for"]("immer-state") : "__$immer_state";
/** Returns true if the given value is an Immer draft */

function isDraft(value) {
  return !!value && !!value[DRAFT_STATE];
}
/** Returns true if the given value can be drafted by Immer */


function isDraftable(value) {
  if (!value) {
    return false;
  }

  return isPlainObject(value) || !!value[DRAFTABLE] || !!value.constructor[DRAFTABLE] || isMap(value) || isSet(value);
}

function isPlainObject(value) {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (Array.isArray(value)) {
    return true;
  }

  var proto = Object.getPrototypeOf(value);
  return !proto || proto === Object.prototype;
}
/** Get the underlying object that is represented by the given draft */


function original(value) {
  if (value && value[DRAFT_STATE]) {
    return value[DRAFT_STATE].base;
  } // otherwise return undefined

} // We use Maps as `drafts` for Sets, not Objects
// See proxy.js


function assignSet(target, override) {
  override.forEach(function (value) {
    // When we add new drafts we have to remove their originals if present
    var prev = original(value);

    if (prev) {
      target["delete"](prev);
    } // @ts-ignore TODO investigate


    target.add(value);
  });
  return target;
} // We use Maps as `drafts` for Maps, not Objects
// See proxy.js


function assignMap(target, override) {
  override.forEach(function (value, key) {
    return target.set(key, value);
  });
  return target;
}

var assign = Object.assign || function (target) {
  var arguments$1 = arguments;
  var overrides = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    overrides[_i - 1] = arguments$1[_i];
  }

  overrides.forEach(function (override) {
    if (typeof override === "object" && override !== null) {
      Object.keys(override).forEach(function (key) {
        return target[key] = override[key];
      });
    }
  });
  return target;
};

var ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : typeof Object.getOwnPropertySymbols !== "undefined" ? function (obj) {
  return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj));
} : Object.getOwnPropertyNames;

function shallowCopy(base, invokeGetters) {
  if (invokeGetters === void 0) {
    invokeGetters = false;
  }

  if (Array.isArray(base)) {
    return base.slice();
  }

  if (isMap(base)) {
    return new Map(base);
  }

  if (isSet(base)) {
    return new Set(base);
  }

  var clone = Object.create(Object.getPrototypeOf(base));
  ownKeys(base).forEach(function (key) {
    if (key === DRAFT_STATE) {
      return; // Never copy over draft state.
    }

    var desc = Object.getOwnPropertyDescriptor(base, key);
    var value = desc.value;

    if (desc.get) {
      if (!invokeGetters) {
        throw new Error("Immer drafts cannot have computed properties");
      }

      value = desc.get.call(base);
    }

    if (desc.enumerable) {
      clone[key] = value;
    } else {
      Object.defineProperty(clone, key, {
        value: value,
        writable: true,
        configurable: true
      });
    }
  });
  return clone;
}

function each(obj, iter) {
  if (Array.isArray(obj) || isMap(obj) || isSet(obj)) {
    obj.forEach(function (entry, index) {
      return iter(index, entry, obj);
    });
  } else {
    ownKeys(obj).forEach(function (key) {
      return iter(key, obj[key], obj);
    });
  }
}

function isEnumerable(base, prop) {
  var desc = Object.getOwnPropertyDescriptor(base, prop);
  return desc && desc.enumerable ? true : false;
}

function has(thing, prop) {
  return isMap(thing) ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
}

function get(thing, prop) {
  return isMap(thing) ? thing.get(prop) : thing[prop];
}

function is(x, y) {
  // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

var hasSymbol = typeof Symbol !== "undefined";
var hasMap = typeof Map !== "undefined";

function isMap(target) {
  return hasMap && target instanceof Map;
}

var hasSet = typeof Set !== "undefined";

function isSet(target) {
  return hasSet && target instanceof Set;
}

function makeIterable(next) {
  var _a;

  var self;
  return self = (_a = {}, _a[Symbol.iterator] = function () {
    return self;
  }, _a.next = next, _a);
}
/** Map.prototype.values _-or-_ Map.prototype.entries */


function iterateMapValues(state, prop, receiver) {
  var isEntries = prop !== "values";
  return function () {
    var iterator = latest(state)[Symbol.iterator]();
    return makeIterable(function () {
      var result = iterator.next();

      if (!result.done) {
        var key = result.value[0];
        var value = receiver.get(key);
        result.value = isEntries ? [key, value] : value;
      }

      return result;
    });
  };
}

function makeIterateSetValues(createProxy) {
  function iterateSetValues(state, prop) {
    var isEntries = prop === "entries";
    return function () {
      var iterator = latest(state)[Symbol.iterator]();
      return makeIterable(function () {
        var result = iterator.next();

        if (!result.done) {
          var value = wrapSetValue(state, result.value);
          result.value = isEntries ? [value, value] : value;
        }

        return result;
      });
    };
  }

  function wrapSetValue(state, value) {
    var key = original(value) || value;
    var draft = state.drafts.get(key);

    if (!draft) {
      if (state.finalized || !isDraftable(value) || state.finalizing) {
        return value;
      }

      draft = createProxy(value, state);
      state.drafts.set(key, draft);

      if (state.modified) {
        state.copy.add(draft);
      }
    }

    return draft;
  }

  return iterateSetValues;
}

function latest(state) {
  return state.copy || state.base;
}

function clone(obj) {
  if (!isDraftable(obj)) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(clone);
  }

  if (isMap(obj)) {
    return new Map(obj);
  }

  if (isSet(obj)) {
    return new Set(obj);
  }

  var cloned = Object.create(Object.getPrototypeOf(obj));

  for (var key in obj) {
    cloned[key] = clone(obj[key]);
  }

  return cloned;
}

function freeze(obj, deep) {
  if (deep === void 0) {
    deep = false;
  }

  if (!isDraftable(obj) || isDraft(obj) || Object.isFrozen(obj)) {
    return;
  }

  if (isSet(obj)) {
    obj.add = obj.clear = obj["delete"] = dontMutateFrozenCollections;
  } else if (isMap(obj)) {
    obj.set = obj.clear = obj["delete"] = dontMutateFrozenCollections;
  }

  Object.freeze(obj);

  if (deep) {
    each(obj, function (_, value) {
      return freeze(value, true);
    });
  }
}

function dontMutateFrozenCollections() {
  throw new Error("This object has been frozen and should not be mutated");
}
/** Each scope represents a `produce` call. */


var ImmerScope =
/** @class */
function () {
  function ImmerScope(parent) {
    this.drafts = [];
    this.parent = parent; // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.

    this.canAutoFreeze = true; // To avoid prototype lookups:

    this.patches = null; // TODO:
  }

  ImmerScope.prototype.usePatches = function (patchListener) {
    if (patchListener) {
      this.patches = [];
      this.inversePatches = [];
      this.patchListener = patchListener;
    }
  };

  ImmerScope.prototype.revoke = function () {
    this.leave();
    this.drafts.forEach(revoke); // @ts-ignore

    this.drafts = null; // TODO: // Make draft-related methods throw.
  };

  ImmerScope.prototype.leave = function () {
    if (this === ImmerScope.current) {
      ImmerScope.current = this.parent;
    }
  };

  ImmerScope.enter = function () {
    var scope = new ImmerScope(ImmerScope.current);
    ImmerScope.current = scope;
    return scope;
  };

  return ImmerScope;
}();

function revoke(draft) {
  draft[DRAFT_STATE].revoke();
}

function willFinalize(scope, result, isReplaced) {
  scope.drafts.forEach(function (draft) {
    draft[DRAFT_STATE].finalizing = true;
  });

  if (!isReplaced) {
    if (scope.patches) {
      markChangesRecursively(scope.drafts[0]);
    } // This is faster when we don't care about which attributes changed.


    markChangesSweep(scope.drafts);
  } // When a child draft is returned, look for changes.
  else if (isDraft(result) && result[DRAFT_STATE].scope === scope) {
      markChangesSweep(scope.drafts);
    }
}

function createProxy(base, parent) {
  var isArray = Array.isArray(base);
  var draft = clonePotentialDraft(base);

  if (isMap(base)) {
    proxyMap(draft);
  } else if (isSet(base)) {
    proxySet(draft);
  } else {
    each(draft, function (prop) {
      proxyProperty(draft, prop, isArray || isEnumerable(base, prop));
    });
  } // See "proxy.js" for property documentation.


  var scope = parent ? parent.scope : ImmerScope.current;
  var state = {
    scope: scope,
    modified: false,
    finalizing: false,
    finalized: false,
    assigned: isMap(base) ? new Map() : {},
    parent: parent,
    base: base,
    draft: draft,
    drafts: isSet(base) ? new Map() : null,
    copy: null,
    revoke: revoke$1,
    revoked: false // es5 only

  };
  createHiddenProperty(draft, DRAFT_STATE, state);
  scope.drafts.push(draft);
  return draft;
}

function revoke$1() {
  this.revoked = true;
}

function latest$1(state) {
  return state.copy || state.base;
} // Access a property without creating an Immer draft.


function peek(draft, prop) {
  var state = draft[DRAFT_STATE];

  if (state && !state.finalizing) {
    state.finalizing = true;
    var value = draft[prop];
    state.finalizing = false;
    return value;
  }

  return draft[prop];
}

function get$1(state, prop) {
  assertUnrevoked(state);
  var value = peek(latest$1(state), prop);

  if (state.finalizing) {
    return value;
  } // Create a draft if the value is unmodified.


  if (value === peek(state.base, prop) && isDraftable(value)) {
    prepareCopy(state);
    return state.copy[prop] = createProxy(value, state);
  }

  return value;
}

function set(state, prop, value) {
  assertUnrevoked(state);
  state.assigned[prop] = true;

  if (!state.modified) {
    if (is(value, peek(latest$1(state), prop))) {
      return;
    }

    markChanged(state);
    prepareCopy(state);
  }

  state.copy[prop] = value;
}

function markChanged(state) {
  if (!state.modified) {
    state.modified = true;

    if (state.parent) {
      markChanged(state.parent);
    }
  }
}

function prepareCopy(state) {
  if (!state.copy) {
    state.copy = clonePotentialDraft(state.base);
  }
}

function clonePotentialDraft(base) {
  var state = base && base[DRAFT_STATE];

  if (state) {
    state.finalizing = true;
    var draft = shallowCopy(state.draft, true);
    state.finalizing = false;
    return draft;
  }

  return shallowCopy(base);
} // property descriptors are recycled to make sure we don't create a get and set closure per property,
// but share them all instead


var descriptors = {};

function proxyProperty(draft, prop, enumerable) {
  var desc = descriptors[prop];

  if (desc) {
    desc.enumerable = enumerable;
  } else {
    descriptors[prop] = desc = {
      configurable: true,
      enumerable: enumerable,
      get: function () {
        return get$1(this[DRAFT_STATE], prop);
      },
      set: function (value) {
        set(this[DRAFT_STATE], prop, value);
      }
    };
  }

  Object.defineProperty(draft, prop, desc);
}

function proxyMap(target) {
  Object.defineProperties(target, mapTraps);

  if (hasSymbol) {
    Object.defineProperty(target, Symbol.iterator, // @ts-ignore
    proxyMethod(iterateMapValues) //TODO: , Symbol.iterator)
    );
  }
}

var mapTraps = finalizeTraps({
  size: function (state) {
    return latest$1(state).size;
  },
  has: function (state) {
    return function (key) {
      return latest$1(state).has(key);
    };
  },
  set: function (state) {
    return function (key, value) {
      if (latest$1(state).get(key) !== value) {
        prepareCopy(state);
        markChanged(state);
        state.assigned.set(key, true);
        state.copy.set(key, value);
      }

      return state.draft;
    };
  },
  "delete": function (state) {
    return function (key) {
      prepareCopy(state);
      markChanged(state);
      state.assigned.set(key, false);
      state.copy["delete"](key);
      return false;
    };
  },
  clear: function (state) {
    return function () {
      if (!state.copy) {
        prepareCopy(state);
      }

      markChanged(state);
      state.assigned = new Map();

      for (var _i = 0, _a = latest$1(state).keys(); _i < _a.length; _i++) {
        var key = _a[_i];
        state.assigned.set(key, false);
      }

      return state.copy.clear();
    };
  },
  forEach: function (state, key, reciever) {
    return function (cb) {
      latest$1(state).forEach(function (value, key, map) {
        cb(reciever.get(key), key, map);
      });
    };
  },
  get: function (state) {
    return function (key) {
      var value = latest$1(state).get(key);

      if (state.finalizing || state.finalized || !isDraftable(value)) {
        return value;
      }

      if (value !== state.base.get(key)) {
        return value;
      }

      var draft = createProxy(value, state);
      prepareCopy(state);
      state.copy.set(key, draft);
      return draft;
    };
  },
  keys: function (state) {
    return function () {
      return latest$1(state).keys();
    };
  },
  values: iterateMapValues,
  entries: iterateMapValues
});

function proxySet(target) {
  Object.defineProperties(target, setTraps);

  if (hasSymbol) {
    Object.defineProperty(target, Symbol.iterator, // @ts-ignore
    proxyMethod(iterateSetValues) //TODO: , Symbol.iterator)
    );
  }
}

var iterateSetValues = makeIterateSetValues(createProxy);
var setTraps = finalizeTraps({
  size: function (state) {
    return latest$1(state).size;
  },
  add: function (state) {
    return function (value) {
      if (!latest$1(state).has(value)) {
        markChanged(state);

        if (!state.copy) {
          prepareCopy(state);
        }

        state.copy.add(value);
      }

      return state.draft;
    };
  },
  "delete": function (state) {
    return function (value) {
      markChanged(state);

      if (!state.copy) {
        prepareCopy(state);
      }

      return state.copy["delete"](value);
    };
  },
  has: function (state) {
    return function (key) {
      return latest$1(state).has(key);
    };
  },
  clear: function (state) {
    return function () {
      markChanged(state);

      if (!state.copy) {
        prepareCopy(state);
      }

      return state.copy.clear();
    };
  },
  keys: iterateSetValues,
  entries: iterateSetValues,
  values: iterateSetValues,
  forEach: function (state) {
    return function (cb, thisArg) {
      var iterator = iterateSetValues(state)();
      var result = iterator.next();

      while (!result.done) {
        cb.call(thisArg, result.value, result.value, state.draft);
        result = iterator.next();
      }
    };
  }
});

function finalizeTraps(traps) {
  return Object.keys(traps).reduce(function (acc, key) {
    var builder = key === "size" ? proxyAttr : proxyMethod;
    acc[key] = builder(traps[key], key);
    return acc;
  }, {});
}

function proxyAttr(fn) {
  return {
    get: function () {
      var state = this[DRAFT_STATE];
      assertUnrevoked(state);
      return fn(state);
    }
  };
}

function proxyMethod(trap, key) {
  return {
    get: function () {
      return function () {
        var arguments$1 = arguments;
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments$1[_i];
        }

        var state = this[DRAFT_STATE];
        assertUnrevoked(state);
        return trap(state, key, state.draft).apply(void 0, args);
      };
    }
  };
}

function assertUnrevoked(state) {
  if (state.revoked === true) {
    throw new Error("Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + JSON.stringify(latest$1(state)));
  }
} // This looks expensive, but only proxies are visited, and only objects without known changes are scanned.


function markChangesSweep(drafts) {
  // The natural order of drafts in the `scope` array is based on when they
  // were accessed. By processing drafts in reverse natural order, we have a
  // better chance of processing leaf nodes first. When a leaf node is known to
  // have changed, we can avoid any traversal of its ancestor nodes.
  for (var i = drafts.length - 1; i >= 0; i--) {
    var state = drafts[i][DRAFT_STATE];

    if (!state.modified) {
      if (Array.isArray(state.base)) {
        if (hasArrayChanges(state)) {
          markChanged(state);
        }
      } else if (isMap(state.base)) {
        if (hasMapChanges(state)) {
          markChanged(state);
        }
      } else if (isSet(state.base)) {
        if (hasSetChanges(state)) {
          markChanged(state);
        }
      } else if (hasObjectChanges(state)) {
        markChanged(state);
      }
    }
  }
}

function markChangesRecursively(object) {
  if (!object || typeof object !== "object") {
    return;
  }

  var state = object[DRAFT_STATE];

  if (!state) {
    return;
  }

  var base = state.base,
      draft = state.draft,
      assigned = state.assigned;

  if (!Array.isArray(object)) {
    // Look for added keys.
    Object.keys(draft).forEach(function (key) {
      // The `undefined` check is a fast path for pre-existing keys.
      if (base[key] === undefined && !has(base, key)) {
        assigned[key] = true;
        markChanged(state);
      } else if (!assigned[key]) {
        // Only untouched properties trigger recursion.
        markChangesRecursively(draft[key]);
      }
    }); // Look for removed keys.

    Object.keys(base).forEach(function (key) {
      // The `undefined` check is a fast path for pre-existing keys.
      if (draft[key] === undefined && !has(draft, key)) {
        assigned[key] = false;
        markChanged(state);
      }
    });
  } else if (hasArrayChanges(state)) {
    markChanged(state);
    assigned.length = true;

    if (draft.length < base.length) {
      for (var i = draft.length; i < base.length; i++) {
        assigned[i] = false;
      }
    } else {
      for (var i = base.length; i < draft.length; i++) {
        assigned[i] = true;
      }
    }

    for (var i = 0; i < draft.length; i++) {
      // Only untouched indices trigger recursion.
      if (assigned[i] === undefined) {
        markChangesRecursively(draft[i]);
      }
    }
  }
}

function hasObjectChanges(state) {
  var base = state.base,
      draft = state.draft; // Search for added keys and changed keys. Start at the back, because
  // non-numeric keys are ordered by time of definition on the object.

  var keys = Object.keys(draft);

  for (var i = keys.length - 1; i >= 0; i--) {
    var key = keys[i];
    var baseValue = base[key]; // The `undefined` check is a fast path for pre-existing keys.

    if (baseValue === undefined && !has(base, key)) {
      return true;
    } // Once a base key is deleted, future changes go undetected, because its
    // descriptor is erased. This branch detects any missed changes.
    else {
        var value = draft[key];
        var state_1 = value && value[DRAFT_STATE];

        if (state_1 ? state_1.base !== baseValue : !is(value, baseValue)) {
          return true;
        }
      }
  } // At this point, no keys were added or changed.
  // Compare key count to determine if keys were deleted.


  return keys.length !== Object.keys(base).length;
}

function hasArrayChanges(state) {
  var draft = state.draft;

  if (draft.length !== state.base.length) {
    return true;
  } // See #116
  // If we first shorten the length, our array interceptors will be removed.
  // If after that new items are added, result in the same original length,
  // those last items will have no intercepting property.
  // So if there is no own descriptor on the last position, we know that items were removed and added
  // N.B.: splice, unshift, etc only shift values around, but not prop descriptors, so we only have to check
  // the last one


  var descriptor = Object.getOwnPropertyDescriptor(draft, draft.length - 1); // descriptor can be null, but only for newly created sparse arrays, eg. new Array(10)

  if (descriptor && !descriptor.get) {
    return true;
  } // For all other cases, we don't have to compare, as they would have been picked up by the index setters


  return false;
}

function hasMapChanges(state) {
  var base = state.base,
      draft = state.draft;

  if (base.size !== draft.size) {
    return true;
  } // IE11 supports only forEach iteration


  var hasChanges = false;
  draft.forEach(function (value, key) {
    if (!hasChanges) {
      hasChanges = isDraftable(value) ? value.modified : value !== base.get(key);
    }
  });
  return hasChanges;
}

function hasSetChanges(state) {
  var base = state.base,
      draft = state.draft;

  if (base.size !== draft.size) {
    return true;
  } // IE11 supports only forEach iteration


  var hasChanges = false;
  draft.forEach(function (value, key) {
    if (!hasChanges) {
      hasChanges = isDraftable(value) ? value.modified : !base.has(key);
    }
  });
  return hasChanges;
}

function createHiddenProperty(target, prop, value) {
  Object.defineProperty(target, prop, {
    value: value,
    enumerable: false,
    writable: true
  });
}

var legacyProxy =
/*#__PURE__*/
Object.freeze({
  __proto__: null,
  willFinalize: willFinalize,
  createProxy: createProxy
});

var _a$1, _b;

function willFinalize$1() {}
/**
 * Returns a new draft of the `base` object.
 *
 * The second argument is the parent draft-state (used internally).
 */


function createProxy$1(base, parent) {
  var scope = parent ? parent.scope : ImmerScope.current;
  var state = {
    // Track which produce call this is associated with.
    scope: scope,
    // True for both shallow and deep changes.
    modified: false,
    // Used during finalization.
    finalized: false,
    // Track which properties have been assigned (true) or deleted (false).
    assigned: {},
    // The parent draft state.
    parent: parent,
    // The base state.
    base: base,
    // The base proxy.
    draft: null,
    // Any property proxies.
    drafts: {},
    // The base copy with any updated values.
    copy: null,
    // Called by the `produce` function.
    revoke: null
  }; // the traps must target something, a bit like the 'real' base.
  // but also, we need to be able to determine from the target what the relevant state is
  // (to avoid creating traps per instance to capture the state in closure,
  // and to avoid creating weird hidden properties as well)
  // So the trick is to use 'state' as the actual 'target'! (and make sure we intercept everything)
  // Note that in the case of an array, we put the state in an array to have better Reflect defaults ootb

  var target = state;
  var traps = objectTraps;

  if (Array.isArray(base)) {
    target = [state];
    traps = arrayTraps;
  } // Map drafts must support object keys, so we use Map objects to track changes.
  else if (isMap(base)) {
      traps = mapTraps$1;
      state.drafts = new Map();
      state.assigned = new Map();
    } // Set drafts use a Map object to track which of its values are drafted.
    // And we don't need the "assigned" property, because Set objects have no keys.
    else if (isSet(base)) {
        traps = setTraps$1;
        state.drafts = new Map();
      }

  var _a = Proxy.revocable(target, traps),
      revoke = _a.revoke,
      proxy = _a.proxy;

  state.draft = proxy;
  state.revoke = revoke;
  scope.drafts.push(proxy);
  return proxy;
}
/**
 * Object drafts
 */


var objectTraps = {
  get: function (state, prop) {
    if (prop === DRAFT_STATE) {
      return state;
    }

    var drafts = state.drafts; // Check for existing draft in unmodified state.

    if (!state.modified && has(drafts, prop)) {
      return drafts[prop];
    }

    var value = latest$2(state)[prop];

    if (state.finalized || !isDraftable(value)) {
      return value;
    } // Check for existing draft in modified state.


    if (state.modified) {
      // Assigned values are never drafted. This catches any drafts we created, too.
      if (value !== peek$1(state.base, prop)) {
        return value;
      } // Store drafts on the copy (when one exists).


      drafts = state.copy;
    }

    return drafts[prop] = createProxy$1(value, state);
  },
  has: function (state, prop) {
    return prop in latest$2(state);
  },
  ownKeys: function (state) {
    return Reflect.ownKeys(latest$2(state));
  },
  set: function (state, prop, value) {
    if (!state.modified) {
      var baseValue = peek$1(state.base, prop); // Optimize based on value's truthiness. Truthy values are guaranteed to
      // never be undefined, so we can avoid the `in` operator. Lastly, truthy
      // values may be drafts, but falsy values are never drafts.

      var isUnchanged = value ? is(baseValue, value) || value === state.drafts[prop] : is(baseValue, value) && prop in state.base;

      if (isUnchanged) {
        return true;
      }

      markChanged$1(state);
    }

    state.assigned[prop] = true;
    state.copy[prop] = value;
    return true;
  },
  deleteProperty: function (state, prop) {
    // The `undefined` check is a fast path for pre-existing keys.
    if (peek$1(state.base, prop) !== undefined || prop in state.base) {
      state.assigned[prop] = false;
      markChanged$1(state);
    } else if (state.assigned[prop]) {
      // if an originally not assigned property was deleted
      delete state.assigned[prop];
    }

    if (state.copy) {
      delete state.copy[prop];
    }

    return true;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor: function (state, prop) {
    var owner = latest$2(state);
    var desc = Reflect.getOwnPropertyDescriptor(owner, prop);

    if (desc) {
      desc.writable = true;
      desc.configurable = !Array.isArray(owner) || prop !== "length";
    }

    return desc;
  },
  defineProperty: function () {
    throw new Error("Object.defineProperty() cannot be used on an Immer draft"); // prettier-ignore
  },
  getPrototypeOf: function (state) {
    return Object.getPrototypeOf(state.base);
  },
  setPrototypeOf: function () {
    throw new Error("Object.setPrototypeOf() cannot be used on an Immer draft"); // prettier-ignore
  }
};
/**
 * Array drafts
 */

var arrayTraps = {};
each(objectTraps, function (key, fn) {
  arrayTraps[key] = function () {
    arguments[0] = arguments[0][0];
    return fn.apply(this, arguments);
  };
});

arrayTraps.deleteProperty = function (state, prop) {
  if (isNaN(parseInt(prop))) {
    throw new Error("Immer only supports deleting array indices"); // prettier-ignore
  }

  return objectTraps.deleteProperty.call(this, state[0], prop);
};

arrayTraps.set = function (state, prop, value) {
  if (prop !== "length" && isNaN(parseInt(prop))) {
    throw new Error("Immer only supports setting array indices and the 'length' property"); // prettier-ignore
  }

  return objectTraps.set.call(this, state[0], prop, value, state[0]);
}; // Used by Map and Set drafts


var reflectTraps = makeReflectTraps(["ownKeys", "has", "set", "deleteProperty", "defineProperty", "getOwnPropertyDescriptor", "preventExtensions", "isExtensible", "getPrototypeOf"]);
/**
 * Map drafts
 */

var mapTraps$1 = makeTrapsForGetters((_a$1 = {}, _a$1[DRAFT_STATE] = function (state) {
  return state;
}, _a$1.size = function (state) {
  return latest$2(state).size;
}, _a$1.has = function (state) {
  return function (key) {
    return latest$2(state).has(key);
  };
}, _a$1.set = function (state) {
  return function (key, value) {
    var values = latest$2(state);

    if (!values.has(key) || values.get(key) !== value) {
      markChanged$1(state); // @ts-ignore

      state.assigned.set(key, true);
      state.copy.set(key, value);
    }

    return state.draft;
  };
}, _a$1["delete"] = function (state) {
  return function (key) {
    if (latest$2(state).has(key)) {
      markChanged$1(state); // @ts-ignore

      state.assigned.set(key, false);
      return state.copy["delete"](key);
    }

    return false;
  };
}, _a$1.clear = function (state) {
  return function () {
    markChanged$1(state);
    state.assigned = new Map();
    each(latest$2(state).keys(), function (_, key) {
      // @ts-ignore
      state.assigned.set(key, false);
    });
    return state.copy.clear();
  };
}, // @ts-ignore
_a$1.forEach = function (state, _, receiver) {
  return function (cb, thisArg) {
    return latest$2(state).forEach(function (_, key, map) {
      var value = receiver.get(key);
      cb.call(thisArg, value, key, map);
    });
  };
}, _a$1.get = function (state) {
  return function (key) {
    var drafts = state.modified ? state.copy : state.drafts; // @ts-ignore TODO: ...or fix by using different ES6Draft types (but better just unify to maps)

    if (drafts.has(key)) {
      // @ts-ignore
      var value_1 = drafts.get(key);

      if (isDraft(value_1) || !isDraftable(value_1)) {
        return value_1;
      }

      var draft_1 = createProxy$1(value_1, state); // @ts-ignore

      drafts.set(key, draft_1);
      return draft_1;
    }

    var value = latest$2(state).get(key);

    if (state.finalized || !isDraftable(value)) {
      return value;
    }

    var draft = createProxy$1(value, state); //@ts-ignore

    drafts.set(key, draft);
    return draft;
  };
}, _a$1.keys = function (state) {
  return function () {
    return latest$2(state).keys();
  };
}, //@ts-ignore
_a$1.values = iterateMapValues, //@ts-ignore
_a$1.entries = iterateMapValues, _a$1[hasSymbol ? Symbol.iterator : "@@iterator"] = iterateMapValues, _a$1));
var iterateSetValues$1 = makeIterateSetValues(createProxy$1);
/**
 * Set drafts
 */

var setTraps$1 = makeTrapsForGetters((_b = {}, //@ts-ignore
_b[DRAFT_STATE] = function (state) {
  return state;
}, _b.size = function (state) {
  return latest$2(state).size;
}, _b.has = function (state) {
  return function (key) {
    return latest$2(state).has(key);
  };
}, _b.add = function (state) {
  return function (value) {
    if (!latest$2(state).has(value)) {
      markChanged$1(state); //@ts-ignore

      state.copy.add(value);
    }

    return state.draft;
  };
}, _b["delete"] = function (state) {
  return function (value) {
    markChanged$1(state); //@ts-ignore

    return state.copy["delete"](value);
  };
}, _b.clear = function (state) {
  return function () {
    markChanged$1(state); //@ts-ignore

    return state.copy.clear();
  };
}, _b.forEach = function (state) {
  return function (cb, thisArg) {
    var iterator = iterateSetValues$1(state)();
    var result = iterator.next();

    while (!result.done) {
      cb.call(thisArg, result.value, result.value, state.draft);
      result = iterator.next();
    }
  };
}, _b.keys = iterateSetValues$1, _b.values = iterateSetValues$1, _b.entries = iterateSetValues$1, _b[hasSymbol ? Symbol.iterator : "@@iterator"] = iterateSetValues$1, _b));
/**
 * Helpers
 */
// Retrieve the latest values of the draft.

function latest$2(state) {
  return state.copy || state.base;
} // Access a property without creating an Immer draft.


function peek$1(draft, prop) {
  var state = draft[DRAFT_STATE];
  var desc = Reflect.getOwnPropertyDescriptor(state ? latest$2(state) : draft, prop);
  return desc && desc.value;
}

function markChanged$1(state) {
  if (!state.modified) {
    state.modified = true;
    var base = state.base,
        drafts = state.drafts,
        parent = state.parent;
    var copy = shallowCopy(base);

    if (isSet(base)) {
      // Note: The `drafts` property is preserved for Set objects, since
      // we need to keep track of which values are drafted.
      assignSet(copy, drafts);
    } else {
      // Merge nested drafts into the copy.
      if (isMap(base)) {
        assignMap(copy, drafts);
      } else {
        assign(copy, drafts);
      }

      state.drafts = null;
    }

    state.copy = copy;

    if (parent) {
      markChanged$1(parent);
    }
  }
}
/** Create traps that all use the `Reflect` API on the `latest(state)` */


function makeReflectTraps(names) {
  return names.reduce(function (traps, name) {
    // @ts-ignore
    traps[name] = function (state) {
      var arguments$1 = arguments;
      var args = [];

      for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments$1[_i];
      }

      return Reflect[name].apply(Reflect, __spreadArrays([latest$2(state)], args));
    };

    return traps;
  }, {});
}

function makeTrapsForGetters(getters) {
  return assign({}, reflectTraps, {
    get: function (state, prop, receiver) {
      return getters.hasOwnProperty(prop) ? getters[prop](state, prop, receiver) : Reflect.get(state, prop, receiver);
    },
    setPrototypeOf: function (state) {
      throw new Error("Object.setPrototypeOf() cannot be used on an Immer draft"); // prettier-ignore
    }
  });
}

var modernProxy =
/*#__PURE__*/
Object.freeze({
  __proto__: null,
  willFinalize: willFinalize$1,
  createProxy: createProxy$1
});

function generatePatches(state, basePath, patches, inversePatches) {
  var generatePatchesFn = Array.isArray(state.base) ? generateArrayPatches : isSet(state.base) ? generateSetPatches : generatePatchesFromAssigned;
  generatePatchesFn(state, basePath, patches, inversePatches);
}

function generateArrayPatches(state, basePath, patches, inversePatches) {
  var _a, _b;

  var base = state.base,
      copy = state.copy,
      assigned = state.assigned; // Reduce complexity by ensuring `base` is never longer.

  if (copy.length < base.length) {
    _a = [copy, base], base = _a[0], copy = _a[1];
    _b = [inversePatches, patches], patches = _b[0], inversePatches = _b[1];
  }

  var delta = copy.length - base.length; // Find the first replaced index.

  var start = 0;

  while (base[start] === copy[start] && start < base.length) {
    ++start;
  } // Find the last replaced index. Search from the end to optimize splice patches.


  var end = base.length;

  while (end > start && base[end - 1] === copy[end + delta - 1]) {
    --end;
  } // Process replaced indices.


  for (var i = start; i < end; ++i) {
    if (assigned[i] && copy[i] !== base[i]) {
      var path = basePath.concat([i]);
      patches.push({
        op: "replace",
        path: path,
        value: copy[i]
      });
      inversePatches.push({
        op: "replace",
        path: path,
        value: base[i]
      });
    }
  }

  var replaceCount = patches.length; // Process added indices.

  for (var i = end + delta - 1; i >= end; --i) {
    var path = basePath.concat([i]);
    patches[replaceCount + i - end] = {
      op: "add",
      path: path,
      value: copy[i]
    };
    inversePatches.push({
      op: "remove",
      path: path
    });
  }
} // This is used for both Map objects and normal objects.


function generatePatchesFromAssigned(state, basePath, patches, inversePatches) {
  var base = state.base,
      copy = state.copy;
  each(state.assigned, function (key, assignedValue) {
    var origValue = get(base, key);
    var value = get(copy, key);
    var op = !assignedValue ? "remove" : has(base, key) ? "replace" : "add";

    if (origValue === value && op === "replace") {
      return;
    }

    var path = basePath.concat(key);
    patches.push(op === "remove" ? {
      op: op,
      path: path
    } : {
      op: op,
      path: path,
      value: value
    });
    inversePatches.push(op === "add" ? {
      op: "remove",
      path: path
    } : op === "remove" ? {
      op: "add",
      path: path,
      value: origValue
    } : {
      op: "replace",
      path: path,
      value: origValue
    });
  });
}

function generateSetPatches(state, basePath, patches, inversePatches) {
  var base = state.base,
      copy = state.copy;
  var i = 0;
  base.forEach(function (value) {
    if (!copy.has(value)) {
      var path = basePath.concat([i]);
      patches.push({
        op: "remove",
        path: path,
        value: value
      });
      inversePatches.unshift({
        op: "add",
        path: path,
        value: value
      });
    }

    i++;
  });
  i = 0;
  copy.forEach(function (value) {
    if (!base.has(value)) {
      var path = basePath.concat([i]);
      patches.push({
        op: "add",
        path: path,
        value: value
      });
      inversePatches.unshift({
        op: "remove",
        path: path,
        value: value
      });
    }

    i++;
  });
}

function applyPatches(draft, patches) {
  patches.forEach(function (patch) {
    var path = patch.path,
        op = patch.op;

    if (!path.length) {
      throw new Error("Illegal state");
    }

    var base = draft;

    for (var i = 0; i < path.length - 1; i++) {
      base = get(base, path[i]);

      if (!base || typeof base !== "object") {
        throw new Error("Cannot apply patch, path doesn't resolve: " + path.join("/"));
      } // prettier-ignore

    }

    var value = clone(patch.value); // used to clone patch to ensure original patch is not modified, see #411

    var key = path[path.length - 1];

    switch (op) {
      case "replace":
        if (isMap(base)) {
          base.set(key, value);
        } else if (isSet(base)) {
          throw new Error('Sets cannot have "replace" patches.');
        } else {
          // if value is an object, then it's assigned by reference
          // in the following add or remove ops, the value field inside the patch will also be modifyed
          // so we use value from the cloned patch
          base[key] = value;
        }

        break;

      case "add":
        if (isSet(base)) {
          base["delete"](patch.value);
        }

        Array.isArray(base) ? base.splice(key, 0, value) : isMap(base) ? base.set(key, value) : isSet(base) ? base.add(value) : base[key] = value;
        break;

      case "remove":
        Array.isArray(base) ? base.splice(key, 1) : isMap(base) ? base["delete"](key) : isSet(base) ? base["delete"](patch.value) : delete base[key];
        break;

      default:
        throw new Error("Unsupported patch operation: " + op);
    }
  });
  return draft;
}

function verifyMinified() {}

var configDefaults = {
  useProxies: typeof Proxy !== "undefined" && typeof Proxy.revocable !== "undefined" && typeof Reflect !== "undefined",
  autoFreeze: typeof process !== "undefined" ? "development" !== "production" : verifyMinified.name === "verifyMinified",
  onAssign: null,
  onDelete: null,
  onCopy: null
};

var Immer =
/** @class */
function () {
  function Immer(config) {
    this.useProxies = false;
    this.autoFreeze = false;
    assign(this, configDefaults, config);
    this.setUseProxies(this.useProxies);
    this.produce = this.produce.bind(this);
    this.produceWithPatches = this.produceWithPatches.bind(this);
  }
  /**
   * The `produce` function takes a value and a "recipe function" (whose
   * return value often depends on the base state). The recipe function is
   * free to mutate its first argument however it wants. All mutations are
   * only ever applied to a __copy__ of the base state.
   *
   * Pass only a function to create a "curried producer" which relieves you
   * from passing the recipe function every time.
   *
   * Only plain objects and arrays are made mutable. All other objects are
   * considered uncopyable.
   *
   * Note: This function is __bound__ to its `Immer` instance.
   *
   * @param {any} base - the initial state
   * @param {Function} producer - function that receives a proxy of the base state as first argument and which can be freely modified
   * @param {Function} patchListener - optional function that will be called with all the patches produced here
   * @returns {any} a new state, or the initial state if nothing was modified
   */


  Immer.prototype.produce = function (base, recipe, patchListener) {
    var _this = this; // curried invocation


    if (typeof base === "function" && typeof recipe !== "function") {
      var defaultBase_1 = recipe;
      recipe = base;
      var self_1 = this;
      return function curriedProduce(base) {
        var arguments$1 = arguments;

        var _this = this;

        if (base === void 0) {
          base = defaultBase_1;
        }

        var args = [];

        for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments$1[_i];
        }

        return self_1.produce(base, function (draft) {
          return recipe.call.apply(recipe, __spreadArrays([_this, draft], args));
        }); // prettier-ignore
      };
    } // prettier-ignore


    {
      if (typeof recipe !== "function") {
        throw new Error("The first or second argument to `produce` must be a function");
      }

      if (patchListener !== undefined && typeof patchListener !== "function") {
        throw new Error("The third argument to `produce` must be a function or undefined");
      }
    }
    var result; // Only plain objects, arrays, and "immerable classes" are drafted.

    if (isDraftable(base)) {
      var scope_1 = ImmerScope.enter();
      var proxy = this.createProxy(base);
      var hasError = true;

      try {
        result = recipe(proxy);
        hasError = false;
      } finally {
        // finally instead of catch + rethrow better preserves original stack
        if (hasError) {
          scope_1.revoke();
        } else {
          scope_1.leave();
        }
      }

      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then(function (result) {
          scope_1.usePatches(patchListener);
          return _this.processResult(result, scope_1);
        }, function (error) {
          scope_1.revoke();
          throw error;
        });
      }

      scope_1.usePatches(patchListener);
      return this.processResult(result, scope_1);
    } else {
      result = recipe(base);

      if (result === NOTHING) {
        return undefined;
      }

      if (result === undefined) {
        result = base;
      }

      this.maybeFreeze(result, true);
      return result;
    }
  };

  Immer.prototype.produceWithPatches = function (arg1, arg2, arg3) {
    var _this = this;

    if (typeof arg1 === "function") {
      return function (state) {
        var arguments$1 = arguments;
        var args = [];

        for (var _i = 1; _i < arguments.length; _i++) {
          args[_i - 1] = arguments$1[_i];
        }

        return _this.produceWithPatches(state, function (draft) {
          return arg1.apply(void 0, __spreadArrays([draft], args));
        });
      };
    } // non-curried form


    if (arg3) {
      throw new Error("A patch listener cannot be passed to produceWithPatches");
    }

    var patches, inversePatches;
    var nextState = this.produce(arg1, arg2, function (p, ip) {
      patches = p;
      inversePatches = ip;
    });
    return [nextState, patches, inversePatches];
  };

  Immer.prototype.createDraft = function (base) {
    if (!isDraftable(base)) {
      throw new Error("First argument to `createDraft` must be a plain object, an array, or an immerable object"); // prettier-ignore
    }

    var scope = ImmerScope.enter();
    var proxy = this.createProxy(base);
    proxy[DRAFT_STATE].isManual = true;
    scope.leave();
    return proxy;
  };

  Immer.prototype.finishDraft = function (draft, patchListener) {
    var state = draft && draft[DRAFT_STATE];

    if (!state || !state.isManual) {
      throw new Error("First argument to `finishDraft` must be a draft returned by `createDraft`"); // prettier-ignore
    }

    if (state.finalized) {
      throw new Error("The given draft is already finalized"); // prettier-ignore
    }

    var scope = state.scope;
    scope.usePatches(patchListener);
    return this.processResult(undefined, scope);
  };
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is disabled in production.
   */


  Immer.prototype.setAutoFreeze = function (value) {
    this.autoFreeze = value;
  };
  /**
   * Pass true to use the ES2015 `Proxy` class when creating drafts, which is
   * always faster than using ES5 proxies.
   *
   * By default, feature detection is used, so calling this is rarely necessary.
   */


  Immer.prototype.setUseProxies = function (value) {
    this.useProxies = value;
    assign(this, value ? modernProxy : legacyProxy);
  };

  Immer.prototype.applyPatches = function (base, patches) {
    // If a patch replaces the entire state, take that replacement as base
    // before applying patches
    var i;

    for (i = patches.length - 1; i >= 0; i--) {
      var patch = patches[i];

      if (patch.path.length === 0 && patch.op === "replace") {
        base = patch.value;
        break;
      }
    }

    if (isDraft(base)) {
      // N.B: never hits if some patch a replacement, patches are never drafts
      return applyPatches(base, patches);
    } // Otherwise, produce a copy of the base state.


    return this.produce(base, function (draft) {
      return applyPatches(draft, patches.slice(i + 1));
    });
  };
  /** @internal */


  Immer.prototype.processResult = function (result, scope) {
    var baseDraft = scope.drafts[0];
    var isReplaced = result !== undefined && result !== baseDraft;
    this.willFinalize(scope, result, isReplaced);

    if (isReplaced) {
      if (baseDraft[DRAFT_STATE].modified) {
        scope.revoke();
        throw new Error("An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft."); // prettier-ignore
      }

      if (isDraftable(result)) {
        // Finalize the result in case it contains (or is) a subset of the draft.
        result = this.finalize(result, null, scope);
        this.maybeFreeze(result);
      }

      if (scope.patches) {
        scope.patches.push({
          op: "replace",
          path: [],
          value: result
        });
        scope.inversePatches.push({
          op: "replace",
          path: [],
          value: baseDraft[DRAFT_STATE].base
        });
      }
    } else {
      // Finalize the base draft.
      result = this.finalize(baseDraft, [], scope);
    }

    scope.revoke();

    if (scope.patches) {
      scope.patchListener(scope.patches, scope.inversePatches);
    }

    return result !== NOTHING ? result : undefined;
  };
  /**
   * @internal
   * Finalize a draft, returning either the unmodified base state or a modified
   * copy of the base state.
   */


  Immer.prototype.finalize = function (draft, path, scope) {
    var _this = this;

    var state = draft[DRAFT_STATE];

    if (!state) {
      if (Object.isFrozen(draft)) {
        return draft;
      }

      return this.finalizeTree(draft, null, scope);
    } // Never finalize drafts owned by another scope.


    if (state.scope !== scope) {
      return draft;
    }

    if (!state.modified) {
      this.maybeFreeze(state.base, true);
      return state.base;
    }

    if (!state.finalized) {
      state.finalized = true;
      this.finalizeTree(state.draft, path, scope); // We cannot really delete anything inside of a Set. We can only replace the whole Set.

      if (this.onDelete && !isSet(state.base)) {
        // The `assigned` object is unreliable with ES5 drafts.
        if (this.useProxies) {
          var assigned = state.assigned;
          each(assigned, function (prop, exists) {
            var _a, _b;

            if (!exists) {
              (_b = (_a = _this).onDelete) === null || _b === void 0 ? void 0 : _b.call(_a, state, prop);
            }
          });
        } else {
          // TODO: Figure it out for Maps and Sets if we need to support ES5
          var base = state.base,
              copy_1 = state.copy;
          each(base, function (prop) {
            var _a, _b;

            if (!has(copy_1, prop)) {
              (_b = (_a = _this).onDelete) === null || _b === void 0 ? void 0 : _b.call(_a, state, prop);
            }
          });
        }
      }

      if (this.onCopy) {
        this.onCopy(state);
      } // At this point, all descendants of `state.copy` have been finalized,
      // so we can be sure that `scope.canAutoFreeze` is accurate.


      if (this.autoFreeze && scope.canAutoFreeze) {
        freeze(state.copy, false);
      }

      if (path && scope.patches) {
        generatePatches(state, path, scope.patches, scope.inversePatches);
      }
    }

    return state.copy;
  };
  /**
   * @internal
   * Finalize all drafts in the given state tree.
   */


  Immer.prototype.finalizeTree = function (root, rootPath, scope) {
    var _this = this;

    var state = root[DRAFT_STATE];

    if (state) {
      if (!this.useProxies) {
        // Create the final copy, with added keys and without deleted keys.
        state.copy = shallowCopy(state.draft, true);
      }

      root = state.copy;
    }

    var needPatches = !!rootPath && !!scope.patches;

    var finalizeProperty = function (prop, value, parent) {
      if (value === parent) {
        throw Error("Immer forbids circular references");
      } // In the `finalizeTree` method, only the `root` object may be a draft.


      var isDraftProp = !!state && parent === root;
      var isSetMember = isSet(parent);

      if (isDraft(value)) {
        var path = isDraftProp && needPatches && !isSetMember && // Set objects are atomic since they have no keys.
        !has(state.assigned, prop) // Skip deep patches for assigned keys.
        ? rootPath.concat(prop) : null; // Drafts owned by `scope` are finalized here.

        value = _this.finalize(value, path, scope);
        replace(parent, prop, value); // Drafts from another scope must prevent auto-freezing.

        if (isDraft(value)) {
          scope.canAutoFreeze = false;
        } // Unchanged drafts are never passed to the `onAssign` hook.


        if (isDraftProp && value === get(state.base, prop)) {
          return;
        }
      } // Unchanged draft properties are ignored.
      else if (isDraftProp && is(value, get(state.base, prop))) {
          return;
        } // Search new objects for unfinalized drafts. Frozen objects should never contain drafts.
        else if (isDraftable(value) && !Object.isFrozen(value)) {
            each(value, finalizeProperty);

            _this.maybeFreeze(value);
          }

      if (isDraftProp && _this.onAssign && !isSetMember) {
        _this.onAssign(state, prop, value);
      }
    };

    each(root, finalizeProperty);
    return root;
  };

  Immer.prototype.maybeFreeze = function (value, deep) {
    if (deep === void 0) {
      deep = false;
    }

    if (this.autoFreeze && !isDraft(value)) {
      freeze(value, deep);
    }
  };

  return Immer;
}();

exports.Immer = Immer;

function replace(parent, prop, value) {
  if (isMap(parent)) {
    parent.set(prop, value);
  } else if (isSet(parent)) {
    // In this case, the `prop` is actually a draft.
    parent["delete"](prop);
    parent.add(value);
  } else if (Array.isArray(parent) || isEnumerable(parent, prop)) {
    // Preserve non-enumerable properties.
    parent[prop] = value;
  } else {
    Object.defineProperty(parent, prop, {
      value: value,
      writable: true,
      configurable: true
    });
  }
}

var immer = new Immer();
/**
 * The `produce` function takes a value and a "recipe function" (whose
 * return value often depends on the base state). The recipe function is
 * free to mutate its first argument however it wants. All mutations are
 * only ever applied to a __copy__ of the base state.
 *
 * Pass only a function to create a "curried producer" which relieves you
 * from passing the recipe function every time.
 *
 * Only plain objects and arrays are made mutable. All other objects are
 * considered uncopyable.
 *
 * Note: This function is __bound__ to its `Immer` instance.
 *
 * @param {any} base - the initial state
 * @param {Function} producer - function that receives a proxy of the base state as first argument and which can be freely modified
 * @param {Function} patchListener - optional function that will be called with all the patches produced here
 * @returns {any} a new state, or the initial state if nothing was modified
 */

var produce = immer.produce;
/**
 * Like `produce`, but `produceWithPatches` always returns a tuple
 * [nextState, patches, inversePatches] (instead of just the next state)
 */

exports.produce = produce;
var produceWithPatches = immer.produceWithPatches.bind(immer);
/**
 * Pass true to automatically freeze all copies created by Immer.
 *
 * By default, auto-freezing is disabled in production.
 */

exports.produceWithPatches = produceWithPatches;
var setAutoFreeze = immer.setAutoFreeze.bind(immer);
/**
 * Pass true to use the ES2015 `Proxy` class when creating drafts, which is
 * always faster than using ES5 proxies.
 *
 * By default, feature detection is used, so calling this is rarely necessary.
 */

exports.setAutoFreeze = setAutoFreeze;
var setUseProxies = immer.setUseProxies.bind(immer);
/**
 * Apply an array of Immer patches to the first argument.
 *
 * This function is a producer, which means copy-on-write is in effect.
 */

exports.setUseProxies = setUseProxies;
var applyPatches$1 = immer.applyPatches.bind(immer);
/**
 * Create an Immer draft from the given base state, which may be a draft itself.
 * The draft can be modified until you finalize it with the `finishDraft` function.
 */

exports.applyPatches = applyPatches$1;
var createDraft = immer.createDraft.bind(immer);
/**
 * Finalize an Immer draft from a `createDraft` call, returning the base state
 * (if no changes were made) or a modified copy. The draft must *not* be
 * mutated afterwards.
 *
 * Pass a function as the 2nd argument to generate Immer patches based on the
 * changes that were made.
 */

exports.createDraft = createDraft;
var finishDraft = immer.finishDraft.bind(immer);
exports.finishDraft = finishDraft;
var _default = produce;
exports.default = _default;
},{"process":"../node_modules/process/browser.js"}],"../node_modules/classnames/index.js":[function(require,module,exports) {
var define;
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],"parcel-plugins/runtime.js":[function(require,module,exports) {
"use strict";

var _neverland = require("neverland");

var _immer = _interopRequireDefault(require("immer"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function useImmer(state) {
  var _useState = (0, _neverland.useState)(state),
      _useState2 = _slicedToArray(_useState, 2),
      val = _useState2[0],
      updateValue = _useState2[1];

  return [val, (0, _neverland.useCallback)(function (updater) {
    updateValue((0, _immer.default)(updater));
  }, [])];
}

var components = {};

window.component = function component(id, comp) {
  var stateless = comp.length > 1;
  comp = comp.bind(context);
  comp = stateless ? comp : (0, _neverland.neverland)(comp);
  return components[comp.id = id] = comp; // eslint-disable-line
};

var context = {
  h: _neverland.html,
  cn: _classnames.default,
  im: useImmer,
  ef: _neverland.useEffect,
  c: function c(id) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : context.p;
    if (!id) return;
    return components[id](Object.freeze(props));
  }
};
var translation = {};
var transReg = /\{\{([^{}]+)?\}\}/g;
var tagReg = /<[a-zA-Z_][^>]*>/; // maybe contain tag

window.startApp = function startApp(_ref) {
  var target = _ref.target,
      component = _ref.component,
      i18n = _ref.i18n;
  var container = typeof target === 'string' ? document.querySelector(target) : target;
  translation = i18n || {};

  _neverland.render.call(context, container, component);

  window.__prerender__ && setTimeout(window.__prerender__.bind(null, container.outerHTML));

  if (module.hot) {
    window.addEventListener('__ssb_hmr__', function (evt) {
      var cid = evt.detail.cid;

      try {
        document.querySelectorAll("[data-comp-id=\"".concat(cid, "\"]")).forEach(function (compDom) {
          _neverland.render.call(context, compDom, components[cid](compDom.props));
        });
      } catch (err) {
        console.warn('hot-reload error: ', err);
        window.location.reload();
      }
    });
  }
};

window.t = function t(key) {
  var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!(key in translation)) {
    console.warn("i18n: translation key \"".concat(key, "\" is missing."));
    return key;
  }

  var result = translation[key].replace(transReg, function (s, v) {
    v = v.trim();
    if (!v) return '';

    if (!(v in param)) {
      console.warn("i18n: param ".concat(v, " is missed for translation ").concat(key, ", ").concat(translation[key], "."));
      return '';
    }

    return param[v];
  });
  return tagReg.test(result) ? {
    html: result
  } : result;
};
},{"neverland":"../node_modules/neverland/esm/index.js","immer":"../node_modules/immer/dist/immer.module.js","classnames":"../node_modules/classnames/index.js"}],"../src/js/vendor.js":[function(require,module,exports) {
"use strict";

require("normalize.css/normalize.css");

require("main.css/dist/main.css");

require("../../public/parcel-plugins/runtime");

(function () {
  var method;

  var noop = function noop() {};

  var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'];
  var length = methods.length;
  var console = window.console = window.console || {};

  while (length--) {
    method = methods[length]; // Only stub undefined methods.

    if (!console[method]) {
      console[method] = noop;
    }
  }
})();

function Delay() {
  var _this = this;

  this.promise = new Promise(function (resolve, reject) {
    _this.resolve = resolve;
    _this.reject = reject;
  });
}

window.loadScript = function loadScript(src) {
  var script = document.createElement('script');
  script.src = src;
  script.setAttribute('crossorigin', 'anonymous');

  var _ref = new Delay(),
      promise = _ref.promise,
      resolve = _ref.resolve,
      reject = _ref.reject;

  script.onload = resolve;
  script.onerror = reject;
  document.head.appendChild(script);
  return promise;
};
},{"normalize.css/normalize.css":"../node_modules/normalize.css/normalize.css","main.css/dist/main.css":"../node_modules/main.css/dist/main.css","../../public/parcel-plugins/runtime":"parcel-plugins/runtime.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52151" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../src/js/vendor.js"], null)
//# sourceMappingURL=/vendor.f1881bfd.js.map