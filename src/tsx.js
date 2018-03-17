const symbol = {
  modules: Symbol('tsx-modules'),
  cache: Symbol('tsx-cache'),
  listener: Symbol('tsx-get-listener'),
  $$listeners: Symbol('tsx-$$listeners'),
  context: Symbol('tsx-context')
}

const clone = (value) => {
  return typeof value == 'object' ? JSON.parse(JSON.stringify(value)) : value
}

const parseName = (name) => {
  const [module, item] = name.split('.')
  return {
    module,
    item
  } 
}

const TSX = {
  [symbol.modules]: {},
  [symbol.cache]: new Map(),

  registerModules(modules = {}, extra = false) {
    Object.keys(modules).forEach(module => {
      this.registerModule(module, modules[module])
    })

    extra && this.openExtra()
  },

  registerModule(module, option) {
    const moduleOption = this[symbol.modules][module] = {
      [symbol.$$listeners]: new Map(), 
      ...option
    }
    const { state, actions } = moduleOption
    const $$listeners = moduleOption[symbol.$$listeners]
    state && Object.keys(state).forEach(item => {
      $$listeners.set(item, new Map())
      this.reactive(module, item, state[item])
    })
    moduleOption[symbol.context] = {
      state: state,
      commit: function(mutation, state) {
        this.mutations[mutation](this.state, state)
      }.bind(moduleOption),
      dispatch: function(action, state) {
        this.actions[action](state)
      }.bind(moduleOption)
    }
    actions && Object.keys(actions).forEach(action => {
      actions[action] = actions[action].bind(moduleOption, moduleOption[symbol.context])
    })
  },

  reactive(module, item, val) {
    const cacheKey = `${module}.${item}`
    this[symbol.cache].set(cacheKey, val)
    const that = this
    Object.defineProperty(this[symbol.modules][module].state, item, {
      configurable: true,
      enumerable: true,
      get() {
        return that[symbol.cache].get(cacheKey)
      },
      set(value) {
        that[symbol.cache].set(cacheKey, value)
        that.notify(module, item, value)
      }
    })
  },

  [symbol.listener](module, item) {
    return this[symbol.modules][module][symbol.$$listeners].get(item)
  },

  notify(module, item, value) {
    const listeners = this[symbol.listener](module, item)
    if (listeners) {
      listeners.forEach(listener => {
        typeof listener == 'function' && listener(clone(value))
      })
    }
  },

  subscribe(module, item, callback) {
    const listeners = this[symbol.listener](module, item)
    listeners.set(callback, callback)
    return () => {
      return listeners.delete(callback)
    }
  },

  mapState(name = '', callback) {
    if (!name || !callback) {
      return
    }
    const { module, item } = parseName(name)
    callback(clone(this[symbol.modules][module]['state'][item]))
    return this.subscribe(module, item, callback)
  },

  mapAction(name = '') {
    if (!name) {
      return
    }
    const { module, item } = parseName(name)
    return (...args) => {
      return this[symbol.modules][module]['actions'][item](...args)
    }
  }
}

TSX.openExtra = function() {
  const check = (scope) => {
    if (!scope || typeof scope.$on != 'function') {
      throw new Error(`mapStateByAutoDestroy的scope参数不是期望的`)
    }
  }

  this.mapStateAuto = function(scope, maps) {
    check(scope)

    const unMapStates = Object.keys(maps).map(each => {
      let map = maps[each]
      if (typeof map == 'string') {
        map = {
          name: map,
          compute(val) {
            return val
          }
        }
      }
      const { name, compute } = map
      return this.mapState(name, (val) => {
        scope[each] = compute(val)
        scope.$applyAsync()
      })
    })
    scope.$on('$destroy', () => {
      unMapStates.forEach(each => each())
    })
  }

  this.mapActionAuto = function(scope, maps) {
    check(scope)

    const upMapActions = Object.keys(maps).map(each => {
      const name = maps[each]
      scope[each] = this.mapAction(name)
      return () => {
        scope[each] = () => {}
      }
    })
    scope.$on('$destroy', () => {
      upMapActions.forEach(each => each())
    })
  }
}.bind(TSX)

export default TSX