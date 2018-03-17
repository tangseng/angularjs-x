import TSX from './tsx'

const symbol = {
  inited: Symbol('$$inited')
}

const KEY_WORDS = [
  '$$data',
  '$$computed',
  '$$watchs',
  '$$methods',
  '$$scopeMethods',
  '$$init',
  '$$watch',
  '$$watchGroup',
  '$$on',
  '$$broadcast',
  '$$emit',
  '$$apply',
  '$$applyAsync',
  '$$render'
]

const checkIsKeyWord = (word) => {
  const check = KEY_WORDS.indexOf(word) != -1
  if (check) {
    throw new Error('错误：实例化TS时使用了关键字"' + word + '". 请勿使用这些关键字：' + KEY_WORDS.toString())
  }
}

class TS {
  constructor(scope, options) {
    this.$$scope = scope
    this.$$options = {
      auto: false, 
      ...options
    }
    this[symbol.inited] = false
    this.$$init()
  }

  $$data(data = {}) {
    Object.keys(data).forEach(item => {
      checkIsKeyWord(item)

      Object.defineProperty(this.$$scope, item, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: data[item],
      })

      Object.defineProperty(this, item, {
        configurable: true,
        enumerable: true,
        get: () => {
          return this.$$scope[item]
        },
        set: (value) => {
          this.$$scope[item] = value
        }
      })
    })
  }

  $$computed(computed = {}) {
    Object.keys(computed).forEach(item => {
      checkIsKeyWord(item)

      let itemComputed = computed[item]
      if (typeof itemComputed == 'string') {
        itemComputed = {
          name: itemComputed,
          compute(val) {
            return val
          }
        }
      }
      const { name, compute } = itemComputed
      Object.defineProperty(this.$$scope, item, {
        configurable: true,
        enumerable: true,
        writable: true
      })
      Object.defineProperty(this, item, {
        configurable: true,
        enumerable: true,
        get: () => {
          return this.$$scope[item]
        },
        set: (value) => {
          this.$$scope[item] = value
        }
      })
      const unMapState = TSX.mapState(name, (value) => {
        this[item] = compute.apply(this, [value])
        this.$$applyAsync()
      })
      this.$$on('$destroy', () => {
        unMapState && unMapState()
      })
    })
  }

  $$watchs(watchs = {}) {
    Object.keys(watchs).forEach(item => {
      if (item.indexOf(',') != -1) {
        this.$$watchGroup(item.split(','), watchs[item])
      } else {
        this.$$watch(item, watchs[item])
      }     
    })
  }

  $$methods(methods = {}) {
    Object.keys(methods).forEach(item => {
      checkIsKeyWord(item)

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

  $$scopeMethods(methods = {}) {
    Object.keys(methods).forEach(item => {
      Object.defineProperty(this.$$scope, item, {
        value: methods[item].bind(this)
      })
    })
  }

  $$init() {
    if (this[symbol.inited]) {
      return
    }
    this[symbol.inited] = true

    let { mixins, data, computed, watchs, methods, scopeMethods, created, destroy } = this.$$options
    if (mixins && Array.isArray(mixins)) {
      let mixinData = {}, mixinComputed = {}, mixinWatchs = {}, mixinMethods = {}, mixinScopeMethods = {}
      mixins = mixins.concat(this.$$options)
      mixins.forEach(item => {
        mixinData = {...mixinData, ...item.data}
        mixinComputed = {...mixinComputed, ...item.computed}
        mixinWatchs = {...mixinWatchs, ...item.watchs}
        mixinMethods = {...mixinMethods, ...item.methods}
        mixinScopeMethods = {...mixinScopeMethods, ...item.scopeMethods}
      })

      this.$$options.mixins = mixins = null

      data = mixinData
      computed = mixinComputed
      watchs = mixinWatchs
      methods = mixinMethods
      scopeMethods = mixinScopeMethods
    }
    data && this.$$data(data)
    computed && this.$$computed(computed)
    watchs && this.$$watchs(watchs)
    methods && this.$$methods(methods)
    scopeMethods && this.$$scopeMethods(scopeMethods)
    
    if (created && typeof created == 'function') {
      created.apply(this)
    }

    this.$$on('$destroy', () => {
      this.$$scope = null
      if (destroy && typeof destroy == 'function') {
        destroy.apply(this)
      }
    })

    this.$$render()
  }

  $$watch(item, cb, deep = false) {
    this.$$scope.$watch(item, cb.bind(this), deep)
  }

  $$watchGroup(item, cb) {
    this.$$scope.$watchGroup(item, cb.bind(this))
  }

  $$on(type, cb) {
    this.$$scope.$on(type, cb.bind(this))
  }

  $$broadcast(type, info) {
    this.$$scope.$broadcast(type, info)
  }

  $$emit(type, info) {
    this.$$scope.$emit(type, info)
  }

  $$apply() {
    this.$$scope.$apply()
  }

  $$applyAsync() {
    this.$$scope.$applyAsync()
  }

  $$render() {
    if (this.$$options.render) {
      this.$$options.render.apply(this)
    }
  }
}

export default TS