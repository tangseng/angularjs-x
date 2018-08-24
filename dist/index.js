'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var _TSX;

var symbol = {
  modules: Symbol('tsx-modules'),
  cache: Symbol('tsx-cache'),
  listener: Symbol('tsx-get-listener'),
  $$listeners: Symbol('tsx-$$listeners'),
  context: Symbol('tsx-context')
};

var clone = function clone(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object' ? JSON.parse(JSON.stringify(value)) : value;
};

var parseName = function parseName(name) {
  var _name$split = name.split('.'),
      _name$split2 = slicedToArray(_name$split, 2),
      module = _name$split2[0],
      item = _name$split2[1];

  return {
    module: module,
    item: item
  };
};

var TSX = (_TSX = {}, defineProperty(_TSX, symbol.modules, {}), defineProperty(_TSX, symbol.cache, new Map()), defineProperty(_TSX, 'registerModules', function registerModules() {
  var _this = this;

  var modules = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  Object.keys(modules).forEach(function (module) {
    _this.registerModule(module, modules[module]);
  });

  extra && this.openExtra();
}), defineProperty(_TSX, 'registerModule', function registerModule(module) {
  var _this2 = this;

  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var moduleOption = this[symbol.modules][module] = _extends(defineProperty({}, symbol.$$listeners, new Map()), option);
  var state = moduleOption.state,
      actions = moduleOption.actions;

  var $$listeners = moduleOption[symbol.$$listeners];
  state && Object.keys(state).forEach(function (item) {
    $$listeners.set(item, new Map());
    _this2.reactive(module, item, state[item]);
  });
  moduleOption[symbol.context] = {
    state: state,
    commit: function (mutation, state) {
      this.mutations[mutation](this.state, state);
    }.bind(moduleOption),
    dispatch: function (action, state) {
      this.actions[action](state);
    }.bind(moduleOption)
  };
  actions && Object.keys(actions).forEach(function (action) {
    actions[action] = actions[action].bind(moduleOption, moduleOption[symbol.context]);
  });
}), defineProperty(_TSX, 'reactive', function reactive(module, item, val) {
  var cacheKey = module + '.' + item;
  this[symbol.cache].set(cacheKey, val);
  var that = this;
  Object.defineProperty(this[symbol.modules][module].state, item, {
    configurable: true,
    enumerable: true,
    get: function get$$1() {
      return that[symbol.cache].get(cacheKey);
    },
    set: function set$$1(value) {
      that[symbol.cache].set(cacheKey, value);
      that.notify(module, item, value);
    }
  });
}), defineProperty(_TSX, symbol.listener, function (module, item) {
  return this[symbol.modules][module][symbol.$$listeners].get(item);
}), defineProperty(_TSX, 'notify', function notify(module, item, value) {
  var listeners = this[symbol.listener](module, item);
  if (listeners) {
    listeners.forEach(function (listener) {
      typeof listener == 'function' && listener(clone(value));
    });
  }
}), defineProperty(_TSX, 'subscribe', function subscribe(module, item, callback) {
  var listeners = this[symbol.listener](module, item);
  listeners.set(callback, callback);
  return function () {
    return listeners.delete(callback);
  };
}), defineProperty(_TSX, 'mapState', function mapState() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var callback = arguments[1];

  if (!name || !callback) {
    return;
  }

  var _parseName = parseName(name),
      module = _parseName.module,
      item = _parseName.item;

  callback(clone(this[symbol.modules][module]['state'][item]));
  return this.subscribe(module, item, callback);
}), defineProperty(_TSX, 'mapAction', function mapAction() {
  var _this3 = this;

  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (!name) {
    return;
  }

  var _parseName2 = parseName(name),
      module = _parseName2.module,
      item = _parseName2.item;

  return function () {
    var _symbol$modules$modul;

    return (_symbol$modules$modul = _this3[symbol.modules][module]['actions'])[item].apply(_symbol$modules$modul, arguments);
  };
}), _TSX);

TSX.openExtra = function () {
  var check = function check(scope) {
    if (!scope || typeof scope.$on != 'function') {
      throw new Error('mapStateByAutoDestroy\u7684scope\u53C2\u6570\u4E0D\u662F\u671F\u671B\u7684');
    }
  };

  this.mapStateAuto = function (scope, maps) {
    var _this4 = this;

    check(scope);

    var unMapStates = Object.keys(maps).map(function (each) {
      var map = maps[each];
      if (typeof map == 'string') {
        map = {
          name: map,
          compute: function compute(val) {
            return val;
          }
        };
      }
      var _map = map,
          name = _map.name,
          compute = _map.compute;

      return _this4.mapState(name, function (val) {
        scope[each] = compute(val);
        scope.$applyAsync();
      });
    });
    scope.$on('$destroy', function () {
      unMapStates.forEach(function (each) {
        return each();
      });
    });
  };

  this.mapActionAuto = function (scope, maps) {
    var _this5 = this;

    check(scope);

    var upMapActions = Object.keys(maps).map(function (each) {
      var name = maps[each];
      scope[each] = _this5.mapAction(name);
      return function () {
        scope[each] = function () {};
      };
    });
    scope.$on('$destroy', function () {
      upMapActions.forEach(function (each) {
        return each();
      });
    });
  };
}.bind(TSX);

var symbol$1 = {
  inited: Symbol('$$inited')
};

var KEY_WORDS = ['$$data', '$$computed', '$$watchs', '$$methods', '$$scopeMethods', '$$init', '$$watch', '$$watchGroup', '$$on', '$$broadcast', '$$emit', '$$apply', '$$applyAsync', '$$render'];

var checkIsKeyWord = function checkIsKeyWord(word) {
  var check = KEY_WORDS.indexOf(word) != -1;
  if (check) {
    throw new Error('错误：实例化TS时使用了关键字"' + word + '". 请勿使用这些关键字：' + KEY_WORDS.toString());
  }
};

var TS = function () {
  function TS(scope) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, TS);

    this.$$scope = scope;
    this.$$options = _extends({
      auto: false
    }, options);
    this[symbol$1.inited] = false;
    this.$$init();
  }

  createClass(TS, [{
    key: '$$data',
    value: function $$data() {
      var _this = this;

      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Object.keys(data).forEach(function (item) {
        checkIsKeyWord(item);

        Object.defineProperty(_this.$$scope, item, {
          configurable: true,
          enumerable: true,
          writable: true,
          value: data[item]
        });

        Object.defineProperty(_this, item, {
          configurable: true,
          enumerable: true,
          get: function get$$1() {
            return _this.$$scope[item];
          },
          set: function set$$1(value) {
            _this.$$scope[item] = value;
          }
        });
      });
    }
  }, {
    key: '$$computed',
    value: function $$computed() {
      var _this2 = this;

      var computed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Object.keys(computed).forEach(function (item) {
        checkIsKeyWord(item);

        var itemComputed = computed[item];
        if (typeof itemComputed == 'string') {
          itemComputed = {
            name: itemComputed,
            compute: function compute(val) {
              return val;
            }
          };
        }
        var _itemComputed = itemComputed,
            name = _itemComputed.name,
            compute = _itemComputed.compute;

        Object.defineProperty(_this2.$$scope, item, {
          configurable: true,
          enumerable: true,
          writable: true
        });
        Object.defineProperty(_this2, item, {
          configurable: true,
          enumerable: true,
          get: function get$$1() {
            return _this2.$$scope[item];
          },
          set: function set$$1(value) {
            _this2.$$scope[item] = value;
          }
        });
        var unMapState = TSX.mapState(name, function (value) {
          _this2[item] = compute.apply(_this2, [value]);
          _this2.$$applyAsync();
        });
        _this2.$$on('$destroy', function () {
          unMapState && unMapState();
        });
      });
    }
  }, {
    key: '$$watchs',
    value: function $$watchs() {
      var _this3 = this;

      var watchs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Object.keys(watchs).forEach(function (item) {
        if (item.indexOf(',') != -1) {
          _this3.$$watchGroup(item.split(','), watchs[item]);
        } else {
          _this3.$$watch(item, watchs[item]);
        }
      });
    }
  }, {
    key: '$$methods',
    value: function $$methods() {
      var _this4 = this;

      var methods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Object.keys(methods).forEach(function (item) {
        checkIsKeyWord(item);

        var method = methods[item];
        if (typeof method == 'string') {
          var name = method;
          method = function method() {
            return TSX.mapAction(name).apply(undefined, arguments);
          };
        } else {
          method = method.bind(_this4);
        }
        Object.defineProperty(_this4, item, {
          value: method
        });
      });
    }
  }, {
    key: '$$scopeMethods',
    value: function $$scopeMethods() {
      var _this5 = this;

      var methods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      Object.keys(methods).forEach(function (item) {
        Object.defineProperty(_this5.$$scope, item, {
          value: methods[item].bind(_this5)
        });
      });
    }
  }, {
    key: '$$init',
    value: function $$init() {
      var _this6 = this;

      if (this[symbol$1.inited]) {
        return;
      }
      this[symbol$1.inited] = true;

      var _$$options = this.$$options,
          mixins = _$$options.mixins,
          data = _$$options.data,
          computed = _$$options.computed,
          watchs = _$$options.watchs,
          methods = _$$options.methods,
          scopeMethods = _$$options.scopeMethods,
          created = _$$options.created,
          destroy = _$$options.destroy;

      if (mixins && Array.isArray(mixins)) {
        var mixinData = {},
            mixinComputed = {},
            mixinWatchs = {},
            mixinMethods = {},
            mixinScopeMethods = {};
        mixins = mixins.concat(this.$$options);
        mixins.forEach(function (item) {
          mixinData = _extends({}, mixinData, item.data);
          mixinComputed = _extends({}, mixinComputed, item.computed);
          mixinWatchs = _extends({}, mixinWatchs, item.watchs);
          mixinMethods = _extends({}, mixinMethods, item.methods);
          mixinScopeMethods = _extends({}, mixinScopeMethods, item.scopeMethods);
        });

        this.$$options.mixins = mixins = null;

        data = mixinData;
        computed = mixinComputed;
        watchs = mixinWatchs;
        methods = mixinMethods;
        scopeMethods = mixinScopeMethods;
      }
      data && this.$$data(data);
      computed && this.$$computed(computed);
      watchs && this.$$watchs(watchs);
      methods && this.$$methods(methods);
      scopeMethods && this.$$scopeMethods(scopeMethods);

      if (created && typeof created == 'function') {
        created.apply(this);
      }

      this.$$on('$destroy', function () {
        _this6.$$scope = null;
        if (destroy && typeof destroy == 'function') {
          destroy.apply(_this6);
        }
      });

      this.$$render();
    }
  }, {
    key: '$$watch',
    value: function $$watch(item, cb) {
      var deep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      this.$$scope.$watch(item, cb.bind(this), deep);
    }
  }, {
    key: '$$watchGroup',
    value: function $$watchGroup(item, cb) {
      this.$$scope.$watchGroup(item, cb.bind(this));
    }
  }, {
    key: '$$on',
    value: function $$on(type, cb) {
      this.$$scope.$on(type, cb.bind(this));
    }
  }, {
    key: '$$broadcast',
    value: function $$broadcast(type, info) {
      this.$$scope.$broadcast(type, info);
    }
  }, {
    key: '$$emit',
    value: function $$emit(type, info) {
      this.$$scope.$emit(type, info);
    }
  }, {
    key: '$$apply',
    value: function $$apply() {
      this.$$scope.$apply();
    }
  }, {
    key: '$$applyAsync',
    value: function $$applyAsync() {
      this.$$scope.$applyAsync();
    }
  }, {
    key: '$$render',
    value: function $$render() {
      if (this.$$options.render) {
        this.$$options.render.apply(this);
      }
    }
  }]);
  return TS;
}();

exports.default = TS;
exports.TS = TS;
exports.TSX = TSX;
