import TSX from './tsx'

const symbol = {
  inited: Symbol('$$inited')
}

class TS {
  constructor(scope, options) {
    this.scope = scope
    this.options = Object.assign({
      auto: false
    }, options)
    this[symbol.inited] = false
    this.init()
  }

  data(data = {}) {
    Object.keys(data).forEach(item => {
      Object.defineProperty(this.scope, item, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: data[item],
      })
    })
  }

  computed(computed = {}) {
    if (Array.isArray(computed)) {
      computed = computed.reduce((result, item) => {
        const keyName = item.replace(/\.([a-zA-Z])/, (...args) => {
          return args[1] ? (args[1] + '').toUpperCase() : ''
        })
        result[keyName] = {
          name: item,
          compute(val) {
            return val
          }
        }
        return result
      }, {})
    }
    Object.keys(computed).forEach(item => {
      const { name, compute } = computed[item]
      Object.defineProperty(this.scope, item, {
        configurable: true,
        enumerable: true,
        writable: true
      })
      const callback = (value) => {
        Object.defineProperty(this.scope, item, {
          value: compute.apply(this, [value])
        })
        this.scope.$applyAsync()
      }
      TSX.mapState(name, callback)
      this.scope.$on('$destroy', () => {
        TSX.unsubscribe(name, callback)
      })
    })
  }

  watchs(watchs = {}) {
    Object.keys(watchs).forEach(item => {
      if (item.indexOf(',') != -1) {
        this.watchGroup(item.split(','), watchs[item])
      } else {
        this.watch(item, watchs[item])
      }     
    })
  }

  methods(methods = {}) {
    Object.keys(methods).forEach(item => {
      let method = methods[item]
      if (typeof method == 'string') {
        const name = method
        method = (...args) => {
          return TSX.mapAction(name)(...args)
        }
      } else {
        method = method.bind(this)
      }
      Object.defineProperty(this, item, {
        value: method
      })
    })
  }

  scopeMethods(methods = {}) {
    Object.keys(methods).forEach(item => {
      Object.defineProperty(this.scope, item, {
        value: methods[item].bind(this)
      })
    })
  }

  init() {
    if (this[symbol.inited]) {
      return
    }
    this[symbol.inited] = true

    const { auto, data, computed, computedMore, watchs, methods, scopeMethods, created, destroy } = this.options
    data && this.data(data)
    computed && this.computed(computed)
    computedMore && this.computed(computedMore)
    watchs && this.watchs(watchs)
    methods && this.methods(methods)
    scopeMethods && this.scopeMethods(scopeMethods)
    
    if (created && typeof created == 'function') {
      created.apply(this)
    }

    if (destroy && typeof destroy == 'function') {
      this.scope.$on('$destroy', destroy.bind(this))
    }

    this.scope.$on('$destroy', () => {
      this.scope = null
    })

    auto && this.render()
  }

  watch(item, cb, deep) {
    this.scope.$watch(item, cb.bind(this), deep)
  }

  watchGroup(item, cb) {
    this.scope.$watchGroup(item, cb.bind(this), true)
  }

  on(type, cb) {
    this.scope.$on(type, cb.bind(this))
  }

  broadcast(type, info) {
    this.scope.$broadcast(type, info)
  }

  emit(type, info) {
    this.scope.$emit(type, info)
  }

  render() {
    if (this.options.render) {
      this.options.render.apply(this)
    }
  }
}

export default TS