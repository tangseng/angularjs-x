const symbol = {
  modules: Symbol('tsx-modules'),
  cache: Symbol('tsx-cache'),
  listener: Symbol('tsx-get-listener'),
  $$listeners: Symbol('tsx-$$listeners')
}

const clone = (value) => {
  return typeof value == 'object' ? JSON.parse(JSON.stringify(value)) : value
}

const TSX = {
  [symbol.modules]: {},
  [symbol.cache]: new Map(),

  addModules(modules = {}) {
    Object.keys(modules).forEach(module => {
      this.addModule(module, modules[module])
    })
  },

  addModule(module, option) {
    const moduleOption = this[symbol.modules][module] = Object.assign({
      [symbol.$$listeners]: new Map()
    }, option)
    const { state, actions } = moduleOption
    const $$listeners = moduleOption[symbol.$$listeners]
    state && Object.keys(state).forEach(item => {
      $$listeners.set(item, new Map())
      this.reactive(module, item, state[item])
    })
    actions && Object.keys(actions).forEach(action => {
      actions[action] = actions[action].bind(moduleOption)
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

  _parseName(name) {
    const [module, item] = name.split('.')
    return {
      module,
      item
    } 
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
    this[symbol.listener](module, item).set(callback, callback)
  },

  unsubscribe(name, callback) {
    if (!name || !callback) {
      return
    }
    const { module, item } = this._parseName(name)
    this[symbol.listener](module, item).delete(callback)
  },

  mapState(name = '', callback) {
    if (!name || !callback) {
      return
    }
    const { module, item } = this._parseName(name)
    callback(clone(this[symbol.modules][module]['state'][item]))
    this.subscribe(module, item, callback)
  },

  mapAction(name = '') {
    if (!name) {
      return
    }
    const { module, item } = this._parseName(name)
    return this[symbol.modules][module]['actions'][item]
  }
}

export default TSX

