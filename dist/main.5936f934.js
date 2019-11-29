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
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"../src/css/main.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"../src/js/zipfile.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = zipFiles;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function Delay() {
  var _this = this;

  this.promise = new Promise(function (resolve, reject) {
    _this.resolve = resolve;
    _this.reject = reject;
  });
}

var filesaver = 'https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js';
var jszip = 'https://cdn.jsdelivr.net/npm/jszip@3.2.2/dist/jszip.min.js';

function loadScript(src) {
  var script = document.createElement('script');
  script.src = src;

  var _ref = new Delay(),
      promise = _ref.promise,
      resolve = _ref.resolve,
      reject = _ref.reject;

  script.onload = resolve;
  script.onerror = reject;
  document.head.appendChild(script);
  return promise;
}

function readFile(_ref2) {
  var file = _ref2.file,
      name = _ref2.name;
  return new Promise(function (resolve) {
    var reader = new window.FileReader();

    reader.onload = function (evt) {
      resolve([name, evt.target.result.split(',')[1]]);
    }; // Read in the image file as a data URL.


    reader.readAsDataURL(file);
  });
}

function zipFiles(files, zipName) {
  var filesContent = Object.keys(files).map(function (name) {
    return readFile(files[name]);
  });
  return Promise.all([window.FileSaver || loadScript(filesaver), window.JSZip || loadScript(jszip)].concat(_toConsumableArray(filesContent))).then(function (contents) {
    var zip = new window.JSZip();
    contents.forEach(function (file) {
      if (Array.isArray(file)) {
        zip.file(file[0], file[1], {
          base64: true
        });
      }
    });
    return zip.generateAsync({
      type: 'blob'
    });
  }).then(function (blob) {
    window.saveAs(blob, zipName);
  });
}
},{}],"../src/js/app.htm":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _zipfile = _interopRequireDefault(require("./zipfile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject12() {
  var data = _taggedTemplateLiteral([" "]);

  _templateObject12 = function _templateObject12() {
    return data;
  };

  return data;
}

function _templateObject11() {
  var data = _taggedTemplateLiteral(["<p>\u8BF7\u9009\u62E9\u8981\u538B\u7F29\u6253\u5305\u7684\u6587\u4EF6\u3002</p>"]);

  _templateObject11 = function _templateObject11() {
    return data;
  };

  return data;
}

function _templateObject10() {
  var data = _taggedTemplateLiteral([" "]);

  _templateObject10 = function _templateObject10() {
    return data;
  };

  return data;
}

function _templateObject9() {
  var data = _taggedTemplateLiteral(["<div>\n    <div>\n      <label>\u4FDD\u5B58\u4E3A\uFF1A</label>\n      <input type=\"text\" value=\"download.zip\" class=\"dist-input\" placeholder=\"\u4FDD\u5B58\u7684\u6587\u4EF6\u540D\">\n    </div>\n    <br>\n    <a href=\"javascript:null\" tabindex=\"-1\" onclick=\"", "\" class=\"download-btn\">\u538B\u7F29\u5E76\u4FDD\u5B58\u8FD9", "\u4E2A\u6587\u4EF6 \uD83D\uDCE5</a>\n  </div>"]);

  _templateObject9 = function _templateObject9() {
    return data;
  };

  return data;
}

function _templateObject8() {
  var data = _taggedTemplateLiteral([" "]);

  _templateObject8 = function _templateObject8() {
    return data;
  };

  return data;
}

function _templateObject7() {
  var data = _taggedTemplateLiteral(["<input type=\"text\" autofocus=\"\" value=\"", "\" class=\"file-name-input\" placeholder=\"\u6587\u4EF6\u540D\">"]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral([" "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["<span>", "</span>"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["<li class=\"file-item\" data-file-name=\"", "\">\n      ", "\n      ", "\n      <span class=\"action-btn\" title=\"\u5220\u9664\" onclick=\"", "\">\u274C</span>\n      <span class=\"action-btn\" title=\"\u547D\u540D\" onclick=\"", "\">\n        ", "\n      </span>\n    </li>"]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([" "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["<a href=\"javascript:0\" onclick=\"", "\" class=\"clear-all-btn\">\u6E05\u9664\u5168\u90E8</a>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["<header>\n  <h1>zip files <span style=\"font-size: 12px;\">\u8FD9\u4E00\u5207\u90FD\u4EC5\u4EC5\u53D1\u751F\u5728\u672C\u673A\uFF0C\u60A8\u7684\u6587\u4EF6\u59CB\u7EC8\u5B89\u5168\uD83D\uDE0A\u3002</span></h1>\n</header>\n<main>\n\n  <div>\n    <input type=\"file\" data-text=\"\u9009 \u62E9 \u6587 \u4EF6 \uD83D\uDCC1\" multiple=\"multiple\" onchange=\"", "\">\n    ", "\n  </div>\n  <ol class=\"file-list\">\n    ", "\n  </ol>\n  ", "\n  ", "\n</main>\n\n<footer> \xA9 ", " tingyuan. Thanks\n  <a href=\"https://github.com/eligrey/FileSaver.js/\" target=\"_blank\" rel=\"noopener noreferrer\">FileSaver.js</a>\n  and\n  <a href=\"https://github.com/Stuk/jszip\" target=\"_blank\" rel=\"noopener noreferrer\">jszip</a>.\n</footer>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _default = component("e283b2a660", {
  state: function state() {
    return {
      files: {},
      renameFile: '',

      get fileList() {
        var _this = this;

        return Object.keys(this.files).map(function (name) {
          return _this.files[name];
        }).sort(function (f1, f2) {
          return f1.index - f2.index;
        });
      },

      onSelectFile: function onSelectFile(evt) {
        var _this2 = this;

        Object.keys(evt.target.files).forEach(function (index) {
          var file = evt.target.files[index];

          if (_this2.files[file.name]) {
            if (!window.confirm("\u6587\u4EF6 ".concat(file.name, " \u5DF2\u7ECF\u5B58\u5728\uFF0C\u8981\u66FF\u6362\u5417\uFF1F"))) return;
          }

          window.mobx.set(_this2.files, file.name, {
            name: file.name,
            file: file,
            index: _this2.fileList.length
          });
        });
      },
      start: function start(evt) {
        var distName = evt.target.parentElement.querySelector('.dist-input').value;

        while (distName === '') {
          distName = window.prompt('保存的文件名称:');
        }

        if (!distName) return; // cancel

        if (!distName.endsWith('.zip')) {
          distName = distName + '.zip';
        }

        (0, _zipfile.default)(this.files, distName).then(function () {}).catch(function (err) {
          window.alert("\u62B1\u6B49\uFF0C\u6253\u5305\u5931\u8D25\u4E86\uFF0C\u53EF\u80FD\u6587\u4EF6\u592A\u5927\u6216\u6587\u4EF6\u540D\u592A\u5947\u602A\u3002".concat(err.message));
        });
      },
      onRemove: function onRemove(evt) {
        var filename = evt.target.parentNode.dataset.fileName;

        if (window.confirm("\u4E0D\u6253\u5305 ".concat(filename, " ?"))) {
          window.mobx.remove(this.files, filename);
        }
      },
      clearAll: function clearAll() {
        if (window.confirm('重新来？')) {
          this.files = {};
        }
      },
      onEdit: function onEdit(evt) {
        var filename = evt.target.parentNode.dataset.fileName;

        if (this.renameFile === filename) {
          // editing
          var input = evt.target.parentElement.querySelector('.file-name-input');
          var newName = input.value.trim();

          if (newName && newName !== filename) {
            if (this.files[newName]) {
              window.alert("\u6587\u4EF6 ".concat(newName, " \u5DF2\u7ECF\u5B58\u5728\uFF0C\u8BF7\u6362\u4E2A\u540D\u5B57\u3002"));
              return;
            }

            var file = this.files[filename];
            file.name = newName;
            window.mobx.set(this.files, newName, file);
            window.mobx.remove(this.files, filename);
          }

          this.renameFile = '';
        } else {
          this.renameFile = filename;
        }
      }
    };
  },
  view: function view(props, state) {
    var _ = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : state;

    return this.h(_templateObject(), _.onSelectFile, _.fileList.length > 1 ? this.h(_templateObject2(), _.clearAll) : this.h(_templateObject3()), _.fileList.map(function (file) {
      return this.h(_templateObject4(), file.name, file.name !== _.renameFile ? this.h(_templateObject5(), file.name) : this.h(_templateObject6()), !(file.name !== _.renameFile) ? this.h(_templateObject7(), file.name) : this.h(_templateObject8()), _.onRemove, _.onEdit, file.name === _.renameFile ? '✔️' : '✍️');
    }, this), _.fileList.length ? this.h(_templateObject9(), _.start, _.fileList.length) : this.h(_templateObject10()), !_.fileList.length ? this.h(_templateObject11()) : this.h(_templateObject12()), new Date().getFullYear());
  }
});
/* hot reload */


exports.default = _default;

if (module.hot) {
  module.hot.accept(function () {
    window.dispatchEvent(new CustomEvent('__ssss_hmr__', {
      detail: {
        cid: 'e283b2a660'
      }
    }));
  });

  var reloadCSS = require('_css_loader');

  module.hot.dispose(reloadCSS);
  module.hot.accept(reloadCSS);
}
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js","./zipfile":"../src/js/zipfile.js"}],"../src/js/main.js":[function(require,module,exports) {
"use strict";

require("../css/main.css");

var _app = _interopRequireDefault(require("./app.htm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.startApp({
  target: '#root',
  component: _app.default
});
},{"../css/main.css":"../src/css/main.css","./app.htm":"../src/js/app.htm"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../src/js/main.js"], null)
//# sourceMappingURL=/main.5936f934.js.map