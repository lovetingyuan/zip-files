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
      
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../node_modules/process/browser.js":[function(require,module,exports) {

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
},{}],"../node_modules/mobx/lib/mobx.module.js":[function(require,module,exports) {
var process = require("process");
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._allowStateChanges = allowStateChanges;
exports._allowStateChangesInsideComputed = allowStateChangesInsideComputed;
exports._endAction = _endAction;
exports._getAdministration = getAdministration;
exports._getGlobalState = getGlobalState;
exports._interceptReads = interceptReads;
exports._isComputingDerivation = isComputingDerivation;
exports._resetGlobalState = resetGlobalState;
exports._startAction = _startAction;
exports.autorun = autorun;
exports.configure = configure;
exports.createAtom = createAtom;
exports.decorate = decorate;
exports.entries = entries;
exports.extendObservable = extendObservable;
exports.flow = flow;
exports.get = get;
exports.getAtom = getAtom;
exports.getDebugName = getDebugName;
exports.getDependencyTree = getDependencyTree;
exports.getObserverTree = getObserverTree;
exports.has = has;
exports.intercept = intercept;
exports.isAction = isAction;
exports.isArrayLike = isArrayLike;
exports.isComputed = isComputed;
exports.isComputedProp = isComputedProp;
exports.isFlowCancellationError = isFlowCancellationError;
exports.isObservable = isObservable;
exports.isObservableArray = isObservableArray;
exports.isObservableObject = isObservableObject;
exports.isObservableProp = isObservableProp;
exports.keys = keys;
exports.observe = observe;
exports.onBecomeObserved = onBecomeObserved;
exports.onBecomeUnobserved = onBecomeUnobserved;
exports.onReactionError = onReactionError;
exports.reaction = reaction;
exports.remove = remove;
exports.runInAction = runInAction;
exports.set = set;
exports.spy = spy;
exports.toJS = toJS;
exports.trace = trace;
exports.transaction = transaction;
exports.untracked = untracked;
exports.values = values;
exports.when = when;
exports.observable = exports.isObservableSet = exports.isObservableMap = exports.isBoxedObservable = exports.computed = exports.comparer = exports.action = exports.Reaction = exports.ObservableSet = exports.ObservableMap = exports.IDerivationState = exports.FlowCancellationError = exports.$mobx = void 0;

/** MobX - (c) Michel Weststrate 2015 - 2019 - MIT Licensed */

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

/* global Reflect, Promise */
var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  };

  return extendStatics(d, b);
};

function __extends(d, b) {
  extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

function __values(o) {
  var m = typeof Symbol === "function" && o[Symbol.iterator],
      i = 0;
  if (m) return m.call(o);
  return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
}

function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));

  return ar;
}

var OBFUSCATED_ERROR = "An invariant failed, however the error is obfuscated because this is an production build.";
var EMPTY_ARRAY = [];
Object.freeze(EMPTY_ARRAY);
var EMPTY_OBJECT = {};
Object.freeze(EMPTY_OBJECT);

function getNextId() {
  return ++globalState.mobxGuid;
}

function fail(message) {
  invariant(false, message);
  throw "X"; // unreachable
}

function invariant(check, message) {
  if (!check) throw new Error("[mobx] " + (message || OBFUSCATED_ERROR));
}
/**
 * Prints a deprecation message, but only one time.
 * Returns false if the deprecated message was already printed before
 */


var deprecatedMessages = [];

function deprecated(msg, thing) {
  if ("development" === "production") return false;

  if (thing) {
    return deprecated("'" + msg + "', use '" + thing + "' instead.");
  }

  if (deprecatedMessages.indexOf(msg) !== -1) return false;
  deprecatedMessages.push(msg);
  console.error("[mobx] Deprecated: " + msg);
  return true;
}
/**
 * Makes sure that the provided function is invoked at most once.
 */


function once(func) {
  var invoked = false;
  return function () {
    if (invoked) return;
    invoked = true;
    return func.apply(this, arguments);
  };
}

var noop = function () {};

function unique(list) {
  var res = [];
  list.forEach(function (item) {
    if (res.indexOf(item) === -1) res.push(item);
  });
  return res;
}

function isObject(value) {
  return value !== null && typeof value === "object";
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") return false;
  var proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function addHiddenProp(object, propName, value) {
  Object.defineProperty(object, propName, {
    enumerable: false,
    writable: true,
    configurable: true,
    value: value
  });
}

function addHiddenFinalProp(object, propName, value) {
  Object.defineProperty(object, propName, {
    enumerable: false,
    writable: false,
    configurable: true,
    value: value
  });
}

function isPropertyConfigurable(object, prop) {
  var descriptor = Object.getOwnPropertyDescriptor(object, prop);
  return !descriptor || descriptor.configurable !== false && descriptor.writable !== false;
}

function assertPropertyConfigurable(object, prop) {
  if ("development" !== "production" && !isPropertyConfigurable(object, prop)) fail("Cannot make property '" + prop.toString() + "' observable, it is not configurable and writable in the target object");
}

function createInstanceofPredicate(name, clazz) {
  var propName = "isMobX" + name;
  clazz.prototype[propName] = true;
  return function (x) {
    return isObject(x) && x[propName] === true;
  };
}
/**
 * Returns whether the argument is an array, disregarding observability.
 */


function isArrayLike(x) {
  return Array.isArray(x) || isObservableArray(x);
}

function isES6Map(thing) {
  return thing instanceof Map;
}

function isES6Set(thing) {
  return thing instanceof Set;
}
/**
 * Returns the following: own keys, prototype keys & own symbol keys, if they are enumerable.
 */


function getPlainObjectKeys(object) {
  var enumerables = new Set();

  for (var key in object) enumerables.add(key); // *all* enumerables


  Object.getOwnPropertySymbols(object).forEach(function (k) {
    if (Object.getOwnPropertyDescriptor(object, k).enumerable) enumerables.add(k);
  }); // *own* symbols
  // Note: this implementation is missing enumerable, inherited, symbolic property names! That would however pretty expensive to add,
  // as there is no efficient iterator that returns *all* properties

  return Array.from(enumerables);
}

function stringifyKey(key) {
  if (key && key.toString) return key.toString();else return new String(key).toString();
}

function getMapLikeKeys(map) {
  if (isPlainObject(map)) return Object.keys(map);
  if (Array.isArray(map)) return map.map(function (_a) {
    var _b = __read(_a, 1),
        key = _b[0];

    return key;
  });
  if (isES6Map(map) || isObservableMap(map)) return Array.from(map.keys());
  return fail("Cannot get keys from '" + map + "'");
}

function toPrimitive(value) {
  return value === null ? null : typeof value === "object" ? "" + value : value;
}

var $mobx = Symbol("mobx administration");
exports.$mobx = $mobx;

var Atom =
/** @class */
function () {
  /**
   * Create a new atom. For debugging purposes it is recommended to give it a name.
   * The onBecomeObserved and onBecomeUnobserved callbacks can be used for resource management.
   */
  function Atom(name) {
    if (name === void 0) {
      name = "Atom@" + getNextId();
    }

    this.name = name;
    this.isPendingUnobservation = false; // for effective unobserving. BaseAtom has true, for extra optimization, so its onBecomeUnobserved never gets called, because it's not needed

    this.isBeingObserved = false;
    this.observers = new Set();
    this.diffValue = 0;
    this.lastAccessedBy = 0;
    this.lowestObserverState = IDerivationState.NOT_TRACKING;
  }

  Atom.prototype.onBecomeObserved = function () {
    if (this.onBecomeObservedListeners) {
      this.onBecomeObservedListeners.forEach(function (listener) {
        return listener();
      });
    }
  };

  Atom.prototype.onBecomeUnobserved = function () {
    if (this.onBecomeUnobservedListeners) {
      this.onBecomeUnobservedListeners.forEach(function (listener) {
        return listener();
      });
    }
  };
  /**
   * Invoke this method to notify mobx that your atom has been used somehow.
   * Returns true if there is currently a reactive context.
   */


  Atom.prototype.reportObserved = function () {
    return reportObserved(this);
  };
  /**
   * Invoke this method _after_ this method has changed to signal mobx that all its observers should invalidate.
   */


  Atom.prototype.reportChanged = function () {
    startBatch();
    propagateChanged(this);
    endBatch();
  };

  Atom.prototype.toString = function () {
    return this.name;
  };

  return Atom;
}();

var isAtom = createInstanceofPredicate("Atom", Atom);

function createAtom(name, onBecomeObservedHandler, onBecomeUnobservedHandler) {
  if (onBecomeObservedHandler === void 0) {
    onBecomeObservedHandler = noop;
  }

  if (onBecomeUnobservedHandler === void 0) {
    onBecomeUnobservedHandler = noop;
  }

  var atom = new Atom(name); // default `noop` listener will not initialize the hook Set

  if (onBecomeObservedHandler !== noop) {
    onBecomeObserved(atom, onBecomeObservedHandler);
  }

  if (onBecomeUnobservedHandler !== noop) {
    onBecomeUnobserved(atom, onBecomeUnobservedHandler);
  }

  return atom;
}

function identityComparer(a, b) {
  return a === b;
}

function structuralComparer(a, b) {
  return deepEqual(a, b);
}

function shallowComparer(a, b) {
  return deepEqual(a, b, 1);
}

function defaultComparer(a, b) {
  return Object.is(a, b);
}

var comparer = {
  identity: identityComparer,
  structural: structuralComparer,
  default: defaultComparer,
  shallow: shallowComparer
};
exports.comparer = comparer;
var mobxDidRunLazyInitializersSymbol = Symbol("mobx did run lazy initializers");
var mobxPendingDecorators = Symbol("mobx pending decorators");
var enumerableDescriptorCache = {};
var nonEnumerableDescriptorCache = {};

function createPropertyInitializerDescriptor(prop, enumerable) {
  var cache = enumerable ? enumerableDescriptorCache : nonEnumerableDescriptorCache;
  return cache[prop] || (cache[prop] = {
    configurable: true,
    enumerable: enumerable,
    get: function () {
      initializeInstance(this);
      return this[prop];
    },
    set: function (value) {
      initializeInstance(this);
      this[prop] = value;
    }
  });
}

function initializeInstance(target) {
  var e_1, _a;

  if (target[mobxDidRunLazyInitializersSymbol] === true) return;
  var decorators = target[mobxPendingDecorators];

  if (decorators) {
    addHiddenProp(target, mobxDidRunLazyInitializersSymbol, true); // Build property key array from both strings and symbols

    var keys = __spread(Object.getOwnPropertySymbols(decorators), Object.keys(decorators));

    try {
      for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
        var key = keys_1_1.value;
        var d = decorators[key];
        d.propertyCreator(target, d.prop, d.descriptor, d.decoratorTarget, d.decoratorArguments);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  }
}

function createPropDecorator(propertyInitiallyEnumerable, propertyCreator) {
  return function decoratorFactory() {
    var decoratorArguments;

    var decorator = function decorate(target, prop, descriptor, applyImmediately // This is a special parameter to signal the direct application of a decorator, allow extendObservable to skip the entire type decoration part,
    // as the instance to apply the decorator to equals the target
    ) {
      if (applyImmediately === true) {
        propertyCreator(target, prop, descriptor, target, decoratorArguments);
        return null;
      }

      if ("development" !== "production" && !quacksLikeADecorator(arguments)) fail("This function is a decorator, but it wasn't invoked like a decorator");

      if (!Object.prototype.hasOwnProperty.call(target, mobxPendingDecorators)) {
        var inheritedDecorators = target[mobxPendingDecorators];
        addHiddenProp(target, mobxPendingDecorators, __assign({}, inheritedDecorators));
      }

      target[mobxPendingDecorators][prop] = {
        prop: prop,
        propertyCreator: propertyCreator,
        descriptor: descriptor,
        decoratorTarget: target,
        decoratorArguments: decoratorArguments
      };
      return createPropertyInitializerDescriptor(prop, propertyInitiallyEnumerable);
    };

    if (quacksLikeADecorator(arguments)) {
      // @decorator
      decoratorArguments = EMPTY_ARRAY;
      return decorator.apply(null, arguments);
    } else {
      // @decorator(args)
      decoratorArguments = Array.prototype.slice.call(arguments);
      return decorator;
    }
  };
}

function quacksLikeADecorator(args) {
  return (args.length === 2 || args.length === 3) && (typeof args[1] === "string" || typeof args[1] === "symbol") || args.length === 4 && args[3] === true;
}

function deepEnhancer(v, _, name) {
  // it is an observable already, done
  if (isObservable(v)) return v; // something that can be converted and mutated?

  if (Array.isArray(v)) return observable.array(v, {
    name: name
  });
  if (isPlainObject(v)) return observable.object(v, undefined, {
    name: name
  });
  if (isES6Map(v)) return observable.map(v, {
    name: name
  });
  if (isES6Set(v)) return observable.set(v, {
    name: name
  });
  return v;
}

function shallowEnhancer(v, _, name) {
  if (v === undefined || v === null) return v;
  if (isObservableObject(v) || isObservableArray(v) || isObservableMap(v) || isObservableSet(v)) return v;
  if (Array.isArray(v)) return observable.array(v, {
    name: name,
    deep: false
  });
  if (isPlainObject(v)) return observable.object(v, undefined, {
    name: name,
    deep: false
  });
  if (isES6Map(v)) return observable.map(v, {
    name: name,
    deep: false
  });
  if (isES6Set(v)) return observable.set(v, {
    name: name,
    deep: false
  });
  return fail("development" !== "production" && "The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets");
}

function referenceEnhancer(newValue) {
  // never turn into an observable
  return newValue;
}

function refStructEnhancer(v, oldValue, name) {
  if ("development" !== "production" && isObservable(v)) throw "observable.struct should not be used with observable values";
  if (deepEqual(v, oldValue)) return oldValue;
  return v;
}

function createDecoratorForEnhancer(enhancer) {
  invariant(enhancer);
  var decorator = createPropDecorator(true, function (target, propertyName, descriptor, _decoratorTarget, decoratorArgs) {
    if ("development" !== "production") {
      invariant(!descriptor || !descriptor.get, "@observable cannot be used on getter (property \"" + stringifyKey(propertyName) + "\"), use @computed instead.");
    }

    var initialValue = descriptor ? descriptor.initializer ? descriptor.initializer.call(target) : descriptor.value : undefined;
    asObservableObject(target).addObservableProp(propertyName, initialValue, enhancer);
  });
  var res = // Extra process checks, as this happens during module initialization
  typeof process !== "undefined" && process.env && "development" !== "production" ? function observableDecorator() {
    // This wrapper function is just to detect illegal decorator invocations, deprecate in a next version
    // and simply return the created prop decorator
    if (arguments.length < 2) return fail("Incorrect decorator invocation. @observable decorator doesn't expect any arguments");
    return decorator.apply(null, arguments);
  } : decorator;
  res.enhancer = enhancer;
  return res;
} // Predefined bags of create observable options, to avoid allocating temporarily option objects
// in the majority of cases


var defaultCreateObservableOptions = {
  deep: true,
  name: undefined,
  defaultDecorator: undefined,
  proxy: true
};
Object.freeze(defaultCreateObservableOptions);

function assertValidOption(key) {
  if (!/^(deep|name|equals|defaultDecorator|proxy)$/.test(key)) fail("invalid option for (extend)observable: " + key);
}

function asCreateObservableOptions(thing) {
  if (thing === null || thing === undefined) return defaultCreateObservableOptions;
  if (typeof thing === "string") return {
    name: thing,
    deep: true,
    proxy: true
  };

  if ("development" !== "production") {
    if (typeof thing !== "object") return fail("expected options object");
    Object.keys(thing).forEach(assertValidOption);
  }

  return thing;
}

var deepDecorator = createDecoratorForEnhancer(deepEnhancer);
var shallowDecorator = createDecoratorForEnhancer(shallowEnhancer);
var refDecorator = createDecoratorForEnhancer(referenceEnhancer);
var refStructDecorator = createDecoratorForEnhancer(refStructEnhancer);

function getEnhancerFromOptions(options) {
  return options.defaultDecorator ? options.defaultDecorator.enhancer : options.deep === false ? referenceEnhancer : deepEnhancer;
}
/**
 * Turns an object, array or function into a reactive structure.
 * @param v the value which should become observable.
 */


function createObservable(v, arg2, arg3) {
  // @observable someProp;
  if (typeof arguments[1] === "string" || typeof arguments[1] === "symbol") {
    return deepDecorator.apply(null, arguments);
  } // it is an observable already, done


  if (isObservable(v)) return v; // something that can be converted and mutated?

  var res = isPlainObject(v) ? observable.object(v, arg2, arg3) : Array.isArray(v) ? observable.array(v, arg2) : isES6Map(v) ? observable.map(v, arg2) : isES6Set(v) ? observable.set(v, arg2) : v; // this value could be converted to a new observable data structure, return it

  if (res !== v) return res; // otherwise, just box it

  fail("development" !== "production" && "The provided value could not be converted into an observable. If you want just create an observable reference to the object use 'observable.box(value)'");
}

var observableFactories = {
  box: function (value, options) {
    if (arguments.length > 2) incorrectlyUsedAsDecorator("box");
    var o = asCreateObservableOptions(options);
    return new ObservableValue(value, getEnhancerFromOptions(o), o.name, true, o.equals);
  },
  array: function (initialValues, options) {
    if (arguments.length > 2) incorrectlyUsedAsDecorator("array");
    var o = asCreateObservableOptions(options);
    return createObservableArray(initialValues, getEnhancerFromOptions(o), o.name);
  },
  map: function (initialValues, options) {
    if (arguments.length > 2) incorrectlyUsedAsDecorator("map");
    var o = asCreateObservableOptions(options);
    return new ObservableMap(initialValues, getEnhancerFromOptions(o), o.name);
  },
  set: function (initialValues, options) {
    if (arguments.length > 2) incorrectlyUsedAsDecorator("set");
    var o = asCreateObservableOptions(options);
    return new ObservableSet(initialValues, getEnhancerFromOptions(o), o.name);
  },
  object: function (props, decorators, options) {
    if (typeof arguments[1] === "string") incorrectlyUsedAsDecorator("object");
    var o = asCreateObservableOptions(options);

    if (o.proxy === false) {
      return extendObservable({}, props, decorators, o);
    } else {
      var defaultDecorator = getDefaultDecoratorFromObjectOptions(o);
      var base = extendObservable({}, undefined, undefined, o);
      var proxy = createDynamicObservableObject(base);
      extendObservableObjectWithProperties(proxy, props, decorators, defaultDecorator);
      return proxy;
    }
  },
  ref: refDecorator,
  shallow: shallowDecorator,
  deep: deepDecorator,
  struct: refStructDecorator
};
var observable = createObservable; // weird trick to keep our typings nicely with our funcs, and still extend the observable function

exports.observable = observable;
Object.keys(observableFactories).forEach(function (name) {
  return observable[name] = observableFactories[name];
});

function incorrectlyUsedAsDecorator(methodName) {
  fail( // process.env.NODE_ENV !== "production" &&
  "Expected one or two arguments to observable." + methodName + ". Did you accidentally try to use observable." + methodName + " as decorator?");
}

var computedDecorator = createPropDecorator(false, function (instance, propertyName, descriptor, decoratorTarget, decoratorArgs) {
  var get = descriptor.get,
      set = descriptor.set; // initialValue is the descriptor for get / set props
  // Optimization: faster on decorator target or instance? Assuming target
  // Optimization: find out if declaring on instance isn't just faster. (also makes the property descriptor simpler). But, more memory usage..
  // Forcing instance now, fixes hot reloadig issues on React Native:

  var options = decoratorArgs[0] || {};
  asObservableObject(instance).addComputedProp(instance, propertyName, __assign({
    get: get,
    set: set,
    context: instance
  }, options));
});
var computedStructDecorator = computedDecorator({
  equals: comparer.structural
});
/**
 * Decorator for class properties: @computed get value() { return expr; }.
 * For legacy purposes also invokable as ES5 observable created: `computed(() => expr)`;
 */

var computed = function computed(arg1, arg2, arg3) {
  if (typeof arg2 === "string") {
    // @computed
    return computedDecorator.apply(null, arguments);
  }

  if (arg1 !== null && typeof arg1 === "object" && arguments.length === 1) {
    // @computed({ options })
    return computedDecorator.apply(null, arguments);
  } // computed(expr, options?)


  if ("development" !== "production") {
    invariant(typeof arg1 === "function", "First argument to `computed` should be an expression.");
    invariant(arguments.length < 3, "Computed takes one or two arguments if used as function");
  }

  var opts = typeof arg2 === "object" ? arg2 : {};
  opts.get = arg1;
  opts.set = typeof arg2 === "function" ? arg2 : opts.set;
  opts.name = opts.name || arg1.name || "";
  /* for generated name */

  return new ComputedValue(opts);
};

exports.computed = computed;
computed.struct = computedStructDecorator;
var IDerivationState;
exports.IDerivationState = IDerivationState;

(function (IDerivationState) {
  // before being run or (outside batch and not being observed)
  // at this point derivation is not holding any data about dependency tree
  IDerivationState[IDerivationState["NOT_TRACKING"] = -1] = "NOT_TRACKING"; // no shallow dependency changed since last computation
  // won't recalculate derivation
  // this is what makes mobx fast

  IDerivationState[IDerivationState["UP_TO_DATE"] = 0] = "UP_TO_DATE"; // some deep dependency changed, but don't know if shallow dependency changed
  // will require to check first if UP_TO_DATE or POSSIBLY_STALE
  // currently only ComputedValue will propagate POSSIBLY_STALE
  //
  // having this state is second big optimization:
  // don't have to recompute on every dependency change, but only when it's needed

  IDerivationState[IDerivationState["POSSIBLY_STALE"] = 1] = "POSSIBLY_STALE"; // A shallow dependency has changed since last computation and the derivation
  // will need to recompute when it's needed next.

  IDerivationState[IDerivationState["STALE"] = 2] = "STALE";
})(IDerivationState || (exports.IDerivationState = IDerivationState = {}));

var TraceMode;

(function (TraceMode) {
  TraceMode[TraceMode["NONE"] = 0] = "NONE";
  TraceMode[TraceMode["LOG"] = 1] = "LOG";
  TraceMode[TraceMode["BREAK"] = 2] = "BREAK";
})(TraceMode || (TraceMode = {}));

var CaughtException =
/** @class */
function () {
  function CaughtException(cause) {
    this.cause = cause; // Empty
  }

  return CaughtException;
}();

function isCaughtException(e) {
  return e instanceof CaughtException;
}
/**
 * Finds out whether any dependency of the derivation has actually changed.
 * If dependenciesState is 1 then it will recalculate dependencies,
 * if any dependency changed it will propagate it by changing dependenciesState to 2.
 *
 * By iterating over the dependencies in the same order that they were reported and
 * stopping on the first change, all the recalculations are only called for ComputedValues
 * that will be tracked by derivation. That is because we assume that if the first x
 * dependencies of the derivation doesn't change then the derivation should run the same way
 * up until accessing x-th dependency.
 */


function shouldCompute(derivation) {
  switch (derivation.dependenciesState) {
    case IDerivationState.UP_TO_DATE:
      return false;

    case IDerivationState.NOT_TRACKING:
    case IDerivationState.STALE:
      return true;

    case IDerivationState.POSSIBLY_STALE:
      {
        var prevUntracked = untrackedStart(); // no need for those computeds to be reported, they will be picked up in trackDerivedFunction.

        var obs = derivation.observing,
            l = obs.length;

        for (var i = 0; i < l; i++) {
          var obj = obs[i];

          if (isComputedValue(obj)) {
            if (globalState.disableErrorBoundaries) {
              obj.get();
            } else {
              try {
                obj.get();
              } catch (e) {
                // we are not interested in the value *or* exception at this moment, but if there is one, notify all
                untrackedEnd(prevUntracked);
                return true;
              }
            } // if ComputedValue `obj` actually changed it will be computed and propagated to its observers.
            // and `derivation` is an observer of `obj`
            // invariantShouldCompute(derivation)


            if (derivation.dependenciesState === IDerivationState.STALE) {
              untrackedEnd(prevUntracked);
              return true;
            }
          }
        }

        changeDependenciesStateTo0(derivation);
        untrackedEnd(prevUntracked);
        return false;
      }
  }
} // function invariantShouldCompute(derivation: IDerivation) {
//     const newDepState = (derivation as any).dependenciesState
//     if (
//         process.env.NODE_ENV === "production" &&
//         (newDepState === IDerivationState.POSSIBLY_STALE ||
//             newDepState === IDerivationState.NOT_TRACKING)
//     )
//         fail("Illegal dependency state")
// }


function isComputingDerivation() {
  return globalState.trackingDerivation !== null; // filter out actions inside computations
}

function checkIfStateModificationsAreAllowed(atom) {
  var hasObservers = atom.observers.size > 0; // Should never be possible to change an observed observable from inside computed, see #798

  if (globalState.computationDepth > 0 && hasObservers) fail("development" !== "production" && "Computed values are not allowed to cause side effects by changing observables that are already being observed. Tried to modify: " + atom.name); // Should not be possible to change observed state outside strict mode, except during initialization, see #563

  if (!globalState.allowStateChanges && (hasObservers || globalState.enforceActions === "strict")) fail("development" !== "production" && (globalState.enforceActions ? "Since strict-mode is enabled, changing observed observable values outside actions is not allowed. Please wrap the code in an `action` if this change is intended. Tried to modify: " : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, the render function of a React component? Tried to modify: ") + atom.name);
}

function checkIfStateReadsAreAllowed(observable) {
  if ("development" !== "production" && !globalState.allowStateReads && globalState.observableRequiresReaction) {
    console.warn("[mobx] Observable " + observable.name + " being read outside a reactive context");
  }
}
/**
 * Executes the provided function `f` and tracks which observables are being accessed.
 * The tracking information is stored on the `derivation` object and the derivation is registered
 * as observer of any of the accessed observables.
 */


function trackDerivedFunction(derivation, f, context) {
  var prevAllowStateReads = allowStateReadsStart(true); // pre allocate array allocation + room for variation in deps
  // array will be trimmed by bindDependencies

  changeDependenciesStateTo0(derivation);
  derivation.newObserving = new Array(derivation.observing.length + 100);
  derivation.unboundDepsCount = 0;
  derivation.runId = ++globalState.runId;
  var prevTracking = globalState.trackingDerivation;
  globalState.trackingDerivation = derivation;
  var result;

  if (globalState.disableErrorBoundaries === true) {
    result = f.call(context);
  } else {
    try {
      result = f.call(context);
    } catch (e) {
      result = new CaughtException(e);
    }
  }

  globalState.trackingDerivation = prevTracking;
  bindDependencies(derivation);
  warnAboutDerivationWithoutDependencies(derivation);
  allowStateReadsEnd(prevAllowStateReads);
  return result;
}

function warnAboutDerivationWithoutDependencies(derivation) {
  if ("development" === "production") return;
  if (derivation.observing.length !== 0) return;

  if (globalState.reactionRequiresObservable || derivation.requiresObservable) {
    console.warn("[mobx] Derivation " + derivation.name + " is created/updated without reading any observable value");
  }
}
/**
 * diffs newObserving with observing.
 * update observing to be newObserving with unique observables
 * notify observers that become observed/unobserved
 */


function bindDependencies(derivation) {
  // invariant(derivation.dependenciesState !== IDerivationState.NOT_TRACKING, "INTERNAL ERROR bindDependencies expects derivation.dependenciesState !== -1");
  var prevObserving = derivation.observing;
  var observing = derivation.observing = derivation.newObserving;
  var lowestNewObservingDerivationState = IDerivationState.UP_TO_DATE; // Go through all new observables and check diffValue: (this list can contain duplicates):
  //   0: first occurrence, change to 1 and keep it
  //   1: extra occurrence, drop it

  var i0 = 0,
      l = derivation.unboundDepsCount;

  for (var i = 0; i < l; i++) {
    var dep = observing[i];

    if (dep.diffValue === 0) {
      dep.diffValue = 1;
      if (i0 !== i) observing[i0] = dep;
      i0++;
    } // Upcast is 'safe' here, because if dep is IObservable, `dependenciesState` will be undefined,
    // not hitting the condition


    if (dep.dependenciesState > lowestNewObservingDerivationState) {
      lowestNewObservingDerivationState = dep.dependenciesState;
    }
  }

  observing.length = i0;
  derivation.newObserving = null; // newObserving shouldn't be needed outside tracking (statement moved down to work around FF bug, see #614)
  // Go through all old observables and check diffValue: (it is unique after last bindDependencies)
  //   0: it's not in new observables, unobserve it
  //   1: it keeps being observed, don't want to notify it. change to 0

  l = prevObserving.length;

  while (l--) {
    var dep = prevObserving[l];

    if (dep.diffValue === 0) {
      removeObserver(dep, derivation);
    }

    dep.diffValue = 0;
  } // Go through all new observables and check diffValue: (now it should be unique)
  //   0: it was set to 0 in last loop. don't need to do anything.
  //   1: it wasn't observed, let's observe it. set back to 0


  while (i0--) {
    var dep = observing[i0];

    if (dep.diffValue === 1) {
      dep.diffValue = 0;
      addObserver(dep, derivation);
    }
  } // Some new observed derivations may become stale during this derivation computation
  // so they have had no chance to propagate staleness (#916)


  if (lowestNewObservingDerivationState !== IDerivationState.UP_TO_DATE) {
    derivation.dependenciesState = lowestNewObservingDerivationState;
    derivation.onBecomeStale();
  }
}

function clearObserving(derivation) {
  // invariant(globalState.inBatch > 0, "INTERNAL ERROR clearObserving should be called only inside batch");
  var obs = derivation.observing;
  derivation.observing = [];
  var i = obs.length;

  while (i--) removeObserver(obs[i], derivation);

  derivation.dependenciesState = IDerivationState.NOT_TRACKING;
}

function untracked(action) {
  var prev = untrackedStart();

  try {
    return action();
  } finally {
    untrackedEnd(prev);
  }
}

function untrackedStart() {
  var prev = globalState.trackingDerivation;
  globalState.trackingDerivation = null;
  return prev;
}

function untrackedEnd(prev) {
  globalState.trackingDerivation = prev;
}

function allowStateReadsStart(allowStateReads) {
  var prev = globalState.allowStateReads;
  globalState.allowStateReads = allowStateReads;
  return prev;
}

function allowStateReadsEnd(prev) {
  globalState.allowStateReads = prev;
}
/**
 * needed to keep `lowestObserverState` correct. when changing from (2 or 1) to 0
 *
 */


function changeDependenciesStateTo0(derivation) {
  if (derivation.dependenciesState === IDerivationState.UP_TO_DATE) return;
  derivation.dependenciesState = IDerivationState.UP_TO_DATE;
  var obs = derivation.observing;
  var i = obs.length;

  while (i--) obs[i].lowestObserverState = IDerivationState.UP_TO_DATE;
} // we don't use globalState for these in order to avoid possible issues with multiple
// mobx versions


var currentActionId = 0;
var nextActionId = 1;

function createAction(actionName, fn, ref) {
  if ("development" !== "production") {
    invariant(typeof fn === "function", "`action` can only be invoked on functions");
    if (typeof actionName !== "string" || !actionName) fail("actions should have valid names, got: '" + actionName + "'");
  }

  var res = function () {
    return executeAction(actionName, fn, ref || this, arguments);
  };

  res.isMobxAction = true;
  return res;
}

function executeAction(actionName, fn, scope, args) {
  var runInfo = _startAction(actionName, scope, args);

  try {
    return fn.apply(scope, args);
  } catch (err) {
    runInfo.error = err;
    throw err;
  } finally {
    _endAction(runInfo);
  }
}

function _startAction(actionName, scope, args) {
  var notifySpy = isSpyEnabled() && !!actionName;
  var startTime = 0;

  if (notifySpy && "development" !== "production") {
    startTime = Date.now();
    var l = args && args.length || 0;
    var flattendArgs = new Array(l);
    if (l > 0) for (var i = 0; i < l; i++) flattendArgs[i] = args[i];
    spyReportStart({
      type: "action",
      name: actionName,
      object: scope,
      arguments: flattendArgs
    });
  }

  var prevDerivation = untrackedStart();
  startBatch();
  var prevAllowStateChanges = allowStateChangesStart(true);
  var prevAllowStateReads = allowStateReadsStart(true);
  var runInfo = {
    prevDerivation: prevDerivation,
    prevAllowStateChanges: prevAllowStateChanges,
    prevAllowStateReads: prevAllowStateReads,
    notifySpy: notifySpy,
    startTime: startTime,
    actionId: nextActionId++,
    parentActionId: currentActionId
  };
  currentActionId = runInfo.actionId;
  return runInfo;
}

function _endAction(runInfo) {
  if (currentActionId !== runInfo.actionId) {
    fail("invalid action stack. did you forget to finish an action?");
  }

  currentActionId = runInfo.parentActionId;

  if (runInfo.error !== undefined) {
    globalState.suppressReactionErrors = true;
  }

  allowStateChangesEnd(runInfo.prevAllowStateChanges);
  allowStateReadsEnd(runInfo.prevAllowStateReads);
  endBatch();
  untrackedEnd(runInfo.prevDerivation);

  if (runInfo.notifySpy && "development" !== "production") {
    spyReportEnd({
      time: Date.now() - runInfo.startTime
    });
  }

  globalState.suppressReactionErrors = false;
}

function allowStateChanges(allowStateChanges, func) {
  var prev = allowStateChangesStart(allowStateChanges);
  var res;

  try {
    res = func();
  } finally {
    allowStateChangesEnd(prev);
  }

  return res;
}

function allowStateChangesStart(allowStateChanges) {
  var prev = globalState.allowStateChanges;
  globalState.allowStateChanges = allowStateChanges;
  return prev;
}

function allowStateChangesEnd(prev) {
  globalState.allowStateChanges = prev;
}

function allowStateChangesInsideComputed(func) {
  var prev = globalState.computationDepth;
  globalState.computationDepth = 0;
  var res;

  try {
    res = func();
  } finally {
    globalState.computationDepth = prev;
  }

  return res;
}

var ObservableValue =
/** @class */
function (_super) {
  __extends(ObservableValue, _super);

  function ObservableValue(value, enhancer, name, notifySpy, equals) {
    if (name === void 0) {
      name = "ObservableValue@" + getNextId();
    }

    if (notifySpy === void 0) {
      notifySpy = true;
    }

    if (equals === void 0) {
      equals = comparer.default;
    }

    var _this = _super.call(this, name) || this;

    _this.enhancer = enhancer;
    _this.name = name;
    _this.equals = equals;
    _this.hasUnreportedChange = false;
    _this.value = enhancer(value, undefined, name);

    if (notifySpy && isSpyEnabled() && "development" !== "production") {
      // only notify spy if this is a stand-alone observable
      spyReport({
        type: "create",
        name: _this.name,
        newValue: "" + _this.value
      });
    }

    return _this;
  }

  ObservableValue.prototype.dehanceValue = function (value) {
    if (this.dehancer !== undefined) return this.dehancer(value);
    return value;
  };

  ObservableValue.prototype.set = function (newValue) {
    var oldValue = this.value;
    newValue = this.prepareNewValue(newValue);

    if (newValue !== globalState.UNCHANGED) {
      var notifySpy = isSpyEnabled();

      if (notifySpy && "development" !== "production") {
        spyReportStart({
          type: "update",
          name: this.name,
          newValue: newValue,
          oldValue: oldValue
        });
      }

      this.setNewValue(newValue);
      if (notifySpy && "development" !== "production") spyReportEnd();
    }
  };

  ObservableValue.prototype.prepareNewValue = function (newValue) {
    checkIfStateModificationsAreAllowed(this);

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this,
        type: "update",
        newValue: newValue
      });
      if (!change) return globalState.UNCHANGED;
      newValue = change.newValue;
    } // apply modifier


    newValue = this.enhancer(newValue, this.value, this.name);
    return this.equals(this.value, newValue) ? globalState.UNCHANGED : newValue;
  };

  ObservableValue.prototype.setNewValue = function (newValue) {
    var oldValue = this.value;
    this.value = newValue;
    this.reportChanged();

    if (hasListeners(this)) {
      notifyListeners(this, {
        type: "update",
        object: this,
        newValue: newValue,
        oldValue: oldValue
      });
    }
  };

  ObservableValue.prototype.get = function () {
    this.reportObserved();
    return this.dehanceValue(this.value);
  };

  ObservableValue.prototype.intercept = function (handler) {
    return registerInterceptor(this, handler);
  };

  ObservableValue.prototype.observe = function (listener, fireImmediately) {
    if (fireImmediately) listener({
      object: this,
      type: "update",
      newValue: this.value,
      oldValue: undefined
    });
    return registerListener(this, listener);
  };

  ObservableValue.prototype.toJSON = function () {
    return this.get();
  };

  ObservableValue.prototype.toString = function () {
    return this.name + "[" + this.value + "]";
  };

  ObservableValue.prototype.valueOf = function () {
    return toPrimitive(this.get());
  };

  ObservableValue.prototype[Symbol.toPrimitive] = function () {
    return this.valueOf();
  };

  return ObservableValue;
}(Atom);

var isObservableValue = createInstanceofPredicate("ObservableValue", ObservableValue);
/**
 * A node in the state dependency root that observes other nodes, and can be observed itself.
 *
 * ComputedValue will remember the result of the computation for the duration of the batch, or
 * while being observed.
 *
 * During this time it will recompute only when one of its direct dependencies changed,
 * but only when it is being accessed with `ComputedValue.get()`.
 *
 * Implementation description:
 * 1. First time it's being accessed it will compute and remember result
 *    give back remembered result until 2. happens
 * 2. First time any deep dependency change, propagate POSSIBLY_STALE to all observers, wait for 3.
 * 3. When it's being accessed, recompute if any shallow dependency changed.
 *    if result changed: propagate STALE to all observers, that were POSSIBLY_STALE from the last step.
 *    go to step 2. either way
 *
 * If at any point it's outside batch and it isn't observed: reset everything and go to 1.
 */

exports.isBoxedObservable = isObservableValue;

var ComputedValue =
/** @class */
function () {
  /**
   * Create a new computed value based on a function expression.
   *
   * The `name` property is for debug purposes only.
   *
   * The `equals` property specifies the comparer function to use to determine if a newly produced
   * value differs from the previous value. Two comparers are provided in the library; `defaultComparer`
   * compares based on identity comparison (===), and `structualComparer` deeply compares the structure.
   * Structural comparison can be convenient if you always produce a new aggregated object and
   * don't want to notify observers if it is structurally the same.
   * This is useful for working with vectors, mouse coordinates etc.
   */
  function ComputedValue(options) {
    this.dependenciesState = IDerivationState.NOT_TRACKING;
    this.observing = []; // nodes we are looking at. Our value depends on these nodes

    this.newObserving = null; // during tracking it's an array with new observed observers

    this.isBeingObserved = false;
    this.isPendingUnobservation = false;
    this.observers = new Set();
    this.diffValue = 0;
    this.runId = 0;
    this.lastAccessedBy = 0;
    this.lowestObserverState = IDerivationState.UP_TO_DATE;
    this.unboundDepsCount = 0;
    this.__mapid = "#" + getNextId();
    this.value = new CaughtException(null);
    this.isComputing = false; // to check for cycles

    this.isRunningSetter = false;
    this.isTracing = TraceMode.NONE;
    if ("development" !== "production" && !options.get) throw "[mobx] missing option for computed: get";
    this.derivation = options.get;
    this.name = options.name || "ComputedValue@" + getNextId();
    if (options.set) this.setter = createAction(this.name + "-setter", options.set);
    this.equals = options.equals || (options.compareStructural || options.struct ? comparer.structural : comparer.default);
    this.scope = options.context;
    this.requiresReaction = !!options.requiresReaction;
    this.keepAlive = !!options.keepAlive;
  }

  ComputedValue.prototype.onBecomeStale = function () {
    propagateMaybeChanged(this);
  };

  ComputedValue.prototype.onBecomeObserved = function () {
    if (this.onBecomeObservedListeners) {
      this.onBecomeObservedListeners.forEach(function (listener) {
        return listener();
      });
    }
  };

  ComputedValue.prototype.onBecomeUnobserved = function () {
    if (this.onBecomeUnobservedListeners) {
      this.onBecomeUnobservedListeners.forEach(function (listener) {
        return listener();
      });
    }
  };
  /**
   * Returns the current value of this computed value.
   * Will evaluate its computation first if needed.
   */


  ComputedValue.prototype.get = function () {
    if (this.isComputing) fail("Cycle detected in computation " + this.name + ": " + this.derivation);

    if (globalState.inBatch === 0 && this.observers.size === 0 && !this.keepAlive) {
      if (shouldCompute(this)) {
        this.warnAboutUntrackedRead();
        startBatch(); // See perf test 'computed memoization'

        this.value = this.computeValue(false);
        endBatch();
      }
    } else {
      reportObserved(this);
      if (shouldCompute(this)) if (this.trackAndCompute()) propagateChangeConfirmed(this);
    }

    var result = this.value;
    if (isCaughtException(result)) throw result.cause;
    return result;
  };

  ComputedValue.prototype.peek = function () {
    var res = this.computeValue(false);
    if (isCaughtException(res)) throw res.cause;
    return res;
  };

  ComputedValue.prototype.set = function (value) {
    if (this.setter) {
      invariant(!this.isRunningSetter, "The setter of computed value '" + this.name + "' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?");
      this.isRunningSetter = true;

      try {
        this.setter.call(this.scope, value);
      } finally {
        this.isRunningSetter = false;
      }
    } else invariant(false, "development" !== "production" && "[ComputedValue '" + this.name + "'] It is not possible to assign a new value to a computed value.");
  };

  ComputedValue.prototype.trackAndCompute = function () {
    if (isSpyEnabled() && "development" !== "production") {
      spyReport({
        object: this.scope,
        type: "compute",
        name: this.name
      });
    }

    var oldValue = this.value;
    var wasSuspended =
    /* see #1208 */
    this.dependenciesState === IDerivationState.NOT_TRACKING;
    var newValue = this.computeValue(true);
    var changed = wasSuspended || isCaughtException(oldValue) || isCaughtException(newValue) || !this.equals(oldValue, newValue);

    if (changed) {
      this.value = newValue;
    }

    return changed;
  };

  ComputedValue.prototype.computeValue = function (track) {
    this.isComputing = true;
    globalState.computationDepth++;
    var res;

    if (track) {
      res = trackDerivedFunction(this, this.derivation, this.scope);
    } else {
      if (globalState.disableErrorBoundaries === true) {
        res = this.derivation.call(this.scope);
      } else {
        try {
          res = this.derivation.call(this.scope);
        } catch (e) {
          res = new CaughtException(e);
        }
      }
    }

    globalState.computationDepth--;
    this.isComputing = false;
    return res;
  };

  ComputedValue.prototype.suspend = function () {
    if (!this.keepAlive) {
      clearObserving(this);
      this.value = undefined; // don't hold on to computed value!
    }
  };

  ComputedValue.prototype.observe = function (listener, fireImmediately) {
    var _this = this;

    var firstTime = true;
    var prevValue = undefined;
    return autorun(function () {
      var newValue = _this.get();

      if (!firstTime || fireImmediately) {
        var prevU = untrackedStart();
        listener({
          type: "update",
          object: _this,
          newValue: newValue,
          oldValue: prevValue
        });
        untrackedEnd(prevU);
      }

      firstTime = false;
      prevValue = newValue;
    });
  };

  ComputedValue.prototype.warnAboutUntrackedRead = function () {
    if ("development" === "production") return;

    if (this.requiresReaction === true) {
      fail("[mobx] Computed value " + this.name + " is read outside a reactive context");
    }

    if (this.isTracing !== TraceMode.NONE) {
      console.log("[mobx.trace] '" + this.name + "' is being read outside a reactive context. Doing a full recompute");
    }

    if (globalState.computedRequiresReaction) {
      console.warn("[mobx] Computed value " + this.name + " is being read outside a reactive context. Doing a full recompute");
    }
  };

  ComputedValue.prototype.toJSON = function () {
    return this.get();
  };

  ComputedValue.prototype.toString = function () {
    return this.name + "[" + this.derivation.toString() + "]";
  };

  ComputedValue.prototype.valueOf = function () {
    return toPrimitive(this.get());
  };

  ComputedValue.prototype[Symbol.toPrimitive] = function () {
    return this.valueOf();
  };

  return ComputedValue;
}();

var isComputedValue = createInstanceofPredicate("ComputedValue", ComputedValue);
/**
 * These values will persist if global state is reset
 */

var persistentKeys = ["mobxGuid", "spyListeners", "enforceActions", "computedRequiresReaction", "reactionRequiresObservable", "observableRequiresReaction", "allowStateReads", "disableErrorBoundaries", "runId", "UNCHANGED"];

var MobXGlobals =
/** @class */
function () {
  function MobXGlobals() {
    /**
     * MobXGlobals version.
     * MobX compatiblity with other versions loaded in memory as long as this version matches.
     * It indicates that the global state still stores similar information
     *
     * N.B: this version is unrelated to the package version of MobX, and is only the version of the
     * internal state storage of MobX, and can be the same across many different package versions
     */
    this.version = 5;
    /**
     * globally unique token to signal unchanged
     */

    this.UNCHANGED = {};
    /**
     * Currently running derivation
     */

    this.trackingDerivation = null;
    /**
     * Are we running a computation currently? (not a reaction)
     */

    this.computationDepth = 0;
    /**
     * Each time a derivation is tracked, it is assigned a unique run-id
     */

    this.runId = 0;
    /**
     * 'guid' for general purpose. Will be persisted amongst resets.
     */

    this.mobxGuid = 0;
    /**
     * Are we in a batch block? (and how many of them)
     */

    this.inBatch = 0;
    /**
     * Observables that don't have observers anymore, and are about to be
     * suspended, unless somebody else accesses it in the same batch
     *
     * @type {IObservable[]}
     */

    this.pendingUnobservations = [];
    /**
     * List of scheduled, not yet executed, reactions.
     */

    this.pendingReactions = [];
    /**
     * Are we currently processing reactions?
     */

    this.isRunningReactions = false;
    /**
     * Is it allowed to change observables at this point?
     * In general, MobX doesn't allow that when running computations and React.render.
     * To ensure that those functions stay pure.
     */

    this.allowStateChanges = true;
    /**
     * Is it allowed to read observables at this point?
     * Used to hold the state needed for `observableRequiresReaction`
     */

    this.allowStateReads = true;
    /**
     * If strict mode is enabled, state changes are by default not allowed
     */

    this.enforceActions = false;
    /**
     * Spy callbacks
     */

    this.spyListeners = [];
    /**
     * Globally attached error handlers that react specifically to errors in reactions
     */

    this.globalReactionErrorHandlers = [];
    /**
     * Warn if computed values are accessed outside a reactive context
     */

    this.computedRequiresReaction = false;
    /**
     * (Experimental)
     * Warn if you try to create to derivation / reactive context without accessing any observable.
     */

    this.reactionRequiresObservable = false;
    /**
     * (Experimental)
     * Warn if observables are accessed outside a reactive context
     */

    this.observableRequiresReaction = false;
    /**
     * Allows overwriting of computed properties, useful in tests but not prod as it can cause
     * memory leaks. See https://github.com/mobxjs/mobx/issues/1867
     */

    this.computedConfigurable = false;
    /*
     * Don't catch and rethrow exceptions. This is useful for inspecting the state of
     * the stack when an exception occurs while debugging.
     */

    this.disableErrorBoundaries = false;
    /*
     * If true, we are already handling an exception in an action. Any errors in reactions should be suppressed, as
     * they are not the cause, see: https://github.com/mobxjs/mobx/issues/1836
     */

    this.suppressReactionErrors = false;
  }

  return MobXGlobals;
}();

var mockGlobal = {};

function getGlobal() {
  if (typeof window !== "undefined") {
    return window;
  }

  if (typeof global !== "undefined") {
    return global;
  }

  if (typeof self !== "undefined") {
    return self;
  }

  return mockGlobal;
}

var canMergeGlobalState = true;
var isolateCalled = false;

var globalState = function () {
  var global = getGlobal();
  if (global.__mobxInstanceCount > 0 && !global.__mobxGlobals) canMergeGlobalState = false;
  if (global.__mobxGlobals && global.__mobxGlobals.version !== new MobXGlobals().version) canMergeGlobalState = false;

  if (!canMergeGlobalState) {
    setTimeout(function () {
      if (!isolateCalled) {
        fail("There are multiple, different versions of MobX active. Make sure MobX is loaded only once or use `configure({ isolateGlobalState: true })`");
      }
    }, 1);
    return new MobXGlobals();
  } else if (global.__mobxGlobals) {
    global.__mobxInstanceCount += 1;
    if (!global.__mobxGlobals.UNCHANGED) global.__mobxGlobals.UNCHANGED = {}; // make merge backward compatible

    return global.__mobxGlobals;
  } else {
    global.__mobxInstanceCount = 1;
    return global.__mobxGlobals = new MobXGlobals();
  }
}();

function isolateGlobalState() {
  if (globalState.pendingReactions.length || globalState.inBatch || globalState.isRunningReactions) fail("isolateGlobalState should be called before MobX is running any reactions");
  isolateCalled = true;

  if (canMergeGlobalState) {
    if (--getGlobal().__mobxInstanceCount === 0) getGlobal().__mobxGlobals = undefined;
    globalState = new MobXGlobals();
  }
}

function getGlobalState() {
  return globalState;
}
/**
 * For testing purposes only; this will break the internal state of existing observables,
 * but can be used to get back at a stable state after throwing errors
 */


function resetGlobalState() {
  var defaultGlobals = new MobXGlobals();

  for (var key in defaultGlobals) if (persistentKeys.indexOf(key) === -1) globalState[key] = defaultGlobals[key];

  globalState.allowStateChanges = !globalState.enforceActions;
}

function hasObservers(observable) {
  return observable.observers && observable.observers.size > 0;
}

function getObservers(observable) {
  return observable.observers;
} // function invariantObservers(observable: IObservable) {
//     const list = observable.observers
//     const map = observable.observersIndexes
//     const l = list.length
//     for (let i = 0; i < l; i++) {
//         const id = list[i].__mapid
//         if (i) {
//             invariant(map[id] === i, "INTERNAL ERROR maps derivation.__mapid to index in list") // for performance
//         } else {
//             invariant(!(id in map), "INTERNAL ERROR observer on index 0 shouldn't be held in map.") // for performance
//         }
//     }
//     invariant(
//         list.length === 0 || Object.keys(map).length === list.length - 1,
//         "INTERNAL ERROR there is no junk in map"
//     )
// }


function addObserver(observable, node) {
  // invariant(node.dependenciesState !== -1, "INTERNAL ERROR, can add only dependenciesState !== -1");
  // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR add already added node");
  // invariantObservers(observable);
  observable.observers.add(node);
  if (observable.lowestObserverState > node.dependenciesState) observable.lowestObserverState = node.dependenciesState; // invariantObservers(observable);
  // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR didn't add node");
}

function removeObserver(observable, node) {
  // invariant(globalState.inBatch > 0, "INTERNAL ERROR, remove should be called only inside batch");
  // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR remove already removed node");
  // invariantObservers(observable);
  observable.observers.delete(node);

  if (observable.observers.size === 0) {
    // deleting last observer
    queueForUnobservation(observable);
  } // invariantObservers(observable);
  // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR remove already removed node2");

}

function queueForUnobservation(observable) {
  if (observable.isPendingUnobservation === false) {
    // invariant(observable._observers.length === 0, "INTERNAL ERROR, should only queue for unobservation unobserved observables");
    observable.isPendingUnobservation = true;
    globalState.pendingUnobservations.push(observable);
  }
}
/**
 * Batch starts a transaction, at least for purposes of memoizing ComputedValues when nothing else does.
 * During a batch `onBecomeUnobserved` will be called at most once per observable.
 * Avoids unnecessary recalculations.
 */


function startBatch() {
  globalState.inBatch++;
}

function endBatch() {
  if (--globalState.inBatch === 0) {
    runReactions(); // the batch is actually about to finish, all unobserving should happen here.

    var list = globalState.pendingUnobservations;

    for (var i = 0; i < list.length; i++) {
      var observable = list[i];
      observable.isPendingUnobservation = false;

      if (observable.observers.size === 0) {
        if (observable.isBeingObserved) {
          // if this observable had reactive observers, trigger the hooks
          observable.isBeingObserved = false;
          observable.onBecomeUnobserved();
        }

        if (observable instanceof ComputedValue) {
          // computed values are automatically teared down when the last observer leaves
          // this process happens recursively, this computed might be the last observabe of another, etc..
          observable.suspend();
        }
      }
    }

    globalState.pendingUnobservations = [];
  }
}

function reportObserved(observable) {
  checkIfStateReadsAreAllowed(observable);
  var derivation = globalState.trackingDerivation;

  if (derivation !== null) {
    /**
     * Simple optimization, give each derivation run an unique id (runId)
     * Check if last time this observable was accessed the same runId is used
     * if this is the case, the relation is already known
     */
    if (derivation.runId !== observable.lastAccessedBy) {
      observable.lastAccessedBy = derivation.runId; // Tried storing newObserving, or observing, or both as Set, but performance didn't come close...

      derivation.newObserving[derivation.unboundDepsCount++] = observable;

      if (!observable.isBeingObserved) {
        observable.isBeingObserved = true;
        observable.onBecomeObserved();
      }
    }

    return true;
  } else if (observable.observers.size === 0 && globalState.inBatch > 0) {
    queueForUnobservation(observable);
  }

  return false;
} // function invariantLOS(observable: IObservable, msg: string) {
//     // it's expensive so better not run it in produciton. but temporarily helpful for testing
//     const min = getObservers(observable).reduce((a, b) => Math.min(a, b.dependenciesState), 2)
//     if (min >= observable.lowestObserverState) return // <- the only assumption about `lowestObserverState`
//     throw new Error(
//         "lowestObserverState is wrong for " +
//             msg +
//             " because " +
//             min +
//             " < " +
//             observable.lowestObserverState
//     )
// }

/**
 * NOTE: current propagation mechanism will in case of self reruning autoruns behave unexpectedly
 * It will propagate changes to observers from previous run
 * It's hard or maybe impossible (with reasonable perf) to get it right with current approach
 * Hopefully self reruning autoruns aren't a feature people should depend on
 * Also most basic use cases should be ok
 */
// Called by Atom when its value changes


function propagateChanged(observable) {
  // invariantLOS(observable, "changed start");
  if (observable.lowestObserverState === IDerivationState.STALE) return;
  observable.lowestObserverState = IDerivationState.STALE; // Ideally we use for..of here, but the downcompiled version is really slow...

  observable.observers.forEach(function (d) {
    if (d.dependenciesState === IDerivationState.UP_TO_DATE) {
      if (d.isTracing !== TraceMode.NONE) {
        logTraceInfo(d, observable);
      }

      d.onBecomeStale();
    }

    d.dependenciesState = IDerivationState.STALE;
  }); // invariantLOS(observable, "changed end");
} // Called by ComputedValue when it recalculate and its value changed


function propagateChangeConfirmed(observable) {
  // invariantLOS(observable, "confirmed start");
  if (observable.lowestObserverState === IDerivationState.STALE) return;
  observable.lowestObserverState = IDerivationState.STALE;
  observable.observers.forEach(function (d) {
    if (d.dependenciesState === IDerivationState.POSSIBLY_STALE) d.dependenciesState = IDerivationState.STALE;else if (d.dependenciesState === IDerivationState.UP_TO_DATE // this happens during computing of `d`, just keep lowestObserverState up to date.
    ) observable.lowestObserverState = IDerivationState.UP_TO_DATE;
  }); // invariantLOS(observable, "confirmed end");
} // Used by computed when its dependency changed, but we don't wan't to immediately recompute.


function propagateMaybeChanged(observable) {
  // invariantLOS(observable, "maybe start");
  if (observable.lowestObserverState !== IDerivationState.UP_TO_DATE) return;
  observable.lowestObserverState = IDerivationState.POSSIBLY_STALE;
  observable.observers.forEach(function (d) {
    if (d.dependenciesState === IDerivationState.UP_TO_DATE) {
      d.dependenciesState = IDerivationState.POSSIBLY_STALE;

      if (d.isTracing !== TraceMode.NONE) {
        logTraceInfo(d, observable);
      }

      d.onBecomeStale();
    }
  }); // invariantLOS(observable, "maybe end");
}

function logTraceInfo(derivation, observable) {
  console.log("[mobx.trace] '" + derivation.name + "' is invalidated due to a change in: '" + observable.name + "'");

  if (derivation.isTracing === TraceMode.BREAK) {
    var lines = [];
    printDepTree(getDependencyTree(derivation), lines, 1); // prettier-ignore

    new Function("debugger;\n/*\nTracing '" + derivation.name + "'\n\nYou are entering this break point because derivation '" + derivation.name + "' is being traced and '" + observable.name + "' is now forcing it to update.\nJust follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update\nThe stackframe you are looking for is at least ~6-8 stack-frames up.\n\n" + (derivation instanceof ComputedValue ? derivation.derivation.toString().replace(/[*]\//g, "/") : "") + "\n\nThe dependencies for this derivation are:\n\n" + lines.join("\n") + "\n*/\n    ")();
  }
}

function printDepTree(tree, lines, depth) {
  if (lines.length >= 1000) {
    lines.push("(and many more)");
    return;
  }

  lines.push("" + new Array(depth).join("\t") + tree.name); // MWE: not the fastest, but the easiest way :)

  if (tree.dependencies) tree.dependencies.forEach(function (child) {
    return printDepTree(child, lines, depth + 1);
  });
}

var Reaction =
/** @class */
function () {
  function Reaction(name, onInvalidate, errorHandler, requiresObservable) {
    if (name === void 0) {
      name = "Reaction@" + getNextId();
    }

    if (requiresObservable === void 0) {
      requiresObservable = false;
    }

    this.name = name;
    this.onInvalidate = onInvalidate;
    this.errorHandler = errorHandler;
    this.requiresObservable = requiresObservable;
    this.observing = []; // nodes we are looking at. Our value depends on these nodes

    this.newObserving = [];
    this.dependenciesState = IDerivationState.NOT_TRACKING;
    this.diffValue = 0;
    this.runId = 0;
    this.unboundDepsCount = 0;
    this.__mapid = "#" + getNextId();
    this.isDisposed = false;
    this._isScheduled = false;
    this._isTrackPending = false;
    this._isRunning = false;
    this.isTracing = TraceMode.NONE;
  }

  Reaction.prototype.onBecomeStale = function () {
    this.schedule();
  };

  Reaction.prototype.schedule = function () {
    if (!this._isScheduled) {
      this._isScheduled = true;
      globalState.pendingReactions.push(this);
      runReactions();
    }
  };

  Reaction.prototype.isScheduled = function () {
    return this._isScheduled;
  };
  /**
   * internal, use schedule() if you intend to kick off a reaction
   */


  Reaction.prototype.runReaction = function () {
    if (!this.isDisposed) {
      startBatch();
      this._isScheduled = false;

      if (shouldCompute(this)) {
        this._isTrackPending = true;

        try {
          this.onInvalidate();

          if (this._isTrackPending && isSpyEnabled() && "development" !== "production") {
            // onInvalidate didn't trigger track right away..
            spyReport({
              name: this.name,
              type: "scheduled-reaction"
            });
          }
        } catch (e) {
          this.reportExceptionInDerivation(e);
        }
      }

      endBatch();
    }
  };

  Reaction.prototype.track = function (fn) {
    if (this.isDisposed) {
      return; // console.warn("Reaction already disposed") // Note: Not a warning / error in mobx 4 either
    }

    startBatch();
    var notify = isSpyEnabled();
    var startTime;

    if (notify && "development" !== "production") {
      startTime = Date.now();
      spyReportStart({
        name: this.name,
        type: "reaction"
      });
    }

    this._isRunning = true;
    var result = trackDerivedFunction(this, fn, undefined);
    this._isRunning = false;
    this._isTrackPending = false;

    if (this.isDisposed) {
      // disposed during last run. Clean up everything that was bound after the dispose call.
      clearObserving(this);
    }

    if (isCaughtException(result)) this.reportExceptionInDerivation(result.cause);

    if (notify && "development" !== "production") {
      spyReportEnd({
        time: Date.now() - startTime
      });
    }

    endBatch();
  };

  Reaction.prototype.reportExceptionInDerivation = function (error) {
    var _this = this;

    if (this.errorHandler) {
      this.errorHandler(error, this);
      return;
    }

    if (globalState.disableErrorBoundaries) throw error;
    var message = "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this + "'";

    if (globalState.suppressReactionErrors) {
      console.warn("[mobx] (error in reaction '" + this.name + "' suppressed, fix error of causing action below)"); // prettier-ignore
    } else {
      console.error(message, error);
      /** If debugging brought you here, please, read the above message :-). Tnx! */
    }

    if (isSpyEnabled()) {
      spyReport({
        type: "error",
        name: this.name,
        message: message,
        error: "" + error
      });
    }

    globalState.globalReactionErrorHandlers.forEach(function (f) {
      return f(error, _this);
    });
  };

  Reaction.prototype.dispose = function () {
    if (!this.isDisposed) {
      this.isDisposed = true;

      if (!this._isRunning) {
        // if disposed while running, clean up later. Maybe not optimal, but rare case
        startBatch();
        clearObserving(this);
        endBatch();
      }
    }
  };

  Reaction.prototype.getDisposer = function () {
    var r = this.dispose.bind(this);
    r[$mobx] = this;
    return r;
  };

  Reaction.prototype.toString = function () {
    return "Reaction[" + this.name + "]";
  };

  Reaction.prototype.trace = function (enterBreakPoint) {
    if (enterBreakPoint === void 0) {
      enterBreakPoint = false;
    }

    trace(this, enterBreakPoint);
  };

  return Reaction;
}();

exports.Reaction = Reaction;

function onReactionError(handler) {
  globalState.globalReactionErrorHandlers.push(handler);
  return function () {
    var idx = globalState.globalReactionErrorHandlers.indexOf(handler);
    if (idx >= 0) globalState.globalReactionErrorHandlers.splice(idx, 1);
  };
}
/**
 * Magic number alert!
 * Defines within how many times a reaction is allowed to re-trigger itself
 * until it is assumed that this is gonna be a never ending loop...
 */


var MAX_REACTION_ITERATIONS = 100;

var reactionScheduler = function (f) {
  return f();
};

function runReactions() {
  // Trampolining, if runReactions are already running, new reactions will be picked up
  if (globalState.inBatch > 0 || globalState.isRunningReactions) return;
  reactionScheduler(runReactionsHelper);
}

function runReactionsHelper() {
  globalState.isRunningReactions = true;
  var allReactions = globalState.pendingReactions;
  var iterations = 0; // While running reactions, new reactions might be triggered.
  // Hence we work with two variables and check whether
  // we converge to no remaining reactions after a while.

  while (allReactions.length > 0) {
    if (++iterations === MAX_REACTION_ITERATIONS) {
      console.error("Reaction doesn't converge to a stable state after " + MAX_REACTION_ITERATIONS + " iterations." + (" Probably there is a cycle in the reactive function: " + allReactions[0]));
      allReactions.splice(0); // clear reactions
    }

    var remainingReactions = allReactions.splice(0);

    for (var i = 0, l = remainingReactions.length; i < l; i++) remainingReactions[i].runReaction();
  }

  globalState.isRunningReactions = false;
}

var isReaction = createInstanceofPredicate("Reaction", Reaction);

function setReactionScheduler(fn) {
  var baseScheduler = reactionScheduler;

  reactionScheduler = function (f) {
    return fn(function () {
      return baseScheduler(f);
    });
  };
}

function isSpyEnabled() {
  return "development" !== "production" && !!globalState.spyListeners.length;
}

function spyReport(event) {
  if ("development" === "production") return; // dead code elimination can do the rest

  if (!globalState.spyListeners.length) return;
  var listeners = globalState.spyListeners;

  for (var i = 0, l = listeners.length; i < l; i++) listeners[i](event);
}

function spyReportStart(event) {
  if ("development" === "production") return;

  var change = __assign(__assign({}, event), {
    spyReportStart: true
  });

  spyReport(change);
}

var END_EVENT = {
  spyReportEnd: true
};

function spyReportEnd(change) {
  if ("development" === "production") return;
  if (change) spyReport(__assign(__assign({}, change), {
    spyReportEnd: true
  }));else spyReport(END_EVENT);
}

function spy(listener) {
  if ("development" === "production") {
    console.warn("[mobx.spy] Is a no-op in production builds");
    return function () {};
  } else {
    globalState.spyListeners.push(listener);
    return once(function () {
      globalState.spyListeners = globalState.spyListeners.filter(function (l) {
        return l !== listener;
      });
    });
  }
}

function dontReassignFields() {
  fail("development" !== "production" && "@action fields are not reassignable");
}

function namedActionDecorator(name) {
  return function (target, prop, descriptor) {
    if (descriptor) {
      if ("development" !== "production" && descriptor.get !== undefined) {
        return fail("@action cannot be used with getters");
      } // babel / typescript
      // @action method() { }


      if (descriptor.value) {
        // typescript
        return {
          value: createAction(name, descriptor.value),
          enumerable: false,
          configurable: true,
          writable: true // for typescript, this must be writable, otherwise it cannot inherit :/ (see inheritable actions test)

        };
      } // babel only: @action method = () => {}


      var initializer_1 = descriptor.initializer;
      return {
        enumerable: false,
        configurable: true,
        writable: true,
        initializer: function () {
          // N.B: we can't immediately invoke initializer; this would be wrong
          return createAction(name, initializer_1.call(this));
        }
      };
    } // bound instance methods


    return actionFieldDecorator(name).apply(this, arguments);
  };
}

function actionFieldDecorator(name) {
  // Simple property that writes on first invocation to the current instance
  return function (target, prop, descriptor) {
    Object.defineProperty(target, prop, {
      configurable: true,
      enumerable: false,
      get: function () {
        return undefined;
      },
      set: function (value) {
        addHiddenProp(this, prop, action(name, value));
      }
    });
  };
}

function boundActionDecorator(target, propertyName, descriptor, applyToInstance) {
  if (applyToInstance === true) {
    defineBoundAction(target, propertyName, descriptor.value);
    return null;
  }

  if (descriptor) {
    // if (descriptor.value)
    // Typescript / Babel: @action.bound method() { }
    // also: babel @action.bound method = () => {}
    return {
      configurable: true,
      enumerable: false,
      get: function () {
        defineBoundAction(this, propertyName, descriptor.value || descriptor.initializer.call(this));
        return this[propertyName];
      },
      set: dontReassignFields
    };
  } // field decorator Typescript @action.bound method = () => {}


  return {
    enumerable: false,
    configurable: true,
    set: function (v) {
      defineBoundAction(this, propertyName, v);
    },
    get: function () {
      return undefined;
    }
  };
}

var action = function action(arg1, arg2, arg3, arg4) {
  // action(fn() {})
  if (arguments.length === 1 && typeof arg1 === "function") return createAction(arg1.name || "<unnamed action>", arg1); // action("name", fn() {})

  if (arguments.length === 2 && typeof arg2 === "function") return createAction(arg1, arg2); // @action("name") fn() {}

  if (arguments.length === 1 && typeof arg1 === "string") return namedActionDecorator(arg1); // @action fn() {}

  if (arg4 === true) {
    // apply to instance immediately
    addHiddenProp(arg1, arg2, createAction(arg1.name || arg2, arg3.value, this));
  } else {
    return namedActionDecorator(arg2).apply(null, arguments);
  }
};

exports.action = action;
action.bound = boundActionDecorator;

function runInAction(arg1, arg2) {
  var actionName = typeof arg1 === "string" ? arg1 : arg1.name || "<unnamed action>";
  var fn = typeof arg1 === "function" ? arg1 : arg2;

  if ("development" !== "production") {
    invariant(typeof fn === "function" && fn.length === 0, "`runInAction` expects a function without arguments");
    if (typeof actionName !== "string" || !actionName) fail("actions should have valid names, got: '" + actionName + "'");
  }

  return executeAction(actionName, fn, this, undefined);
}

function isAction(thing) {
  return typeof thing === "function" && thing.isMobxAction === true;
}

function defineBoundAction(target, propertyName, fn) {
  addHiddenProp(target, propertyName, createAction(propertyName, fn.bind(target)));
}
/**
 * Creates a named reactive view and keeps it alive, so that the view is always
 * updated if one of the dependencies changes, even when the view is not further used by something else.
 * @param view The reactive view
 * @returns disposer function, which can be used to stop the view from being updated in the future.
 */


function autorun(view, opts) {
  if (opts === void 0) {
    opts = EMPTY_OBJECT;
  }

  if ("development" !== "production") {
    invariant(typeof view === "function", "Autorun expects a function as first argument");
    invariant(isAction(view) === false, "Autorun does not accept actions since actions are untrackable");
  }

  var name = opts && opts.name || view.name || "Autorun@" + getNextId();
  var runSync = !opts.scheduler && !opts.delay;
  var reaction;

  if (runSync) {
    // normal autorun
    reaction = new Reaction(name, function () {
      this.track(reactionRunner);
    }, opts.onError, opts.requiresObservable);
  } else {
    var scheduler_1 = createSchedulerFromOptions(opts); // debounced autorun

    var isScheduled_1 = false;
    reaction = new Reaction(name, function () {
      if (!isScheduled_1) {
        isScheduled_1 = true;
        scheduler_1(function () {
          isScheduled_1 = false;
          if (!reaction.isDisposed) reaction.track(reactionRunner);
        });
      }
    }, opts.onError, opts.requiresObservable);
  }

  function reactionRunner() {
    view(reaction);
  }

  reaction.schedule();
  return reaction.getDisposer();
}

var run = function (f) {
  return f();
};

function createSchedulerFromOptions(opts) {
  return opts.scheduler ? opts.scheduler : opts.delay ? function (f) {
    return setTimeout(f, opts.delay);
  } : run;
}

function reaction(expression, effect, opts) {
  if (opts === void 0) {
    opts = EMPTY_OBJECT;
  }

  if ("development" !== "production") {
    invariant(typeof expression === "function", "First argument to reaction should be a function");
    invariant(typeof opts === "object", "Third argument of reactions should be an object");
  }

  var name = opts.name || "Reaction@" + getNextId();
  var effectAction = action(name, opts.onError ? wrapErrorHandler(opts.onError, effect) : effect);
  var runSync = !opts.scheduler && !opts.delay;
  var scheduler = createSchedulerFromOptions(opts);
  var firstTime = true;
  var isScheduled = false;
  var value;
  var equals = opts.compareStructural ? comparer.structural : opts.equals || comparer.default;
  var r = new Reaction(name, function () {
    if (firstTime || runSync) {
      reactionRunner();
    } else if (!isScheduled) {
      isScheduled = true;
      scheduler(reactionRunner);
    }
  }, opts.onError, opts.requiresObservable);

  function reactionRunner() {
    isScheduled = false; // Q: move into reaction runner?

    if (r.isDisposed) return;
    var changed = false;
    r.track(function () {
      var nextValue = expression(r);
      changed = firstTime || !equals(value, nextValue);
      value = nextValue;
    });
    if (firstTime && opts.fireImmediately) effectAction(value, r);
    if (!firstTime && changed === true) effectAction(value, r);
    if (firstTime) firstTime = false;
  }

  r.schedule();
  return r.getDisposer();
}

function wrapErrorHandler(errorHandler, baseFn) {
  return function () {
    try {
      return baseFn.apply(this, arguments);
    } catch (e) {
      errorHandler.call(this, e);
    }
  };
}

function onBecomeObserved(thing, arg2, arg3) {
  return interceptHook("onBecomeObserved", thing, arg2, arg3);
}

function onBecomeUnobserved(thing, arg2, arg3) {
  return interceptHook("onBecomeUnobserved", thing, arg2, arg3);
}

function interceptHook(hook, thing, arg2, arg3) {
  var atom = typeof arg3 === "function" ? getAtom(thing, arg2) : getAtom(thing);
  var cb = typeof arg3 === "function" ? arg3 : arg2;
  var listenersKey = hook + "Listeners";

  if (atom[listenersKey]) {
    atom[listenersKey].add(cb);
  } else {
    atom[listenersKey] = new Set([cb]);
  }

  var orig = atom[hook];
  if (typeof orig !== "function") return fail("development" !== "production" && "Not an atom that can be (un)observed");
  return function () {
    var hookListeners = atom[listenersKey];

    if (hookListeners) {
      hookListeners.delete(cb);

      if (hookListeners.size === 0) {
        delete atom[listenersKey];
      }
    }
  };
}

function configure(options) {
  var enforceActions = options.enforceActions,
      computedRequiresReaction = options.computedRequiresReaction,
      computedConfigurable = options.computedConfigurable,
      disableErrorBoundaries = options.disableErrorBoundaries,
      reactionScheduler = options.reactionScheduler,
      reactionRequiresObservable = options.reactionRequiresObservable,
      observableRequiresReaction = options.observableRequiresReaction;

  if (options.isolateGlobalState === true) {
    isolateGlobalState();
  }

  if (enforceActions !== undefined) {
    if (typeof enforceActions === "boolean" || enforceActions === "strict") deprecated("Deprecated value for 'enforceActions', use 'false' => '\"never\"', 'true' => '\"observed\"', '\"strict\"' => \"'always'\" instead");
    var ea = void 0;

    switch (enforceActions) {
      case true:
      case "observed":
        ea = true;
        break;

      case false:
      case "never":
        ea = false;
        break;

      case "strict":
      case "always":
        ea = "strict";
        break;

      default:
        fail("Invalid value for 'enforceActions': '" + enforceActions + "', expected 'never', 'always' or 'observed'");
    }

    globalState.enforceActions = ea;
    globalState.allowStateChanges = ea === true || ea === "strict" ? false : true;
  }

  if (computedRequiresReaction !== undefined) {
    globalState.computedRequiresReaction = !!computedRequiresReaction;
  }

  if (reactionRequiresObservable !== undefined) {
    globalState.reactionRequiresObservable = !!reactionRequiresObservable;
  }

  if (observableRequiresReaction !== undefined) {
    globalState.observableRequiresReaction = !!observableRequiresReaction;
    globalState.allowStateReads = !globalState.observableRequiresReaction;
  }

  if (computedConfigurable !== undefined) {
    globalState.computedConfigurable = !!computedConfigurable;
  }

  if (disableErrorBoundaries !== undefined) {
    if (disableErrorBoundaries === true) console.warn("WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled.");
    globalState.disableErrorBoundaries = !!disableErrorBoundaries;
  }

  if (reactionScheduler) {
    setReactionScheduler(reactionScheduler);
  }
}

function decorate(thing, decorators) {
  "development" !== "production" && invariant(isPlainObject(decorators), "Decorators should be a key value map");
  var target = typeof thing === "function" ? thing.prototype : thing;

  var _loop_1 = function (prop) {
    var propertyDecorators = decorators[prop];

    if (!Array.isArray(propertyDecorators)) {
      propertyDecorators = [propertyDecorators];
    }

    "development" !== "production" && invariant(propertyDecorators.every(function (decorator) {
      return typeof decorator === "function";
    }), "Decorate: expected a decorator function or array of decorator functions for '" + prop + "'");
    var descriptor = Object.getOwnPropertyDescriptor(target, prop);
    var newDescriptor = propertyDecorators.reduce(function (accDescriptor, decorator) {
      return decorator(target, prop, accDescriptor);
    }, descriptor);
    if (newDescriptor) Object.defineProperty(target, prop, newDescriptor);
  };

  for (var prop in decorators) {
    _loop_1(prop);
  }

  return thing;
}

function extendObservable(target, properties, decorators, options) {
  if ("development" !== "production") {
    invariant(arguments.length >= 2 && arguments.length <= 4, "'extendObservable' expected 2-4 arguments");
    invariant(typeof target === "object", "'extendObservable' expects an object as first argument");
    invariant(!isObservableMap(target), "'extendObservable' should not be used on maps, use map.merge instead");
  }

  options = asCreateObservableOptions(options);
  var defaultDecorator = getDefaultDecoratorFromObjectOptions(options);
  initializeInstance(target); // Fixes #1740

  asObservableObject(target, options.name, defaultDecorator.enhancer); // make sure object is observable, even without initial props

  if (properties) extendObservableObjectWithProperties(target, properties, decorators, defaultDecorator);
  return target;
}

function getDefaultDecoratorFromObjectOptions(options) {
  return options.defaultDecorator || (options.deep === false ? refDecorator : deepDecorator);
}

function extendObservableObjectWithProperties(target, properties, decorators, defaultDecorator) {
  var e_1, _a, e_2, _b;

  if ("development" !== "production") {
    invariant(!isObservable(properties), "Extending an object with another observable (object) is not supported. Please construct an explicit propertymap, using `toJS` if need. See issue #540");

    if (decorators) {
      var keys = getPlainObjectKeys(decorators);

      try {
        for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
          var key = keys_1_1.value;
          if (!(key in properties)) fail("Trying to declare a decorator for unspecified property '" + stringifyKey(key) + "'");
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }
  }

  startBatch();

  try {
    var keys = getPlainObjectKeys(properties);

    try {
      for (var keys_2 = __values(keys), keys_2_1 = keys_2.next(); !keys_2_1.done; keys_2_1 = keys_2.next()) {
        var key = keys_2_1.value;
        var descriptor = Object.getOwnPropertyDescriptor(properties, key);

        if ("development" !== "production") {
          if (!isPlainObject(properties)) fail("'extendObservabe' only accepts plain objects as second argument");
          if (Object.getOwnPropertyDescriptor(target, key)) fail("'extendObservable' can only be used to introduce new properties. Use 'set' or 'decorate' instead. The property '" + stringifyKey(key) + "' already exists on '" + target + "'");
          if (isComputed(descriptor.value)) fail("Passing a 'computed' as initial property value is no longer supported by extendObservable. Use a getter or decorator instead");
        }

        var decorator = decorators && key in decorators ? decorators[key] : descriptor.get ? computedDecorator : defaultDecorator;
        if ("development" !== "production" && typeof decorator !== "function") fail("Not a valid decorator for '" + stringifyKey(key) + "', got: " + decorator);
        var resultDescriptor = decorator(target, key, descriptor, true);
        if (resultDescriptor // otherwise, assume already applied, due to `applyToInstance`
        ) Object.defineProperty(target, key, resultDescriptor);
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (keys_2_1 && !keys_2_1.done && (_b = keys_2.return)) _b.call(keys_2);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
  } finally {
    endBatch();
  }
}

function getDependencyTree(thing, property) {
  return nodeToDependencyTree(getAtom(thing, property));
}

function nodeToDependencyTree(node) {
  var result = {
    name: node.name
  };
  if (node.observing && node.observing.length > 0) result.dependencies = unique(node.observing).map(nodeToDependencyTree);
  return result;
}

function getObserverTree(thing, property) {
  return nodeToObserverTree(getAtom(thing, property));
}

function nodeToObserverTree(node) {
  var result = {
    name: node.name
  };
  if (hasObservers(node)) result.observers = Array.from(getObservers(node)).map(nodeToObserverTree);
  return result;
}

var generatorId = 0;

var FlowCancellationError =
/** @class */
function (_super) {
  __extends(FlowCancellationError, _super);

  function FlowCancellationError() {
    return _super.call(this, "FLOW_CANCELLED") || this;
  }

  return FlowCancellationError;
}(Error);

exports.FlowCancellationError = FlowCancellationError;

function isFlowCancellationError(error) {
  return error instanceof FlowCancellationError;
}

function flow(generator) {
  if (arguments.length !== 1) fail(!!"development" && "Flow expects 1 argument and cannot be used as decorator");
  var name = generator.name || "<unnamed flow>"; // Implementation based on https://github.com/tj/co/blob/master/index.js

  return function () {
    var ctx = this;
    var args = arguments;
    var runId = ++generatorId;
    var gen = action(name + " - runid: " + runId + " - init", generator).apply(ctx, args);
    var rejector;
    var pendingPromise = undefined;
    var promise = new Promise(function (resolve, reject) {
      var stepId = 0;
      rejector = reject;

      function onFulfilled(res) {
        pendingPromise = undefined;
        var ret;

        try {
          ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen.next).call(gen, res);
        } catch (e) {
          return reject(e);
        }

        next(ret);
      }

      function onRejected(err) {
        pendingPromise = undefined;
        var ret;

        try {
          ret = action(name + " - runid: " + runId + " - yield " + stepId++, gen.throw).call(gen, err);
        } catch (e) {
          return reject(e);
        }

        next(ret);
      }

      function next(ret) {
        if (ret && typeof ret.then === "function") {
          // an async iterator
          ret.then(next, reject);
          return;
        }

        if (ret.done) return resolve(ret.value);
        pendingPromise = Promise.resolve(ret.value);
        return pendingPromise.then(onFulfilled, onRejected);
      }

      onFulfilled(undefined); // kick off the process
    });
    promise.cancel = action(name + " - runid: " + runId + " - cancel", function () {
      try {
        if (pendingPromise) cancelPromise(pendingPromise); // Finally block can return (or yield) stuff..

        var res = gen.return(undefined); // eat anything that promise would do, it's cancelled!

        var yieldedPromise = Promise.resolve(res.value);
        yieldedPromise.then(noop, noop);
        cancelPromise(yieldedPromise); // maybe it can be cancelled :)
        // reject our original promise

        rejector(new FlowCancellationError());
      } catch (e) {
        rejector(e); // there could be a throwing finally block
      }
    });
    return promise;
  };
}

function cancelPromise(promise) {
  if (typeof promise.cancel === "function") promise.cancel();
}

function interceptReads(thing, propOrHandler, handler) {
  var target;

  if (isObservableMap(thing) || isObservableArray(thing) || isObservableValue(thing)) {
    target = getAdministration(thing);
  } else if (isObservableObject(thing)) {
    if (typeof propOrHandler !== "string") return fail("development" !== "production" && "InterceptReads can only be used with a specific property, not with an object in general");
    target = getAdministration(thing, propOrHandler);
  } else {
    return fail("development" !== "production" && "Expected observable map, object or array as first array");
  }

  if (target.dehancer !== undefined) return fail("development" !== "production" && "An intercept reader was already established");
  target.dehancer = typeof propOrHandler === "function" ? propOrHandler : handler;
  return function () {
    target.dehancer = undefined;
  };
}

function intercept(thing, propOrHandler, handler) {
  if (typeof handler === "function") return interceptProperty(thing, propOrHandler, handler);else return interceptInterceptable(thing, propOrHandler);
}

function interceptInterceptable(thing, handler) {
  return getAdministration(thing).intercept(handler);
}

function interceptProperty(thing, property, handler) {
  return getAdministration(thing, property).intercept(handler);
}

function _isComputed(value, property) {
  if (value === null || value === undefined) return false;

  if (property !== undefined) {
    if (isObservableObject(value) === false) return false;
    if (!value[$mobx].values.has(property)) return false;
    var atom = getAtom(value, property);
    return isComputedValue(atom);
  }

  return isComputedValue(value);
}

function isComputed(value) {
  if (arguments.length > 1) return fail("development" !== "production" && "isComputed expects only 1 argument. Use isObservableProp to inspect the observability of a property");
  return _isComputed(value);
}

function isComputedProp(value, propName) {
  if (typeof propName !== "string") return fail("development" !== "production" && "isComputed expected a property name as second argument");
  return _isComputed(value, propName);
}

function _isObservable(value, property) {
  if (value === null || value === undefined) return false;

  if (property !== undefined) {
    if ("development" !== "production" && (isObservableMap(value) || isObservableArray(value))) return fail("isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.");

    if (isObservableObject(value)) {
      return value[$mobx].values.has(property);
    }

    return false;
  } // For first check, see #701


  return isObservableObject(value) || !!value[$mobx] || isAtom(value) || isReaction(value) || isComputedValue(value);
}

function isObservable(value) {
  if (arguments.length !== 1) fail("development" !== "production" && "isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property");
  return _isObservable(value);
}

function isObservableProp(value, propName) {
  if (typeof propName !== "string") return fail("development" !== "production" && "expected a property name as second argument");
  return _isObservable(value, propName);
}

function keys(obj) {
  if (isObservableObject(obj)) {
    return obj[$mobx].getKeys();
  }

  if (isObservableMap(obj)) {
    return Array.from(obj.keys());
  }

  if (isObservableSet(obj)) {
    return Array.from(obj.keys());
  }

  if (isObservableArray(obj)) {
    return obj.map(function (_, index) {
      return index;
    });
  }

  return fail("development" !== "production" && "'keys()' can only be used on observable objects, arrays, sets and maps");
}

function values(obj) {
  if (isObservableObject(obj)) {
    return keys(obj).map(function (key) {
      return obj[key];
    });
  }

  if (isObservableMap(obj)) {
    return keys(obj).map(function (key) {
      return obj.get(key);
    });
  }

  if (isObservableSet(obj)) {
    return Array.from(obj.values());
  }

  if (isObservableArray(obj)) {
    return obj.slice();
  }

  return fail("development" !== "production" && "'values()' can only be used on observable objects, arrays, sets and maps");
}

function entries(obj) {
  if (isObservableObject(obj)) {
    return keys(obj).map(function (key) {
      return [key, obj[key]];
    });
  }

  if (isObservableMap(obj)) {
    return keys(obj).map(function (key) {
      return [key, obj.get(key)];
    });
  }

  if (isObservableSet(obj)) {
    return Array.from(obj.entries());
  }

  if (isObservableArray(obj)) {
    return obj.map(function (key, index) {
      return [index, key];
    });
  }

  return fail("development" !== "production" && "'entries()' can only be used on observable objects, arrays and maps");
}

function set(obj, key, value) {
  if (arguments.length === 2 && !isObservableSet(obj)) {
    startBatch();
    var values_1 = key;

    try {
      for (var key_1 in values_1) set(obj, key_1, values_1[key_1]);
    } finally {
      endBatch();
    }

    return;
  }

  if (isObservableObject(obj)) {
    var adm = obj[$mobx];
    var existingObservable = adm.values.get(key);

    if (existingObservable) {
      adm.write(key, value);
    } else {
      adm.addObservableProp(key, value, adm.defaultEnhancer);
    }
  } else if (isObservableMap(obj)) {
    obj.set(key, value);
  } else if (isObservableSet(obj)) {
    obj.add(key);
  } else if (isObservableArray(obj)) {
    if (typeof key !== "number") key = parseInt(key, 10);
    invariant(key >= 0, "Not a valid index: '" + key + "'");
    startBatch();
    if (key >= obj.length) obj.length = key + 1;
    obj[key] = value;
    endBatch();
  } else {
    return fail("development" !== "production" && "'set()' can only be used on observable objects, arrays and maps");
  }
}

function remove(obj, key) {
  if (isObservableObject(obj)) {
    obj[$mobx].remove(key);
  } else if (isObservableMap(obj)) {
    obj.delete(key);
  } else if (isObservableSet(obj)) {
    obj.delete(key);
  } else if (isObservableArray(obj)) {
    if (typeof key !== "number") key = parseInt(key, 10);
    invariant(key >= 0, "Not a valid index: '" + key + "'");
    obj.splice(key, 1);
  } else {
    return fail("development" !== "production" && "'remove()' can only be used on observable objects, arrays and maps");
  }
}

function has(obj, key) {
  if (isObservableObject(obj)) {
    // return keys(obj).indexOf(key) >= 0
    var adm = getAdministration(obj);
    return adm.has(key);
  } else if (isObservableMap(obj)) {
    return obj.has(key);
  } else if (isObservableSet(obj)) {
    return obj.has(key);
  } else if (isObservableArray(obj)) {
    return key >= 0 && key < obj.length;
  } else {
    return fail("development" !== "production" && "'has()' can only be used on observable objects, arrays and maps");
  }
}

function get(obj, key) {
  if (!has(obj, key)) return undefined;

  if (isObservableObject(obj)) {
    return obj[key];
  } else if (isObservableMap(obj)) {
    return obj.get(key);
  } else if (isObservableArray(obj)) {
    return obj[key];
  } else {
    return fail("development" !== "production" && "'get()' can only be used on observable objects, arrays and maps");
  }
}

function observe(thing, propOrCb, cbOrFire, fireImmediately) {
  if (typeof cbOrFire === "function") return observeObservableProperty(thing, propOrCb, cbOrFire, fireImmediately);else return observeObservable(thing, propOrCb, cbOrFire);
}

function observeObservable(thing, listener, fireImmediately) {
  return getAdministration(thing).observe(listener, fireImmediately);
}

function observeObservableProperty(thing, property, listener, fireImmediately) {
  return getAdministration(thing, property).observe(listener, fireImmediately);
}

var defaultOptions = {
  detectCycles: true,
  exportMapsAsObjects: true,
  recurseEverything: false
};

function cache(map, key, value, options) {
  if (options.detectCycles) map.set(key, value);
  return value;
}

function toJSHelper(source, options, __alreadySeen) {
  if (!options.recurseEverything && !isObservable(source)) return source;
  if (typeof source !== "object") return source; // Directly return null if source is null

  if (source === null) return null; // Directly return the Date object itself if contained in the observable

  if (source instanceof Date) return source;
  if (isObservableValue(source)) return toJSHelper(source.get(), options, __alreadySeen); // make sure we track the keys of the object

  if (isObservable(source)) keys(source);
  var detectCycles = options.detectCycles === true;

  if (detectCycles && source !== null && __alreadySeen.has(source)) {
    return __alreadySeen.get(source);
  }

  if (isObservableArray(source) || Array.isArray(source)) {
    var res_1 = cache(__alreadySeen, source, [], options);
    var toAdd = source.map(function (value) {
      return toJSHelper(value, options, __alreadySeen);
    });
    res_1.length = toAdd.length;

    for (var i = 0, l = toAdd.length; i < l; i++) res_1[i] = toAdd[i];

    return res_1;
  }

  if (isObservableSet(source) || Object.getPrototypeOf(source) === Set.prototype) {
    if (options.exportMapsAsObjects === false) {
      var res_2 = cache(__alreadySeen, source, new Set(), options);
      source.forEach(function (value) {
        res_2.add(toJSHelper(value, options, __alreadySeen));
      });
      return res_2;
    } else {
      var res_3 = cache(__alreadySeen, source, [], options);
      source.forEach(function (value) {
        res_3.push(toJSHelper(value, options, __alreadySeen));
      });
      return res_3;
    }
  }

  if (isObservableMap(source) || Object.getPrototypeOf(source) === Map.prototype) {
    if (options.exportMapsAsObjects === false) {
      var res_4 = cache(__alreadySeen, source, new Map(), options);
      source.forEach(function (value, key) {
        res_4.set(key, toJSHelper(value, options, __alreadySeen));
      });
      return res_4;
    } else {
      var res_5 = cache(__alreadySeen, source, {}, options);
      source.forEach(function (value, key) {
        res_5[key] = toJSHelper(value, options, __alreadySeen);
      });
      return res_5;
    }
  } // Fallback to the situation that source is an ObservableObject or a plain object


  var res = cache(__alreadySeen, source, {}, options);
  getPlainObjectKeys(source).forEach(function (key) {
    res[key] = toJSHelper(source[key], options, __alreadySeen);
  });
  return res;
}

function toJS(source, options) {
  // backward compatibility
  if (typeof options === "boolean") options = {
    detectCycles: options
  };
  if (!options) options = defaultOptions;
  options.detectCycles = options.detectCycles === undefined ? options.recurseEverything === true : options.detectCycles === true;

  var __alreadySeen;

  if (options.detectCycles) __alreadySeen = new Map();
  return toJSHelper(source, options, __alreadySeen);
}

function trace() {
  var args = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }

  var enterBreakPoint = false;
  if (typeof args[args.length - 1] === "boolean") enterBreakPoint = args.pop();
  var derivation = getAtomFromArgs(args);

  if (!derivation) {
    return fail("development" !== "production" && "'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
  }

  if (derivation.isTracing === TraceMode.NONE) {
    console.log("[mobx.trace] '" + derivation.name + "' tracing enabled");
  }

  derivation.isTracing = enterBreakPoint ? TraceMode.BREAK : TraceMode.LOG;
}

function getAtomFromArgs(args) {
  switch (args.length) {
    case 0:
      return globalState.trackingDerivation;

    case 1:
      return getAtom(args[0]);

    case 2:
      return getAtom(args[0], args[1]);
  }
}
/**
 * During a transaction no views are updated until the end of the transaction.
 * The transaction will be run synchronously nonetheless.
 *
 * @param action a function that updates some reactive state
 * @returns any value that was returned by the 'action' parameter.
 */


function transaction(action, thisArg) {
  if (thisArg === void 0) {
    thisArg = undefined;
  }

  startBatch();

  try {
    return action.apply(thisArg);
  } finally {
    endBatch();
  }
}

function when(predicate, arg1, arg2) {
  if (arguments.length === 1 || arg1 && typeof arg1 === "object") return whenPromise(predicate, arg1);
  return _when(predicate, arg1, arg2 || {});
}

function _when(predicate, effect, opts) {
  var timeoutHandle;

  if (typeof opts.timeout === "number") {
    timeoutHandle = setTimeout(function () {
      if (!disposer[$mobx].isDisposed) {
        disposer();
        var error = new Error("WHEN_TIMEOUT");
        if (opts.onError) opts.onError(error);else throw error;
      }
    }, opts.timeout);
  }

  opts.name = opts.name || "When@" + getNextId();
  var effectAction = createAction(opts.name + "-effect", effect);
  var disposer = autorun(function (r) {
    if (predicate()) {
      r.dispose();
      if (timeoutHandle) clearTimeout(timeoutHandle);
      effectAction();
    }
  }, opts);
  return disposer;
}

function whenPromise(predicate, opts) {
  if ("development" !== "production" && opts && opts.onError) return fail("the options 'onError' and 'promise' cannot be combined");
  var cancel;
  var res = new Promise(function (resolve, reject) {
    var disposer = _when(predicate, resolve, __assign(__assign({}, opts), {
      onError: reject
    }));

    cancel = function () {
      disposer();
      reject("WHEN_CANCELLED");
    };
  });
  res.cancel = cancel;
  return res;
}

function getAdm(target) {
  return target[$mobx];
}

function isPropertyKey(val) {
  return typeof val === "string" || typeof val === "number" || typeof val === "symbol";
} // Optimization: we don't need the intermediate objects and could have a completely custom administration for DynamicObjects,
// and skip either the internal values map, or the base object with its property descriptors!


var objectProxyTraps = {
  has: function (target, name) {
    if (name === $mobx || name === "constructor" || name === mobxDidRunLazyInitializersSymbol) return true;
    var adm = getAdm(target); // MWE: should `in` operator be reactive? If not, below code path will be faster / more memory efficient
    // TODO: check performance stats!
    // if (adm.values.get(name as string)) return true

    if (isPropertyKey(name)) return adm.has(name);
    return name in target;
  },
  get: function (target, name) {
    if (name === $mobx || name === "constructor" || name === mobxDidRunLazyInitializersSymbol) return target[name];
    var adm = getAdm(target);
    var observable = adm.values.get(name);

    if (observable instanceof Atom) {
      var result = observable.get();

      if (result === undefined) {
        // This fixes #1796, because deleting a prop that has an
        // undefined value won't retrigger a observer (no visible effect),
        // the autorun wouldn't subscribe to future key changes (see also next comment)
        adm.has(name);
      }

      return result;
    } // make sure we start listening to future keys
    // note that we only do this here for optimization


    if (isPropertyKey(name)) adm.has(name);
    return target[name];
  },
  set: function (target, name, value) {
    if (!isPropertyKey(name)) return false;
    set(target, name, value);
    return true;
  },
  deleteProperty: function (target, name) {
    if (!isPropertyKey(name)) return false;
    var adm = getAdm(target);
    adm.remove(name);
    return true;
  },
  ownKeys: function (target) {
    var adm = getAdm(target);
    adm.keysAtom.reportObserved();
    return Reflect.ownKeys(target);
  },
  preventExtensions: function (target) {
    fail("Dynamic observable objects cannot be frozen");
    return false;
  }
};

function createDynamicObservableObject(base) {
  var proxy = new Proxy(base, objectProxyTraps);
  base[$mobx].proxy = proxy;
  return proxy;
}

function hasInterceptors(interceptable) {
  return interceptable.interceptors !== undefined && interceptable.interceptors.length > 0;
}

function registerInterceptor(interceptable, handler) {
  var interceptors = interceptable.interceptors || (interceptable.interceptors = []);
  interceptors.push(handler);
  return once(function () {
    var idx = interceptors.indexOf(handler);
    if (idx !== -1) interceptors.splice(idx, 1);
  });
}

function interceptChange(interceptable, change) {
  var prevU = untrackedStart();

  try {
    // Interceptor can modify the array, copy it to avoid concurrent modification, see #1950
    var interceptors = __spread(interceptable.interceptors || []);

    for (var i = 0, l = interceptors.length; i < l; i++) {
      change = interceptors[i](change);
      invariant(!change || change.type, "Intercept handlers should return nothing or a change object");
      if (!change) break;
    }

    return change;
  } finally {
    untrackedEnd(prevU);
  }
}

function hasListeners(listenable) {
  return listenable.changeListeners !== undefined && listenable.changeListeners.length > 0;
}

function registerListener(listenable, handler) {
  var listeners = listenable.changeListeners || (listenable.changeListeners = []);
  listeners.push(handler);
  return once(function () {
    var idx = listeners.indexOf(handler);
    if (idx !== -1) listeners.splice(idx, 1);
  });
}

function notifyListeners(listenable, change) {
  var prevU = untrackedStart();
  var listeners = listenable.changeListeners;
  if (!listeners) return;
  listeners = listeners.slice();

  for (var i = 0, l = listeners.length; i < l; i++) {
    listeners[i](change);
  }

  untrackedEnd(prevU);
}

var MAX_SPLICE_SIZE = 10000; // See e.g. https://github.com/mobxjs/mobx/issues/859

var arrayTraps = {
  get: function (target, name) {
    if (name === $mobx) return target[$mobx];
    if (name === "length") return target[$mobx].getArrayLength();

    if (typeof name === "number") {
      return arrayExtensions.get.call(target, name);
    }

    if (typeof name === "string" && !isNaN(name)) {
      return arrayExtensions.get.call(target, parseInt(name));
    }

    if (arrayExtensions.hasOwnProperty(name)) {
      return arrayExtensions[name];
    }

    return target[name];
  },
  set: function (target, name, value) {
    if (name === "length") {
      target[$mobx].setArrayLength(value);
    }

    if (typeof name === "number") {
      arrayExtensions.set.call(target, name, value);
    }

    if (typeof name === "symbol" || isNaN(name)) {
      target[name] = value;
    } else {
      // numeric string
      arrayExtensions.set.call(target, parseInt(name), value);
    }

    return true;
  },
  preventExtensions: function (target) {
    fail("Observable arrays cannot be frozen");
    return false;
  }
};

function createObservableArray(initialValues, enhancer, name, owned) {
  if (name === void 0) {
    name = "ObservableArray@" + getNextId();
  }

  if (owned === void 0) {
    owned = false;
  }

  var adm = new ObservableArrayAdministration(name, enhancer, owned);
  addHiddenFinalProp(adm.values, $mobx, adm);
  var proxy = new Proxy(adm.values, arrayTraps);
  adm.proxy = proxy;

  if (initialValues && initialValues.length) {
    var prev = allowStateChangesStart(true);
    adm.spliceWithArray(0, 0, initialValues);
    allowStateChangesEnd(prev);
  }

  return proxy;
}

var ObservableArrayAdministration =
/** @class */
function () {
  function ObservableArrayAdministration(name, enhancer, owned) {
    this.owned = owned;
    this.values = [];
    this.proxy = undefined;
    this.lastKnownLength = 0;
    this.atom = new Atom(name || "ObservableArray@" + getNextId());

    this.enhancer = function (newV, oldV) {
      return enhancer(newV, oldV, name + "[..]");
    };
  }

  ObservableArrayAdministration.prototype.dehanceValue = function (value) {
    if (this.dehancer !== undefined) return this.dehancer(value);
    return value;
  };

  ObservableArrayAdministration.prototype.dehanceValues = function (values) {
    if (this.dehancer !== undefined && values.length > 0) return values.map(this.dehancer);
    return values;
  };

  ObservableArrayAdministration.prototype.intercept = function (handler) {
    return registerInterceptor(this, handler);
  };

  ObservableArrayAdministration.prototype.observe = function (listener, fireImmediately) {
    if (fireImmediately === void 0) {
      fireImmediately = false;
    }

    if (fireImmediately) {
      listener({
        object: this.proxy,
        type: "splice",
        index: 0,
        added: this.values.slice(),
        addedCount: this.values.length,
        removed: [],
        removedCount: 0
      });
    }

    return registerListener(this, listener);
  };

  ObservableArrayAdministration.prototype.getArrayLength = function () {
    this.atom.reportObserved();
    return this.values.length;
  };

  ObservableArrayAdministration.prototype.setArrayLength = function (newLength) {
    if (typeof newLength !== "number" || newLength < 0) throw new Error("[mobx.array] Out of range: " + newLength);
    var currentLength = this.values.length;
    if (newLength === currentLength) return;else if (newLength > currentLength) {
      var newItems = new Array(newLength - currentLength);

      for (var i = 0; i < newLength - currentLength; i++) newItems[i] = undefined; // No Array.fill everywhere...


      this.spliceWithArray(currentLength, 0, newItems);
    } else this.spliceWithArray(newLength, currentLength - newLength);
  };

  ObservableArrayAdministration.prototype.updateArrayLength = function (oldLength, delta) {
    if (oldLength !== this.lastKnownLength) throw new Error("[mobx] Modification exception: the internal structure of an observable array was changed.");
    this.lastKnownLength += delta;
  };

  ObservableArrayAdministration.prototype.spliceWithArray = function (index, deleteCount, newItems) {
    var _this = this;

    checkIfStateModificationsAreAllowed(this.atom);
    var length = this.values.length;
    if (index === undefined) index = 0;else if (index > length) index = length;else if (index < 0) index = Math.max(0, length + index);
    if (arguments.length === 1) deleteCount = length - index;else if (deleteCount === undefined || deleteCount === null) deleteCount = 0;else deleteCount = Math.max(0, Math.min(deleteCount, length - index));
    if (newItems === undefined) newItems = EMPTY_ARRAY;

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this.proxy,
        type: "splice",
        index: index,
        removedCount: deleteCount,
        added: newItems
      });
      if (!change) return EMPTY_ARRAY;
      deleteCount = change.removedCount;
      newItems = change.added;
    }

    newItems = newItems.length === 0 ? newItems : newItems.map(function (v) {
      return _this.enhancer(v, undefined);
    });

    if ("development" !== "production") {
      var lengthDelta = newItems.length - deleteCount;
      this.updateArrayLength(length, lengthDelta); // checks if internal array wasn't modified
    }

    var res = this.spliceItemsIntoValues(index, deleteCount, newItems);
    if (deleteCount !== 0 || newItems.length !== 0) this.notifyArraySplice(index, newItems, res);
    return this.dehanceValues(res);
  };

  ObservableArrayAdministration.prototype.spliceItemsIntoValues = function (index, deleteCount, newItems) {
    var _a;

    if (newItems.length < MAX_SPLICE_SIZE) {
      return (_a = this.values).splice.apply(_a, __spread([index, deleteCount], newItems));
    } else {
      var res = this.values.slice(index, index + deleteCount);
      this.values = this.values.slice(0, index).concat(newItems, this.values.slice(index + deleteCount));
      return res;
    }
  };

  ObservableArrayAdministration.prototype.notifyArrayChildUpdate = function (index, newValue, oldValue) {
    var notifySpy = !this.owned && isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      object: this.proxy,
      type: "update",
      index: index,
      newValue: newValue,
      oldValue: oldValue
    } : null; // The reason why this is on right hand side here (and not above), is this way the uglifier will drop it, but it won't
    // cause any runtime overhead in development mode without NODE_ENV set, unless spying is enabled

    if (notifySpy && "development" !== "production") spyReportStart(__assign(__assign({}, change), {
      name: this.atom.name
    }));
    this.atom.reportChanged();
    if (notify) notifyListeners(this, change);
    if (notifySpy && "development" !== "production") spyReportEnd();
  };

  ObservableArrayAdministration.prototype.notifyArraySplice = function (index, added, removed) {
    var notifySpy = !this.owned && isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      object: this.proxy,
      type: "splice",
      index: index,
      removed: removed,
      added: added,
      removedCount: removed.length,
      addedCount: added.length
    } : null;
    if (notifySpy && "development" !== "production") spyReportStart(__assign(__assign({}, change), {
      name: this.atom.name
    }));
    this.atom.reportChanged(); // conform: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe

    if (notify) notifyListeners(this, change);
    if (notifySpy && "development" !== "production") spyReportEnd();
  };

  return ObservableArrayAdministration;
}();

var arrayExtensions = {
  intercept: function (handler) {
    return this[$mobx].intercept(handler);
  },
  observe: function (listener, fireImmediately) {
    if (fireImmediately === void 0) {
      fireImmediately = false;
    }

    var adm = this[$mobx];
    return adm.observe(listener, fireImmediately);
  },
  clear: function () {
    return this.splice(0);
  },
  replace: function (newItems) {
    var adm = this[$mobx];
    return adm.spliceWithArray(0, adm.values.length, newItems);
  },

  /**
   * Converts this array back to a (shallow) javascript structure.
   * For a deep clone use mobx.toJS
   */
  toJS: function () {
    return this.slice();
  },
  toJSON: function () {
    // Used by JSON.stringify
    return this.toJS();
  },

  /*
   * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
   * since these functions alter the inner structure of the array, the have side effects.
   * Because the have side effects, they should not be used in computed function,
   * and for that reason the do not call dependencyState.notifyObserved
   */
  splice: function (index, deleteCount) {
    var newItems = [];

    for (var _i = 2; _i < arguments.length; _i++) {
      newItems[_i - 2] = arguments[_i];
    }

    var adm = this[$mobx];

    switch (arguments.length) {
      case 0:
        return [];

      case 1:
        return adm.spliceWithArray(index);

      case 2:
        return adm.spliceWithArray(index, deleteCount);
    }

    return adm.spliceWithArray(index, deleteCount, newItems);
  },
  spliceWithArray: function (index, deleteCount, newItems) {
    var adm = this[$mobx];
    return adm.spliceWithArray(index, deleteCount, newItems);
  },
  push: function () {
    var items = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      items[_i] = arguments[_i];
    }

    var adm = this[$mobx];
    adm.spliceWithArray(adm.values.length, 0, items);
    return adm.values.length;
  },
  pop: function () {
    return this.splice(Math.max(this[$mobx].values.length - 1, 0), 1)[0];
  },
  shift: function () {
    return this.splice(0, 1)[0];
  },
  unshift: function () {
    var items = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      items[_i] = arguments[_i];
    }

    var adm = this[$mobx];
    adm.spliceWithArray(0, 0, items);
    return adm.values.length;
  },
  reverse: function () {
    // reverse by default mutates in place before returning the result
    // which makes it both a 'derivation' and a 'mutation'.
    // so we deviate from the default and just make it an dervitation
    if ("development" !== "production") {
      console.warn("[mobx] `observableArray.reverse()` will not update the array in place. Use `observableArray.slice().reverse()` to suppress this warning and perform the operation on a copy, or `observableArray.replace(observableArray.slice().reverse())` to reverse & update in place");
    }

    var clone = this.slice();
    return clone.reverse.apply(clone, arguments);
  },
  sort: function (compareFn) {
    // sort by default mutates in place before returning the result
    // which goes against all good practices. Let's not change the array in place!
    if ("development" !== "production") {
      console.warn("[mobx] `observableArray.sort()` will not update the array in place. Use `observableArray.slice().sort()` to suppress this warning and perform the operation on a copy, or `observableArray.replace(observableArray.slice().sort())` to sort & update in place");
    }

    var clone = this.slice();
    return clone.sort.apply(clone, arguments);
  },
  remove: function (value) {
    var adm = this[$mobx];
    var idx = adm.dehanceValues(adm.values).indexOf(value);

    if (idx > -1) {
      this.splice(idx, 1);
      return true;
    }

    return false;
  },
  get: function (index) {
    var adm = this[$mobx];

    if (adm) {
      if (index < adm.values.length) {
        adm.atom.reportObserved();
        return adm.dehanceValue(adm.values[index]);
      }

      console.warn("[mobx.array] Attempt to read an array index (" + index + ") that is out of bounds (" + adm.values.length + "). Please check length first. Out of bound indices will not be tracked by MobX");
    }

    return undefined;
  },
  set: function (index, newValue) {
    var adm = this[$mobx];
    var values = adm.values;

    if (index < values.length) {
      // update at index in range
      checkIfStateModificationsAreAllowed(adm.atom);
      var oldValue = values[index];

      if (hasInterceptors(adm)) {
        var change = interceptChange(adm, {
          type: "update",
          object: adm.proxy,
          index: index,
          newValue: newValue
        });
        if (!change) return;
        newValue = change.newValue;
      }

      newValue = adm.enhancer(newValue, oldValue);
      var changed = newValue !== oldValue;

      if (changed) {
        values[index] = newValue;
        adm.notifyArrayChildUpdate(index, newValue, oldValue);
      }
    } else if (index === values.length) {
      // add a new item
      adm.spliceWithArray(index, 0, [newValue]);
    } else {
      // out of bounds
      throw new Error("[mobx.array] Index out of bounds, " + index + " is larger than " + values.length);
    }
  }
};
["concat", "every", "filter", "forEach", "indexOf", "join", "lastIndexOf", "map", "reduce", "reduceRight", "slice", "some", "toString", "toLocaleString"].forEach(function (funcName) {
  arrayExtensions[funcName] = function () {
    var adm = this[$mobx];
    adm.atom.reportObserved();
    var res = adm.dehanceValues(adm.values);
    return res[funcName].apply(res, arguments);
  };
});
var isObservableArrayAdministration = createInstanceofPredicate("ObservableArrayAdministration", ObservableArrayAdministration);

function isObservableArray(thing) {
  return isObject(thing) && isObservableArrayAdministration(thing[$mobx]);
}

var _a;

var ObservableMapMarker = {}; // just extend Map? See also https://gist.github.com/nestharus/13b4d74f2ef4a2f4357dbd3fc23c1e54
// But: https://github.com/mobxjs/mobx/issues/1556

var ObservableMap =
/** @class */
function () {
  function ObservableMap(initialData, enhancer, name) {
    if (enhancer === void 0) {
      enhancer = deepEnhancer;
    }

    if (name === void 0) {
      name = "ObservableMap@" + getNextId();
    }

    this.enhancer = enhancer;
    this.name = name;
    this[_a] = ObservableMapMarker;
    this._keysAtom = createAtom(this.name + ".keys()");
    this[Symbol.toStringTag] = "Map";

    if (typeof Map !== "function") {
      throw new Error("mobx.map requires Map polyfill for the current browser. Check babel-polyfill or core-js/es6/map.js");
    }

    this._data = new Map();
    this._hasMap = new Map();
    this.merge(initialData);
  }

  ObservableMap.prototype._has = function (key) {
    return this._data.has(key);
  };

  ObservableMap.prototype.has = function (key) {
    var _this = this;

    if (!globalState.trackingDerivation) return this._has(key);

    var entry = this._hasMap.get(key);

    if (!entry) {
      // todo: replace with atom (breaking change)
      var newEntry = entry = new ObservableValue(this._has(key), referenceEnhancer, this.name + "." + stringifyKey(key) + "?", false);

      this._hasMap.set(key, newEntry);

      onBecomeUnobserved(newEntry, function () {
        return _this._hasMap.delete(key);
      });
    }

    return entry.get();
  };

  ObservableMap.prototype.set = function (key, value) {
    var hasKey = this._has(key);

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: hasKey ? "update" : "add",
        object: this,
        newValue: value,
        name: key
      });
      if (!change) return this;
      value = change.newValue;
    }

    if (hasKey) {
      this._updateValue(key, value);
    } else {
      this._addValue(key, value);
    }

    return this;
  };

  ObservableMap.prototype.delete = function (key) {
    var _this = this;

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: "delete",
        object: this,
        name: key
      });
      if (!change) return false;
    }

    if (this._has(key)) {
      var notifySpy = isSpyEnabled();
      var notify = hasListeners(this);
      var change = notify || notifySpy ? {
        type: "delete",
        object: this,
        oldValue: this._data.get(key).value,
        name: key
      } : null;
      if (notifySpy && "development" !== "production") spyReportStart(__assign(__assign({}, change), {
        name: this.name,
        key: key
      }));
      transaction(function () {
        _this._keysAtom.reportChanged();

        _this._updateHasMapEntry(key, false);

        var observable = _this._data.get(key);

        observable.setNewValue(undefined);

        _this._data.delete(key);
      });
      if (notify) notifyListeners(this, change);
      if (notifySpy && "development" !== "production") spyReportEnd();
      return true;
    }

    return false;
  };

  ObservableMap.prototype._updateHasMapEntry = function (key, value) {
    var entry = this._hasMap.get(key);

    if (entry) {
      entry.setNewValue(value);
    }
  };

  ObservableMap.prototype._updateValue = function (key, newValue) {
    var observable = this._data.get(key);

    newValue = observable.prepareNewValue(newValue);

    if (newValue !== globalState.UNCHANGED) {
      var notifySpy = isSpyEnabled();
      var notify = hasListeners(this);
      var change = notify || notifySpy ? {
        type: "update",
        object: this,
        oldValue: observable.value,
        name: key,
        newValue: newValue
      } : null;
      if (notifySpy && "development" !== "production") spyReportStart(__assign(__assign({}, change), {
        name: this.name,
        key: key
      }));
      observable.setNewValue(newValue);
      if (notify) notifyListeners(this, change);
      if (notifySpy && "development" !== "production") spyReportEnd();
    }
  };

  ObservableMap.prototype._addValue = function (key, newValue) {
    var _this = this;

    checkIfStateModificationsAreAllowed(this._keysAtom);
    transaction(function () {
      var observable = new ObservableValue(newValue, _this.enhancer, _this.name + "." + stringifyKey(key), false);

      _this._data.set(key, observable);

      newValue = observable.value; // value might have been changed

      _this._updateHasMapEntry(key, true);

      _this._keysAtom.reportChanged();
    });
    var notifySpy = isSpyEnabled();
    var notify = hasListeners(this);
    var change = notify || notifySpy ? {
      type: "add",
      object: this,
      name: key,
      newValue: newValue
    } : null;
    if (notifySpy && "development" !== "production") spyReportStart(__assign(__assign({}, change), {
      name: this.name,
      key: key
    }));
    if (notify) notifyListeners(this, change);
    if (notifySpy && "development" !== "production") spyReportEnd();
  };

  ObservableMap.prototype.get = function (key) {
    if (this.has(key)) return this.dehanceValue(this._data.get(key).get());
    return this.dehanceValue(undefined);
  };

  ObservableMap.prototype.dehanceValue = function (value) {
    if (this.dehancer !== undefined) {
      return this.dehancer(value);
    }

    return value;
  };

  ObservableMap.prototype.keys = function () {
    this._keysAtom.reportObserved();

    return this._data.keys();
  };

  ObservableMap.prototype.values = function () {
    var self = this;
    var nextIndex = 0;
    var keys = Array.from(this.keys());
    return makeIterable({
      next: function () {
        return nextIndex < keys.length ? {
          value: self.get(keys[nextIndex++]),
          done: false
        } : {
          done: true
        };
      }
    });
  };

  ObservableMap.prototype.entries = function () {
    var self = this;
    var nextIndex = 0;
    var keys = Array.from(this.keys());
    return makeIterable({
      next: function () {
        if (nextIndex < keys.length) {
          var key = keys[nextIndex++];
          return {
            value: [key, self.get(key)],
            done: false
          };
        }

        return {
          done: true
        };
      }
    });
  };

  ObservableMap.prototype[(_a = $mobx, Symbol.iterator)] = function () {
    return this.entries();
  };

  ObservableMap.prototype.forEach = function (callback, thisArg) {
    var e_1, _b;

    try {
      for (var _c = __values(this), _d = _c.next(); !_d.done; _d = _c.next()) {
        var _e = __read(_d.value, 2),
            key = _e[0],
            value = _e[1];

        callback.call(thisArg, value, key, this);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  };
  /** Merge another object into this object, returns this. */


  ObservableMap.prototype.merge = function (other) {
    var _this = this;

    if (isObservableMap(other)) {
      other = other.toJS();
    }

    transaction(function () {
      if (isPlainObject(other)) getPlainObjectKeys(other).forEach(function (key) {
        return _this.set(key, other[key]);
      });else if (Array.isArray(other)) other.forEach(function (_b) {
        var _c = __read(_b, 2),
            key = _c[0],
            value = _c[1];

        return _this.set(key, value);
      });else if (isES6Map(other)) {
        if (other.constructor !== Map) fail("Cannot initialize from classes that inherit from Map: " + other.constructor.name); // prettier-ignore

        other.forEach(function (value, key) {
          return _this.set(key, value);
        });
      } else if (other !== null && other !== undefined) fail("Cannot initialize map from " + other);
    });
    return this;
  };

  ObservableMap.prototype.clear = function () {
    var _this = this;

    transaction(function () {
      untracked(function () {
        var e_2, _b;

        try {
          for (var _c = __values(_this.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var key = _d.value;

            _this.delete(key);
          }
        } catch (e_2_1) {
          e_2 = {
            error: e_2_1
          };
        } finally {
          try {
            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
      });
    });
  };

  ObservableMap.prototype.replace = function (values) {
    var _this = this;

    transaction(function () {
      // grab all the keys that are present in the new map but not present in the current map
      // and delete them from the map, then merge the new map
      // this will cause reactions only on changed values
      var newKeys = getMapLikeKeys(values);
      var oldKeys = Array.from(_this.keys());
      var missingKeys = oldKeys.filter(function (k) {
        return newKeys.indexOf(k) === -1;
      });
      missingKeys.forEach(function (k) {
        return _this.delete(k);
      });

      _this.merge(values);
    });
    return this;
  };

  Object.defineProperty(ObservableMap.prototype, "size", {
    get: function () {
      this._keysAtom.reportObserved();

      return this._data.size;
    },
    enumerable: true,
    configurable: true
  });
  /**
   * Returns a plain object that represents this map.
   * Note that all the keys being stringified.
   * If there are duplicating keys after converting them to strings, behaviour is undetermined.
   */

  ObservableMap.prototype.toPOJO = function () {
    var e_3, _b;

    var res = {};

    try {
      for (var _c = __values(this), _d = _c.next(); !_d.done; _d = _c.next()) {
        var _e = __read(_d.value, 2),
            key = _e[0],
            value = _e[1]; // We lie about symbol key types due to https://github.com/Microsoft/TypeScript/issues/1863


        res[typeof key === "symbol" ? key : stringifyKey(key)] = value;
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
      } finally {
        if (e_3) throw e_3.error;
      }
    }

    return res;
  };
  /**
   * Returns a shallow non observable object clone of this map.
   * Note that the values migth still be observable. For a deep clone use mobx.toJS.
   */


  ObservableMap.prototype.toJS = function () {
    return new Map(this);
  };

  ObservableMap.prototype.toJSON = function () {
    // Used by JSON.stringify
    return this.toPOJO();
  };

  ObservableMap.prototype.toString = function () {
    var _this = this;

    return this.name + "[{ " + Array.from(this.keys()).map(function (key) {
      return stringifyKey(key) + ": " + ("" + _this.get(key));
    }).join(", ") + " }]";
  };
  /**
   * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
   * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
   * for callback details
   */


  ObservableMap.prototype.observe = function (listener, fireImmediately) {
    "development" !== "production" && invariant(fireImmediately !== true, "`observe` doesn't support fireImmediately=true in combination with maps.");
    return registerListener(this, listener);
  };

  ObservableMap.prototype.intercept = function (handler) {
    return registerInterceptor(this, handler);
  };

  return ObservableMap;
}();
/* 'var' fixes small-build issue */


exports.ObservableMap = ObservableMap;
var isObservableMap = createInstanceofPredicate("ObservableMap", ObservableMap);
exports.isObservableMap = isObservableMap;

var _a$1;

var ObservableSetMarker = {};

var ObservableSet =
/** @class */
function () {
  function ObservableSet(initialData, enhancer, name) {
    if (enhancer === void 0) {
      enhancer = deepEnhancer;
    }

    if (name === void 0) {
      name = "ObservableSet@" + getNextId();
    }

    this.name = name;
    this[_a$1] = ObservableSetMarker;
    this._data = new Set();
    this._atom = createAtom(this.name);
    this[Symbol.toStringTag] = "Set";

    if (typeof Set !== "function") {
      throw new Error("mobx.set requires Set polyfill for the current browser. Check babel-polyfill or core-js/es6/set.js");
    }

    this.enhancer = function (newV, oldV) {
      return enhancer(newV, oldV, name);
    };

    if (initialData) {
      this.replace(initialData);
    }
  }

  ObservableSet.prototype.dehanceValue = function (value) {
    if (this.dehancer !== undefined) {
      return this.dehancer(value);
    }

    return value;
  };

  ObservableSet.prototype.clear = function () {
    var _this = this;

    transaction(function () {
      untracked(function () {
        var e_1, _b;

        try {
          for (var _c = __values(_this._data.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var value = _d.value;

            _this.delete(value);
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      });
    });
  };

  ObservableSet.prototype.forEach = function (callbackFn, thisArg) {
    var e_2, _b;

    try {
      for (var _c = __values(this), _d = _c.next(); !_d.done; _d = _c.next()) {
        var value = _d.value;
        callbackFn.call(thisArg, value, value, this);
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
  };

  Object.defineProperty(ObservableSet.prototype, "size", {
    get: function () {
      this._atom.reportObserved();

      return this._data.size;
    },
    enumerable: true,
    configurable: true
  });

  ObservableSet.prototype.add = function (value) {
    var _this = this;

    checkIfStateModificationsAreAllowed(this._atom);

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: "add",
        object: this,
        newValue: value
      });
      if (!change) return this; // TODO: ideally, value = change.value would be done here, so that values can be
      // changed by interceptor. Same applies for other Set and Map api's.
    }

    if (!this.has(value)) {
      transaction(function () {
        _this._data.add(_this.enhancer(value, undefined));

        _this._atom.reportChanged();
      });
      var notifySpy = isSpyEnabled();
      var notify = hasListeners(this);
      var change = notify || notifySpy ? {
        type: "add",
        object: this,
        newValue: value
      } : null;
      if (notifySpy && "development" !== "production") spyReportStart(change);
      if (notify) notifyListeners(this, change);
      if (notifySpy && "development" !== "production") spyReportEnd();
    }

    return this;
  };

  ObservableSet.prototype.delete = function (value) {
    var _this = this;

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: "delete",
        object: this,
        oldValue: value
      });
      if (!change) return false;
    }

    if (this.has(value)) {
      var notifySpy = isSpyEnabled();
      var notify = hasListeners(this);
      var change = notify || notifySpy ? {
        type: "delete",
        object: this,
        oldValue: value
      } : null;
      if (notifySpy && "development" !== "production") spyReportStart(__assign(__assign({}, change), {
        name: this.name
      }));
      transaction(function () {
        _this._atom.reportChanged();

        _this._data.delete(value);
      });
      if (notify) notifyListeners(this, change);
      if (notifySpy && "development" !== "production") spyReportEnd();
      return true;
    }

    return false;
  };

  ObservableSet.prototype.has = function (value) {
    this._atom.reportObserved();

    return this._data.has(this.dehanceValue(value));
  };

  ObservableSet.prototype.entries = function () {
    var nextIndex = 0;
    var keys = Array.from(this.keys());
    var values = Array.from(this.values());
    return makeIterable({
      next: function () {
        var index = nextIndex;
        nextIndex += 1;
        return index < values.length ? {
          value: [keys[index], values[index]],
          done: false
        } : {
          done: true
        };
      }
    });
  };

  ObservableSet.prototype.keys = function () {
    return this.values();
  };

  ObservableSet.prototype.values = function () {
    this._atom.reportObserved();

    var self = this;
    var nextIndex = 0;
    var observableValues = Array.from(this._data.values());
    return makeIterable({
      next: function () {
        return nextIndex < observableValues.length ? {
          value: self.dehanceValue(observableValues[nextIndex++]),
          done: false
        } : {
          done: true
        };
      }
    });
  };

  ObservableSet.prototype.replace = function (other) {
    var _this = this;

    if (isObservableSet(other)) {
      other = other.toJS();
    }

    transaction(function () {
      if (Array.isArray(other)) {
        _this.clear();

        other.forEach(function (value) {
          return _this.add(value);
        });
      } else if (isES6Set(other)) {
        _this.clear();

        other.forEach(function (value) {
          return _this.add(value);
        });
      } else if (other !== null && other !== undefined) {
        fail("Cannot initialize set from " + other);
      }
    });
    return this;
  };

  ObservableSet.prototype.observe = function (listener, fireImmediately) {
    // TODO 'fireImmediately' can be true?
    "development" !== "production" && invariant(fireImmediately !== true, "`observe` doesn't support fireImmediately=true in combination with sets.");
    return registerListener(this, listener);
  };

  ObservableSet.prototype.intercept = function (handler) {
    return registerInterceptor(this, handler);
  };

  ObservableSet.prototype.toJS = function () {
    return new Set(this);
  };

  ObservableSet.prototype.toString = function () {
    return this.name + "[ " + Array.from(this).join(", ") + " ]";
  };

  ObservableSet.prototype[(_a$1 = $mobx, Symbol.iterator)] = function () {
    return this.values();
  };

  return ObservableSet;
}();

exports.ObservableSet = ObservableSet;
var isObservableSet = createInstanceofPredicate("ObservableSet", ObservableSet);
exports.isObservableSet = isObservableSet;

var ObservableObjectAdministration =
/** @class */
function () {
  function ObservableObjectAdministration(target, values, name, defaultEnhancer) {
    if (values === void 0) {
      values = new Map();
    }

    this.target = target;
    this.values = values;
    this.name = name;
    this.defaultEnhancer = defaultEnhancer;
    this.keysAtom = new Atom(name + ".keys");
  }

  ObservableObjectAdministration.prototype.read = function (key) {
    return this.values.get(key).get();
  };

  ObservableObjectAdministration.prototype.write = function (key, newValue) {
    var instance = this.target;
    var observable = this.values.get(key);

    if (observable instanceof ComputedValue) {
      observable.set(newValue);
      return;
    } // intercept


    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        type: "update",
        object: this.proxy || instance,
        name: key,
        newValue: newValue
      });
      if (!change) return;
      newValue = change.newValue;
    }

    newValue = observable.prepareNewValue(newValue); // notify spy & observers

    if (newValue !== globalState.UNCHANGED) {
      var notify = hasListeners(this);
      var notifySpy = isSpyEnabled();
      var change = notify || notifySpy ? {
        type: "update",
        object: this.proxy || instance,
        oldValue: observable.value,
        name: key,
        newValue: newValue
      } : null;
      if (notifySpy && "development" !== "production") spyReportStart(__assign(__assign({}, change), {
        name: this.name,
        key: key
      }));
      observable.setNewValue(newValue);
      if (notify) notifyListeners(this, change);
      if (notifySpy && "development" !== "production") spyReportEnd();
    }
  };

  ObservableObjectAdministration.prototype.has = function (key) {
    var map = this.pendingKeys || (this.pendingKeys = new Map());
    var entry = map.get(key);
    if (entry) return entry.get();else {
      var exists = !!this.values.get(key); // Possible optimization: Don't have a separate map for non existing keys,
      // but store them in the values map instead, using a special symbol to denote "not existing"

      entry = new ObservableValue(exists, referenceEnhancer, this.name + "." + stringifyKey(key) + "?", false);
      map.set(key, entry);
      return entry.get(); // read to subscribe
    }
  };

  ObservableObjectAdministration.prototype.addObservableProp = function (propName, newValue, enhancer) {
    if (enhancer === void 0) {
      enhancer = this.defaultEnhancer;
    }

    var target = this.target;
    assertPropertyConfigurable(target, propName);

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this.proxy || target,
        name: propName,
        type: "add",
        newValue: newValue
      });
      if (!change) return;
      newValue = change.newValue;
    }

    var observable = new ObservableValue(newValue, enhancer, this.name + "." + stringifyKey(propName), false);
    this.values.set(propName, observable);
    newValue = observable.value; // observableValue might have changed it

    Object.defineProperty(target, propName, generateObservablePropConfig(propName));
    this.notifyPropertyAddition(propName, newValue);
  };

  ObservableObjectAdministration.prototype.addComputedProp = function (propertyOwner, // where is the property declared?
  propName, options) {
    var target = this.target;
    options.name = options.name || this.name + "." + stringifyKey(propName);
    this.values.set(propName, new ComputedValue(options));
    if (propertyOwner === target || isPropertyConfigurable(propertyOwner, propName)) Object.defineProperty(propertyOwner, propName, generateComputedPropConfig(propName));
  };

  ObservableObjectAdministration.prototype.remove = function (key) {
    if (!this.values.has(key)) return;
    var target = this.target;

    if (hasInterceptors(this)) {
      var change = interceptChange(this, {
        object: this.proxy || target,
        name: key,
        type: "remove"
      });
      if (!change) return;
    }

    try {
      startBatch();
      var notify = hasListeners(this);
      var notifySpy = isSpyEnabled();
      var oldObservable = this.values.get(key);
      var oldValue = oldObservable && oldObservable.get();
      oldObservable && oldObservable.set(undefined); // notify key and keyset listeners

      this.keysAtom.reportChanged();
      this.values.delete(key);

      if (this.pendingKeys) {
        var entry = this.pendingKeys.get(key);
        if (entry) entry.set(false);
      } // delete the prop


      delete this.target[key];
      var change = notify || notifySpy ? {
        type: "remove",
        object: this.proxy || target,
        oldValue: oldValue,
        name: key
      } : null;
      if (notifySpy && "development" !== "production") spyReportStart(__assign(__assign({}, change), {
        name: this.name,
        key: key
      }));
      if (notify) notifyListeners(this, change);
      if (notifySpy && "development" !== "production") spyReportEnd();
    } finally {
      endBatch();
    }
  };

  ObservableObjectAdministration.prototype.illegalAccess = function (owner, propName) {
    /**
     * This happens if a property is accessed through the prototype chain, but the property was
     * declared directly as own property on the prototype.
     *
     * E.g.:
     * class A {
     * }
     * extendObservable(A.prototype, { x: 1 })
     *
     * classB extens A {
     * }
     * console.log(new B().x)
     *
     * It is unclear whether the property should be considered 'static' or inherited.
     * Either use `console.log(A.x)`
     * or: decorate(A, { x: observable })
     *
     * When using decorate, the property will always be redeclared as own property on the actual instance
     */
    console.warn("Property '" + propName + "' of '" + owner + "' was accessed through the prototype chain. Use 'decorate' instead to declare the prop or access it statically through it's owner");
  };
  /**
   * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
   * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
   * for callback details
   */


  ObservableObjectAdministration.prototype.observe = function (callback, fireImmediately) {
    "development" !== "production" && invariant(fireImmediately !== true, "`observe` doesn't support the fire immediately property for observable objects.");
    return registerListener(this, callback);
  };

  ObservableObjectAdministration.prototype.intercept = function (handler) {
    return registerInterceptor(this, handler);
  };

  ObservableObjectAdministration.prototype.notifyPropertyAddition = function (key, newValue) {
    var notify = hasListeners(this);
    var notifySpy = isSpyEnabled();
    var change = notify || notifySpy ? {
      type: "add",
      object: this.proxy || this.target,
      name: key,
      newValue: newValue
    } : null;
    if (notifySpy && "development" !== "production") spyReportStart(__assign(__assign({}, change), {
      name: this.name,
      key: key
    }));
    if (notify) notifyListeners(this, change);
    if (notifySpy && "development" !== "production") spyReportEnd();

    if (this.pendingKeys) {
      var entry = this.pendingKeys.get(key);
      if (entry) entry.set(true);
    }

    this.keysAtom.reportChanged();
  };

  ObservableObjectAdministration.prototype.getKeys = function () {
    var e_1, _a;

    this.keysAtom.reportObserved(); // return Reflect.ownKeys(this.values) as any

    var res = [];

    try {
      for (var _b = __values(this.values), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read(_c.value, 2),
            key = _d[0],
            value = _d[1];

        if (value instanceof ObservableValue) res.push(key);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }

    return res;
  };

  return ObservableObjectAdministration;
}();

function asObservableObject(target, name, defaultEnhancer) {
  if (name === void 0) {
    name = "";
  }

  if (defaultEnhancer === void 0) {
    defaultEnhancer = deepEnhancer;
  }

  if (Object.prototype.hasOwnProperty.call(target, $mobx)) return target[$mobx];
  "development" !== "production" && invariant(Object.isExtensible(target), "Cannot make the designated object observable; it is not extensible");
  if (!isPlainObject(target)) name = (target.constructor.name || "ObservableObject") + "@" + getNextId();
  if (!name) name = "ObservableObject@" + getNextId();
  var adm = new ObservableObjectAdministration(target, new Map(), stringifyKey(name), defaultEnhancer);
  addHiddenProp(target, $mobx, adm);
  return adm;
}

var observablePropertyConfigs = Object.create(null);
var computedPropertyConfigs = Object.create(null);

function generateObservablePropConfig(propName) {
  return observablePropertyConfigs[propName] || (observablePropertyConfigs[propName] = {
    configurable: true,
    enumerable: true,
    get: function () {
      return this[$mobx].read(propName);
    },
    set: function (v) {
      this[$mobx].write(propName, v);
    }
  });
}

function getAdministrationForComputedPropOwner(owner) {
  var adm = owner[$mobx];

  if (!adm) {
    // because computed props are declared on proty,
    // the current instance might not have been initialized yet
    initializeInstance(owner);
    return owner[$mobx];
  }

  return adm;
}

function generateComputedPropConfig(propName) {
  return computedPropertyConfigs[propName] || (computedPropertyConfigs[propName] = {
    configurable: globalState.computedConfigurable,
    enumerable: false,
    get: function () {
      return getAdministrationForComputedPropOwner(this).read(propName);
    },
    set: function (v) {
      getAdministrationForComputedPropOwner(this).write(propName, v);
    }
  });
}

var isObservableObjectAdministration = createInstanceofPredicate("ObservableObjectAdministration", ObservableObjectAdministration);

function isObservableObject(thing) {
  if (isObject(thing)) {
    // Initializers run lazily when transpiling to babel, so make sure they are run...
    initializeInstance(thing);
    return isObservableObjectAdministration(thing[$mobx]);
  }

  return false;
}

function getAtom(thing, property) {
  if (typeof thing === "object" && thing !== null) {
    if (isObservableArray(thing)) {
      if (property !== undefined) fail("development" !== "production" && "It is not possible to get index atoms from arrays");
      return thing[$mobx].atom;
    }

    if (isObservableSet(thing)) {
      return thing[$mobx];
    }

    if (isObservableMap(thing)) {
      var anyThing = thing;
      if (property === undefined) return anyThing._keysAtom;

      var observable = anyThing._data.get(property) || anyThing._hasMap.get(property);

      if (!observable) fail("development" !== "production" && "the entry '" + property + "' does not exist in the observable map '" + getDebugName(thing) + "'");
      return observable;
    } // Initializers run lazily when transpiling to babel, so make sure they are run...


    initializeInstance(thing);
    if (property && !thing[$mobx]) thing[property]; // See #1072

    if (isObservableObject(thing)) {
      if (!property) return fail("development" !== "production" && "please specify a property");
      var observable = thing[$mobx].values.get(property);
      if (!observable) fail("development" !== "production" && "no observable property '" + property + "' found on the observable object '" + getDebugName(thing) + "'");
      return observable;
    }

    if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
      return thing;
    }
  } else if (typeof thing === "function") {
    if (isReaction(thing[$mobx])) {
      // disposer function
      return thing[$mobx];
    }
  }

  return fail("development" !== "production" && "Cannot obtain atom from " + thing);
}

function getAdministration(thing, property) {
  if (!thing) fail("Expecting some object");
  if (property !== undefined) return getAdministration(getAtom(thing, property));
  if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) return thing;
  if (isObservableMap(thing) || isObservableSet(thing)) return thing; // Initializers run lazily when transpiling to babel, so make sure they are run...

  initializeInstance(thing);
  if (thing[$mobx]) return thing[$mobx];
  fail("development" !== "production" && "Cannot obtain administration from " + thing);
}

function getDebugName(thing, property) {
  var named;
  if (property !== undefined) named = getAtom(thing, property);else if (isObservableObject(thing) || isObservableMap(thing) || isObservableSet(thing)) named = getAdministration(thing);else named = getAtom(thing); // valid for arrays as well

  return named.name;
}

var toString = Object.prototype.toString;

function deepEqual(a, b, depth) {
  if (depth === void 0) {
    depth = -1;
  }

  return eq(a, b, depth);
} // Copied from https://github.com/jashkenas/underscore/blob/5c237a7c682fb68fd5378203f0bf22dce1624854/underscore.js#L1186-L1289
// Internal recursive comparison function for `isEqual`.


function eq(a, b, depth, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) return a !== 0 || 1 / a === 1 / b; // `null` or `undefined` only equal to itself (strict comparison).

  if (a == null || b == null) return false; // `NaN`s are equivalent, but non-reflexive.

  if (a !== a) return b !== b; // Exhaust primitive checks

  var type = typeof a;
  if (type !== "function" && type !== "object" && typeof b != "object") return false; // Unwrap any wrapped objects.

  a = unwrap(a);
  b = unwrap(b); // Compare `[[Class]]` names.

  var className = toString.call(a);
  if (className !== toString.call(b)) return false;

  switch (className) {
    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case "[object RegExp]": // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')

    case "[object String]":
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return "" + a === "" + b;

    case "[object Number]":
      // `NaN`s are equivalent, but non-reflexive.
      // Object(NaN) is equivalent to NaN.
      if (+a !== +a) return +b !== +b; // An `egal` comparison is performed for other numeric values.

      return +a === 0 ? 1 / +a === 1 / b : +a === +b;

    case "[object Date]":
    case "[object Boolean]":
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a === +b;

    case "[object Symbol]":
      return typeof Symbol !== "undefined" && Symbol.valueOf.call(a) === Symbol.valueOf.call(b);
  }

  var areArrays = className === "[object Array]";

  if (!areArrays) {
    if (typeof a != "object" || typeof b != "object") return false; // Objects with different constructors are not equivalent, but `Object`s or `Array`s
    // from different frames are.

    var aCtor = a.constructor,
        bCtor = b.constructor;

    if (aCtor !== bCtor && !(typeof aCtor === "function" && aCtor instanceof aCtor && typeof bCtor === "function" && bCtor instanceof bCtor) && "constructor" in a && "constructor" in b) {
      return false;
    }
  }

  if (depth === 0) {
    return false;
  } else if (depth < 0) {
    depth = -1;
  } // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
  // Initializing stack of traversed objects.
  // It's done here since we only need them for objects and arrays comparison.


  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;

  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] === a) return bStack[length] === b;
  } // Add the first object to the stack of traversed objects.


  aStack.push(a);
  bStack.push(b); // Recursively compare objects and arrays.

  if (areArrays) {
    // Compare array lengths to determine if a deep comparison is necessary.
    length = a.length;
    if (length !== b.length) return false; // Deep compare the contents, ignoring non-numeric properties.

    while (length--) {
      if (!eq(a[length], b[length], depth - 1, aStack, bStack)) return false;
    }
  } else {
    // Deep compare objects.
    var keys = Object.keys(a);
    var key = void 0;
    length = keys.length; // Ensure that both objects contain the same number of properties before comparing deep equality.

    if (Object.keys(b).length !== length) return false;

    while (length--) {
      // Deep compare each member
      key = keys[length];
      if (!(has$1(b, key) && eq(a[key], b[key], depth - 1, aStack, bStack))) return false;
    }
  } // Remove the first object from the stack of traversed objects.


  aStack.pop();
  bStack.pop();
  return true;
}

function unwrap(a) {
  if (isObservableArray(a)) return a.slice();
  if (isES6Map(a) || isObservableMap(a)) return Array.from(a.entries());
  if (isES6Set(a) || isObservableSet(a)) return Array.from(a.entries());
  return a;
}

function has$1(a, key) {
  return Object.prototype.hasOwnProperty.call(a, key);
}

function makeIterable(iterator) {
  iterator[Symbol.iterator] = getSelf;
  return iterator;
}

function getSelf() {
  return this;
}
/*
The only reason for this file to exist is pure horror:
Without it rollup can make the bundling fail at any point in time; when it rolls up the files in the wrong order
it will cause undefined errors (for example because super classes or local variables not being hoisted).
With this file that will still happen,
but at least in this file we can magically reorder the imports with trial and error until the build succeeds again.
*/

/**
 * (c) Michel Weststrate 2015 - 2018
 * MIT Licensed
 *
 * Welcome to the mobx sources! To get an global overview of how MobX internally works,
 * this is a good place to start:
 * https://medium.com/@mweststrate/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254#.xvbh6qd74
 *
 * Source folders:
 * ===============
 *
 * - api/     Most of the public static methods exposed by the module can be found here.
 * - core/    Implementation of the MobX algorithm; atoms, derivations, reactions, dependency trees, optimizations. Cool stuff can be found here.
 * - types/   All the magic that is need to have observable objects, arrays and values is in this folder. Including the modifiers like `asFlat`.
 * - utils/   Utility stuff.
 *
 */


if (typeof Proxy === "undefined" || typeof Symbol === "undefined") {
  throw new Error("[mobx] MobX 5+ requires Proxy and Symbol objects. If your environment doesn't support Symbol or Proxy objects, please downgrade to MobX 4. For React Native Android, consider upgrading JSCore.");
}

try {
  // define process.env if needed
  // if this is not a production build in the first place
  // (in which case the expression below would be substituted with 'production')
  "development";
} catch (e) {
  var g = getGlobal();
  if (typeof process === "undefined") g.process = {};
  g.process.env = {};
}

(function () {
  function testCodeMinification() {}

  if (testCodeMinification.name !== "testCodeMinification" && "development" !== "production" && undefined !== "true") {
    // trick so it doesn't get replaced
    var varName = ["process", "env", "NODE_ENV"].join(".");
    console.warn("[mobx] you are running a minified build, but '" + varName + "' was not set to 'production' in your bundler. This results in an unnecessarily large and slow bundle");
  }
})();

if (typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === "object") {
  // See: https://github.com/andykog/mobx-devtools/
  __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
    spy: spy,
    extras: {
      getDebugName: getDebugName
    },
    $mobx: $mobx
  });
}
},{"process":"../node_modules/process/browser.js"}],"../node_modules/@ungap/weakmap/esm/index.js":[function(require,module,exports) {
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
},{"@ungap/template-literal":"../node_modules/@ungap/template-literal/esm/index.js"}],"../node_modules/domconstants/esm/index.js":[function(require,module,exports) {
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
  if (i === iLength) counter.iLength = stack.push({
    type,
    id: args[0],
    tag: null,
    wire: null
  });
  counter.i++;
  unrollArray(Tagger, info, args, counter);
  const entry = stack[i];
  if (i < iLength && entry.id === args[0] && entry.type === type) entry.tag.apply(null, args);else {
    entry.type = type;
    entry.id = args[0];
    entry.tag = new Tagger(type);
    entry.wire = wiredContent(entry.tag.apply(null, args));
  }
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
},{"@ungap/weakmap":"../node_modules/@ungap/weakmap/esm/index.js","@ungap/template-tag-arguments":"../node_modules/@ungap/template-tag-arguments/esm/index.js","domsanitizer":"../node_modules/domsanitizer/esm/index.js","./tagger.js":"../node_modules/lighterhtml/esm/tagger.js","./shared.js":"../node_modules/lighterhtml/esm/shared.js"}],"../node_modules/classnames/index.js":[function(require,module,exports) {
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

var _lighterhtml = require("lighterhtml");

var _mobx = require("mobx");

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var transReg = /\{\{([^{}]+)?\}\}/g;
var tagReg = /<[a-zA-Z_][^>]*>/; // maybe contain tag

var components = Object.create(null);

var IH =
/*#__PURE__*/
function () {
  function IH(str) {
    _classCallCheck(this, IH);

    this.html = str;
  }

  _createClass(IH, [{
    key: "toString",
    value: function toString() {
      return this.html;
    }
  }]);

  return IH;
}();

var _id = '';
var $id = '';
var DATAID = 'data-id';

var Runtime =
/*#__PURE__*/
function () {
  function Runtime() {
    _classCallCheck(this, Runtime);
  }

  _createClass(Runtime, [{
    key: "cn",
    value: function cn() {
      return _classnames.default.apply(void 0, arguments);
    }
  }, {
    key: "i",
    value: function i(val, index) {
      var forIndex = typeof index === 'number' ? '-' + index : '';

      if ($id) {
        var $$id = $id.slice(0, $id.lastIndexOf('-')); // handle for data-for

        if ($$id.endsWith(val)) {
          _id = $$id + forIndex;
        } else {
          _id = $id + '_' + val + forIndex;
        }
      } else {
        _id = val + forIndex;
      }

      return _id;
    }
  }, {
    key: "c",
    value: function c(originalProps, cid) {
      var _this = this;

      if (this._string) {
        return JSON.stringify(originalProps) + Object.keys(originalProps);
      }

      var vmid = _id;
      var props = {};
      var self = this;
      Object.freeze(originalProps);
      Object.keys(originalProps).forEach(function (key) {
        Object.defineProperty(props, key, {
          get: function get() {
            return self.vms[vmid].originalProps[key];
          },
          enumerable: true
        });
      });
      this.vms[vmid] = this.vms[vmid] || {};
      this.vms[vmid].cid = cid;
      this.vms[vmid].props = props;
      this.vms[vmid].originalProps = originalProps;
      var _components$cid = components[cid],
          view = _components$cid.view,
          state = _components$cid.state;

      if (!state) {
        $id = vmid;
        return view.call(this, props, null);
      } else if (!this._init) {
        // delay to render, because dom is not accessible right now.
        Promise.resolve(vmid).then(function (id) {
          return _this.update(id);
        });
      }
    }
  }, {
    key: "h",
    value: function h(strs) {
      for (var _len = arguments.length, vals = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        vals[_key - 1] = arguments[_key];
      }

      if (!this._string) {
        return _lighterhtml.html.apply(void 0, [strs].concat(vals));
      }

      return strs.map(function (v, i) {
        return v + (i < vals.length ? vals[i] : '');
      }).join('');
    }
  }, {
    key: "ih",
    value: function ih(innerhtml) {
      return new IH(innerhtml);
    }
  }]);

  return Runtime;
}();

var Context =
/*#__PURE__*/
function (_Runtime) {
  _inherits(Context, _Runtime);

  function Context() {
    var _this2;

    _classCallCheck(this, Context);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Context).call(this));
    _this2.vms = Object.create(null);
    return _this2;
  }

  _createClass(Context, [{
    key: "getState",
    value: function getState(vmid) {
      var _this$vms$vmid = this.vms[vmid],
          props = _this$vms$vmid.props,
          cid = _this$vms$vmid.cid;
      var createState = components[cid].state;
      var data = createState(props);
      Object.keys(data).forEach(function (key) {
        var property = Object.getOwnPropertyDescriptor(data, key);

        if (typeof property.get !== 'function' && typeof data[key] === 'function') {
          var method = data[key];

          if (key[0] !== '$') {
            data[key] = (0, _mobx.action)(function () {
              for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }

              return method.call.apply(method, [state].concat(args));
            });
          }
        }
      });
      var state = (0, _mobx.observable)(data);
      return state;
    }
  }, {
    key: "reactive",
    value: function reactive(vmid, data) {
      var _this3 = this;

      var _this$vms$vmid2 = this.vms[vmid],
          unreaction = _this$vms$vmid2.unreaction,
          cid = _this$vms$vmid2.cid;
      var view = components[cid].view;
      unreaction && unreaction();
      this.vms[vmid].data = data || this.getState(vmid);
      this.vms[vmid].unreaction = (0, _mobx.reaction)(function () {
        _this3._string = true;
        $id = vmid;
        var _this3$vms$vmid = _this3.vms[vmid],
            props = _this3$vms$vmid.props,
            data = _this3$vms$vmid.data;
        var a = view.call(_this3, props, data);
        _this3._string = false;
        return a;
      }, function () {
        _this3.update(vmid);
      }, {
        delay: 10
      });
      return this.vms[vmid].data;
    }
  }, {
    key: "update",
    value: function update(vmid) {
      var _this4 = this;

      var dom = document.querySelector("[".concat(DATAID, "=\"").concat(vmid, "\"]"));

      if (!dom) {
        if (this.vms[vmid]) {
          var unreaction = this.vms[vmid].unreaction;
          unreaction && unreaction();
          delete this.vms[vmid];
        }

        return;
      }

      var oldChildren = {};
      dom.querySelectorAll('[' + DATAID + ']').forEach(function (d) {
        oldChildren[d.dataset.id] = true;
      });

      _lighterhtml.render.call(this, dom, function () {
        var _this4$vms$vmid = _this4.vms[vmid],
            props = _this4$vms$vmid.props,
            data = _this4$vms$vmid.data,
            cid = _this4$vms$vmid.cid;
        var _components$cid2 = components[cid],
            view = _components$cid2.view,
            state = _components$cid2.state;

        if (!data && state) {
          data = _this4.reactive(vmid);
        }

        $id = vmid;
        return view.call(_this4, props, data);
      });

      dom.querySelectorAll('[' + DATAID + ']').forEach(function (child) {
        var id = child.dataset.id;

        if (oldChildren[id]) {
          // updated
          oldChildren[id] = false;
        } else {// new add component
        }
      }); // clear removed components

      Object.keys(oldChildren).forEach(function (id) {
        if (oldChildren[id]) {
          // removed
          var _unreaction = _this4.vms[id].unreaction;
          _unreaction && _unreaction();
          delete _this4.vms[id];
        }
      });
    }
  }, {
    key: "render",
    value: function render(node) {
      var _this5 = this;

      var vmid = node.dataset.id;
      var _this$vms$vmid3 = this.vms[vmid],
          props = _this$vms$vmid3.props,
          cid = _this$vms$vmid3.cid,
          root = _this$vms$vmid3.root;
      var _components$cid3 = components[cid],
          state = _components$cid3.state,
          view = _components$cid3.view;

      if (state) {
        var data = this.reactive(vmid);

        _lighterhtml.render.call(this, node, function () {
          $id = vmid;
          return view.call(_this5, props, data);
        });
      } else if (root) {
        _lighterhtml.render.call(this, node, function () {
          return view.call(_this5, props, null);
        });
      }

      node.querySelectorAll('[' + DATAID + ']').forEach(function (d) {
        return _this5.render(d);
      });
    }
  }, {
    key: "i18n",
    value: function i18n(trans) {
      var _this6 = this;

      this._translation = trans || {};

      window.t = function (key) {
        var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!(key in _this6._translation)) {
          console.warn("i18n: translation key missing, \"".concat(key, "\" is not found."));
          return key;
        }

        var result = _this6._translation[key].replace(transReg, function (s, v) {
          v = v.trim();
          if (!v) return '';

          if (!(v in param)) {
            console.warn("i18n: param ".concat(v, " is missed for translation ").concat(key, ", ").concat(_this6._translation[key], "."));
            return '';
          }

          return param[v];
        });

        return tagReg.test(result) ? new IH(result) : result;
      };
    }
  }, {
    key: "hotUpdate",
    value: function hotUpdate(cid) {
      var _this7 = this;

      var state = components[cid].state;
      state && Object.keys(this.vms).forEach(function (id) {
        if (!_this7.vms[id]) return;
        if (_this7.vms[id].cid !== cid) return;
        var _this7$vms$id = _this7.vms[id],
            data = _this7$vms$id.data,
            props = _this7$vms$id.props;
        var newState = state(props);
        Object.keys(newState).forEach(function (key) {
          var property = Object.getOwnPropertyDescriptor(newState, key);

          if (typeof property.get !== 'function') {
            if (typeof newState[key] === 'function') {
              var method = newState[key];

              if (key[0] !== '$') {
                newState[key] = (0, _mobx.action)(function () {
                  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    args[_key3] = arguments[_key3];
                  }

                  return method.call.apply(method, [newData].concat(args));
                });
              }
            } else if (data) {
              newState[key] = data[key];
            }
          }
        });
        var newData = (0, _mobx.observable)(newState);

        _this7.reactive(id, newData);

        _this7.update(id);
      });
      Object.keys(this.vms).forEach(function (id) {
        if (!document.querySelector("[data-id=\"".concat(id, "\"]"))) {
          var unreaction = _this7.vms[id].unreaction;
          unreaction && unreaction();
          delete _this7.vms[id];
        }
      });
    }
  }, {
    key: "mount",
    value: function mount(container, rootComponent) {
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }

      var componentIds = Object.keys(components);
      var rootId = 'app-root';

      for (var _i = 0, _componentIds = componentIds; _i < _componentIds.length; _i++) {
        var id = _componentIds[_i];

        if (components[id] === rootComponent) {
          rootId = id;
          break;
        }
      }

      this.i(container.dataset.id = rootId);
      this.vms[_id] = {
        props: null,
        cid: rootId,
        root: true
      };
      this._init = true;
      this.render(container);
      this._init = false;
      return container;
    }
  }]);

  return Context;
}(Runtime);

window.component = function component(id, comp) {
  Object.defineProperty(comp, 'id', {
    value: id
  });
  components[id] = Object.freeze(comp);
  return components[id];
};

window.startApp = function startApp(_ref) {
  var component = _ref.component,
      target = _ref.target,
      i18n = _ref.i18n;
  var context = new Context();

  if (i18n) {
    context.i18n(i18n);
  }

  var container = context.mount(target, component.default || component);
  window.__prerender__ && setTimeout(function () {
    window.__prerender__(container.outerHTML);
  });

  if ("development" === 'development') {
    window.context = context;

    if (module.hot) {
      window.addEventListener('__ssss_hmr__', function (evt) {
        try {
          context.hotUpdate(evt.detail.cid);
        } catch (err) {
          console.warn('hot-reload error: ', err);
          window.location.reload();
        }
      });
    }

    if (undefined) {
      setInterval(function () {
        console.assert(Object.keys(context.vms).length === document.querySelectorAll('[' + DATAID + ']').length);
      }, 10);
    }

    return context;
  }
};
},{"lighterhtml":"../node_modules/lighterhtml/esm/index.js","mobx":"../node_modules/mobx/lib/mobx.module.js","classnames":"../node_modules/classnames/index.js"}],"../src/js/vendor.js":[function(require,module,exports) {
"use strict";

require("normalize.css/normalize.css");

require("main.css/dist/main.css");

var _mobx = require("mobx");

require("../../public/parcel-plugins/runtime");

window.mobx = {
  set: _mobx.set,
  remove: _mobx.remove
};

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
},{"normalize.css/normalize.css":"../node_modules/normalize.css/normalize.css","main.css/dist/main.css":"../node_modules/main.css/dist/main.css","mobx":"../node_modules/mobx/lib/mobx.module.js","../../public/parcel-plugins/runtime":"parcel-plugins/runtime.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59504" + '/');

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